import PriceRangeSlider from './PriceRangeSlider';

const SIZES = ['S', 'M', 'L', 'XL', '32', '34', 'One Size'];
const COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Navy', hex: '#1A1A2E' },
  { name: 'Charcoal', hex: '#36454F' },
  { name: 'Slate', hex: '#708090' },
  { name: 'Stone', hex: '#8D8471' },
  { name: 'Brown', hex: '#5C4033' },
];

export default function FilterSidebar({ categories, filters, onChange, onClear }) {
  function toggleInArray(key, value) {
    const current = filters[key] || [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onChange({ ...filters, [key]: next });
  }

  return (
    <aside className="space-y-10">
      <div className="flex items-center justify-between">
        <h3 className="bh-eyebrow">Filters</h3>
        <button onClick={onClear} className="text-xs text-bh-grey hover:text-bh-gold-bright underline underline-offset-2">
          Clear all
        </button>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-4">Category</h4>
        <div className="space-y-2.5">
          <FilterRadio
            label="All"
            checked={!filters.categorySlug}
            onChange={() => onChange({ ...filters, categorySlug: null })}
          />
          {categories.map((c) => (
            <FilterRadio
              key={c.id}
              label={c.name}
              checked={filters.categorySlug === c.slug}
              onChange={() => onChange({ ...filters, categorySlug: c.slug })}
            />
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-4">Size</h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggleInArray('sizes', s)}
              className={`px-3 py-1.5 text-xs border transition-colors ${
                filters.sizes?.includes(s) ? 'border-bh-gold text-bh-gold-bright bg-bh-gold/10' : 'border-bh-line text-bh-white/70 hover:border-bh-gold'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-4">Color</h4>
        <div className="flex flex-wrap gap-3">
          {COLORS.map((c) => (
            <button
              key={c.name}
              aria-label={c.name}
              title={c.name}
              onClick={() => toggleInArray('colors', c.name)}
              className={`w-7 h-7 rounded-full border-2 transition-transform ${
                filters.colors?.includes(c.name) ? 'border-bh-gold-bright scale-110' : 'border-bh-line'
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-4">Price Range</h4>
        <PriceRangeSlider
          min={0}
          max={10000}
          value={[filters.minPrice ?? 0, filters.maxPrice ?? 10000]}
          onChange={([minPrice, maxPrice]) => onChange({ ...filters, minPrice, maxPrice })}
        />
      </div>
    </aside>
  );
}

function FilterRadio({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer text-sm">
      <span
        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
          checked ? 'border-bh-gold-bright' : 'border-bh-white/30'
        }`}
      >
        {checked && <span className="w-1.5 h-1.5 rounded-full bg-bh-gold-bright" />}
      </span>
      <input type="radio" className="sr-only" checked={checked} onChange={onChange} />
      <span className={checked ? 'text-bh-gold-bright' : 'text-bh-white/75'}>{label}</span>
    </label>
  );
}
