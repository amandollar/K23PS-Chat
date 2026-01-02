require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Socket.io Logic
let activeUsers = 0;

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    activeUsers++;
    io.emit('activeUsers', activeUsers);

    socket.on('join', (username) => {
        socket.username = username;
        socket.broadcast.emit('message', {
            user: 'System',
            text: `${username} has joined the chat`,
        });
        socket.emit('message', {
            user: 'System',
            text: `Welcome ${username}!`,
        });
    });

    socket.on('sendMessage', async (message, callback) => {
        const user = socket.username; // Get username from socket session
        
        try {
            const newMessage = new Message({ user, text: message });
            await newMessage.save();
        } catch (err) {
            console.error('Error saving message:', err);
        }

        io.emit('message', { user, text: message });
        callback();
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        activeUsers--;
        io.emit('activeUsers', activeUsers);
        if (socket.username) {
             socket.broadcast.emit('message', {
                user: 'System',
                text: `${socket.username} has left the chat`,
            });
        }
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
