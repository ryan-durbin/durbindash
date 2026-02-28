'use strict';

jest.mock('../server/news');
jest.mock('../server/weather', () => ({ fetchWeather: jest.fn() }));
const { fetchFeed } = require('../server/news');
const request = require('supertest');
const app = require('../server');

const mockItems = [
  { title: 'Test', url: 'https://example.com', source: 'Test', published: '2026-01-01T00:00:00.000Z' },
];

describe('GET /api/news', () => {
  beforeEach(() => {
    fetchFeed.mockReset();
  });

  test('valid category ai returns 200 JSON array', async () => {
    fetchFeed.mockResolvedValue(mockItems);
    const res = await request(app).get('/api/news?category=ai');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(fetchFeed).toHaveBeenCalledWith('ai');
  });

  test('valid category tech returns 200 JSON array', async () => {
    fetchFeed.mockResolvedValue(mockItems);
    const res = await request(app).get('/api/news?category=tech');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('valid category hn returns 200 JSON array', async () => {
    fetchFeed.mockResolvedValue(mockItems);
    const res = await request(app).get('/api/news?category=hn');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('missing category returns 400 with error field', async () => {
    const res = await request(app).get('/api/news');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('invalid category returns 400 with error field', async () => {
    const res = await request(app).get('/api/news?category=invalid');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('fetchFeed error returns 502 with error field', async () => {
    fetchFeed.mockRejectedValue(new Error('Network error'));
    const res = await request(app).get('/api/news?category=ai');
    expect(res.status).toBe(502);
    expect(res.body).toHaveProperty('error');
  });
});
