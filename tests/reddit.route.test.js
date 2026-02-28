'use strict';

/**
 * Tests for GET /api/reddit route using node:test and Module._load mocking.
 */

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const Module = require('node:module');

const mockPosts = [
  { title: 'Test Post', url: 'https://example.com', score: 1234, num_comments: 56, permalink: 'https://www.reddit.com/r/artificial/comments/abc/test' }
];

let mockShouldFail = false;

// Intercept require calls for the reddit and weather modules
const originalLoad = Module._load;
Module._load = function(request, parent, isMain) {
  const rel = request.replace(/\\/g, '/');
  if (rel === '../server/reddit' || rel.endsWith('server/reddit')) {
    return {
      getSubredditPosts: async (sub) => {
        if (mockShouldFail) throw new Error('network error');
        return mockPosts;
      },
      ALLOWED_SUBREDDITS: ['artificial', 'LocalLLaMA', 'homelab', 'selfhosted', 'homeassistant']
    };
  }
  if (rel === '../server/weather' || rel.endsWith('server/weather')) {
    return { fetchWeather: async () => ({ temp: 72 }) };
  }
  return originalLoad.apply(this, arguments);
};

// Clear cache and load app with mocked modules
const serverPath = require.resolve('/home/ryandurbin/projects/durbindash/server.js');
delete require.cache[serverPath];
const app = require('/home/ryandurbin/projects/durbindash/server.js');
Module._load = originalLoad;

function makeRequest(server, path) {
  return new Promise((resolve, reject) => {
    const addr = server.address();
    const req = http.request(
      { hostname: '127.0.0.1', port: addr.port, path, method: 'GET' },
      (res) => {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => {
          try { resolve({ status: res.statusCode, body: JSON.parse(body) }); }
          catch (e) { reject(e); }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

describe('GET /api/reddit', () => {
  let server;
  before((done) => { server = app.listen(0, done); });
  after((done) => { server.close(done); });

  it('valid sub returns 200 JSON array', async () => {
    mockShouldFail = false;
    const res = await makeRequest(server, '/api/reddit?sub=artificial');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.equal(res.body[0].title, 'Test Post');
  });

  it('missing sub returns 400 with error field', async () => {
    const res = await makeRequest(server, '/api/reddit');
    assert.equal(res.status, 400);
    assert.ok(res.body.error);
  });

  it('invalid sub returns 400 with error field', async () => {
    const res = await makeRequest(server, '/api/reddit?sub=badsubreddit');
    assert.equal(res.status, 400);
    assert.ok(res.body.error);
  });

  it('upstream fetch error returns 502 with error field', async () => {
    mockShouldFail = true;
    const res = await makeRequest(server, '/api/reddit?sub=homelab');
    assert.equal(res.status, 502);
    assert.ok(res.body.error);
    mockShouldFail = false;
  });
});
