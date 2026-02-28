'use strict';
/* DurbinDash Reddit Feed — 90s BBS Style */

const DEFAULT_SUBS = ['artificial', 'LocalLLaMA'];

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
  container.innerHTML = '<div class="reddit-loading">[ FETCHING BBS POSTS... ]</div>';

  var results = await Promise.all(DEFAULT_SUBS.map(async function(sub) {
    try {
      var res = await fetch('/api/reddit?sub=' + encodeURIComponent(sub));
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var posts = await res.json();
      return renderPosts(sub, posts);
    } catch (err) {
      return '<div class="reddit-sub-header">[ r/' + sub + ' ]</div><div class="reddit-error">!! ERROR LOADING FEED: ' + err.message + '</div>';
    }
  }));

  container.innerHTML = results.join('\n<div class="reddit-divider">────────────────────────────────────</div>\n');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { renderPosts: renderPosts, formatScore: formatScore };
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', loadRedditFeed);
}
