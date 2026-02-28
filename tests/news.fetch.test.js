'use strict';

// Mock rss-parser before requiring the module
jest.mock('rss-parser', () => {
  return jest.fn().mockImplementation(() => ({
    parseURL: jest.fn(async (url) => {
      const items = [
        {
          title: 'Article One',
          link: 'https://example.com/1',
          isoDate: '2026-02-28T10:00:00.000Z',
        },
        {
          title: 'Article Two',
          link: 'https://example.com/2',
          isoDate: '2026-02-28T09:00:00.000Z',
        },
        {
          title: 'Article Three',
          link: 'https://example.com/3',
          isoDate: '2026-02-28T08:00:00.000Z',
        },
        {
          title: 'Article Four',
          link: 'https://example.com/4',
          isoDate: '2026-02-27T10:00:00.000Z',
        },
        {
          title: 'Article Five',
          link: 'https://example.com/5',
          isoDate: '2026-02-27T09:00:00.000Z',
        },
        {
          title: 'Article Six',
          link: 'https://example.com/6',
          isoDate: '2026-02-27T08:00:00.000Z',
        },
      ];
      return { items };
    }),
  }));
});

const { fetchFeed } = require('../server/news');

describe('fetchFeed', () => {
  test('returns at most 5 items for ai category', async () => {
    const items = await fetchFeed('ai');
    expect(items.length).toBeLessThanOrEqual(5);
    expect(items.length).toBeGreaterThan(0);
  });

  test('each item has required shape for ai category', async () => {
    const items = await fetchFeed('ai');
    for (const item of items) {
      expect(typeof item.title).toBe('string');
      expect(typeof item.url).toBe('string');
      expect(typeof item.source).toBe('string');
      expect(typeof item.published).toBe('string');
    }
  });

  test('ai category returns source TechCrunch AI', async () => {
    const items = await fetchFeed('ai');
    expect(items.every((i) => i.source === 'TechCrunch AI')).toBe(true);
  });

  test('tech category merges two feeds and returns at most 5', async () => {
    const items = await fetchFeed('tech');
    expect(items.length).toBeLessThanOrEqual(5);
    // sources should be from Ars Technica or The Verge
    for (const item of items) {
      expect(['Ars Technica', 'The Verge']).toContain(item.source);
    }
  });

  test('hn category returns items from Hacker News', async () => {
    const items = await fetchFeed('hn');
    expect(items.length).toBeLessThanOrEqual(5);
    expect(items.every((i) => i.source === 'Hacker News')).toBe(true);
  });

  test('unknown category returns empty array', async () => {
    const items = await fetchFeed('unknown');
    expect(items).toEqual([]);
  });

  test('items are sorted by published date descending', async () => {
    const items = await fetchFeed('ai');
    for (let i = 1; i < items.length; i++) {
      expect(new Date(items[i - 1].published) >= new Date(items[i].published)).toBe(true);
    }
  });

  test('published is a valid ISO date string', async () => {
    const items = await fetchFeed('hn');
    for (const item of items) {
      expect(isNaN(new Date(item.published).getTime())).toBe(false);
    }
  });
});
