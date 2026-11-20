import { useCallback, useEffect, useRef, useState } from 'react';
import { terminalScripts, type TermLine } from '../content/terminal';
import { useLens } from '../hooks/useLens';
import { useReducedMotion } from '../hooks/useMotion';

const TYPE_MS = 26;
const LINE_MS = 120;
const HOLD_MS = 2600;
const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

const CHIPS = {
  ml: [
    { big: '6.6×', small: 'faster prefill vs vLLM', pos: 'a' },
    { big: '100% → 5%', small: 'prompt-injection success', pos: 'b' },
    { big: '0.93', small: 'held-out hit@5', pos: 'c' }
  ],
  data: [
    { big: '100k', small: 'orders analysed', pos: 'a' },
    { big: '20', small: 'data-quality tests', pos: 'b' },
    { big: 'R$1.5M', small: 'upper-bound opportunity', pos: 'c' }
  ]
} as const;

/** The hero centrepiece: a glowing, mouse-tilting terminal monitor that types real results. */
export default function HeroScreen() {
  const { lens } = useLens();
  const reduced = useReducedMotion();
  const card = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState<TermLine[]>([]);
  const [partial, setPartial] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  pausedRef.current = paused || !visible;
  const bodyRef = useRef<HTMLDivElement>(null);

  // pause while off-screen / tab hidden
  useEffect(() => {
    const el = card.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  // typing loop, restarts on lens change
  useEffect(() => {
    const script = terminalScripts[lens];
    if (reduced) {
      setDone(script);
      setPartial(null);
      return;
    }
    let cancelled = false;
    const wait = async () => {
      while (pausedRef.current && !cancelled) await sleep(200);
    };
    (async () => {
      setDone([]);
      setPartial(null);
      while (!cancelled) {
        for (const line of script) {
          if (cancelled) return;
          await wait();
          if (line.kind === 'cmd') {
            setTyping(true);
            for (let i = 1; i <= line.text.length; i++) {
              if (cancelled) return;
              await wait();
              setPartial(line.text.slice(0, i));
              await sleep(TYPE_MS);
            }
            setTyping(false);
            setPartial(null);
            setDone((d) => [...d, line]);
            await sleep(LINE_MS * 2);
          } else {
            setDone((d) => [...d, line]);
            await sleep(LINE_MS);
          }
        }
        await sleep(HOLD_MS);
        if (cancelled) return;
        setDone([]);
        await sleep(300);
      }
    })();
    return () => {
      cancelled = true;
      setTyping(false);
    };
  }, [lens, reduced]);

  // 3D tilt toward the pointer (mouse only)
  const onMove = useCallback(
    (e: React.PointerEvent) => {
      const el = card.current;
      if (!el || reduced || e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / innerWidth;
      const y = (e.clientY - (r.top + r.height / 2)) / innerHeight;
      el.style.setProperty('--ry', String(Math.max(-1, Math.min(1, x * 2.2))));
      el.style.setProperty('--rx', String(Math.max(-1, Math.min(1, y * 2.2))));
    },
    [reduced]
  );
  const onLeave = () => {
    card.current?.style.setProperty('--ry', '0');
    card.current?.style.setProperty('--rx', '0');
  };

  const goToDemo = () => {
    document.querySelector(lens === 'ml' ? '#turingserve' : '#olist')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <div className={`screen ${typing ? 'is-typing' : ''}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="screen__aurora" aria-hidden="true" />
      <div ref={card} className="screen__tilt">
        <div className="screen__card" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onClick={goToDemo} role="img" aria-label="Live terminal showing Muskan's benchmark results">
          <div className="screen__bar">
            <i /> <i /> <i />
            <span>~/muskan — {lens === 'ml' ? 'bench' : 'olist'}</span>
            <b className="screen__live mono">● live</b>
          </div>
          <div ref={bodyRef} className="screen__body" aria-hidden="true">
            {done.map((l, i) => (
              <div key={i} className={`tl tl--${l.kind}`}>
                {l.kind === 'cmd' && <span className="tl__p">$ </span>}
                {l.text}
              </div>
            ))}
            {partial !== null ? (
              <div className="tl tl--cmd">
                <span className="tl__p">$ </span>
                {partial}
                <span className="tl__caret" />
              </div>
            ) : (
              <div className="tl tl--cmd">
                <span className="tl__p">$ </span>
                <span className="tl__caret" />
              </div>
            )}
          </div>
        </div>
        {CHIPS[lens].map((c, i) => (
          <div key={`${lens}-${c.big}`} className={`chipf chipf--${c.pos}`} style={{ animationDelay: `${i * 0.7}s` }} aria-hidden="true">
            <b>{c.big}</b>
            <span className="mono">{c.small}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
