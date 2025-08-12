import React from 'react';
import { Player } from '../game/OthelloGame';

interface GameStatusProps {
  gameOver: boolean;
  winner: Player | null;
  currentPlayer: Player;
  blackCount: number;
  whiteCount: number;
}

const GameStatus: React.FC<GameStatusProps> = ({
  gameOver,
  winner,
  currentPlayer,
  blackCount,
  whiteCount
}) => {
  const getStatusMessage = (): string => {
    if (gameOver) {
      if (winner === null) {
        return "It's a tie!";
      } else if (winner === Player.BLACK) {
        return `Black wins! (${blackCount} - ${whiteCount})`;
      } else {
        return `White wins! (${whiteCount} - ${blackCount})`;
      }
    } else {
      return currentPlayer === Player.BLACK ? "Black's turn" : "White's turn";
    }
  };

  const getStatusClass = (): string => {
    if (gameOver) {
      return 'alert alert-success';
    } else {
      return currentPlayer === Player.BLACK ? 'alert alert-dark' : 'alert alert-light';
    }
  };

  return (
    <div className={getStatusClass()}>
      <h4 className="mb-0 text-center">{getStatusMessage()}</h4>
    </div>
  );
};

export default GameStatus;
