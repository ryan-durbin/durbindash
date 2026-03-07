/**
 * My Computer Window Manager
 * Handles open/close/minimize/restore/drag for the My Computer stats window.
 * Exported for testing (CommonJS) and attached to window in the browser.
 */
(function () {
  // --- State ---
  var myComputerOpen = false;
  var myComputerMinimized = false;
  var statsRefreshInterval = null;

  // --- Helpers ---
  function getWindow() {
    return document.getElementById('my-computer-window');
  }

  function addTaskbarButton() {
    if (document.getElementById('taskbar-mycomputer')) return;
    var btn = document.createElement('button');
    btn.id = 'taskbar-mycomputer';
    btn.className = 'button';
    btn.textContent = '🖥️ My Computer';
    btn.style.cssText = 'margin-left:4px; height:22px; font-size:11px; padding:0 6px; cursor:pointer;';
    btn.addEventListener('click', function () {
      if (myComputerMinimized) {
        restoreMyComputer();
      } else if (myComputerOpen) {
        minimizeMyComputer();
      }
    });
    var taskbarLeft = document.getElementById('taskbar-left');
    if (taskbarLeft) taskbarLeft.appendChild(btn);
  }

  function removeTaskbarButton() {
    var btn = document.getElementById('taskbar-mycomputer');
    if (btn && btn.parentNode) btn.parentNode.removeChild(btn);
  }

  // --- Core window actions ---
  function openMyComputer() {
    myComputerOpen = true;
    myComputerMinimized = false;
    var win = getWindow();
    if (win) {
      win.style.display = 'block';
      win.style.zIndex = '500';
    }
    addTaskbarButton();
    loadSystemStats();
    if (!statsRefreshInterval) {
      statsRefreshInterval = setInterval(loadSystemStats, 30000);
    }
  }

  function closeMyComputer() {
    myComputerOpen = false;
    myComputerMinimized = false;
    var win = getWindow();
    if (win) win.style.display = 'none';
    if (statsRefreshInterval) {
      clearInterval(statsRefreshInterval);
      statsRefreshInterval = null;
    }
    removeTaskbarButton();
  }

  function minimizeMyComputer() {
    myComputerMinimized = true;
    var win = getWindow();
    if (win) win.style.display = 'none';
  }

  function restoreMyComputer() {
    myComputerMinimized = false;
    var win = getWindow();
    if (win) {
      win.style.display = 'block';
      win.style.zIndex = '500';
    }
  }

  // --- Stats loading ---
  function loadSystemStats() {
    var loading = document.getElementById('mycomp-loading');
    var stats = document.getElementById('mycomp-stats');

    fetch('/api/system')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (loading) loading.style.display = 'none';
        if (stats) stats.style.display = 'block';
        function set(id, val) {
          var el = document.getElementById(id);
          if (el) el.textContent = val;
        }
        set('mc-hostname', data.hostname);
        set('mc-uptime', data.uptime);
        set('mc-cpu-model', data.cpu.model);
        set('mc-cpu-cores', data.cpu.cores);
        set('mc-loadavg', data.cpu.loadavg.map(function (n) { return n.toFixed(2); }).join(' / '));
        set('mc-memory',
          'Total: ' + data.memory.total.toFixed(1) + ' GB | ' +
          'Used: ' + data.memory.used.toFixed(1) + ' GB | ' +
          'Free: ' + data.memory.free.toFixed(1) + ' GB'
        );
        set('mc-disk',
          'Total: ' + data.disk.total.toFixed(1) + ' GB | ' +
          'Used: ' + data.disk.used.toFixed(1) + ' GB | ' +
          'Free: ' + data.disk.free.toFixed(1) + ' GB'
        );
        set('mc-os', data.os.platform + ' ' + data.os.release + ' (' + data.os.arch + ')');
      })
      .catch(function (e) {
        if (loading) loading.textContent = 'Error loading stats.';
        console.error('Failed to load system stats', e);
      });
  }

  // --- Drag by title bar ---
  function setupDrag() {
    var win = document.getElementById('my-computer-window');
    if (!win) return;
    var titleBar = win.querySelector('.title-bar');
    if (!titleBar) return;

    var isDragging = false;
    var startX, startY, startLeft, startTop;

    titleBar.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = parseInt(win.style.left) || 100;
      startTop = parseInt(win.style.top) || 60;
      win.style.zIndex = '600';

      function onMouseMove(e) {
        if (!isDragging) return;
        var dx = e.clientX - startX;
        var dy = e.clientY - startY;
        win.style.left = (startLeft + dx) + 'px';
        win.style.top = (startTop + dy) + 'px';
      }

      function onMouseUp() {
        isDragging = false;
        win.style.zIndex = '500';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }

  // --- Wiring (close/minimize buttons + drag) ---
  function init() {
    var win = document.getElementById('my-computer-window');
    if (win) {
      var closeBtn = win.querySelector('button[aria-label="Close"]');
      if (closeBtn) closeBtn.addEventListener('click', closeMyComputer);
      var minBtn = win.querySelector('button[aria-label="Minimize"]');
      if (minBtn) minBtn.addEventListener('click', minimizeMyComputer);
    }
    setupDrag();
  }

  // --- State accessor (for testing) ---
  function getState() {
    return { myComputerOpen: myComputerOpen, myComputerMinimized: myComputerMinimized };
  }

  function resetState() {
    myComputerOpen = false;
    myComputerMinimized = false;
    if (statsRefreshInterval) {
      clearInterval(statsRefreshInterval);
      statsRefreshInterval = null;
    }
  }

  // --- Export ---
  if (typeof module !== 'undefined' && module.exports) {
    // Node / Jest environment
    module.exports = {
      openMyComputer: openMyComputer,
      closeMyComputer: closeMyComputer,
      minimizeMyComputer: minimizeMyComputer,
      restoreMyComputer: restoreMyComputer,
      addTaskbarButton: addTaskbarButton,
      removeTaskbarButton: removeTaskbarButton,
      loadSystemStats: loadSystemStats,
      setupDrag: setupDrag,
      init: init,
      getState: getState,
      resetState: resetState
    };
  } else {
    // Browser: expose on window
    window.openMyComputer = openMyComputer;
    window.closeMyComputer = closeMyComputer;
    window.minimizeMyComputer = minimizeMyComputer;
    window.restoreMyComputer = restoreMyComputer;
    window.loadSystemStats = loadSystemStats;
    document.addEventListener('DOMContentLoaded', init);
  }
})();
