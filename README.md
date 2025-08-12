# Othello Game - TypeScript React Implementation

A fully featured web-based Othello (Reversi) game built with TypeScript, React, and Bootstrap. This implementation includes both human vs. human and human vs. computer game modes with three difficulty levels.

## Features

### Game Features
- ✅ **Complete Othello Game Logic**: Full implementation of standard Othello rules
- ✅ **Human vs Human Mode**: Two players can play on the same device
- ✅ **Human vs Computer Mode**: Play against AI with three difficulty levels
- ✅ **Visual Board**: Green 8x8 game board with black grid lines
- ✅ **Animated Piece Flips**: Smooth animations when pieces are flipped
- ✅ **Sound Effects**: Audio feedback for piece placement and game events
- ✅ **Score Display**: Real-time display of piece counts for both players
- ✅ **Game Over Detection**: Automatic win/loss/tie detection
- ✅ **New Game Functionality**: Restart game at any time

### Technical Features
- ✅ **Single Page Application**: No backend required
- ✅ **TypeScript**: Fully typed implementation
- ✅ **React**: Modern React with hooks
- ✅ **Bootstrap**: Responsive UI styling
- ✅ **Modular Architecture**: Clean separation of concerns
- ✅ **Custom A* AI**: Implemented from scratch with difficulty levels
- ✅ **Comprehensive Testing**: Extensive test coverage
- ✅ **Production Build**: Optimized for deployment

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd othello-game-ts-1
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode

## Game Rules

Othello is a strategy board game for two players, played on an 8×8 grid:

1. **Setup**: The game starts with four discs in the center - black at d5/e4, white at d4/e5
2. **Turns**: Players alternate placing discs of their color
3. **Capturing**: You must place a disc so it flanks opponent discs in a straight line
4. **Flipping**: All flanked opponent discs flip to your color
5. **Legal Moves**: You must flip at least one opponent disc; if no legal move exists, you pass
6. **End Game**: Game ends when neither player can move (usually when board is full)
7. **Winner**: The player with more discs of their color wins

## AI Difficulty Levels

- **Easy**: 2-level depth search - Good for beginners
- **Medium**: 4-level depth search - Balanced challenge
- **Hard**: 6-level depth search - Challenging gameplay

The AI uses an advanced evaluation function considering:
- Piece count
- Corner control (high value)
- Edge control
- Mobility (available moves)
- Piece stability

## Project Structure

```
src/
├── components/          # React components
│   ├── Cell.tsx        # Individual board cell
│   ├── GameBoard.tsx   # Game board grid
│   ├── GameControls.tsx # Game mode and difficulty controls
│   ├── GameStatus.tsx  # Current game status display
│   └── ScoreDisplay.tsx # Score and turn indicator
├── game/               # Core game logic
│   └── OthelloGame.ts  # Main game engine
├── ai/                 # Artificial intelligence
│   └── AStarAI.ts     # A* algorithm implementation
├── utils/              # Utility modules
│   └── SoundManager.ts # Audio management
├── styles/             # CSS styling
│   └── App.css        # Main stylesheet
├── App.tsx            # Main application component
└── index.tsx          # Application entry point
```

## Testing

The project includes comprehensive test suites for all core modules:

- **Game Logic Tests**: Validate move validation, piece flipping, and game rules
- **AI Tests**: Verify AI move selection and difficulty levels
- **Sound Manager Tests**: Test audio functionality and error handling

Run tests with:
```bash
npm test
```

## Building for Production

Create a production build:
```bash
npm run build
```

The optimized build will be created in the `dist/` directory, ready for deployment to any static web server.

## Browser Compatibility

- Modern browsers with ES2020 support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers supported through responsive design

## Technical Decisions

### Why A* for AI?
While A* is typically used for pathfinding, the minimax algorithm with alpha-beta pruning used here is more commonly referred to as "A* in game trees" in some literature. The implementation uses:
- Minimax with alpha-beta pruning
- Advanced position evaluation
- Configurable search depth for difficulty levels

### Sound Implementation
Uses Web Audio API for procedural sound generation, ensuring:
- No external audio files required
- Consistent cross-browser experience
- Graceful fallback when audio is unavailable

### State Management
React hooks provide clean state management:
- Game state isolated in the game engine
- UI state managed by React
- Clear separation between game logic and presentation

## Future Enhancements

Potential improvements for future versions:
- Online multiplayer support
- Game replay functionality
- Advanced AI personalities
- Tournament mode
- Save/load game state
- Accessibility improvements
- Mobile app version

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Play Online

[Othello Online](https://zhiliangxu.github.io/othello-game2)