/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        body: 'rgb(var(--text) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        red: 'rgb(var(--red) / <alpha-value>)',
        green: 'rgb(var(--green) / <alpha-value>)',
        yellow: 'rgb(var(--yellow) / <alpha-value>)',
      },
      fontFamily: {
        display: ['Oswald', 'Inter', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        bangla: ['"Hind Siliguri"', 'Inter', 'sans-serif'],
      },
      maxWidth: { content: '76rem' },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        spinSlow: { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        'spin-slow': 'spinSlow 40s linear infinite',
        'spin-slow-reverse': 'spinSlow 40s linear infinite reverse',
      },
    },
  },
  plugins: [],
};
