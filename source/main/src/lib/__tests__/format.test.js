import { formatViews, timeAgo } from '../format.js';

it('formats view counts', () => {
  expect(formatViews(0)).toBe('');
  expect(formatViews(17)).toBe('17 views');
  expect(formatViews(1200)).toBe('1.2K views');
  expect(formatViews(2_500_000)).toBe('2.5M views');
});

it('formats relative dates', () => {
  const now = new Date('2026-09-12T00:00:00Z').getTime();
  expect(timeAgo('2026-09-12T00:00:00Z', now)).toBe('today');
  expect(timeAgo('2026-09-11T00:00:00Z', now)).toBe('yesterday');
  expect(timeAgo('2026-09-10T00:00:00Z', now)).toBe('2 days ago');
  expect(timeAgo('2026-08-29T00:00:00Z', now)).toBe('2 weeks ago');
  expect(timeAgo('2026-06-12T00:00:00Z', now)).toBe('3 months ago');
  expect(timeAgo('not-a-date', now)).toBe('');
});
