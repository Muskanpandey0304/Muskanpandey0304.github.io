import { useRef } from 'react';
import SectionHeader from '../components/SectionHeader';
import { toast } from '../components/Toast';
import { profile } from '../content/profile';
import { useLens } from '../hooks/useLens';

export async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email);
    toast('Email copied ✓');
  } catch {
    window.location.href = `mailto:${profile.email}`;
  }
}

export default function Contact() {
  const { lens } = useLens();
  const mail = useRef<HTMLAnchorElement>(null);

  // Magnetic email link: drifts up to 8px toward the pointer (mouse only).
  const onMove = (e: React.PointerEvent) => {
    const a = mail.current;
    if (!a || e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = a.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    a.style.transform = `translate(${dx * 16}px, ${dy * 16}px)`;
  };
  const onLeave = () => {
    if (mail.current) mail.current.style.transform = '';
  };
  const other = lens === 'ml' ? 'data' : 'ml';
  const name = { ml: 'ML Engineer', data: 'Data Analyst' } as const;

  return (
    <section id="contact" className="section wrap">
      <SectionHeader num="08" title="Contact" />
      <div className="contact">
        <div>
          <h2 className="contact__big">
            Let’s build something you can <em>measure.</em>
          </h2>
          <p className="contact__mail">
            <a ref={mail} className="magnet" href={`mailto:${profile.email}`} onPointerMove={onMove} onPointerLeave={onLeave}>
              {profile.email}
            </a>
            <button className="btn" onClick={copyEmail}>
              Copy
            </button>
          </p>
          <div className="hero__cta">
            <a className="btn btn--primary" href={profile.resumes[lens]} download>
              Résumé: {name[lens]} ↓
            </a>
            <a className="btn" href={profile.resumes[other]} download>
              Résumé: {name[other]} ↓
            </a>
            <a className="link" href={profile.github} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
            <a className="link" href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
          </div>
          <p className="mono muted">Based in {profile.location}</p>
        </div>
        <div className="contact__card" aria-hidden="true">
          <div className="screen__bar">
            <i /> <i /> <i />
            <span>~/muskan — contact</span>
          </div>
          <div className="contact__term">
            <div className="tl">
              <span className="tl__p">$ </span>whoami
            </div>
            <div className="tl tl--ok">Muskan Pandey · AI/ML + data</div>
            <div className="tl">
              <span className="tl__p">$ </span>status
            </div>
            <div className="tl tl--ok">open to roles · 2026 grad</div>
            <div className="tl">
              <span className="tl__p">$ </span>mail muskan
            </div>
            <div className="tl tl--out">{profile.email}</div>
            <div className="tl">
              <span className="tl__p">$ </span>
              <span className="tl__caret" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
