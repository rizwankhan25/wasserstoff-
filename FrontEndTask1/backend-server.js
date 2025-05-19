const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const httpServer = createServer(app);

// Enable CORS for all routes
app.use(cors({
  origin: '*', // Allow all origins in development
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Add a basic route for health check
app.get('/', (req, res) => {
  res.send('Server is running');
});

const io = new Server(httpServer, {
  cors: {
    origin: '*', // Allow all origins in development
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  },
  transports: ['polling', 'websocket'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 45000,
  allowUpgrades: true,
  cookie: false
});

const users = new Set();
let currentContent = '';

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join', (username) => {
    if (!username || typeof username !== 'string') {
      socket.emit('error', 'Invalid username');
      return;
    }

    socket.username = username;
    users.add(username);
    socket.broadcast.emit('user-joined', username);
    
    socket.emit('initialize', {
      users: Array.from(users),
      content: currentContent
    });
    
    console.log(`${username} joined. Active users:`, Array.from(users));
  });

  socket.on('content-change', (data) => {
    if (typeof data !== 'string') {
      socket.emit('error', 'Invalid content format');
      return;
    }

    try {
      currentContent = data;
      io.emit('content-update', {
        content: data,
        username: socket.username
      });
    } catch (err) {
      console.error('Error handling content change:', err);
      socket.emit('error', 'Failed to update content');
    }
  });

  socket.on('disconnect', (reason) => {
    console.log(`Client ${socket.id} disconnected. Reason:`, reason);
    if (socket.username) {
      users.delete(socket.username);
      io.emit('user-left', socket.username);
      console.log(`${socket.username} left. Active users:`, Array.from(users));
    }
  });

  socket.on('error', (error) => {
    console.error('Socket error for client', socket.id, ':', error);
  });
});

// Error handling for the HTTP server
httpServer.on('error', (error) => {
  console.error('Server error:', error);
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
}); 