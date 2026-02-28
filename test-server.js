const { test, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');

const app = require('./server.js');

let server;

before(() => {
  server = app.listen(0); // Use random port to avoid conflicts
});

after(() => {
  server.close();
});

function getPort(srv) {
  return srv.address().port;
}

function httpGet(port, path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${port}${path}`, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

test('GET / returns HTTP 200', async () => {
  const port = getPort(server);
  const res = await httpGet(port, '/');
  assert.strictEqual(res.status, 200);
});

test('GET /health returns 200 with JSON', async () => {
  const port = getPort(server);
  const res = await httpGet(port, '/health');
  assert.strictEqual(res.status, 200);
  const data = JSON.parse(res.body);
  assert.strictEqual(data.status, 'ok');
  assert.strictEqual(data.app, 'durbindash');
});

test('GET /nonexistent returns 404', async () => {
  const port = getPort(server);
  const res = await httpGet(port, '/nonexistent-route-xyz');
  assert.strictEqual(res.status, 404);
});
