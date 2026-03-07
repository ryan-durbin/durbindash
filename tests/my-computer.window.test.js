'use strict';

const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');

describe('My Computer window markup', () => {
  test('index.html contains element with id="my-computer-window"', () => {
    expect(html).toContain('id="my-computer-window"');
  });

  test('my-computer-window element has 98.css class "window"', () => {
    // Check that the element with id="my-computer-window" also has class="window"
    expect(html).toMatch(/id="my-computer-window"[^>]*class="window"|class="window"[^>]*id="my-computer-window"/);
  });

  test('title bar contains text "My Computer"', () => {
    expect(html).toContain('title-bar-text');
    expect(html).toMatch(/title-bar-text[^>]*>[\s]*My Computer/);
  });

  test('title bar controls include button with aria-label="Minimize"', () => {
    expect(html).toContain('aria-label="Minimize"');
  });

  test('title bar controls include button with aria-label="Close"', () => {
    expect(html).toContain('aria-label="Close"');
  });

  test('window body contains element with id="mycomp-loading"', () => {
    expect(html).toContain('id="mycomp-loading"');
  });

  test('window body contains element with id="mycomp-stats"', () => {
    expect(html).toContain('id="mycomp-stats"');
  });

  test('mycomp-stats contains a table', () => {
    // The stats div should have a table inside it
    const statsIdx = html.indexOf('id="mycomp-stats"');
    expect(statsIdx).toBeGreaterThan(-1);
    const afterStats = html.slice(statsIdx);
    const tableIdx = afterStats.indexOf('<table');
    const closeDivIdx = afterStats.indexOf('</div>');
    // Table should appear before the closing div of mycomp-stats
    expect(tableIdx).toBeGreaterThan(-1);
    expect(tableIdx).toBeLessThan(closeDivIdx);
  });

  test('window has position:fixed set in CSS', () => {
    expect(html).toMatch(/#my-computer-window\s*\{[^}]*position\s*:\s*fixed/);
  });

  test('window has z-index set in CSS', () => {
    expect(html).toMatch(/#my-computer-window\s*\{[^}]*z-index\s*:/);
  });

  test('mycomp-table class CSS exists with monospace font', () => {
    expect(html).toMatch(/\.mycomp-table\s*\{[^}]*font-family\s*:\s*monospace/);
  });
});
