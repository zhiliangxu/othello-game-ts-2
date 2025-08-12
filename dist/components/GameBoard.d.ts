import React from 'react';
import { Player, Position } from '../game/OthelloGame';
interface GameBoardProps {
    board: Player[][];
    validMoves: Position[];
    currentPlayer: Player;
    animatingCells?: Position[];
    onCellClick: (row: number, col: number) => void;
}
declare const GameBoard: React.FC<GameBoardProps>;
export default GameBoard;
//# sourceMappingURL=GameBoard.d.ts.map