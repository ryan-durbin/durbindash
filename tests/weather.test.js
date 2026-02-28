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
        time: ['2026-02-28', '2026-03-01', '2026-03-02', '2026-03-03'],
        temperature_2m_max: [35.1, 36.0, 37.5, 34.2],
        temperature_2m_min: [22.8, 23.5, 24.0, 21.0],
        weather_code: [3, 61, 71, 0],
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

    expect(Array.isArray(result.forecast)).toBe(true);
    expect(result.forecast).toHaveLength(3);

    expect(result.forecast[0]).toEqual({
      date: '2026-03-01',
      high: 36.0,
      low: 23.5,
      description: 'Slight rain',
    });
    expect(result.forecast[1]).toEqual({
      date: '2026-03-02',
      high: 37.5,
      low: 24.0,
      description: 'Slight snow',
    });
    expect(result.forecast[2]).toEqual({
      date: '2026-03-03',
      high: 34.2,
      low: 21.0,
      description: 'Clear sky',
    });

    result.forecast.forEach((day) => {
      expect(typeof day.date).toBe('string');
      expect(typeof day.high).toBe('number');
      expect(typeof day.low).toBe('number');
      expect(typeof day.description).toBe('string');
    });
  });

  test('throws on non-ok response', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(fetchWeather()).rejects.toThrow('Open-Meteo error: 500');
  });
});
