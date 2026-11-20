import SectionHeader from '../components/SectionHeader';
import Reveal from '../components/Reveal';
import { principles } from '../content/record';

export default function Principles() {
  return (
    <section id="principles" className="section wrap">
      <SectionHeader num="07" title="How I work" meta="3 principles" />
      <div className="principles">
        {principles.map((p, i) => (
          <Reveal key={p.title} className="principle spot" delay={i * 80}>
            <span className="principle__n" aria-hidden="true">0{i + 1}</span>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
            <p className="mono principle__seen">Seen in: {p.seen}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
