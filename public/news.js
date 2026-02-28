(function () {
  'use strict';

  function formatDate(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function renderNews(container, items) {
    container.innerHTML = '';
    var ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.style.padding = '0';
    items.forEach(function (item) {
      var li = document.createElement('li');
      li.style.margin = '8px 0';
      var a = document.createElement('a');
      a.href = item.url || '#';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = item.title || '(no title)';
      a.className = 'news-title';
      var meta = document.createElement('span');
      meta.className = 'news-meta';
      meta.textContent = ' — ' + (item.source || '') + (item.date ? ' · ' + formatDate(item.date) : '');
      li.appendChild(a);
      li.appendChild(meta);
      ul.appendChild(li);
    });
    container.appendChild(ul);
  }

  function renderError(container, message) {
    container.innerHTML = '<span class="news-error">' + message + '</span>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var container = document.getElementById('news-feed-ai');
    if (!container) return;

    container.textContent = 'Loading AI news\u2026';

    fetch('/api/news?category=ai')
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        var items = Array.isArray(data) ? data : (data.items || []);
        if (items.length === 0) {
          container.textContent = 'No news items found.';
        } else {
          renderNews(container, items);
        }
      })
      .catch(function (err) {
        renderError(container, 'Failed to load AI news: ' + err.message);
      });
  });
})();
