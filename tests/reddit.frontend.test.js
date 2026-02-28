/** @jest-environment jsdom */
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { renderPosts, formatScore } = require('../public/js/reddit.js');

test('formatScore formats with commas and triangle', () => {
  assert.equal(formatScore(1234), '[▲ 1,234]');
  assert.equal(formatScore(0), '[▲ 0]');
});

test('renderPosts uses [ r/SUBREDDIT ] section header', () => {
  const html = renderPosts('artificial', []);
  assert.match(html, /\[ r\/artificial \]/);
});

test('renderPosts includes post title as anchor with post.url', () => {
  const posts = [{
    title: 'Cool AI Post',
    url: 'https://example.com/post',
    score: 500,
    num_comments: 42,
    permalink: '/r/artificial/comments/abc/cool_ai_post/'
  }];
  const html = renderPosts('artificial', posts);
  assert.match(html, /<a href="https:\/\/example\.com\/post"[^>]*>Cool AI Post<\/a>/);
});

test('renderPosts shows score with toLocaleString in brackets', () => {
  const posts = [{
    title: 'Test',
    url: 'https://example.com',
    score: 1500,
    num_comments: 10,
    permalink: '/r/test/comments/xyz/'
  }];
  const html = renderPosts('test', posts);
  assert.match(html, /\[▲ 1,500\]/);
});

test('renderPosts shows comment count', () => {
  const posts = [{
    title: 'Test',
    url: 'https://example.com',
    score: 100,
    num_comments: 77,
    permalink: '/r/test/comments/xyz/'
  }];
  const html = renderPosts('test', posts);
  assert.match(html, /77 comments/);
});

test('renderPosts permalink links to https://reddit.com + permalink', () => {
  const posts = [{
    title: 'Test',
    url: 'https://example.com',
    score: 100,
    num_comments: 5,
    permalink: '/r/test/comments/abc/test/'
  }];
  const html = renderPosts('test', posts);
  assert.match(html, /href="https:\/\/reddit\.com\/r\/test\/comments\/abc\/test\/"/);
});
