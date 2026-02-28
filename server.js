const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 7748;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API routers
const weatherRouter = require('./server/weather');
const newsRouter = require('./server/news');
const redditRouter = require('./server/reddit');
const openclawRouter = require('./server/openclaw');

app.use('/api/weather', weatherRouter);
app.use('/api/news', newsRouter);
app.use('/api/reddit', redditRouter);
app.use('/api/openclaw', openclawRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'durbindash' });
});

app.listen(PORT, () => {
  console.log(`DurbinDash running on http://localhost:${PORT}`);
});

module.exports = app;
