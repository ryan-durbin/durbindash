'use strict';

const express = require('express');
const path = require('path');
const { fetchWeather } = require('./server/weather');
const { getSubredditPosts, ALLOWED_SUBREDDITS } = require('./server/reddit');
const { fetchFeed } = require('./server/news');


const app = express();
const PORT = process.env.PORT || 7748;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'durbindash' });
});

app.get('/api/weather', async (req, res) => {
  try {
    const weather = await fetchWeather();
    res.json(weather);
  } catch (err) {
    res.status(502).json({ error: 'Weather unavailable' });
  }
});

app.get('/api/reddit', async (req, res) => {
  const { sub } = req.query;
  if (!sub || !ALLOWED_SUBREDDITS.includes(sub)) {
    return res.status(400).json({ error: `sub must be one of: ${ALLOWED_SUBREDDITS.join(', ')}` });
  }
  try {
    const posts = await getSubredditPosts(sub);
    res.json(posts);
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch Reddit data' });
  }
});


app.get('/api/news', async (req, res) => {
  const { category } = req.query;
  const VALID = ['ai', 'tech', 'hn'];
  if (!category || !VALID.includes(category)) {
    return res.status(400).json({ error: `category must be one of: ${VALID.join(', ')}` });
  }
  try {
    const items = await fetchFeed(category);
    res.json(items);
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch news' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`DurbinDash running on http://localhost:${PORT}`);
  });
}

module.exports = app;
