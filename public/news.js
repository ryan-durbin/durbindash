(function () {
  'use strict';

  function formatDate(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function renderItems(container, items) {
    var ul = document.createElement('ul');
    ul.className = 'news-list';
    var count = Math.min(items.length, 8);
    for (var i = 0; i < count; i++) {
      var item = items[i];
      var li = document.createElement('li');
      li.className = 'news-item';

      var a = document.createElement('a');
      a.href = item.url || '#';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = item.title || '(no title)';
      a.className = 'news-title';

      var meta = document.createElement('span');
      meta.className = 'news-meta';
      meta.textContent = ' \u2014 ' + (item.source || '') + (item.date ? ' \u00b7 ' + formatDate(item.date) : '');

      li.appendChild(a);
      li.appendChild(meta);
      ul.appendChild(li);
    }
    container.appendChild(ul);
  }

  function renderError(container, message) {
    container.textContent = message || 'Failed to load news.';
  }

  function loadNews() {
    var container = document.getElementById('news-feed-ai');
    if (!container) return;
    container.textContent = 'Loading...';

    fetch('/api/news?category=ai')
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        container.textContent = '';
        var items = Array.isArray(data) ? data : (data.items || []);
        if (items.length === 0) {
          container.textContent = 'No news available.';
          return;
        }
        renderItems(container, items);
      })
      .catch(function (err) {
        renderError(container, 'Error loading news: ' + err.message);
      });
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { formatDate: formatDate, renderItems: renderItems, renderError: renderError };
  } else {
    document.addEventListener('DOMContentLoaded', loadNews);
  }
}());
