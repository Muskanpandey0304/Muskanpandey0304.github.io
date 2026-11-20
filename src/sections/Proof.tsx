import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import SectionHeader from '../components/SectionHeader';
import CountUp from '../components/CountUp';
import Reveal from '../components/Reveal';
import { proofs, type Proof as ProofT } from '../content/proof';
import { useLens } from '../hooks/useLens';
import { useInView } from '../hooks/useMotion';

function Visual({ p, on }: { p: ProofT; on: boolean }) {
  switch (p.visual) {
    case 'race':
      return (
        <div className="pv pv--race" aria-hidden="true">
          <div className="pv__row">
            <span className="mono">TuringServe</span>
            <i className="pv__bar pv__bar--us" style={{ width: on ? '15.3%' : '0%' }} />
            <b className="mono">1.7 s</b>
          </div>
          <div className="pv__row">
            <span className="mono">vLLM</span>
            <i className="pv__bar pv__bar--them" style={{ width: on ? '100%' : '0%' }} />
            <b className="mono">11.1 s</b>
          </div>
        </div>
      );
    case 'attack':
      return (
        <div className="pv pv--race" aria-hidden="true">
          <div className="pv__row">
            <span className="mono">no guards</span>
            <i className="pv__bar pv__bar--them" style={{ width: on ? '100%' : '0%' }} />
            <b className="mono">100%</b>
          </div>
          <div className="pv__row">
            <span className="mono">guards on</span>
            <i className="pv__bar pv__bar--us" style={{ width: on ? '5%' : '0%' }} />
            <b className="mono">5%</b>
          </div>
        </div>
      );
    case 'ring': {
      const C = 2 * Math.PI * 34;
      return (
        <svg className="pv pv--ring" viewBox="0 0 80 80" aria-hidden="true">
          <circle cx="40" cy="40" r="34" className="pv__track" />
          <circle cx="40" cy="40" r="34" className="pv__arc" strokeDasharray={C} strokeDashoffset={on ? C * (1 - 0.93) : C} transform="rotate(-90 40 40)" />
          <text x="40" y="45" textAnchor="middle" className="pv__ringtxt">
            93%
          </text>
        </svg>
      );
    }
    case 'dots':
      return (
        <div className="pv pv--dots" aria-hidden="true">
          {Array.from({ length: 100 }, (_, i) => (
            <i key={i} className={on ? 'on' : ''} style={{ transitionDelay: `${i * 9}ms` }} />
          ))}
        </div>
      );
    case 'ticks':
      return (
        <div className="pv pv--ticks" aria-hidden="true">
          {Array.from({ length: 20 }, (_, i) => (
            <i key={i} className={on ? 'on' : ''} style={{ transitionDelay: `${i * 45}ms` }} />
          ))}
        </div>
      );
    case 'years':
      return (
        <div className="pv pv--years" aria-hidden="true">
          {['2024', '2025'].map((y, i) => (
            <span key={y} className={`mono ${on ? 'on' : ''}`} style={{ transitionDelay: `${i * 250}ms` }}>
              {y}
            </span>
          ))}
        </div>
      );
  }
}

function Tile({ p, i }: { p: ProofT; i: number }) {
  const [ref, on] = useInView<HTMLDivElement>({ threshold: 0.35 });
  return (
    <Reveal className={`proof__card bento-${i}`} delay={i * 60}>
      <a ref={ref as never} href={`#${p.target}`} data-id={p.id} className="spot">
        <span className="proof__kicker mono">{p.kicker}</span>
        <div className="proof__main">
          <div className={`proof__num ${p.custom ? 'proof__num--pair' : ''}`}>
            {p.custom === 'attack' ? (
              <>
                <s className="proof__before">100%</s> → <span className="proof__after">5%</span>
              </>
            ) : (
              <CountUp to={p.value} decimals={p.decimals} suffix={p.suffix} />
            )}
          </div>
          <Visual p={p} on={on} />
        </div>
        <p>{p.caption}</p>
        <span className="proof__more mono">→ see the proof</span>
      </a>
    </Reveal>
  );
}

export default function Proof() {
  const { lens, copy } = useLens();
  const ordered = copy.proofOrder.map((id) => proofs.find((p) => p.id === id)!);
  const grid = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  // When the lens re-orders the tiles, replay a quick staggered entrance.
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const root = grid.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tiles = root.querySelectorAll<HTMLElement>('a[data-id]');
    gsap.fromTo(tiles, { opacity: 0, y: 14, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out', stagger: 0.06, clearProps: 'all' });
  }, [lens]);

  return (
    <section id="proof" className="section wrap">
      <SectionHeader num="02" title="Receipts" meta="6 numbers" />
      <p className="proof__lede">Every number below has a test, a benchmark or a statistic behind it. Click any tile to see how it was measured.</p>
      <div className="proof" ref={grid}>
        {ordered.map((p, i) => (
          <Tile key={p.id} p={p} i={i} />
        ))}
      </div>
    </section>
  );
}
