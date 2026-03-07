/**
 * @jest-environment jsdom
 *
 * Tests for US-006: System stats fetch, display, and 30-second auto-refresh
 */

let mc;

const mockStatsData = {
  hostname: 'strixhalo',
  uptime: '14 days, 3 hours',
  cpu: { model: 'AMD Ryzen 9 5950X', cores: 16, loadavg: [0.12, 0.34, 0.56] },
  memory: { total: 64.0, used: 32.0, free: 32.0 },
  disk: { total: 500.0, used: 250.0, free: 250.0 },
  os: { platform: 'linux', release: '6.1.0', arch: 'x64' }
};

function buildDOM() {
  document.body.innerHTML = `
    <div id="my-computer-window" class="window" style="display:none; top:60px; left:100px;">
      <div class="title-bar">
        <div class="title-bar-text">My Computer</div>
        <div class="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Close"></button>
        </div>
      </div>
      <div class="window-body">
        <div id="mycomp-loading" style="display:block;">Loading...</div>
        <div id="mycomp-stats" style="display:none;">
          <table class="mycomp-table">
            <tbody>
              <tr><td>Hostname</td><td id="mc-hostname">—</td></tr>
              <tr><td>Uptime</td><td id="mc-uptime">—</td></tr>
              <tr><td>CPU Model</td><td id="mc-cpu-model">—</td></tr>
              <tr><td>CPU Cores</td><td id="mc-cpu-cores">—</td></tr>
              <tr><td>Load Avg</td><td id="mc-loadavg">—</td></tr>
              <tr><td>Memory</td><td id="mc-memory">—</td></tr>
              <tr><td>Disk</td><td id="mc-disk">—</td></tr>
              <tr><td>OS</td><td id="mc-os">—</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div id="my-computer" class="desktop-icon">
      <div class="icon-img">🖥️</div>
      <div class="icon-label">My Computer</div>
    </div>
    <div id="taskbar">
      <div id="taskbar-left">
        <button id="start-button">Start</button>
        <div id="taskbar-windows"></div>
      </div>
    </div>
  `;
}

// Flush all pending microtasks (Promises)
function flushPromises() {
  return new Promise(resolve => {
    // Multiple ticks to exhaust nested promise chains
    Promise.resolve().then(() => Promise.resolve().then(() => Promise.resolve().then(resolve)));
  });
}

beforeEach(() => {
  jest.resetModules();
  jest.useFakeTimers();
  buildDOM();
  mc = require('../public/js/my-computer.js');
});

afterEach(() => {
  mc.resetState();
  jest.clearAllMocks();
  jest.useRealTimers();
});

// ─── Loading state ─────────────────────────────────────────────────────────────

describe('Loading state', () => {
  test('shows #mycomp-loading and hides #mycomp-stats before fetch resolves', () => {
    // Use a deferred promise so we can inspect state before fetch resolves
    let resolvePromise;
    const deferred = new Promise((res) => { resolvePromise = res; });
    global.fetch = jest.fn().mockReturnValue(deferred);

    mc.openMyComputer();

    // Synchronously: loading shown, stats hidden
    expect(document.getElementById('mycomp-loading').style.display).toBe('block');
    expect(document.getElementById('mycomp-stats').style.display).toBe('none');

    // Resolve to avoid unhandled rejection
    resolvePromise({ json: () => Promise.resolve(mockStatsData) });
  });

  test('hides #mycomp-loading and shows #mycomp-stats after successful fetch', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockStatsData)
    });

    mc.openMyComputer();
    await flushPromises();

    expect(document.getElementById('mycomp-loading').style.display).toBe('none');
    expect(document.getElementById('mycomp-stats').style.display).toBe('block');
  });

  test('shows error message in #mycomp-loading on fetch failure', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    mc.openMyComputer();
    await flushPromises();

    const loading = document.getElementById('mycomp-loading');
    expect(loading.style.display).toBe('block');
    expect(loading.textContent).toMatch(/error/i);
  });
});

// ─── Stats table data ──────────────────────────────────────────────────────────

describe('Stats table data', () => {
  async function openAndFlush() {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockStatsData)
    });
    mc.openMyComputer();
    await flushPromises();
  }

  test('displays hostname value from API response', async () => {
    await openAndFlush();
    expect(document.getElementById('mc-hostname').textContent).toBe('strixhalo');
  });

  test('displays uptime from API response', async () => {
    await openAndFlush();
    expect(document.getElementById('mc-uptime').textContent).toBe('14 days, 3 hours');
  });

  test('displays CPU model from API response', async () => {
    await openAndFlush();
    expect(document.getElementById('mc-cpu-model').textContent).toBe('AMD Ryzen 9 5950X');
  });

  test('displays CPU cores from API response', async () => {
    await openAndFlush();
    expect(document.getElementById('mc-cpu-cores').textContent).toBe('16');
  });

  test('displays formatted load average (0.12 / 0.34 / 0.56)', async () => {
    await openAndFlush();
    expect(document.getElementById('mc-loadavg').textContent).toBe('0.12 / 0.34 / 0.56');
  });

  test('displays formatted memory (X.X GB used / Y.Y GB total)', async () => {
    await openAndFlush();
    const mem = document.getElementById('mc-memory').textContent;
    expect(mem).toContain('32.0 GB used');
    expect(mem).toContain('64.0 GB total');
  });

  test('displays formatted disk (X.X GB used / Y.Y GB total)', async () => {
    await openAndFlush();
    const disk = document.getElementById('mc-disk').textContent;
    expect(disk).toContain('250.0 GB used');
    expect(disk).toContain('500.0 GB total');
  });

  test('displays OS info with platform, arch, and kernel', async () => {
    await openAndFlush();
    const os = document.getElementById('mc-os').textContent;
    expect(os).toContain('linux');
    expect(os).toContain('x64');
    expect(os).toContain('kernel');
    expect(os).toContain('6.1.0');
  });
});

// ─── Interval management ───────────────────────────────────────────────────────

describe('Interval management', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockStatsData)
    });
  });

  test('setInterval with 30000ms is called when window opens', () => {
    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    mc.openMyComputer();
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 30000);
  });

  test('clearInterval is called when window is closed', () => {
    mc.openMyComputer();
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    mc.closeMyComputer();
    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  test('clearInterval is called when window is minimized', () => {
    mc.openMyComputer();
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    mc.minimizeMyComputer();
    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  test('setInterval is restarted when window is restored after minimize', () => {
    mc.openMyComputer();
    mc.minimizeMyComputer();
    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    mc.restoreMyComputer();
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 30000);
  });

  test('fetch is called again when window is restored', () => {
    mc.openMyComputer();
    const callCountAfterOpen = global.fetch.mock.calls.length;
    mc.minimizeMyComputer();
    mc.restoreMyComputer();
    expect(global.fetch.mock.calls.length).toBeGreaterThan(callCountAfterOpen);
  });

  test('fetch is called again on each auto-refresh tick', () => {
    mc.openMyComputer();
    const callCountAfterOpen = global.fetch.mock.calls.length;
    jest.advanceTimersByTime(30000);
    expect(global.fetch.mock.calls.length).toBeGreaterThan(callCountAfterOpen);
  });
});
