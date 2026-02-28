(function() {
  const widget = document.getElementById('weather-widget');
  if (!widget) return;
  fetch('/api/weather')
    .then(r => r.json())
    .then(data => {
      widget.innerHTML = '<div class="widget-title">🌤 Current Weather</div>' +
        '<div class="weather-temp">' + (data.temp || '--') + '°F</div>' +
        '<div class="weather-desc">' + (data.description || '') + '</div>' +
        '<div style="font-size:0.8em;color:#888;margin-top:4px;">' + (data.location || '') + '</div>';
    })
    .catch(() => {
      const body = widget.querySelector('.loading') || widget;
      if (body.classList.contains('loading')) body.className = 'error';
      body.textContent = 'Weather unavailable';
    });
})();
