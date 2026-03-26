import { moveMessagePortToContext } from 'node:worker_threads';
import type { GameState, Square, Board, Piece, Color } from '../shared/types'

function generateMovesForPiece(square: Square, piece: Piece, board: Board): Square[] {
    switch (piece.figure) {
        case 'p':
            return generatePawnMoves(square, piece.color, board); // TODO aggiungere promozione ed en passant
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

function isSquareAttackedByOpponent(square: Square, byColor: Color, board: Board): boolean {
    const opponentColor = byColor === 'w' ? 'b' : 'w';
    
    for (const squareKey in board) {
        const piece = board[squareKey as Square];
        if (piece && piece.color === opponentColor && piece.figure !== 'k') {
            const moves = generateMovesForPiece(squareKey as Square, piece, board);
            if (moves.includes(square)) {
                return true;
            }
        }
    }
    return false;
}

function generateKingMoves(square: Square, color: Color, board: Board) : Square[] {

    const moves = [[-1,1], [0,1], [1,1], [-1,0], [1,0], [-1,-1], [0,-1], [1,-1]]

    const possibleMoves: Square[] = []

    const currentX = square[0].charCodeAt(0) - 97
    const currentY = parseInt(square[1]) - 1  

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

    const legalMoves = possibleMoves.filter(move => !isSquareAttackedByOpponent(move, color, board))

    return legalMoves
}

function generateQueenMoves(square: Square, color: Color, board: Board) : Square[] {
    const possibleMoves: Square[] = []

    const rook = generateRookMoves(square, color, board)
    const bishop = generateBishopMoves(square, color, board)

    possibleMoves.push(...rook)
    possibleMoves.push(...bishop)

    return possibleMoves
}

function generateBishopMoves(square: Square, color: Color, board: Board) : Square[] {
    const directions = [[1, 1], [-1, -1], [-1, 1], [1, -1]]

    const currentX = square[0].charCodeAt(0) - 97
    const currentY = parseInt(square[1]) - 1

    const possibleMoves: Square[] = []

    for (const [dx, dy] of directions) {
        let x = currentX + dx
        let y = currentY + dy

        while (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
            const coordX = String.fromCharCode(x + 97)
            const coordY = (y + 1).toString()
            const targetSquare = coordX + coordY as Square

            if (!board[targetSquare]) {
                possibleMoves.push(targetSquare)
            } else if (board[targetSquare].color !== color) {
                possibleMoves.push(targetSquare)
                break
            } else {
                break
            }

            x += dx
            y += dy
        }
    }

    return possibleMoves   
}

function generateRookMoves(square: Square, color: Color, board: Board): Square[] {
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]]

    const currentX = square[0].charCodeAt(0) - 97
    const currentY = parseInt(square[1]) - 1

    const possibleMoves: Square[] = []

    for (const [dx, dy] of directions) {
        let x = currentX + dx
        let y = currentY + dy

        while (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
            const coordX = String.fromCharCode(x + 97)
            const coordY = (y + 1).toString()
            const targetSquare = coordX + coordY as Square

            if (!board[targetSquare]) {
                possibleMoves.push(targetSquare)
            } else if (board[targetSquare].color !== color) {
                possibleMoves.push(targetSquare)
                break
            } else {
                break
            }

            x += dx
            y += dy
        }
    }

    return possibleMoves
}

function generatePawnMoves(square: Square, color: Color, board: Board): Square[] {

    const currentX = square[0].charCodeAt(0) - 97
    const currentY = parseInt(square[1]) - 1
    const possibleMoves: Square[] = []

    const direction = color === 'w' ? 1 : -1
    const startRank = color === 'w' ? 1 : 6

    const toSquare = (x: number, y: number): Square =>
        (String.fromCharCode(x + 97) + (y + 1).toString()) as Square

    const oneStepY = currentY + direction
    if (oneStepY >= 0 && oneStepY <= 7) { //spostamento e spostamento iniziale
        const oneStepSquare : Square = toSquare(currentX, oneStepY)
        if (!board[oneStepSquare]) {
            possibleMoves.push(oneStepSquare)

            const twoStepY = currentY + 2 * direction
            if (currentY === startRank && twoStepY >= 0 && twoStepY <= 7) {
                const twoStepSquare = toSquare(currentX, twoStepY)
                if (!board[twoStepSquare]) {
                    possibleMoves.push(twoStepSquare)
                }
            }
        }
    }

    for (const dx of [-1, 1]) { //mangiare
        const targetX = currentX + dx
        const targetY = currentY + direction

        if (targetX < 0 || targetX > 7 || targetY < 0 || targetY > 7) continue

        const targetSquare = toSquare(targetX, targetY)
        const targetPiece = board[targetSquare]

        if (targetPiece && targetPiece.color !== color) {
            possibleMoves.push(targetSquare)
        }
    }

    return possibleMoves
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