(function() {
  function renderNews(containerId, items) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const title = el.querySelector('.widget-title');
    const subheader = el.querySelector('.news-subheader');
    const html = (items || []).slice(0, 8).map(function(item) {
      return '<div class="news-item"><a href="' + item.link + '" target="_blank" rel="noopener">' + item.title + '</a></div>';
    }).join('');
    el.innerHTML = '';
    if (title) el.appendChild(title);
    if (subheader) el.appendChild(subheader);
    el.insertAdjacentHTML('beforeend', html || '<div class="error">No items</div>');
  }

  fetch('/api/news')
    .then(r => r.json())
    .then(data => {
      renderNews('news-ai', data.ai);
      renderNews('news-tech', data.tech);
      renderNews('news-hn', data.hn);
    })
    .catch(() => {
      ['news-ai','news-tech','news-hn'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const l = el.querySelector('.loading');
        if (l) { l.className = 'error'; l.textContent = 'News unavailable'; }
      });
    });
})();
