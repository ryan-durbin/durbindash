'use strict';

const https = require('https');
const { EventEmitter } = require('events');

let callCount = 0;

// Helper to create a mock https.get response
function mockHttpsGet(jsonData) {
  jest.spyOn(https, 'get').mockImplementation((url, opts, cb) => {
    callCount++;
    const callback = typeof opts === 'function' ? opts : cb;
    const res = new EventEmitter();
    res.statusCode = 200;
    process.nextTick(() => {
      callback(res);
      res.emit('data', JSON.stringify(jsonData));
      res.emit('end');
    });
    const req = new EventEmitter();
    req.end = jest.fn();
    return req;
  });
}

const mockPosts = [1, 2, 3, 4, 5].map(i => ({
  data: {
    title: `Post ${i}`,
    url: `https://example.com/${i}`,
    score: i * 100,
    num_comments: i * 10,
    permalink: `/r/artificial/comments/${i}/`
  }
}));

const mockRedditJson = { data: { children: mockPosts } };

beforeEach(() => {
  callCount = 0;
  jest.restoreAllMocks();
  // Clear in-memory cache between tests
  const { _cache } = require('../server/reddit');
  Object.keys(_cache).forEach(k => delete _cache[k]);
});

describe('getSubredditPosts', () => {
  test('returns array of posts with required fields', async () => {
    mockHttpsGet(mockRedditJson);
    const { getSubredditPosts } = require('../server/reddit');
    const posts = await getSubredditPosts('artificial');

    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBe(5);
    expect(posts[0]).toMatchObject({
      title: expect.any(String),
      url: expect.any(String),
      score: expect.any(Number),
      num_comments: expect.any(Number),
      permalink: expect.any(String)
    });
  });

  test('throws for disallowed subreddit', async () => {
    const { getSubredditPosts } = require('../server/reddit');
    await expect(getSubredditPosts('notallowed')).rejects.toThrow('not in the allowed list');
  });

  test('caches result — only one HTTP call for two requests within 30 min', async () => {
    mockHttpsGet(mockRedditJson);
    const { getSubredditPosts } = require('../server/reddit');

    // First call hits network
    await getSubredditPosts('homelab');
    expect(callCount).toBe(1);

    // Second call should use cache
    await getSubredditPosts('homelab');
    expect(callCount).toBe(1); // still 1 — cache was used
  });

  test('ALLOWED_SUBREDDITS contains expected subreddits', () => {
    const { ALLOWED_SUBREDDITS } = require('../server/reddit');
    expect(ALLOWED_SUBREDDITS).toContain('artificial');
    expect(ALLOWED_SUBREDDITS).toContain('LocalLLaMA');
    expect(ALLOWED_SUBREDDITS).toContain('homelab');
    expect(ALLOWED_SUBREDDITS).toContain('selfhosted');
    expect(ALLOWED_SUBREDDITS).toContain('homeassistant');
  });
});
