const express = require('express');
const router = express.Router();
const Bot = require('../models/Bot');

// Create a new bot
router.post('/create', async (req, res) => {
  try {
    const { name, platform } = req.body;
    if (!name || !platform) {
      return res.status(400).json({ error: 'Name and platform are required' });
    }
    const bot = new Bot({
      name,
      platform,
      flow: {},
      settings: {},
      isActive: true
    });
    await bot.save();
    res.status(201).json({ bot });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create bot' });
  }
});

// List all bots
router.get('/', async (req, res) => {
  try {
    const bots = await Bot.find();
    res.json({ bots });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bots' });
  }
});

module.exports = router;
