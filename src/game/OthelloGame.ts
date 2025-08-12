export enum Player {
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

export class OthelloGame {
  private board: Player[][];
  private currentPlayer: Player;
  private gameOver: boolean;
  private winner: Player | null;

  constructor() {
    this.board = this.initializeBoard();
    this.currentPlayer = Player.BLACK;
    this.gameOver = false;
    this.winner = null;
  }

  private initializeBoard(): Player[][] {
    const board: Player[][] = Array(8).fill(null).map(() => Array(8).fill(Player.EMPTY));
    
    // Initial setup: black at d5/e4, white at d4/e5
    board[3][3] = Player.WHITE;
    board[3][4] = Player.BLACK;
    board[4][3] = Player.BLACK;
    board[4][4] = Player.WHITE;
    
    return board;
  }

  public getGameState(): GameState {
    const { blackCount, whiteCount } = this.countPieces();
    return {
      board: this.board.map(row => [...row]), // Deep copy
      currentPlayer: this.currentPlayer,
      blackCount,
      whiteCount,
      gameOver: this.gameOver,
      winner: this.winner,
      validMoves: this.getValidMoves(this.currentPlayer)
    };
  }

  public makeMove(row: number, col: number): boolean {
    if (this.gameOver || !this.isValidMove(row, col, this.currentPlayer)) {
      return false;
    }

    // Place the piece
    this.board[row][col] = this.currentPlayer;

    // Flip pieces
    this.flipPieces(row, col, this.currentPlayer);

    // Switch player
    this.switchPlayer();

    // Check if game is over
    this.checkGameOver();

    return true;
  }

  public isValidMove(row: number, col: number, player: Player): boolean {
    if (row < 0 || row >= 8 || col < 0 || col >= 8 || this.board[row][col] !== Player.EMPTY) {
      return false;
    }

    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dr, dc] of directions) {
      if (this.canFlipInDirection(row, col, dr, dc, player)) {
        return true;
      }
    }

    return false;
  }

  private canFlipInDirection(row: number, col: number, dr: number, dc: number, player: Player): boolean {
    let r = row + dr;
    let c = col + dc;
    let hasOpponentPieces = false;

    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      if (this.board[r][c] === Player.EMPTY) {
        return false;
      }
      
      if (this.board[r][c] === player) {
        return hasOpponentPieces;
      }
      
      hasOpponentPieces = true;
      r += dr;
      c += dc;
    }

    return false;
  }

  private flipPieces(row: number, col: number, player: Player): void {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dr, dc] of directions) {
      if (this.canFlipInDirection(row, col, dr, dc, player)) {
        this.flipInDirection(row, col, dr, dc, player);
      }
    }
  }

  private flipInDirection(row: number, col: number, dr: number, dc: number, player: Player): void {
    let r = row + dr;
    let c = col + dc;

    while (r >= 0 && r < 8 && c >= 0 && c < 8 && this.board[r][c] !== player) {
      this.board[r][c] = player;
      r += dr;
      c += dc;
    }
  }

  public getValidMoves(player: Player): Position[] {
    const moves: Position[] = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.isValidMove(row, col, player)) {
          moves.push({ row, col });
        }
      }
    }
    
    return moves;
  }

  private switchPlayer(): void {
    const nextPlayer = this.currentPlayer === Player.BLACK ? Player.WHITE : Player.BLACK;
    const nextPlayerMoves = this.getValidMoves(nextPlayer);
    
    if (nextPlayerMoves.length > 0) {
      this.currentPlayer = nextPlayer;
    } else {
      // If next player has no moves, check if current player has moves
      const currentPlayerMoves = this.getValidMoves(this.currentPlayer);
      if (currentPlayerMoves.length === 0) {
        // Neither player can move - game over
        this.gameOver = true;
      }
      // If current player still has moves, they continue playing
    }
  }

  private checkGameOver(): void {
    const blackMoves = this.getValidMoves(Player.BLACK);
    const whiteMoves = this.getValidMoves(Player.WHITE);
    
    if (blackMoves.length === 0 && whiteMoves.length === 0) {
      this.gameOver = true;
      const { blackCount, whiteCount } = this.countPieces();
      
      if (blackCount > whiteCount) {
        this.winner = Player.BLACK;
      } else if (whiteCount > blackCount) {
        this.winner = Player.WHITE;
      } else {
        this.winner = null; // Tie
      }
    }
  }

  private countPieces(): { blackCount: number; whiteCount: number } {
    let blackCount = 0;
    let whiteCount = 0;
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.board[row][col] === Player.BLACK) {
          blackCount++;
        } else if (this.board[row][col] === Player.WHITE) {
          whiteCount++;
        }
      }
    }
    
    return { blackCount, whiteCount };
  }

  public resetGame(): void {
    this.board = this.initializeBoard();
    this.currentPlayer = Player.BLACK;
    this.gameOver = false;
    this.winner = null;
  }

  public getBoardCopy(): Player[][] {
    return this.board.map(row => [...row]);
  }

  public simulateMove(row: number, col: number, player: Player): Player[][] {
    if (!this.isValidMove(row, col, player)) {
      return this.getBoardCopy();
    }

    const boardCopy = this.getBoardCopy();
    boardCopy[row][col] = player;

    // Simulate flipping pieces
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dr, dc] of directions) {
      if (this.canFlipInDirectionOnBoard(boardCopy, row, col, dr, dc, player)) {
        this.flipInDirectionOnBoard(boardCopy, row, col, dr, dc, player);
      }
    }

    return boardCopy;
  }

  private canFlipInDirectionOnBoard(board: Player[][], row: number, col: number, dr: number, dc: number, player: Player): boolean {
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

  private flipInDirectionOnBoard(board: Player[][], row: number, col: number, dr: number, dc: number, player: Player): void {
    let r = row + dr;
    let c = col + dc;

    while (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] !== player) {
      board[r][c] = player;
      r += dr;
      c += dc;
    }
  }
}
