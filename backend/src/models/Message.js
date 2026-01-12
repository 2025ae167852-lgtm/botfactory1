const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  botId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bot' },
  userId: String, // External user ID from platform
  platform: String,
  direction: { type: String, enum: ['incoming', 'outgoing'] },
  content: {
    type: { type: String, enum: ['text', 'image', 'button', 'quick_reply'] },
    text: String,
    mediaUrl: String,
    buttons: [{
      text: String,
      payload: String
    }]
  },
  timestamp: { type: Date, default: Date.now },
  sessionId: String
});

module.exports = mongoose.model('Message', messageSchema);
