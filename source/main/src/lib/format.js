const DAY = 86_400_000;

function compact(value, divisor, suffix) {
  const scaled = (value / divisor).toFixed(1).replace(/\.0$/, '');
  return `${scaled}${suffix}`;
}

export function formatViews(views) {
  const n = Number(views);
  if (!Number.isFinite(n) || n <= 0) return '';
  if (n < 1_000) return `${n} views`;
  if (n < 1_000_000) return `${compact(n, 1_000, 'K')} views`;
  return `${compact(n, 1_000_000, 'M')} views`;
}

export function timeAgo(iso, now = Date.now()) {
  const then = Date.parse(iso);
  if (!Number.isFinite(then)) return '';

  const days = Math.floor((now - then) / DAY);
  if (days < 1) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 31) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? 'a week ago' : `${weeks} weeks ago`;
  }
  if (days < 365) {
    const months = Math.floor(days / 30);
    return months === 1 ? 'a month ago' : `${months} months ago`;
  }
  const years = Math.floor(days / 365);
  return years === 1 ? 'a year ago' : `${years} years ago`;
}
