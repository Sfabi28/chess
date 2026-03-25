import { GameState } from "./types"

export interface ServerEvents { //client->server
  'room:create': () => void
  'room:join': (code: string) => void
  'game:giveup': () => void
}

export interface ClientEvents { //server->client
  'room:created': (roomCode: string) => void
  'room:joined': (gameState: GameState) => void
  'room:error': (message: string) => void
  'game:state': (gameState: GameState) => void
  'game:move': (from: string, to: string) => void
  'game:ended': (winner: 'w' | 'b' | null) => void
}

export interface Player {
  id: string
  color: 'w' | 'b'
  name?: string
}

export interface Room {
  code: string
  players: Player[]
  gameState: GameState
  active: boolean
}