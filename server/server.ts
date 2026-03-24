import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import { Server as SocketIOServer } from 'socket.io';

const server = Fastify({
  logger: true,
  bodyLimit: 20 * 1024 * 1024
});

server.register(fastifyCors, {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

const socketIo = new SocketIOServer(server.server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

socketIo.on('connection', (socket) => {
  server.log.info({ id: socket.id }, 'Client connected');

  socket.on('message', (message: string) => {
    server.log.info({ message }, 'Received Socket.IO message');
    socket.emit('message', `Echo: ${message}`);
  });

  socket.on('disconnect', () => {
    server.log.info({ id: socket.id }, 'Client disconnected');
  });
});

const start = async () => {
  try {
    await server.listen({ port: 8080, host: '0.0.0.0' });
    server.log.info('Server listening on port 8080');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();