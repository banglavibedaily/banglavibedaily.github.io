// @vitest-environment node
import { parseVideoId, applySkip, buildVideosFile } from '../videos.mjs';

const skip = { titleKeywords: ['infobells', 'movkidz'], videoIds: [] };

it('parses ids from every supported form', () => {
  expect(parseVideoId('https://www.youtube.com/watch?v=4L0tWP-U4Pg')).toBe('4L0tWP-U4Pg');
  expect(parseVideoId('https://youtu.be/4L0tWP-U4Pg?t=5')).toBe('4L0tWP-U4Pg');
  expect(parseVideoId('https://www.youtube.com/shorts/4L0tWP-U4Pg')).toBe('4L0tWP-U4Pg');
  expect(parseVideoId('4L0tWP-U4Pg')).toBe('4L0tWP-U4Pg');
  expect(parseVideoId('https://example.com/')).toBeNull();
  expect(parseVideoId('')).toBeNull();
});

it('drops skipped videos, sorts newest first and caps the list', () => {
  const videos = [
    { id: 'aaaaaaaaaaa', title: 'Khoka Gelo | Bengali Rhymes By Infobells', published: '2026-09-05T00:00:00Z', views: 1 },
    { id: 'bbbbbbbbbbb', title: 'Ek Mota Hathi | movkidz', published: '2026-09-06T00:00:00Z', views: 2 },
    { id: 'ccccccccccc', title: 'Top 5 AI tools in Bangla', published: '2026-09-07T00:00:00Z', views: 3 },
    { id: 'ddddddddddd', title: 'Padma Bridge story', published: '2026-09-08T00:00:00Z', views: 4 },
  ];

  expect(applySkip(videos, skip).map((v) => v.id)).toEqual(['ddddddddddd', 'ccccccccccc']);
  expect(applySkip(videos, { ...skip, videoIds: ['ddddddddddd'] }).map((v) => v.id)).toEqual(['ccccccccccc']);
  expect(applySkip(videos, { titleKeywords: [], videoIds: [] }, 2)).toHaveLength(2);
});

it('accepts URLs in skip.videoIds', () => {
  const videos = [{ id: 'ccccccccccc', title: 'Keep me', published: '2026-09-07T00:00:00Z', views: 3 }];
  expect(applySkip(videos, { titleKeywords: [], videoIds: ['https://youtu.be/ccccccccccc'] })).toEqual([]);
});

it('builds the videos file', () => {
  const now = new Date('2026-09-12T00:30:00Z');
  const out = buildVideosFile({
    feedVideos: [{ id: 'ccccccccccc', title: 'Top 5 AI tools', published: '2026-09-07T00:00:00Z', views: 3 }],
    featuredVideos: [{ id: 'ddddddddddd', title: 'Padma Bridge story' }],
    previous: { updatedAt: '2026-09-11T00:30:00Z', latest: [], featured: [] },
    now,
  });

  expect(out.updatedAt).toBe('2026-09-12T00:30:00.000Z');
  expect(out.latest).toHaveLength(1);
  expect(out.featured[0].id).toBe('ddddddddddd');
});

it('keeps the previous latest list when the feed fetch failed', () => {
  const previous = {
    updatedAt: '2026-09-11T00:30:00Z',
    latest: [{ id: 'eeeeeeeeeee', title: 'Old but good', published: '2026-09-01T00:00:00Z', views: 9 }],
    featured: [],
  };

  const out = buildVideosFile({ feedVideos: null, featuredVideos: [], previous, now: new Date() });

  expect(out.latest).toEqual(previous.latest);
  expect(out.updatedAt).toBe(previous.updatedAt);
});
