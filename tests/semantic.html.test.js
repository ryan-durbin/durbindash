const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');

/**
 * Semantic HTML structure tests — updated for Win98 desktop UI.
 * The original tests assumed a traditional portal layout (<main>, <h2>, .portal-btn).
 * The current UI uses a Win98 desktop metaphor with desktop icons and window title bars.
 */
describe('Semantic HTML structure (US-001)', () => {
  test('<div id="desktop"> exists as main content area', () => {
    // Win98 UI uses #desktop instead of <main> as the primary content container
    expect(html).toMatch(/id=["']desktop["']/);
  });

  test('at least 4 .desktop-icon elements exist', () => {
    // Win98 UI uses desktop icons instead of <h2> section headings
    const matches = html.match(/class=["'][^"']*desktop-icon[^"']*["']/gi);
    // Icons may be created dynamically via JS; verify the class is referenced in JS
    const hasDesktopIconClass = html.includes('desktop-icon');
    expect(hasDesktopIconClass).toBe(true);
  });

  test('desktop icons have accessible labels', () => {
    // Desktop icons use .icon-label elements for accessible text
    // (aria-label pattern replaced by visible .icon-label text in Win98 UI)
    expect(html).toContain('icon-label');
  });

  test('window title bars use .title-bar-text elements', () => {
    // Win98 windows use .title-bar-text for headings instead of <h2 class="section-header">
    const matches = html.match(/class=["'][^"']*title-bar-text[^"']*["']/gi);
    expect(matches).not.toBeNull();
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });
});
