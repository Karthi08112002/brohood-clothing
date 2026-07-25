import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductCard from '../components/ProductCard';
import { getProductBySlug, getRelatedProducts, getReviewsForProduct, formatPrice } from '../lib/api';

export default function ProductDetail({ wishlist, onToggleWishlist, onAddToCart }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const [addedMessage, setAddedMessage] = useState('');

  useEffect(() => {
    setProduct(null);
    setActiveImage(0);
    getProductBySlug(slug).then(async (p) => {
      setProduct(p);
      if (p) {
        setSelectedSize(p.variants?.[0]?.size || null);
        setSelectedColor(p.variants?.[0]?.color || null);
        const [rel, rev] = await Promise.all([getRelatedProducts(p), getReviewsForProduct(p.id)]);
        setRelated(rel);
        setReviews(rev);
      }
    });
    window.scrollTo({ top: 0 });
  }, [slug]);

  const sizes = useMemo(() => [...new Set(product?.variants?.map((v) => v.size))], [product]);
  const colors = useMemo(() => [...new Set(product?.variants?.map((v) => v.color))], [product]);

  const activeVariant = useMemo(
    () => product?.variants?.find((v) => v.size === selectedSize && v.color === selectedColor) || product?.variants?.[0],
    [product, selectedSize, selectedColor]
  );

  if (!product) return <div className="bh-container py-32 text-center text-bh-grey">Loading...</div>;

  const onSale = product.discount_price != null && product.discount_price < product.price;
  const stockStatus = activeVariant?.stock_status || 'in_stock';
  const isOutOfStock = stockStatus === 'out_of_stock';

  function handleAddToCart(buyNow = false) {
    if (isOutOfStock) return;
    onAddToCart?.({ product, variant: activeVariant, quantity });
    if (buyNow) {
      navigate('/checkout');
    } else {
      setAddedMessage('Added to cart');
      setTimeout(() => setAddedMessage(''), 2000);
    }
  }

  const deliveryDate = new Date(Date.now() + 5 * 24 * 3600 * 1000).toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div>
      <Breadcrumbs
        trail={[
          { label: 'Home', to: '/' },
          { label: 'Shop', to: '/shop' },
          { label: product.name },
        ]}
      />

      <div className="bh-container py-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <div>
          <div
            className={`relative aspect-[4/5] bg-bh-ink overflow-hidden cursor-zoom-in ${zoomed ? 'cursor-zoom-out' : ''}`}
            onClick={() => setZoomed((z) => !z)}
          >
            <img
              src={product.images?.[activeImage] || product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-300 ${zoomed ? 'scale-[1.8]' : 'scale-100'}`}
            />
            {onSale && <span className="bh-tag">Sale</span>}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3 mt-4">
              {product.images.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 overflow-hidden border-2 shrink-0 ${
                    activeImage === i ? 'border-bh-gold' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="bh-eyebrow mb-4">{product.material}</p>
          <h1 className="font-display text-3xl sm:text-4xl leading-tight">{product.name}</h1>

          {product.avg_rating > 0 && (
            <div className="flex items-center gap-2 mt-3 text-sm text-bh-grey">
              <span className="text-bh-gold-bright">{'\u2605'.repeat(Math.round(product.avg_rating))}{'\u2606'.repeat(5 - Math.round(product.avg_rating))}</span>
              <span>{product.avg_rating.toFixed(1)} ({product.review_count} reviews)</span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mt-6">
            {onSale ? (
              <>
                <span className="text-2xl font-semibold text-bh-gold-bright">{formatPrice(product.discount_price)}</span>
                <span className="text-lg text-bh-grey line-through">{formatPrice(product.price)}</span>
                <span className="text-xs text-bh-gold-bright border border-bh-gold/40 px-2 py-0.5">
                  {Math.round((1 - product.discount_price / product.price) * 100)}% OFF
                </span>
              </>
            ) : (
              <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
            )}
          </div>
          <p className="text-xs text-bh-grey mt-1">Inclusive of {product.tax_percent}% tax</p>

          <p className="text-sm text-bh-white/70 leading-relaxed mt-6 max-w-md">{product.description}</p>

          {/* Color selector */}
          {colors.length > 0 && (
            <div className="mt-8">
              <h4 className="text-sm font-semibold mb-3">Color: <span className="text-bh-grey font-normal">{selectedColor}</span></h4>
              <div className="flex gap-3">
                {colors.map((color) => {
                  const variant = product.variants.find((v) => v.color === color);
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-bh-gold-bright scale-110' : 'border-bh-line'}`}
                      style={{ backgroundColor: variant?.color_hex || '#333' }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Size selector */}
          {sizes.length > 0 && (
            <div className="mt-7">
              <h4 className="text-sm font-semibold mb-3">Size</h4>
              <div className="flex flex-wrap gap-2.5">
                {sizes.map((size) => {
                  const variant = product.variants.find((v) => v.size === size && v.color === selectedColor) || product.variants.find((v) => v.size === size);
                  const disabled = variant?.stock_status === 'out_of_stock';
                  return (
                    <button
                      key={size}
                      disabled={disabled}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[46px] px-3 py-2.5 text-sm border transition-colors ${
                        disabled
                          ? 'border-bh-line text-bh-grey/40 line-through cursor-not-allowed'
                          : selectedSize === size
                          ? 'border-bh-gold bg-bh-gold text-bh-black'
                          : 'border-bh-line hover:border-bh-gold'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock status */}
          <div className="mt-6 text-sm">
            {stockStatus === 'in_stock' && <span className="text-emerald-400">In Stock</span>}
            {stockStatus === 'low_stock' && <span className="text-bh-gold-bright">Only {activeVariant.stock_quantity} left \u2014 low stock</span>}
            {stockStatus === 'out_of_stock' && <span className="text-red-400">Out of Stock</span>}
          </div>

          {/* Delivery estimate */}
          <div className="mt-3 text-sm text-bh-grey flex items-center gap-2">
            <TruckIcon />
            Estimated delivery by <span className="text-bh-white/85">{deliveryDate}</span>
          </div>

          {/* Quantity + actions */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-bh-line">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-10 h-11 text-lg" aria-label="Decrease quantity">
                &minus;
              </button>
              <span className="w-10 text-center">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="w-10 h-11 text-lg" aria-label="Increase quantity">
                +
              </button>
            </div>
            <button
              onClick={() => onToggleWishlist?.(product)}
              aria-label="Add to wishlist"
              className={`w-11 h-11 flex items-center justify-center border shrink-0 ${
                wishlist?.includes(product.id) ? 'border-bh-gold bg-bh-gold text-bh-black' : 'border-bh-line hover:border-bh-gold'
              }`}
            >
              <HeartIcon />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button disabled={isOutOfStock} onClick={() => handleAddToCart(false)} className="bh-btn-outline flex-1 disabled:opacity-40 disabled:cursor-not-allowed">
              {addedMessage || 'Add to Cart'}
            </button>
            <button disabled={isOutOfStock} onClick={() => handleAddToCart(true)} className="bh-btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed">
              Buy Now
            </button>
          </div>

          <ShareRow />
        </div>
      </div>

      {/* Reviews */}
      <div className="bh-container py-16 bh-seam">
        <h2 className="font-display text-2xl sm:text-3xl mt-10 mb-8">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-bh-grey">No reviews yet for this piece.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {reviews.map((r) => (
              <div key={r.id} className="border-t border-bh-line pt-5">
                <div className="text-bh-gold-bright text-sm mb-2">{'\u2605'.repeat(r.rating)}{'\u2606'.repeat(5 - r.rating)}</div>
                <p className="font-semibold text-sm mb-1">{r.title}</p>
                <p className="text-sm text-bh-white/70 leading-relaxed">{r.comment}</p>
                <p className="text-xs text-bh-grey mt-3">
                  {r.reviewer || 'Verified Customer'} {r.is_verified_purchase && <span className="text-bh-gold-dim">&middot; Verified Purchase</span>}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="bh-container py-8 bh-seam">
          <h2 className="font-display text-2xl sm:text-3xl mt-10 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-7">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} isWishlisted={wishlist?.includes(p.id)} onToggleWishlist={onToggleWishlist} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ShareRow() {
  return (
    <div className="flex items-center gap-4 mt-8 text-xs tracking-tag uppercase text-bh-grey">
      <span>Share</span>
      <a href="#" className="hover:text-bh-gold-bright">WhatsApp</a>
      <a href="#" className="hover:text-bh-gold-bright">Email</a>
      <a href="#" className="hover:text-bh-gold-bright">Copy Link</a>
    </div>
  );
}

function TruckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 7h13v10H2z" />
      <path d="M15 10h4l3 3v4h-7z" />
      <circle cx="7" cy="19" r="1.6" />
      <circle cx="17.5" cy="19" r="1.6" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 21s-7.5-4.6-10-9.3C.6 8.3 2.3 5 5.7 5c2 0 3.4 1 4.8 2.8C11.9 6 13.3 5 15.3 5c3.4 0 5.1 3.3 3.7 6.7C19.5 16.4 12 21 12 21z" />
    </svg>
  );
}
