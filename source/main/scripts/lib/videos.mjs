const ID_PATTERN = /^[\w-]{11}$/;

export function parseVideoId(input) {
  if (typeof input !== 'string') return null;
  const value = input.trim();
  if (!value) return null;
  if (ID_PATTERN.test(value)) return value;

  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, '');
  const segments = url.pathname.split('/').filter(Boolean);

  let candidate = null;
  if (host === 'youtu.be') {
    candidate = segments[0];
  } else if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
    if (url.searchParams.has('v')) candidate = url.searchParams.get('v');
    else if (['shorts', 'embed', 'live', 'v'].includes(segments[0])) candidate = segments[1];
  }

  return candidate && ID_PATTERN.test(candidate) ? candidate : null;
}

export function applySkip(videos, skip = {}, limit = 12) {
  const keywords = (skip.titleKeywords ?? []).map((word) => String(word).toLowerCase());
  const blockedIds = new Set((skip.videoIds ?? []).map(parseVideoId).filter(Boolean));

  return (videos ?? [])
    .filter((video) => {
      if (blockedIds.has(video.id)) return false;
      const title = String(video.title ?? '').toLowerCase();
      return !keywords.some((word) => word && title.includes(word));
    })
    .slice()
    .sort((a, b) => Date.parse(b.published) - Date.parse(a.published))
    .slice(0, limit);
}

export function buildVideosFile({ feedVideos, featuredVideos, previous, now }) {
  const failed = feedVideos === null || feedVideos === undefined;
  const fallback = previous ?? { updatedAt: null, latest: [], featured: [] };
  const timestamp = (now ?? new Date()).toISOString();

  return {
    updatedAt: failed ? (fallback.updatedAt ?? timestamp) : timestamp,
    latest: failed ? (fallback.latest ?? []) : feedVideos,
    featured: featuredVideos ?? [],
  };
}
