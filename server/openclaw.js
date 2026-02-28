'use strict';

const express = require('express');
const router = express.Router();

const RELEASES_URL = 'https://api.github.com/repos/openclaw/openclaw/releases';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const cache = {
  data: null,
  expiresAt: 0,
};

let _fetch = require('node-fetch');

function setFetch(fn) { _fetch = fn; }

function clearCache() {
  cache.data = null;
  cache.expiresAt = 0;
}

async function fetchReleases() {
  if (cache.data && Date.now() < cache.expiresAt) {
    return cache.data;
  }
  const res = await _fetch(RELEASES_URL);
  if (!res.ok) throw new Error('GitHub API error: ' + res.status);
  const releases = await res.json();
  const data = releases.slice(0, 3).map(r => ({
    tag_name: r.tag_name,
    name: r.name,
    published_at: r.published_at,
    body: (r.body || '').slice(0, 200),
  }));
  cache.data = data;
  cache.expiresAt = Date.now() + CACHE_TTL;
  return data;
}

router.get('/', async (req, res) => {
  try {
    const releases = await fetchReleases();
    res.json({ status: 'ok', app: 'OpenClaw', releases });
  } catch (err) {
    res.status(502).json({ error: 'OpenClaw data unavailable' });
  }
});

module.exports = { router, cache, clearCache, fetchReleases, setFetch };
