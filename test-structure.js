const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;

test('package.json exists with name durbindash', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert.strictEqual(pkg.name, 'durbindash');
});

test('package.json scripts.start equals node server.js', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert.strictEqual(pkg.scripts.start, 'node server.js');
});

test('package.json has express dependency', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert.ok(pkg.dependencies.express, 'express should be a dependency');
});

test('package.json has node-fetch dependency', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert.ok(pkg.dependencies['node-fetch'], 'node-fetch should be a dependency');
});

test('package.json has rss-parser dependency', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert.ok(pkg.dependencies['rss-parser'], 'rss-parser should be a dependency');
});

test('node_modules exists', () => {
  assert.ok(fs.existsSync(path.join(root, 'node_modules')), 'node_modules should exist');
});

test('public/ directory exists', () => {
  assert.ok(fs.existsSync(path.join(root, 'public')), 'public/ directory should exist');
});

test('.gitignore exists and contains node_modules', () => {
  const content = fs.readFileSync(path.join(root, '.gitignore'), 'utf8');
  assert.ok(content.includes('node_modules'), '.gitignore should contain node_modules');
});

test('server.js exists', () => {
  assert.ok(fs.existsSync(path.join(root, 'server.js')), 'server.js should exist');
});

test('README.md exists', () => {
  assert.ok(fs.existsSync(path.join(root, 'README.md')), 'README.md should exist');
});

// Regression tests: catch missing files, routes, and required HTML elements
test('public/index.html exists', () => {
  assert.ok(fs.existsSync(path.join(root, 'public', 'index.html')), 'public/index.html should exist');
});

test('public/index.html contains #weather-widget', () => {
  const html = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');
  assert.ok(html.includes('id="weather-widget"'), 'index.html must have #weather-widget div');
});

test('public/index.html contains #news-ai', () => {
  const html = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');
  assert.ok(html.includes('id="news-ai"'), 'index.html must have #news-ai div');
});

test('public/index.html contains #news-tech', () => {
  const html = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');
  assert.ok(html.includes('id="news-tech"'), 'index.html must have #news-tech div');
});

test('public/index.html contains #news-hn', () => {
  const html = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');
  assert.ok(html.includes('id="news-hn"'), 'index.html must have #news-hn div');
});

test('public/index.html contains #reddit-feed', () => {
  const html = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');
  assert.ok(html.includes('id="reddit-feed"'), 'index.html must have #reddit-feed div');
});

test('public/index.html contains OpenClaw Updates subheader', () => {
  const html = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');
  assert.ok(html.includes('OpenClaw Updates'), 'index.html must include OpenClaw Updates subheader in #news-ai');
});

test('public/index.html contains app-portal section', () => {
  const html = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');
  assert.ok(html.includes('id="app-portal"'), 'index.html must have #app-portal section');
});

test('public/index.html loads js/weather.js', () => {
  const html = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');
  assert.ok(html.includes('js/weather.js'), 'index.html must include js/weather.js script tag');
});

test('public/index.html loads js/news.js', () => {
  const html = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');
  assert.ok(html.includes('js/news.js'), 'index.html must include js/news.js script tag');
});

test('public/js/weather.js exists', () => {
  assert.ok(fs.existsSync(path.join(root, 'public', 'js', 'weather.js')), 'public/js/weather.js should exist');
});

test('public/js/news.js exists', () => {
  assert.ok(fs.existsSync(path.join(root, 'public', 'js', 'news.js')), 'public/js/news.js should exist');
});

test('server/weather.js exists', () => {
  assert.ok(fs.existsSync(path.join(root, 'server', 'weather.js')), 'server/weather.js router should exist');
});

test('server/news.js exists', () => {
  assert.ok(fs.existsSync(path.join(root, 'server', 'news.js')), 'server/news.js router should exist');
});

test('server/reddit.js exists', () => {
  assert.ok(fs.existsSync(path.join(root, 'server', 'reddit.js')), 'server/reddit.js router should exist');
});

test('server/openclaw.js exists', () => {
  assert.ok(fs.existsSync(path.join(root, 'server', 'openclaw.js')), 'server/openclaw.js router should exist');
});

test('server.js mounts /api/openclaw route', () => {
  const src = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
  assert.ok(src.includes('/api/openclaw'), 'server.js must mount /api/openclaw route');
});

test('server.js mounts /api/weather route', () => {
  const src = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
  assert.ok(src.includes('/api/weather'), 'server.js must mount /api/weather route');
});

test('server.js mounts /api/news route', () => {
  const src = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
  assert.ok(src.includes('/api/news'), 'server.js must mount /api/news route');
});

test('server.js mounts /api/reddit route', () => {
  const src = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
  assert.ok(src.includes('/api/reddit'), 'server.js must mount /api/reddit route');
});

test('package.json has jest devDependency', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert.ok(pkg.devDependencies && pkg.devDependencies.jest, 'jest should be in devDependencies');
});

test('package.json has test script', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert.ok(pkg.scripts && pkg.scripts.test, 'package.json must have a test script');
});
