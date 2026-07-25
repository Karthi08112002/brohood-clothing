import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

function getTimeLeft(target) {
  const diff = Math.max(0, target - Date.now());
  return {
    h: Math.floor(diff / 3_600_000),
    m: Math.floor((diff % 3_600_000) / 60_000),
    s: Math.floor((diff % 60_000) / 1000),
  };
}

export default function FlashSale({ products, wishlist = [], onToggleWishlist }) {
  const [endsAt] = useState(() => Date.now() + 1000 * 60 * 60 * 26); // demo: ~26h out
  const [time, setTime] = useState(() => getTimeLeft(endsAt));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(endsAt)), 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  if (!products?.length) return null;

  return (
    <section className="bg-bh-ink border-y border-bh-line py-14 sm:py-20">
      <div className="bh-container">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-9">
          <div>
            <p className="bh-eyebrow mb-3">Limited Time</p>
            <h2 className="font-display text-3xl sm:text-4xl">Flash Sale</h2>
          </div>
          <div className="flex items-center gap-2">
            {[['H', time.h], ['M', time.m], ['S', time.s]].map(([label, val]) => (
              <div key={label} className="flex flex-col items-center bg-bh-black border border-bh-line px-3.5 py-2 min-w-[54px]">
                <span className="font-display text-xl text-bh-gold-bright tabular-nums">{String(val).padStart(2, '0')}</span>
                <span className="text-[10px] tracking-tag text-bh-grey">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} isWishlisted={wishlist.includes(p.id)} onToggleWishlist={onToggleWishlist} />
          ))}
        </div>

        <div className="mt-9 text-center">
          <Link to="/shop?collection=sale" className="bh-btn-outline">
            Shop All Sale Items
          </Link>
        </div>
      </div>
    </section>
  );
}
