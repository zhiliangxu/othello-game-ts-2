import { Player, Position } from '../game/OthelloGame';

export interface AIMove {
  readonly row: number;
  readonly col: number;
  readonly score: number;
}

export const Difficulty = {
  EASY: 2,
  MEDIUM: 4,
  HARD: 6
} as const;

export type Difficulty = typeof Difficulty[keyof typeof Difficulty];

// Modern class with private fields
export class AStarAI {
  #maxDepth: number;
  readonly #player: Player;
  
  // Constants using const assertions
  static readonly #DIRECTIONS = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ] as const;
  
  static readonly #CORNERS = [
    [0, 0], [0, 7], [7, 0], [7, 7]
  ] as const;
  
  static readonly #BOARD_SIZE = 8 as const;
  
  // Evaluation weights using Record type
  static readonly WEIGHTS: Record<'piece' | 'corner' | 'edge' | 'mobility' | 'stability', number> = {
    piece: 1,
    corner: 25,
    edge: 5,
    mobility: 10,
    stability: 15
  };

  constructor(player: Player, difficulty: Difficulty = Difficulty.MEDIUM) {
    this.#player = player;
    this.#maxDepth = difficulty;
  }

  public getBestMove(board: Player[][], validMoves: Position[]): Position | null {
    if (!validMoves.length) return null;

    const { bestMove } = validMoves.reduce((acc, move) => {
      const score = this.minimax(
        this.simulateMove(board, move.row, move.col, this.#player),
        this.#maxDepth - 1,
        false,
        -Infinity,
        Infinity
      );

      return score > acc.bestScore 
        ? { bestMove: move, bestScore: score }
        : acc;
    }, { bestMove: null as Position | null, bestScore: -Infinity });

    return bestMove;
  }

  private minimax(
    board: Player[][],
    depth: number,
    isMaximizing: boolean,
    alpha: number,
    beta: number
  ): number {
    if (depth === 0 || this.#isGameOver(board)) {
      return this.evaluateBoard(board);
    }

    const currentPlayer = isMaximizing ? this.#player : this.#getOpponent(this.#player);
    const validMoves = this.getValidMoves(board, currentPlayer);

    if (!validMoves.length) {
      // No moves available, check if opponent can move
      const opponentMoves = this.getValidMoves(board, this.#getOpponent(currentPlayer));
      return !opponentMoves.length 
        ? this.evaluateBoard(board) // Game over
        : this.minimax(board, depth - 1, !isMaximizing, alpha, beta); // Pass turn
    }

    return isMaximizing 
      ? this.#maximizeEvaluation(board, validMoves, depth, alpha, beta, currentPlayer)
      : this.#minimizeEvaluation(board, validMoves, depth, alpha, beta, currentPlayer);
  }

  #maximizeEvaluation(board: Player[][], validMoves: Position[], depth: number, alpha: number, beta: number, currentPlayer: Player): number {
    let maxEval = -Infinity;
    for (const move of validMoves) {
      const newBoard = this.simulateMove(board, move.row, move.col, currentPlayer);
      const evaluation = this.minimax(newBoard, depth - 1, false, alpha, beta);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return maxEval;
  }

  #minimizeEvaluation(board: Player[][], validMoves: Position[], depth: number, alpha: number, beta: number, currentPlayer: Player): number {
    let minEval = Infinity;
    for (const move of validMoves) {
      const newBoard = this.simulateMove(board, move.row, move.col, currentPlayer);
      const evaluation = this.minimax(newBoard, depth - 1, true, alpha, beta);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return minEval;
  }

  private evaluateBoard(board: Player[][]): number {
    // Using more concise object destructuring with computed property names
    const scores = {
      piece: this.#calculatePieceScore(board),
      corner: this.#calculateCornerScore(board),
      edge: this.#calculateEdgeScore(board),
      mobility: this.calculateMobilityScore(board),
      stability: this.calculateStabilityScore(board)
    };

    // Using reduce for weighted combination
    return Object.entries(scores).reduce(
      (total, [key, value]) => total + value * AStarAI.WEIGHTS[key as keyof typeof AStarAI.WEIGHTS],
      0
    );
  }

  #calculatePieceScore(board: Player[][]): number {
    const opponent = this.#getOpponent(this.#player);
    
    // Using flatMap and filter for more functional approach
    const counts = board.flat().reduce(
      (acc, cell) => {
        if (cell === this.#player) acc.my++;
        else if (cell === opponent) acc.opponent++;
        return acc;
      },
      { my: 0, opponent: 0 }
    );

    return counts.my - counts.opponent;
  }

  #calculateCornerScore(board: Player[][]): number {
    const opponent = this.#getOpponent(this.#player);
    
    return AStarAI.#CORNERS.reduce((score, [row, col]) => {
      const cell = board[row]?.[col];
      return score + (cell === this.#player ? 1 : cell === opponent ? -1 : 0);
    }, 0);
  }

  #calculateEdgeScore(board: Player[][]): number {
    const opponent = this.#getOpponent(this.#player);
    let score = 0;

    // More concise edge calculation using array methods
    const edgePositions = [
      ...Array.from({ length: AStarAI.#BOARD_SIZE }, (_, i) => [[0, i], [7, i]]).flat(),
      ...Array.from({ length: AStarAI.#BOARD_SIZE }, (_, i) => [[i, 0], [i, 7]]).flat()
    ] as const;

    return edgePositions.reduce((score, [row, col]) => {
      const cell = board[row]?.[col];
      return score + (cell === this.#player ? 1 : cell === opponent ? -1 : 0);
    }, 0);
  }

  private calculateMobilityScore(board: Player[][]): number {
    const myMoves = this.getValidMoves(board, this.#player).length;
    const opponentMoves = this.getValidMoves(board, this.#getOpponent(this.#player)).length;
    
    return myMoves - opponentMoves;
  }

  private calculateStabilityScore(board: Player[][]): number {
    let score = 0;
    const opponent = this.#getOpponent(this.#player);

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === this.#player && this.isStable(board, row, col, this.#player)) {
          score += 1;
        } else if (board[row][col] === opponent && this.isStable(board, row, col, opponent)) {
          score -= 1;
        }
      }
    }

    return score;
  }

  private isStable(board: Player[][], row: number, col: number, player: Player): boolean {
    // A piece is stable if it cannot be flipped
    // This is a simplified stability check - a piece is stable if it's on an edge or corner
    // and surrounded by the same color pieces
    return (row === 0 || row === 7 || col === 0 || col === 7) &&
           this.hasStableNeighbors(board, row, col, player);
  }

  private hasStableNeighbors(board: Player[][], row: number, col: number, player: Player): boolean {
    return AStarAI.#DIRECTIONS.every(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;
      
      return !(newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) ||
             board[newRow][newCol] === player || 
             board[newRow][newCol] === Player.EMPTY;
    });
  }

  private getValidMoves(board: Player[][], player: Player): Position[] {
    return Array.from({ length: 8 }, (_, row) =>
      Array.from({ length: 8 }, (_, col) => 
        this.isValidMove(board, row, col, player) ? { row, col } : null
      ).filter((move): move is Position => move !== null)
    ).flat();
  }

  private isValidMove(board: Player[][], row: number, col: number, player: Player): boolean {
    if (row < 0 || row >= 8 || col < 0 || col >= 8 || board[row][col] !== Player.EMPTY) {
      return false;
    }

    return AStarAI.#DIRECTIONS.some(([dr, dc]) => 
      this.canFlipInDirection(board, row, col, dr, dc, player)
    );
  }

  private canFlipInDirection(board: Player[][], row: number, col: number, dr: number, dc: number, player: Player): boolean {
    let r = row + dr;
    let c = col + dc;
    let hasOpponentPieces = false;

    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      if (board[r][c] === Player.EMPTY) {
        return false;
      }
      
      if (board[r][c] === player) {
        return hasOpponentPieces;
      }
      
      hasOpponentPieces = true;
      r += dr;
      c += dc;
    }

    return false;
  }

  private simulateMove(board: Player[][], row: number, col: number, player: Player): Player[][] {
    const newBoard = board.map(row => [...row]);
    
    if (!this.isValidMove(newBoard, row, col, player)) {
      return newBoard;
    }

    newBoard[row][col] = player;

    AStarAI.#DIRECTIONS.forEach(([dr, dc]) => {
      if (this.canFlipInDirection(newBoard, row, col, dr, dc, player)) {
        this.flipInDirection(newBoard, row, col, dr, dc, player);
      }
    });

    return newBoard;
  }

  private flipInDirection(board: Player[][], row: number, col: number, dr: number, dc: number, player: Player): void {
    let r = row + dr;
    let c = col + dc;

    while (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] !== player) {
      board[r][c] = player;
      r += dr;
      c += dc;
    }
  }

  #getOpponent = (player: Player): Player => 
    player === Player.BLACK ? Player.WHITE : Player.BLACK;

  #isGameOver(board: Player[][]): boolean {
    const blackMoves = this.getValidMoves(board, Player.BLACK);
    const whiteMoves = this.getValidMoves(board, Player.WHITE);
    return blackMoves.length === 0 && whiteMoves.length === 0;
  }

  public setDifficulty(difficulty: Difficulty): void {
    this.#maxDepth = difficulty;
  }
}
