import Section from '../layout/Section.jsx';
import { about, site } from '../../data/content.js';

export default function About() {
  return (
    <Section id="about" eyebrow="About" title={about.heading} titleBn={about.headingBn}>
      <div className="mx-auto max-w-3xl text-center">
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph} className="mb-5 text-base leading-relaxed text-muted sm:text-lg">
            {paragraph}
          </p>
        ))}

        <p
          lang="bn"
          className="mt-10 border-t border-border pt-8 font-bangla text-2xl text-yellow sm:text-3xl"
        >
          {site.taglineBn}
        </p>
      </div>
    </Section>
  );
}
