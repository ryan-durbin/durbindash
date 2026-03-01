/**
 * US-001: Tests for .spinner, .error-state, .last-updated CSS classes
 * and link color contrast fixes in styles.css
 */
const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../public/styles.css');
let css;

beforeAll(() => {
    css = fs.readFileSync(cssPath, 'utf8');
});

test('.spinner class exists with border-radius:50%', () => {
    expect(css).toMatch(/\.spinner\s*\{[^}]*border-radius\s*:\s*50%/s);
});

test('.spinner class has spin keyframe animation', () => {
    expect(css).toMatch(/@keyframes spin/);
    expect(css).toMatch(/\.spinner\s*\{[^}]*animation[^}]*spin/s);
});

test('.error-state class exists as yellow warning box', () => {
    expect(css).toMatch(/\.error-state\s*\{/);
    expect(css).toMatch(/\.error-state\s*\{[^}]*background\s*:\s*#fffde7/s);
    expect(css).toMatch(/\.error-state\s*\{[^}]*border\s*:/s);
});

test('.last-updated class exists with small muted styling', () => {
    expect(css).toMatch(/\.last-updated\s*\{/);
    expect(css).toMatch(/\.last-updated\s*\{[^}]*font-size/s);
});

test('link color uses #90CAF9 not raw cyan (#00FFFF)', () => {
    expect(css).toMatch(/#90CAF9/i);
    expect(css).not.toMatch(/a\s*\{[^}]*color\s*:\s*#00FFFF/si);
});

test('visited link color uses #CE93D8 not raw magenta (#FF00FF)', () => {
    expect(css).toMatch(/#CE93D8/i);
    expect(css).not.toMatch(/a:visited\s*\{[^}]*color\s*:\s*#FF00FF/si);
});
