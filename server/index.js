const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Simple in-memory store for channels and messages (MVP)
const channels = [{ id: 'general', name: 'general' }];
const messages = { general: [] };

app.get('/channels', (req, res) => {
  res.json(channels);
});

app.post('/channels', (req, res) => {
  const { id, name } = req.body;
  if (!id || !name) return res.status(400).json({ error: 'id and name required' });
  channels.push({ id, name });
  messages[id] = [];
  res.status(201).json({ id, name });
});

io.on('connection', (socket) => {
  console.log('socket connected:', socket.id);

  socket.on('join', (channelId) => {
    socket.join(channelId);
    socket.emit('history', messages[channelId] || []);
  });

  socket.on('message', ({ channelId, user, text }) => {
    const msg = { id: Date.now().toString(), user, text, ts: new Date().toISOString() };
    messages[channelId] = messages[channelId] || [];
    messages[channelId].push(msg);
    io.to(channelId).emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('socket disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));