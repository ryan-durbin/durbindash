'use strict';

/**
 * Regression test: node-fetch must be CJS-compatible (v2.x).
 * node-fetch v3 is ESM-only and breaks CommonJS require().
 * This test would have caught the original bug where package.json
 * specified node-fetch ^3.x while server/weather.js used require().
 */

describe('node-fetch CJS compatibility regression', () => {
  test('node-fetch can be required with CommonJS require()', () => {
    // If node-fetch v3 were installed, this would throw:
    // "SyntaxError: Cannot use import statement outside a module"
    let fetchFn;
    expect(() => {
      fetchFn = require('node-fetch');
    }).not.toThrow();
    expect(typeof fetchFn).toBe('function');
  });

  test('server/weather.js loads without error via CommonJS require()', () => {
    // node-fetch v3 + require() would fail at module load time
    let weatherModule;
    expect(() => {
      weatherModule = require('../server/weather');
    }).not.toThrow();
    expect(typeof weatherModule.fetchWeather).toBe('function');
  });

  test('package.json specifies node-fetch ^2.x (CJS-compatible)', () => {
    const pkg = require('../package.json');
    const version = pkg.dependencies['node-fetch'];
    expect(version).toMatch(/^\^2\./);
  });
});
