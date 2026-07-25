import { formatPrice } from '../lib/api';

export default function PriceRangeSlider({ min, max, value, onChange }) {
  const [lo, hi] = value;

  function handleLo(e) {
    const next = Math.min(Number(e.target.value), hi - 100);
    onChange([next, hi]);
  }
  function handleHi(e) {
    const next = Math.max(Number(e.target.value), lo + 100);
    onChange([lo, next]);
  }

  const loPct = ((lo - min) / (max - min)) * 100;
  const hiPct = ((hi - min) / (max - min)) * 100;

  return (
    <div>
      <div className="relative h-1 bg-bh-line mt-3">
        <div
          className="absolute h-1 bg-bh-gold"
          style={{ left: `${loPct}%`, right: `${100 - hiPct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={100}
          value={lo}
          onChange={handleLo}
          aria-label="Minimum price"
          className="bh-range-thumb absolute inset-0 w-full appearance-none bg-transparent pointer-events-none"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={100}
          value={hi}
          onChange={handleHi}
          aria-label="Maximum price"
          className="bh-range-thumb absolute inset-0 w-full appearance-none bg-transparent pointer-events-none"
        />
      </div>
      <div className="flex justify-between mt-4 text-xs text-bh-grey">
        <span>{formatPrice(lo)}</span>
        <span>{formatPrice(hi)}</span>
      </div>
      <style>{`
        .bh-range-thumb::-webkit-slider-thumb {
          pointer-events: all;
          appearance: none;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #D8B378;
          border: 2px solid #0B0B0C;
          cursor: pointer;
        }
        .bh-range-thumb::-moz-range-thumb {
          pointer-events: all;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: #D8B378;
          border: 2px solid #0B0B0C;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
