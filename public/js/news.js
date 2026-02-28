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

// OpenClaw Updates
(function() {
  var container = document.getElementById('news-ai');
  if (!container) return;

  fetch('/api/openclaw')
    .then(function(r) { return r.json(); })
    .then(function(releases) {
      var blurb = container.querySelector('.openclaw-blurb');
      if (!blurb) {
        blurb = document.createElement('div');
        blurb.className = 'openclaw-blurb';
        blurb.innerHTML = '<span class="openclaw-tooltip" title="OpenClaw is your AI personal assistant platform — running locally on your homelab!">What Is OpenClaw? 🦅</span>';
        container.appendChild(blurb);
      }
      var html = releases.map(function(r) {
        var date = r.published_at ? '(' + r.published_at.slice(0, 10) + ')' : '';
        return '<div class="news-item openclaw-release">' +
          '<strong>' + r.tag_name + '</strong> ' + date +
          (r.name ? ' — ' + r.name : '') +
          (r.body ? '<div class="openclaw-body">' + r.body + '</div>' : '') +
          '</div>';
      }).join('');
      container.insertAdjacentHTML('beforeend', html || '<div class="error">No releases</div>');
    })
    .catch(function() {
      if (container) {
        container.insertAdjacentHTML('beforeend', '<div class="error">OpenClaw releases unavailable</div>');
      }
    });
})();
