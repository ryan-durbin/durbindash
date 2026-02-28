'use strict';

const express = require('express');
const router = express.Router();

const GITHUB_URL = 'https://api.github.com/repos/openclaw/openclaw/releases';
const TTL = 3600000;

const cache = { data: null, expiresAt: 0 };

let _fetch = (...args) => require('node-fetch')(...args);

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
  const res = await _fetch(GITHUB_URL, {
    headers: { 'User-Agent': 'DurbinDash/1.0' }
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const releases = await res.json();
  const data = releases.slice(0, 3).map(r => ({
    tag_name: r.tag_name,
    name: r.name,
    published_at: r.published_at,
    body: (r.body || '').slice(0, 200)
  }));
  cache.data = data;
  cache.expiresAt = Date.now() + TTL;
  return data;
}

router.get('/', async (req, res) => {
  try {
    const data = await fetchReleases();
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch OpenClaw releases', detail: err.message });
  }
});

module.exports = { router, cache, clearCache, fetchReleases, setFetch };
