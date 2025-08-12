export declare enum Player {
    BLACK = 1,
    WHITE = -1,
    EMPTY = 0
}
export interface Position {
    row: number;
    col: number;
}
export interface GameState {
    board: Player[][];
    currentPlayer: Player;
    blackCount: number;
    whiteCount: number;
    gameOver: boolean;
    winner: Player | null;
    validMoves: Position[];
}
export declare class OthelloGame {
    private board;
    private currentPlayer;
    private gameOver;
    private winner;
    constructor();
    private initializeBoard;
    getGameState(): GameState;
    makeMove(row: number, col: number): boolean;
    isValidMove(row: number, col: number, player: Player): boolean;
    private canFlipInDirection;
    private flipPieces;
    private flipInDirection;
    getValidMoves(player: Player): Position[];
    private switchPlayer;
    private checkGameOver;
    private countPieces;
    resetGame(): void;
    getBoardCopy(): Player[][];
    simulateMove(row: number, col: number, player: Player): Player[][];
    private canFlipInDirectionOnBoard;
    private flipInDirectionOnBoard;
}
//# sourceMappingURL=OthelloGame.d.ts.map