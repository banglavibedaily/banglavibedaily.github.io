import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { SiYoutube } from 'react-icons/si';
import Container from './Container.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import Button from '../ui/Button.jsx';
import { useScrollSpy } from '../hooks/useScrollSpy.js';
import { nav, links, site } from '../../data/content.js';

const IDS = nav.map((item) => item.id);

export default function Navbar({ theme, toggle }) {
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(IDS);

  const linkClasses = (id) =>
    [
      'font-display text-sm font-medium uppercase tracking-wider transition',
      active === id ? 'text-red' : 'text-body hover:text-green',
    ].join(' ');

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <a href="#home" className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt={`${site.name} logo`}
            width="36"
            height="36"
            className="h-9 w-9 rounded-full"
          />
          <span className="font-display text-lg font-bold uppercase tracking-wide">
            Bangla <span className="text-red">Vibe</span> Daily
          </span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <a key={item.id} href={`#${item.id}`} className={linkClasses(item.id)}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle theme={theme} toggle={toggle} />
          <Button
            href={links.subscribe}
            icon={SiYoutube}
            className="hidden px-4 py-2 md:inline-flex"
          >
            Subscribe
          </Button>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="rounded-full border border-border p-2 text-body transition hover:border-green md:hidden"
          >
            {open ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-border bg-surface md:hidden">
          <Container className="flex flex-col gap-4 py-5">
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className={linkClasses(item.id)}
              >
                {item.label}
              </a>
            ))}
            <Button href={links.subscribe} icon={SiYoutube} className="mt-1">
              Subscribe on YouTube
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}
