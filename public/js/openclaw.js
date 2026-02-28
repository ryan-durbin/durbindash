/**
 * openclaw.js - Frontend fetch and render for OpenClaw GitHub releases
 */

async function fetchAndRenderOpenClaw(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let releases;
  try {
    const res = await fetch('/api/openclaw');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    releases = await res.json();
  } catch (err) {
    container.innerHTML = '<p style="color:#ff9999;font-family:Arial,sans-serif;font-size:13px;">Failed to load OpenClaw updates: ' + err.message + '</p>';
    return;
  }

  const html = releases.map(function(r) {
    const date = r.published_at ? new Date(r.published_at).toLocaleDateString() : '';
    const body = r.body ? r.body.replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
    return '<div style="margin-bottom:10px;font-family:Arial,sans-serif;font-size:13px;color:#ccffcc;">' +
      '<strong style="color:#00ff99;">' + (r.name || r.tag_name) + '</strong>' +
      ' <span style="color:#aaaaaa;">(' + date + ')</span>' +
      (body ? '<br><span style="color:#cccccc;">' + body + '</span>' : '') +
      '</div>';
  }).join('');

  container.innerHTML =
    '<div style="margin-bottom:8px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;color:#00ff99;">\ud83e\udd85 OpenClaw Updates' +
    '  <span id="openclaw-tooltip-trigger" style="cursor:pointer;font-size:11px;color:#88ccff;font-weight:normal;" title="OpenClaw is your AI personal assistant platform \u2014 running locally on your homelab!">[What Is OpenClaw?]</span>' +
    '</div>' +
    html;
}

document.addEventListener('DOMContentLoaded', function() {
  fetchAndRenderOpenClaw('news-ai');
});
