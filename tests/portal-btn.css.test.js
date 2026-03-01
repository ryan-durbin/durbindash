const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, '../public/styles.css'), 'utf8');

test('.portal-btn has padding with at least 12px vertical', () => {
  const match = css.match(/\.portal-btn\s*\{([^}]*)\}/s);
  expect(match).not.toBeNull();
  const block = match[1];
  const paddingMatch = block.match(/padding:\s*(\d+)px/);
  expect(paddingMatch).not.toBeNull();
  expect(parseInt(paddingMatch[1], 10)).toBeGreaterThanOrEqual(12);
});

test('.portal-btn has min-height: 44px', () => {
  expect(css).toMatch(/\.portal-btn\s*\{[^}]*min-height:\s*44px/s);
});

test('.portal-btn has min-width: 44px', () => {
  expect(css).toMatch(/\.portal-btn\s*\{[^}]*min-width:\s*44px/s);
});

test('.portal-btn:focus-visible rule exists with outline', () => {
  expect(css).toMatch(/\.portal-btn:focus-visible\s*\{[^}]*outline:/s);
});
