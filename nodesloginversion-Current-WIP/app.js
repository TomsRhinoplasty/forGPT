require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

// Middleware setup
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB."))
  .catch(err => console.error("Error connecting to MongoDB:", err));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const mapRoutes = require('./routes/maps');
app.use('/api/maps', mapRoutes);

const llmRoutes = require('./routes/llm');
app.use('/api/llm', llmRoutes);

// Serve static files from the public folder.
app.use(express.static('public'));

// Create an HTTP server and attach Socket.IO
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server);

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Listen for map update events from clients
  socket.on('mapUpdate', (data) => {
    console.log("Received map update:", data);
    // Broadcast the updated map data to all connected clients
    io.emit('mapUpdated', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// in app.js, before server.listen()
const path = require('path');
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
