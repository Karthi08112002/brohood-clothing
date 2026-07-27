import { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Categories from './pages/Categories';
import ProductDetail from './pages/ProductDetail';
import SearchResults from './pages/SearchResults';

import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import Admin from './pages/Admin';

function useLocalStorageState(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* storage unavailable — state still works for this session */
    }
  }, [key, state]);
  return [state, setState];
}

export default function App() {
  const [wishlistIds, setWishlistIds] = useLocalStorageState('bh_wishlist', []);
  const [cart, setCart] = useLocalStorageState('bh_cart', []);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  function toggleWishlist(product) {
    setWishlistIds((prev) => (prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id]));
  }

  function addToCart({ product, variant, quantity }) {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.productId === product.id && item.variantId === variant?.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = { ...next[existingIndex], quantity: next[existingIndex].quantity + quantity };
        return next;
      }
      return [
        ...prev,
        {
          productId: product.id,
          variantId: variant?.id,
          name: product.name,
          image: product.image,
          price: product.discount_price ?? product.price,
          size: variant?.size,
          color: variant?.color,
          quantity,
        },
      ];
    });
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-bh-black text-bh-white font-sans">
      <Navbar cartCount={cartCount} wishlistCount={wishlistIds.length} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home wishlist={wishlistIds} onToggleWishlist={toggleWishlist} />} />
          <Route path="/shop" element={<Shop wishlist={wishlistIds} onToggleWishlist={toggleWishlist} />} />
          <Route path="/categories" element={<Categories />} />
          <Route
            path="/product/:slug"
            element={<ProductDetail wishlist={wishlistIds} onToggleWishlist={toggleWishlist} onAddToCart={addToCart} />}
          />
          <Route path="/search" element={<SearchResults wishlist={wishlistIds} onToggleWishlist={toggleWishlist} />} />

          {/* Pages beyond this first build pass — routed to a shared "coming soon"
              placeholder so nothing in the nav or footer 404s. Replace each with
              the pages listed in the original brief (Cart, Checkout, Auth,
              Dashboard, legal pages, etc.) in the next build pass. */}
          {['/cart', '/checkout', '/wishlist', '/account', '/login', '/register', '/about', '/contact', '/faq', '/shipping-policy', '/return-policy', '/privacy-policy', '/terms'].map((path) => (
            <Route key={path} path={path} element={<ComingSoon path={path} />} />
          ))}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function ComingSoon({ path }) {
  const title = path.replace('/', '').replace(/-/g, ' ');
  return (
    <div className="bh-container py-32 text-center">
      <p className="bh-eyebrow mb-4 justify-center">Building Next</p>
      <h1 className="font-display text-4xl capitalize">{title}</h1>
      <p className="text-sm text-bh-grey mt-4 max-w-md mx-auto">
        This page is next on the build list. Homepage and core shop pages are wired up first.
      </p>
      <Link to="/shop" className="bh-btn-outline mt-8 inline-flex">
        Continue Shopping
      </Link>
    </div>
  );
}

function NotFound() {
  return (
    <div className="bh-container py-32 text-center">
      <p className="font-display text-8xl text-bh-gold-bright">404</p>
      <h1 className="font-display text-3xl mt-4">This piece isn't in the collection.</h1>
      <Link to="/" className="bh-btn-primary mt-8 inline-flex">
        Back to Home
      </Link>
    </div>
  );
}
