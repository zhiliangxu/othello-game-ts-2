import React from 'react';
import { Player } from '../game/OthelloGame';
interface GameStatusProps {
    gameOver: boolean;
    winner: Player | null;
    currentPlayer: Player;
    blackCount: number;
    whiteCount: number;
}
declare const GameStatus: React.FC<GameStatusProps>;
export default GameStatus;
//# sourceMappingURL=GameStatus.d.ts.map