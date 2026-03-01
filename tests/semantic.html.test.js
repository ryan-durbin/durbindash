const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');

describe('Semantic HTML structure (US-001)', () => {
  test('<main> element exists', () => {
    expect(html).toMatch(/<main[\s>]/i);
  });

  test('at least 4 <h2> elements exist', () => {
    const matches = html.match(/<h2[\s>]/gi);
    expect(matches).not.toBeNull();
    expect(matches.length).toBeGreaterThanOrEqual(4);
  });

  test('every .portal-btn anchor has aria-label', () => {
    // Find all portal-btn anchors
    const portalBtnRegex = /<a[^>]+class=['"][^'"]*portal-btn[^'"]*['"][^>]*>/gi;
    const anchors = html.match(portalBtnRegex) || [];
    expect(anchors.length).toBeGreaterThan(0);
    for (const anchor of anchors) {
      expect(anchor).toMatch(/aria-label=/i);
    }
  });

  test('h2 elements use class section-header', () => {
    const h2Regex = /<h2[^>]*>/gi;
    const h2s = html.match(h2Regex) || [];
    expect(h2s.length).toBeGreaterThanOrEqual(4);
    for (const h2 of h2s) {
      expect(h2).toMatch(/class=['"][^'"]*section-header[^'"]*['"]/i);
    }
  });
});
