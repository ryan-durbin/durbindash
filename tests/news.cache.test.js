'use strict';

jest.mock('rss-parser');

const Parser = require('rss-parser');
const { fetchFeed, clearCache, getCacheAge } = require('../server/news');

const mockItems = [
  { title: 'Item 1', link: 'https://example.com/1', isoDate: new Date().toISOString() },
  { title: 'Item 2', link: 'https://example.com/2', isoDate: new Date().toISOString() },
];

let parseURLMock;

beforeEach(() => {
  jest.useFakeTimers();
  clearCache();
  parseURLMock = jest.fn().mockResolvedValue({ items: mockItems });
  Parser.mockImplementation(() => ({ parseURL: parseURLMock }));
});

afterEach(() => {
  jest.useRealTimers();
});

test('second call within TTL uses cache (no extra rss-parser calls)', async () => {
  await fetchFeed('ai');
  await fetchFeed('ai');
  expect(parseURLMock).toHaveBeenCalledTimes(1);
});

test('cache miss after 30 minutes triggers re-fetch', async () => {
  await fetchFeed('hn');
  expect(parseURLMock).toHaveBeenCalledTimes(1);

  jest.advanceTimersByTime(1800001);

  await fetchFeed('hn');
  expect(parseURLMock).toHaveBeenCalledTimes(2);
});

test('clearCache resets state so next call re-fetches', async () => {
  await fetchFeed('ai');
  expect(parseURLMock).toHaveBeenCalledTimes(1);

  clearCache();

  await fetchFeed('ai');
  expect(parseURLMock).toHaveBeenCalledTimes(2);
});

test('getCacheAge returns null when uncached', () => {
  expect(getCacheAge('ai')).toBeNull();
});

test('getCacheAge returns ms since fetch when cached', async () => {
  await fetchFeed('tech');
  jest.advanceTimersByTime(5000);
  const age = getCacheAge('tech');
  expect(typeof age).toBe('number');
  expect(age).toBeGreaterThanOrEqual(5000);
});
