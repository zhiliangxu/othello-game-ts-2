import { Player, Position } from '../game/OthelloGame';

export interface AIMove {
  row: number;
  col: number;
  score: number;
}

export enum Difficulty {
  EASY = 2,
  MEDIUM = 4,
  HARD = 6
}

export class AStarAI {
  private maxDepth: number;
  private player: Player;

  constructor(player: Player, difficulty: Difficulty = Difficulty.MEDIUM) {
    this.player = player;
    this.maxDepth = difficulty;
  }

  public getBestMove(board: Player[][], validMoves: Position[]): Position | null {
    if (validMoves.length === 0) {
      return null;
    }

    let bestMove: Position | null = null;
    let bestScore = -Infinity;

    for (const move of validMoves) {
      const score = this.minimax(
        this.simulateMove(board, move.row, move.col, this.player),
        this.maxDepth - 1,
        false,
        -Infinity,
        Infinity
      );

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  private minimax(
    board: Player[][],
    depth: number,
    isMaximizing: boolean,
    alpha: number,
    beta: number
  ): number {
    if (depth === 0 || this.isGameOver(board)) {
      return this.evaluateBoard(board);
    }

    const currentPlayer = isMaximizing ? this.player : this.getOpponent(this.player);
    const validMoves = this.getValidMoves(board, currentPlayer);

    if (validMoves.length === 0) {
      // No moves available, check if opponent can move
      const opponentMoves = this.getValidMoves(board, this.getOpponent(currentPlayer));
      if (opponentMoves.length === 0) {
        // Game over
        return this.evaluateBoard(board);
      } else {
        // Pass turn to opponent
        return this.minimax(board, depth - 1, !isMaximizing, alpha, beta);
      }
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of validMoves) {
        const newBoard = this.simulateMove(board, move.row, move.col, currentPlayer);
        const evaluation = this.minimax(newBoard, depth - 1, false, alpha, beta);
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) {
          break; // Alpha-beta pruning
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of validMoves) {
        const newBoard = this.simulateMove(board, move.row, move.col, currentPlayer);
        const evaluation = this.minimax(newBoard, depth - 1, true, alpha, beta);
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) {
          break; // Alpha-beta pruning
        }
      }
      return minEval;
    }
  }

  private evaluateBoard(board: Player[][]): number {
    let score = 0;

    // Piece count
    const pieceScore = this.calculatePieceScore(board);
    
    // Corner control
    const cornerScore = this.calculateCornerScore(board);
    
    // Edge control
    const edgeScore = this.calculateEdgeScore(board);
    
    // Mobility (valid moves)
    const mobilityScore = this.calculateMobilityScore(board);
    
    // Stability
    const stabilityScore = this.calculateStabilityScore(board);

    // Weighted combination
    score = pieceScore * 1 + 
            cornerScore * 25 + 
            edgeScore * 5 + 
            mobilityScore * 10 + 
            stabilityScore * 15;

    return score;
  }

  private calculatePieceScore(board: Player[][]): number {
    let myPieces = 0;
    let opponentPieces = 0;
    const opponent = this.getOpponent(this.player);

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === this.player) {
          myPieces++;
        } else if (board[row][col] === opponent) {
          opponentPieces++;
        }
      }
    }

    return myPieces - opponentPieces;
  }

  private calculateCornerScore(board: Player[][]): number {
    const corners = [[0, 0], [0, 7], [7, 0], [7, 7]];
    let score = 0;
    const opponent = this.getOpponent(this.player);

    for (const [row, col] of corners) {
      if (board[row][col] === this.player) {
        score += 1;
      } else if (board[row][col] === opponent) {
        score -= 1;
      }
    }

    return score;
  }

  private calculateEdgeScore(board: Player[][]): number {
    let score = 0;
    const opponent = this.getOpponent(this.player);

    // Top and bottom edges
    for (let col = 0; col < 8; col++) {
      if (board[0][col] === this.player) score += 1;
      if (board[0][col] === opponent) score -= 1;
      if (board[7][col] === this.player) score += 1;
      if (board[7][col] === opponent) score -= 1;
    }

    // Left and right edges
    for (let row = 0; row < 8; row++) {
      if (board[row][0] === this.player) score += 1;
      if (board[row][0] === opponent) score -= 1;
      if (board[row][7] === this.player) score += 1;
      if (board[row][7] === opponent) score -= 1;
    }

    return score;
  }

  private calculateMobilityScore(board: Player[][]): number {
    const myMoves = this.getValidMoves(board, this.player).length;
    const opponentMoves = this.getValidMoves(board, this.getOpponent(this.player)).length;
    
    return myMoves - opponentMoves;
  }

  private calculateStabilityScore(board: Player[][]): number {
    let score = 0;
    const opponent = this.getOpponent(this.player);

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === this.player && this.isStable(board, row, col, this.player)) {
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
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        if (board[newRow][newCol] !== player && board[newRow][newCol] !== Player.EMPTY) {
          return false;
        }
      }
    }

    return true;
  }

  private getValidMoves(board: Player[][], player: Player): Position[] {
    const moves: Position[] = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.isValidMove(board, row, col, player)) {
          moves.push({ row, col });
        }
      }
    }
    
    return moves;
  }

  private isValidMove(board: Player[][], row: number, col: number, player: Player): boolean {
    if (row < 0 || row >= 8 || col < 0 || col >= 8 || board[row][col] !== Player.EMPTY) {
      return false;
    }

    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dr, dc] of directions) {
      if (this.canFlipInDirection(board, row, col, dr, dc, player)) {
        return true;
      }
    }

    return false;
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

    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dr, dc] of directions) {
      if (this.canFlipInDirection(newBoard, row, col, dr, dc, player)) {
        this.flipInDirection(newBoard, row, col, dr, dc, player);
      }
    }

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

  private getOpponent(player: Player): Player {
    return player === Player.BLACK ? Player.WHITE : Player.BLACK;
  }

  private isGameOver(board: Player[][]): boolean {
    const blackMoves = this.getValidMoves(board, Player.BLACK);
    const whiteMoves = this.getValidMoves(board, Player.WHITE);
    return blackMoves.length === 0 && whiteMoves.length === 0;
  }

  public setDifficulty(difficulty: Difficulty): void {
    this.maxDepth = difficulty;
  }
}
