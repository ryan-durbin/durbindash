'use strict';

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 7748;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Admin redirect
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

// API routes
const shortcutsRouter = require('./src/routes/shortcuts');
app.use('/api/shortcuts', shortcutsRouter);

const systemRouter = require('./server/system');
app.use('/api/system', systemRouter);

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Start server only when run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`DurbinDash running on http://localhost:${PORT}`);
  });
}

module.exports = app;
