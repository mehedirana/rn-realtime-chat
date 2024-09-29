const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: '*', // Allow all origins
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }
});


app.use(cors());

app.get('/', (req, res) => {
    res.send('Server is working');
});

// When a user connects
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id); // Log when a new user connects

    socket.on('chat message', (message) => {
        console.log('Received message from client:', message); // Log received messages
        // io.emit('chat message', message); // Broadcast message to all clients
          io.emit('chat message', { message, userId: socket.id })
    });

    socket.on('disconnect', (reason) => {
        console.log(`User ${socket.id} disconnected. Reason:`, reason); // Log disconnection
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT,'10.50.20.56', () => {
    console.log(`Server is running on port ${PORT}`);
});


