import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  company: String,
  avatar: String,
  subscription: {
    plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
    expiresAt: Date,
    limits: {
      bots: { type: Number, default: 3 },
      messages: { type: Number, default: 1000 },
      platforms: { type: Number, default: 1 }
    }
  },
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date
});

export default mongoose.model('User', userSchema);
