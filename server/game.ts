import type { GameState, Square, Piece, Color, Board } from "../shared/types"

export function createInitialGameState() : GameState {
  var game = {} as GameState;

  game.board = setupBoard();
  game.turn = "w";
  game.move = 1;
  game.enPassant = null;
  game.castlingRight = [true, true, true, true];

  return game;
}

function setupBoard(): Board {
  const board = {} as Board;

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
  const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

  for (const file of files) {
    for (const rank of ranks) {
      const square = `${file}${rank}` as keyof Board;
      board[square] = setPiece(square);
    }
  }

  return board;
}

function setPiece(square: Square): Piece | null {
  const file = square[0] as "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
  const rank = square[1] as "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";

  if (rank === "2") return { color: "w", figure: "p" };
  if (rank === "7") return { color: "b", figure: "p" };

  if (rank === "1") {
    if (file === "a" || file === "h") return { color: "w", figure: "r" };
    if (file === "b" || file === "g") return { color: "w", figure: "n" };
    if (file === "c" || file === "f") return { color: "w", figure: "b" };
    if (file === "d") return { color: "w", figure: "q" };
    if (file === "e") return { color: "w", figure: "k" };
  }

  if (rank === "8") {
    if (file === "a" || file === "h") return { color: "b", figure: "r" };
    if (file === "b" || file === "g") return { color: "b", figure: "n" };
    if (file === "c" || file === "f") return { color: "b", figure: "b" };
    if (file === "d") return { color: "b", figure: "q" };
    if (file === "e") return { color: "b", figure: "k" };
  }

  return null;
}