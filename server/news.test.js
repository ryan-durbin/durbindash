'use strict';

const assert = require('assert');

// Inline mock for rss-parser
const mockItems = {
  'https://techcrunch.com/category/artificial-intelligence/feed/': {
    items: [
      { title: 'TC Article 1', link: 'https://tc.com/1', isoDate: '2024-02-10T10:00:00Z' },
      { title: 'TC Article 2', link: 'https://tc.com/2', isoDate: '2024-02-08T10:00:00Z' },
      { title: 'TC Duplicate', link: 'https://mit.com/dup', isoDate: '2024-02-07T10:00:00Z' },
    ]
  },
  'https://www.technologyreview.com/topic/artificial-intelligence/feed': {
    items: [
      { title: 'MIT Article 1', link: 'https://mit.com/1', isoDate: '2024-02-09T10:00:00Z' },
      { title: 'MIT Dup', link: 'https://mit.com/dup', isoDate: '2024-02-07T10:00:00Z' }, // duplicate URL
    ]
  },
  'https://venturebeat.com/category/ai/feed/': {
    items: [
      { title: 'VB Article 1', link: 'https://vb.com/1', isoDate: '2024-02-11T10:00:00Z' },
      { title: 'VB Article 2', link: 'https://vb.com/2', isoDate: '2024-02-06T10:00:00Z' },
      { title: 'VB Article 3', link: 'https://vb.com/3', isoDate: '2024-02-05T10:00:00Z' },
      { title: 'VB Article 4', link: 'https://vb.com/4', isoDate: '2024-02-04T10:00:00Z' },
      { title: 'VB Article 5', link: 'https://vb.com/5', isoDate: '2024-02-03T10:00:00Z' },
    ]
  }
};

class MockParser {
  async parseURL(url) {
    const data = mockItems[url];
    if (!data) throw new Error(`No mock data for ${url}`);
    return data;
  }
}

class FailingParser {
  async parseURL(url) {
    if (url.includes('technologyreview')) throw new Error('Feed unavailable');
    return mockItems[url] || { items: [] };
  }
}

const { getAINews } = require('./news');

async function runTests() {
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✓ ${name}`);
      passed++;
    } catch (err) {
      console.error(`✗ ${name}: ${err.message}`);
      failed++;
    }
  }

  await test('returns at most 8 items', async () => {
    const items = await getAINews(new MockParser());
    assert.ok(items.length <= 8, `Expected <= 8 items, got ${items.length}`);
  });

  await test('deduplicates by URL', async () => {
    const items = await getAINews(new MockParser());
    const urls = items.map(i => i.url);
    const unique = new Set(urls);
    assert.strictEqual(urls.length, unique.size, 'Duplicate URLs found');
  });

  await test('sorts by date descending', async () => {
    const items = await getAINews(new MockParser());
    for (let i = 1; i < items.length; i++) {
      const prev = new Date(items[i-1].date).getTime();
      const curr = new Date(items[i].date).getTime();
      assert.ok(prev >= curr, `Item ${i-1} date should be >= item ${i} date`);
    }
  });

  await test('each item has required fields', async () => {
    const items = await getAINews(new MockParser());
    for (const item of items) {
      assert.strictEqual(typeof item.title, 'string', 'title should be string');
      assert.strictEqual(typeof item.url, 'string', 'url should be string');
      assert.strictEqual(typeof item.date, 'string', 'date should be string');
      assert.strictEqual(typeof item.source, 'string', 'source should be string');
    }
  });

  await test('graceful failure of one feed still returns results', async () => {
    const items = await getAINews(new FailingParser());
    assert.ok(items.length > 0, 'Should return items even when one feed fails');
    const sources = new Set(items.map(i => i.source));
    assert.ok(!sources.has('MIT Technology Review'), 'Failed feed should not appear');
    assert.ok(sources.has('TechCrunch AI') || sources.has('VentureBeat AI'), 'Working feeds should appear');
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
