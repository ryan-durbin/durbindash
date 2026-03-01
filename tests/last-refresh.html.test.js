/**
 * Tests for US-003: Remove visitor counter and under-construction banner; add last-refresh indicator
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

  test('should contain element with id="last-refresh"', () => {
    expect(html).toMatch(/id=["']last-refresh["']/);
  });
});
