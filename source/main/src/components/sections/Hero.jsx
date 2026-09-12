import { useReducedMotion } from 'framer-motion';
import { SiYoutube, SiFacebook } from 'react-icons/si';
import Container from '../layout/Container.jsx';
import Button from '../ui/Button.jsx';
import BrushLabel from '../ui/BrushLabel.jsx';
import { site, links, categories } from '../../data/content.js';

function Orbit({ reduceMotion }) {
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[360px]">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(227,11,31,0.35),transparent_65%)]" />
      <div className="absolute inset-4 rounded-full border border-border" />
      <div className="absolute inset-10 rounded-full border border-green/40" />

      <img
        src="/logo.png"
        alt=""
        width="112"
        height="112"
        className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg"
      />

      <div className={`absolute inset-0 ${reduceMotion ? '' : 'animate-spin-slow'}`}>
        {categories.map((category, index) => {
          const angle = (360 / categories.length) * index;
          return (
            <span
              key={category.id}
              className="absolute left-1/2 top-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-xl shadow-sm"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translate(9rem) rotate(-${angle}deg)`,
              }}
            >
              <span className={reduceMotion ? '' : 'animate-spin-slow-reverse'}>{category.emoji}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="home" className="relative overflow-hidden py-16 sm:py-24">
      <Container className="relative grid items-center gap-14 md:grid-cols-2">
        <div>
          <h1 className="font-display text-5xl font-bold uppercase leading-[0.95] sm:text-6xl lg:text-7xl">
            BANGLA <span className="text-red">VIBE</span> <BrushLabel>DAILY</BrushLabel>
          </h1>

          <p lang="bn" className="mt-6 font-bangla text-xl text-yellow sm:text-2xl">
            {site.taglineBn}
          </p>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{site.pitch}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={links.subscribe} icon={SiYoutube}>
              Subscribe on YouTube
            </Button>
            <Button href={links.facebook} icon={SiFacebook} variant="secondary">
              Follow on Facebook
            </Button>
          </div>

          <p className="mt-10">
            <BrushLabel className="font-display text-xs font-bold uppercase tracking-[0.25em]">
              New content every day
            </BrushLabel>
          </p>
        </div>

        <Orbit reduceMotion={reduceMotion} />
      </Container>
    </section>
  );
}
