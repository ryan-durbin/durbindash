import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const deployPath = resolve(__dirname, '../deploy.sh');

test('deploy.sh exists', () => {
  assert.ok(existsSync(deployPath), 'deploy.sh should exist');
});

test('deploy.sh is executable', () => {
  const stat = statSync(deployPath);
  const execBit = stat.mode & 0o111;
  assert.ok(execBit, 'deploy.sh should have executable permission');
});

const content = readFileSync(deployPath, 'utf8');

test('deploy.sh contains set -e', () => {
  assert.ok(content.includes('set -e'), 'deploy.sh should contain set -e');
});

test('deploy.sh contains npm install', () => {
  assert.ok(content.includes('npm install'), 'deploy.sh should contain npm install');
});

test('deploy.sh contains cp durbindash.service /etc/systemd/system/', () => {
  assert.ok(
    content.includes('cp durbindash.service /etc/systemd/system/'),
    'deploy.sh should copy service file to systemd'
  );
});

test('deploy.sh contains systemctl daemon-reload', () => {
  assert.ok(
    content.includes('systemctl daemon-reload'),
    'deploy.sh should reload systemd daemon'
  );
});

test('deploy.sh contains systemctl enable durbindash', () => {
  assert.ok(
    content.includes('systemctl enable durbindash'),
    'deploy.sh should enable durbindash service'
  );
});

test('deploy.sh contains systemctl start durbindash', () => {
  assert.ok(
    content.includes('systemctl start durbindash'),
    'deploy.sh should start durbindash service'
  );
});

test('deploy.sh has bash shebang', () => {
  assert.ok(
    content.startsWith('#!/usr/bin/env bash') || content.startsWith('#!/bin/bash'),
    'deploy.sh should have bash shebang'
  );
});
