(function() {
  function getWeatherIcon(description) {
    if (!description) return '🌡️';
    var d = description.toLowerCase();
    if (d.includes('thunder') || d.includes('lightning')) return '⛈️';
    if (d.includes('snow') || d.includes('blizzard') || d.includes('sleet') || d.includes('freezing')) return '❄️';
    if (d.includes('rain') || d.includes('drizzle') || d.includes('shower')) return '🌧️';
    if (d.includes('fog') || d.includes('mist') || d.includes('haze')) return '🌫️';
    if (d.includes('cloud') || d.includes('overcast')) return '☁️';
    if (d.includes('clear') || d.includes('sunny')) return '☀️';
    return '🌡️';
  }

  var widget = document.getElementById('weather-widget');
  if (!widget) return;
  fetch('/api/weather')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var w = data;
      var html = '<div class="widget-title">🌤 Current Weather</div>' +
        '<div class="weather-temp">' + (w.temp || '--') + '°F</div>' +
        '<div class="weather-desc">' + (w.description || '') + '</div>' +
        '<div style="font-size:0.8em;color:#888;margin-top:4px;">' + (w.location || '') + '</div>';

      if (w.forecast && w.forecast.length > 0) {
        var days = '';
        for (var i = 0; i < w.forecast.length; i++) {
          var f = w.forecast[i];
          var date = new Date(f.date + 'T12:00:00');
          var dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
          var icon = getWeatherIcon(f.description);
          days += '<div class="wx-fc-day">' +
            '<div>' + dayLabel + '</div>' +
            '<div>' + icon + '</div>' +
            '<div>' + f.high + '°/' + f.low + '°</div>' +
            '</div>';
        }
        html += '<div class="wx-forecast">' +
          '<div class="wx-fc-label">3-DAY FORECAST</div>' +
          '<div class="wx-fc-days">' + days + '</div>' +
          '</div>';
      }

      widget.innerHTML = html;
    })
    .catch(function() {
      var body = widget.querySelector('.loading') || widget;
      if (body.classList && body.classList.contains('loading')) body.className = 'error';
      body.textContent = 'Weather unavailable';
    });

  // Export for testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getWeatherIcon: getWeatherIcon };
  }
})();
