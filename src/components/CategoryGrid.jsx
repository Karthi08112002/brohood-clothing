import { Link } from 'react-router-dom';

const CATEGORY_IMAGE = (name) => `https://placehold.co/700x900/151517/D8B378?text=${encodeURIComponent(name)}&font=raleway`;

export default function CategoryGrid({ categories }) {
  if (!categories?.length) return null;

  return (
    <section className="bh-container py-14 sm:py-20">
      <p className="bh-eyebrow mb-3">Shop by Category</p>
      <h2 className="font-display text-3xl sm:text-4xl mb-9">Find Your Fit</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
        {categories.map((cat) => (
          <Link key={cat.id} to={`/shop?category=${cat.slug}`} className="group relative aspect-[3/4] overflow-hidden bg-bh-ink block">
            <img
              src={CATEGORY_IMAGE(cat.name)}
              alt={cat.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bh-black/90 via-bh-black/10 to-transparent" />
            <span className="absolute bottom-4 left-4 text-sm tracking-[0.08em] uppercase text-bh-white group-hover:text-bh-gold-bright transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
