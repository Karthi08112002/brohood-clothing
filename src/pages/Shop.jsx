import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import { getCategories, getShopProducts } from '../lib/api';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function Shop({ wishlist, onToggleWishlist }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [result, setResult] = useState({ items: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters = {
    categorySlug: searchParams.get('category') || null,
    sizes: searchParams.get('sizes')?.split(',').filter(Boolean) || [],
    colors: searchParams.get('colors')?.split(',').filter(Boolean) || [],
    minPrice: searchParams.get('min') ? Number(searchParams.get('min')) : undefined,
    maxPrice: searchParams.get('max') ? Number(searchParams.get('max')) : undefined,
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page') || 1),
  };

  const updateFilters = useCallback(
    (next) => {
      const params = new URLSearchParams();
      if (next.categorySlug) params.set('category', next.categorySlug);
      if (next.sizes?.length) params.set('sizes', next.sizes.join(','));
      if (next.colors?.length) params.set('colors', next.colors.join(','));
      if (next.minPrice) params.set('min', next.minPrice);
      if (next.maxPrice && next.maxPrice !== 10000) params.set('max', next.maxPrice);
      if (next.sort && next.sort !== 'newest') params.set('sort', next.sort);
      params.set('page', '1');
      setSearchParams(params);
    },
    [setSearchParams]
  );

  function goToPage(page) {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    getShopProducts(filters).then((r) => {
      setResult(r);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const activeCategory = categories.find((c) => c.slug === filters.categorySlug);

  return (
    <div>
      <Breadcrumbs trail={[{ label: 'Home', to: '/' }, { label: activeCategory ? activeCategory.name : 'Shop' }]} />

      <div className="bh-container py-8">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl">{activeCategory ? activeCategory.name : 'Shop All'}</h1>
            <p className="text-sm text-bh-grey mt-2">{loading ? 'Loading...' : `${result.total} pieces`}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="lg:hidden bh-btn-outline !px-5 !py-2.5"
              onClick={() => setMobileFiltersOpen(true)}
            >
              Filters
            </button>
            <select
              value={filters.sort}
              onChange={(e) => updateFilters({ ...filters, sort: e.target.value })}
              className="bg-bh-black border border-bh-line text-sm px-3 py-2.5 focus:border-bh-gold outline-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
          <div className="hidden lg:block">
            <FilterSidebar
              categories={categories}
              filters={filters}
              onChange={updateFilters}
              onClear={() => setSearchParams({})}
            />
          </div>

          <div>
            {loading ? (
              <ShopSkeleton />
            ) : result.items.length === 0 ? (
              <EmptyState onClear={() => setSearchParams({})} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-7">
                {result.items.map((p) => (
                  <ProductCard key={p.id} product={p} isWishlisted={wishlist.includes(p.id)} onToggleWishlist={onToggleWishlist} />
                ))}
              </div>
            )}

            <Pagination page={result.page} totalPages={result.totalPages} onChange={goToPage} />
          </div>
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-bh-black border-l border-bh-line p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display text-xl">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters" className="p-2">
                &times;
              </button>
            </div>
            <FilterSidebar
              categories={categories}
              filters={filters}
              onChange={(f) => {
                updateFilters(f);
              }}
              onClear={() => setSearchParams({})}
            />
            <button onClick={() => setMobileFiltersOpen(false)} className="bh-btn-primary w-full mt-8">
              Show {result.total} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ShopSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-7 animate-pulse">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="aspect-[4/5] bg-bh-ink" />
      ))}
    </div>
  );
}

function EmptyState({ onClear }) {
  return (
    <div className="py-24 text-center border border-dashed border-bh-line">
      <p className="font-display text-2xl mb-2">No pieces match those filters</p>
      <p className="text-sm text-bh-grey mb-6">Try widening your size, color, or price range.</p>
      <button onClick={onClear} className="bh-btn-outline">
        Clear Filters
      </button>
    </div>
  );
}
