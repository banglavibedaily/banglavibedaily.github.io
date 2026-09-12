import { useCallback, useEffect, useState } from 'react';

const KEY = 'bvd-theme';

function initial() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* storage blocked — fall through to the media query */
  }
  if (typeof window !== 'undefined' && window.matchMedia
      && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

export function useTheme() {
  const [theme, setTheme] = useState(initial);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* storage blocked — the class on <html> is still correct */
    }
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);

  return { theme, toggle };
}
