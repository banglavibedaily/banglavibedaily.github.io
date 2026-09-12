import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });

export function normaliseTitle(title) {
  return String(title ?? '').replace(/\s+/g, ' ').trim();
}

export function parseFeed(xml) {
  const doc = parser.parse(xml);
  const feed = doc?.feed;
  if (!feed) throw new Error('Not a YouTube Atom feed: no <feed> root');

  const entries = [].concat(feed.entry ?? []);
  return entries
    .map((entry) => ({
      id: String(entry['yt:videoId'] ?? ''),
      title: normaliseTitle(entry.title),
      published: String(entry.published ?? ''),
      views:
        Number(
          entry['media:group']?.['media:community']?.['media:statistics']?.['@_views'] ?? 0
        ) || 0,
    }))
    .filter((video) => video.id);
}
