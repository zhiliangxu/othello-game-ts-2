import React from 'react';
import { Difficulty } from '../ai/AStarAI';

export enum GameMode {
  HUMAN_VS_HUMAN = 'human-vs-human',
  HUMAN_VS_COMPUTER = 'human-vs-computer'
}

interface GameControlsProps {
  gameMode: GameMode;
  difficulty: Difficulty;
  gameOver: boolean;
  onGameModeChange: (mode: GameMode) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onNewGame: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameMode,
  difficulty,
  gameOver,
  onGameModeChange,
  onDifficultyChange,
  onNewGame
}) => {
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
        {gameMode === GameMode.HUMAN_VS_COMPUTER && (
          <div className="col-md-6">
            <label className="form-label">Difficulty:</label>
            <select 
              className="form-select" 
              value={difficulty} 
              onChange={(e) => onDifficultyChange(parseInt(e.target.value) as Difficulty)}
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
