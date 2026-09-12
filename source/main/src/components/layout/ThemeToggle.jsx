import { FiMoon, FiSun } from 'react-icons/fi';

export default function ThemeToggle({ theme, toggle }) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="rounded-full border border-border p-2 text-body transition hover:border-green hover:text-green"
    >
      {isDark ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
    </button>
  );
}
