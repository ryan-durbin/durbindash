const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const location = req.query.location || 'Anchorage,AK';
    const url = `https://wttr.in/${encodeURIComponent(location)}?format=j1`;
    const fetch = (await import('node-fetch')).default;
    const resp = await fetch(url, { headers: { 'User-Agent': 'DurbinDash/1.0' } });
    const data = await resp.json();
    const current = data.current_condition[0];
    res.json({
      location,
      temp: current.temp_F,
      feels_like: current.FeelsLikeF,
      description: current.weatherDesc[0].value,
      humidity: current.humidity,
      wind_mph: current.windspeedMiles
    });
  } catch (err) {
    res.status(500).json({ error: 'Weather fetch failed', detail: err.message });
  }
});

module.exports = router;
