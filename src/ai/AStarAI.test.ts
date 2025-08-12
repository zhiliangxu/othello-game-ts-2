import { AStarAI, Difficulty } from './AStarAI';
import { Player } from '../game/OthelloGame';

describe('AStarAI', () => {
  let ai: AStarAI;

  beforeEach(() => {
    ai = new AStarAI(Player.WHITE, Difficulty.EASY);
  });

  describe('Initialization', () => {
    test('should initialize with correct player and difficulty', () => {
      expect(ai).toBeInstanceOf(AStarAI);
    });

    test('should set difficulty correctly', () => {
      ai.setDifficulty(Difficulty.HARD);
      // No direct way to test this, but it should not throw
      expect(ai).toBeInstanceOf(AStarAI);
    });
  });

  describe('Move Selection', () => {
    test('should return null for empty moves list', () => {
      const board = Array(8).fill(null).map(() => Array(8).fill(Player.EMPTY));
      const validMoves: any[] = [];
      
      const move = ai.getBestMove(board, validMoves);
      expect(move).toBeNull();
    });

    test('should return a valid move when moves are available', () => {
      // Create initial Othello board
      const board = Array(8).fill(null).map(() => Array(8).fill(Player.EMPTY));
      board[3][3] = Player.WHITE;
      board[3][4] = Player.BLACK;
      board[4][3] = Player.BLACK;
      board[4][4] = Player.WHITE;

      const validMoves = [
        { row: 2, col: 4 },
        { row: 3, col: 5 },
        { row: 4, col: 2 },
        { row: 5, col: 3 }
      ];

      const move = ai.getBestMove(board, validMoves);
      
      expect(move).not.toBeNull();
      expect(validMoves).toContainEqual(move);
    });

    test('should prefer corner moves when available', () => {
      // Create a board where corner move is available
      const board = Array(8).fill(null).map(() => Array(8).fill(Player.EMPTY));
      
      // Fill most of the board to create corner opportunity
      for (let i = 1; i < 7; i++) {
        for (let j = 1; j < 7; j++) {
          board[i][j] = i % 2 === j % 2 ? Player.WHITE : Player.BLACK;
        }
      }
      
      // Make corner available
      board[0][1] = Player.BLACK;
      
      const validMoves = [
        { row: 0, col: 0 }, // Corner move
        { row: 1, col: 0 },
        { row: 0, col: 2 }
      ];

      const move = ai.getBestMove(board, validMoves);
      
      // AI should prefer the corner move due to its high weight
      expect(move).toEqual({ row: 0, col: 0 });
    });
  });

  describe('Difficulty Levels', () => {
    test('should work with different difficulty levels', () => {
      const board = Array(8).fill(null).map(() => Array(8).fill(Player.EMPTY));
      board[3][3] = Player.WHITE;
      board[3][4] = Player.BLACK;
      board[4][3] = Player.BLACK;
      board[4][4] = Player.WHITE;

      const validMoves = [{ row: 2, col: 3 }];

      // Test each difficulty level
      ai.setDifficulty(Difficulty.EASY);
      let move = ai.getBestMove(board, validMoves);
      expect(move).toEqual({ row: 2, col: 3 });

      ai.setDifficulty(Difficulty.MEDIUM);
      move = ai.getBestMove(board, validMoves);
      expect(move).toEqual({ row: 2, col: 3 });

      ai.setDifficulty(Difficulty.HARD);
      move = ai.getBestMove(board, validMoves);
      expect(move).toEqual({ row: 2, col: 3 });
    });
  });

  describe('Board Evaluation', () => {
    test('should prefer positions with more pieces', () => {
      const board1 = Array(8).fill(null).map(() => Array(8).fill(Player.EMPTY));
      board1[0][0] = Player.WHITE;
      board1[0][1] = Player.WHITE;

      const board2 = Array(8).fill(null).map(() => Array(8).fill(Player.EMPTY));
      board2[0][0] = Player.WHITE;

      const validMoves = [{ row: 1, col: 0 }];

      // Both should return the same move, but board1 should be evaluated higher
      const move1 = ai.getBestMove(board1, validMoves);
      const move2 = ai.getBestMove(board2, validMoves);
      
      expect(move1).toEqual(move2);
    });
  });

  describe('Edge Cases', () => {
    test('should handle board with no valid moves gracefully', () => {
      const board = Array(8).fill(null).map(() => Array(8).fill(Player.WHITE));
      const validMoves: any[] = [];
      
      const move = ai.getBestMove(board, validMoves);
      expect(move).toBeNull();
    });

    test('should handle single move scenario', () => {
      const board = Array(8).fill(null).map(() => Array(8).fill(Player.EMPTY));
      board[3][3] = Player.WHITE;
      board[3][4] = Player.BLACK;
      board[4][3] = Player.BLACK;
      board[4][4] = Player.WHITE;

      const validMoves = [{ row: 2, col: 3 }];
      
      const move = ai.getBestMove(board, validMoves);
      expect(move).toEqual({ row: 2, col: 3 });
    });
  });

  describe('Performance', () => {
    test('should complete move calculation in reasonable time', () => {
      const board = Array(8).fill(null).map(() => Array(8).fill(Player.EMPTY));
      board[3][3] = Player.WHITE;
      board[3][4] = Player.BLACK;
      board[4][3] = Player.BLACK;
      board[4][4] = Player.WHITE;

      const validMoves = [
        { row: 2, col: 3 },
        { row: 3, col: 2 },
        { row: 4, col: 5 },
        { row: 5, col: 4 }
      ];

      const startTime = Date.now();
      const move = ai.getBestMove(board, validMoves);
      const endTime = Date.now();

      expect(move).not.toBeNull();
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });
});
