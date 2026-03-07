'use strict';

const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');

describe('My Computer desktop icon (US-002)', () => {
  it('renderDesktop() contains My Computer icon with id my-computer', () => {
    // Check that the renderDesktop function contains 'my-computer' id
    expect(indexHtml).toMatch(/id\s*=\s*['"]my-computer['"]/);
    // Also accept dataset.id assignment
  });

  it('renderDesktop() uses 🖥️ emoji for My Computer icon', () => {
    expect(indexHtml).toContain('🖥️');
  });

  it('renderDesktop() has My Computer label text', () => {
    expect(indexHtml).toContain('My Computer');
  });

  it('My Computer icon has .desktop-icon class', () => {
    // Check that the element setting id=my-computer or dataset.id='my-computer' uses desktop-icon class
    expect(indexHtml).toMatch(/desktop-icon[\s\S]{0,200}my-computer|my-computer[\s\S]{0,200}desktop-icon/);
  });

  it('My Computer icon uses makeDraggable for position persistence', () => {
    // Check makeDraggable is called with 'my-computer'
    expect(indexHtml).toMatch(/makeDraggable\s*\([^,]+,\s*['"]my-computer['"]\s*\)/);
  });

  it('My Computer icon is added BEFORE the shortcuts.forEach loop', () => {
    const myComputerIdx = indexHtml.indexOf('my-computer');
    const forEachIdx = indexHtml.indexOf('shortcuts.forEach');
    expect(myComputerIdx).toBeGreaterThan(-1);
    expect(forEachIdx).toBeGreaterThan(-1);
    expect(myComputerIdx).toBeLessThan(forEachIdx);
  });

  it('My Computer icon uses default position top: 8, left: 8', () => {
    expect(indexHtml).toMatch(/top\s*:\s*8/);
    expect(indexHtml).toMatch(/left\s*:\s*8/);
  });
});
