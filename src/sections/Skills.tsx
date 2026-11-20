import { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import Reveal from '../components/Reveal';
import { caseStudies } from '../content/projects';
import { alsoFamiliar, skillGroups } from '../content/skills';
import type { ProjectId } from '../content/lens';
import { useLens } from '../hooks/useLens';

export default function Skills() {
  const { copy } = useLens();
  const [active, setActive] = useState<ProjectId[] | null>(null);
  const groups = copy.skillOrder.map((id) => skillGroups.find((g) => g.id === id)!);

  return (
    <section id="skills" className="section wrap">
      <SectionHeader num="05" title="Toolkit" meta="linked to evidence" />
      <p className="skills__hint mono" aria-live="polite">
        {active && active.length ? `used in → ${active.map((p) => caseStudies[p].title).join(' · ')}` : 'Hover a skill to see where it was used.'}
      </p>
      <div className="skills">
        {groups.map((g) => (
          <Reveal key={g.id} className="skills__group">
            <h3 className="mono">{g.label}</h3>
            <ul>
              {g.skills.map((s) => {
                const dim = active !== null && !(active.length && s.usedIn.some((u) => active.includes(u)));
                const proven = s.usedIn.length > 0;
                return (
                  <li key={s.name}>
                    <button
                      className={`chip ${proven ? '' : 'chip--quiet'} ${dim ? 'is-dim' : ''}`}
                      onMouseEnter={() => setActive(s.usedIn)}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive(s.usedIn)}
                      onBlur={() => setActive(null)}
                      onClick={() => s.usedIn[0] && document.getElementById(s.usedIn[0])?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      {s.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        ))}
      </div>
      <p className="skills__also mono">Also familiar with: {alsoFamiliar.join(' · ')}</p>
    </section>
  );
}
