// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseFeed, normaliseTitle } from '../feed.mjs';

const xml = readFileSync(fileURLToPath(new URL('./fixtures/feed.xml', import.meta.url).href), 'utf8');

it('parses every entry', () => {
  const videos = parseFeed(xml);
  expect(videos).toHaveLength(15);
  expect(videos[0]).toMatchObject({ id: '4L0tWP-U4Pg' });
  videos.forEach((video) => {
    expect(video.id).toMatch(/^[\w-]{11}$/);
    expect(video.title.length).toBeGreaterThan(0);
    expect(Number.isFinite(Date.parse(video.published))).toBe(true);
    expect(typeof video.views).toBe('number');
  });
});

it('collapses whitespace in titles', () => {
  expect(normaliseTitle('Khoka   Gelo  |  Bengali\nRhymes')).toBe('Khoka Gelo | Bengali Rhymes');
});

it('throws on non-feed XML', () => {
  expect(() => parseFeed('<html><body>nope</body></html>')).toThrow();
});
