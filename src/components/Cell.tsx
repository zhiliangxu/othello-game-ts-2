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

const Cell: React.FC<CellProps> = ({ 
  player, 
  currentPlayer,
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

  const getValidMoveIndicatorClass = (): string => {
    let classes = 'valid-move-indicator';
    
    if (currentPlayer === Player.BLACK) {
      classes += ' black-hint';
    } else if (currentPlayer === Player.WHITE) {
      classes += ' white-hint';
    }
    
    return classes;
  };

  return (
    <div className={getCellClass()} onClick={handleClick}>
      {player !== Player.EMPTY && (
        <div className={getPieceClass()}></div>
      )}
      {isValidMove && player === Player.EMPTY && (
        <div className={getValidMoveIndicatorClass()}></div>
      )}
    </div>
  );
};

export default Cell;
