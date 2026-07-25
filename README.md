# Brohood Clothings — Frontend (Build Pass 1)

React + Vite + Tailwind storefront wired to the Supabase schema in
`brohood_schema.sql`. Ships with local demo data so it runs immediately,
even before Supabase is connected.

## What's included in this pass

- Homepage: hero banner, Featured Collection, New Arrivals, Category grid,
  Trending, Flash Sale (with live countdown), Best Sellers, Customer
  Reviews, Newsletter signup, Instagram gallery
- Shop page: category / size / color / price filters, sorting, pagination,
  responsive filter drawer on mobile
- Categories page
- Product Detail page: image gallery with click-to-zoom, color + size
  selectors that respect per-variant stock, live stock-status label,
  delivery estimate, quantity picker, Add to Cart / Buy Now / Wishlist,
  reviews, related products, share row
- Search Results page with live query sync
- Wishlist and Cart state (persisted to the browser, not yet a full
  Cart/Checkout UI — see "Next build pass" below)

## Run it locally

```bash
npm install
cp .env.example .env   # optional — see below
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

### Connecting to Supabase (optional for now)

The site works out of the box on local demo data (`src/data/mockData.js`),
which mirrors the seed rows in `brohood_schema.sql` exactly. To connect a
real backend:

1. Create a Supabase project and run `brohood_schema.sql` in its SQL editor.
2. Copy your project URL and anon public key into `.env`:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
3. Restart `npm run dev`. Every function in `src/lib/api.js` automatically
   switches from demo data to live Supabase queries — no other code changes
   needed.

## Project structure

```
src/
  lib/
    supabaseClient.js   # detects whether real credentials are present
    api.js              # every data function: Supabase query + demo fallback
  data/
    mockData.js          # demo data, mirrors brohood_schema.sql seed rows
  components/             # Navbar, Footer, ProductCard, ProductRail, Hero,
                           # CategoryGrid, FlashSale, Testimonials, Newsletter,
                           # InstagramGallery, FilterSidebar, PriceRangeSlider,
                           # Pagination, Breadcrumbs
  pages/
    Home.jsx
    Shop.jsx
    Categories.jsx
    ProductDetail.jsx
    SearchResults.jsx
  App.jsx                 # routes + lifted cart/wishlist state
```

## Design system

- **Palette:** near-black `#0B0B0C` base, ivory `#F6F3EC` secondary surface,
  antique gold `#B8935A` / bright gold `#D8B378` accent — deliberately muted
  rather than a bright yellow-gold, to read as tailoring, not costume jewelry.
- **Type:** `Fraunces` (display serif) for headings, `Manrope` (grotesk) for
  body/UI, wide-tracked uppercase "eyebrow" labels for section labels — a
  menswear-editorial convention.
- **Signature motif:** a tailor's-tag language throughout — hairline dashed
  "seam" dividers between sections, a rotated hang-tag badge on sale items,
  and an eyebrow label with a short gold dash instead of a bullet.

## Next build pass (not yet built)

Per the original brief, still to come: Cart page, Checkout flow, Login /
Register / Forgot Password, User Dashboard (orders, addresses, saved
wishlist), Order Confirmation, About/Contact/FAQ/legal pages, and the full
Admin Panel. All routes for these already exist in `App.jsx` pointed at a
placeholder page, so nothing in the nav or footer 404s in the meantime.
