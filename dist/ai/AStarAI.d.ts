import { Player, Position } from '../game/OthelloGame';
export interface AIMove {
    row: number;
    col: number;
    score: number;
}
export declare enum Difficulty {
    EASY = 2,
    MEDIUM = 4,
    HARD = 6
}
export declare class AStarAI {
    private maxDepth;
    private player;
    constructor(player: Player, difficulty?: Difficulty);
    getBestMove(board: Player[][], validMoves: Position[]): Position | null;
    private minimax;
    private evaluateBoard;
    private calculatePieceScore;
    private calculateCornerScore;
    private calculateEdgeScore;
    private calculateMobilityScore;
    private calculateStabilityScore;
    private isStable;
    private hasStableNeighbors;
    private getValidMoves;
    private isValidMove;
    private canFlipInDirection;
    private simulateMove;
    private flipInDirection;
    private getOpponent;
    private isGameOver;
    setDifficulty(difficulty: Difficulty): void;
}
//# sourceMappingURL=AStarAI.d.ts.map