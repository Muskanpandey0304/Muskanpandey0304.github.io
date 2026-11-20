import { useCallback, useEffect, useState } from 'react';
import Lenis from 'lenis';
import Cursor from './components/Cursor';
import ScrollProgress from './components/ScrollProgress';
import Ticker from './components/Ticker';
import CommandPalette from './components/CommandPalette';
import Nav from './components/Nav';
import Toast from './components/Toast';
import Hero from './hero/Hero';
import { LensProvider } from './hooks/useLens';
import { useTheme } from './hooks/useTheme';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import More from './sections/More';
import Principles from './sections/Principles';
import Proof from './sections/Proof';
import Record from './sections/Record';
import Skills from './sections/Skills';
import Work from './sections/Work';

export default function App() {
  const { theme, setTheme, toggle } = useTheme();
  const [palette, setPalette] = useState(false);
  const closePalette = useCallback(() => setPalette(false), []);

  // Smooth scroll (disabled for reduced motion). Anchors go through Lenis when it is active.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.1 });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = a?.getAttribute('href');
      if (!a || !hash || hash === '#') return;
      const el = document.querySelector(hash);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -72 });
    };
    document.addEventListener('click', onClick);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('click', onClick);
      lenis.destroy();
    };
  }, []);

  // Cursor spotlight: cards marked .spot get a glow that follows the pointer.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('.spot');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => document.removeEventListener('pointermove', onMove);
  }, []);

  // Deep links (/#work): React renders after the browser tried the hash, so scroll once mounted.
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.length > 1) {
      const t = window.setTimeout(() => document.querySelector(hash)?.scrollIntoView(), 300);
      return () => window.clearTimeout(t);
    }
  }, []);

  // Ctrl/Cmd+K, or "/" outside inputs, opens the palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /input|textarea|select/i.test((e.target as HTMLElement).tagName);
      if ((e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        setPalette((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <LensProvider>
      <div className="grain" aria-hidden="true" />
      <ScrollProgress />
      <a className="skip" href="#work">
        Skip to work
      </a>
      <Nav theme={theme} onTheme={toggle} onPalette={() => setPalette(true)} />
      <main>
        <Hero />
        <Ticker />
        <Proof />
        <Work />
        <More />
        <Skills />
        <Record />
        <Principles />
        <Contact />
      </main>
      <Footer />
      <CommandPalette open={palette} onClose={closePalette} setTheme={setTheme} />
      <Toast />
      <Cursor />
    </LensProvider>
  );
}
