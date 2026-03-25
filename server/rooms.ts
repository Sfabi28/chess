import { Room, Player } from '../shared/socket'
import { createInitialGameState } from './game'

const rooms = new Map<string, Room>()

function generateCode() : string {
    var code: string

    do {
        code = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
    } while (rooms.has(code))
    return code
}

export function createRoom(socketId: string) : Room {
    const code = generateCode()
    const room : Room = {
        code,
        players: [{id: socketId, color: 'w'}],
        gameState: createInitialGameState(),
        active: false
    }
    rooms.set(code, room)
    return room
}

export function joinRoom(code: string, socketId: string) : Room | null{
    const room = rooms.get(code)

    if (!room || room.active)
        return null

    room.active = true
    room.players.push({id: socketId, color: 'b'})
    return room
}

export function leaveRoom(socketId: string): string | null {
  for (const [code, room] of rooms) {
    const isPlayerInRoom = room.players.some((player) => player.id === socketId)
    if (isPlayerInRoom) {
      rooms.delete(code)
      return code
    }
  }
  return null
}

export function getRoom(code: string) : Room | undefined{
    return rooms.get(code)
}