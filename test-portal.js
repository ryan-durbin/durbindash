import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(__dirname, 'public/index.html'), 'utf8');

test('index.html exists and is non-empty', () => {
  assert.ok(html.length > 0, 'index.html should not be empty');
});

test('contains Smart Home category header', () => {
  assert.ok(html.includes('Smart Home'), 'Should contain Smart Home header');
});

test('contains Media & Files category header', () => {
  assert.ok(html.includes('Media'), 'Should contain Media & Files header');
});

test('contains Security & Access category header', () => {
  assert.ok(html.includes('Security'), 'Should contain Security & Access header');
});

test('contains Cameras category header', () => {
  assert.ok(html.includes('Cameras'), 'Should contain Cameras header');
});

test('contains Automation & Dev category header', () => {
  assert.ok(html.includes('Automation'), 'Should contain Automation & Dev header');
});

test('contains Projects (Under Construction) category header', () => {
  assert.ok(html.includes('Projects'), 'Should contain Projects header');
});

test('Home Assistant link is correct', () => {
  assert.ok(html.includes('href="http://10.0.1.132:8123"'), 'Should contain Home Assistant URL');
});

test('Immich link is correct', () => {
  assert.ok(html.includes('href="http://10.0.1.132:2283"'), 'Should contain Immich URL');
});

test('Vaultwarden link href is http://10.0.1.132:8080', () => {
  assert.ok(html.includes('href="http://10.0.1.132:8080"'), 'Should contain Vaultwarden URL');
});

test('Portainer link href is https://10.0.1.132:9443', () => {
  assert.ok(html.includes('href="https://10.0.1.132:9443"'), 'Should contain Portainer URL');
});

test('Traefik Dashboard link href is http://10.0.1.132:8080/dashboard/', () => {
  assert.ok(html.includes('href="http://10.0.1.132:8080/dashboard/"'), 'Should contain Traefik Dashboard URL');
});

test('Frigate NVR link is correct', () => {
  assert.ok(html.includes('href="http://10.0.1.132:5000"'), 'Should contain Frigate URL');
});

test('n8n link is correct', () => {
  assert.ok(html.includes('href="http://10.0.1.132:5678"'), 'Should contain n8n URL');
});

test('Antfarm Dashboard link is correct', () => {
  assert.ok(html.includes('href="http://10.0.1.132:3333"'), 'Should contain Antfarm URL');
});

test('ClawStats link is correct', () => {
  assert.ok(html.includes('href="http://10.0.1.132:7747"'), 'Should contain ClawStats URL');
});

test('RadiaMaps link has target=_blank and rel=noopener', () => {
  const radiamapsIdx = html.indexOf('radiamaps.com');
  assert.ok(radiamapsIdx !== -1, 'Should contain radiamaps.com');
  // Check nearby context for target and rel
  const snippet = html.slice(Math.max(0, radiamapsIdx - 300), radiamapsIdx + 100);
  assert.ok(snippet.includes('target="_blank"'), 'RadiaMaps link should have target=_blank');
  assert.ok(snippet.includes('rel="noopener"'), 'RadiaMaps link should have rel=noopener');
});

test('Kudoz item contains COMING SOON text', () => {
  assert.ok(html.includes('Kudoz'), 'Should contain Kudoz');
  const kudozIdx = html.indexOf('Kudoz');
  const snippet = html.slice(kudozIdx, kudozIdx + 200);
  assert.ok(snippet.includes('COMING SOON'), 'Kudoz should have COMING SOON badge');
});

test('Card Counter item contains COMING SOON text', () => {
  assert.ok(html.includes('Card Counter'), 'Should contain Card Counter');
  const idx = html.indexOf('Card Counter');
  const snippet = html.slice(idx, idx + 200);
  assert.ok(snippet.includes('COMING SOON'), 'Card Counter should have COMING SOON badge');
});

test('Weather Dash item contains COMING SOON text', () => {
  assert.ok(html.includes('Weather Dash'), 'Should contain Weather Dash');
  const idx = html.indexOf('Weather Dash');
  const snippet = html.slice(idx, idx + 200);
  assert.ok(snippet.includes('COMING SOON'), 'Weather Dash should have COMING SOON badge');
});

test('WMT Calendar Sync item contains RUNNING text', () => {
  assert.ok(html.includes('WMT Calendar Sync'), 'Should contain WMT Calendar Sync');
  const idx = html.indexOf('WMT Calendar Sync');
  const snippet = html.slice(idx, idx + 200);
  assert.ok(snippet.includes('RUNNING'), 'WMT Calendar Sync should have RUNNING badge');
});

test('DurbinDash link is correct', () => {
  assert.ok(html.includes('href="http://10.0.1.132:7748"'), 'Should contain DurbinDash URL');
});

test('COMING SOON badge has blinking animation CSS class', () => {
  assert.ok(html.includes('badge-coming-soon'), 'Should have badge-coming-soon CSS class');
  assert.ok(html.includes('blink-badge') || html.includes('animation'), 'Should have blink animation defined');
});

test('RUNNING badge uses green color style', () => {
  assert.ok(html.includes('badge-running'), 'Should have badge-running CSS class');
  assert.ok(html.includes('#00cc44') || html.includes('green'), 'Should have green color for RUNNING badge');
});

test('portal buttons have chunky 90s styling', () => {
  assert.ok(html.includes('portal-btn-lg'), 'Should have portal-btn-lg class');
  assert.ok(html.includes('border'), 'Should define border styling');
  assert.ok(html.includes('padding'), 'Should define padding');
  assert.ok(html.includes('background'), 'Should define background-color');
});
