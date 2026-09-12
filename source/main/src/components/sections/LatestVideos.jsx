import { useState } from 'react';
import { SiYoutube } from 'react-icons/si';
import Section from '../layout/Section.jsx';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import VideoCard from '../ui/VideoCard.jsx';
import VideoModal from './VideoModal.jsx';
import { links } from '../../data/content.js';
import { timeAgo } from '../../lib/format.js';

export default function LatestVideos({ videos = [], updatedAt }) {
  const [active, setActive] = useState(null);
  const updated = updatedAt ? timeAgo(updatedAt) : '';

  return (
    <Section id="videos" eyebrow="Videos" title="Latest videos" titleBn="সর্বশেষ ভিডিও">
      {videos.length === 0 ? (
        <Card className="mx-auto max-w-2xl bg-surface/70 py-12 text-center">
          <p className="text-4xl" aria-hidden="true">
            🔔
          </p>
          <h3 className="mt-4 font-display text-2xl font-bold uppercase tracking-wide">
            New videos coming soon
          </h3>
          <p lang="bn" className="mt-2 font-bangla text-base text-muted">
            নতুন ভিডিও আসছে খুব শিগগিরই
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
            Subscribe on YouTube and you will be the first to know when the next one goes live.
          </p>
          <Button href={links.subscribe} icon={SiYoutube} className="mt-6">
            Subscribe on YouTube
          </Button>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} onPlay={setActive} />
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-4">
            {updated && <p className="text-xs uppercase tracking-wider text-muted">Updated {updated}</p>}
            <Button href={links.youtube} icon={SiYoutube} variant="secondary">
              See all on YouTube
            </Button>
          </div>
        </>
      )}

      {active && <VideoModal video={active} onClose={() => setActive(null)} />}
    </Section>
  );
}
