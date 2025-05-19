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
        this.socket = io('http://localhost:3000', {
          path: '/api/socketio',
          addTrailingSlash: false,
          transports: ['websocket', 'polling'],
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          timeout: 20000,
          withCredentials: false
        });

        // Set up event handlers
        this.socket.on('connect', () => {
          console.log('Socket connected successfully, socket.id:', this.socket.id);
          console.log('Joining as:', username);
          if (username) {
            this.socket.emit('join', username);
          }
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
        });

        this.socket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          if (reason === 'io server disconnect') {
            // the disconnection was initiated by the server, you need to reconnect manually
            this.socket.connect();
          }
        });

        // Wait for connection
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Connection timeout - server not responding'));
          }, 5000);

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