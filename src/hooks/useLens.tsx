import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { lensCopy, type Lens } from '../content/lens';

type Ctx = { lens: Lens; setLens: (l: Lens) => void; copy: (typeof lensCopy)[Lens] };
const LensContext = createContext<Ctx | null>(null);

const isLens = (v: unknown): v is Lens => v === 'ml' || v === 'data';

function initialLens(): Lens {
  try {
    const q = new URLSearchParams(window.location.search).get('lens');
    if (isLens(q)) return q;
  } catch {
    /* ignore */
  }
  try {
    const s = localStorage.getItem('lens');
    if (isLens(s)) return s;
  } catch {
    /* storage unavailable */
  }
  return 'ml';
}

export function LensProvider({ children }: { children: ReactNode }) {
  const [lens, setLensState] = useState<Lens>(initialLens);

  const setLens = useCallback((l: Lens) => setLensState(l), []);

  useEffect(() => {
    document.documentElement.dataset.lens = lens;
    document.title = lensCopy[lens].title;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('lens', lens);
      window.history.replaceState(null, '', url);
    } catch {
      /* ignore */
    }
    try {
      localStorage.setItem('lens', lens);
    } catch {
      /* ignore */
    }
  }, [lens]);

  const value = useMemo(() => ({ lens, setLens, copy: lensCopy[lens] }), [lens, setLens]);
  return <LensContext.Provider value={value}>{children}</LensContext.Provider>;
}

export function useLens() {
  const c = useContext(LensContext);
  if (!c) throw new Error('useLens must be used inside <LensProvider>');
  return c;
}
