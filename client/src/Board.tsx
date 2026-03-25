import './Board.css'

type BoardProps = {
  onGiveUp: () => void
}

function Board({ onGiveUp }: BoardProps) {
  const squares = Array.from({ length: 64 }, (_, index) => {
    const row = Math.floor(index / 8)
    const col = index % 8
    const isDark = (row + col) % 2 === 1

    return <div key={index} className={`square ${isDark ? 'dark' : 'light'}`} />
  })

  return (
    <div>
      <div className="board">{squares}</div>
      <button onClick={onGiveUp}>Give up</button>
    </div>
  )
}

export default Board