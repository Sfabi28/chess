import './Board.css'
import { useState } from 'react'
import type { Board as ChessBoard, Piece, Figure, Square, Color } from '../../shared/types'

type BoardProps = {
  onGiveUp: () => void
  roomCode: string
  color: 'w' | 'b'
  board: ChessBoard | null
  legalMoves: Record<Square, Square[]> | null
  lastMove: { from: Square, to: Square } | null
  socket: any
  turn: Color
}

const FIGURE_TO_NAME: Record<Exclude<Figure, null>, string> = {
  p: 'pawn',
  n: 'knight',
  b: 'bishop',
  r: 'rook',
  q: 'queen',
  k: 'king',
}

function pieceSrc(piece: Piece | null) {
  if (!piece?.color || !piece?.figure) 
    return null
  return `/assets/${piece.color}_${FIGURE_TO_NAME[piece.figure]}.png`
}

const WHITE_FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const
const BLACK_FILES = [...WHITE_FILES].reverse()
const WHITE_RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'] as const
const BLACK_RANKS = [...WHITE_RANKS].reverse()

function Board({ onGiveUp, roomCode, color, board, legalMoves, lastMove, socket, turn }: BoardProps) {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)

  const files = color === 'w' ? WHITE_FILES : BLACK_FILES
  const ranks = color === 'w' ? WHITE_RANKS : BLACK_RANKS

    const handleSquareClick = (squareName: Square) => {

    const isMyTurn = turn === color
    if (!isMyTurn) return

    if (selectedSquare && legalMoves?.[selectedSquare]?.includes(squareName)) {
      console.log(`Mossa: ${selectedSquare} -> ${squareName}`)
      socket.emit('game:move', selectedSquare, squareName)
      setSelectedSquare(null)
      return
    }

    const piece = board?.[squareName]
    if (piece && piece.color === color) {
      setSelectedSquare(squareName)
    } else {
      setSelectedSquare(null)
    }
  }

  const squares = ranks.flatMap((rank, rowIndex) =>
    files.map((file, colIndex) => {
      const fileIndex = file.charCodeAt(0) - 'a'.charCodeAt(0)
      const rankIndex = Number(rank) - 1
      const isDark = (fileIndex + rankIndex) % 2 === 0
      const squareName = `${file}${rank}` as Square
      const piece = board?.[squareName] ?? null
      const src = pieceSrc(piece)

      const isSelected = selectedSquare === squareName
      const isMyTurn = turn === color
      const isLegalMove = isMyTurn && selectedSquare ? legalMoves?.[selectedSquare]?.includes(squareName): false
      const isLegalMoveCapture = isLegalMove && piece && piece.color !== color
      const isLastMove = lastMove && (squareName === lastMove.from || squareName === lastMove.to)
      return (
        <div 
          key={squareName} 
          className={`square ${isDark ? 'dark' : 'light'} ${isSelected ? 'selected' : ''} ${isLegalMoveCapture ? 'legal-move-capture' : isLegalMove ? 'legal-move' : ''} ${isLastMove ? 'last-move' : ''}`}
          onClick={() => handleSquareClick(squareName)}
          style={{ cursor: isMyTurn && piece?.color === color ? 'pointer' : 'default' }}
        >
          {src && <img src={src} alt="" className="piece" draggable={false} />}
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