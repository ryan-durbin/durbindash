const fs = require('fs');
const path = require('path');

describe('US-002: Remove badge-new from static section headers', () => {
  const indexHtml = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
  const newsJs = fs.readFileSync(path.join(__dirname, '../public/js/news.js'), 'utf8');

  test('index.html contains no badge-new spans', () => {
    expect(indexHtml).not.toMatch(/badge-new/);
  });

  test('news.js still creates badge-new spans for per-article badges', () => {
    expect(newsJs).toMatch(/badge-new/);
  });
});
