/** @jest-environment jsdom */
/**
 * tests/news.frontend.test.js
 * Tests for public/js/news.js frontend module using jsdom environment.
 */

// Mock fetch before requiring the module
global.fetch = jest.fn();

let fetchAndRenderNews, _formatLastUpdated;

beforeEach(() => {
  jest.resetModules();
  global.fetch = jest.fn();
  document.body.innerHTML = `
    <div id="news-ai"></div>
    <div id="news-tech"></div>
    <div id="news-hn"></div>
  `;
  ({ fetchAndRenderNews, _formatLastUpdated } = require('../public/js/news.js'));
});

function makeItem(overrides = {}) {
  return {
    title: 'Test Article',
    url: 'https://example.com/article',
    source: 'TestSource',
    published: new Date().toISOString(),
    ...overrides,
  };
}

function oldDate() {
  return new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
}

function recentDate() {
  return new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString();
}

describe('fetchAndRenderNews', () => {
  test('sets container innerHTML to .spinner before fetching', async () => {
    let resolveJson;
    global.fetch.mockReturnValueOnce(new Promise(res => {
      resolveJson = res;
    }));

    const promise = fetchAndRenderNews('ai', 'news-ai');
    // While still pending, spinner should be present
    const container = document.getElementById('news-ai');
    expect(container.querySelector('.spinner')).not.toBeNull();

    // Resolve fetch to clean up
    resolveJson({ ok: true, json: async () => [makeItem()] });
    await promise;
  });

  test('renders a <ul> with <li> elements for each item', async () => {
    const items = [makeItem(), makeItem({ title: 'Article 2', url: 'https://example.com/2' })];
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => items });

    await fetchAndRenderNews('ai', 'news-ai');

    const container = document.getElementById('news-ai');
    expect(container.querySelector('ul')).not.toBeNull();
    const lis = container.querySelectorAll('li');
    expect(lis.length).toBe(2);
  });

  test('each <li> contains an <a> tag with correct href', async () => {
    const items = [makeItem({ url: 'https://example.com/specific' })];
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => items });

    await fetchAndRenderNews('ai', 'news-ai');

    const a = document.getElementById('news-ai').querySelector('a');
    expect(a).not.toBeNull();
    expect(a.getAttribute('href')).toBe('https://example.com/specific');
  });

  test('items within 24h have badge-new element with text NEW!', async () => {
    const items = [makeItem({ published: recentDate() })];
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => items });

    await fetchAndRenderNews('ai', 'news-ai');

    const badge = document.getElementById('news-ai').querySelector('.badge-new');
    expect(badge).not.toBeNull();
    expect(badge.textContent).toBe('NEW!');
  });

  test('items older than 24h do NOT have badge-new element', async () => {
    const items = [makeItem({ published: oldDate() })];
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => items });

    await fetchAndRenderNews('ai', 'news-ai');

    const badge = document.getElementById('news-ai').querySelector('.badge-new');
    expect(badge).toBeNull();
  });

  test('fetch error renders .error-state with friendly message (not raw HTTP error)', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network failure'));

    await fetchAndRenderNews('ai', 'news-ai');

    const container = document.getElementById('news-ai');
    const errorState = container.querySelector('.error-state');
    expect(errorState).not.toBeNull();
    expect(errorState.textContent).toMatch(/Couldn't load/);
    expect(errorState.textContent).not.toMatch(/Failed to load news/);
    expect(errorState.textContent).not.toMatch(/Network failure/);
  });

  test('non-ok HTTP status renders .error-state with friendly message', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 500 });

    await fetchAndRenderNews('tech', 'news-tech');

    const container = document.getElementById('news-tech');
    const errorState = container.querySelector('.error-state');
    expect(errorState).not.toBeNull();
    expect(errorState.textContent).toMatch(/Couldn't load/);
  });

  test('fetch error shows a retry button that re-triggers fetch', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network failure'));

    await fetchAndRenderNews('ai', 'news-ai');

    const container = document.getElementById('news-ai');
    const retryBtn = container.querySelector('.retry-btn');
    expect(retryBtn).not.toBeNull();
    expect(retryBtn.textContent).toContain('🔄 Try again');

    // Click retry — should call fetch again
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => [makeItem()] });
    retryBtn.click();
    // Give it a tick
    await new Promise(r => setTimeout(r, 50));
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  test('on success, .last-updated element is appended', async () => {
    const items = [makeItem()];
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => items });

    await fetchAndRenderNews('ai', 'news-ai');

    const container = document.getElementById('news-ai');
    const lastUpdated = container.querySelector('.last-updated');
    expect(lastUpdated).not.toBeNull();
    expect(lastUpdated.textContent).toMatch(/Last updated:/);
  });

  test('last-updated shows "just now" immediately after fetch', async () => {
    const items = [makeItem()];
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => items });

    await fetchAndRenderNews('ai', 'news-ai');

    const container = document.getElementById('news-ai');
    const lastUpdated = container.querySelector('.last-updated');
    expect(lastUpdated.textContent).toContain('just now');
  });

  test('does nothing if container id does not exist', async () => {
    await expect(fetchAndRenderNews('ai', 'nonexistent-id')).resolves.toBeUndefined();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('renders source in brackets and title as link text', async () => {
    const items = [makeItem({ source: 'TechCrunch', title: 'AI Breakthrough' })];
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => items });

    await fetchAndRenderNews('ai', 'news-ai');

    const li = document.getElementById('news-ai').querySelector('li');
    expect(li.textContent).toContain('[TechCrunch]');
    expect(li.querySelector('a').textContent).toBe('AI Breakthrough');
  });
});

describe('_formatLastUpdated', () => {
  test('returns "just now" for timestamps within 1 minute', () => {
    expect(_formatLastUpdated(Date.now() - 30000)).toBe('just now');
  });

  test('returns "1 minute ago" for 1 minute elapsed', () => {
    expect(_formatLastUpdated(Date.now() - 65000)).toBe('1 minute ago');
  });

  test('returns "X minutes ago" for multiple minutes', () => {
    expect(_formatLastUpdated(Date.now() - 5 * 60000)).toBe('5 minutes ago');
  });
});
