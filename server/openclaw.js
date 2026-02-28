'use strict';

const express = require('express');

const router = express.Router();

const GITHUB_RELEASES_URL = 'https://api.github.com/repos/openclaw/openclaw/releases';
const TTL = 3600000; // 1 hour in ms

const cache = {
  data: null,
  expiresAt: 0,
};

let _fetch = null;

async function getFetch() {
  if (!_fetch) {
    const mod = await import('node-fetch');
    _fetch = mod.default;
  }
  return _fetch;
}

function setFetch(fn) {
  _fetch = fn;
}

function clearCache() {
  cache.data = null;
  cache.expiresAt = 0;
}

async function fetchReleases() {
  if (cache.data && Date.now() < cache.expiresAt) {
    return cache.data;
  }

  const fetchFn = await getFetch();
  const res = await fetchFn(GITHUB_RELEASES_URL, {
    headers: { 'User-Agent': 'durbindash/1.0' },
  });

  if (!res.ok) {
    throw new Error('GitHub API error: ' + res.status);
  }

  const releases = await res.json();

  const data = releases.slice(0, 3).map((r) => ({
    tag_name: r.tag_name,
    name: r.name,
    published_at: r.published_at,
    body: (r.body || '').slice(0, 200),
  }));

  cache.data = data;
  cache.expiresAt = Date.now() + TTL;

  return data;
}

router.get('/api/openclaw', async (req, res) => {
  try {
    const data = await fetchReleases();
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch OpenClaw releases' });
  }
});

module.exports = { router, cache, clearCache, fetchReleases, setFetch };
