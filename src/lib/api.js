import { supabase, isSupabaseConfigured } from './supabaseClient';
import {
  products as mockProducts,
  categories as mockCategories,
  collections as mockCollectionIds,
  reviews as mockReviews,
  storeSettings as mockSettings,
  homepageBanners as mockBanners,
} from '../data/mockData';

// ---------------------------------------------------------------------
// Every exported function below has the same shape:
//   1. If Supabase is configured, run the real query against the schema
//      defined in brohood_schema.sql.
//   2. Otherwise (or if the query errors), fall back to local demo data
//      filtered/sorted the same way, so the UI is identical either way.
// ---------------------------------------------------------------------

const PRODUCT_SELECT = `
  *,
  category:categories(id, name, slug),
  images:product_images(image_url, alt_text, display_order, is_primary),
  variants:product_variants(id, size, color, color_hex, stock_quantity, low_stock_threshold, stock_status)
`;

function normalizeSupabaseProduct(row) {
  const primaryImage = row.images?.find((i) => i.is_primary) || row.images?.[0];
  return {
    ...row,
    image: primaryImage?.image_url,
    images: (row.images || []).sort((a, b) => a.display_order - b.display_order).map((i) => i.image_url),
  };
}

export async function getCategories() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    if (!error) return data;
  }
  return mockCategories;
}

async function getByCollection(collectionType, limit = 8) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('product_collections')
      .select(`product:products!inner(${PRODUCT_SELECT})`)
      .eq('collections.type', collectionType)
      .limit(limit);
    if (!error) return data.map((row) => normalizeSupabaseProduct(row.product));
  }
  const collectionId = mockCollectionIds[collectionType];
  return mockProducts.filter((p) => p.collections.includes(collectionId)).slice(0, limit);
}

export const getFeaturedProducts = (limit = 8) => getByCollection('featured', limit).then((r) =>
  r.length ? r : mockProducts.filter((p) => p.is_featured).slice(0, limit)
);
export const getNewArrivals = (limit = 8) => getByCollection('new_arrivals', limit);
export const getTrendingProducts = (limit = 8) => getByCollection('trending', limit);
export const getBestSellers = (limit = 8) => getByCollection('best_sellers', limit);
export const getFlashSaleProducts = (limit = 8) => getByCollection('sale', limit);

export async function getProductBySlug(slug) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('slug', slug)
      .single();
    if (!error && data) return normalizeSupabaseProduct(data);
  }
  return mockProducts.find((p) => p.slug === slug) || null;
}

export async function getRelatedProducts(product, limit = 4) {
  if (!product) return [];
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('category_id', product.category_id)
      .neq('id', product.id)
      .limit(limit);
    if (!error) return data.map(normalizeSupabaseProduct);
  }
  return mockProducts.filter((p) => p.category_id === product.category_id && p.id !== product.id).slice(0, limit);
}

export async function getReviewsForProduct(productId) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });
    if (!error) return data;
  }
  return mockReviews.filter((r) => r.product_id === productId);
}

// Shop listing: filters = { categorySlug, sizes[], colors[], minPrice, maxPrice, sort, page, perPage }
export async function getShopProducts(filters = {}) {
  const { categorySlug, sizes = [], colors = [], minPrice, maxPrice, sort = 'newest', page = 1, perPage = 9 } = filters;

  let list;
  if (isSupabaseConfigured) {
    let query = supabase.from('products').select(PRODUCT_SELECT, { count: 'exact' }).eq('status', 'active');
    if (categorySlug) {
      const { data: cat } = await supabase.from('categories').select('id').eq('slug', categorySlug).single();
      if (cat) query = query.eq('category_id', cat.id);
    }
    if (minPrice != null) query = query.gte('price', minPrice);
    if (maxPrice != null) query = query.lte('price', maxPrice);
    const { data, error } = await query;
    if (!error) list = data.map(normalizeSupabaseProduct);
  }
  if (!list) {
    list = mockProducts.slice();
    if (categorySlug) {
      const cat = mockCategories.find((c) => c.slug === categorySlug);
      if (cat) list = list.filter((p) => p.category_id === cat.id);
    }
    if (minPrice != null) list = list.filter((p) => (p.discount_price ?? p.price) >= minPrice);
    if (maxPrice != null) list = list.filter((p) => (p.discount_price ?? p.price) <= maxPrice);
  }

  if (sizes.length) list = list.filter((p) => p.variants?.some((v) => sizes.includes(v.size)));
  if (colors.length) list = list.filter((p) => p.variants?.some((v) => colors.includes(v.color)));

  switch (sort) {
    case 'price_asc':
      list = list.sort((a, b) => (a.discount_price ?? a.price) - (b.discount_price ?? b.price));
      break;
    case 'price_desc':
      list = list.sort((a, b) => (b.discount_price ?? b.price) - (a.discount_price ?? a.price));
      break;
    case 'rating':
      list = list.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
      break;
    default:
      break; // 'newest' — keep insertion order (created_at desc in a real query)
  }

  const total = list.length;
  const start = (page - 1) * perPage;
  const pageItems = list.slice(start, start + perPage);

  return { items: pageItems, total, page, perPage, totalPages: Math.max(1, Math.ceil(total / perPage)) };
}

export async function searchProducts(query, limit = 20) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .textSearch('name', q, { type: 'websearch' })
      .limit(limit);
    if (!error) return data.map(normalizeSupabaseProduct);
  }
  return mockProducts
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.material.toLowerCase().includes(q)
    )
    .slice(0, limit);
}

// Lightweight name-only suggestions for the search-bar autocomplete
export async function getSearchSuggestions(query, limit = 6) {
  const results = await searchProducts(query, limit);
  return results.map((p) => ({ id: p.id, name: p.name, slug: p.slug, image: p.image, price: p.discount_price ?? p.price }));
}

export async function getStoreSettings() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('store_settings').select('*').eq('id', 1).single();
    if (!error) return data;
  }
  return mockSettings;
}

export async function getHomepageBanners() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('homepage_banners')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    if (!error) return data;
  }
  return mockBanners;
}

export async function subscribeToNewsletter(email) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('newsletter_subscribers').insert({ email });
    if (error) throw error;
    return true;
  }
  // Demo mode: simulate success so the UI flow is fully testable.
  await new Promise((r) => setTimeout(r, 400));
  return true;
}

export function formatPrice(amount, currencySymbol = '\u20B9') {
  if (amount == null) return '';
  return `${currencySymbol}${Number(amount).toLocaleString('en-IN')}`;
}
