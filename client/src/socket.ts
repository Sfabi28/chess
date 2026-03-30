import { io, type Socket } from 'socket.io-client'
import type { ClientEvents, ServerEvents } from '../../shared/socket'

const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8080'

export const socket: Socket<ClientEvents, ServerEvents> = io(serverUrl, {
  withCredentials: true,
})