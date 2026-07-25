import { Link } from 'react-router-dom';
import Newsletter from './Newsletter';

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'New Arrivals', to: '/shop?collection=new_arrivals' },
      { label: 'Best Sellers', to: '/shop?collection=best_sellers' },
      { label: 'Flash Sale', to: '/shop?collection=sale' },
      { label: 'All Categories', to: '/categories' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact Us', to: '/contact' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Shipping Policy', to: '/shipping-policy' },
      { label: 'Return Policy', to: '/return-policy' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms & Conditions', to: '/terms' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-bh-ink border-t border-bh-line mt-24">
      <div className="bh-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-12">
          <div>
            <Link to="/" className="font-display text-2xl tracking-wide">
              BROHOOD<span className="text-bh-gold-bright">.</span>
            </Link>
            <p className="mt-4 text-sm text-bh-grey max-w-xs leading-relaxed">
              Tailored menswear cut in black, white and gold. Built for the wardrobe you'll still be
              wearing in ten years.
            </p>
            <div className="flex gap-4 mt-6">
              {['Instagram', 'WhatsApp', 'X'].map((s) => (
                <a key={s} href="#" aria-label={s} className="text-bh-grey hover:text-bh-gold-bright text-xs tracking-tag uppercase border border-bh-line px-3 py-2">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="bh-eyebrow mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-bh-white/70 hover:text-bh-gold-bright transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bh-seam mt-14 pt-10">
          <Newsletter compact />
        </div>

        <div className="bh-seam mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-bh-grey">
          <span>&copy; {new Date().getFullYear()} Brohood Clothings. All rights reserved.</span>
          <span>Crafted in India &middot; Ships worldwide</span>
        </div>
      </div>
    </footer>
  );
}
