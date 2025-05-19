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
        const socketUrl = window.location.origin;
        console.log('Connecting to socket URL:', socketUrl);

        // First, try to check if the server is accessible
        try {
          console.log('Testing server accessibility...');
          
          // Test the general server endpoint
          const serverResponse = await fetch(`${socketUrl}/api/test`);
          if (!serverResponse.ok) {
            throw new Error('Server test failed');
          }
          const serverData = await serverResponse.json();
          console.log('Server test response:', serverData);

          // Test the Socket.IO endpoint
          const socketResponse = await fetch(`${socketUrl}/api/socketio`);
          if (!socketResponse.ok) {
            throw new Error('Socket.IO endpoint test failed');
          }
          const socketData = await socketResponse.json();
          console.log('Socket.IO test response:', socketData);
        } catch (error) {
          console.error('Server test failed:', error);
          throw new Error('Server is not accessible. Make sure the backend server is running');
        }

        // Create socket with minimal configuration
        this.socket = io(socketUrl, {
          path: '/api/socketio',
          transports: ['polling'],
          reconnection: true,
          reconnectionAttempts: 5,
          timeout: 10000
        });

        // Set up event handlers
        this.socket.on('connect', () => {
          console.log('Socket connected successfully, socket.id:', this.socket.id);
          if (username) {
            console.log('Emitting join event for username:', username);
            this.socket.emit('join', username);
          }
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          console.log('Error details:', {
            message: error.message,
            description: error.description,
            type: error.type
          });
        });

        this.socket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
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