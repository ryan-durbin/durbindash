'use strict';

const express = require('express');
const Parser = require('rss-parser');

const router = express.Router();

const AI_FEEDS = [
  { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', source: 'TechCrunch AI' },
  { url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed', source: 'MIT Technology Review' },
  { url: 'https://venturebeat.com/category/ai/feed/', source: 'VentureBeat AI' },
];

async function fetchFeed(parser, feed) {
  try {
    const result = await parser.parseURL(feed.url);
    return (result.items || []).map(item => ({
      title: item.title || '',
      url: (item.link || '').toLowerCase().trim(),
      date: item.isoDate || item.pubDate || '',
      source: feed.source,
    }));
  } catch (err) {
    console.error(`Failed to fetch feed ${feed.source}: ${err.message}`);
    return [];
  }
}

async function getAINews(parserOverride) {
  const parser = parserOverride || new Parser();
  const results = await Promise.all(AI_FEEDS.map(f => fetchFeed(parser, f)));
  const allItems = results.flat();

  const seen = new Set();
  const deduped = [];
  for (const item of allItems) {
    if (item.url && !seen.has(item.url)) {
      seen.add(item.url);
      deduped.push(item);
    }
  }

  deduped.sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : 0;
    const db = b.date ? new Date(b.date).getTime() : 0;
    return db - da;
  });

  return deduped.slice(0, 8);
}

router.get('/api/news', async (req, res) => {
  if (req.query.category !== 'ai') {
    return res.status(400).json({ error: 'Unsupported category. Use ?category=ai' });
  }
  try {
    const items = await getAINews();
    res.json(items);
  } catch (err) {
    console.error('News aggregator error:', err);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

module.exports = router;
module.exports.getAINews = getAINews;
