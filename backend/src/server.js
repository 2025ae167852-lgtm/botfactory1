const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '../../.env') }); // Explicitly load .env from project root

const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json()); // Ensure this is before route usage

// MongoDB connection
if (!process.env.MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment variables. Check your .env file.');
  process.exit(1);
}
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const botsRouter = require('./routes/bots');
app.use('/api/bots', botsRouter);

const platformsRouter = require('./routes/platforms');
app.use('/api/platforms', platformsRouter);

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

// Socket.io for real-time
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
