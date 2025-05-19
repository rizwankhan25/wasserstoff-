'use client';
import { useEffect, useState, useRef } from 'react';
import { socketClient } from '@/lib/socketClient';
import { Modal, Button, Form, Badge, ListGroup, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function EditorPage() {
  const [content, setContent] = useState('');
  const [username, setUsername] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [activeUsers, setActiveUsers] = useState([]);
  const [lastEditedBy, setLastEditedBy] = useState('');
  const [error, setError] = useState('');
  const editorRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const isTyping = useRef(false);

  useEffect(() => {
    let mounted = true;

    const initializeSocket = async () => {
      if (!showModal && username) {
        try {
          console.log('Initializing socket connection...');
          const socket = await socketClient.connect(username);
          
          if (!socket || !mounted) return;

          socket.on('connect', () => {
            if (mounted) {
              console.log('Connected to server with socket ID:', socket.id);
              setIsConnected(true);
              setError('');
            }
          });

          socket.on('connect_error', (error) => {
            if (mounted) {
              console.error('Connection error:', error);
              setError(`Failed to connect to server: ${error.message}`);
              setIsConnected(false);
            }
          });

          // Check immediate connection state
          if (socket.connected) {
            console.log('Socket is already connected');
            setIsConnected(true);
            setError('');
          }

          socket.on('initialize', (data) => {
            if (!mounted) return;
            console.log('Received initial data:', data);
            setContent(data.content);
            setActiveUsers(data.users);
          });

          socket.on('content-update', (data) => {
            if (!mounted) return;
            console.log('Received update from:', data.username);
            // Only update content if we're not currently typing
            if (!isTyping.current || data.username !== username) {
              setContent(data.content);
              setLastEditedBy(data.username);
            }
          });

          socket.on('user-joined', (username) => {
            if (!mounted) return;
            console.log('User joined:', username);
            setActiveUsers((prev) => {
              if (!prev.includes(username)) {
                return [...prev, username];
              }
              return prev;
            });
          });

          socket.on('user-left', (username) => {
            if (!mounted) return;
            console.log('User left:', username);
            setActiveUsers((prev) => prev.filter(user => user !== username));
          });

          socket.on('disconnect', () => {
            if (!mounted) return;
            console.log('Disconnected from server');
            setIsConnected(false);
            setError('Connection lost. Trying to reconnect...');
          });
        } catch (err) {
          console.error('Socket initialization error:', err);
          if (mounted) {
            setError(`Failed to initialize connection: ${err.message}`);
            setIsConnected(false);
          }
        }
      }
    };

    initializeSocket();

    return () => {
      mounted = false;
      socketClient.disconnect();
    };
  }, [showModal, username]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    isTyping.current = true;
    setContent(newContent);
    
    const socket = socketClient.getSocket();
    if (socket && isConnected) {
      socket.emit('content-change', newContent);
      // Reset typing flag after a short delay
      setTimeout(() => {
        isTyping.current = false;
      }, 500);
    }
  };

  const handleSubmitUsername = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setShowModal(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column p-4" style={{ backgroundColor: '#f8f9fa' }}>
      <Modal show={showModal} onHide={() => {}} backdrop="static">
        <Modal.Header>
          <Modal.Title>Enter Your Username</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitUsername}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Join Editor
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {!showModal && (
        <>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          
          <div className="row mb-3">
            <div className="col-md-8">
              <h4>Collaborative Editor</h4>
              {lastEditedBy && (
                <small className="text-muted">
                  Last edited by: <Badge bg="info">{lastEditedBy}</Badge>
                </small>
              )}
            </div>
            <div className="col-md-4 text-end">
              <Badge bg="success" className="me-2">
                {username} (You)
              </Badge>
              <Badge bg={isConnected ? "primary" : "danger"}>
                {isConnected ? `${activeUsers.length} online` : 'Disconnected'}
              </Badge>
            </div>
          </div>

          <div className="row flex-grow-1">
            <div className="col-md-9 h-100">
              <textarea
                ref={editorRef}
                className="form-control h-100 p-3"
                style={{ 
                  fontSize: '16px',
                  resize: 'none',
                  backgroundColor: '#ffffff',
                  border: '1px solid #dee2e6',
                  borderRadius: '0.375rem'
                }}
                value={content}
                onChange={handleContentChange}
                placeholder="Start typing here..."
                disabled={!isConnected}
              />
            </div>
            <div className="col-md-3 h-100">
              <div className="bg-white p-3 rounded shadow-sm">
                <h5 className="mb-3">Active Users</h5>
                <ListGroup>
                  {activeUsers.map((user, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                      {user}
                      {user === username && (
                        <Badge bg="success" pill>You</Badge>
                      )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}