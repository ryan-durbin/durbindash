const express = require('express');
const router = express.Router();
const Parser = require('rss-parser');
const parser = new Parser();

const FEEDS = {
  ai: [
    'https://feeds.feedburner.com/venturebeat/SZYF',
    'https://www.technologyreview.com/feed/'
  ],
  tech: [
    'https://feeds.arstechnica.com/arstechnica/technology-lab',
    'https://www.wired.com/feed/rss'
  ],
  hn: ['https://hnrss.org/frontpage']
};

async function fetchFeed(url) {
  try {
    const feed = await parser.parseURL(url);
    return (feed.items || []).slice(0, 8).map(i => ({ title: i.title, link: i.link }));
  } catch { return []; }
}

router.get('/', async (req, res) => {
  try {
    const [ai1, ai2, tech1, tech2, hn] = await Promise.all([
      fetchFeed(FEEDS.ai[0]),
      fetchFeed(FEEDS.ai[1]),
      fetchFeed(FEEDS.tech[0]),
      fetchFeed(FEEDS.tech[1]),
      fetchFeed(FEEDS.hn[0])
    ]);
    res.json({
      ai: [...ai1, ...ai2].slice(0, 8),
      tech: [...tech1, ...tech2].slice(0, 8),
      hn: hn.slice(0, 8)
    });
  } catch (err) {
    res.status(500).json({ error: 'News fetch failed', detail: err.message });
  }
});

module.exports = router;
