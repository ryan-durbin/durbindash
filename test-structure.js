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
