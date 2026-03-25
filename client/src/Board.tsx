import './Board.css'

type BoardProps = {
  onGiveUp: () => void
  roomCode: string
  color: 'w' | 'b'
}

const WHITE_FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const
const BLACK_FILES = [...WHITE_FILES].reverse()
const WHITE_RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'] as const
const BLACK_RANKS = [...WHITE_RANKS].reverse()

function Board({ onGiveUp, roomCode, color }: BoardProps) {
  const files = color === 'w' ? WHITE_FILES : BLACK_FILES
  const ranks = color === 'w' ? WHITE_RANKS : BLACK_RANKS

  const squares = ranks.flatMap((rank, rowIndex) =>
    files.map((file, colIndex) => {
      const fileIndex = file.charCodeAt(0) - 'a'.charCodeAt(0)
      const rankIndex = Number(rank) - 1
      const isDark = (fileIndex + rankIndex) % 2 === 0
      const squareName = `${file}${rank}`

      return (
        <div key={squareName} className={`square ${isDark ? 'dark' : 'light'}`}>
          {colIndex === 0 && <span className="square-label-rank">{rank}</span>}
          {rowIndex === 7 && <span className="square-label-file">{file}</span>}
        </div>
      )
    })
  )

  return (
    <div>
      <h3>Code: {roomCode || '---'}</h3>
      <div className="board">{squares}</div>
      <button onClick={onGiveUp}>Give up</button>
    </div>
  )
}

export default Board