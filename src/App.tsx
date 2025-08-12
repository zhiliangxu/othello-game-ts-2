import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './components/GameBoard';
import ScoreDisplay from './components/ScoreDisplay';
import GameControls, { GameMode } from './components/GameControls';
import GameStatus from './components/GameStatus';
import { OthelloGame, Player, Position } from './game/OthelloGame';
import { AStarAI, Difficulty } from './ai/AStarAI';
import { SoundManager } from './utils/SoundManager';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

// Using const assertion for better type inference
const ANIMATION_DURATION = 500 as const;
const AI_THINKING_DELAY = 500 as const;

const App: React.FC = () => {
  // Using lazy initialization and proper typing
  const [game] = useState(() => new OthelloGame());
  const [gameState, setGameState] = useState(() => game.getGameState());
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.HUMAN_VS_COMPUTER);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [ai] = useState(() => new AStarAI(Player.WHITE, difficulty));
  const [soundManager] = useState(() => new SoundManager());
  const [animatingCells, setAnimatingCells] = useState<Position[]>([]);
  const [isAIThinking, setIsAIThinking] = useState(false);

  // More concise helper functions using arrow syntax
  const updateGameState = useCallback(() => setGameState(game.getGameState()), [game]);

  const animateMove = useCallback((position: Position) => {
    setAnimatingCells([position]);
    setTimeout(() => setAnimatingCells([]), ANIMATION_DURATION);
  }, []);

  const handleCellClick = useCallback(async (row: number, col: number) => {
    // Early returns for better readability
    if (gameState.gameOver || isAIThinking) return;
    if (gameMode === GameMode.HUMAN_VS_COMPUTER && gameState.currentPlayer === Player.WHITE) return;

    if (!game.makeMove(row, col)) return;

    soundManager.playPlacePieceSound();
    animateMove({ row, col });
    updateGameState();

    const newState = game.getGameState();
    if (newState.gameOver) {
      soundManager.playGameOverSound();
      return;
    }

    // Using optional chaining for cleaner conditionals
    if (gameMode === GameMode.HUMAN_VS_COMPUTER && newState.currentPlayer === Player.WHITE) {
      handleAIMove();
    }
  }, [gameState, gameMode, isAIThinking, game, soundManager, updateGameState, animateMove]);

  const handleAIMove = useCallback(async () => {
    setIsAIThinking(true);
    
    setTimeout(() => {
      const currentState = game.getGameState();
      const aiMove = ai.getBestMove(currentState.board, currentState.validMoves);
      
      if (aiMove && game.makeMove(aiMove.row, aiMove.col)) {
        soundManager.playPlacePieceSound();
        animateMove(aiMove);
        updateGameState();
        
        const newState = game.getGameState();
        if (newState.gameOver) {
          soundManager.playGameOverSound();
        }
      }
      
      setIsAIThinking(false);
    }, AI_THINKING_DELAY);
  }, [game, ai, soundManager, updateGameState, animateMove]);

  const handleNewGame = useCallback(() => {
    game.resetGame();
    setAnimatingCells([]);
    setIsAIThinking(false);
    updateGameState();
  }, [game, updateGameState]);

  const handleGameModeChange = useCallback((mode: GameMode) => {
    setGameMode(mode);
    handleNewGame();
  }, [handleNewGame]);

  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    ai.setDifficulty(newDifficulty);
  }, [ai]);

  // Effect for handling AI moves with better condition checking
  useEffect(() => {
    const shouldAIMove = 
      gameMode === GameMode.HUMAN_VS_COMPUTER && 
      gameState.currentPlayer === Player.WHITE && 
      !gameState.gameOver && 
      !isAIThinking;
      
    if (shouldAIMove) {
      handleAIMove();
    }
  }, [gameMode, gameState.currentPlayer, gameState.gameOver, isAIThinking, handleAIMove]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center my-4">Othello Game</h1>
        </div>
      </div>
      
      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-6">
          <div className="card shadow">
            <div className="card-body">
              <GameStatus
                gameOver={gameState.gameOver}
                winner={gameState.winner}
                currentPlayer={gameState.currentPlayer}
                blackCount={gameState.blackCount}
                whiteCount={gameState.whiteCount}
              />
              
              <div className={`ai-thinking-banner ${isAIThinking ? 'visible' : 'hidden'}`}>
                <div className="alert alert-info text-center mb-0">
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  AI is thinking...
                </div>
              </div>
              
              <div className="game-container">
                <GameBoard
                  board={gameState.board}
                  validMoves={gameState.validMoves}
                  currentPlayer={gameState.currentPlayer}
                  animatingCells={animatingCells}
                  onCellClick={handleCellClick}
                />
              </div>
              
              <ScoreDisplay
                blackCount={gameState.blackCount}
                whiteCount={gameState.whiteCount}
                currentPlayer={gameState.currentPlayer}
              />
            </div>
          </div>
        </div>
        
        <div className="col-lg-4 col-xl-3">
          <div className="card shadow">
            <div className="card-header">
              <h5 className="mb-0">Game Settings</h5>
            </div>
            <div className="card-body">
              <GameControls
                gameMode={gameMode}
                difficulty={difficulty}
                gameOver={gameState.gameOver}
                onGameModeChange={handleGameModeChange}
                onDifficultyChange={handleDifficultyChange}
                onNewGame={handleNewGame}
              />
            </div>
          </div>
          
          <div className="card shadow mt-3">
            <div className="card-header">
              <h5 className="mb-0">How to Play</h5>
            </div>
            <div className="card-body">
              <p className="small">
                Place your disc to flank opponent discs. All flanked discs flip to your color.
                You must flip at least one disc per move. The player with the most discs wins!
              </p>
              <p className="small mb-0">
                <strong>Strategy tips:</strong> Secure corners, control edges, and maximize your mobility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
