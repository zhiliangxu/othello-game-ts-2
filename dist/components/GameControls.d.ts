import React from 'react';
import { Difficulty } from '../ai/AStarAI';
export declare enum GameMode {
    HUMAN_VS_HUMAN = "human-vs-human",
    HUMAN_VS_COMPUTER = "human-vs-computer"
}
interface GameControlsProps {
    gameMode: GameMode;
    difficulty: Difficulty;
    gameOver: boolean;
    onGameModeChange: (mode: GameMode) => void;
    onDifficultyChange: (difficulty: Difficulty) => void;
    onNewGame: () => void;
}
declare const GameControls: React.FC<GameControlsProps>;
export default GameControls;
//# sourceMappingURL=GameControls.d.ts.map