import Board from './Board'
import Menu from './Menu'
import Join from './Join'
import { useState } from 'react'
import './App.css'
import { socket } from './socket'
import type { GameState } from '../../shared/types'

let listenersBound = false

function App() {
  const [currentScreen, setCurrentScreen] = useState('menu')
  const [roomCode, setRoomCode] = useState('')
  const [color, setColor] = useState<'w' | 'b'>('w')
  const [gameState, setGameState] = useState<GameState | null>(null)

  if (!listenersBound) {
    listenersBound = true

    socket.on('room:created', (code) => {
      setCurrentScreen('game')
      setRoomCode(code)
      setColor('w')
    })
    socket.on('room:joined', (state) => {
      setGameState(state)
      setCurrentScreen('game')
    })
    socket.on('game:state', (state) => setGameState(state))
    socket.on('room:error', () => setCurrentScreen('menu'))
    socket.on('game:ended', () => setCurrentScreen('menu'))
  }

  if (currentScreen === 'menu') {
    return (
      <main className="app">
        <Menu
          onCreateRoom={() => {
            setColor('w')
            socket.emit('room:create')
          }}
          onJoinRoom={() => setCurrentScreen('join')}
        />
      </main>
    )
  }

  if (currentScreen === 'join') {
    return (
      <main className="app">
        <Join
          onJoinCode={(code: string) => {
            setColor('b')
            const trimmedCode = code.trim()
            setRoomCode(trimmedCode)
            socket.emit('room:join', trimmedCode)
          }}
          onBack={() => setCurrentScreen('menu')}
        />
      </main>
    )
  }

  if (currentScreen === 'game') {
    return (
      <main className="app">
        <Board
          onGiveUp={() => socket.emit('game:giveup')}
          roomCode={roomCode}
          color={color}
          board={gameState?.board ?? null}
          legalMoves={gameState?.legalMoves ?? null}
          lastMove={gameState?.lastMove ?? null}
          socket={socket}
          turn={gameState?.turn ?? null}
        />
      </main>
    )
  }

  return null
}

export default App