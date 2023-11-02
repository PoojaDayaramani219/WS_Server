// Import modules needed
const express = require('express');
const WebSocket = require('ws');

// Create an Express app
const app = express();
app.use(express.json());

// Initialize WebSocket server
const ws = new WebSocket.Server({noServer: true});

// Handle WebSocket connections
ws.on('connection', (socket) => {
    console.log('WebSocket connection opened');
  
    // Broadcast messages to all connected clients
    socket.on('message', (message) => {
      console.log(`Received message from client: ${message}`);
      ws.clients.forEach((client) => {
        if (client !== socket && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });
  
    // Handle disconnections
    socket.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });
  
  // Create RESTful API endpoints
  app.post('/resources', (req, res) => {
    // Create a resource (e.g., save to a database)
    res.send('Resource created successfully');
  });
  
  app.get('/resources', (req, res) => {
    // Read resources (e.g., fetch from a database)
    res.send('List of resources');
  });
  
  app.delete('/resources/:id', (req, res) => {
    const rscId = req.params.id;
    // Delete resource with ID resourceId 
    res.send('Resource with ID ${rscId} deleted');
  });
  
  // Set up error handling
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
  
  // Set up server
  const server = app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
  
  // Upgrade HTTP server to support WebSocket
  server.on('upgrade', (request, socket, head) => {
    ws.handleUpgrade(request, socket, head, (socket) => {
      ws.emit('connection', socket, request);
    });
  });