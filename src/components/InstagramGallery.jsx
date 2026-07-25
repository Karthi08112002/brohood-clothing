const TILES = Array.from({ length: 6 }).map((_, i) => ({
  id: i,
  image: `https://placehold.co/500x500/0B0B0C/8C7148?text=%40brohood&font=raleway`,
}));

export default function InstagramGallery() {
  return (
    <section className="py-14 sm:py-20">
      <div className="bh-container mb-8 flex items-end justify-between">
        <div>
          <p className="bh-eyebrow mb-3">Styled by You</p>
          <h2 className="font-display text-3xl sm:text-4xl">@brohoodclothings</h2>
        </div>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hidden sm:inline text-xs tracking-tag uppercase text-bh-grey hover:text-bh-gold-bright">
          Follow Us
        </a>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-2">
        {TILES.map((t) => (
          <a key={t.id} href="https://instagram.com" target="_blank" rel="noreferrer" className="group relative aspect-square overflow-hidden block">
            <img src={t.image} alt="Brohood on Instagram" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-bh-gold/0 group-hover:bg-bh-gold/15 transition-colors" />
          </a>
        ))}
      </div>
    </section>
  );
}
