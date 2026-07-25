import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductCard from '../components/ProductCard';
import { searchProducts } from '../lib/api';

export default function SearchResults({ wishlist, onToggleWishlist }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(query);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInputValue(query);
    if (!query) {
      setResults([]);
      return;
    }
    setLoading(true);
    searchProducts(query).then((r) => {
      setResults(r);
      setLoading(false);
    });
  }, [query]);

  function handleSubmit(e) {
    e.preventDefault();
    setSearchParams({ q: inputValue });
  }

  return (
    <div>
      <Breadcrumbs trail={[{ label: 'Home', to: '/' }, { label: 'Search' }]} />

      <div className="bh-container py-8">
        <form onSubmit={handleSubmit} className="max-w-xl mb-4">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search for shirts, jackets, watches..."
            className="bh-input text-lg"
          />
        </form>

        <h1 className="font-display text-3xl sm:text-4xl mb-2">
          {query ? (
            <>
              Results for <span className="text-bh-gold-bright">&ldquo;{query}&rdquo;</span>
            </>
          ) : (
            'Search Brohood'
          )}
        </h1>
        <p className="text-sm text-bh-grey mb-10">
          {query ? (loading ? 'Searching...' : `${results.length} pieces found`) : 'Try "leather jacket", "watch", or "linen shirt".'}
        </p>

        {!loading && query && results.length === 0 && (
          <div className="py-16 text-center border border-dashed border-bh-line">
            <p className="font-display text-2xl mb-2">No matches for &ldquo;{query}&rdquo;</p>
            <p className="text-sm text-bh-grey">Check the spelling or try a different search term.</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} isWishlisted={wishlist.includes(p.id)} onToggleWishlist={onToggleWishlist} />
          ))}
        </div>
      </div>
    </div>
  );
}
