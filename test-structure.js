import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// === US-002: styles.css tests ===

test('styles.css exists', () => {
  const cssPath = path.join(__dirname, 'public', 'styles.css');
  assert.ok(fs.existsSync(cssPath), 'public/styles.css should exist');
});

test('styles.css contains .section-header with Comic Sans', () => {
  const css = fs.readFileSync(path.join(__dirname, 'public', 'styles.css'), 'utf8');
  assert.ok(css.includes('.section-header'), 'should have .section-header rule');
  assert.ok(css.includes('Comic Sans'), 'should reference Comic Sans font');
  assert.ok(css.includes('background-color'), '.section-header should have background-color');
});

test('styles.css contains .portal-btn with teal background', () => {
  const css = fs.readFileSync(path.join(__dirname, 'public', 'styles.css'), 'utf8');
  assert.ok(css.includes('.portal-btn'), 'should have .portal-btn rule');
  assert.ok(css.includes('#008080'), 'should include teal color #008080');
});

test('styles.css contains @keyframes blink for .new-badge', () => {
  const css = fs.readFileSync(path.join(__dirname, 'public', 'styles.css'), 'utf8');
  assert.ok(css.includes('@keyframes blink'), 'should have @keyframes blink');
  assert.ok(css.includes('.new-badge'), 'should have .new-badge rule');
  assert.ok(css.includes('animation'), '.new-badge should use animation');
});

test('styles.css contains .visitor-counter rule', () => {
  const css = fs.readFileSync(path.join(__dirname, 'public', 'styles.css'), 'utf8');
  assert.ok(css.includes('.visitor-counter'), 'should have .visitor-counter rule');
});

test('styles.css contains table and td layout rules', () => {
  const css = fs.readFileSync(path.join(__dirname, 'public', 'styles.css'), 'utf8');
  assert.ok(css.includes('border-collapse: collapse'), 'table should have border-collapse: collapse');
  assert.ok(css.includes('vertical-align: top'), 'td should have vertical-align: top');
  assert.ok(/\btable\b/.test(css), 'should have table rule');
  assert.ok(/\btd\b/.test(css), 'should have td rule');
});

test('styles.css contains .under-construction rule with striped/yellow border', () => {
  const css = fs.readFileSync(path.join(__dirname, 'public', 'styles.css'), 'utf8');
  assert.ok(css.includes('.under-construction'), 'should have .under-construction rule');
  // Striped border or yellow border
  const hasStripes = css.includes('repeating-linear-gradient') || css.includes('#FFD700');
  assert.ok(hasStripes, 'under-construction should have striped or yellow styling');
});

test('styles.css has all four palette colors', () => {
  const css = fs.readFileSync(path.join(__dirname, 'public', 'styles.css'), 'utf8');
  assert.ok(css.includes('#000080'), 'should have navy #000080');
  assert.ok(css.includes('#008080'), 'should have teal #008080');
  assert.ok(css.includes('#FFD700'), 'should have yellow #FFD700');
  assert.ok(css.includes('#FF00FF'), 'should have magenta #FF00FF');
});
