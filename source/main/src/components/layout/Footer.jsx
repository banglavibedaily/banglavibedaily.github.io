import Container from './Container.jsx';
import SocialLinks from '../ui/SocialLinks.jsx';
import { nav, site } from '../../data/content.js';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50 py-12">
      <Container className="flex flex-col items-center gap-6 text-center">
        <a href="#home" className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt=""
            width="32"
            height="32"
            className="h-8 w-8 rounded-full"
          />
          <span className="font-display text-base font-bold uppercase tracking-wide">
            Bangla <span className="text-red">Vibe</span> Daily
          </span>
        </a>

        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="font-display text-xs uppercase tracking-[0.2em] text-muted transition hover:text-red"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <SocialLinks />

        <p lang="bn" className="font-bangla text-base text-muted">
          {site.taglineBn}
        </p>

        <p className="text-xs text-muted">
          © {new Date().getFullYear()} {site.name}
        </p>
      </Container>
    </footer>
  );
}
