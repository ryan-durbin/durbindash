'use strict';

const fs = require('fs');
const path = require('path');
const request = require('supertest');

// Mock rss-parser and node-fetch before requiring server
jest.mock('rss-parser', () => {
  return jest.fn().mockImplementation(() => ({
    parseURL: jest.fn().mockResolvedValue({ items: [] })
  }));
});

jest.mock('node-fetch', () => jest.fn().mockResolvedValue({
  ok: true,
  json: jest.fn().mockResolvedValue({ currently: {} })
}));

const app = require('../server');

const indexHtmlPath = path.join(__dirname, '..', 'public', 'index.html');
const newsCssPath = path.join(__dirname, '..', 'public', 'css', 'news.css');

describe('US-006: HTML structure tests', () => {
  let htmlContent;

  beforeAll(() => {
    htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
  });

  test('index.html contains element with id news-ai', () => {
    expect(htmlContent).toMatch(/id=["']?news-ai["']?/);
  });

  test('index.html contains element with id news-tech', () => {
    expect(htmlContent).toMatch(/id=["']?news-tech["']?/);
  });

  test('index.html contains element with id news-hn', () => {
    expect(htmlContent).toMatch(/id=["']?news-hn["']?/);
  });

  test('index.html includes <script> tag referencing /js/news.js', () => {
    expect(htmlContent).toMatch(/src=["']\/js\/news\.js["']/);
  });

  test('index.html includes <link> tag referencing /css/news.css', () => {
    expect(htmlContent).toMatch(/href=["']\/css\/news\.css["']/);
  });
});

describe('US-006: CSS definitions tests', () => {
  let cssContent;

  beforeAll(() => {
    cssContent = fs.readFileSync(newsCssPath, 'utf8');
  });

  test('news.css contains .badge-new rule', () => {
    expect(cssContent).toContain('.badge-new');
  });

  test('news.css contains animation: blink in .badge-new', () => {
    expect(cssContent).toMatch(/animation:\s*blink/);
  });

  test('news.css defines @keyframes blink', () => {
    expect(cssContent).toContain('@keyframes blink');
  });

  test('news.css @keyframes blink has 50% opacity: 0', () => {
    expect(cssContent).toMatch(/50%\s*\{[^}]*opacity:\s*0/);
  });
});

describe('US-006: Static file serving', () => {
  test('GET /css/news.css returns 200', async () => {
    const res = await request(app).get('/css/news.css');
    expect(res.status).toBe(200);
  });

  test('GET /css/news.css returns CSS content-type', async () => {
    const res = await request(app).get('/css/news.css');
    expect(res.headers['content-type']).toMatch(/text\/css/);
  });
});
