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

async function fetchSingleFeed(url, source) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    const parser = new Parser({
      requestOptions: { signal: controller.signal },
    });
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
  const feedConfigs = FEEDS[category];
  if (!feedConfigs) {
    return [];
  }

  const results = await Promise.allSettled(
    feedConfigs.map((fc) => fetchSingleFeed(fc.url, fc.source))
  );

  const items = results.flatMap((result) =>
    result.status === 'fulfilled' ? result.value : []
  );

  items.sort((a, b) => new Date(b.published) - new Date(a.published));

  return items.slice(0, 5);
}

module.exports = { fetchFeed };
