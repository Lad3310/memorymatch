export type AchievementType = 'score' | 'time' | 'streak' | 'perfect' | 'matches' | 'theme';
export type RewardType = 'badge' | 'theme' | 'powerup';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji or icon class
  requirement: {
    type: AchievementType;
    value: number;
  };
  reward?: {
    type: RewardType;
    value: string;
  };
  isUnlocked: boolean;
  progress: number;
}

// Define all available achievements
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'perfect_memory',
    name: 'Perfect Memory',
    description: 'Complete a level without any mistakes',
    icon: '🎯',
    requirement: {
      type: 'perfect',
      value: 1
    },
    reward: {
      type: 'badge',
      value: 'perfect_memory_badge'
    },
    isUnlocked: false,
    progress: 0
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete a level in under 30 seconds',
    icon: '⚡',
    requirement: {
      type: 'time',
      value: 30
    },
    reward: {
      type: 'badge',
      value: 'speed_demon_badge'
    },
    isUnlocked: false,
    progress: 0
  },
  {
    id: 'match_master',
    name: 'Match Master',
    description: 'Make 5 matches in a row without mistakes',
    icon: '🔥',
    requirement: {
      type: 'streak',
      value: 5
    },
    reward: {
      type: 'badge',
      value: 'match_master_badge'
    },
    isUnlocked: false,
    progress: 0
  },
  {
    id: 'theme_explorer',
    name: 'Theme Explorer',
    description: 'Complete a level with each available theme',
    icon: '🎨',
    requirement: {
      type: 'theme',
      value: 4 // Number of available themes
    },
    reward: {
      type: 'theme',
      value: 'special_theme'
    },
    isUnlocked: false,
    progress: 0
  },
  {
    id: 'high_scorer',
    name: 'High Scorer',
    description: 'Reach a score of 1000 points',
    icon: '🏆',
    requirement: {
      type: 'score',
      value: 1000
    },
    reward: {
      type: 'badge',
      value: 'high_scorer_badge'
    },
    isUnlocked: false,
    progress: 0
  }
]; 