#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { links, featured, skip } from '../src/data/content.js';
import { parseFeed } from './lib/feed.mjs';
import { applySkip, parseVideoId, buildVideosFile } from './lib/videos.mjs';

const OUT = fileURLToPath(new URL('../src/data/videos.json', import.meta.url));
const TIMEOUT = 15_000;
const UA = 'Mozilla/5.0 (compatible; BanglaVibeDailyBot/1.0)';

const RETRIES = 4;
const RETRY_DELAY = 2_000;

const wait = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

// YouTube answers this feed with an intermittent 404 even for valid channels,
// so a single failure means nothing — retry before falling back to cached data.
async function getText(url, attempts = RETRIES) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': UA },
        signal: AbortSignal.timeout(TIMEOUT),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return await res.text();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await wait(attempt * RETRY_DELAY);
    }
  }

  throw lastError;
}

async function readPrevious() {
  try {
    return JSON.parse(await readFile(OUT, 'utf8'));
  } catch {
    return { updatedAt: null, latest: [], featured: [] };
  }
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
  const resolved = [];

  for (const entry of featured) {
    const id = parseVideoId(entry);
    if (!id) {
      console.warn(`[fetch-videos] not a YouTube video, skipping: ${entry}`);
      continue;
    }

    try {
      const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
      const { title } = JSON.parse(await getText(url));
      resolved.push({ id, title });
    } catch (error) {
      const cached = previous.featured?.find((video) => video.id === id);
      if (cached) {
        resolved.push(cached);
        console.warn(`[fetch-videos] lookup failed for ${id}, using cached title`);
      } else {
        console.warn(`[fetch-videos] lookup failed for ${id}, skipping: ${error.message}`);
      }
    }
  }

  return resolved;
}

const previous = await readPrevious();
const feedVideos = await fetchLatest();
const featuredVideos = await fetchFeatured(previous);
const data = buildVideosFile({ feedVideos, featuredVideos, previous, now: new Date() });

await writeFile(OUT, `${JSON.stringify(data, null, 2)}\n`);
console.log(
  `[fetch-videos] ${data.latest.length} latest, ${data.featured.length} featured → src/data/videos.json`
);
