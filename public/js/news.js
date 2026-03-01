/**
 * news.js - Frontend fetch and render module for DurbinDash news feeds
 * Plain JS, no bundler required.
 */

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Track last fetch timestamps per containerId
const _lastFetchTimes = {};

/**
 * Formats elapsed time since a given timestamp.
 * @param {number} ts - timestamp in ms
 * @returns {string}
 */
function _formatLastUpdated(ts) {
  const elapsed = Math.floor((Date.now() - ts) / 60000);
  if (elapsed < 1) return 'just now';
  if (elapsed === 1) return '1 minute ago';
  return `${elapsed} minutes ago`;
}

/**
 * Fetches news from the API and renders into the given container element.
 * @param {string} category - 'ai', 'tech', or 'hn'
 * @param {string} containerId - DOM element ID to render into
 */
async function fetchAndRenderNews(category, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Show spinner
  container.innerHTML = `<div class="spinner"></div>`;

  let items;
  try {
    const res = await fetch(`/api/news?category=${encodeURIComponent(category)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    items = await res.json();
  } catch (err) {
    const categoryLabel = category === 'hn' ? 'Hacker News' : `${category} news`;
    container.innerHTML = `
      <div class="error-state">
        Couldn't load ${categoryLabel} — check your connection 😕
        <br>
        <button class="retry-btn">🔄 Try again</button>
      </div>`;
    container.querySelector('.retry-btn').addEventListener('click', () => {
      fetchAndRenderNews(category, containerId);
    });
    return;
  }

  const now = Date.now();
  const ul = document.createElement('ul');
  ul.className = 'news-list';

  for (const item of items) {
    const li = document.createElement('li');
    li.className = 'news-item';

    const publishedMs = item.published ? new Date(item.published).getTime() : 0;
    const isNew = publishedMs && (now - publishedMs) < ONE_DAY_MS;

    if (isNew) {
      const badge = document.createElement('span');
      badge.className = 'badge-new';
      badge.textContent = 'NEW!';
      li.appendChild(badge);
    }

    const source = document.createTextNode(` [${item.source || 'unknown'}] `);
    li.appendChild(source);

    const link = document.createElement('a');
    link.href = item.url || '#';
    link.textContent = item.title || '(no title)';
    link.target = '_blank';
    li.appendChild(link);

    const date = document.createTextNode(
      ` — ${item.published ? new Date(item.published).toLocaleDateString() : 'unknown date'}`
    );
    li.appendChild(date);

    ul.appendChild(li);
  }

  container.innerHTML = '';
  container.appendChild(ul);

  // Record fetch time and append last-updated
  _lastFetchTimes[containerId] = Date.now();
  const lastUpdatedDiv = document.createElement('div');
  lastUpdatedDiv.className = 'last-updated';
  lastUpdatedDiv.textContent = `Last updated: ${_formatLastUpdated(_lastFetchTimes[containerId])}`;
  container.appendChild(lastUpdatedDiv);

  // Update last-refresh timestamp
  const lastRefresh = document.getElementById('last-refresh');
  if (lastRefresh) {
    lastRefresh.textContent = new Date().toLocaleTimeString();
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderNews('ai', 'news-ai');
    fetchAndRenderNews('tech', 'news-tech');
    fetchAndRenderNews('hn', 'news-hn');
  });
}

// Export for testing (CommonJS-compatible guard)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { fetchAndRenderNews, _formatLastUpdated };
}
