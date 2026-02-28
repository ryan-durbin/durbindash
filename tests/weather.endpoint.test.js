'use strict';

// Mock server/weather module before requiring app
jest.mock('../server/weather', () => ({
  fetchWeather: jest.fn(),
}));

const request = require('supertest');
const app = require('../server');
const { fetchWeather } = require('../server/weather');

describe('GET /api/weather', () => {
  const mockWeather = {
    temperature: 28.4,
    description: 'Overcast',
    windSpeed: 12.3,
    humidity: 75,
    highTemp: 35.1,
    lowTemp: 22.8,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('responds with 200 and weather JSON on success', async () => {
    fetchWeather.mockResolvedValueOnce(mockWeather);

    const res = await request(app).get('/api/weather');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      temperature: expect.any(Number),
      description: expect.any(String),
      windSpeed: expect.any(Number),
      humidity: expect.any(Number),
      highTemp: expect.any(Number),
      lowTemp: expect.any(Number),
    });
    expect(res.body.temperature).toBe(28.4);
    expect(res.body.description).toBe('Overcast');
  });

  test('responds with 502 when fetchWeather throws', async () => {
    fetchWeather.mockRejectedValueOnce(new Error('API down'));

    const res = await request(app).get('/api/weather');

    expect(res.status).toBe(502);
    expect(res.body).toEqual({ error: 'Weather unavailable' });
  });
});
