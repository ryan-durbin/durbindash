'use strict';

const os = require('os');
const { execSync } = require('child_process');
const express = require('express');

/**
 * Format uptime seconds into human-readable string
 * e.g. "14 days, 3 hours" or "2 hours, 30 minutes"
 */
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  if (parts.length === 0 && minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  if (parts.length === 0) parts.push('just started');

  return parts.join(', ');
}

/**
 * Parse df -k output for / mount and return GB values
 */
function getDiskStats() {
  try {
    const output = execSync('df -k /').toString();
    const lines = output.trim().split('\n');
    // Header: Filesystem  1K-blocks  Used  Available  Use%  Mounted
    const cols = lines[1].trim().split(/\s+/);
    const totalKb = parseInt(cols[1], 10);
    const usedKb = parseInt(cols[2], 10);
    const freeKb = parseInt(cols[3], 10);
    const toGB = (kb) => Math.round((kb / 1024 / 1024) * 100) / 100;
    return { total: toGB(totalKb), used: toGB(usedKb), free: toGB(freeKb) };
  } catch (err) {
    return { total: 0, used: 0, free: 0 };
  }
}

/**
 * Collect all system stats and return as a plain object
 */
function getSystemStats() {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const toGB = (bytes) => Math.round((bytes / 1024 / 1024 / 1024) * 100) / 100;

  return {
    hostname: os.hostname(),
    uptime: formatUptime(os.uptime()),
    cpu: {
      model: cpus[0] ? cpus[0].model : 'Unknown',
      cores: cpus.length,
      loadavg: os.loadavg(),
    },
    memory: {
      total: toGB(totalMem),
      used: toGB(totalMem - freeMem),
      free: toGB(freeMem),
    },
    disk: getDiskStats(),
    os: {
      platform: os.platform(),
      release: os.release(),
      arch: os.arch(),
    },
  };
}

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const stats = getSystemStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve system stats' });
  }
});

module.exports = router;
module.exports.getSystemStats = getSystemStats;
module.exports.formatUptime = formatUptime;
