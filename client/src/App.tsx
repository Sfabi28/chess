import Board from './Board'
import Menu from './Menu'
import Join from './Join'
import { useState } from 'react'
import './App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('menu')

  if (currentScreen === 'menu') {
    return (
      <main className="app">
        <Menu 
          onCreateRoom={() => setCurrentScreen('game')} 
          onJoinRoom={() => setCurrentScreen('join')}
        />
      </main>
    )
  }

  if (currentScreen === 'join') {
    return (
      <main className="app">
        <Join
          onJoinCode={() => setCurrentScreen('game')}
          onBack={() => setCurrentScreen('menu')}
        />
      </main>
    )
  }

  if (currentScreen === 'game') {
    return (
      <main className="app">
        <Board
          onGiveUp={() => setCurrentScreen('menu')}
        />
      </main>
    )
  }

  return null
}

export default App