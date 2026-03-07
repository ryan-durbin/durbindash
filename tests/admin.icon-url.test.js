'use strict';

const fs = require('fs');
const path = require('path');

const adminHtml = fs.readFileSync(path.join(__dirname, '../public/admin.html'), 'utf8');

describe('admin.html icon URL support', () => {
  test('icon input has maxlength="500"', () => {
    expect(adminHtml).toContain('maxlength="500"');
  });

  test('icon input placeholder contains https://', () => {
    expect(adminHtml).toMatch(/placeholder="[^"]*https:\/\//);
  });

  test('icon input placeholder mentions example.com/icon.png', () => {
    expect(adminHtml).toContain('https://example.com/icon.png');
  });

  test('table rendering uses isIconUrl helper', () => {
    expect(adminHtml).toContain('function isIconUrl(icon)');
  });

  test('table rendering uses createElement(img) for URL icons', () => {
    expect(adminHtml).toContain("createElement('img')");
  });

  test('table rendering falls back to textContent for emoji icons', () => {
    expect(adminHtml).toContain('iconTd.textContent = sc.icon');
  });
});
