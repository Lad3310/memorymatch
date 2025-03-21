/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import useSound from 'use-sound';
import { GameState, Theme, Difficulty, Card as CardType, HighScore, LEVEL_CONFIGS, THEME_ITEMS } from '../types';
import { generateCards, calculateScore, checkMatch, isLevelComplete, getNextDifficulty } from '../utils/gameUtils';
import { formatTime } from '../utils/timeUtils';
import { Achievement, ACHIEVEMENTS } from '../types/achievements';
import Achievements from './Achievements';
import {
  GameContainer,
  GameGrid,
  Card as StyledCard,
  Button,
  StatsContainer,
  StatItem,
  ThemeSelector,
  CelebrationOverlay,
  CelebrationContent,
  StartButton
} from '../styles/GameStyles';
import HighScores from './HighScores';
import Login from './Login';
import styled from 'styled-components';
/* eslint-enable @typescript-eslint/no-unused-vars */

const INITIAL_STATE: GameState = {
  level: 1,
  difficulty: 'easy',
  theme: 'animals',
  cards: [],
  flippedCards: [],
  score: 0,
  cumulativeScore: 0,
  elapsedTime: 0,
  isGameComplete: false,
  isGameOver: false,
  isMuted: false,
  totalTime: 0,
  hasStarted: false,
  playerName: '',
  hasAnyMistakes: false  // Track if any mistakes were made in the current level
};

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  width: 100%;
`;

const GameTitle = styled.h1`
  color: #9C27B0;
  margin: 0;
  font-size: 2.2rem;
`;

const PlayerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const PlayerName = styled.span`
  color: #9C27B0;
  font-weight: bold;
  font-size: 1.2rem;
  background: rgba(156, 39, 176, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const getGridColumns = (cardCount: number): number => {
  if (cardCount <= 12) return 4;  // 3x4 grid for easy (12 cards)
  if (cardCount <= 16) return 4;  // 4x4 grid for medium (16 cards)
  return 6;  // 6x4 grid for hard (24 cards)
};

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [showHighScores, setShowHighScores] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [completedThemes, setCompletedThemes] = useState<Set<Theme>>(new Set());
  const [playFlip] = useSound('/sounds/flip.mp3', { 
    volume: 0.5,
    soundEnabled: !gameState.isMuted 
  });
  const [playMatch] = useSound('/sounds/match.mp3');
  const [playNoMatch] = useSound('/sounds/no-match.mp3');
  const [playComplete] = useSound('/sounds/complete.mp3');
  const [playGameOver] = useSound('/sounds/game-over.mp3');

  // Load high scores only
  useEffect(() => {
    const savedScores = localStorage.getItem('memoryMatchHighScores');
    if (savedScores) {
      setHighScores(JSON.parse(savedScores));
    }
  }, []); // Empty dependency array

  // Handle sound loading errors
  useEffect(() => {
    const preloadSounds = async () => {
      try {
        const soundFiles = ['flip.mp3', 'match.mp3', 'complete.mp3', 'gameover.mp3'];
        await Promise.all(
          soundFiles.map(file => {
            return new Promise((resolve, reject) => {
              const audio = new Audio(`/sounds/${file}`);
              audio.addEventListener('canplaythrough', resolve);
              audio.addEventListener('error', reject);
            });
          })
        );
      } catch (error) {
        console.warn('Some sound files failed to load:', error);
      }
    };
    preloadSounds();
  }, []);

  // Load achievements from localStorage
  useEffect(() => {
    const savedAchievements = localStorage.getItem('memoryMatchAchievements');
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }
  }, []);

  // Save achievements to localStorage when they change
  useEffect(() => {
    localStorage.setItem('memoryMatchAchievements', JSON.stringify(achievements));
  }, [achievements]);

  const saveHighScore = useCallback((score: number, maxLevel: number, timeRemaining: number) => {
    const newScore: HighScore = {
      id: Date.now().toString(),
      playerName: gameState.playerName,
      score,
      maxLevel: maxLevel,
      timeRemaining: Math.max(0, timeRemaining),
      date: new Date().toLocaleDateString(),
      difficulty: gameState.difficulty,
      theme: gameState.theme
    };

    const newScores = [...highScores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    setHighScores(newScores);
    localStorage.setItem('memoryMatchHighScores', JSON.stringify(newScores));
  }, [gameState.playerName, gameState.difficulty, gameState.theme, highScores]);

  const handleGameOver = useCallback(() => {
    if (!gameState.isMuted) {
      playGameOver();
    }

    const timeBonus = Math.max(0, gameState.totalTime - gameState.elapsedTime);
    const finalScore = calculateScore(gameState.score, timeBonus, gameState.difficulty);
    
    // Save the cumulative score instead of just the current level score
    saveHighScore(
      gameState.cumulativeScore + finalScore,  // Include both current level score and cumulative score
      gameState.level,
      timeBonus
    );

    setGameState(prev => ({
      ...prev,
      isGameOver: true,
      cumulativeScore: prev.cumulativeScore + finalScore  // Update cumulative score
    }));
  }, [
    gameState.isMuted,
    gameState.totalTime,
    gameState.elapsedTime,
    gameState.score,
    gameState.difficulty,
    gameState.cumulativeScore,
    gameState.level,
    playGameOver,
    saveHighScore
  ]);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!gameState.isGameComplete && !gameState.isGameOver && gameState.hasStarted) {
      timer = setInterval(() => {
        setGameState(prev => {
          const newElapsedTime = prev.elapsedTime + 1;
          if (newElapsedTime >= prev.totalTime) {
            handleGameOver();  // Call handleGameOver when time runs out
            return {
              ...prev,
              elapsedTime: prev.totalTime,
            };
          }
          return {
            ...prev,
            elapsedTime: newElapsedTime,
          };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState.isGameComplete, gameState.isGameOver, gameState.hasStarted, gameState.isMuted, playGameOver, handleGameOver]);

  const handleLogin = (playerName: string) => {
    setGameState(prev => ({
      ...prev,
      playerName
    }));
  };

  const handleThemeChange = (theme: Theme) => {
    const newCards = generateCards(LEVEL_CONFIGS[gameState.level].pairs, theme);
    setGameState(prev => ({
      ...prev,
      theme,
      cards: newCards,
      flippedCards: [],
      score: 0,
      elapsedTime: 0,
      isGameComplete: false,
      isGameOver: false,
      hasStarted: false
    }));
  };

  const toggleMute = () => {
    setGameState(prev => ({
      ...prev,
      isMuted: !prev.isMuted,
    }));
  };

  const startGame = () => {
    const newCards = generateCards(LEVEL_CONFIGS[gameState.level].pairs, gameState.theme);
    
    setGameState(prev => ({
      ...prev,
      hasStarted: true,
      cards: newCards,
      flippedCards: [],
      score: 0,
      elapsedTime: 0,
      isGameComplete: false,
      isGameOver: false,
      totalTime: LEVEL_CONFIGS[gameState.level].timeLimit
    }));
  };

  const restartGame = () => {
    setGameState(prev => ({
      ...INITIAL_STATE,
      playerName: prev.playerName,  // Preserve the player name
      theme: prev.theme,  // Preserve the theme
      isMuted: prev.isMuted  // Preserve mute setting
    }));
  };

  const toggleHighScores = () => {
    if (showHighScores) {
      // If we're currently showing high scores and going back to game
      setShowHighScores(false);
      // Only reinitialize if the game is over or complete
      if (gameState.isGameOver || gameState.isGameComplete) {
        setGameState(INITIAL_STATE);
      }
    } else {
      // Going to high scores view
      setShowHighScores(true);
    }
  };

  const handleGameComplete = () => {
    const currentConfig = LEVEL_CONFIGS[gameState.level];
    if (!currentConfig) return;

    const timeBonus = Math.max(0, currentConfig.timeLimit - gameState.elapsedTime);
    const levelScore = calculateScore(
      gameState.score * 2,
      timeBonus,
      currentConfig.difficulty
    );
    const newCumulativeScore = gameState.cumulativeScore + levelScore;

    if (!gameState.isMuted) {
      playComplete();
    }

    // Check if there's a next level
    const nextLevel = gameState.level + 1;
    const nextConfig = LEVEL_CONFIGS[nextLevel];

    if (nextConfig) {
      // Move to next level
      const nextLevelCards = generateCards(nextConfig.pairs, gameState.theme);
      setGameState(prev => ({
        ...prev,
        level: nextLevel,
        difficulty: nextConfig.difficulty,
        cumulativeScore: newCumulativeScore,
        isGameComplete: false,
        hasStarted: false,
        cards: nextLevelCards,
        flippedCards: [],
        score: 0,
        elapsedTime: 0,
        totalTime: nextConfig.timeLimit
      }));
    } else {
      // Game is complete
      setGameState(prev => ({
        ...prev,
        isGameComplete: true,
        cumulativeScore: newCumulativeScore
      }));

      // Save high score
      saveHighScore(
        newCumulativeScore,
        gameState.level,
        currentConfig.timeLimit - gameState.elapsedTime
      );
    }
  };

  const updateAchievement = useCallback((id: string, progress: number, isComplete: boolean = false) => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.id === id) {
        const newProgress = isComplete ? achievement.requirement.value : progress;
        const isNewlyUnlocked = !achievement.isUnlocked && newProgress >= achievement.requirement.value;
        
        if (isNewlyUnlocked) {
          // Show achievement notification
          // TODO: Add achievement notification component
          console.log(`Achievement Unlocked: ${achievement.name}!`);
        }

        return {
          ...achievement,
          progress: newProgress,
          isUnlocked: achievement.isUnlocked || newProgress >= achievement.requirement.value
        };
      }
      return achievement;
    }));
  }, []);

  // Check for achievements after successful matches
  const checkAchievements = useCallback(() => {
    // Perfect Memory achievement
    if (!gameState.hasAnyMistakes) {
      updateAchievement('perfect_memory', 1, true);
    }

    // Speed Demon achievement
    if (gameState.elapsedTime <= 30) {
      updateAchievement('speed_demon', 1, true);
    }

    // Match Master achievement
    updateAchievement('match_master', currentStreak);

    // Theme Explorer achievement
    if (gameState.isGameComplete) {
      const newCompletedThemes = new Set(completedThemes).add(gameState.theme);
      setCompletedThemes(newCompletedThemes);
      updateAchievement('theme_explorer', newCompletedThemes.size);
    }

    // High Scorer achievement
    updateAchievement('high_scorer', gameState.cumulativeScore);
  }, [gameState, currentStreak, completedThemes, updateAchievement]);

  // Update handleCardClick to track streaks and mistakes
  const handleCardClick = (clickedCard: CardType) => {
    // Prevent clicking if game hasn't started
    if (!gameState.hasStarted) {
      return;
    }

    if (
      clickedCard.isFlipped ||
      clickedCard.isMatched ||
      gameState.flippedCards.length >= 2
    ) {
      return;
    }

    if (!gameState.isMuted) {
      playFlip();
    }

    const newCards = gameState.cards.map(card =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );

    const newFlippedCards = [...gameState.flippedCards, clickedCard.id];

    setGameState(prev => ({
      ...prev,
      cards: newCards,
      flippedCards: newFlippedCards,
    }));

    if (newFlippedCards.length === 2) {
      setTimeout(() => {
        const [firstId, secondId] = newFlippedCards;
        const firstCard = gameState.cards.find(card => card.id === firstId);
        const secondCard = gameState.cards.find(card => card.id === secondId);
        
        const isMatch = firstCard && secondCard && firstCard.value === secondCard.value;
        
        if (isMatch) {
          if (!gameState.isMuted) {
            playMatch();
          }
          
          setCurrentStreak(prev => prev + 1);
          
          const updatedCards = gameState.cards.map(card =>
            card.id === firstId || card.id === secondId
              ? { ...card, isMatched: true, isFlipped: true }
              : card
          );

          setGameState(prev => ({
            ...prev,
            cards: updatedCards,
            flippedCards: [],
            score: prev.score + 1,
            hasAnyMistakes: prev.hasAnyMistakes
          }));

          checkAchievements();

          // Check if all cards are matched
          if (updatedCards.every(card => card.isMatched)) {
            setTimeout(() => handleGameComplete(), 500);
          }
        } else {
          if (!gameState.isMuted) {
            playNoMatch();
          }
          
          setCurrentStreak(0);
          
          const updatedCards = gameState.cards.map(card =>
            card.id === firstId || card.id === secondId
              ? { ...card, isFlipped: false }
              : card
          );

          setGameState(prev => ({
            ...prev,
            cards: updatedCards,
            flippedCards: [],
            hasAnyMistakes: true
          }));
        }
      }, 1000);
    }
  };

  return (
    <GameContainer>
      {!gameState.playerName ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <HeaderContainer>
            <GameTitle>Memory Match Game</GameTitle>
            <PlayerInfo>
              <PlayerName>Player: {gameState.playerName}</PlayerName>
              <Controls>
                <Button onClick={() => setShowAchievements(true)}>
                  🏆 Achievements
                </Button>
                <Button onClick={toggleHighScores}>
                  {showHighScores ? 'Back to Game' : 'Show High Scores'}
                </Button>
                <Button onClick={toggleMute}>
                  {gameState.isMuted ? '🔇 Unmute' : '🔊 Mute'}
                </Button>
                <Button onClick={restartGame}>
                  Restart Game
                </Button>
              </Controls>
            </PlayerInfo>
          </HeaderContainer>

          {showAchievements && (
            <Achievements 
              achievements={achievements}
              onClose={() => setShowAchievements(false)}
            />
          )}

          {showHighScores ? (
            <HighScores scores={highScores} onBack={() => setShowHighScores(false)} />
          ) : (
            <>
              <StatsContainer>
                <StatItem>Level: {gameState.level}</StatItem>
                <StatItem>Time: {formatTime(gameState.totalTime - gameState.elapsedTime)}</StatItem>
                <StatItem>Score: {gameState.cumulativeScore}</StatItem>
                <StatItem>
                  Matches: {gameState.cards.filter(c => c.isMatched).length / 2} of {
                    LEVEL_CONFIGS[gameState.level]?.pairs || 0
                  }
                </StatItem>
              </StatsContainer>

              {!gameState.hasStarted && !gameState.isGameComplete && !gameState.isGameOver && (
                <StartButton onClick={startGame}>
                  Start Game
                </StartButton>
              )}

              <ThemeSelector>
                <Button
                  onClick={() => handleThemeChange('animals')}
                  $disabled={gameState.hasStarted}
                  $selected={gameState.theme === 'animals'}
                >
                  Animals
                </Button>
                <Button
                  onClick={() => handleThemeChange('vehicles')}
                  $disabled={gameState.hasStarted}
                  $selected={gameState.theme === 'vehicles'}
                >
                  Vehicles
                </Button>
                <Button
                  onClick={() => handleThemeChange('food')}
                  $disabled={gameState.hasStarted}
                  $selected={gameState.theme === 'food'}
                >
                  Food
                </Button>
                <Button
                  onClick={() => handleThemeChange('big10')}
                  $disabled={gameState.hasStarted}
                  $selected={gameState.theme === 'big10'}
                >
                  Big 10
                </Button>
              </ThemeSelector>

              <GameGrid columns={getGridColumns(gameState.cards.length)}>
                {gameState.cards.map(card => (
                  <StyledCard
                    key={card.id}
                    $isFlipped={card.isFlipped}
                    $isMatched={card.isMatched}
                    onClick={() => handleCardClick(card)}
                  >
                    <div>
                      <div></div>
                      <div>
                        {gameState.theme === 'big10' ? (
                          <>
                            {card.value.split('\n')[0].split(' (')[0]}
                            {card.value.split('\n')[1].includes(':ohio-state') ? (
                              <em className="ohio-state-o">O</em>
                            ) : (
                              <em>{card.value.split('\n')[1].split(' ')[0]}</em>
                            )}
                            <strong>{card.value.split('\n')[1].split(' ').slice(-1)[0]}</strong>
                          </>
                        ) : (
                          <em className="emoji">{card.value}</em>
                        )}
                      </div>
                    </div>
                  </StyledCard>
                ))}
              </GameGrid>

              {(gameState.isGameComplete || gameState.isGameOver) && (
                <CelebrationOverlay>
                  <CelebrationContent>
                    <h2>{gameState.isGameComplete ? 'Congratulations!' : 'Time\'s Up!'}</h2>
                    <p>Final Score: {gameState.cumulativeScore}</p>
                    <p>Highest Level: {gameState.level}</p>
                    <Button onClick={restartGame}>Play Again</Button>
                  </CelebrationContent>
                </CelebrationOverlay>
              )}
            </>
          )}
        </>
      )}
    </GameContainer>
  );
};

export default Game; 