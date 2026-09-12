import { site, links, nav, categories, about, featured, skip } from '../content.js';

it('has the brand basics', () => {
  expect(site.name).toBe('Bangla Vibe Daily');
  expect(site.taglineBn).toBe('বাংলার ভাইব, বিশ্বের গল্প');
  expect(site.url).toBe('https://banglavibedaily.github.io');
});

it('links are https and point at the right places', () => {
  Object.values(links)
    .filter((v) => typeof v === 'string' && v.startsWith('http'))
    .forEach((url) => expect(url).toMatch(/^https:\/\//));
  expect(links.channelId).toBe('UCECjH_U3T2l4SSXiVtBrajQ');
  expect(links.subscribe).toContain('sub_confirmation=1');
  expect(links.feedUrl).toContain(links.channelId);
});

it('has 7 categories with unique ids, Bangla names and blurbs', () => {
  expect(categories).toHaveLength(7);
  expect(new Set(categories.map((c) => c.id)).size).toBe(7);
  categories.forEach((c) => {
    expect(c.emoji).toBeTruthy();
    expect(c.name).toBeTruthy();
    expect(c.nameBn).toBeTruthy();
    expect(c.blurb.length).toBeGreaterThan(10);
  });
});

it('nav entries point at real sections and about copy exists', () => {
  expect(nav.map((n) => n.id)).toEqual(['categories', 'videos', 'about', 'follow']);
  expect(about.paragraphs.length).toBeGreaterThanOrEqual(2);
});

it('skip list starts with the third-party channels and featured is an array', () => {
  expect(skip.titleKeywords).toEqual(expect.arrayContaining(['infobells', 'movkidz']));
  expect(Array.isArray(skip.videoIds)).toBe(true);
  expect(Array.isArray(featured)).toBe(true);
});
