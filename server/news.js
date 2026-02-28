'use strict';

const Parser = require('rss-parser');

const FEEDS = {
  ai: [
    { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', source: 'TechCrunch AI' },
  ],
  tech: [
    { url: 'https://feeds.arstechnica.com/arstechnica/index', source: 'Ars Technica' },
    { url: 'https://www.theverge.com/rss/index.xml', source: 'The Verge' },
  ],
  hn: [
    { url: 'https://hnrss.org/frontpage', source: 'Hacker News' },
  ],
};

const CACHE_TTL = 1800000; // 30 minutes
const cache = new Map();

async function fetchSingleFeed(url, source) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const parser = new Parser({ requestOptions: { signal: controller.signal } });
    const feed = await parser.parseURL(url);
    return (feed.items || []).map((item) => ({
      title: item.title || '',
      url: item.link || '',
      source,
      published: item.isoDate || (item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString()),
    }));
  } finally {
    clearTimeout(timer);
  }
}

async function fetchFeed(category) {
  const cached = cache.get(category);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return cached.data;
  }
  const feedConfigs = FEEDS[category];
  if (!feedConfigs) return [];
  const results = await Promise.allSettled(feedConfigs.map((fc) => fetchSingleFeed(fc.url, fc.source)));
  const items = results.flatMap((r) => r.status === 'fulfilled' ? r.value : []);
  items.sort((a, b) => new Date(b.published) - new Date(a.published));
  const data = items.slice(0, 5);
  cache.set(category, { data, fetchedAt: Date.now() });
  return data;
}

function clearCache() { cache.clear(); }

function getCacheAge(category) {
  const cached = cache.get(category);
  if (!cached) return null;
  return Date.now() - cached.fetchedAt;
}

module.exports = { fetchFeed, clearCache, getCacheAge };
