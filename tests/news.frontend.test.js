/** @jest-environment jsdom */
/**
 * tests/news.frontend.test.js
 * Tests for public/js/news.js frontend module using jsdom environment.
 */

const path = require('path');

// Mock fetch before requiring the module
global.fetch = jest.fn();

// We need to require the module fresh each test (module caches)
let fetchAndRenderNews;

beforeEach(() => {
  jest.resetModules();
  global.fetch = jest.fn();
  // Set up DOM containers
  document.body.innerHTML = `
    <div id="news-ai"></div>
    <div id="news-tech"></div>
    <div id="news-hn"></div>
  `;
  ({ fetchAndRenderNews } = require('../public/js/news.js'));
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
  return new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(); // 1 hour ago
}

describe('fetchAndRenderNews', () => {
  test('renders a <ul> with <li> elements for each item', async () => {
    const items = [makeItem(), makeItem({ title: 'Article 2', url: 'https://example.com/2' })];
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => items,
    });

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

  test('fetch error renders error text inside container', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network failure'));

    await fetchAndRenderNews('ai', 'news-ai');

    const container = document.getElementById('news-ai');
    expect(container.textContent).toMatch(/Failed to load news/);
    expect(container.textContent).toMatch(/Network failure/);
  });

  test('non-ok HTTP status renders error text', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 500 });

    await fetchAndRenderNews('tech', 'news-tech');

    const container = document.getElementById('news-tech');
    expect(container.textContent).toMatch(/Failed to load news/);
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
