'use strict';

// Mock node-fetch with a factory (avoids importing the ESM module)
jest.mock('node-fetch', () => jest.fn());
const fetch = require('node-fetch');
const { fetchWeather, getDescription } = require('../server/weather');

describe('getDescription - WMO code mapping', () => {
  test('code 0 => Clear sky', () => expect(getDescription(0)).toBe('Clear sky'));
  test('code 1 => Mainly clear', () => expect(getDescription(1)).toBe('Mainly clear'));
  test('code 2 => Partly cloudy', () => expect(getDescription(2)).toBe('Partly cloudy'));
  test('code 3 => Overcast', () => expect(getDescription(3)).toBe('Overcast'));
  test('code 45 => Fog', () => expect(getDescription(45)).toBe('Fog'));
  test('code 51 => Light drizzle', () => expect(getDescription(51)).toBe('Light drizzle'));
  test('code 61 => Slight rain', () => expect(getDescription(61)).toBe('Slight rain'));
  test('code 71 => Slight snow', () => expect(getDescription(71)).toBe('Slight snow'));
  test('code 80 => Slight rain showers', () => expect(getDescription(80)).toBe('Slight rain showers'));
  test('code 95 => Thunderstorm', () => expect(getDescription(95)).toBe('Thunderstorm'));
  test('unknown code => Unknown', () => expect(getDescription(999)).toBe('Unknown'));
});

describe('fetchWeather', () => {
  test('returns normalized weather object', async () => {
    const mockData = {
      current: {
        temperature_2m: 28.4,
        relative_humidity_2m: 75,
        wind_speed_10m: 12.3,
        weather_code: 3,
      },
      daily: {
        temperature_2m_max: [35.1],
        temperature_2m_min: [22.8],
      },
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchWeather();

    expect(result).toMatchObject({
      temperature: 28.4,
      description: 'Overcast',
      windSpeed: 12.3,
      humidity: 75,
      highTemp: 35.1,
      lowTemp: 22.8,
    });
  });

  test('throws on non-ok response', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(fetchWeather()).rejects.toThrow('Open-Meteo error: 500');
  });
});
