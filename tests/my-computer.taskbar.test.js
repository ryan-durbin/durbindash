/**
 * @jest-environment jsdom
 *
 * Tests for US-005: Taskbar integration — My Computer window button
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
          <table><tbody>
            <tr><td>Hostname</td><td id="mc-hostname">—</td></tr>
            <tr><td>Uptime</td><td id="mc-uptime">—</td></tr>
            <tr><td>CPU Model</td><td id="mc-cpu-model">—</td></tr>
            <tr><td>CPU Cores</td><td id="mc-cpu-cores">—</td></tr>
            <tr><td>Load Avg</td><td id="mc-loadavg">—</td></tr>
            <tr><td>Memory</td><td id="mc-memory">—</td></tr>
            <tr><td>Disk</td><td id="mc-disk">—</td></tr>
            <tr><td>OS</td><td id="mc-os">—</td></tr>
          </tbody></table>
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

  global.fetch = jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue({
      hostname: 'testhost',
      uptime: '1 day, 2 hours',
      cpu: { model: 'Test CPU', cores: 4, loadavg: [0.1, 0.2, 0.3] },
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

// ─── Structure ───────────────────────────────────────────────────────────────

describe('HTML structure', () => {
  test('#taskbar-windows exists inside #taskbar-left', () => {
    const taskbarLeft = document.getElementById('taskbar-left');
    const taskbarWindows = document.getElementById('taskbar-windows');
    expect(taskbarWindows).not.toBeNull();
    expect(taskbarLeft.contains(taskbarWindows)).toBe(true);
  });
});

// ─── updateTaskbar() / openMyComputer() ──────────────────────────────────────

describe('openMyComputer() — taskbar button appears', () => {
  test('taskbar-btn-mycomp appears in #taskbar-windows after openMyComputer()', () => {
    mc.openMyComputer();
    const btn = document.getElementById('taskbar-btn-mycomp');
    expect(btn).not.toBeNull();
    const taskbarWindows = document.getElementById('taskbar-windows');
    expect(taskbarWindows.contains(btn)).toBe(true);
  });

  test('button has label "🖥️ My Computer"', () => {
    mc.openMyComputer();
    const btn = document.getElementById('taskbar-btn-mycomp');
    expect(btn.textContent).toBe('🖥️ My Computer');
  });

  test('button has class "button"', () => {
    mc.openMyComputer();
    const btn = document.getElementById('taskbar-btn-mycomp');
    expect(btn.classList.contains('button')).toBe(true);
  });

  test('calling openMyComputer() twice does not create duplicate buttons', () => {
    mc.openMyComputer();
    mc.openMyComputer();
    const buttons = document.querySelectorAll('#taskbar-btn-mycomp');
    expect(buttons.length).toBe(1);
  });
});

// ─── closeMyComputer() ───────────────────────────────────────────────────────

describe('closeMyComputer() — taskbar button removed', () => {
  test('taskbar-btn-mycomp is removed after closeMyComputer()', () => {
    mc.openMyComputer();
    mc.closeMyComputer();
    expect(document.getElementById('taskbar-btn-mycomp')).toBeNull();
  });
});

// ─── minimizeMyComputer() ────────────────────────────────────────────────────

describe('minimizeMyComputer() — taskbar button stays', () => {
  test('taskbar-btn-mycomp stays visible after minimize (window is just hidden)', () => {
    mc.openMyComputer();
    mc.minimizeMyComputer();
    expect(document.getElementById('taskbar-btn-mycomp')).not.toBeNull();
  });
});

// ─── restoreMyComputer() ─────────────────────────────────────────────────────

describe('restoreMyComputer() — taskbar button still present', () => {
  test('taskbar-btn-mycomp still present after restore', () => {
    mc.openMyComputer();
    mc.minimizeMyComputer();
    mc.restoreMyComputer();
    expect(document.getElementById('taskbar-btn-mycomp')).not.toBeNull();
  });
});

// ─── Taskbar button click behavior ──────────────────────────────────────────

describe('taskbar button click — minimize/restore toggle', () => {
  test('clicking taskbar button when window is visible calls minimizeMyComputer()', () => {
    mc.openMyComputer();
    const btn = document.getElementById('taskbar-btn-mycomp');
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(mc.getState().myComputerMinimized).toBe(true);
    expect(document.getElementById('my-computer-window').style.display).toBe('none');
  });

  test('clicking taskbar button when window is minimized calls restoreMyComputer()', () => {
    mc.openMyComputer();
    mc.minimizeMyComputer();
    const btn = document.getElementById('taskbar-btn-mycomp');
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(mc.getState().myComputerMinimized).toBe(false);
    expect(document.getElementById('my-computer-window').style.display).toBe('block');
  });
});

// ─── updateTaskbar() direct call ─────────────────────────────────────────────

describe('updateTaskbar() function', () => {
  test('when open=true, creates button in #taskbar-windows', () => {
    mc.openMyComputer(); // sets open=true and calls updateTaskbar
    expect(document.getElementById('taskbar-btn-mycomp')).not.toBeNull();
  });

  test('when open=false (after close), removes button', () => {
    mc.openMyComputer();
    mc.closeMyComputer(); // sets open=false and calls updateTaskbar
    expect(document.getElementById('taskbar-btn-mycomp')).toBeNull();
  });
});
