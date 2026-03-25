import Board from './Board'
import Menu from './Menu'
import Join from './Join'
import { useState } from 'react'
import './App.css'
import { socket } from './socket'

let listenersBound = false

function App() {
  const [currentScreen, setCurrentScreen] = useState('menu')
  const [roomCode, setRoomCode] = useState('')

  if (!listenersBound) {
    listenersBound = true

    socket.on('room:created', (code) => {
      setCurrentScreen('game'),
      setRoomCode(code)
    })
    socket.on('room:joined', () => setCurrentScreen('game'))
    socket.on('room:error', () => setCurrentScreen('menu'))
    socket.on('game:ended', () => setCurrentScreen('menu'))
  }

  if (currentScreen === 'menu') {
    return (
      <main className="app">
        <Menu
          onCreateRoom={() => socket.emit('room:create')}
          onJoinRoom={() => setCurrentScreen('join')}
        />
      </main>
    )
  }

  if (currentScreen === 'join') {
    return (
      <main className="app">
        <Join
          onJoinCode={(code: string) => socket.emit('room:join', code.trim())}
          onBack={() => setCurrentScreen('menu')}
        />
      </main>
    )
  }

  if (currentScreen === 'game') {
    return (
      <main className="app">
        <Board onGiveUp={() => socket.emit('game:giveup')} roomCode = {roomCode}/>
      </main>
    )
  }

  return null
}

export default App