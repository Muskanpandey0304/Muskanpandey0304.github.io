import { useEffect, useRef } from 'react';
import SectionHeader from '../components/SectionHeader';
import Reveal from '../components/Reveal';
import { certifications, record } from '../content/record';

export default function Record() {
  const list = useRef<HTMLOListElement>(null);

  // The lime line draws down the timeline as it scrolls through the viewport.
  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      el.style.setProperty('--p', '1');
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.7 - r.top) / r.height));
      el.style.setProperty('--p', p.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section id="record" className="section wrap">
      <SectionHeader num="06" title="Track record" />
      <ol className="timeline" ref={list}>
        <span className="timeline__line" aria-hidden="true" />
        {record.map((r) => (
          <Reveal as="li" key={r.title} className={`timeline__item ${r.win ? 'is-win' : ''}`}>
            <span className="timeline__when mono">{r.when}</span>
            <div>
              <h3>
                {r.win && <span aria-hidden="true">🏆 </span>}
                {r.title}
              </h3>
              <p className="mono timeline__org">{r.org}</p>
              <p>{r.text}</p>
            </div>
          </Reveal>
        ))}
      </ol>
      <h3 className="mono certs__title">Certifications</h3>
      <ul className="certs">
        {certifications.map((c) => (
          <li key={c.name} className="cert">
            {c.name} <span className="mono">{c.when}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
