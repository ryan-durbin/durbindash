'use strict';

/**
 * US-001: API round-trip test for URL icon field
 * Verifies that the shortcuts API correctly stores and returns
 * a URL string in the icon field.
 */

const request = require('supertest');
const fs = require('fs');
const path = require('path');

const TEMP_FILE = '/tmp/test-shortcuts-icon.json';

// Set env var before requiring app
process.env.SHORTCUTS_PATH = TEMP_FILE;

const app = require('../server');

beforeAll(() => {
  // Initialize temp file with empty array
  fs.writeFileSync(TEMP_FILE, JSON.stringify([]), 'utf8');
});

afterAll(() => {
  // Clean up temp file
  if (fs.existsSync(TEMP_FILE)) {
    fs.unlinkSync(TEMP_FILE);
  }
});

describe('Shortcuts API — URL icon field', () => {
  let createdId;

  test('POST /api/shortcuts with URL icon returns 201 with icon preserved', async () => {
    const res = await request(app)
      .post('/api/shortcuts')
      .send({
        name: 'Example',
        url: 'https://example.com',
        icon: 'https://example.com/icon.png',
      })
      .expect(201);

    expect(res.body.icon).toBe('https://example.com/icon.png');
    expect(res.body.name).toBe('Example');
    expect(res.body.id).toBeDefined();
    createdId = res.body.id;
  });

  test('GET /api/shortcuts returns shortcut with URL icon preserved', async () => {
    const res = await request(app)
      .get('/api/shortcuts')
      .expect(200);

    const found = res.body.find((s) => s.id === createdId);
    expect(found).toBeDefined();
    expect(found.icon).toBe('https://example.com/icon.png');
  });

  test('PUT /api/shortcuts/:id with URL icon returns 200 with updated icon', async () => {
    const res = await request(app)
      .put(`/api/shortcuts/${createdId}`)
      .send({ icon: 'https://example.com/updated-icon.png' })
      .expect(200);

    expect(res.body.icon).toBe('https://example.com/updated-icon.png');
  });

  test('GET /api/shortcuts after PUT reflects updated URL icon', async () => {
    const res = await request(app)
      .get('/api/shortcuts')
      .expect(200);

    const found = res.body.find((s) => s.id === createdId);
    expect(found).toBeDefined();
    expect(found.icon).toBe('https://example.com/updated-icon.png');
  });
});
