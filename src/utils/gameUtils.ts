import { Card, Theme, Difficulty, THEME_ITEMS } from '../types';

export const generateCards = (pairCount: number, theme: Theme): Card[] => {
  const items = THEME_ITEMS[theme];
  const selectedItems = items.slice(0, pairCount);
  
  const pairs = [...selectedItems, ...selectedItems];
  const shuffled = pairs
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false,
    }));

  return shuffled;
};

export const checkMatch = (cards: Card[], flippedCards: number[]): boolean => {
  if (flippedCards.length !== 2) return false;
  
  const [first, second] = flippedCards;
  return cards[first].value === cards[second].value;
};

export const calculateScore = (
  matches: number,
  timeRemaining: number,
  difficulty: Difficulty
): number => {
  // Each match (pair) is worth 1 point
  return Math.floor(matches / 2);
};

export const isLevelComplete = (cards: Card[]): boolean => {
  return cards.every((card) => card.isMatched);
};

export const getNextDifficulty = (currentDifficulty: Difficulty): Difficulty | null => {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  const currentIndex = difficulties.indexOf(currentDifficulty);
  return currentIndex < difficulties.length - 1 ? difficulties[currentIndex + 1] : null;
}; 