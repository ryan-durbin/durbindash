'use strict';

// Extract getWeatherIcon logic for unit testing
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

describe('getWeatherIcon', () => {
  test('thunderstorm returns storm icon', () => {
    expect(getWeatherIcon('Thunderstorm')).toBe('⛈️');
  });
  test('lightning returns storm icon', () => {
    expect(getWeatherIcon('Lightning storm')).toBe('⛈️');
  });
  test('snow returns snow icon', () => {
    expect(getWeatherIcon('Heavy snow')).toBe('❄️');
  });
  test('blizzard returns snow icon', () => {
    expect(getWeatherIcon('Blizzard')).toBe('❄️');
  });
  test('sleet returns snow icon', () => {
    expect(getWeatherIcon('Sleet')).toBe('❄️');
  });
  test('freezing returns snow icon', () => {
    expect(getWeatherIcon('Freezing drizzle')).toBe('❄️');
  });
  test('rain returns rain icon', () => {
    expect(getWeatherIcon('Rain')).toBe('🌧️');
  });
  test('drizzle returns rain icon', () => {
    expect(getWeatherIcon('Drizzle')).toBe('🌧️');
  });
  test('shower returns rain icon', () => {
    expect(getWeatherIcon('Shower')).toBe('🌧️');
  });
  test('fog returns fog icon', () => {
    expect(getWeatherIcon('Fog')).toBe('🌫️');
  });
  test('mist returns fog icon', () => {
    expect(getWeatherIcon('Mist')).toBe('🌫️');
  });
  test('haze returns fog icon', () => {
    expect(getWeatherIcon('Haze')).toBe('🌫️');
  });
  test('cloudy returns cloud icon', () => {
    expect(getWeatherIcon('Cloudy')).toBe('☁️');
  });
  test('overcast returns cloud icon', () => {
    expect(getWeatherIcon('Overcast')).toBe('☁️');
  });
  test('clear returns sun icon', () => {
    expect(getWeatherIcon('Clear sky')).toBe('☀️');
  });
  test('sunny returns sun icon', () => {
    expect(getWeatherIcon('Sunny')).toBe('☀️');
  });
  test('unknown returns thermometer icon', () => {
    expect(getWeatherIcon('Unknown condition')).toBe('🌡️');
  });
  test('empty string returns thermometer icon', () => {
    expect(getWeatherIcon('')).toBe('🌡️');
  });
  test('null/undefined returns thermometer icon', () => {
    expect(getWeatherIcon(null)).toBe('🌡️');
    expect(getWeatherIcon(undefined)).toBe('🌡️');
  });
  test('case insensitive matching', () => {
    expect(getWeatherIcon('THUNDERSTORM')).toBe('⛈️');
    expect(getWeatherIcon('SNOW')).toBe('❄️');
    expect(getWeatherIcon('RAIN')).toBe('🌧️');
    expect(getWeatherIcon('FOG')).toBe('🌫️');
    expect(getWeatherIcon('CLOUD')).toBe('☁️');
    expect(getWeatherIcon('CLEAR')).toBe('☀️');
  });
});
