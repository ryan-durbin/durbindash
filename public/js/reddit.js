'use strict';
/* DurbinDash Reddit Feed — 90s BBS Style */

const DEFAULT_SUBS = ['artificial', 'LocalLLaMA'];

function formatScore(n) {
  return '[▲ ' + n.toLocaleString() + ']';
}

function formatComments(n) {
  return '[💬 ' + n.toLocaleString() + ']';
}

function renderPosts(sub, posts) {
  const lines = [`<div class="reddit-sub-header">══ /r/${sub} ══</div>`];
  posts.forEach((post, i) => {
    const num = String(i + 1).padStart(2, ' ');
    const score = formatScore(post.score);
    const comments = formatComments(post.num_comments);
    lines.push(
      `<div class="reddit-post">` +
      `<span class="reddit-num">${num}.</span> ` +
      `<a href="${post.permalink}" target="_blank" rel="noopener" class="reddit-title">${post.title}</a> ` +
      `<span class="reddit-score">${score}</span> ` +
      `<span class="reddit-comments">${comments}</span>` +
      `</div>`
    );
  });
  return lines.join('\n');
}

async function loadRedditFeed() {
  const container = document.getElementById('reddit-feed');
  if (!container) return;
  container.innerHTML = '<div class="reddit-loading">[ FETCHING BBS POSTS... ]</div>';

  const results = [];
  for (const sub of DEFAULT_SUBS) {
    try {
      const res = await fetch(`/api/reddit?sub=${encodeURIComponent(sub)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const posts = await res.json();
      results.push(renderPosts(sub, posts));
    } catch (err) {
      results.push(`<div class="reddit-error">[ ERROR LOADING /r/${sub} ]</div>`);
    }
  }

  container.innerHTML = results.join('\n<div class="reddit-divider">────────────────────────────────────</div>\n');
}

document.addEventListener('DOMContentLoaded', loadRedditFeed);
