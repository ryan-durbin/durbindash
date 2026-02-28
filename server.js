'use strict';

const express = require('express');
const path = require('path');
const { fetchWeather } = require('./server/weather');
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

const VALID_CATEGORIES = ['ai', 'tech', 'hn'];

app.get('/api/news', async (req, res) => {
  const { category } = req.query;
  if (!category || !VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: 'category must be ai, tech, or hn' });
  }
  try {
    const items = await fetchFeed(category);
    res.json(items);
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch news' });
  }
});

if (require.main === module) app.listen(PORT, () => {
  console.log(`DurbinDash running on http://localhost:${PORT}`);
});

module.exports = app;
