import './Board.css'

function Board() {
  const squares = Array.from({ length: 64 }, (_, index) => {
    const row = Math.floor(index / 8)
    const col = index % 8
    const isDark = (row + col) % 2 === 1

    return <div key={index} className={`square ${isDark ? 'dark' : 'light'}`} />
  })

  return <div className="board">{squares}</div>
}

export default Board