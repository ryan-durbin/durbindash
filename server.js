'use strict';

const express = require('express');
const path = require('path');
const { router: openclawRouter } = require('./server/openclaw');
const { getSubredditPosts, ALLOWED_SUBREDDITS } = require('./server/reddit');

const app = express();
const PORT = process.env.PORT || 7748;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'durbindash' });
});

app.get('/api/reddit', async (req, res) => {
  const sub = req.query.sub;
  if (!sub || !ALLOWED_SUBREDDITS.includes(sub)) {
    return res.status(400).json({ error: `Invalid or missing sub. Allowed: ${ALLOWED_SUBREDDITS.join(', ')}` });
  }
  try {
    const posts = await getSubredditPosts(sub);
    res.json(posts);
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch Reddit data' });
  }
});

app.use(openclawRouter);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log('DurbinDash running on http://localhost:' + PORT);
  });
}

module.exports = app;
