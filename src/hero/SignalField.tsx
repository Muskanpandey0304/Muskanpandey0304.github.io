import { useEffect, useRef } from 'react';
import { useLens } from '../hooks/useLens';
import { useReducedMotion } from '../hooks/useMotion';
import type { Lens } from '../content/lens';

type P = { x: number; y: number; vx: number; vy: number; tx: number; ty: number; hot: boolean; r: number };

// Deterministic pseudo-random so the layout doesn't change between renders.
const rnd = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const gauss = (n: number) => (rnd(n) + rnd(n + 91) + rnd(n + 173) - 1.5) * 1.3;

const BARS = [0.28, 0.42, 0.36, 0.58, 0.5, 0.72, 0.64, 0.86, 0.78, 0.95, 0.88, 0.7];

function targetFor(lens: Lens, i: number, n: number, w: number, h: number): [number, number] {
  const top = h * 0.3;
  const bottom = h * 0.92;
  const span = bottom - top;
  if (lens === 'ml') {
    // a noisy learning curve: signal rises, scatter shrinks as it converges
    const t = i / n;
    const x = w * (0.06 + 0.9 * t);
    const curve = 1 - Math.exp(-3.2 * t);
    const y = bottom - span * (0.12 + 0.78 * curve) + gauss(i) * span * (0.14 - 0.1 * t);
    return [x, y];
  }
  // data lens: points pack into a bar chart
  const col = i % BARS.length;
  const colW = (w * 0.9) / BARS.length;
  const x = w * 0.05 + col * colW + colW * 0.14 + rnd(i * 3.1) * colW * 0.72;
  const hh = span * BARS[col];
  const y = bottom - rnd(i * 7.7) * hh;
  return [x, y];
}

/** Noise -> signal particle field behind the hero. 2D canvas, pauses off-screen, static for reduced motion. */
export default function SignalField() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { lens } = useLens();
  const reduced = useReducedMotion();
  const lensRef = useRef<Lens>(lens);
  const retarget = useRef<(l: Lens) => void>(() => {});

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let visible = true;
    const mouse = { x: -9999, y: -9999 };
    const small = window.innerWidth < 720;
    const N = small ? 380 : 900;
    const pts: P[] = [];
    const colors = () => {
      const cs = getComputedStyle(document.documentElement);
      return { signal: cs.getPropertyValue('--signal').trim() || '#c8f560', info: cs.getPropertyValue('--info').trim() || '#5ee0ff', ink: cs.getPropertyValue('--ink-3').trim() || '#6b6a66' };
    };
    let col = colors();

    const setTargets = (l: Lens) => {
      pts.forEach((p, i) => {
        const [tx, ty] = targetFor(l, i, N, w, h);
        p.tx = tx;
        p.ty = ty;
      });
    };

    const resize = () => {
      const r = cv.getBoundingClientRect();
      w = r.width;
      h = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!pts.length) {
        for (let i = 0; i < N; i++) {
          pts.push({ x: rnd(i) * w, y: rnd(i + 500) * h, vx: 0, vy: 0, tx: 0, ty: 0, hot: rnd(i * 5) < 0.12, r: 0.8 + rnd(i * 9) * 1.2 });
        }
      }
      setTargets(lensRef.current);
      if (reduced) pts.forEach((p) => ((p.x = p.tx), (p.y = p.ty)));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const R = 120;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        if (!reduced) {
          p.vx += (p.tx - p.x) * 0.012;
          p.vy += (p.ty - p.y) * 0.012;
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / R) * 2.4;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
          p.vx *= 0.86;
          p.vy *= 0.86;
          p.x += p.vx;
          p.y += p.vy;
        }
        ctx.globalAlpha = p.hot ? 0.8 : 0.28;
        ctx.fillStyle = p.hot ? (i % 3 === 0 ? col.info : col.signal) : col.ink;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.2832);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    if (reduced) draw();
    else start();

    retarget.current = (l) => {
      lensRef.current = l;
      setTargets(l);
      if (reduced) {
        pts.forEach((p) => ((p.x = p.tx), (p.y = p.ty)));
        draw();
      }
      col = colors();
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw();
    });
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !document.hidden) start();
      else stop();
    });
    io.observe(cv);
    const onVis = () => (document.hidden ? stop() : visible && start());
    document.addEventListener('visibilitychange', onVis);
    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };
    window.addEventListener('pointermove', onMove);
    document.documentElement.addEventListener('pointerleave', onLeave);
    const themeObs = new MutationObserver(() => {
      col = colors();
      if (reduced) draw();
    });
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      themeObs.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced]);

  useEffect(() => {
    retarget.current(lens);
  }, [lens]);

  return <canvas ref={canvas} className="signal-field" aria-hidden="true" />;
}
