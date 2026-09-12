import { SiYoutube, SiFacebook } from 'react-icons/si';
import Section from '../layout/Section.jsx';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import { links } from '../../data/content.js';

const DOTTED_MAP =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Ccircle cx='2' cy='2' r='1' fill='%232E8B57' fill-opacity='0.35'/%3E%3C/svg%3E\")";

export default function Follow() {
  return (
    <Section id="follow" eyebrow="Join us" title="Follow the vibe" titleBn="আমাদের সাথে থাকুন">
      <div
        className="grid gap-5 rounded-3xl p-1 sm:grid-cols-2"
        style={{ backgroundImage: DOTTED_MAP }}
      >
        <Card className="text-center">
          <SiYoutube aria-hidden="true" className="mx-auto mb-4 text-4xl text-red" />
          <h3 className="font-display text-xl font-bold uppercase tracking-wide">YouTube</h3>
          <p className="mt-1 text-sm text-muted">{links.youtubeHandle}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            New videos every day — stories, facts, ideas and more.
          </p>
          <Button href={links.subscribe} icon={SiYoutube} className="mt-6">
            Subscribe on YouTube
          </Button>
        </Card>

        <Card className="text-center">
          <SiFacebook aria-hidden="true" className="mx-auto mb-4 text-4xl text-green" />
          <h3 className="font-display text-xl font-bold uppercase tracking-wide">Facebook</h3>
          <p className="mt-1 text-sm text-muted">{links.facebookHandle}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Daily posts, clips and updates from the community.
          </p>
          <Button href={links.facebook} icon={SiFacebook} variant="secondary" className="mt-6">
            Follow on Facebook
          </Button>
        </Card>
      </div>
    </Section>
  );
}
