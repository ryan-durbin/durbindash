'use strict';

const { router, cache, clearCache, fetchReleases, setFetch } = require('../server/openclaw');

const MOCK_RELEASES = [
  { tag_name: 'v1.3.0', name: 'Release 1.3.0', published_at: '2026-01-01T00:00:00Z', body: 'First ' + 'x'.repeat(200) },
  { tag_name: 'v1.2.0', name: 'Release 1.2.0', published_at: '2025-12-01T00:00:00Z', body: 'Second' },
  { tag_name: 'v1.1.0', name: 'Release 1.1.0', published_at: '2025-11-01T00:00:00Z', body: 'Third' },
  { tag_name: 'v1.0.0', name: 'Release 1.0.0', published_at: '2025-10-01T00:00:00Z', body: 'Fourth' },
];

let mockFetchFn;

beforeEach(() => {
  clearCache();
  mockFetchFn = jest.fn();
  setFetch(mockFetchFn);
});

function mockOnce(releases) {
  mockFetchFn.mockResolvedValueOnce({ ok: true, json: async () => releases });
}

test('returns exactly 3 items', async () => {
  mockOnce(MOCK_RELEASES);
  const r = await fetchReleases();
  expect(r).toHaveLength(3);
});

test('each item has tag_name, name, published_at, body', async () => {
  mockOnce(MOCK_RELEASES);
  const r = await fetchReleases();
  for (const item of r) {
    expect(item).toHaveProperty('tag_name');
    expect(item).toHaveProperty('name');
    expect(item).toHaveProperty('published_at');
    expect(item).toHaveProperty('body');
  }
});

test('body is truncated to 200 chars', async () => {
  mockOnce(MOCK_RELEASES);
  const r = await fetchReleases();
  for (const item of r) expect(item.body.length).toBeLessThanOrEqual(200);
});

test('cache hit: second call does not fetch again', async () => {
  mockOnce(MOCK_RELEASES);
  await fetchReleases();
  await fetchReleases();
  expect(mockFetchFn).toHaveBeenCalledTimes(1);
});

test('cache miss after expiry: fetches again', async () => {
  mockOnce(MOCK_RELEASES);
  mockOnce(MOCK_RELEASES);
  await fetchReleases();
  cache.expiresAt = Date.now() - 1;
  await fetchReleases();
  expect(mockFetchFn).toHaveBeenCalledTimes(2);
});

test('router is exported', () => {
  expect(router).toBeDefined();
  expect(typeof router).toBe('function');
});
