import { Player, Position } from '../game/OthelloGame';
export interface AIMove {
    readonly row: number;
    readonly col: number;
    readonly score: number;
}
export declare const Difficulty: {
    readonly EASY: 2;
    readonly MEDIUM: 4;
    readonly HARD: 6;
};
export type Difficulty = typeof Difficulty[keyof typeof Difficulty];
export declare class AStarAI {
    #private;
    static readonly WEIGHTS: Record<'piece' | 'corner' | 'edge' | 'mobility' | 'stability', number>;
    constructor(player: Player, difficulty?: Difficulty);
    getBestMove(board: Player[][], validMoves: Position[]): Position | null;
    private minimax;
    private evaluateBoard;
    private calculateMobilityScore;
    private calculateStabilityScore;
    private isStable;
    private hasStableNeighbors;
    private getValidMoves;
    private isValidMove;
    private canFlipInDirection;
    private simulateMove;
    private flipInDirection;
    setDifficulty(difficulty: Difficulty): void;
}
//# sourceMappingURL=AStarAI.d.ts.map