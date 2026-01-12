const express = require('express');
const router = express.Router();

// In-memory store for demo; replace with DB in production
let platforms = [
  // Example: { type: 'whatsapp', token: '...', status: 'connected' }
];

router.get('/', (req, res) => {
  res.json({ platforms });
});

router.post('/add', (req, res) => {
  const { type, token } = req.body;
  if (!type || !token) {
    return res.status(400).json({ error: 'Platform type and token required' });
  }
  // Simulate connection check
  const status = token ? 'connected' : 'not_connected';
  // Replace if already exists
  platforms = platforms.filter(p => p.type !== type);
  platforms.push({ type, token, status });
  res.json({ success: true });
});

module.exports = router;
