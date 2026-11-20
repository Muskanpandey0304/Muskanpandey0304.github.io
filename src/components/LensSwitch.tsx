import { useRef } from 'react';
import { lensCopy, type Lens } from '../content/lens';
import { useLens } from '../hooks/useLens';

const LENSES: Lens[] = ['ml', 'data'];

export default function LensSwitch() {
  const { lens, setLens } = useLens();
  const refs = useRef<Record<Lens, HTMLButtonElement | null>>({ ml: null, data: null });

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const next = lens === 'ml' ? 'data' : 'ml';
      setLens(next);
      refs.current[next]?.focus();
    }
  };

  return (
    <div className="lens" role="radiogroup" aria-label="Portfolio lens" data-active={lens} onKeyDown={onKey}>
      <span className="lens__pill" aria-hidden="true" />
      {LENSES.map((l) => (
        <button
          key={l}
          ref={(el) => (refs.current[l] = el)}
          role="radio"
          aria-checked={lens === l}
          tabIndex={lens === l ? 0 : -1}
          className="lens__opt"
          onClick={() => setLens(l)}
        >
          <span className="lens__long">{lensCopy[l].label}</span>
          <span className="lens__short">{lensCopy[l].short}</span>
        </button>
      ))}
    </div>
  );
}
