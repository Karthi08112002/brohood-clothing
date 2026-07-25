import { Link } from 'react-router-dom';

export default function Hero({ banner }) {
  if (!banner) return null;

  return (
    <section className="relative h-[86vh] min-h-[560px] overflow-hidden bg-bh-black">
      <img
        src={banner.image_url}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bh-black via-bh-black/40 to-bh-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-bh-black/70 via-transparent to-transparent" />

      <div className="relative h-full bh-container flex flex-col justify-end pb-20 sm:pb-28">
        <p className="bh-eyebrow mb-5 animate-fadeUp">Autumn / Winter Collection</p>
        <h1 className="font-display text-[13vw] leading-[0.95] sm:text-7xl lg:text-8xl max-w-3xl animate-fadeUp [animation-delay:100ms] [animation-fill-mode:backwards]">
          {banner.title}
        </h1>
        <p className="mt-5 text-bh-white/75 text-base sm:text-lg max-w-md animate-fadeUp [animation-delay:200ms] [animation-fill-mode:backwards]">
          {banner.subtitle}
        </p>
        <div className="mt-9 flex items-center gap-4 animate-fadeUp [animation-delay:300ms] [animation-fill-mode:backwards]">
          <Link to={banner.link_url || '/shop'} className="bh-btn-primary">
            {banner.button_text || 'Shop Now'}
          </Link>
          <Link to="/categories" className="bh-btn-outline">
            Browse Categories
          </Link>
        </div>
      </div>

      <div className="absolute left-0 right-0 bottom-0 h-px bg-gold-fade" />
    </section>
  );
}
