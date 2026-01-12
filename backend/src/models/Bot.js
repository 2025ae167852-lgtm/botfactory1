const mongoose = require('mongoose');

const botSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  platform: {
    type: String,
    enum: ['whatsapp', 'telegram', 'messenger', 'web', 'multi'],
    required: true
  },
  flow: { type: mongoose.Schema.Types.Mixed, required: true }, // JSON flow data
  settings: {
    welcomeMessage: String,
    fallbackMessage: String,
    workingHours: {
      enabled: Boolean,
      start: String,
      end: String,
      timezone: String
    },
    humanTakeover: Boolean
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  stats: {
    totalMessages: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

module.exports = mongoose.model('Bot', botSchema);
