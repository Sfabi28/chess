import { io, type Socket } from 'socket.io-client'
import type { ClientEvents, ServerEvents } from '../../shared/socket'

export const socket: Socket<ClientEvents, ServerEvents> = io('http://localhost:8080', {
  withCredentials: true,
})