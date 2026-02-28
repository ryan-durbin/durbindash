const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const readmePath = path.join(__dirname, 'README.md');
const content = fs.readFileSync(readmePath, 'utf8');

test('README.md exists', () => {
  assert.ok(fs.existsSync(readmePath), 'README.md should exist at project root');
});

test('README.md contains DurbinDash', () => {
  assert.ok(content.includes('DurbinDash'), 'README.md should contain "DurbinDash"');
});

test('README.md contains port 7748', () => {
  assert.ok(content.includes('7748'), 'README.md should contain "7748"');
});

test('README.md contains npm start', () => {
  assert.ok(content.includes('npm start'), 'README.md should contain "npm start"');
});

test('README.md contains dashboard', () => {
  assert.ok(
    content.toLowerCase().includes('dashboard'),
    'README.md should contain "dashboard"'
  );
});

test('README.md describes Yahoo/AOL aesthetic', () => {
  assert.ok(
    content.includes('Yahoo') || content.includes('AOL'),
    'README.md should mention Yahoo or AOL aesthetic'
  );
});
