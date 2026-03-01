/** @jest-environment jsdom */
/**
 * tests/us005-reddit.test.js
 * Tests for US-005: spinner, error-state, retry, last-updated in reddit.js
 */

global.fetch = jest.fn();

let loadRedditFeed, renderPosts, formatScore, _formatLastUpdated;

function makePosts(n = 2) {
  return Array.from({ length: n }, (_, i) => ({
    title: 'Post ' + i,
    url: 'https://example.com/' + i,
    permalink: '/r/test/comments/' + i,
    score: 100 + i,
    num_comments: 10 + i,
  }));
}

beforeEach(() => {
  jest.resetModules();
  global.fetch = jest.fn();
  document.body.innerHTML = '<div id="reddit-feed"></div>';
  ({ loadRedditFeed, renderPosts, formatScore, _formatLastUpdated } = require('../public/js/reddit.js'));
});

describe('loadRedditFeed', () => {
  test('shows .spinner before fetch resolves', async () => {
    let resolve1, resolve2;
    global.fetch
      .mockReturnValueOnce(new Promise(r => { resolve1 = r; }))
      .mockReturnValueOnce(new Promise(r => { resolve2 = r; }));

    const promise = loadRedditFeed();
    expect(document.getElementById('reddit-feed').querySelector('.spinner')).not.toBeNull();

    resolve1({ ok: true, json: async () => makePosts() });
    resolve2({ ok: true, json: async () => makePosts() });
    await promise;
  });

  test('on success, .last-updated is appended to reddit-feed', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => makePosts() })
      .mockResolvedValueOnce({ ok: true, json: async () => makePosts() });

    await loadRedditFeed();

    const lu = document.getElementById('reddit-feed').querySelector('.last-updated');
    expect(lu).not.toBeNull();
    expect(lu.textContent).toMatch(/Last updated:/);
  });

  test('last-updated shows "just now" immediately after fetch', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => makePosts() })
      .mockResolvedValueOnce({ ok: true, json: async () => makePosts() });

    await loadRedditFeed();

    const lu = document.getElementById('reddit-feed').querySelector('.last-updated');
    expect(lu.textContent).toContain('just now');
  });

  test('per-subreddit error renders .error-state with friendly message', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: true, json: async () => makePosts() });

    await loadRedditFeed();

    const errorState = document.getElementById('reddit-feed').querySelector('.error-state');
    expect(errorState).not.toBeNull();
    expect(errorState.textContent).toMatch(/Couldn't load r\//);
    expect(errorState.textContent).not.toMatch(/HTTP 500/);
  });

  test('error state does NOT show raw HTTP error string', async () => {
    global.fetch.mockRejectedValue(new Error('HTTP 503'));

    await loadRedditFeed();

    const feed = document.getElementById('reddit-feed');
    expect(feed.textContent).not.toMatch(/HTTP 503/);
  });

  test('retry button present on error', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: false, status: 500 });

    await loadRedditFeed();

    const retryBtn = document.getElementById('reddit-feed').querySelector('.retry-btn');
    expect(retryBtn).not.toBeNull();
    expect(retryBtn.textContent).toContain('Try again');
  });

  test('retry button re-calls loadRedditFeed (triggers fetch again)', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: true, json: async () => makePosts() })
      .mockResolvedValueOnce({ ok: true, json: async () => makePosts() });

    await loadRedditFeed();

    const retryBtn = document.getElementById('reddit-feed').querySelector('.retry-btn');
    retryBtn.click();
    await new Promise(r => setTimeout(r, 50));

    // fetch called 2 (first load) + 2 (retry) = 4
    expect(global.fetch).toHaveBeenCalledTimes(4);
  });

  test('does nothing if reddit-feed container missing', async () => {
    document.body.innerHTML = '';
    await loadRedditFeed();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('no .last-updated when there are errors', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: true, json: async () => makePosts() });

    await loadRedditFeed();

    const lu = document.getElementById('reddit-feed').querySelector('.last-updated');
    expect(lu).toBeNull();
  });
});

describe('renderPosts', () => {
  test('includes subreddit header', () => {
    const html = renderPosts('artificial', makePosts(1));
    expect(html).toContain('r/artificial');
  });

  test('includes post title and link', () => {
    const posts = [{ title: 'Hello World', url: 'https://hw.com', permalink: '/r/test/1', score: 50, num_comments: 5 }];
    const html = renderPosts('test', posts);
    expect(html).toContain('Hello World');
    expect(html).toContain('https://hw.com');
  });
});

describe('formatScore', () => {
  test('formats score with triangle', () => {
    expect(formatScore(1234)).toBe('[▲ 1,234]');
  });
});

describe('_formatLastUpdated', () => {
  test('returns "just now" for < 1 minute', () => {
    expect(_formatLastUpdated(Date.now() - 30000)).toBe('just now');
  });

  test('returns "1 minute ago" for ~1 minute', () => {
    expect(_formatLastUpdated(Date.now() - 65000)).toBe('1 minute ago');
  });

  test('returns "X minutes ago" for multiple minutes', () => {
    expect(_formatLastUpdated(Date.now() - 5 * 60000)).toBe('5 minutes ago');
  });
});
