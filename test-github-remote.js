const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execSync } = require('node:child_process');

test('git remote origin contains ryan-durbin/durbindash', () => {
  const url = execSync('git remote get-url origin', { cwd: __dirname }).toString().trim();
  assert.ok(url.includes('ryan-durbin/durbindash'), `Expected URL to contain 'ryan-durbin/durbindash', got: ${url}`);
});

test('git status shows clean working tree (no modified/staged files)', () => {
  const status = execSync('git status --porcelain', { cwd: __dirname }).toString().trim();
  const lines = status.split('\n').filter(l => l.trim());
  const modified = lines.filter(l => !l.startsWith('??'));
  assert.equal(modified.length, 0, `Working tree has modified/staged files: ${modified.join(', ')}`);
});

test('gh repo view ryan-durbin/durbindash exits with code 0', () => {
  let exitCode = 0;
  try {
    execSync('gh repo view ryan-durbin/durbindash', { stdio: 'pipe' });
  } catch (e) {
    exitCode = e.status;
  }
  assert.equal(exitCode, 0, 'gh repo view ryan-durbin/durbindash failed');
});
