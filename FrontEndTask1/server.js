const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const users = new Set();
let currentContent = '';

app.prepare().then(() => {
  const server = createServer((req, res) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      res.end();
      return;
    }

    try {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Server error:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  const io = new Server(server, {
    path: '/api/socketio',
    addTrailingSlash: false,
    transports: ['websocket', 'polling'],
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type'],
      credentials: false
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    connectTimeout: 45000
  });

  // Log all socket.io errors
  io.engine.on('connection_error', (err) => {
    console.error('Socket.io connection error:', {
      code: err.code,
      message: err.message,
      context: err.context
    });
  });

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
        // Emit to all clients including sender
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

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    console.error('Server error:', err);
  });
}); 