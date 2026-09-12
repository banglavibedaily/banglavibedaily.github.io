# Bangla Vibe Daily Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the single-page Bangla Vibe Daily showcase site — brand hero, 7 categories, hand-picked Featured videos, a self-updating Latest grid from the YouTube RSS feed — and deploy it to GitHub Pages at https://banglavibedaily.github.io.

**Architecture:** A Vite + React SPA in `source/main`, styled with Tailwind against CSS-variable brand tokens (dark-first with a light toggle). A Node script (`scripts/fetch-videos.mjs`) fetches the channel's public RSS feed at build time, filters third-party uploads through a skip list, resolves hand-picked featured videos via YouTube oEmbed, and writes `src/data/videos.json`, which the app imports statically. A GitHub Actions workflow runs that script daily and on push, then builds and publishes to Pages. A Node 22 dev container lives in `container/main`.

**Tech Stack:** React 18, Vite 5, Tailwind CSS 3, Framer Motion 11, react-icons 5, @fontsource (Oswald, Inter, Hind Siliguri), fast-xml-parser 4, Vitest 1 + React Testing Library + jsdom, Docker (node:22-alpine), GitHub Actions + GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-12-bangla-vibe-daily-website-design.md`

## Global Constraints

- **The user makes all git commits.** Never run `git commit`, `git push`, or `git add`. Each task ends by reporting changed files; the user commits.
- **Node 18 compatibility:** host runs Node 18.19.1; container and CI run Node 22. Pin `vite@^5`, `vitest@^1`, `react@^18`, `tailwindcss@^3`. No Vite 6+/Vitest 2+.
- **All npm commands run from `source/main`** (or through the container).
- **Brand tokens (exact):** dark `--bg #06110C`, `--surface #0D1F17`, `--border #1E3A2C`, `--text #EEF3EF`, `--muted #9DB3A6`; light `--bg #F7F5EF`, `--surface #FFFFFF`, `--border #DCE3DC`, `--text #0B2418`, `--muted #4E6558`; `--red #E30B1F` both themes; `--green #2E8B57` dark / `#0B5D3B` light; `--yellow #EEE20C` dark, maps to green in light.
- **Red only behind white text or large display text. Yellow never on the light background.**
- **No invented audience numbers** — no subscriber or total-view counters anywhere.
- **Bangla text** uses Hind Siliguri via the `font-bangla` class and `lang="bn"`.
- **All motion** is disabled under `prefers-reduced-motion: reduce`.
- `vite.config.js` uses `base: '/'`.
- **Channel facts:** channel ID `UCECjH_U3T2l4SSXiVtBrajQ`; feed `https://www.youtube.com/feeds/videos.xml?channel_id=UCECjH_U3T2l4SSXiVtBrajQ`; subscribe `https://www.youtube.com/@BanglaVibeDaily?sub_confirmation=1`; Facebook `https://www.facebook.com/BanglaVibeDaily`.
- **Latest grid caps at 12 videos**, newest first, after the skip list.
- Featured is never filtered by the skip list.

---

### Task 1: Scaffold the app and tooling

**Files:**
- Create: `.gitignore`, `source/main/package.json`, `source/main/vite.config.js`, `source/main/postcss.config.js`, `source/main/tailwind.config.js`, `source/main/vitest.setup.js`, `source/main/index.html`, `source/main/src/main.jsx`, `source/main/src/App.jsx`, `source/main/src/index.css`
- Test: `source/main/src/__tests__/smoke.test.jsx`

**Interfaces:**
- Consumes: nothing
- Produces: `App` default export from `src/App.jsx`; npm scripts `dev`, `build`, `preview`, `test`, `fetch:videos`

- [ ] **Step 1: Create `.gitignore` at repo root**

```gitignore
node_modules/
dist/
.DS_Store
container/main/.env
container/main/.envs/*.env
*.local
```

- [ ] **Step 2: Create `source/main/package.json`**

```json
{
  "name": "banglavibedaily-site",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "fetch:videos": "node scripts/fetch-videos.mjs"
  },
  "dependencies": {
    "@fontsource/hind-siliguri": "^5.0.13",
    "@fontsource/inter": "^5.0.18",
    "@fontsource/oswald": "^5.0.19",
    "framer-motion": "^11.2.10",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-icons": "^5.2.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.6",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.2",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "fast-xml-parser": "^4.4.0",
    "jsdom": "^24.1.0",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "vite": "^5.3.1",
    "vitest": "^1.6.0"
  }
}
```

- [ ] **Step 3: Create configs**

`vite.config.js`:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.js'],
  },
});
```

`postcss.config.js`:

```js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

`vitest.setup.js`:

```js
import '@testing-library/jest-dom/vitest';

window.matchMedia = window.matchMedia || function matchMedia(query) {
  return { matches: false, media: query, onchange: null,
    addEventListener() {}, removeEventListener() {},
    addListener() {}, removeListener() {}, dispatchEvent() { return false; } };
};

window.scrollTo = window.scrollTo || function scrollTo() {};

if (!window.IntersectionObserver) {
  window.IntersectionObserver = class {
    observe() {} unobserve() {} disconnect() {}
  };
}
```

- [ ] **Step 4: Create `index.html`, `src/main.jsx`, minimal `src/App.jsx`**

`index.html` body contains `<div id="root"></div>` and `<script type="module" src="/src/main.jsx"></script>`; full `<head>` metadata comes in Task 14.

```jsx
// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
);
```

```jsx
// src/App.jsx
export default function App() {
  return <main><h1>Bangla Vibe Daily</h1></main>;
}
```

- [ ] **Step 5: Write the smoke test**

```jsx
// src/__tests__/smoke.test.jsx
import { render, screen } from '@testing-library/react';
import App from '../App.jsx';

it('renders the brand name', () => {
  render(<App />);
  expect(screen.getByText(/Bangla Vibe Daily/i)).toBeInTheDocument();
});
```

- [ ] **Step 6: Install and run**

Run: `cd source/main && npm install && npm test`
Expected: 1 test passes.

- [ ] **Step 7: Report changed files to the user for commit**

---

### Task 2: Brand tokens and theme switching

**Files:**
- Modify: `source/main/tailwind.config.js`, `source/main/src/index.css`
- Create: `source/main/src/components/hooks/useTheme.js`
- Test: `source/main/src/components/hooks/__tests__/useTheme.test.jsx`

**Interfaces:**
- Produces: `useTheme()` → `{ theme: 'dark'|'light', toggle: () => void }`; Tailwind tokens `bg`, `surface`, `border`, `body`, `muted`, `red`, `green`, `yellow`; fonts `font-display`, `font-sans`, `font-bangla`; animations `animate-spin-slow`, `animate-marquee`, `animate-orbit`

- [ ] **Step 1: Write the failing test**

```jsx
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../useTheme.js';

beforeEach(() => { localStorage.clear(); document.documentElement.className = ''; });

it('defaults to dark and toggles to light', () => {
  const { result } = renderHook(() => useTheme());
  expect(result.current.theme).toBe('dark');
  expect(document.documentElement.classList.contains('dark')).toBe(true);
  act(() => result.current.toggle());
  expect(result.current.theme).toBe('light');
  expect(document.documentElement.classList.contains('dark')).toBe(false);
  expect(localStorage.getItem('bvd-theme')).toBe('light');
});

it('restores the saved theme', () => {
  localStorage.setItem('bvd-theme', 'light');
  const { result } = renderHook(() => useTheme());
  expect(result.current.theme).toBe('light');
});
```

- [ ] **Step 2: Run the test, expect failure** — `npx vitest run src/components/hooks` → FAIL (module not found)

- [ ] **Step 3: Implement `useTheme.js`**

```js
import { useCallback, useEffect, useState } from 'react';

const KEY = 'bvd-theme';

function initial() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { /* storage blocked */ }
  if (typeof window !== 'undefined' && window.matchMedia
      && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  return 'dark';
}

export function useTheme() {
  const [theme, setTheme] = useState(initial);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem(KEY, theme); } catch { /* ignore */ }
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);
  return { theme, toggle };
}
```

- [ ] **Step 4: Write `src/index.css` with the token palette**

```css
@import '@fontsource/oswald/500.css';
@import '@fontsource/oswald/700.css';
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/500.css';
@import '@fontsource/inter/600.css';
@import '@fontsource/hind-siliguri/400.css';
@import '@fontsource/hind-siliguri/600.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: 247 245 239; --surface: 255 255 255; --border: 220 227 220;
  --text: 11 36 24; --muted: 78 101 88;
  --red: 227 11 31; --green: 11 93 59; --yellow: 11 93 59;
}
.dark {
  --bg: 6 17 12; --surface: 13 31 23; --border: 30 58 44;
  --text: 238 243 239; --muted: 157 179 166;
  --red: 227 11 31; --green: 46 139 87; --yellow: 238 226 12;
}

html { scroll-behavior: smooth; }
body { @apply bg-bg text-body font-sans antialiased; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 5: Extend `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        body: 'rgb(var(--text) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        red: 'rgb(var(--red) / <alpha-value>)',
        green: 'rgb(var(--green) / <alpha-value>)',
        yellow: 'rgb(var(--yellow) / <alpha-value>)',
      },
      fontFamily: {
        display: ['Oswald', 'Inter', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        bangla: ['"Hind Siliguri"', 'Inter', 'sans-serif'],
      },
      maxWidth: { content: '76rem' },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        spinSlow: { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        'spin-slow': 'spinSlow 40s linear infinite',
        'spin-slow-reverse': 'spinSlow 40s linear infinite reverse',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 6: Run tests** — `npm test` → all pass.
- [ ] **Step 7: Report changed files**

---

### Task 3: Site content module

**Files:**
- Create: `source/main/src/data/content.js`
- Test: `source/main/src/data/__tests__/content.test.js`

**Interfaces:**
- Produces: named exports `site`, `links`, `nav`, `categories`, `about`, `featured`, `skip` (shapes in spec §5). No React or asset imports — the Node script imports this file.

- [ ] **Step 1: Write the failing test**

```js
import { site, links, nav, categories, about, featured, skip } from '../content.js';

it('has the brand basics', () => {
  expect(site.name).toBe('Bangla Vibe Daily');
  expect(site.taglineBn).toBe('বাংলার ভাইব, বিশ্বের গল্প');
  expect(site.url).toBe('https://banglavibedaily.github.io');
});

it('links are https and point at the right places', () => {
  Object.values(links).filter((v) => typeof v === 'string' && v.startsWith('http'))
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
```

- [ ] **Step 2: Run it, expect failure** (module not found)

- [ ] **Step 3: Implement `content.js`** using the exact copy from spec §2 (7 categories with emoji, English name, Bangla name, blurb; About heading "Our Vibe" / "আমাদের ভাইব" and the two paragraphs), `featured: []`, `skip: { titleKeywords: ['infobells', 'movkidz'], videoIds: [] }`.

- [ ] **Step 4: Run tests** → pass.
- [ ] **Step 5: Report changed files**

---

### Task 4: Display formatting helpers

**Files:**
- Create: `source/main/src/lib/format.js`
- Test: `source/main/src/lib/__tests__/format.test.js`

**Interfaces:**
- Produces: `formatViews(n)` → `'1.2K views'` | `'17 views'` | `''` when `n <= 0`; `timeAgo(iso, now = Date.now())` → `'today'`, `'2 days ago'`, `'3 weeks ago'`, `'5 months ago'`

- [ ] **Step 1: Write the failing test**

```js
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
```

- [ ] **Step 2: Run it, expect failure**
- [ ] **Step 3: Implement `format.js`** (integer days diff; `<1` today, `1` yesterday, `<7` days, `<31` weeks, `<365` months, else years; K/M with one decimal, trailing `.0` stripped)
- [ ] **Step 4: Run tests** → pass
- [ ] **Step 5: Report changed files**

---

### Task 5: RSS feed parser

**Files:**
- Create: `source/main/scripts/lib/feed.mjs`, `source/main/scripts/lib/__tests__/fixtures/feed.xml` (saved snapshot of the real BVD feed)
- Test: `source/main/scripts/lib/__tests__/feed.test.mjs`

**Interfaces:**
- Produces: `normaliseTitle(s)` → whitespace-collapsed, trimmed string; `parseFeed(xml)` → `[{ id, title, published, views }]` in feed order; throws `Error` on XML that has no `<feed>` root

- [ ] **Step 1: Save the fixture** — copy the scratchpad feed snapshot to the fixtures path (15 entries, real IDs and titles).

- [ ] **Step 2: Write the failing test**

```js
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseFeed, normaliseTitle } from '../feed.mjs';

const xml = readFileSync(fileURLToPath(new URL('./fixtures/feed.xml', import.meta.url)), 'utf8');

it('parses every entry', () => {
  const videos = parseFeed(xml);
  expect(videos).toHaveLength(15);
  expect(videos[0]).toMatchObject({ id: '4L0tWP-U4Pg' });
  videos.forEach((v) => {
    expect(v.id).toMatch(/^[\w-]{11}$/);
    expect(v.title.length).toBeGreaterThan(0);
    expect(Number.isFinite(Date.parse(v.published))).toBe(true);
    expect(typeof v.views).toBe('number');
  });
});

it('collapses whitespace in titles', () => {
  expect(normaliseTitle('Khoka   Gelo  |  Bengali\nRhymes')).toBe('Khoka Gelo | Bengali Rhymes');
});

it('throws on non-feed XML', () => {
  expect(() => parseFeed('<html><body>nope</body></html>')).toThrow();
});
```

- [ ] **Step 3: Run it, expect failure**

- [ ] **Step 4: Implement `feed.mjs`**

```js
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
  return entries.map((entry) => ({
    id: String(entry['yt:videoId'] ?? ''),
    title: normaliseTitle(entry.title),
    published: String(entry.published ?? ''),
    views: Number(
      entry['media:group']?.['media:community']?.['media:statistics']?.['@_views'] ?? 0
    ) || 0,
  })).filter((v) => v.id);
}
```

- [ ] **Step 5: Run tests** → pass
- [ ] **Step 6: Report changed files**

---

### Task 6: Skip list, ID parsing and the videos file builder

**Files:**
- Create: `source/main/scripts/lib/videos.mjs`
- Test: `source/main/scripts/lib/__tests__/videos.test.mjs`

**Interfaces:**
- Consumes: `parseFeed` output shape from Task 5
- Produces:
  - `parseVideoId(input)` → 11-char id or `null` (accepts watch URL, `youtu.be`, `/shorts/`, `/embed/`, bare id)
  - `applySkip(videos, skip, limit = 12)` → filtered, newest-first, capped array
  - `buildVideosFile({ feedVideos, featuredVideos, previous, now })` → `{ updatedAt, latest, featured }`, where `feedVideos === null` means the fetch failed and the previous `latest` and `updatedAt` are preserved

- [ ] **Step 1: Write the failing test**

```js
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
  const kept = applySkip(videos, skip);
  expect(kept.map((v) => v.id)).toEqual(['ddddddddddd', 'ccccccccccc']);
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
```

- [ ] **Step 2: Run it, expect failure**
- [ ] **Step 3: Implement `videos.mjs`** — `parseVideoId` via URL parsing with a bare-id regex fallback; `applySkip` lower-cases titles for keyword matching, maps `skip.videoIds` through `parseVideoId`, sorts by `published` descending, slices to `limit`; `buildVideosFile` applies the fallback rules above (`feedVideos === null` → keep `previous.latest` and `previous.updatedAt`).
- [ ] **Step 4: Run tests** → pass
- [ ] **Step 5: Report changed files**

---

### Task 7: The fetch script

**Files:**
- Create: `source/main/scripts/fetch-videos.mjs`, `source/main/src/data/videos.json` (generated)

**Interfaces:**
- Consumes: `links`, `featured`, `skip` from `src/data/content.js`; `parseFeed` (Task 5); `applySkip`, `parseVideoId`, `buildVideosFile` (Task 6)
- Produces: `src/data/videos.json` matching spec §5; exits 0 on data problems, non-zero only on programming errors

- [ ] **Step 1: Implement the script**

```js
#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { links, featured, skip } from '../src/data/content.js';
import { parseFeed } from './lib/feed.mjs';
import { applySkip, parseVideoId, buildVideosFile } from './lib/videos.mjs';

const OUT = fileURLToPath(new URL('../src/data/videos.json', import.meta.url));
const TIMEOUT = 15_000;
const UA = 'Mozilla/5.0 (compatible; BanglaVibeDailyBot/1.0)';

async function getText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(TIMEOUT) });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function readPrevious() {
  try { return JSON.parse(await readFile(OUT, 'utf8')); }
  catch { return { updatedAt: null, latest: [], featured: [] }; }
}

async function fetchLatest() {
  try {
    return applySkip(parseFeed(await getText(links.feedUrl)), skip);
  } catch (error) {
    console.warn(`[fetch-videos] feed unavailable, keeping previous list: ${error.message}`);
    return null;
  }
}

async function fetchFeatured(previous) {
  const out = [];
  for (const entry of featured) {
    const id = parseVideoId(entry);
    if (!id) { console.warn(`[fetch-videos] not a YouTube video: ${entry}`); continue; }
    try {
      const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
      const { title } = JSON.parse(await getText(url));
      out.push({ id, title });
    } catch (error) {
      const cached = previous.featured?.find((v) => v.id === id);
      if (cached) { out.push(cached); console.warn(`[fetch-videos] lookup failed for ${id}, using cached title`); }
      else console.warn(`[fetch-videos] lookup failed for ${id}, skipping: ${error.message}`);
    }
  }
  return out;
}

const previous = await readPrevious();
const [feedVideos, featuredVideos] = [await fetchLatest(), await fetchFeatured(previous)];
const data = buildVideosFile({ feedVideos, featuredVideos, previous, now: new Date() });
await writeFile(OUT, `${JSON.stringify(data, null, 2)}\n`);
console.log(`[fetch-videos] ${data.latest.length} latest, ${data.featured.length} featured → src/data/videos.json`);
```

- [ ] **Step 2: Run it for real** — `npm run fetch:videos`
Expected: writes `src/data/videos.json`. With today's feed (all Infobells/Movkidz uploads) `latest` is `[]` and the log says `0 latest, 0 featured`.

- [ ] **Step 3: Verify failure handling** — temporarily point `links.feedUrl` at `https://www.youtube.com/feeds/videos.xml?channel_id=BROKEN`, re-run, confirm the warning appears, `videos.json` keeps its previous `latest`, and the exit code is 0. Restore the URL.

- [ ] **Step 4: Report changed files**

---

### Task 8: Layout and UI primitives

**Files:**
- Create: `source/main/src/components/layout/Container.jsx`, `Section.jsx`; `source/main/src/components/ui/Button.jsx`, `Card.jsx`, `SectionHeading.jsx`, `BrushLabel.jsx`
- Test: `source/main/src/components/ui/__tests__/ui.test.jsx`

**Interfaces:**
- Produces:
  - `<Container className>` → `div.mx-auto.max-w-content.px-4`
  - `<Section id title titleBn eyebrow children>` → `<section id>` with `SectionHeading` and scroll-reveal wrapper
  - `<Button as href variant="primary|secondary|ghost" icon children>` → `<a>` when `href` is set, else `<button>`; external links get `target="_blank" rel="noopener noreferrer"`
  - `<Card className children>`, `<SectionHeading title titleBn eyebrow>`, `<BrushLabel children>`

- [ ] **Step 1: Write the failing test**

```jsx
import { render, screen } from '@testing-library/react';
import Button from '../Button.jsx';
import SectionHeading from '../SectionHeading.jsx';

it('renders a link button for external urls', () => {
  render(<Button href="https://www.youtube.com/@BanglaVibeDaily">Subscribe</Button>);
  const link = screen.getByRole('link', { name: /subscribe/i });
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
});

it('renders a plain button without href', () => {
  render(<Button>Click</Button>);
  expect(screen.getByRole('button', { name: 'Click' })).toBeInTheDocument();
});

it('shows the Bangla subtitle with lang', () => {
  render(<SectionHeading title="Our Vibe" titleBn="আমাদের ভাইব" />);
  const bn = screen.getByText('আমাদের ভাইব');
  expect(bn).toHaveAttribute('lang', 'bn');
});
```

- [ ] **Step 2: Run it, expect failure**
- [ ] **Step 3: Implement the primitives** — Tailwind classes only from the token set; `Button` variants: primary `bg-red text-white`, secondary `border border-border bg-surface`, ghost transparent; `BrushLabel` renders a white rounded slab behind its text using a slight skew.
- [ ] **Step 4: Run tests** → pass
- [ ] **Step 5: Report changed files**

---

### Task 9: Navbar, theme toggle, scroll spy

**Files:**
- Create: `source/main/src/components/layout/Navbar.jsx`, `ThemeToggle.jsx`, `source/main/src/components/hooks/useScrollSpy.js`
- Test: `source/main/src/components/layout/__tests__/navbar.test.jsx`

**Interfaces:**
- Consumes: `useTheme` (Task 2), `nav`, `links`, `site` (Task 3), `Button` (Task 8)
- Produces: `<Navbar theme toggle />`; `useScrollSpy(ids)` → active id string

- [ ] **Step 1: Write the failing test**

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../Navbar.jsx';

it('shows nav links, a subscribe button and a working theme toggle', async () => {
  const toggle = vi.fn();
  render(<Navbar theme="dark" toggle={toggle} />);
  expect(screen.getByRole('link', { name: /categories/i })).toHaveAttribute('href', '#categories');
  expect(screen.getAllByRole('link', { name: /subscribe/i }).length).toBeGreaterThan(0);
  await userEvent.click(screen.getByRole('button', { name: /switch to light mode/i }));
  expect(toggle).toHaveBeenCalled();
});

it('opens the mobile menu', async () => {
  render(<Navbar theme="dark" toggle={() => {}} />);
  const button = screen.getByRole('button', { name: /open menu/i });
  expect(button).toHaveAttribute('aria-expanded', 'false');
  await userEvent.click(button);
  expect(screen.getByRole('button', { name: /close menu/i })).toHaveAttribute('aria-expanded', 'true');
});
```

- [ ] **Step 2: Run it, expect failure**
- [ ] **Step 3: Implement** — sticky translucent header, logo image + wordmark, desktop links from `nav`, active link underlined via `useScrollSpy`, `ThemeToggle` with `aria-label` "Switch to light mode"/"Switch to dark mode", mobile menu button toggling `aria-expanded` and a panel of the same links.
- [ ] **Step 4: Run tests** → pass
- [ ] **Step 5: Report changed files**

---

### Task 10: Hero and category ribbon

**Files:**
- Create: `source/main/src/components/sections/Hero.jsx`, `CategoryRibbon.jsx`
- Test: `source/main/src/components/sections/__tests__/hero.test.jsx`

**Interfaces:**
- Consumes: `site`, `links`, `categories` (Task 3); `Button`, `BrushLabel`, `Container` (Task 8)
- Produces: `<Hero />`, `<CategoryRibbon />`

- [ ] **Step 1: Write the failing test**

```jsx
import { render, screen, within } from '@testing-library/react';
import Hero from '../Hero.jsx';

it('shows the wordmark, tagline and both calls to action', () => {
  render(<Hero />);
  const heading = screen.getByRole('heading', { level: 1 });
  expect(within(heading).getByText(/VIBE/)).toBeInTheDocument();
  const tagline = screen.getByText('বাংলার ভাইব, বিশ্বের গল্প');
  expect(tagline).toHaveAttribute('lang', 'bn');
  expect(screen.getByRole('link', { name: /subscribe on youtube/i }))
    .toHaveAttribute('href', expect.stringContaining('sub_confirmation=1'));
  expect(screen.getByRole('link', { name: /follow on facebook/i }))
    .toHaveAttribute('href', 'https://www.facebook.com/BanglaVibeDaily');
});
```

- [ ] **Step 2: Run it, expect failure**
- [ ] **Step 3: Implement** — two-column grid stacking under `md`; H1 "BANGLA <span class="text-red">VIBE</span> <BrushLabel>DAILY</BrushLabel>" in `font-display`; tagline in `font-bangla text-yellow`; pitch in `text-muted`; two buttons; `BrushLabel` "NEW CONTENT EVERY DAY"; orbit visual = logo centred in a ring (`animate-spin-slow`) with the 7 category emoji positioned by angle, each counter-rotating (`animate-spin-slow-reverse`) to stay upright, over a red radial-gradient glow; the whole orbit is `aria-hidden`. `CategoryRibbon` duplicates the category list twice inside an `animate-marquee` flex row inside `overflow-hidden`.
- [ ] **Step 4: Run tests** → pass
- [ ] **Step 5: Report changed files**

---

### Task 11: Categories, About, Follow, Footer

**Files:**
- Create: `source/main/src/components/sections/Categories.jsx`, `About.jsx`, `Follow.jsx`, `source/main/src/components/layout/Footer.jsx`, `source/main/src/components/ui/SocialLinks.jsx`
- Test: `source/main/src/components/sections/__tests__/sections.test.jsx`

**Interfaces:**
- Consumes: `categories`, `about`, `links`, `site` (Task 3); `Section`, `Card`, `Button`, `Container` (Task 8)
- Produces: `<Categories />`, `<About />`, `<Follow />`, `<Footer />`, `<SocialLinks />`

- [ ] **Step 1: Write the failing test**

```jsx
import { render, screen } from '@testing-library/react';
import Categories from '../Categories.jsx';
import Follow from '../Follow.jsx';
import Footer from '../../layout/Footer.jsx';
import { categories } from '../../../data/content.js';

it('renders a card per category with its Bangla name', () => {
  render(<Categories />);
  categories.forEach((c) => {
    expect(screen.getByText(c.name)).toBeInTheDocument();
    expect(screen.getByText(c.nameBn)).toHaveAttribute('lang', 'bn');
  });
});

it('links to both platforms', () => {
  render(<Follow />);
  expect(screen.getByRole('link', { name: /youtube/i })).toHaveAttribute('href', expect.stringContaining('youtube.com'));
  expect(screen.getByRole('link', { name: /facebook/i })).toHaveAttribute('href', expect.stringContaining('facebook.com'));
});

it('footer shows the current year', () => {
  render(<Footer />);
  expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
});
```

- [ ] **Step 2: Run it, expect failure**
- [ ] **Step 3: Implement** — `Categories`: responsive grid (1/2/3 cols) of `Card`s, each with a `react-icons` icon mapped by `id`, emoji, name, `lang="bn"` subtitle, blurb. `About`: heading + `about.paragraphs`, tagline pull-quote. `Follow`: two large cards with handles and buttons over a faint dotted-map SVG. `Footer`: logo, nav links, `SocialLinks`, tagline, `© <year> Bangla Vibe Daily`.
- [ ] **Step 4: Run tests** → pass
- [ ] **Step 5: Report changed files**

---

### Task 12: Video cards, modal player, Featured and Latest

**Files:**
- Create: `source/main/src/components/ui/VideoCard.jsx`, `source/main/src/components/sections/VideoModal.jsx`, `Featured.jsx`, `LatestVideos.jsx`
- Test: `source/main/src/components/sections/__tests__/videos.test.jsx`

**Interfaces:**
- Consumes: `videos.json` (Task 7), `formatViews`/`timeAgo` (Task 4), `Section`/`Card`/`Button` (Task 8)
- Produces:
  - `<VideoCard video onPlay />` — thumbnail `https://i.ytimg.com/vi/<id>/hqdefault.jpg` (`loading="lazy"`), title, optional date/views, anchor to the watch URL, click calls `onPlay(video)` and prevents navigation
  - `<VideoModal video onClose />` — `role="dialog"`, `aria-modal`, iframe `https://www.youtube-nocookie.com/embed/<id>?autoplay=1`, Esc/✕/backdrop close
  - `<Featured videos />`, `<LatestVideos videos updatedAt />` — both accept props so tests can drive them; `App` passes the imported JSON

- [ ] **Step 1: Write the failing test**

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Featured from '../Featured.jsx';
import LatestVideos from '../LatestVideos.jsx';

const video = { id: 'ccccccccccc', title: 'Top 5 AI tools in Bangla', published: '2026-09-07T00:00:00Z', views: 1200 };

it('renders nothing when there are no featured videos', () => {
  const { container } = render(<Featured videos={[]} />);
  expect(container).toBeEmptyDOMElement();
});

it('shows the coming-soon panel when there are no latest videos', () => {
  render(<LatestVideos videos={[]} updatedAt="2026-09-12T00:30:00Z" />);
  expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: /subscribe/i }).length).toBeGreaterThan(0);
});

it('shows video cards with date and views', () => {
  render(<LatestVideos videos={[video]} updatedAt="2026-09-12T00:30:00Z" />);
  expect(screen.getByText(video.title)).toBeInTheDocument();
  expect(screen.getByText(/1\.2K views/)).toBeInTheDocument();
  expect(screen.getByRole('img', { name: video.title }))
    .toHaveAttribute('src', 'https://i.ytimg.com/vi/ccccccccccc/hqdefault.jpg');
});

it('opens and closes the player', async () => {
  render(<LatestVideos videos={[video]} updatedAt="2026-09-12T00:30:00Z" />);
  await userEvent.click(screen.getByRole('link', { name: new RegExp(video.title, 'i') }));
  const dialog = screen.getByRole('dialog');
  expect(dialog).toHaveAttribute('aria-modal', 'true');
  expect(document.querySelector('iframe')).toHaveAttribute(
    'src', 'https://www.youtube-nocookie.com/embed/ccccccccccc?autoplay=1'
  );
  await userEvent.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run it, expect failure**
- [ ] **Step 3: Implement** — `LatestVideos` owns the `active` video state and renders `VideoModal` when set; grid 1/2/3 columns; section footer shows `Updated ${timeAgo(updatedAt)}` and a "See all on YouTube" button; modal locks `document.body.style.overflow`, restores focus to the trigger on close, and removes its Esc listener on unmount.
- [ ] **Step 4: Run tests** → pass
- [ ] **Step 5: Report changed files**

---

### Task 13: Assemble the page

**Files:**
- Modify: `source/main/src/App.jsx`, `source/main/src/__tests__/smoke.test.jsx`

**Interfaces:**
- Consumes: everything above
- Produces: the full page in section order from spec §3

- [ ] **Step 1: Update the smoke test**

```jsx
import { render, screen } from '@testing-library/react';
import App from '../App.jsx';

it('renders every section heading in order', () => {
  render(<App />);
  ['What you', 'Latest videos', 'Our Vibe', 'Follow'].forEach((text) => {
    expect(screen.getByRole('heading', { name: new RegExp(text, 'i') })).toBeInTheDocument();
  });
  expect(screen.getByRole('link', { name: /skip to content/i })).toHaveAttribute('href', '#main');
});
```

- [ ] **Step 2: Run it, expect failure**
- [ ] **Step 3: Implement `App.jsx`** — skip link, `Navbar`, `main#main` containing Hero, CategoryRibbon, Categories, Featured, LatestVideos, About, Follow, then `Footer`; import `videos.json` and pass `videos.featured`, `videos.latest`, `videos.updatedAt`.
- [ ] **Step 4: Run all tests** → pass
- [ ] **Step 5: Report changed files**

---

### Task 14: Assets, metadata, robots and sitemap

**Files:**
- Create: `source/main/public/logo.png`, `favicon.png`, `apple-touch-icon.png`, `og-image.png`, `robots.txt`, `sitemap.xml`
- Modify: `source/main/index.html`

**Interfaces:**
- Produces: static assets referenced by `Navbar`, `Footer`, `Hero` and the document head

- [ ] **Step 1: Generate the images** with Python/PIL from the existing brand files

```python
from PIL import Image
src = '/home/bs01182/Downloads/Youtube/'
dst = '/home/bs01182/Downloads/Youtube/banglavibedaily.github.io/source/main/public/'
logo = Image.open(src + 'bangla-vibe-daily-logo.png').convert('RGBA')
logo.save(dst + 'logo.png')
logo.resize((64, 64), Image.LANCZOS).save(dst + 'favicon.png')
logo.resize((180, 180), Image.LANCZOS).save(dst + 'apple-touch-icon.png')
art = Image.open(src + 'bangla-vibe-daily-youtube-channel-art-2560x1440.png').convert('RGB')
art.crop((280, 400, 2280, 1450 - 400)).resize((1200, 630), Image.LANCZOS).save(dst + 'og-image.png')
```

Check `og-image.png` by eye: the wordmark and tagline must be inside the frame. Adjust the crop box and re-run if not.

- [ ] **Step 2: Write `index.html` head** — `lang="en"`, title `Bangla Vibe Daily — বাংলার ভাইব, বিশ্বের গল্প`, meta description (the pitch), canonical `https://banglavibedaily.github.io/`, `og:type/title/description/image/url` (absolute image URL), `twitter:card=summary_large_image`, `theme-color #06110C`, favicon and apple-touch-icon links.

- [ ] **Step 3: Write `robots.txt` and `sitemap.xml`**

```
User-agent: *
Allow: /
Sitemap: https://banglavibedaily.github.io/sitemap.xml
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://banglavibedaily.github.io/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
</urlset>
```

- [ ] **Step 4: Verify** — `npm run build` succeeds and `dist/` contains all five public files.
- [ ] **Step 5: Report changed files**

---

### Task 15: Development container

**Files:**
- Create: `container/main/Dockerfile`, `container/main/compose.yml`, `container/main/.env.example`, `container/main/.envs/app.env.example`

**Interfaces:**
- Produces: `docker compose -f container/main/compose.yml up` → dev server on `${APP_PORT:-5173}`

- [ ] **Step 1: Write the Dockerfile**

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY --chown=node:node package.json package-lock.json* ./
RUN npm install
COPY --chown=node:node . .
USER node
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

- [ ] **Step 2: Write `compose.yml`**

```yaml
services:
  app:
    build:
      context: ../../source/main
      dockerfile: ../../container/main/Dockerfile
    env_file: [.envs/app.env]
    environment:
      NODE_ENV: ${NODE_ENV:-development}
    ports: ["${APP_PORT:-5173}:5173"]
    volumes:
      - ../../source/main:/app
      - /app/node_modules
    command: npm run dev -- --host 0.0.0.0
```

- [ ] **Step 3: Write the env examples**

`.env.example`:

```dotenv
APP_PORT=5173
NODE_ENV=development
```

`.envs/app.env.example`:

```dotenv
VITE_SITE_URL=https://banglavibedaily.github.io
```

- [ ] **Step 4: Validate without the daemon** — `cp container/main/.env.example container/main/.env`, `cp container/main/.envs/app.env.example container/main/.envs/app.env`, then `docker compose -f container/main/compose.yml config` → prints the resolved config with no errors. (Building the image needs daemon access: `sudo usermod -aG docker $USER`, then re-login.)
- [ ] **Step 5: Report changed files**

---

### Task 16: Deploy workflow and documentation

**Files:**
- Create: `.github/workflows/deploy.yml`, `README.md`, `CLAUDE.md`

**Interfaces:**
- Produces: the daily + on-push Pages deployment; onboarding docs

- [ ] **Step 1: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  schedule:
    - cron: '30 0 * * *'   # 06:30 Bangladesh time
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

defaults:
  run:
    working-directory: source/main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: source/main/package-lock.json
      - run: npm ci
      - run: npm run fetch:videos
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: source/main/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Write `README.md`** — what the site is; repo map; run with Docker and with plain npm; how to add a featured video (`featured` in `content.js`); how to hide a video (`skip`); never edit `videos.json`; deployment and the daily schedule; the note that GitHub pauses scheduled workflows after 60 days of repository inactivity and one click re-enables them; the GitHub org/repo/Pages setup steps from spec §8.

- [ ] **Step 3: Write `CLAUDE.md`** — repo map, the Docker and npm commands, and the conventions listed in spec §5 (`content.js` is the only place to edit text; `videos.json` is generated; keep deps Node 18-compatible; brand colours come from tokens; no invented audience numbers; skip list keeps third-party uploads out; the user makes all commits).

- [ ] **Step 4: Final verification** — from `source/main`: `npm test` (all green), `npm run build` (succeeds), `npm run preview` and check at desktop width and ~400px, in both dark and light mode, that: hero and orbit render, the ribbon scrolls, all 7 category cards show, the coming-soon panel appears, the theme toggle works, and the mobile menu opens.

- [ ] **Step 5: Report all changed files and the launch steps**

---

## Self-Review

**Spec coverage:** §1 goals → Tasks 10–13; §2 brand/categories → Task 3; §3 layout → Tasks 9–13; §4 visual system → Tasks 2, 8, 10; §5 structure/content model/fetch script/workflow → Tasks 1, 3, 5, 6, 7, 15, 16; §6 SEO/a11y → Tasks 9, 12, 13, 14; §7 testing → every task plus Task 16 step 4; §8 launch → Task 16 step 2.

**Type consistency:** `parseFeed` → `{id,title,published,views}` is consumed unchanged by `applySkip`, `buildVideosFile`, `VideoCard`, `LatestVideos`. Featured entries carry `{id,title}` only, so `VideoCard` must treat `published`/`views` as optional. `buildVideosFile({feedVideos, featuredVideos, previous, now})` is called with exactly those keys in Task 7.

**Known gaps accepted:** Docker image build is unverified until the user's docker group membership is fixed (Task 15 Step 4 validates config only). The workflow itself can only be verified after the first push.
