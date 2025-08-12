import React from 'react';
import { Player } from '../game/OthelloGame';
interface CellProps {
    player: Player;
    currentPlayer: Player;
    row: number;
    col: number;
    isValidMove: boolean;
    isAnimating?: boolean;
    onClick: (row: number, col: number) => void;
}
declare const Cell: React.FC<CellProps>;
export default Cell;
//# sourceMappingURL=Cell.d.ts.map