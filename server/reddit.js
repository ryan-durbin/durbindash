'use strict';

const https = require('https');

const ALLOWED_SUBREDDITS = ['artificial', 'LocalLLaMA', 'homelab', 'selfhosted', 'homeassistant'];
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

const cache = {};

/**
 * Simple HTTPS GET helper returning parsed JSON.
 * @param {string} url
 * @returns {Promise<any>}
 */
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'DurbinDash/1.0' } }, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`Reddit API error: ${res.statusCode}`));
      }
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

/**
 * Fetches hot posts from a subreddit, with 30-min in-memory cache.
 * @param {string} sub - subreddit name (must be in allowed list)
 * @returns {Promise<Array<{title: string, url: string, score: number, num_comments: number, permalink: string}>>}
 */
async function getSubredditPosts(sub) {
  if (!ALLOWED_SUBREDDITS.includes(sub)) {
    throw new Error(`Subreddit '${sub}' is not in the allowed list`);
  }

  const now = Date.now();
  if (cache[sub] && (now - cache[sub].fetchedAt) < CACHE_TTL_MS) {
    return cache[sub].data;
  }

  const url = `https://www.reddit.com/r/${sub}/hot.json?limit=5`;
  const json = await httpsGet(url);

  const posts = json.data.children.map(({ data }) => ({
    title: data.title,
    url: data.url,
    score: data.score,
    num_comments: data.num_comments,
    permalink: data.permalink
  }));

  cache[sub] = { data: posts, fetchedAt: now };
  return posts;
}

module.exports = { getSubredditPosts, ALLOWED_SUBREDDITS, _cache: cache };
