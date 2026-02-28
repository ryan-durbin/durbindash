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

// US-003: index.html content tests
const indexHtmlPath = path.join(root, 'public', 'index.html');

test('public/index.html exists', () => {
  assert.ok(fs.existsSync(indexHtmlPath), 'public/index.html should exist');
});

test('index.html has correct title', () => {
  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  assert.ok(html.includes("<title>DurbinDash - Ryan's Personal Portal</title>"), 'title should be correct');
});

test('index.html has marquee with welcome text', () => {
  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  assert.ok(html.includes('WELCOME TO DURBINDASH :: YOUR PERSONAL WEB PORTAL :: EST. 2026'), 'marquee text should exist');
  assert.ok(html.includes('<marquee'), 'marquee tag should exist');
});

test('index.html links to styles.css', () => {
  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  assert.ok(html.includes("href='styles.css'") || html.includes('href="styles.css"'), 'should link to styles.css');
});

test('index.html has table-based layout', () => {
  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  assert.ok(html.includes('<table'), 'should have table element');
});

test('index.html has weather-content placeholder', () => {
  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  assert.ok(html.includes("id=\"weather-content\"") || html.includes("id='weather-content'"), 'weather-content div should exist');
});

test('index.html has news-content placeholder', () => {
  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  assert.ok(html.includes("id=\"news-content\"") || html.includes("id='news-content'"), 'news-content div should exist');
});

test('index.html has reddit-content placeholder', () => {
  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  assert.ok(html.includes("id=\"reddit-content\"") || html.includes("id='reddit-content'"), 'reddit-content div should exist');
});

test('index.html has tech-news-content placeholder', () => {
  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  assert.ok(html.includes("id=\"tech-news-content\"") || html.includes("id='tech-news-content'"), 'tech-news-content div should exist');
});

test('index.html has under-construction div', () => {
  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  assert.ok(html.includes("id=\"under-construction\"") || html.includes("id='under-construction'"), 'under-construction div should exist');
});

test('index.html has new-badge element', () => {
  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  assert.ok(html.includes("class='new-badge'") || html.includes('class="new-badge"'), 'new-badge element should exist');
});

test('index.html has visitor counter with 001337', () => {
  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  assert.ok(html.includes('Visitors: 001337'), 'visitor counter should show 001337');
});

test('index.html has all 6 portal-btn links', () => {
  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  const btnCount = (html.match(/class="portal-btn"|class='portal-btn'/g) || []).length;
  assert.ok(btnCount >= 6, `should have at least 6 portal-btn links, found ${btnCount}`);
});

test('index.html portal-btn has Home Assistant URL', () => {
  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  assert.ok(html.includes('10.0.1.132:8123'), 'Home Assistant URL should exist');
});

test('index.html portal-btn has ClawStats URL', () => {
  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  assert.ok(html.includes('10.0.1.132:7747'), 'ClawStats URL should exist');
});

test('index.html portal-btn has n8n URL', () => {
  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  assert.ok(html.includes('10.0.1.132:5678'), 'n8n URL should exist');
});

test('index.html portal-btn has Antfarm URL', () => {
  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  assert.ok(html.includes('10.0.1.132:3333'), 'Antfarm URL should exist');
});

test('index.html portal-btn has Vaultwarden URL', () => {
  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  assert.ok(html.includes('10.0.1.132:8080'), 'Vaultwarden URL should exist');
});

test('index.html portal-btn has Immich URL', () => {
  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  assert.ok(html.includes('10.0.1.132:2283'), 'Immich URL should exist');
});
