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
        // Always use localhost:3001 for now since we're testing locally
        const socketUrl = 'http://localhost:3001';
        console.log('Connecting to socket URL:', socketUrl);

        // First, try to check if the server is accessible
        try {
          console.log('Testing server accessibility...');
          const response = await fetch(`${socketUrl}/test`);
          const data = await response.json();
          console.log('Server test response:', data);
        } catch (error) {
          console.error('Server test failed:', error);
          throw new Error('Server is not accessible. Make sure the backend server is running on port 3001');
        }

        this.socket = io(socketUrl, {
          transports: ['polling'],
          path: '/socket.io/',
          reconnection: true,
          reconnectionAttempts: 5,
          timeout: 10000,
          forceNew: true
        });

        // Set up event handlers
        this.socket.on('connect', () => {
          console.log('Socket connected successfully, socket.id:', this.socket.id);
          console.log('Transport:', this.socket.io.engine.transport.name);
          if (username) {
            console.log('Emitting join event for username:', username);
            this.socket.emit('join', username);
          }
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          console.log('Current transport:', this.socket.io.engine.transport.name);
          console.log('Error details:', {
            message: error.message,
            description: error.description,
            type: error.type,
            context: error
          });
        });

        this.socket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          console.log('Disconnect details:', {
            reason,
            wasConnected: this.socket.connected,
            transport: this.socket.io.engine.transport.name
          });
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