import React from 'react';
import Cell from './Cell';
import { Player, Position } from '../game/OthelloGame';

interface GameBoardProps {
  board: Player[][];
  validMoves: Position[];
  currentPlayer: Player;
  animatingCells?: Position[];
  onCellClick: (row: number, col: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  board, 
  validMoves, 
  currentPlayer,
  animatingCells = [],
  onCellClick 
}) => {
  const isValidMove = (row: number, col: number): boolean => {
    return validMoves.some(move => move.row === row && move.col === col);
  };

  const isAnimating = (row: number, col: number): boolean => {
    return animatingCells.some(cell => cell.row === row && cell.col === col);
  };

  return (
    <div className="game-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              player={cell}
              currentPlayer={currentPlayer}
              row={rowIndex}
              col={colIndex}
              isValidMove={isValidMove(rowIndex, colIndex)}
              isAnimating={isAnimating(rowIndex, colIndex)}
              onClick={onCellClick}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
