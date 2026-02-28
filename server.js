'use strict';

const express = require('express');
const path = require('path');
const { router: openclawRouter } = require('./server/openclaw');

const app = express();
const PORT = process.env.PORT || 7748;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'durbindash' });
});

app.use(openclawRouter);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log('DurbinDash running on http://localhost:' + PORT);
  });
}

module.exports = app;
