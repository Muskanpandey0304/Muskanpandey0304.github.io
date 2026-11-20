import { useEffect, useRef } from 'react';

/** Plot-readout cursor (desktop, fine pointer only). It never hides the real cursor. */
export default function Cursor() {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    let label = '';
    let shown = false;

    const set = (t: string) => {
      if (t !== label) {
        label = t;
        node.textContent = t;
      }
    };
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        x = tx;
        y = ty;
        node.classList.add('is-on');
      }
      const t = (e.target as HTMLElement).closest?.('a, button, select, [role="option"]');
      const inDemo = (e.target as HTMLElement).closest?.('.figure');
      if (t && inDemo) set('▶ run');
      else if (t) set('→ open');
      else set(`x ${(tx / innerWidth).toFixed(2)}  y ${(ty / innerHeight).toFixed(2)}`);
    };
    const onLeave = () => {
      shown = false;
      node.classList.remove('is-on');
    };
    const loop = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      node.style.transform = `translate(${x + 14}px, ${y + 14}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('pointermove', onMove);
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <div ref={el} className="cursor mono" aria-hidden="true" />;
}
