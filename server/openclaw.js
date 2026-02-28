'use strict';

const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

const router = express.Router();

const TTL = 3600000; // 1 hour in ms
const cache = { data: null, expiresAt: 0 };

function clearCache() {
  cache.data = null;
  cache.expiresAt = 0;
}

async function fetchReleases() {
  const res = await fetch('https://api.github.com/repos/openclaw/openclaw/releases', {
    headers: { 'User-Agent': 'durbindash/1.0' },
  });
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }
  const releases = await res.json();
  return releases.slice(0, 3).map((r) => ({
    tag_name: r.tag_name,
    name: r.name,
    published_at: r.published_at,
    body: (r.body || '').slice(0, 200),
  }));
}

router.get('/api/openclaw', async (req, res) => {
  try {
    const now = Date.now();
    if (cache.data && now < cache.expiresAt) {
      return res.json(cache.data);
    }
    const data = await fetchReleases();
    cache.data = data;
    cache.expiresAt = now + TTL;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { router, cache, clearCache };
