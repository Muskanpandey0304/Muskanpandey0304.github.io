import SectionHeader from '../components/SectionHeader';
import Reveal from '../components/Reveal';
import { moreBuilds } from '../content/projects';

export default function More() {
  return (
    <section id="more" className="section wrap">
      <SectionHeader num="04" title="More builds" meta={`${moreBuilds.length} items`} />
      <ul className="more">
        {moreBuilds.map((m) => (
          <Reveal as="li" key={m.title}>
            {m.href ? (
              <a href={m.href} target="_blank" rel="noreferrer" className="more__row">
                <span className="more__title">{m.title}</span>
                <span className="more__text">{m.text}</span>
                <span className="more__date mono">{m.date}</span>
                <span className="more__arrow" aria-hidden="true">→</span>
              </a>
            ) : (
              <div className="more__row">
                <span className="more__title">{m.title}</span>
                <span className="more__text">{m.text}</span>
                <span className="more__date mono">{m.date}</span>
              </div>
            )}
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
