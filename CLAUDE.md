# CLAUDE.md — Bangla Vibe Daily website

Showcase SPA for the Bangla Vibe Daily YouTube channel and Facebook page.
Live at https://banglavibedaily.github.io (GitHub Pages, org `banglavibedaily`,
repo must be named `banglavibedaily.github.io`).

Design spec: `docs/superpowers/specs/2026-09-12-bangla-vibe-daily-website-design.md`
Implementation plan: `docs/superpowers/plans/2026-09-12-bangla-vibe-daily-website.md`

## Layout

- `source/main/` — the Vite app; **every npm command runs from here**.
- `container/main/` — Node 22 dev container (`Dockerfile`, `compose.yml`, env examples).
- `.github/workflows/deploy.yml` — daily + on-push deploy (must stay at repo root).

## Commands

```bash
cd source/main && npm run dev      # dev server
cd source/main && npm test         # Vitest suite
cd source/main && npm run build    # production build
cd source/main && npm run fetch:videos   # regenerate src/data/videos.json

docker compose -f container/main/compose.yml up                    # dev in Node 22
docker compose -f container/main/compose.yml run --rm app npm test
```

## Conventions

- **The user makes all git commits.** Never run `git commit`, `git push` or `git add`.
  Report what changed and stop.
- **`src/data/content.js` is the single source of truth** for site text, links, the 7 categories,
  the `featured` list and the `skip` list. It must stay free of React and asset imports —
  the Node fetch script imports it.
- **`src/data/videos.json` is generated.** Never hand-edit it.
- **Node 18 compatibility is required** (host runs 18.19; container and CI run 22).
  Do not upgrade to Vite 6+ or Vitest 2+ without upgrading the host.
- **Colours come from the CSS variable tokens** in `src/index.css`, exposed as Tailwind classes
  (`bg`, `surface`, `border`, `body`, `muted`, `red`, `green`, `yellow`). Never hard-code hex
  values in components. Red is only used behind white text or large display type;
  yellow is never used on the light background.
- **Bangla text** uses `font-bangla` (Hind Siliguri) and `lang="bn"`.
- **All motion** must stay disabled under `prefers-reduced-motion` (handled globally in
  `index.css` and via Framer Motion's `useReducedMotion`).
- **No invented audience numbers.** The free feed has no subscriber or total-view data, so the
  site shows none. Per-video view counts come from the feed and are real.
- **The skip list keeps third-party uploads off the site.** `infobells`, `movkidz` and `rhyme`
  are there deliberately — the channel re-uploaded other creators' nursery rhymes, and those
  must not appear on the brand site.
- Tests live next to the code in `__tests__/` folders. Node-side script tests start with
  `// @vitest-environment node`.
