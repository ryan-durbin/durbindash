'use strict';

const fetch = require('node-fetch');

const WMO_CODES = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Icy fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  67: 'Freezing rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Thunderstorm with heavy hail',
};

function getDescription(code) {
  if (WMO_CODES[code] !== undefined) return WMO_CODES[code];
  if (code >= 1 && code <= 3) return 'Partly cloudy';
  if (code >= 45 && code <= 48) return 'Fog';
  if (code >= 51 && code <= 67) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if (code >= 85 && code <= 86) return 'Snow showers';
  return 'Unknown';
}

const WEATHER_URL =
  'https://api.open-meteo.com/v1/forecast' +
  '?latitude=61.2181&longitude=-149.9003' +
  '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code' +
  '&daily=temperature_2m_max,temperature_2m_min,weather_code' +
  '&temperature_unit=fahrenheit&wind_speed_unit=mph' +
  '&timezone=America%2FAnchorage&forecast_days=4';

async function fetchWeather() {
  const res = await fetch(WEATHER_URL);
  if (!res.ok) throw new Error('Open-Meteo error: ' + res.status);
  const data = await res.json();

  const current = data.current;
  const daily = data.daily;

  const forecast = [1, 2, 3].map((i) => ({
    date: daily.time[i],
    high: daily.temperature_2m_max[i],
    low: daily.temperature_2m_min[i],
    description: getDescription(daily.weather_code[i]),
  }));

  return {
    temperature: current.temperature_2m,
    description: getDescription(current.weather_code),
    windSpeed: current.wind_speed_10m,
    humidity: current.relative_humidity_2m,
    highTemp: daily.temperature_2m_max[0],
    lowTemp: daily.temperature_2m_min[0],
    forecast,
  };
}

module.exports = { fetchWeather, getDescription };
