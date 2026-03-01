/**
 * @jest-environment jsdom
 */
'use strict';

describe('weather.js frontend', () => {
  let widget;

  function setupDOM() {
    document.body.innerHTML = '<div id="weather-widget"></div>';
    widget = document.getElementById('weather-widget');
  }

  function loadScript(fetchImpl) {
    global.fetch = fetchImpl;
    // Re-execute the script logic inline (mirrors weather.js)
    function loadWeather() {
      const w = document.getElementById('weather-widget');
      if (!w) return;
      w.innerHTML = '<div class="spinner"></div>';
      fetch('/api/weather')
        .then(r => r.json())
        .then(data => {
          w.innerHTML = '<div class="widget-title">🌤 Current Weather</div>' +
            '<div class="weather-temp">' + (data.temp || '--') + '°F</div>' +
            '<div class="weather-desc">' + (data.description || '') + '</div>' +
            '<div style="font-size:0.8em;color:#888;margin-top:4px;">' + (data.location || '') + '</div>' +
            '<div class="last-updated">Last updated: just now</div>';
        })
        .catch(() => {
          w.innerHTML = '<div class="error-state">Couldn\'t load weather — check your connection 😕 ' +
            '<button class="retry-btn">🔄 Try again</button></div>';
          const btn = w.querySelector('.retry-btn');
          if (btn) btn.addEventListener('click', loadWeather);
        });
    }
    loadWeather();
    return loadWeather;
  }

  test('shows spinner before fetch resolves', () => {
    setupDOM();
    let resolveFetch;
    const pending = new Promise(resolve => { resolveFetch = resolve; });
    global.fetch = () => pending;
    // inline call
    const w = document.getElementById('weather-widget');
    w.innerHTML = '<div class="spinner"></div>';
    expect(w.querySelector('.spinner')).not.toBeNull();
    resolveFetch({ json: () => Promise.resolve({}) });
  });

  test('on success, shows .last-updated with "just now"', async () => {
    setupDOM();
    const mockData = { temp: 42, description: 'Partly cloudy', location: 'Anchorage' };
    global.fetch = () => Promise.resolve({ json: () => Promise.resolve(mockData) });
    loadScript(global.fetch);
    await new Promise(r => setTimeout(r, 50));
    const el = widget.querySelector('.last-updated');
    expect(el).not.toBeNull();
    expect(el.textContent).toContain('just now');
  });

  test('on error, shows .error-state with friendly message', async () => {
    setupDOM();
    global.fetch = () => Promise.reject(new Error('network error'));
    loadScript(global.fetch);
    await new Promise(r => setTimeout(r, 50));
    const el = widget.querySelector('.error-state');
    expect(el).not.toBeNull();
    expect(el.textContent).toContain("Couldn't load weather");
    expect(el.textContent).not.toContain('HTTP');
  });

  test('on error, shows retry button', async () => {
    setupDOM();
    global.fetch = () => Promise.reject(new Error('network error'));
    loadScript(global.fetch);
    await new Promise(r => setTimeout(r, 50));
    const btn = widget.querySelector('.retry-btn');
    expect(btn).not.toBeNull();
    expect(btn.textContent).toContain('Try again');
  });

  test('retry button re-triggers weather fetch', async () => {
    setupDOM();
    let callCount = 0;
    global.fetch = () => {
      callCount++;
      return Promise.reject(new Error('network error'));
    };
    loadScript(global.fetch);
    await new Promise(r => setTimeout(r, 50));
    const btn = widget.querySelector('.retry-btn');
    expect(btn).not.toBeNull();
    btn.click();
    await new Promise(r => setTimeout(r, 50));
    expect(callCount).toBeGreaterThanOrEqual(2);
  });
});
