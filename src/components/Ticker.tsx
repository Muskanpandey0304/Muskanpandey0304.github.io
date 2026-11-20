import { ticker } from '../content/proof';

/** Slow marquee of real results. Pauses on hover; static (wrapping) for reduced motion. */
export default function Ticker() {
  const items = [...ticker, ...ticker];
  return (
    <div className="ticker" role="region" aria-label="Selected results">
      <div className="ticker__track">
        {items.map((t, i) => (
          <span key={i} className="ticker__item mono" aria-hidden={i >= ticker.length}>
            <i aria-hidden="true">◆</i>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
