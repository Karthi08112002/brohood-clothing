import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import ProductRail from '../components/ProductRail';
import CategoryGrid from '../components/CategoryGrid';
import FlashSale from '../components/FlashSale';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';
import InstagramGallery from '../components/InstagramGallery';
import {
  getHomepageBanners,
  getCategories,
  getFeaturedProducts,
  getNewArrivals,
  getTrendingProducts,
  getBestSellers,
  getFlashSaleProducts,
} from '../lib/api';
import { reviews as mockReviews } from '../data/mockData';

export default function Home({ wishlist, onToggleWishlist }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let alive = true;
    Promise.all([
      getHomepageBanners(),
      getCategories(),
      getFeaturedProducts(),
      getNewArrivals(),
      getTrendingProducts(),
      getBestSellers(),
      getFlashSaleProducts(),
    ]).then(([banners, categories, featured, newArrivals, trending, bestSellers, flashSale]) => {
      if (!alive) return;
      setData({ banners, categories, featured, newArrivals, trending, bestSellers, flashSale });
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!data) return <HomeSkeleton />;

  return (
    <div>
      <Hero banner={data.banners[0]} />

      <ProductRail
        eyebrow="Curated for You"
        title="Featured Collection"
        viewAllTo="/shop?collection=featured"
        products={data.featured}
        wishlist={wishlist}
        onToggleWishlist={onToggleWishlist}
      />

      <div className="bh-container bh-seam" />

      <ProductRail
        eyebrow="Just Landed"
        title="New Arrivals"
        viewAllTo="/shop?collection=new_arrivals"
        products={data.newArrivals}
        wishlist={wishlist}
        onToggleWishlist={onToggleWishlist}
      />

      <CategoryGrid categories={data.categories} />

      <ProductRail
        eyebrow="What's Hot"
        title="Trending Now"
        viewAllTo="/shop?collection=trending"
        products={data.trending}
        wishlist={wishlist}
        onToggleWishlist={onToggleWishlist}
      />

      <FlashSale products={data.flashSale} wishlist={wishlist} onToggleWishlist={onToggleWishlist} />

      <ProductRail
        eyebrow="Customer Favorites"
        title="Best Sellers"
        viewAllTo="/shop?collection=best_sellers"
        products={data.bestSellers}
        wishlist={wishlist}
        onToggleWishlist={onToggleWishlist}
      />

      <Testimonials reviews={mockReviews} />
      <Newsletter />
      <InstagramGallery />
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="bh-container py-24 animate-pulse">
      <div className="h-[50vh] bg-bh-ink mb-16" />
      <div className="grid grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] bg-bh-ink" />
        ))}
      </div>
    </div>
  );
}
