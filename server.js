'use strict';

const express = require('express');
const path = require('path');
const { fetchWeather } = require('./server/weather');

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

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`DurbinDash running on http://localhost:${PORT}`);
  });
}

module.exports = app;
