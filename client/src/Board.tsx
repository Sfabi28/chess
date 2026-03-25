import './Board.css'

type BoardProps = {
  onGiveUp: () => void
  roomCode: string
}

function Board({ onGiveUp, roomCode }: BoardProps) {
  const squares = Array.from({ length: 64 }, (_, index) => {
    const row = Math.floor(index / 8)
    const col = index % 8
    const isDark = (row + col) % 2 === 1

    return <div key={index} className={`square ${isDark ? 'dark' : 'light'}`} />
  })

  return (
    <div>
      <h3>Code: {roomCode || '---'}</h3>
      <div className="board">{squares}</div>
      <button onClick={onGiveUp}>Give up</button>
    </div>
  )
}

export default Board