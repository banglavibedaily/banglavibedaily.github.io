import { FiPlay } from 'react-icons/fi';
import { formatViews, timeAgo } from '../../lib/format.js';

export default function VideoCard({ video, onPlay }) {
  const meta = [video.published ? timeAgo(video.published) : '', formatViews(video.views)].filter(
    Boolean
  );

  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.id}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        if (!onPlay || event.metaKey || event.ctrlKey || event.shiftKey) return;
        event.preventDefault();
        onPlay(video);
      }}
      className="group block overflow-hidden rounded-2xl border border-border bg-surface transition hover:-translate-y-1 hover:border-red"
    >
      <div className="relative aspect-video overflow-hidden bg-bg">
        <img
          src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
          alt={video.title}
          loading="lazy"
          width="480"
          height="360"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red text-white shadow-lg">
            <FiPlay className="ml-0.5 text-2xl" />
          </span>
        </span>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 font-display text-base font-medium leading-snug">
          {video.title}
        </h3>
        {meta.length > 0 && (
          <p className="mt-2 text-xs uppercase tracking-wider text-muted">{meta.join(' · ')}</p>
        )}
      </div>
    </a>
  );
}
