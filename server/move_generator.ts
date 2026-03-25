import type { GameState, Square, Board, Piece, Color } from '../shared/types'

function generateMovesForPiece(square: Square, piece: Piece, board: Board): Square[] {
    switch (piece.figure) {
        case 'p':
            return generatePawnMoves(square, piece.color, board);
        case 'n':
            return generateKnightMoves(square, piece.color, board);
        case 'b':
            return generateBishopMoves(square, piece.color, board);
        case 'r':
            return generateRookMoves(square, piece.color, board);
        case 'q':
            return generateQueenMoves(square, piece.color, board);
        case 'k':
            return generateKingMoves(square, piece.color, board);
        default:
            return [];
    }
}

function generateKnightMoves(square: Square, color: Color, board: Board): Square[] {
    const moves = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]]

    const currentX = square[0].charCodeAt(0) - 97
    const currentY = parseInt(square[1]) - 1

    const possibleMoves : Square[] = []

    for (const [dx, dy] of moves) {
        const targetX = currentX + dx
        const targetY = currentY + dy
        var coordX : string
        var coordY : string

        if (targetX >= 0 && targetX <= 7) {
            if (targetY >=0 && targetY <= 7) {
                coordX = String.fromCharCode(targetX + 97)
                coordY = (targetY + 1).toString()
                const targetSquare = coordX + coordY as Square

                if (!board[targetSquare] || board[targetSquare].color !== color)
                    possibleMoves.push(targetSquare)
            }
        }
    }
    return possibleMoves
}

export function generateLegalMoves(gameState: GameState): Record<Square, Square[]> {
 const legalMoves: Partial<Record<Square, Square[]>> = {};
    const board = gameState.board;
    const turn = gameState.turn;

    for (const square in board) {
      const piece = board[square as Square];
      if (piece && piece.color === turn) {
        legalMoves[square as Square] = generateMovesForPiece(square as Square, piece, board);
      }
    }
  return legalMoves as Record<Square, Square[]>;
}