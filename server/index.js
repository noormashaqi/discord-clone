const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');
const cors    = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const db             = require('./db');
const authRoutes     = require('./routes/auth');
const channelRoutes  = require('./routes/channels');
const messageRoutes  = require('./routes/messages');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
});

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/auth',     authRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/messages', messageRoutes);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_channel', (channelId) => {
    socket.join(channelId);
  });

  socket.on('send_message', (data) => {
    const { channelId, content, username, userId } = data;
    const message = {
      _id:        uuidv4(),
      channel:    channelId,
      content,
      senderName: username,
      sender:     userId,
      createdAt:  new Date().toISOString()
    };
    db.insertOne('messages', message);
    io.to(channelId).emit('receive_message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`✅ Server running on port ${process.env.PORT}`);
});