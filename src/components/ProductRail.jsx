import { useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

export default function ProductRail({ eyebrow, title, viewAllTo, products, wishlist = [], onToggleWishlist }) {
  const scrollerRef = useRef(null);

  function scrollBy(dir) {
    scrollerRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' });
  }

  if (!products?.length) return null;

  return (
    <section className="bh-container py-14 sm:py-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          {eyebrow && <p className="bh-eyebrow mb-3">{eyebrow}</p>}
          <h2 className="font-display text-3xl sm:text-4xl">{title}</h2>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          {viewAllTo && (
            <Link to={viewAllTo} className="text-xs tracking-tag uppercase text-bh-grey hover:text-bh-gold-bright mr-2">
              View All
            </Link>
          )}
          <RailButton dir={-1} onClick={() => scrollBy(-1)} />
          <RailButton dir={1} onClick={() => scrollBy(1)} />
        </div>
      </div>

      <div ref={scrollerRef} className="flex gap-5 sm:gap-6 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((p) => (
          <div key={p.id} className="w-[62vw] sm:w-[300px] shrink-0 snap-start">
            <ProductCard product={p} isWishlisted={wishlist.includes(p.id)} onToggleWishlist={onToggleWishlist} />
          </div>
        ))}
      </div>

      {viewAllTo && (
        <Link to={viewAllTo} className="sm:hidden mt-6 inline-block text-xs tracking-tag uppercase text-bh-gold-bright">
          View All &rarr;
        </Link>
      )}
    </section>
  );
}

function RailButton({ dir, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === -1 ? 'Scroll left' : 'Scroll right'}
      className="w-9 h-9 flex items-center justify-center border border-bh-line hover:border-bh-gold text-bh-white/70 hover:text-bh-gold-bright transition-colors"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        {dir === -1 ? <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
    </button>
  );
}
