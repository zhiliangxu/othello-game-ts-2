import React from 'react';
import { Difficulty } from '../ai/AStarAI';

// Using const assertion for better type safety
export const GameMode = {
  HUMAN_VS_HUMAN: 'human-vs-human',
  HUMAN_VS_COMPUTER: 'human-vs-computer'
} as const;

export type GameMode = typeof GameMode[keyof typeof GameMode];

// More concise interface with better typing
interface GameControlsProps {
  readonly gameMode: GameMode;
  readonly difficulty: Difficulty;
  readonly gameOver: boolean;
  readonly onGameModeChange: (mode: GameMode) => void;
  readonly onDifficultyChange: (difficulty: Difficulty) => void;
  readonly onNewGame: () => void;
}

// Using destructuring with better default handling
const GameControls: React.FC<GameControlsProps> = ({
  gameMode,
  difficulty,
  gameOver,
  onGameModeChange,
  onDifficultyChange,
  onNewGame
}) => {
  // Helper function for better readability
  const isComputerMode = gameMode === GameMode.HUMAN_VS_COMPUTER;
  return (
    <div className="game-controls">
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Game Mode:</label>
          <select 
            className="form-select" 
            value={gameMode} 
            onChange={(e) => onGameModeChange(e.target.value as GameMode)}
          >
            <option value={GameMode.HUMAN_VS_HUMAN}>Human vs Human</option>
            <option value={GameMode.HUMAN_VS_COMPUTER}>Human vs Computer</option>
          </select>
        </div>
        
        {/* Using logical AND for conditional rendering */}
        {isComputerMode && (
          <div className="col-md-6">
            <label className="form-label">Difficulty:</label>
            <select 
              className="form-select" 
              value={difficulty} 
              onChange={(e) => onDifficultyChange(Number(e.target.value) as Difficulty)}
            >
              <option value={Difficulty.EASY}>Easy</option>
              <option value={Difficulty.MEDIUM}>Medium</option>
              <option value={Difficulty.HARD}>Hard</option>
            </select>
          </div>
        )}
      </div>
      
      <div className="row">
        <div className="col-12">
          <button 
            className="btn btn-primary btn-lg w-100" 
            onClick={onNewGame}
          >
            {gameOver ? 'New Game' : 'Restart Game'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameControls;
