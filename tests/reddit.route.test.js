'use strict';

const { describe, it, before, after, mock } = require('node:test');
const assert = require('node:assert/strict');

// Mock the reddit module before requiring app
const mockPosts = [
  { title: 'Test Post', url: 'https://example.com', score: 100, num_comments: 5, permalink: 'https://www.reddit.com/r/artificial/test' }
];

// We need to mock the reddit module
const Module = require('node:module');
const originalLoad = Module._load;
Module._load = function(request, parent, isMain) {
  if (request === './server/reddit' || (parent && request.endsWith('server/reddit'))) {
    return {
      getSubredditPosts: async (sub) => {
        if (sub === 'artificial') return mockPosts;
        throw new Error('fetch error');
      },
      ALLOWED_SUBREDDITS: ['artificial', 'LocalLLaMA', 'homelab', 'selfhosted', 'homeassistant']
    };
  }
  return originalLoad.apply(this, arguments);
};

// Now require app with mocked module
// Clear any cached version
delete require.cache[require.resolve('/home/ryandurbin/projects/durbindash/server.js')];
const app = require('/home/ryandurbin/projects/durbindash/server.js');
const http = require('node:http');

// Restore Module._load after app is loaded
Module._load = originalLoad;

function request(server, path) {
  return new Promise((resolve, reject) => {
    const addr = server.address();
    const options = { hostname: '127.0.0.1', port: addr.port, path, method: 'GET' };
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
    });
    req.on('error', reject);
    req.end();
  });
}

describe('GET /api/reddit route', () => {
  let server;
  before((done) => {
    server = app.listen(0, done);
  });
  after((done) => {
    server.close(done);
  });

  it('returns 200 with posts for valid sub', async () => {
    const res = await request(server, '/api/reddit?sub=artificial');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.equal(res.body[0].title, 'Test Post');
  });

  it('returns 400 when sub param is missing', async () => {
    const res = await request(server, '/api/reddit');
    assert.equal(res.status, 400);
    assert.ok(res.body.error);
  });

  it('returns 400 for disallowed sub', async () => {
    const res = await request(server, '/api/reddit?sub=badsubreddit');
    assert.equal(res.status, 400);
    assert.ok(res.body.error);
  });
});
