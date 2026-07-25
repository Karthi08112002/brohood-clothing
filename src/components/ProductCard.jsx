import { Link } from 'react-router-dom';
import { useState } from 'react';
import { formatPrice } from '../lib/api';

export default function ProductCard({ product, onToggleWishlist, isWishlisted = false }) {
  const [hovered, setHovered] = useState(false);
  const onSale = product.discount_price != null && product.discount_price < product.price;
  const totalStock = (product.variants || []).reduce((sum, v) => sum + (v.stock_quantity || 0), 0);
  const isOutOfStock = product.variants?.length > 0 && totalStock === 0;
  const secondImage = product.images?.[1];

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/product/${product.slug}`} className="block relative overflow-hidden bg-bh-ink aspect-[4/5]">
        <img
          src={hovered && secondImage ? secondImage : product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {onSale && <span className="bh-tag">Sale</span>}
        {isOutOfStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-bh-black/60">
            <span className="text-[11px] tracking-tag uppercase text-bh-white/90 border border-bh-white/40 px-3 py-1.5">
              Out of Stock
            </span>
          </span>
        )}
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.preventDefault();
            onToggleWishlist?.(product);
          }}
          className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center border transition-colors ${
            isWishlisted ? 'bg-bh-gold border-bh-gold text-bh-black' : 'bg-bh-black/60 border-bh-white/30 text-bh-white hover:border-bh-gold'
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
            <path d="M12 21s-7.5-4.6-10-9.3C.6 8.3 2.3 5 5.7 5c2 0 3.4 1 4.8 2.8C11.9 6 13.3 5 15.3 5c3.4 0 5.1 3.3 3.7 6.7C19.5 16.4 12 21 12 21z" strokeLinejoin="round" />
          </svg>
        </button>
      </Link>

      <div className="pt-3.5">
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-sm text-bh-white/95 leading-snug hover:text-bh-gold-bright transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1.5 flex items-center gap-2">
          {onSale ? (
            <>
              <span className="text-bh-gold-bright text-sm font-semibold">{formatPrice(product.discount_price)}</span>
              <span className="text-bh-grey text-xs line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-bh-white/90 text-sm font-semibold">{formatPrice(product.price)}</span>
          )}
        </div>
        {product.avg_rating > 0 && (
          <div className="mt-1 flex items-center gap-1 text-[11px] text-bh-grey">
            <span className="text-bh-gold-bright">&#9733;</span>
            {product.avg_rating.toFixed(1)}
            <span>({product.review_count})</span>
          </div>
        )}
      </div>
    </div>
  );
}
