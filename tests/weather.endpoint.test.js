'use strict';

// Mock node-fetch to avoid ESM issues
jest.mock('node-fetch', () => jest.fn());
// Mock the weather module so fetchWeather is controllable
jest.mock('../server/weather');

const request = require('supertest');
const { fetchWeather } = require('../server/weather');
const app = require('../server');

describe('GET /api/weather', () => {
  const mockWeather = {
    temperature: 32.5,
    description: 'Partly cloudy',
    windSpeed: 10.2,
    humidity: 75,
    highTemp: 35.0,
    lowTemp: 28.0,
  };

  test('responds 200 with weather JSON on success', async () => {
    fetchWeather.mockResolvedValue(mockWeather);
    const res = await request(app).get('/api/weather');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockWeather);
    expect(res.body).toHaveProperty('temperature');
    expect(res.body).toHaveProperty('description');
    expect(res.body).toHaveProperty('windSpeed');
    expect(res.body).toHaveProperty('humidity');
    expect(res.body).toHaveProperty('highTemp');
    expect(res.body).toHaveProperty('lowTemp');
  });

  test('responds 502 when fetchWeather throws', async () => {
    fetchWeather.mockRejectedValue(new Error('API down'));
    const res = await request(app).get('/api/weather');
    expect(res.status).toBe(502);
    expect(res.body).toEqual({ error: 'Weather unavailable' });
  });
});
