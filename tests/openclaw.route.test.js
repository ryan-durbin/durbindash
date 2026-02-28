'use strict';

const request = require('supertest');

// Mock the openclaw module before requiring the app
jest.mock('../server/openclaw', () => {
  const express = require('express');
  const router = express.Router();
  router.get('/', (req, res) => {
    res.json([
      { tag_name: 'v1.0.0', name: 'Release 1.0.0', published_at: '2026-01-01T00:00:00Z', body: 'Test' }
    ]);
  });
  return { router };
});

const app = require('../server');

test('GET /api/openclaw returns 200 with JSON array', async () => {
  const res = await request(app).get('/api/openclaw');
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBeGreaterThan(0);
  expect(res.body[0]).toHaveProperty('tag_name');
});

test('GET /health still returns { status: ok }', async () => {
  const res = await request(app).get('/health');
  expect(res.status).toBe(200);
  expect(res.body.status).toBe('ok');
});
