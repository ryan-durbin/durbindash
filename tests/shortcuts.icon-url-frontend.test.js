/**
 * @jest-environment jsdom
 */
'use strict';

// Inline the isIconUrl helper (mirrors implementation in public/index.html)
function isIconUrl(icon) {
  return /^https?:\/\/|^\//.test(icon);
}

describe('isIconUrl()', () => {
  test('returns true for https:// URLs', () => {
    expect(isIconUrl('https://example.com/icon.png')).toBe(true);
  });

  test('returns true for http:// URLs', () => {
    expect(isIconUrl('http://example.com/icon.png')).toBe(true);
  });

  test('returns true for root-relative paths', () => {
    expect(isIconUrl('/local/icon.png')).toBe(true);
  });

  test('returns false for emoji', () => {
    expect(isIconUrl('🏠')).toBe(false);
  });

  test('returns false for gear emoji', () => {
    expect(isIconUrl('⚙️')).toBe(false);
  });

  test('returns false for plain text', () => {
    expect(isIconUrl('myicon')).toBe(false);
  });
});

describe('renderDesktop() icon rendering logic', () => {
  function buildIconHTML(sc) {
    const iconContent = isIconUrl(sc.icon)
      ? `<img src="${sc.icon}" alt="${sc.name}" class="icon-url-img">`
      : sc.icon;
    return `<div class="icon-img">${iconContent}</div><div class="icon-label">${sc.name}</div>`;
  }

  test('produces <img class="icon-url-img"> for URL icons', () => {
    const html = buildIconHTML({ icon: 'https://example.com/icon.png', name: 'Test' });
    const container = document.createElement('div');
    container.innerHTML = html;
    const img = container.querySelector('img.icon-url-img');
    expect(img).not.toBeNull();
    expect(img.src).toBe('https://example.com/icon.png');
    expect(img.alt).toBe('Test');
  });

  test('produces raw emoji text for emoji icons', () => {
    const html = buildIconHTML({ icon: '🏠', name: 'Home' });
    const container = document.createElement('div');
    container.innerHTML = html;
    const img = container.querySelector('img');
    expect(img).toBeNull();
    expect(container.querySelector('.icon-img').textContent).toBe('🏠');
  });
});

describe('renderStartMenu() icon rendering logic', () => {
  function buildMenuItemHTML(sc) {
    const menuIconContent = isIconUrl(sc.icon)
      ? `<img src="${sc.icon}" alt="${sc.name}" class="icon-url-img" style="width:20px;height:20px;object-fit:contain;vertical-align:middle;">`
      : sc.icon;
    return `<span class="menu-icon">${menuIconContent}</span> ${sc.name}`;
  }

  test('produces <img class="icon-url-img"> for URL icons', () => {
    const html = buildMenuItemHTML({ icon: 'https://example.com/icon.png', name: 'Test' });
    const container = document.createElement('div');
    container.innerHTML = html;
    const img = container.querySelector('img.icon-url-img');
    expect(img).not.toBeNull();
    expect(img.src).toBe('https://example.com/icon.png');
  });

  test('produces raw emoji text for emoji icons', () => {
    const html = buildMenuItemHTML({ icon: '⚙️', name: 'Settings' });
    const container = document.createElement('div');
    container.innerHTML = html;
    const img = container.querySelector('img');
    expect(img).toBeNull();
    expect(container.querySelector('.menu-icon').textContent).toBe('⚙️');
  });
});

describe('CSS rule exists in index.html', () => {
  test('.desktop-icon .icon-img .icon-url-img rule is present with required properties', () => {
    const fs = require('fs');
    const html = fs.readFileSync(require('path').join(__dirname, '../public/index.html'), 'utf8');
    expect(html).toContain('.desktop-icon .icon-img .icon-url-img');
    expect(html).toContain('width: 100%');
    expect(html).toContain('height: 100%');
    expect(html).toContain('object-fit: contain');
  });
});
