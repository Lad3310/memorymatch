# Memory Match Game

A fun and challenging memory game built with React and TypeScript. Test your memory by matching pairs of cards across three difficulty levels with different themes.

## Features

- Three difficulty levels with increasing grid sizes
- Multiple themes (Animals, Vehicles, Letters, Numbers)
- Timer and scoring system
- Sound effects with mute option
- Responsive design
- Celebration animations
- Level progression system

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/memory-match.git
cd memory-match
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## How to Play

1. Select a theme (Animals, Vehicles, Letters, or Numbers)
2. Click on cards to flip them
3. Try to match pairs of cards
4. Complete all matches before the timer runs out
5. Progress through three difficulty levels:
   - Level 1: 12 cards (3x4 grid)
   - Level 2: 20 cards (4x5 grid)
   - Level 3: 28 cards (4x7 grid)

## Scoring

- Base score: 100 points per match
- Time bonus: 10 points per second remaining
- Difficulty multiplier:
  - Easy: 1x
  - Medium: 1.5x
  - Hard: 2x

## Technologies Used

- React
- TypeScript
- Styled Components
- use-sound (for sound effects)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 