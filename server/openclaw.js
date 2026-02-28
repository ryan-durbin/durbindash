const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    app: 'OpenClaw',
    version: '1.0.0',
    updates: [
      { title: 'DurbinDash integration live', date: '2024-02-28' },
      { title: 'Weather widget added', date: '2024-02-27' },
      { title: 'Reddit feed wired up', date: '2024-02-26' }
    ],
    message: '🦅 OpenClaw is running'
  });
});

module.exports = router;
