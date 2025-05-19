# Real-Time Collaborative Text Editor

A modern, real-time collaborative text editor built with Next.js and Socket.IO. This application allows multiple users to edit text simultaneously, with changes reflected in real-time across all connected clients.

## Features

- 🔄 Real-time text synchronization
- 👥 Multiple user support
- 👤 User presence tracking
- 💻 Modern, responsive UI with Bootstrap
- 🔒 Secure WebSocket connections
- 🌐 Cross-browser compatibility
- 📱 Mobile-friendly design

## Tech Stack

- **Frontend Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: Bootstrap 5 & React Bootstrap
- **Real-time Communication**: Socket.IO
- **Deployment**: Netlify
- **Development**: Node.js

## Prerequisites

- Node.js 18 or higher
- npm (Node Package Manager)

## Getting Started

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd FrontEndTask1
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
FrontEndTask1/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── editor/         # Editor page component
│   │   ├── layout.js       # Root layout
│   │   └── page.js         # Home page
│   ├── lib/
│   │   ├── socketClient.js # Socket.IO client configuration
│   │   └── socketServer.js # Socket.IO server setup
│   └── styles/             # Global styles
├── public/                 # Static files
├── server.js              # Custom server implementation
├── next.config.mjs        # Next.js configuration
└── netlify.toml           # Netlify deployment configuration
```

## Development

The project uses a custom server implementation to handle WebSocket connections. The development server can be started with:

```bash
npm run dev
```

This will start the server on port 3000 with hot-reloading enabled.

## Building for Production

To build the project for production:

```bash
npm run build
```

## Deployment

This project is configured for deployment on Netlify. The deployment process is automated through the `netlify.toml` configuration file.

### Netlify Configuration

The project uses the following Netlify features:
- Next.js plugin for optimized deployment
- WebSocket support through custom redirects
- Server-side rendering support

### Environment Variables

No environment variables are required for basic functionality. The application automatically detects the environment and configures WebSocket connections accordingly.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- Next.js team for the amazing framework
- Socket.IO for real-time communication capabilities
- Bootstrap team for the UI components
