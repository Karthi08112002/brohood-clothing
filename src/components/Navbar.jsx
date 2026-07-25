import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Shop', to: '/shop' },
  { label: 'Categories', to: '/categories' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar({ cartCount = 0, wishlistCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  function submitSearch(e) {
    e.preventDefault();
    if (!searchValue.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-bh-black/95 backdrop-blur border-b border-bh-line">
      {/* Announcement strip */}
      <div className="overflow-hidden bg-bh-ink border-b border-bh-line">
        <div className="flex whitespace-nowrap py-2 animate-marquee">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0">
              {['FREE SHIPPING OVER \u20B93,000', 'NEW ARRIVALS WEEKLY', 'EST. BROHOOD \u2014 TAILORED IN INDIA', 'CASH ON DELIVERY AVAILABLE'].map((t) => (
                <span key={t} className="mx-8 text-[11px] tracking-tag uppercase text-bh-grey">
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="bh-container flex items-center justify-between h-16 sm:h-20">
        <button
          className="lg:hidden text-bh-white p-2 -ml-2"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <BarsIcon />
        </button>

        <nav className="hidden lg:flex items-center gap-9">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-[13px] tracking-[0.08em] uppercase transition-colors ${
                  isActive ? 'text-bh-gold-bright' : 'text-bh-white/80 hover:text-bh-gold-bright'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/" className="font-display text-2xl sm:text-3xl tracking-wide select-none">
          BROHOOD<span className="text-bh-gold-bright">.</span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-5">
          <button aria-label="Search" className="p-1 hover:text-bh-gold-bright" onClick={() => setSearchOpen((v) => !v)}>
            <SearchIcon />
          </button>
          <Link aria-label="Wishlist" to="/wishlist" className="relative p-1 hover:text-bh-gold-bright hidden sm:inline-flex">
            <HeartIcon />
            {wishlistCount > 0 && <Badge count={wishlistCount} />}
          </Link>
          <Link aria-label="Account" to="/account" className="p-1 hover:text-bh-gold-bright hidden sm:inline-flex">
            <UserIcon />
          </Link>
          <Link aria-label="Cart" to="/cart" className="relative p-1 hover:text-bh-gold-bright">
            <BagIcon />
            {cartCount > 0 && <Badge count={cartCount} />}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-bh-line bg-bh-ink">
          <form onSubmit={submitSearch} className="bh-container py-4 flex items-center gap-3">
            <SearchIcon />
            <input
              autoFocus
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search for shirts, jackets, watches..."
              className="bh-input"
            />
          </form>
        </div>
      )}

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[82%] max-w-xs bg-bh-black border-r border-bh-line p-6 animate-fadeUp">
            <div className="flex items-center justify-between mb-8">
              <span className="font-display text-xl">BROHOOD</span>
              <button aria-label="Close menu" onClick={() => setMenuOpen(false)} className="p-2">
                <CloseIcon />
              </button>
            </div>
            <nav className="flex flex-col gap-6">
              {NAV_LINKS.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} className="text-sm tracking-[0.1em] uppercase text-bh-white/90">
                  {l.label}
                </Link>
              ))}
              <div className="bh-seam pt-6 flex flex-col gap-6">
                <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="text-sm tracking-[0.1em] uppercase text-bh-white/70">
                  Wishlist
                </Link>
                <Link to="/account" onClick={() => setMenuOpen(false)} className="text-sm tracking-[0.1em] uppercase text-bh-white/70">
                  Account
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

function Badge({ count }) {
  return (
    <span className="absolute -top-1.5 -right-1.5 bg-bh-gold text-bh-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
      {count}
    </span>
  );
}

function BarsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 21s-7.5-4.6-10-9.3C.6 8.3 2.3 5 5.7 5c2 0 3.4 1 4.8 2.8C11.9 6 13.3 5 15.3 5c3.4 0 5.1 3.3 3.7 6.7C19.5 16.4 12 21 12 21z" strokeLinejoin="round" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" strokeLinecap="round" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 8h12l1 13H5L6 8z" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 016 0v2" strokeLinecap="round" />
    </svg>
  );
}
