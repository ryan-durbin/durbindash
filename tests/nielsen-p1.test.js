/**
 * Tests for Nielsen Heuristics P1 fixes - US-001
 */

const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
const stylesCss = fs.readFileSync(path.join(__dirname, '../public/styles.css'), 'utf8');

describe('US-001: Viewport meta tag and body font', () => {
  test('index.html contains viewport meta tag', () => {
    expect(indexHtml).toContain('name="viewport"');
    expect(indexHtml).toContain('width=device-width, initial-scale=1');
  });

  test('styles.css body uses system-ui font stack', () => {
    const bodyMatch = stylesCss.match(/body\s*\{([^}]*)\}/s);
    expect(bodyMatch).not.toBeNull();
    const bodyRules = bodyMatch[1];
    expect(bodyRules).toContain('system-ui');
    expect(bodyRules).toContain('-apple-system');
  });

  test('styles.css body does NOT use Comic Sans', () => {
    const bodyMatch = stylesCss.match(/body\s*\{([^}]*)\}/s);
    expect(bodyMatch).not.toBeNull();
    const bodyRules = bodyMatch[1];
    expect(bodyRules).not.toContain('Comic Sans');
  });

  test('index.html has all required section IDs', () => {
    const requiredIds = ['weather-content', 'news-ai', 'news-tech', 'news-hn', 'app-portal'];
    for (const id of requiredIds) {
      expect(indexHtml).toContain('id="' + id + '"');
    }
  });
});
