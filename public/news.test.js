'use strict';

const assert = require('assert');
const { formatDate, renderItems, renderError } = require('./news.js');

// Minimal mock DOM helpers
function makeMockElement(tag) {
  const el = {
    tag,
    children: [],
    textContent: '',
    className: '',
    href: '',
    target: '',
    rel: '',
    innerHTML: '',
    appendChild(child) { this.children.push(child); },
    createElement: null,
  };
  return el;
}

const mockDocument = {
  createElement(tag) {
    return makeMockElement(tag);
  }
};

// Patch global document for renderItems/renderError
global.document = mockDocument;

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

// Test 1: formatDate returns readable date
test('formatDate returns human-readable date', () => {
  const result = formatDate('2024-01-15T10:00:00Z');
  assert.ok(result.includes('2024') || result.includes('Jan'), 'should include year or month name');
});

// Test 2: formatDate handles empty
test('formatDate handles empty string', () => {
  assert.strictEqual(formatDate(''), '');
});

// Test 3: renderItems renders correct number of items
test('renderItems renders correct number of items (up to 8)', () => {
  const container = makeMockElement('div');
  const items = Array.from({ length: 10 }, (_, i) => ({
    title: 'Article ' + i,
    url: 'https://example.com/' + i,
    source: 'Source',
    date: '2024-01-01',
  }));
  renderItems(container, items);
  // container should have 1 child (ul)
  assert.strictEqual(container.children.length, 1);
  const ul = container.children[0];
  assert.strictEqual(ul.tag, 'ul');
  assert.strictEqual(ul.children.length, 8, 'should only render 8 items');
});

// Test 4: Each item has <a> with url and target=_blank, and source in meta
test('renderItems renders title link and source', () => {
  const container = makeMockElement('div');
  const items = [{ title: 'Test Title', url: 'https://example.com/test', source: 'MySource', date: '' }];
  renderItems(container, items);
  const ul = container.children[0];
  const li = ul.children[0];
  const a = li.children[0];
  const meta = li.children[1];
  assert.strictEqual(a.tag, 'a');
  assert.strictEqual(a.href, 'https://example.com/test');
  assert.strictEqual(a.target, '_blank');
  assert.strictEqual(a.textContent, 'Test Title');
  assert.ok(meta.textContent.includes('MySource'), 'meta should include source name');
});

// Test 5: renderError shows error message
test('renderError sets non-empty error message', () => {
  const container = makeMockElement('div');
  renderError(container, 'Network failure');
  assert.ok(container.textContent.length > 0, 'error message should be non-empty');
  assert.ok(container.textContent.includes('Network failure'));
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
