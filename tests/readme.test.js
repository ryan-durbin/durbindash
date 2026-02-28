import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const readmePath = join(__dirname, '..', 'README.md');
const readme = readFileSync(readmePath, 'utf8');

test('README contains Deployment section heading', () => {
  assert.ok(readme.includes('## Deployment'), 'Missing ## Deployment section');
});

test('README contains deploy.sh reference with usage instructions', () => {
  assert.ok(readme.includes('deploy.sh'), 'Missing deploy.sh reference');
  assert.ok(readme.includes('bash deploy.sh'), 'Missing usage: bash deploy.sh');
});

test('README contains systemctl example command', () => {
  assert.ok(readme.includes('systemctl status durbindash'), 'Missing systemctl status command');
});

test('README mentions restart-on-failure behavior', () => {
  assert.ok(readme.includes('restart') && readme.includes('failure'), 'Missing restart-on-failure mention');
  assert.ok(readme.includes('5'), 'Missing 5s delay mention');
});

test('README preserves Features section', () => {
  assert.ok(readme.includes('## Features'), 'Missing ## Features section');
});

test('README preserves Tech Stack section', () => {
  assert.ok(readme.includes('## Tech Stack'), 'Missing ## Tech Stack section');
});
