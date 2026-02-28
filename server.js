const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 7748;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'durbindash' });
});

app.listen(PORT, () => {
  console.log(`DurbinDash running on http://localhost:${PORT}`);
});

module.exports = app;
