
export type Color = 'w' | 'b';

export type Figure = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
type Rank = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';

export type Square = `${File}${Rank}`;

export interface Piece {
  color: Color;
  figure: Figure;
}

export type PromotionFigure = 'q' | 'r' | 'b' | 'n';

export type Board = Record<Square, Piece | null>

export type GameState = {board: Board, turn: Color, move: number, enPassant: Square | null, castlingRight: [boolean, boolean, boolean, boolean] }
// castlingRight: [boolean, boolean, boolean, boolean] = blungo, bcorto, nlungo, ncorto