import { useState } from 'react';
import Section from '../layout/Section.jsx';
import VideoCard from '../ui/VideoCard.jsx';
import VideoModal from './VideoModal.jsx';

export default function Featured({ videos = [] }) {
  const [active, setActive] = useState(null);

  if (videos.length === 0) return null;

  return (
    <Section id="featured" eyebrow="Featured" title="Featured videos" titleBn="বাছাই করা ভিডিও">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} onPlay={setActive} />
        ))}
      </div>

      {active && <VideoModal video={active} onClose={() => setActive(null)} />}
    </Section>
  );
}
