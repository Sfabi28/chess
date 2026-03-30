import dotenv from 'dotenv'
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import { Server as SocketIOServer } from 'socket.io';
import { createRoom, getRoomByPlayerId, joinRoom, leaveRoom } from './rooms'
import { ServerEvents, ClientEvents } from '../shared/socket'
import { generateLegalMoves } from './move_generator'
import type { Square } from '../shared/types'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '.env.local') })

const clientUrl = process.env.VITE_CLIENT_URL || 'http://localhost:5173'
const clientUrlAlt = process.env.VITE_CLIENT_URL_ALT || 'http://localhost:5174'
const serverPort = process.env.SERVER_PORT || '8080'
const serverHost = process.env.SERVER_HOST || '0.0.0.0'

const server = Fastify({
  logger: true,
  bodyLimit: 20 * 1024 * 1024
});

server.register(fastifyCors, {
  origin: [clientUrl, clientUrlAlt],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

const socketIo = new SocketIOServer<ServerEvents, ClientEvents>(server.server, {
  cors: {
    origin: [clientUrl, clientUrlAlt],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

socketIo.on('connection', (socket) => {
  server.log.info({ id: socket.id }, 'Client connected');

  socket.on('room:create', () => {
    const room = createRoom(socket.id)
    socket.join(room.code)
    socket.emit('room:created', room.code)
  })

  socket.on('room:join', (code) => {
    const room = joinRoom(code, socket.id)
    if (room) {
      socket.join(code)
      socket.emit('room:joined', room.gameState)
      socket.to(code).emit('room:joined', room.gameState)
    }
    else {
      socket.emit('room:error', 'Room not found or already full')
    }
  })

  socket.on('game:giveup', () => {
    const room = getRoomByPlayerId(socket.id)
    if (!room) return

    const closedRoomCode = room.code
    
    // Notifica entrambi i giocatori prima di eliminare
    socketIo.to(closedRoomCode).emit('game:ended', { winner: null, reason: 'opponent_gave_up' })
    
    // Elimina la room
    leaveRoom(socket.id)
    
    server.log.info({ roomCode: closedRoomCode }, 'Room closed: player gave up')
  })

  socket.on('game:move', (from, to) => {
    const room = getRoomByPlayerId(socket.id)
    if (!room) {
      return
    }

    const player = room.players.find((p) => p.id === socket.id)
    if (!player) {
      return
    }

    const gameState = room.gameState
    if (gameState.turn !== player.color) {
      return
    }

    const fromSquare = from as Square
    const toSquare = to as Square

    const piece = gameState.board[fromSquare]
    if (!piece || piece.color !== player.color) {
      return
    }

    const legalFromMoves = gameState.legalMoves[fromSquare] ?? []
    if (!legalFromMoves.includes(toSquare)) {
      return
    }

    gameState.board[toSquare] = piece
    gameState.board[fromSquare] = null

    gameState.turn = gameState.turn === 'w' ? 'b' : 'w'
    gameState.move += 1
    gameState.selectedSquare = null
    gameState.legalMoves = generateLegalMoves(gameState)

    socketIo.to(room.code).emit('game:state', gameState)
  })

  socket.on('disconnect', () => {
    const closedRoomCode = leaveRoom(socket.id)
    if (closedRoomCode) {
      socket.to(closedRoomCode).emit('room:error', 'Opponent disconnected. Room closed')
    }

    server.log.info({ id: socket.id }, 'Client disconnected');
  })
});

const start = async () => {
  try {
    await server.listen({ port: Number(serverPort), host: serverHost });
    server.log.info(`Server listening on ${serverHost}:${serverPort}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();