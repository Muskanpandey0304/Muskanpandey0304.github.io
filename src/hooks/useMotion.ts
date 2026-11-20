import { useEffect, useRef, useState, type RefObject } from 'react';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/** True once the element has entered the viewport. `once` keeps it true afterwards. */
export function useInView<T extends Element>(opts: { once?: boolean; margin?: string; threshold?: number } = {}): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const { once = true, margin = '0px 0px -10% 0px', threshold = 0.1 } = opts;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { rootMargin: margin, threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, margin, threshold]);
  return [ref as RefObject<T>, inView];
}
