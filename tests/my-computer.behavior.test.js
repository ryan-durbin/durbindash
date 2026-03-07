/**
 * @jest-environment jsdom
 *
 * Tests for US-004: My Computer window — open, close, minimize, restore, drag
 */

let mc;

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
        <div id="mycomp-loading">Loading...</div>
        <div id="mycomp-stats" style="display:none;">
          <table>
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

beforeEach(() => {
  jest.resetModules();
  jest.useFakeTimers();
  buildDOM();

  // Mock fetch
  global.fetch = jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue({
      hostname: 'testhost',
      uptime: '1 day, 2 hours',
      cpu: { model: 'Test CPU X', cores: 4, loadavg: [0.10, 0.20, 0.30] },
      memory: { total: 16.0, used: 8.0, free: 8.0 },
      disk: { total: 100.0, used: 50.0, free: 50.0 },
      os: { platform: 'linux', release: '5.15.0', arch: 'x64' }
    })
  });

  mc = require('../public/js/my-computer.js');
});

afterEach(() => {
  mc.resetState();
  jest.clearAllMocks();
  jest.useRealTimers();
});

// ─── openMyComputer() ────────────────────────────────────────────────────────

describe('openMyComputer()', () => {
  test('sets display:block on #my-computer-window', () => {
    mc.openMyComputer();
    expect(document.getElementById('my-computer-window').style.display).toBe('block');
  });

  test('sets myComputerOpen = true, myComputerMinimized = false', () => {
    mc.openMyComputer();
    const state = mc.getState();
    expect(state.myComputerOpen).toBe(true);
    expect(state.myComputerMinimized).toBe(false);
  });

  test('adds taskbar button #taskbar-btn-mycomp', () => {
    mc.openMyComputer();
    expect(document.getElementById('taskbar-btn-mycomp')).not.toBeNull();
  });

  test('only adds one taskbar button when called twice', () => {
    mc.openMyComputer();
    mc.openMyComputer();
    const buttons = document.querySelectorAll('#taskbar-btn-mycomp');
    expect(buttons.length).toBe(1);
  });

  test('calls fetch to load stats', () => {
    mc.openMyComputer();
    expect(global.fetch).toHaveBeenCalledWith('/api/system');
  });

  test('sets window z-index to 500', () => {
    mc.openMyComputer();
    expect(document.getElementById('my-computer-window').style.zIndex).toBe('500');
  });
});

// ─── closeMyComputer() ───────────────────────────────────────────────────────

describe('closeMyComputer()', () => {
  test('sets display:none on #my-computer-window', () => {
    mc.openMyComputer();
    mc.closeMyComputer();
    expect(document.getElementById('my-computer-window').style.display).toBe('none');
  });

  test('sets myComputerOpen = false', () => {
    mc.openMyComputer();
    mc.closeMyComputer();
    expect(mc.getState().myComputerOpen).toBe(false);
  });

  test('sets myComputerMinimized = false', () => {
    mc.openMyComputer();
    mc.minimizeMyComputer();
    mc.closeMyComputer();
    expect(mc.getState().myComputerMinimized).toBe(false);
  });

  test('removes taskbar button', () => {
    mc.openMyComputer();
    mc.closeMyComputer();
    expect(document.getElementById('taskbar-btn-mycomp')).toBeNull();
  });
});

// ─── minimizeMyComputer() ────────────────────────────────────────────────────

describe('minimizeMyComputer()', () => {
  test('hides #my-computer-window (display:none)', () => {
    mc.openMyComputer();
    mc.minimizeMyComputer();
    expect(document.getElementById('my-computer-window').style.display).toBe('none');
  });

  test('sets myComputerMinimized = true', () => {
    mc.openMyComputer();
    mc.minimizeMyComputer();
    expect(mc.getState().myComputerMinimized).toBe(true);
  });

  test('does not remove taskbar button (still open/minimized)', () => {
    mc.openMyComputer();
    mc.minimizeMyComputer();
    // Taskbar button stays when minimized (click it to restore)
    expect(document.getElementById('taskbar-btn-mycomp')).not.toBeNull();
  });
});

// ─── restoreMyComputer() ─────────────────────────────────────────────────────

describe('restoreMyComputer()', () => {
  test('shows #my-computer-window (display:block) when minimized', () => {
    mc.openMyComputer();
    mc.minimizeMyComputer();
    mc.restoreMyComputer();
    expect(document.getElementById('my-computer-window').style.display).toBe('block');
  });

  test('sets myComputerMinimized = false', () => {
    mc.openMyComputer();
    mc.minimizeMyComputer();
    mc.restoreMyComputer();
    expect(mc.getState().myComputerMinimized).toBe(false);
  });

  test('sets window z-index to 500 on restore', () => {
    mc.openMyComputer();
    mc.minimizeMyComputer();
    mc.restoreMyComputer();
    expect(document.getElementById('my-computer-window').style.zIndex).toBe('500');
  });
});

// ─── init() — button wiring ──────────────────────────────────────────────────

describe('init() — button wiring', () => {
  test('Close button click calls closeMyComputer (hides window)', () => {
    mc.openMyComputer();
    mc.init();
    const closeBtn = document.querySelector('#my-computer-window button[aria-label="Close"]');
    closeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(document.getElementById('my-computer-window').style.display).toBe('none');
    expect(mc.getState().myComputerOpen).toBe(false);
  });

  test('Minimize button click calls minimizeMyComputer (hides window, sets minimized)', () => {
    mc.openMyComputer();
    mc.init();
    const minBtn = document.querySelector('#my-computer-window button[aria-label="Minimize"]');
    minBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(document.getElementById('my-computer-window').style.display).toBe('none');
    expect(mc.getState().myComputerMinimized).toBe(true);
  });
});

// ─── setupDrag() — title bar drag ───────────────────────────────────────────

describe('setupDrag()', () => {
  test('mousedown on title bar + mousemove updates window left/top', () => {
    mc.setupDrag();
    const win = document.getElementById('my-computer-window');
    win.style.left = '100px';
    win.style.top = '60px';

    const titleBar = win.querySelector('.title-bar');

    titleBar.dispatchEvent(new MouseEvent('mousedown', {
      bubbles: true, clientX: 200, clientY: 100, button: 0
    }));
    document.dispatchEvent(new MouseEvent('mousemove', {
      bubbles: true, clientX: 250, clientY: 130
    }));

    expect(parseInt(win.style.left)).toBe(150);  // 100 + (250-200)
    expect(parseInt(win.style.top)).toBe(90);    // 60 + (130-100)

    // Clean up
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
  });

  test('mouseup stops dragging — subsequent mousemove has no effect', () => {
    mc.setupDrag();
    const win = document.getElementById('my-computer-window');
    win.style.left = '100px';
    win.style.top = '60px';

    const titleBar = win.querySelector('.title-bar');

    titleBar.dispatchEvent(new MouseEvent('mousedown', {
      bubbles: true, clientX: 200, clientY: 100, button: 0
    }));
    document.dispatchEvent(new MouseEvent('mousemove', {
      bubbles: true, clientX: 250, clientY: 130
    }));
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

    // Move after mouseup — should not change position further
    document.dispatchEvent(new MouseEvent('mousemove', {
      bubbles: true, clientX: 400, clientY: 300
    }));

    expect(parseInt(win.style.left)).toBe(150);
    expect(parseInt(win.style.top)).toBe(90);
  });

  test('mousedown bumps z-index to 600 during drag', () => {
    mc.setupDrag();
    const win = document.getElementById('my-computer-window');
    win.style.left = '100px';
    win.style.top = '60px';

    const titleBar = win.querySelector('.title-bar');
    titleBar.dispatchEvent(new MouseEvent('mousedown', {
      bubbles: true, clientX: 200, clientY: 100, button: 0
    }));

    expect(win.style.zIndex).toBe('600');

    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    expect(win.style.zIndex).toBe('500');
  });

  test('right-click (button != 0) does not initiate drag', () => {
    mc.setupDrag();
    const win = document.getElementById('my-computer-window');
    win.style.left = '100px';
    win.style.top = '60px';

    const titleBar = win.querySelector('.title-bar');
    titleBar.dispatchEvent(new MouseEvent('mousedown', {
      bubbles: true, clientX: 200, clientY: 100, button: 2
    }));
    document.dispatchEvent(new MouseEvent('mousemove', {
      bubbles: true, clientX: 300, clientY: 200
    }));

    // Position unchanged since right-click shouldn't drag
    expect(parseInt(win.style.left)).toBe(100);
    expect(parseInt(win.style.top)).toBe(60);
  });
});

// ─── Taskbar button behavior ─────────────────────────────────────────────────

describe('taskbar button', () => {
  test('clicking taskbar button while open minimizes the window', () => {
    mc.openMyComputer();
    const btn = document.getElementById('taskbar-btn-mycomp');
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(mc.getState().myComputerMinimized).toBe(true);
    expect(document.getElementById('my-computer-window').style.display).toBe('none');
  });

  test('clicking taskbar button while minimized restores the window', () => {
    mc.openMyComputer();
    mc.minimizeMyComputer();
    const btn = document.getElementById('taskbar-btn-mycomp');
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(mc.getState().myComputerMinimized).toBe(false);
    expect(document.getElementById('my-computer-window').style.display).toBe('block');
  });
});
