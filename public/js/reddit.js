'use strict';
/* DurbinDash Reddit Feed — 90s BBS Style */

const DEFAULT_SUBS = ['artificial', 'LocalLLaMA'];

function _formatLastUpdated(ts) {
  var elapsed = Math.floor((Date.now() - ts) / 60000);
  if (elapsed < 1) return 'just now';
  if (elapsed === 1) return '1 minute ago';
  return elapsed + ' minutes ago';
}

function formatScore(n) {
  return '[▲ ' + Number(n).toLocaleString() + ']';
}

function renderPosts(sub, posts) {
  const lines = [
    '<div class="reddit-sub-header">[ r/' + sub + ' ]</div>'
  ];
  posts.forEach(function(post, i) {
    var num = String(i + 1).padStart(2, ' ');
    var score = formatScore(post.score);
    var commentCount = Number(post.num_comments).toLocaleString();
    var permalink = 'https://reddit.com' + post.permalink;
    lines.push(
      '<div class="reddit-post">' +
      '<span class="reddit-num">' + num + '.</span> ' +
      '<span class="reddit-score">' + score + '</span> ' +
      '<a href="' + post.url + '" target="_blank" rel="noopener" class="reddit-title">' + post.title + '</a> ' +
      '<a href="' + permalink + '" target="_blank" rel="noopener" class="reddit-comments">(' + commentCount + ' comments)</a>' +
      '</div>'
    );
  });
  return lines.join('\n');
}

async function loadRedditFeed() {
  var container = document.getElementById('reddit-feed');
  if (!container) return;
  container.innerHTML = '<div class="spinner"></div>';

  var results = await Promise.all(DEFAULT_SUBS.map(async function(sub) {
    try {
      var res = await fetch('/api/reddit?sub=' + encodeURIComponent(sub));
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var posts = await res.json();
      return { ok: true, html: renderPosts(sub, posts), sub: sub };
    } catch (err) {
      return { ok: false, sub: sub };
    }
  }));

  var hasError = results.some(function(r) { return !r.ok; });

  var htmlParts = results.map(function(r) {
    if (r.ok) return r.html;
    return '<div class="reddit-sub-header">[ r/' + r.sub + ' ]</div>' +
      '<div class="error-state">' +
      "Couldn't load r/" + r.sub + ' posts \u2014 check your connection \u{1F615}<br>' +
      '<button class="retry-btn">\u{1F504} Try again</button>' +
      '</div>';
  });

  container.innerHTML = htmlParts.join('\n<div class="reddit-divider">\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500</div>\n');

  // Attach retry listeners
  container.querySelectorAll('.retry-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      loadRedditFeed();
    });
  });

  if (!hasError) {
    var lastUpdated = document.createElement('div');
    lastUpdated.className = 'last-updated';
    lastUpdated.textContent = 'Last updated: ' + _formatLastUpdated(Date.now());
    container.appendChild(lastUpdated);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { renderPosts: renderPosts, formatScore: formatScore, _formatLastUpdated: _formatLastUpdated, loadRedditFeed: loadRedditFeed };
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', loadRedditFeed);
}
