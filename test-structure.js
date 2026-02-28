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

// US-003: index.html tests
const indexPath = path.join(root, 'public', 'index.html');

test('index.html exists', () => {
  assert.ok(fs.existsSync(indexPath), 'public/index.html should exist');
});

test('index.html has correct title', () => {
  const content = fs.readFileSync(indexPath, 'utf8');
  assert.ok(content.includes("<title>DurbinDash - Ryan's Personal Portal</title>"), 'should have correct title');
});

test('index.html has marquee with welcome text', () => {
  const content = fs.readFileSync(indexPath, 'utf8');
  assert.ok(content.includes('WELCOME TO DURBINDASH :: YOUR PERSONAL WEB PORTAL :: EST. 2026'), 'should have marquee text');
  assert.ok(content.includes('<marquee'), 'should have marquee tag');
});

test('index.html links styles.css', () => {
  const content = fs.readFileSync(indexPath, 'utf8');
  assert.ok(content.includes("href='styles.css'"), 'should link styles.css');
});

test('index.html has table-based layout', () => {
  const content = fs.readFileSync(indexPath, 'utf8');
  assert.ok(content.includes('<table'), 'should have table element');
});

test('index.html has weather-content placeholder', () => {
  const content = fs.readFileSync(indexPath, 'utf8');
  assert.ok(content.includes("id=\"weather-content\"") || content.includes("id='weather-content'"), 'should have weather-content div');
});

test('index.html has news-content placeholder', () => {
  const content = fs.readFileSync(indexPath, 'utf8');
  assert.ok(content.includes("id=\"news-content\"") || content.includes("id='news-content'"), 'should have news-content div');
});

test('index.html has reddit-content placeholder', () => {
  const content = fs.readFileSync(indexPath, 'utf8');
  assert.ok(content.includes("id=\"reddit-content\"") || content.includes("id='reddit-content'"), 'should have reddit-content div');
});

test('index.html has tech-news-content placeholder', () => {
  const content = fs.readFileSync(indexPath, 'utf8');
  assert.ok(content.includes("id=\"tech-news-content\"") || content.includes("id='tech-news-content'"), 'should have tech-news-content div');
});

test('index.html has under-construction div', () => {
  const content = fs.readFileSync(indexPath, 'utf8');
  assert.ok(content.includes("id='under-construction'") || content.includes('id="under-construction"'), 'should have under-construction div');
});

test('index.html has all 6 portal-btn links', () => {
  const content = fs.readFileSync(indexPath, 'utf8');
  assert.ok(content.includes('10.0.1.132:8123'), 'should have Home Assistant link');
  assert.ok(content.includes('10.0.1.132:7747'), 'should have ClawStats link');
  assert.ok(content.includes('10.0.1.132:5678'), 'should have n8n link');
  assert.ok(content.includes('10.0.1.132:3333'), 'should have Antfarm link');
  assert.ok(content.includes('10.0.1.132:8080'), 'should have Vaultwarden link');
  assert.ok(content.includes('10.0.1.132:2283'), 'should have Immich link');
});

test('index.html has new-badge element', () => {
  const content = fs.readFileSync(indexPath, 'utf8');
  assert.ok(content.includes("class='new-badge'") || content.includes('class="new-badge"'), 'should have new-badge span');
});

test('index.html has visitor counter', () => {
  const content = fs.readFileSync(indexPath, 'utf8');
  assert.ok(content.includes('Visitors: 001337'), 'should have visitor counter');
});

test('index.html has portal-btn class on links', () => {
  const content = fs.readFileSync(indexPath, 'utf8');
  const matches = (content.match(/class=['"]portal-btn['"]/g) || []).length;
  assert.ok(matches >= 6, `should have at least 6 portal-btn links, found ${matches}`);
});
