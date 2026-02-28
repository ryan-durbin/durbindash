'use strict';

// 90s-style weather widget for DurbinDash
// Fetches from /api/weather and populates #weather-widget

function getWeatherIcon(description) {
  const desc = (description || '').toLowerCase();
  if (desc.includes('thunderstorm')) return '⚡';
  if (desc.includes('snow')) return '❄️';
  if (desc.includes('rain') || desc.includes('drizzle')) return '🌧️';
  if (desc.includes('fog')) return '🌫️';
  if (desc.includes('partly') || desc.includes('cloudy') || desc.includes('overcast')) return '⛅';
  if (desc.includes('clear') || desc.includes('mainly clear')) return '☀️';
  return '🌡️';
}

async function loadWeather() {
  const widget = document.getElementById('weather-widget');
  if (!widget) return;

  try {
    const res = await fetch('/api/weather');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const w = await res.json();

    const icon = getWeatherIcon(w.description);

    widget.innerHTML = [
      '<div class="wx-icon">' + icon + '</div>',
      '<div class="wx-temp">' + Math.round(w.temperature) + '&deg;F</div>',
      '<div class="wx-desc">' + w.description + '</div>',
      '<div class="wx-meta">',
      '  <span>&#8593;' + Math.round(w.highTemp) + '&deg;</span>',
      '  <span>&#8595;' + Math.round(w.lowTemp) + '&deg;</span>',
      '  <span>&#128168; ' + Math.round(w.windSpeed) + ' mph</span>',
      '  <span>&#128167; ' + w.humidity + '%</span>',
      '</div>',
      '<div class="wx-location">&#127757; Anchorage, AK</div>',
    ].join('\n');
  } catch (err) {
    if (widget) {
      widget.innerHTML = '<p class="wx-error">&#9888; Weather unavailable</p>';
    }
  }
}

document.addEventListener('DOMContentLoaded', loadWeather);
