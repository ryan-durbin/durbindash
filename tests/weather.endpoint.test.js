'use strict';

const request = require('supertest');

// Mock the weather module BEFORE requiring app
jest.mock('../server/weather', () => ({
  fetchWeather: jest.fn(),
  getDescription: jest.fn(),
}));

const { fetchWeather } = require('../server/weather');
const app = require('../server.js');

describe('GET /api/weather', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 with weather JSON when fetchWeather succeeds', async () => {
    const mockData = {
      temperature: 32.5,
      description: 'Partly cloudy',
      windSpeed: 10.2,
      humidity: 75,
      highTemp: 38.0,
      lowTemp: 28.0,
    };
    fetchWeather.mockResolvedValue(mockData);

    const res = await request(app).get('/api/weather');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
    expect(res.body).toHaveProperty('temperature');
    expect(res.body).toHaveProperty('description');
    expect(res.body).toHaveProperty('windSpeed');
    expect(res.body).toHaveProperty('humidity');
    expect(res.body).toHaveProperty('highTemp');
    expect(res.body).toHaveProperty('lowTemp');
  });

  it('returns 502 with error JSON when fetchWeather throws', async () => {
    fetchWeather.mockRejectedValue(new Error('Network error'));

    const res = await request(app).get('/api/weather');
    expect(res.status).toBe(502);
    expect(res.body).toEqual({ error: 'Weather unavailable' });
  });
});
