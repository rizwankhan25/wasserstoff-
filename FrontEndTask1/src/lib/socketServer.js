import { Server } from 'socket.io';

class SocketIOServer {
  constructor() {
    if (SocketIOServer.instance) {
      return SocketIOServer.instance;
    }

    this.io = null;
    this.users = new Set();
    this.currentContent = '';

    SocketIOServer.instance = this;
  }

  getIO() {
    return this.io;
  }

  initialize(res) {
    if (!this.io) {
      console.log('Initializing Socket.IO server...');

      if (!res?.socket?.server?.io) {
        this.io = new Server(res.socket.server, {
          path: '/api/socketio',
          addTrailingSlash: false,
          transports: ['websocket'],
          cors: {
            origin: "*",
            methods: ["GET", "POST"]
          },
          pingTimeout: 60000,
          pingInterval: 25000,
          upgradeTimeout: 10000,
          allowUpgrades: true,
          cookie: false
        });                                     
        
        res.socket.server.io = this.io;

        this.io.on('connection', this.handleConnection.bind(this));
        console.log('Socket.IO server initialized successfully');
      } else {
        this.io = res.socket.server.io;
      }
    }
    return this.io;
  }

  handleConnection(socket) {
    console.log('Client connected:', socket.id);

    socket.on('join', (username) => {
      socket.username = username;
      this.users.add(username);
      socket.broadcast.emit('user-joined', username);
      
      socket.emit('initialize', {
        users: Array.from(this.users),
        content: this.currentContent
      });
      
      console.log(`${username} joined. Active users:`, Array.from(this.users));
    });

    socket.on('content-change', (data) => {
      this.currentContent = data;
      socket.broadcast.emit('content-update', {
        content: data,
        username: socket.username
      });
    });

    socket.on('disconnect', () => {
      if (socket.username) {
        this.users.delete(socket.username);
        this.io.emit('user-left', socket.username);
        console.log(`${socket.username} left. Active users:`, Array.from(this.users));
      }
    });
  }
}

export const socketIOServer = new SocketIOServer(); 