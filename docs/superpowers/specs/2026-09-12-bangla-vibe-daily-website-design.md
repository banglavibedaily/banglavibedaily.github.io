# Bangla Vibe Daily — Showcase Website Design

**Date:** 2026-09-12
**Status:** Approved in brainstorming, pending written-spec review
**Live URL (target):** https://banglavibedaily.github.io

---

## 1. Goal

A single-page showcase website for the **Bangla Vibe Daily** YouTube channel and Facebook page. Its one job is to **present the brand and grow the audience**: introduce the channel, show what kind of content it makes, surface videos, and push visitors to subscribe on YouTube and follow on Facebook.

Quality bar: the same level of polish as the owner's portfolio (`rpmshuvo.github.io`), re-skinned in BVD branding.

### Decisions made

| Topic | Decision |
|---|---|
| Purpose | Brand showcase + audience growth (no sponsor/media-kit section, no content hub) |
| Language | English-first with Bangla accents (tagline, category subtitles, a few headings) |
| Videos | Auto-updating **Latest** grid from the YouTube RSS feed + hand-picked **Featured** row |
| Third-party uploads | A **skip list** hides them from Latest; empty state shows "coming soon — subscribe" |
| Hosting | Free GitHub organization `banglavibedaily` → repo `banglavibedaily.github.io` → GitHub Pages |
| Stack | Same as portfolio: React 18 + Vite 5 + Tailwind CSS 3 + Framer Motion, Vitest |

### Non-goals (YAGNI)

- No বাংলা/English language toggle.
- No sponsor / "work with us" section.
- No per-video pages, search, or blog.
- No subscriber or total-view counters (the free feed does not provide them; no fake numbers).
- No automatic Facebook video import (needs Meta developer tokens) — Facebook appears as links/CTA only.
- No backend, CMS, or runtime API calls.
- No analytics in v1.

---

## 2. Brand facts used by the site

- **Name:** Bangla Vibe Daily (BVD)
- **Tagline:** বাংলার ভাইব, বিশ্বের গল্প
- **Pitch:** Interesting stories, amazing facts, inspiring ideas and entertainment — from Bangladesh and around the world. New video every day!
- **YouTube:** https://www.youtube.com/@BanglaVibeDaily — channel ID `UCECjH_U3T2l4SSXiVtBrajQ`
- **Subscribe link:** https://www.youtube.com/@BanglaVibeDaily?sub_confirmation=1
- **Facebook:** https://www.facebook.com/BanglaVibeDaily
- **Feed:** https://www.youtube.com/feeds/videos.xml?channel_id=UCECjH_U3T2l4SSXiVtBrajQ (latest 15 uploads)

### Categories (7)

| id | Emoji | English | Bangla | Blurb |
|---|---|---|---|---|
| `stories` | 🎬 | Stories | গল্প | Real-life tales, legends and stories that stay with you. |
| `facts` | 🧠 | Facts & Knowledge | তথ্য ও জ্ঞান | Surprising facts and easy explainers about how the world works. |
| `ideas` | 💡 | Ideas & Inspiration | আইডিয়া ও অনুপ্রেরণা | Motivation, life lessons and ideas worth trying. |
| `world` | 🌍 | Bangladesh & World | বাংলাদেশ ও বিশ্ব | History, places and people — from Bangladesh to every corner of the globe. |
| `trending` | 🔥 | Trending Topics | আলোচিত বিষয় | What everyone is talking about, explained simply. |
| `entertainment` | 😂 | Entertainment | বিনোদন | Fun, laughter and feel-good moments. |
| `tech` | 🤖 | Technology & AI | প্রযুক্তি ও এআই | Gadgets, apps and AI — what's new and why it matters. |

Each category card also shows a line icon from `react-icons`, mapped by `id`.

### About copy

- **Heading:** Our Vibe — **Bangla heading:** আমাদের ভাইব
- **Paragraph 1:** Bangla Vibe Daily is a home for curious minds. Every day we bring you stories, facts, ideas and entertainment — told in a way that feels close to home.
- **Paragraph 2:** From the rivers of Bangladesh to the latest in technology and AI, we explore what is interesting, inspiring and worth knowing. New content, every single day.

---

## 3. Page layout

Single scrolling page, smooth-scroll anchor navigation, scroll-reveal animations. Order:

1. **Navbar** (sticky) — BVD logo + wordmark; links: Categories · Videos · About · Follow; theme toggle; red **Subscribe** button. Collapses to a menu button on mobile. Active link follows scroll position.
2. **Hero** (`#home`) — "BANGLA **VIBE** DAILY" (VIBE in red, DAILY on a white brush-stroke label); Bangla tagline; one-line pitch; buttons **Subscribe on YouTube** (primary, red) and **Follow on Facebook** (secondary). Right side: BVD logo centred with the 7 category icons orbiting slowly, over a soft red-sun radial glow. Below the buttons a small brush-stroke label: "NEW CONTENT EVERY DAY".
3. **Category ribbon** — infinite marquee of the 7 emoji + English names.
4. **What you'll find** (`#categories`) — responsive grid of 7 category cards (icon, English name, Bangla subtitle, blurb).
5. **Featured** (`#featured`) — hand-picked video cards showing thumbnail and title only (no date/views — oEmbed does not provide them). **Section is not rendered when the featured list is empty.**
6. **Latest videos** (`#videos`) — up to **12** videos from the feed after the skip list, newest first. Card: thumbnail, title, relative date ("2 days ago", computed in the browser), views (shown only when > 0). Footer of section: "Updated <relative time>" + "See all on YouTube" button. **Empty state:** a "New videos coming soon — subscribe 🔔" panel with the Subscribe button.
7. **About / Our vibe** (`#about`) — short brand story, tagline, "new content every day" promise.
8. **Follow us** (`#follow`) — two large cards (YouTube, Facebook) with handle and button. Faint dotted world-map background.
9. **Footer** — logo, nav links, social icons, tagline, © current year.

### Video player modal

Clicking any video card (Featured or Latest) opens a modal with a `https://www.youtube-nocookie.com/embed/<id>?autoplay=1` iframe. The iframe is created only when the modal opens and removed when it closes. Closes via Esc, ✕ button, or backdrop click. Focus moves into the modal on open and returns to the clicked card on close; background scroll is locked while open. Each card also has a real `href` to the YouTube watch URL so it works without JavaScript and via middle-click.

---

## 4. Visual system

**Theme:** dark-first (matches the channel art), light-mode toggle persisted in `localStorage`, initial value from `prefers-color-scheme`. Implemented like the portfolio: Tailwind `darkMode: 'class'`, colours as CSS variables consumed by Tailwind tokens.

| Token | Dark | Light | Use |
|---|---|---|---|
| `--bg` | `#06110C` | `#F7F5EF` | page background |
| `--surface` | `#0D1F17` | `#FFFFFF` | cards, tiles |
| `--border` | `#1E3A2C` | `#DCE3DC` | hairlines |
| `--text` | `#EEF3EF` | `#0B2418` | body |
| `--muted` | `#9DB3A6` | `#4E6558` | secondary text |
| `--red` | `#E30B1F` | `#E30B1F` | "VIBE", primary buttons, play icon |
| `--green` | `#2E8B57` | `#0B5D3B` | accents, glows, category icons |
| `--yellow` | `#EEE20C` | *(maps to `--green`)* | Bangla tagline, small highlights |

Colours sampled from the existing logo, channel art and Facebook cover.

**Contrast rules:** red is used only behind white text or for large display text; yellow is never used on the light background; body text meets WCAG AA in both themes.

**Fonts** (self-hosted via `@fontsource`):
- **Oswald** 500/700 — display headlines (condensed, matches channel art).
- **Inter** 400/500/600 — English UI and body.
- **Hind Siliguri** 400/600 — all Bangla text (applied via a `font-bangla` utility and `lang="bn"` spans).

**Brand motifs:** white brush-stroke label shape (inline SVG/CSS mask) behind "DAILY" and "NEW CONTENT EVERY DAY"; red-sun radial glow in the hero; faint dotted world map (inline SVG pattern) in the Follow section.

**Motion** (Framer Motion + CSS keyframes): section fade-up on scroll, orbiting category icons, marquee ribbon, card hover lift with red play overlay, modal fade/scale. All motion is disabled under `prefers-reduced-motion: reduce` (orbit and marquee stop; reveals render immediately).

**Responsive:** mobile-first; hero stacks (orbit visual below text, smaller) under `md`; category grid 1 → 2 → 3/4 columns; video grid 1 → 2 → 3 columns.

---

## 5. Architecture

### Project structure

Local folder and **GitHub repo name are both `banglavibedaily.github.io`** — the repo name must match the organization for the site to serve from the domain root.

```
banglavibedaily.github.io/
├── README.md                        # setup, commands, deploy, how to edit content
├── CLAUDE.md                        # repo map + conventions for future Claude sessions
├── .gitignore
├── .github/workflows/deploy.yml     # must stay at repo root (GitHub requirement)
├── docs/superpowers/{specs,plans}/
├── container/
│   └── main/
│       ├── Dockerfile               # Node 22 dev image for the web app
│       ├── compose.yml
│       ├── .env.example             # compose-level vars (copy → .env)
│       └── .envs/
│           └── app.env.example      # app runtime vars (copy → app.env)
└── source/
    └── main/                        # the Vite app (npm project root)
        ├── public/
        │   ├── logo.png             # BVD logo (from Youtube/bangla-vibe-daily-logo.png)
        │   ├── favicon.png          # 64×64 from logo
        │   ├── apple-touch-icon.png # 180×180 from logo
        │   ├── og-image.png         # 1200×630 PNG from channel art
        │   ├── robots.txt
        │   └── sitemap.xml
        ├── scripts/
        │   ├── fetch-videos.mjs     # CLI entry: fetch → transform → write videos.json
        │   └── lib/
        │       ├── feed.mjs         # parseFeed(xml) → video[]; normaliseTitle
        │       ├── videos.mjs       # applySkip, parseVideoId, buildVideosFile
        │       └── __tests__/       # unit tests + fixtures/feed.xml (real feed snapshot)
        ├── src/
        │   ├── main.jsx, App.jsx, index.css
        │   ├── data/
        │   │   ├── content.js       # hand-edited: text, links, categories, featured, skip
        │   │   ├── videos.json      # generated; committed snapshot = fallback
        │   │   └── __tests__/content.test.js
        │   ├── lib/format.js        # formatViews, timeAgo
        │   └── components/
        │       ├── hooks/           # useTheme, useInView, useScrollSpy
        │       ├── layout/          # Container, Section, Navbar, ThemeToggle, Footer
        │       ├── ui/              # Button, Card, SectionHeading, BrushLabel,
        │       │                    # SocialLinks, VideoCard
        │       └── sections/        # Hero, CategoryRibbon, Categories, Featured,
        │                            # LatestVideos, About, Follow, VideoModal
        ├── index.html, package.json, vite.config.js, tailwind.config.js
        └── postcss.config.js, vitest.setup.js
```

The `source/main` and `container/main` naming leaves room for a second service later (e.g. `source/api`) without moving anything.

Layout, hooks and UI primitives are adapted from the portfolio (copied and re-themed, not shared as a package).

### Development environment — `container/main/`

Docker is the supported way to develop: the host runs Node 18.19, while the image runs **Node 22**, matching CI.

- **`Dockerfile`** — `node:22-alpine`, non-root `node` user, `WORKDIR /app`, `npm ci` at build, `EXPOSE 5173`, default `CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]`.
- **`compose.yml`** — one service, `app`:
  - `build: { context: ../../source/main, dockerfile: ../../container/main/Dockerfile }`
  - volumes: `../../source/main:/app` plus an anonymous volume on `/app/node_modules`, so host `node_modules` (built on Node 18) never shadow the container's.
  - `ports: ["${APP_PORT:-5173}:5173"]`
  - `env_file: [.envs/app.env]`
- **`.env.example`** → `APP_PORT=5173`, `NODE_ENV=development` (compose-level; copy to `.env`).
- **`.envs/app.env.example`** → `VITE_SITE_URL=https://banglavibedaily.github.io` (app-level; copy to `app.env`).
- Real `.env` / `app.env` files are gitignored; only the `.example` files are committed.

Commands (from the repo root):

```bash
docker compose -f container/main/compose.yml up            # dev server → http://localhost:5173
docker compose -f container/main/compose.yml run --rm app npm test
docker compose -f container/main/compose.yml run --rm app npm run fetch:videos
docker compose -f container/main/compose.yml run --rm app npm run build
```

Running directly on the host with Node 18.19 also works (`cd source/main && npm install && npm run dev`); CI does not use Docker.

### `CLAUDE.md`

Committed at the repo root so future sessions start with the right context: repo map, the Docker and npm commands above, and the conventions that matter — `content.js` is the single source of truth for text, `videos.json` is generated and must never be hand-edited, dependencies stay Node 18-compatible, brand colours come from the CSS variable tokens, no invented audience numbers, and third-party uploads stay filtered by the skip list.

### Content model — `src/data/content.js`

Plain ES module with **no JSX or asset imports**, so both the React app and the Node fetch script can import it.

```js
export const site = { name, tagline, taglineBn, pitch, url };
export const links = { youtube, subscribe, facebook, channelId, feedUrl };
export const nav = [{ id: 'categories', label: 'Categories' }, /* … */];
export const categories = [{ id, emoji, name, nameBn, blurb }]; // 7 entries, §2
export const about = { heading, headingBn, paragraphs: [] };
export const featured = [];            // YouTube URLs or IDs, in display order
export const skip = {
  titleKeywords: ['infobells', 'movkidz'], // case-insensitive substring match on title
  videoIds: [],                             // exact IDs or URLs to hide
};
```

`featured` accepts `https://www.youtube.com/watch?v=ID`, `https://youtu.be/ID`, `https://www.youtube.com/shorts/ID`, or a bare 11-character ID. The skip list applies to **Latest only**; Featured is an explicit choice and is never filtered.

Category icons are mapped by `id` inside `Categories.jsx` (keeps `content.js` free of React imports).

### Generated data — `src/data/videos.json`

```json
{
  "updatedAt": "2026-09-12T00:30:00.000Z",
  "latest":   [{ "id": "…", "title": "…", "published": "ISO date", "views": 17 }],
  "featured": [{ "id": "…", "title": "…" }]
}
```

Thumbnails are derived from the ID in the UI (`https://i.ytimg.com/vi/<id>/hqdefault.jpg`, `loading="lazy"`), so they are not stored.

### Fetch script — `scripts/fetch-videos.mjs`

Run with `npm run fetch:videos`. Steps:

1. Fetch the feed URL (15 s timeout, browser-like `User-Agent`).
2. `parseFeed(xml)` with `fast-xml-parser` → `{ id, title, published, views }[]`. `normaliseTitle` collapses repeated whitespace.
3. `applySkip(videos, skip)` → drop keyword/ID matches; sort newest first; keep first 12.
4. For each `featured` entry: `parseVideoId`, then YouTube oEmbed (`https://www.youtube.com/oembed?url=<watch-url>&format=json`) for the title.
5. `buildVideosFile` → write `src/data/videos.json` (pretty-printed) with `updatedAt = now`.

**Error handling**

| Failure | Behaviour |
|---|---|
| Feed request fails (network, timeout, non-200) or XML fails to parse | Log a warning; keep the existing `latest` array and its `updatedAt`; exit 0 so the build still deploys |
| Feed parses with 0 entries | Valid result: `latest` becomes `[]` (UI shows the coming-soon panel) |
| A featured entry is not a valid URL/ID | Log a warning; skip it |
| oEmbed lookup fails for a featured video | Reuse that video's entry from the previous `videos.json` if present; otherwise skip it with a warning |
| `videos.json` missing or corrupt when read as fallback | Treat previous data as `{ latest: [], featured: [] }` |

The script never exits non-zero for data problems; it exits non-zero only for programming errors (e.g. `content.js` fails to import), which should fail CI.

### Deploy workflow — `.github/workflows/deploy.yml`

- **Triggers:** push to `main`; `schedule: cron '30 0 * * *'` (00:30 UTC = 06:30 Bangladesh time); `workflow_dispatch`.
- **Build job:** checkout → Node 22 + npm cache (`cache-dependency-path: source/main/package-lock.json`) → `npm ci` → `npm run fetch:videos` → `npm test` → `npm run build` → upload `source/main/dist` as Pages artifact. Every npm step runs with `working-directory: source/main` (set once via `defaults.run.working-directory`).
- **Deploy job:** `actions/deploy-pages`.
- Permissions `contents: read, pages: write, id-token: write`; concurrency group `pages`.
- The workflow does **not** commit the refreshed `videos.json` back; the committed snapshot is only a fallback. To refresh the committed snapshot, run `npm run fetch:videos` locally and commit.
- README documents that GitHub pauses scheduled workflows after 60 days without repository activity, and how to re-enable them.

`vite.config.js` uses `base: '/'` (user/organization Pages site served at the domain root).

**Node versions:** the Docker dev image and CI both run Node **22**. The host machine runs Node **18.19.1**, which also works (Vite 5, Vitest 1 and the built-in `fetch` used by the script all support it), so dependency versions must stay Node 18-compatible — no Vite 6+/Vitest 2+ upgrades unless the host Node is upgraded.

---

## 6. SEO, sharing, accessibility

- `index.html`: `lang="en"`, title "Bangla Vibe Daily — বাংলার ভাইব, বিশ্বের গল্প", meta description (the pitch), canonical URL, Open Graph + Twitter card tags pointing to `og-image.png` (PNG, 1200×630), theme-color `#06110C`, favicon + apple-touch-icon.
- `robots.txt` allowing all + sitemap link; `sitemap.xml` with the root URL.
- Semantic landmarks (`header`, `nav`, `main`, `section` with headings, `footer`); a "Skip to content" link.
- All images have `alt` text; decorative SVGs are `aria-hidden`.
- Theme toggle and mobile menu button have accessible names and `aria-expanded`/`aria-pressed` state.
- Modal: `role="dialog"`, `aria-modal="true"`, labelled by the video title, focus handling as in §3.
- External links open in a new tab with `rel="noopener noreferrer"`.

---

## 7. Testing

**Vitest + React Testing Library + jsdom** (same setup as portfolio).

Unit (Node-side, `scripts/lib/__tests__`):
- `parseFeed` on a saved snapshot of the real BVD feed → 15 videos with correct id/title/published/views; malformed XML throws.
- `normaliseTitle` collapses whitespace.
- `applySkip` removes keyword matches case-insensitively and exact ID/URL matches; keeps others; caps at 12; sorts newest first.
- `parseVideoId` handles watch, youtu.be, shorts URLs and bare IDs; returns `null` for invalid input.
- `buildVideosFile` fallback rules from the error-handling table (feed failure keeps previous `latest`; oEmbed failure reuses previous featured entry).

Data:
- `content.test.js`: required fields present, exactly 7 categories with unique ids and Bangla names, links are https, `skip` shape valid, every `featured` entry parses to an ID.

Components:
- `LatestVideos` renders cards when videos exist and the coming-soon panel when empty.
- `Featured` renders nothing when the list is empty.
- `VideoModal` opens on card click with the correct embed URL, closes on Esc and ✕.
- `formatViews` / `timeAgo` unit tests.
- Smoke: `App` renders all section headings.

Final verification: `npm test`, `npm run build`, `npm run preview` and a visual check at desktop and ~400 px widths in both themes.

---

## 8. Launch steps (owner actions)

1. On GitHub: **+ → New organization → Free**, name `banglavibedaily`.
2. In the org: new **public** repo named exactly `banglavibedaily.github.io` (no README) — the name must match the org for the site to serve from `https://banglavibedaily.github.io`.
3. Push the local project to `main` (`git remote add origin https://github.com/banglavibedaily/banglavibedaily.github.io.git && git push -u origin main`).
4. Repo **Settings → Pages → Source: GitHub Actions**.
5. First deploy runs on push; site live at https://banglavibedaily.github.io.
6. Add the site URL to the YouTube channel links and the Facebook page links.

Later (optional): buy `banglavibedaily.com` and add it as a custom domain in Pages settings.
