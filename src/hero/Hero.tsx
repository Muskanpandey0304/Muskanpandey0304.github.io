import { profile } from '../content/profile';
import { useLens } from '../hooks/useLens';
import HeroScreen from './HeroScreen';
import SignalField from './SignalField';

export default function Hero() {
  const { lens, copy } = useLens();

  return (
    <section id="top" className="hero">
      <SignalField />
      <div className="wrap hero__inner">
        <div className="hero__text">
          <p className="status">
            <span className="status__dot" aria-hidden="true" />
            {profile.status}
          </p>
          <h1 className="hero__name">
            <span className="hero__line">Muskan</span>
            <span className="hero__line">Pandey</span>
          </h1>
          <p key={`role-${lens}`} className="hero__role swap">
            {copy.role}
          </p>
          <p key={`sub-${lens}`} className="hero__sub swap">
            {copy.sub}
          </p>
          <p className="hero__tag">
            I build AI and data systems, and then I <em>prove</em> they work.
          </p>
          <div className="hero__cta">
            <a className="btn btn--primary" href={copy.cta.href}>
              {copy.cta.label} ↓
            </a>
            <a className="btn" href={profile.resumes[lens]} download>
              Résumé ↓
            </a>
            <a className="link" href={profile.github} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
            <a className="link" href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
          </div>
          <p className="hero__edu mono">{profile.education}</p>
        </div>

        <HeroScreen />
      </div>
    </section>
  );
}
