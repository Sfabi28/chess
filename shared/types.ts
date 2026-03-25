
export type Color = 'w' | 'b' | null;

export type Figure = 'p' | 'n' | 'b' | 'r' | 'q' | 'k' | null;

type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
type Rank = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';

export type Square = `${File}${Rank}`;

export interface Piece {
  color: Color | null;
  figure: Figure | null;
}

export type PromotionFigure = 'q' | 'r' | 'b' | 'n';

export type Board = Record<Square, Piece | null>

export type GameState = {
  board: Board, 
  turn: Color, 
  move: number, 
  enPassant: Square | null, 
  castlingRight: [boolean, boolean, boolean, boolean],
  legalMoves: Record<Square, Square[]> 
}
// castlingRight: [boolean, boolean, boolean, boolean] = blungo, bcorto, nlungo, ncorto