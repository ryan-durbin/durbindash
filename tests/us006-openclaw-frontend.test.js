/** @jest-environment jsdom */
'use strict';

const { fetchAndRenderOpenClaw } = require('../public/js/openclaw');

const MOCK_RELEASES = [
  { tag_name: 'v1.3.0', name: 'Release 1.3.0', published_at: '2026-01-01T00:00:00Z', body: 'First release notes' },
  { tag_name: 'v1.2.0', name: 'Release 1.2.0', published_at: '2025-12-01T00:00:00Z', body: 'Second' },
];

beforeEach(() => {
  document.body.innerHTML = '<div id="news-ai"></div>';
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

test('shows spinner before fetch completes', async () => {
  let resolveFetch;
  global.fetch = jest.fn(() => new Promise(resolve => { resolveFetch = resolve; }));
  const promise = fetchAndRenderOpenClaw('news-ai');
  const container = document.getElementById('news-ai');
  expect(container.querySelector('.spinner')).not.toBeNull();
  resolveFetch({ ok: true, json: async () => MOCK_RELEASES });
  await promise;
});

test('renders .last-updated after successful fetch', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => MOCK_RELEASES });
  await fetchAndRenderOpenClaw('news-ai');
  const container = document.getElementById('news-ai');
  const lastUpdated = container.querySelector('.last-updated');
  expect(lastUpdated).not.toBeNull();
  expect(lastUpdated.textContent).toMatch(/Last updated/);
});

test('renders release content on success', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => MOCK_RELEASES });
  await fetchAndRenderOpenClaw('news-ai');
  const container = document.getElementById('news-ai');
  expect(container.innerHTML).toContain('Release 1.3.0');
});

test('renders .error-state with friendly message on fetch error', async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error('network error'));
  await fetchAndRenderOpenClaw('news-ai');
  const container = document.getElementById('news-ai');
  const errorDiv = container.querySelector('.error-state');
  expect(errorDiv).not.toBeNull();
  expect(errorDiv.textContent).toContain("Couldn't load OpenClaw updates");
});

test('renders retry button in error-state', async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error('network error'));
  await fetchAndRenderOpenClaw('news-ai');
  const container = document.getElementById('news-ai');
  const btn = container.querySelector('.retry-btn');
  expect(btn).not.toBeNull();
  expect(btn.textContent).toContain('Try again');
});

test('retry button re-calls fetchAndRenderOpenClaw on click', async () => {
  global.fetch = jest.fn()
    .mockRejectedValueOnce(new Error('network error'))
    .mockResolvedValueOnce({ ok: true, json: async () => MOCK_RELEASES });
  await fetchAndRenderOpenClaw('news-ai');
  const container = document.getElementById('news-ai');
  const btn = container.querySelector('.retry-btn');
  await btn.click();
  // After retry, error-state should be gone and last-updated should appear
  await new Promise(r => setTimeout(r, 50));
  expect(container.querySelector('.last-updated')).not.toBeNull();
});

test('renders .error-state on HTTP error response', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });
  await fetchAndRenderOpenClaw('news-ai');
  const container = document.getElementById('news-ai');
  expect(container.querySelector('.error-state')).not.toBeNull();
});

test('does nothing if container not found', async () => {
  // Should not throw
  await expect(fetchAndRenderOpenClaw('nonexistent')).resolves.toBeUndefined();
});
