export default function Testimonials({ reviews }) {
  if (!reviews?.length) return null;

  return (
    <section className="bg-bh-ivory text-bh-black py-16 sm:py-24">
      <div className="bh-container">
        <p className="bh-eyebrow mb-3 text-bh-gold-dim [&::before]:bg-bh-gold-dim">What Our Customers Say</p>
        <h2 className="font-display text-3xl sm:text-4xl mb-12">Worn &amp; Trusted</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10">
          {reviews.slice(0, 3).map((r) => (
            <figure key={r.id} className="border-t-2 border-bh-black/80 pt-6">
              <div className="text-bh-gold-dim text-sm mb-3">{'\u2605'.repeat(r.rating)}{'\u2606'.repeat(5 - r.rating)}</div>
              <blockquote className="font-display text-lg leading-snug mb-4">&ldquo;{r.title}&rdquo;</blockquote>
              <p className="text-sm text-bh-black/70 leading-relaxed mb-4">{r.comment}</p>
              <figcaption className="text-xs tracking-tag uppercase text-bh-black/50">
                {r.reviewer} {r.is_verified_purchase && <span className="text-bh-gold-dim">&middot; Verified Purchase</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
