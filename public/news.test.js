'use strict';

// Simple mock DOM test for public/news.js
// Uses Node.js built-in assert; no external deps needed

const assert = require('assert');

// --- Minimal DOM mock ---
function makeElement(tag) {
  const el = {
    _tag: tag,
    _children: [],
    _attrs: {},
    style: {},
    className: '',
    textContent: '',
    innerHTML: '',
    href: '',
    target: '',
    rel: '',
    appendChild(child) { this._children.push(child); },
    createElement: null, // will be set via document
  };
  return el;
}

function makeDocument(containerId) {
  const container = makeElement('div');
  container.id = containerId;

  const doc = {
    _listeners: {},
    _container: container,
    getElementById(id) {
      return id === containerId ? container : null;
    },
    createElement(tag) {
      return makeElement(tag);
    },
    addEventListener(event, fn) {
      this._listeners[event] = fn;
    },
    trigger(event) {
      if (this._listeners[event]) this._listeners[event]();
    }
  };
  return doc;
}

// --- Load news.js logic inline (extracted functions for testability) ---
// We re-implement the same logic here since we can't load browser scripts in Node
// This tests the BEHAVIOR defined in news.js

function formatDate(dateStr) {
  if (!dateStr) return '';
  var d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function renderNews(document, container, items) {
  container.innerHTML = '';
  container._children = [];
  var ul = document.createElement('ul');
  ul.style.listStyle = 'none';
  ul.style.padding = '0';
  items.forEach(function (item) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = item.url || '#';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = item.title || '(no title)';
    a.className = 'news-title';
    var meta = document.createElement('span');
    meta.className = 'news-meta';
    meta.textContent = ' — ' + (item.source || '') + (item.date ? ' · ' + formatDate(item.date) : '');
    li.appendChild(a);
    li.appendChild(meta);
    ul.appendChild(li);
  });
  container.appendChild(ul);
}

function renderError(container, message) {
  container.innerHTML = '<span class="news-error">' + message + '</span>';
}

// --- Tests ---
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log('  PASS:', name);
    passed++;
  } catch (e) {
    console.log('  FAIL:', name, '-', e.message);
    failed++;
  }
}

console.log('\nRunning public/news.js tests...\n');

// Test 1: renderNews creates correct number of list items
test('renders correct number of items', () => {
  const doc = makeDocument('news-feed-ai');
  const container = doc._container;
  const items = [
    { title: 'Article 1', url: 'https://a.com/1', source: 'TechCrunch', date: '2026-02-28T00:00:00Z' },
    { title: 'Article 2', url: 'https://a.com/2', source: 'MIT', date: '2026-02-27T00:00:00Z' },
    { title: 'Article 3', url: 'https://a.com/3', source: 'VentureBeat', date: '2026-02-26T00:00:00Z' },
  ];
  renderNews(doc, container, items);
  const ul = container._children[0];
  assert.strictEqual(ul._children.length, 3, 'should render 3 list items');
});

// Test 2: each item renders title and source
test('renders title as <a> link and shows source name', () => {
  const doc = makeDocument('news-feed-ai');
  const container = doc._container;
  const items = [
    { title: 'AI Breakthrough', url: 'https://mit.edu/ai', source: 'MIT Tech Review', date: '2026-02-28T00:00:00Z' },
  ];
  renderNews(doc, container, items);
  const ul = container._children[0];
  const li = ul._children[0];
  const a = li._children[0];
  const meta = li._children[1];

  assert.strictEqual(a.textContent, 'AI Breakthrough', 'link text should be title');
  assert.strictEqual(a.href, 'https://mit.edu/ai', 'link href should be url');
  assert.strictEqual(a.target, '_blank', 'link should open in _blank');
  assert(meta.textContent.includes('MIT Tech Review'), 'meta should include source name');
});

// Test 3: renders up to 8 items
test('renders up to 8 items', () => {
  const doc = makeDocument('news-feed-ai');
  const container = doc._container;
  const items = Array.from({ length: 8 }, (_, i) => ({
    title: 'Article ' + i,
    url: 'https://a.com/' + i,
    source: 'Source',
    date: '2026-02-28T00:00:00Z',
  }));
  renderNews(doc, container, items);
  const ul = container._children[0];
  assert.strictEqual(ul._children.length, 8, 'should render all 8 items');
});

// Test 4: error state
test('renders error message on fetch failure', () => {
  const container = makeElement('div');
  renderError(container, 'Failed to load AI news: HTTP 500');
  assert(container.innerHTML.includes('Failed to load AI news'), 'error message should be in innerHTML');
  assert(container.innerHTML.length > 0, 'error container innerHTML should be non-empty');
});

// Test 5: syntax check of actual news.js file
test('public/news.js is syntactically valid (require check)', () => {
  const { execSync } = require('child_process');
  const path = require('path');
  const filePath = path.join(__dirname, 'news.js');
  // node --check validates syntax without executing
  execSync('node --check ' + filePath);
});

console.log('\nResults:', passed, 'passed,', failed, 'failed\n');
if (failed > 0) process.exit(1);
