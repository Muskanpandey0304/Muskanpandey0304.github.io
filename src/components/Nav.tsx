import { useEffect, useState } from 'react';
import type { Theme } from '../hooks/useTheme';
import LensSwitch from './LensSwitch';

const LINKS = [
  ['Work', '#work'],
  ['Skills', '#skills'],
  ['Record', '#record'],
  ['Contact', '#contact']
];

type Props = { theme: Theme; onTheme: () => void; onPalette: () => void };

export default function Nav({ theme, onTheme, onPalette }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > last && y > 240);
      last = y;
    };
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  // Highlight the nav link for the section currently in view.
  useEffect(() => {
    const ids = LINKS.map(([, h]) => h.slice(1));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    const onTop = () => scrollY < 200 && setActive('');
    window.addEventListener('scroll', onTop, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onTop);
    };
  }, []);

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${hidden && !open ? 'is-hidden' : ''}`}>
      <a href="#top" className="nav__logo" aria-label="Muskan Pandey, home">
        <span className="nav__mark">MP</span>
      </a>
      <nav className={`nav__links ${open ? 'is-open' : ''}`} aria-label="Sections">
        {LINKS.map(([l, h]) => (
          <a key={h} href={h} className={active === h.slice(1) ? 'is-active' : ''} aria-current={active === h.slice(1) ? 'true' : undefined} onClick={() => setOpen(false)}>
            {l}
          </a>
        ))}
      </nav>
      <div className="nav__right">
        <span className="nav__view mono" aria-hidden="true">View as</span>
        <LensSwitch />
        <button className="icon-btn mono" onClick={onPalette} aria-label="Open command palette">
          ⌘K
        </button>
        <button className="icon-btn" onClick={onTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
          {theme === 'dark' ? '☾' : '☀'}
        </button>
        <button className="icon-btn nav__burger" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Menu">
          ☰
        </button>
      </div>
    </header>
  );
}
