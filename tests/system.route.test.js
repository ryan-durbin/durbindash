'use strict';

const request = require('supertest');
const app = require('../server');
const { getSystemStats, formatUptime } = require('../server/system');

describe('GET /api/system', () => {
  test('returns HTTP 200 with Content-Type application/json', async () => {
    const res = await request(app).get('/api/system');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });

  test('response body contains top-level keys: hostname, uptime, cpu, memory, disk, os', async () => {
    const res = await request(app).get('/api/system');
    expect(res.body).toHaveProperty('hostname');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('cpu');
    expect(res.body).toHaveProperty('memory');
    expect(res.body).toHaveProperty('disk');
    expect(res.body).toHaveProperty('os');
  });

  test('cpu object has model (string), cores (number > 0), loadavg (array of 3 numbers)', async () => {
    const res = await request(app).get('/api/system');
    const { cpu } = res.body;
    expect(typeof cpu.model).toBe('string');
    expect(typeof cpu.cores).toBe('number');
    expect(cpu.cores).toBeGreaterThan(0);
    expect(Array.isArray(cpu.loadavg)).toBe(true);
    expect(cpu.loadavg).toHaveLength(3);
    cpu.loadavg.forEach((v) => expect(typeof v).toBe('number'));
  });

  test('memory object has total, used, free (all numbers > 0)', async () => {
    const res = await request(app).get('/api/system');
    const { memory } = res.body;
    expect(typeof memory.total).toBe('number');
    expect(typeof memory.used).toBe('number');
    expect(typeof memory.free).toBe('number');
    expect(memory.total).toBeGreaterThan(0);
    expect(memory.used).toBeGreaterThan(0);
    expect(memory.free).toBeGreaterThan(0);
  });

  test('disk object has total, used, free (all numbers > 0)', async () => {
    const res = await request(app).get('/api/system');
    const { disk } = res.body;
    expect(typeof disk.total).toBe('number');
    expect(typeof disk.used).toBe('number');
    expect(typeof disk.free).toBe('number');
    expect(disk.total).toBeGreaterThan(0);
    expect(disk.used).toBeGreaterThan(0);
    expect(disk.free).toBeGreaterThan(0);
  });

  test('os object has platform, release, arch (all strings)', async () => {
    const res = await request(app).get('/api/system');
    const { os } = res.body;
    expect(typeof os.platform).toBe('string');
    expect(os.platform.length).toBeGreaterThan(0);
    expect(typeof os.release).toBe('string');
    expect(os.release.length).toBeGreaterThan(0);
    expect(typeof os.arch).toBe('string');
    expect(os.arch.length).toBeGreaterThan(0);
  });

  test('uptime is a non-empty string', async () => {
    const res = await request(app).get('/api/system');
    expect(typeof res.body.uptime).toBe('string');
    expect(res.body.uptime.length).toBeGreaterThan(0);
  });

  test('hostname is a non-empty string', async () => {
    const res = await request(app).get('/api/system');
    expect(typeof res.body.hostname).toBe('string');
    expect(res.body.hostname.length).toBeGreaterThan(0);
  });
});

describe('getSystemStats()', () => {
  test('returns object with all expected top-level keys', () => {
    const stats = getSystemStats();
    expect(stats).toHaveProperty('hostname');
    expect(stats).toHaveProperty('uptime');
    expect(stats).toHaveProperty('cpu');
    expect(stats).toHaveProperty('memory');
    expect(stats).toHaveProperty('disk');
    expect(stats).toHaveProperty('os');
  });
});

describe('formatUptime()', () => {
  test('formats days and hours', () => {
    expect(formatUptime(14 * 86400 + 3 * 3600)).toBe('14 days, 3 hours');
  });

  test('formats 1 day singular', () => {
    expect(formatUptime(86400 + 3600)).toBe('1 day, 1 hour');
  });

  test('formats hours only (no days)', () => {
    expect(formatUptime(5 * 3600)).toBe('5 hours');
  });

  test('formats minutes when less than an hour', () => {
    expect(formatUptime(30 * 60)).toBe('30 minutes');
  });

  test('returns "just started" for very small uptime', () => {
    expect(formatUptime(0)).toBe('just started');
  });
});
