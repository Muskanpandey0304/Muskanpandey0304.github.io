import { useCallback, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

function initialTheme(): Theme {
  try {
    const s = localStorage.getItem('theme');
    if (s === 'dark' || s === 'light') return s;
  } catch {
    /* ignore */
  }
  return 'dark'; // dark is the signature look; light is opt-in via the toggle
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggle = useCallback(() => setThemeState((t) => (t === 'dark' ? 'light' : 'dark')), []);
  return { theme, setTheme: setThemeState, toggle };
}
