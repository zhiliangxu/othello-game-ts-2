import React from 'react';
import { Player } from '../game/OthelloGame';

interface ScoreDisplayProps {
  blackCount: number;
  whiteCount: number;
  currentPlayer: Player;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  blackCount, 
  whiteCount, 
  currentPlayer 
}) => {
  return (
    <div className="score-display">
      <div className="row">
        <div className="col-6">
          <div className={`score-card ${currentPlayer === Player.BLACK ? 'active' : ''}`}>
            <div className="score-header">
              <div className="piece black"></div>
              <span className="player-name">Black</span>
            </div>
            <div className="score-value">{blackCount}</div>
          </div>
        </div>
        <div className="col-6">
          <div className={`score-card ${currentPlayer === Player.WHITE ? 'active' : ''}`}>
            <div className="score-header">
              <div className="piece white"></div>
              <span className="player-name">White</span>
            </div>
            <div className="score-value">{whiteCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
