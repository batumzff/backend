const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');

// Load env vars
dotenv.config();

// Route files
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Create Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Init Socket.io
const io = socketio(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('join', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });
  
  socket.on('leave', (room) => {
    socket.leave(room);
    console.log(`Socket ${socket.id} left room: ${room}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Add socket to app for controllers to use
app.set('io', io);

module.exports = { app, server };