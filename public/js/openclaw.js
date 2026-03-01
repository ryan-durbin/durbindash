/**
 * openclaw.js - Frontend fetch and render for OpenClaw GitHub releases
 */

async function fetchAndRenderOpenClaw(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Show spinner while loading
  container.innerHTML = '<div class="spinner"></div>';

  let releases;
  try {
    const res = await fetch('/api/openclaw');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    releases = await res.json();
  } catch (err) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-state';
    errorDiv.innerHTML = '<span>Couldn\'t load OpenClaw updates \u2014 check your connection \ud83d\ude15</span> ' +
      '<button class="retry-btn">\ud83d\udd04 Try again</button>';
    errorDiv.querySelector('.retry-btn').addEventListener('click', function() {
      fetchAndRenderOpenClaw(containerId);
    });
    container.innerHTML = '';
    container.appendChild(errorDiv);
    return;
  }

  const html = releases.map(function(r) {
    const date = r.published_at ? new Date(r.published_at).toLocaleDateString() : '';
    const body = r.body ? r.body.replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
    return '<div class="openclaw-release">' +
      '<strong class="release-name">' + (r.name || r.tag_name) + '</strong>' +
      ' <span class="release-date">(' + date + ')</span>' +
      (body ? '<br><span class="release-body">' + body + '</span>' : '') +
      '</div>';
  }).join('');

  container.innerHTML =
    '<div class="openclaw-header">\ud83e\udd85 OpenClaw Updates' +
    '  <span id="openclaw-tooltip-trigger" title="OpenClaw is your AI personal assistant platform \u2014 running locally on your homelab!">[What Is OpenClaw?]</span>' +
    '</div>' +
    html;

  const lastUpdated = document.createElement('div');
  lastUpdated.className = 'last-updated';
  lastUpdated.textContent = 'Last updated: just now';
  container.appendChild(lastUpdated);
}

document.addEventListener('DOMContentLoaded', function() {
  fetchAndRenderOpenClaw('news-ai');
});

if (typeof module !== 'undefined') {
  module.exports = { fetchAndRenderOpenClaw };
}
