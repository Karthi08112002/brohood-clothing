import { Link } from 'react-router-dom';

export default function Breadcrumbs({ trail }) {
  return (
    <nav aria-label="Breadcrumb" className="bh-container pt-6 pb-2">
      <ol className="flex flex-wrap items-center gap-2 text-xs text-bh-grey">
        {trail.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span>/</span>}
            {item.to ? (
              <Link to={item.to} className="hover:text-bh-gold-bright transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-bh-white/70">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
