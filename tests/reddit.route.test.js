'use strict';

jest.mock('../server/reddit', () => ({
  getSubredditPosts: jest.fn(),
  ALLOWED_SUBREDDITS: ['artificial', 'LocalLLaMA', 'homelab', 'selfhosted', 'homeassistant'],
}));
jest.mock('../server/weather', () => ({ fetchWeather: jest.fn() }));

const { getSubredditPosts } = require('../server/reddit');
const request = require('supertest');
const app = require('../server');

const mockPosts = [
  { title: 'Test Post', url: 'https://example.com', score: 1234, num_comments: 56, permalink: '/r/artificial/comments/abc/test' },
];

describe('GET /api/reddit', () => {
  beforeEach(() => {
    getSubredditPosts.mockReset();
  });

  test('valid sub returns 200 JSON array', async () => {
    getSubredditPosts.mockResolvedValue(mockPosts);
    const res = await request(app).get('/api/reddit?sub=artificial');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(getSubredditPosts).toHaveBeenCalledWith('artificial');
  });

  test('missing sub returns 400 with error field', async () => {
    const res = await request(app).get('/api/reddit');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('invalid sub returns 400 with error field', async () => {
    const res = await request(app).get('/api/reddit?sub=badsubreddit');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('upstream fetch error returns 502 with error field', async () => {
    getSubredditPosts.mockRejectedValue(new Error('network error'));
    const res = await request(app).get('/api/reddit?sub=homelab');
    expect(res.status).toBe(502);
    expect(res.body).toHaveProperty('error');
  });
});
