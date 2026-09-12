import { SiYoutube, SiFacebook } from 'react-icons/si';
import { links } from '../../data/content.js';

const PLATFORMS = [
  { href: links.youtube, label: 'YouTube', Icon: SiYoutube },
  { href: links.facebook, label: 'Facebook', Icon: SiFacebook },
];

export default function SocialLinks({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {PLATFORMS.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label} — Bangla Vibe Daily`}
          className="rounded-full border border-border p-2.5 text-muted transition hover:border-red hover:text-red"
        >
          <Icon aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
