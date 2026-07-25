export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav className="flex items-center justify-center gap-2 mt-14" aria-label="Pagination">
      <PageButton disabled={page === 1} onClick={() => onChange(page - 1)} label="Previous">
        &larr;
      </PageButton>

      {pages.map((p, i) => {
        const prev = pages[i - 1];
        const showEllipsis = prev && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-2">
            {showEllipsis && <span className="text-bh-grey px-1">&hellip;</span>}
            <PageButton active={p === page} onClick={() => onChange(p)} label={`Page ${p}`}>
              {p}
            </PageButton>
          </span>
        );
      })}

      <PageButton disabled={page === totalPages} onClick={() => onChange(page + 1)} label="Next">
        &rarr;
      </PageButton>
    </nav>
  );
}

function PageButton({ children, active, disabled, onClick, label }) {
  return (
    <button
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`w-9 h-9 flex items-center justify-center text-sm border transition-colors ${
        active
          ? 'border-bh-gold bg-bh-gold text-bh-black'
          : disabled
          ? 'border-bh-line text-bh-grey/40 cursor-not-allowed'
          : 'border-bh-line text-bh-white/75 hover:border-bh-gold hover:text-bh-gold-bright'
      }`}
    >
      {children}
    </button>
  );
}
