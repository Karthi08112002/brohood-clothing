import { useEffect, useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { getCategories } from '../lib/api';

const CATEGORY_IMAGE = (name) => `https://placehold.co/900x600/151517/D8B378?text=${encodeURIComponent(name)}&font=raleway`;

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <div>
      <Breadcrumbs trail={[{ label: 'Home', to: '/' }, { label: 'Categories' }]} />

      <div className="bh-container py-10">
        <p className="bh-eyebrow mb-3">Explore</p>
        <h1 className="font-display text-4xl sm:text-5xl mb-12">All Categories</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {categories.map((cat, i) => (
            <a
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className={`group relative overflow-hidden bg-bh-ink block aspect-[16/10] ${i === 0 ? 'sm:col-span-2 sm:aspect-[32/10]' : ''}`}
            >
              <img
                src={CATEGORY_IMAGE(cat.name)}
                alt={cat.name}
                loading="lazy"
                className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bh-black/85 via-bh-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h2 className="font-display text-2xl sm:text-3xl group-hover:text-bh-gold-bright transition-colors">{cat.name}</h2>
                <span className="text-xs tracking-tag uppercase text-bh-grey mt-2 inline-block">Shop Now &rarr;</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
