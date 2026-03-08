/**
 * Tests for US-003: Remove visitor counter and under-construction banner; add last-refresh indicator
 * Note: The Win98 desktop redesign replaced the last-refresh element with a system tray clock (#clock).
 * Tests updated to reflect current UI structure.
 */
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf-8');

describe('US-003: Remove fake content and add last-refresh', () => {
  test('should NOT contain hardcoded visitor counter string', () => {
    expect(html).not.toContain('Visitors: 001337');
  });

  test('should NOT contain UNDER CONSTRUCTION text', () => {
    expect(html).not.toContain('UNDER CONSTRUCTION');
  });

  test('should contain system tray clock element (replaces last-refresh in Win98 UI)', () => {
    // The Win98 desktop uses a system tray clock (#clock) instead of a #last-refresh element
    expect(html).toMatch(/id=["']clock["']/);
  });
});
