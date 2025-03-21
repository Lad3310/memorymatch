export type Difficulty = 'easy' | 'medium' | 'hard';
export type Theme = 'animals' | 'vehicles' | 'food' | 'big10';

export interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface HighScore {
  id: string;
  playerName: string;
  score: number;
  maxLevel: number;  // Highest level reached
  timeRemaining: number;
  date: string;
  difficulty: Difficulty;
  theme: Theme;
}

export interface GameState {
  level: number;
  difficulty: Difficulty;
  theme: Theme;
  cards: Card[];
  flippedCards: number[];
  score: number;
  cumulativeScore: number;  // Total score across all levels
  elapsedTime: number;
  isGameComplete: boolean;
  isGameOver: boolean;
  isMuted: boolean;
  totalTime: number;
  hasStarted: boolean;
  playerName: string;
  hasAnyMistakes: boolean;  // Track if any mistakes were made in the current level
}

export interface LevelConfig {
  timeLimit: number;
  pairs: number;
  difficulty: Difficulty;
}

export const THEME_ITEMS: Record<Theme, string[]> = {
  animals: [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', 
    '🐷', '🐸', '🦒', '🦘', '🦬', '🦃'
  ],
  vehicles: [
    '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚',
    '🚛', '🚜', '✈️', '🚁', '🚂', '🚢'
  ],
  food: [
    '🍕', '🍔', '🌮', '🍣', '🍜', '🍩', '🍦', '🍰', '🥐', '🍪', '☕️', '🧃',
    '🍺', '🥤', '🥨', '🥖', '🥩', '🍗'
  ],
  big10: [
    'Ohio State (Scarlet & Gray)\nO:ohio-state OSU',
    'Michigan (Maize & Blue)\n🐺 UM',
    'Penn State (Navy & White)\n🦁 PSU',
    'Michigan State (Green & White)\n⚔️ MSU',
    'Wisconsin (Cardinal & White)\n🦡 UW',
    'Iowa (Black & Gold)\n🦅 UI',
    'Minnesota (Maroon & Gold)\n🦫 UM',
    'Illinois (Orange & Blue)\n🛡️ UI',
    'Indiana (Crimson)\n🏃 IU',
    'Purdue (Old Gold & Black)\n🚂 PU',
    'Northwestern (Purple)\n🐱 NU',
    'Nebraska (Scarlet & Cream)\n🌾 UN',
    'Maryland (Red, White, Black & Gold)\n🐢 UM',
    'Rutgers (Scarlet)\n⚔️ RU',
    'Oregon (Green & Yellow)\n🦆 UO',
    'USC (Cardinal & Gold)\n⚔️ USC',
    'UCLA (Blue & Gold)\n🐻 UCLA',
    'Washington (Purple & Gold)\n🐺 UW'
  ]
};

export const LEVEL_CONFIGS: Record<number, LevelConfig> = {
  1: {
    timeLimit: 60,
    pairs: 6,
    difficulty: 'easy'
  },
  2: {
    timeLimit: 90,
    pairs: 8,
    difficulty: 'medium'
  },
  3: {
    timeLimit: 120,
    pairs: 12,
    difficulty: 'hard'
  }
}; 