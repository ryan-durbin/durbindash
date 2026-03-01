/**
 * news.js - Frontend fetch and render module for DurbinDash news feeds
 * Plain JS, no bundler required.
 */

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Fetches news from the API and renders into the given container element.
 * @param {string} category - 'ai', 'tech', or 'hn'
 * @param {string} containerId - DOM element ID to render into
 */
async function fetchAndRenderNews(category, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let items;
  try {
    const res = await fetch(`/api/news?category=${encodeURIComponent(category)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    items = await res.json();
  } catch (err) {
    container.innerHTML = `<p class="news-error">Failed to load news: ${err.message}</p>`;
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
  module.exports = { fetchAndRenderNews };
}
