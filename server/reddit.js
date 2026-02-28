const express = require('express');
const router = express.Router();

const SUBREDDITS = ['programming', 'technology', 'artificial'];

router.get('/', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const results = await Promise.all(SUBREDDITS.map(async sub => {
      const resp = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=5`, {
        headers: { 'User-Agent': 'DurbinDash/1.0' }
      });
      const data = await resp.json();
      return {
        subreddit: sub,
        posts: (data.data?.children || []).map(c => ({
          title: c.data.title,
          url: 'https://reddit.com' + c.data.permalink,
          score: c.data.score,
          comments: c.data.num_comments
        }))
      };
    }));
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Reddit fetch failed', detail: err.message });
  }
});

module.exports = router;
