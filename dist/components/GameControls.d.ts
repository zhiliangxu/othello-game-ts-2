import React from 'react';
import { Difficulty } from '../ai/AStarAI';
export declare const GameMode: {
    readonly HUMAN_VS_HUMAN: "human-vs-human";
    readonly HUMAN_VS_COMPUTER: "human-vs-computer";
};
export type GameMode = typeof GameMode[keyof typeof GameMode];
interface GameControlsProps {
    readonly gameMode: GameMode;
    readonly difficulty: Difficulty;
    readonly gameOver: boolean;
    readonly onGameModeChange: (mode: GameMode) => void;
    readonly onDifficultyChange: (difficulty: Difficulty) => void;
    readonly onNewGame: () => void;
}
declare const GameControls: React.FC<GameControlsProps>;
export default GameControls;
//# sourceMappingURL=GameControls.d.ts.map