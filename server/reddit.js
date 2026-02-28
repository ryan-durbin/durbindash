'use strict';

const ALLOWED_SUBREDDITS = ['artificial', 'LocalLLaMA', 'homelab', 'selfhosted', 'homeassistant'];
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

const cache = new Map();

async function getSubredditPosts(sub) {
  const now = Date.now();
  const cached = cache.get(sub);
  if (cached && cached.expiresAt > now) {
    return cached.posts;
  }

  const url = `https://www.reddit.com/r/${sub}/hot.json?limit=5`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'DurbinDash/1.0' }
  });

  if (!res.ok) {
    throw new Error(`Reddit API returned ${res.status}`);
  }

  const data = await res.json();
  const posts = data.data.children.map(({ data: p }) => ({
    title: p.title,
    url: p.url,
    score: p.score,
    num_comments: p.num_comments,
    permalink: `https://www.reddit.com${p.permalink}`
  }));

  cache.set(sub, { posts, expiresAt: now + CACHE_TTL_MS });
  return posts;
}

module.exports = { getSubredditPosts, ALLOWED_SUBREDDITS };
