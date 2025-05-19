import { io } from 'socket.io-client';

class SocketClient {
  constructor() {
    if (SocketClient.instance) {
      return SocketClient.instance;
    }

    this.socket = null;
    SocketClient.instance = this;
  }

  async connect(username) {
    if (!this.socket) {
      try {
        console.log('Attempting to connect to socket server...');
        // Create socket connection
        const socketUrl = process.env.NODE_ENV === 'production' 
          ? window.location.origin
          : 'http://localhost:3000';

        console.log('Connecting to socket URL:', socketUrl);

        this.socket = io(socketUrl, {
          path: '/api/socketio',
          addTrailingSlash: false,
          transports: ['polling', 'websocket'],
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: Infinity,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          timeout: 20000,
          withCredentials: true,
          forceNew: true,
          upgrade: true,
          rememberUpgrade: true,
          rejectUnauthorized: false
        });

        // Set up event handlers
        this.socket.on('connect', () => {
          console.log('Socket connected successfully, socket.id:', this.socket.id);
          console.log('Transport:', this.socket.io.engine.transport.name);
          console.log('Joining as:', username);
          if (username) {
            this.socket.emit('join', username);
          }
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          console.log('Current transport:', this.socket.io.engine.transport.name);
          
          if (this.socket.io.engine.transport.name === 'websocket') {
            console.log('Switching to polling transport...');
            this.socket.io.opts.transports = ['polling'];
            this.socket.connect();
          }
        });

        this.socket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          console.log('Last transport:', this.socket.io.engine.transport.name);
          
          if (reason === 'io server disconnect') {
            console.log('Attempting to reconnect...');
            this.socket.connect();
          }
        });

        // Wait for connection
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Connection timeout - server not responding'));
          }, 10000);

          this.socket.once('connect', () => {
            clearTimeout(timeout);
            resolve();
          });

          this.socket.once('connect_error', (error) => {
            clearTimeout(timeout);
            reject(error);
          });
        });

        return this.socket;
      } catch (err) {
        console.error('Failed to initialize socket:', err);
        this.socket = null;
        throw err;
      }
    }

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketClient = new SocketClient(); 