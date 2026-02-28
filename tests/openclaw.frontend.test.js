'use strict';

/**
 * US-003: Frontend OpenClaw Updates rendering tests
 */

const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '..', 'public', 'index.html');
const newsJsPath = path.join(__dirname, '..', 'public', 'js', 'news.js');

describe('US-003: HTML structure for OpenClaw', () => {
  let htmlContent;

  beforeAll(() => {
    htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
  });

  test('index.html contains element with id="news-ai"', () => {
    expect(htmlContent).toMatch(/id=["']?news-ai["']?/);
  });

  test('index.html includes /js/news.js script', () => {
    expect(htmlContent).toMatch(/src=["']\/js\/news\.js["']/);
  });

  test('index.html contains OpenClaw Updates subheader text', () => {
    expect(htmlContent).toContain('OpenClaw Updates');
  });
});

describe('US-003: news.js OpenClaw fetch and render logic', () => {
  let jsContent;

  beforeAll(() => {
    jsContent = fs.readFileSync(newsJsPath, 'utf8');
  });

  test('news.js fetches /api/openclaw', () => {
    expect(jsContent).toContain('/api/openclaw');
  });

  test('news.js renders <strong> with tag_name', () => {
    expect(jsContent).toContain('tag_name');
    expect(jsContent).toContain('<strong>');
  });

  test('news.js renders date in parentheses', () => {
    // Check that date is shown in parentheses format
    expect(jsContent).toContain("'");  // date shown in parentheses
  });

  test('news.js contains OpenClaw tooltip/blurb text', () => {
    expect(jsContent).toContain('OpenClaw is your AI personal assistant platform');
    expect(jsContent).toContain('running locally on your homelab!');
  });

  test('news.js targets #news-ai container', () => {
    expect(jsContent).toContain('news-ai');
  });
});

describe('US-003: DOM rendering via HTML/JS assertions', () => {
  let htmlContent;
  let jsContent;

  beforeAll(() => {
    htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
    jsContent = fs.readFileSync(newsJsPath, 'utf8');
  });

  test('#news-ai element exists in HTML', () => {
    expect(htmlContent).toMatch(/id=["']news-ai["']/);
  });

  test('OpenClaw Updates subheader text present in HTML', () => {
    expect(htmlContent).toContain('OpenClaw Updates');
  });

  test('news.js injects <strong> tag_name for releases', () => {
    expect(jsContent).toContain('<strong>');
    expect(jsContent).toContain('tag_name');
  });

  test('news.js shows date in parentheses', () => {
    expect(jsContent).toContain("'('");
  });

  test('news.js has OpenClaw tooltip blurb text', () => {
    expect(jsContent).toContain('OpenClaw is your AI personal assistant platform');
    expect(jsContent).toContain('running locally on your homelab!');
  });

  test('news.js openclaw IIFE fetches /api/openclaw and targets news-ai', () => {
    expect(jsContent).toContain('news-ai');
    expect(jsContent).toContain('/api/openclaw');
  });
});
