const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 7748;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('<h1>DurbinDash</h1><p>Welcome to your personal dashboard!</p>');
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'durbindash' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`DurbinDash running on http://localhost:${PORT}`);
  });
}

module.exports = app;
