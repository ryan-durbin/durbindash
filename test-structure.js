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

// =============================================
// US-002: styles.css content tests
// =============================================

test('styles.css exists in public/', () => {
  assert.ok(fs.existsSync(path.join(root, 'public', 'styles.css')), 'styles.css should exist');
});

test('styles.css contains .section-header with Comic Sans MS font', () => {
  const css = fs.readFileSync(path.join(root, 'public', 'styles.css'), 'utf8');
  assert.ok(css.includes('.section-header'), '.section-header rule should exist');
  assert.ok(css.includes('Comic Sans MS'), '.section-header should reference Comic Sans MS');
  assert.ok(css.includes('background-color'), '.section-header should have background-color');
});

test('styles.css contains .portal-btn with teal background', () => {
  const css = fs.readFileSync(path.join(root, 'public', 'styles.css'), 'utf8');
  assert.ok(css.includes('.portal-btn'), '.portal-btn rule should exist');
  assert.ok(css.includes('#008080'), '.portal-btn should have teal (#008080) background');
});

test('styles.css contains @keyframes blink animation', () => {
  const css = fs.readFileSync(path.join(root, 'public', 'styles.css'), 'utf8');
  assert.ok(css.includes('@keyframes blink'), '@keyframes blink should exist');
  assert.ok(css.includes('.new-badge'), '.new-badge rule should exist');
});

test('styles.css contains .visitor-counter rule', () => {
  const css = fs.readFileSync(path.join(root, 'public', 'styles.css'), 'utf8');
  assert.ok(css.includes('.visitor-counter'), '.visitor-counter rule should exist');
});

test('styles.css contains table and td layout rules', () => {
  const css = fs.readFileSync(path.join(root, 'public', 'styles.css'), 'utf8');
  assert.ok(css.includes('border-collapse: collapse'), 'table should have border-collapse: collapse');
  assert.ok(css.includes('vertical-align: top'), 'td should have vertical-align: top');
});

test('styles.css contains .under-construction rule', () => {
  const css = fs.readFileSync(path.join(root, 'public', 'styles.css'), 'utf8');
  assert.ok(css.includes('.under-construction'), '.under-construction rule should exist');
});

test('styles.css has navy background on body (#000080)', () => {
  const css = fs.readFileSync(path.join(root, 'public', 'styles.css'), 'utf8');
  assert.ok(css.includes('#000080'), 'body should have navy (#000080) in stylesheet');
});
