import { useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';

export default function VideoModal({ video, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <div className="w-full max-w-4xl">
        <div className="mb-3 flex items-start justify-between gap-4">
          <h2 className="font-display text-base font-medium text-white sm:text-lg">{video.title}</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close player"
            className="shrink-0 rounded-full border border-white/30 p-2 text-white transition hover:border-white"
          >
            <FiX aria-hidden="true" />
          </button>
        </div>

        <div className="aspect-video overflow-hidden rounded-xl bg-black">
          <iframe
            title={video.title}
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}
