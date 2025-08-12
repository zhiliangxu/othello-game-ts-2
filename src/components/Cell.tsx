import React from 'react';
import { Player } from '../game/OthelloGame';

interface CellProps {
  player: Player;
  row: number;
  col: number;
  isValidMove: boolean;
  isAnimating?: boolean;
  onClick: (row: number, col: number) => void;
}

const Cell: React.FC<CellProps> = ({ 
  player, 
  row, 
  col, 
  isValidMove, 
  isAnimating = false,
  onClick 
}) => {
  const handleClick = () => {
    if (isValidMove) {
      onClick(row, col);
    }
  };

  const getCellClass = (): string => {
    let classes = 'othello-cell';
    
    if (isValidMove) {
      classes += ' valid-move';
    }
    
    if (isAnimating) {
      classes += ' animating';
    }

    return classes;
  };

  const getPieceClass = (): string => {
    let classes = 'piece';
    
    if (player === Player.BLACK) {
      classes += ' black';
    } else if (player === Player.WHITE) {
      classes += ' white';
    }
    
    if (isAnimating) {
      classes += ' flip-animation';
    }

    return classes;
  };

  return (
    <div className={getCellClass()} onClick={handleClick}>
      {player !== Player.EMPTY && (
        <div className={getPieceClass()}></div>
      )}
      {isValidMove && player === Player.EMPTY && (
        <div className="valid-move-indicator"></div>
      )}
    </div>
  );
};

export default Cell;
