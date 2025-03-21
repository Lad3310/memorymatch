import styled from 'styled-components';

// Modern color palette
const colors = {
  primary: '#9C27B0', // Rich purple
  secondary: '#BA68C8', // Medium purple
  accent: '#7B1FA2', // Deep purple
  background: '#F3E5F5', // Light purple background
  text: '#4A4A4A', // Soft black
  cardBack: 'linear-gradient(135deg, #9C27B0, #7B1FA2)',
  cardFront: '#FFFFFF',
  overlay: 'rgba(156, 39, 176, 0.95)', // Purple overlay
};

export const GameContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  background-color: ${colors.background};
  min-height: 100vh;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

export const GameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px 25px;
  background: ${colors.cardFront};
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 1000px;
  margin: 0 auto 20px;

  h1 {
    color: ${colors.primary};
    font-size: 2.5rem;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

export const GameGrid = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
  gap: 15px;
  margin: 20px auto;
  max-width: 800px;
  padding: 20px;
`;

export const Card = styled.div<{ $isFlipped: boolean; $isMatched: boolean }>`
  aspect-ratio: 1;
  perspective: 1000px;
  cursor: pointer;
  
  & > div {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.6s;
    transform: ${props => props.$isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'};
  }

  & > div > div {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background: ${props => props.$isMatched ? '#4CAF50' : colors.cardBack};
    color: white;

    &:first-child {
      background: ${props => props.$isMatched ? '#4CAF50' : colors.cardBack};
    }

    &:last-child {
      background: white;
      transform: rotateY(180deg);
      color: ${colors.text};
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 1.2rem;

      em {
        font-style: normal;
        font-size: 2.5rem;
        margin: 5px 0;

        &.ohio-state-o {
          color: #BB0000;
          font-weight: 900;
        }

        &.emoji {
          font-size: 3rem;
        }
      }

      strong {
        font-size: 1.4rem;
        margin-top: 5px;
      }
    }
  }

  &:hover {
    transform: ${props => !props.$isFlipped && !props.$isMatched ? 'scale(1.05)' : 'none'};
    transition: transform 0.2s;
  }
`;

export const Button = styled.button<{ $disabled?: boolean; $selected?: boolean }>`
  background: ${props => {
    if (props.$disabled) return '#ccc';
    if (props.$selected) return '#7B1FA2'; // Darker purple for selected state
    return '#9C27B0'; // Default purple
  }};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.3s ease;
  opacity: ${props => props.$disabled ? 0.7 : 1};
  transform: ${props => props.$selected ? 'scale(1.1)' : 'none'};
  box-shadow: ${props => props.$selected ? '0 4px 15px rgba(123, 31, 162, 0.4)' : 'none'};
  border: ${props => props.$selected ? '2px solid #E1BEE7' : 'none'};
  position: relative;

  &:after {
    content: ${props => props.$selected ? '"✓"' : '""'};
    position: absolute;
    top: -8px;
    right: -8px;
    background: #4CAF50;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    opacity: ${props => props.$selected ? 1 : 0};
    transform: ${props => props.$selected ? 'scale(1)' : 'scale(0)'};
    transition: all 0.3s ease;
  }

  &:hover {
    background: ${props => {
      if (props.$disabled) return '#ccc';
      if (props.$selected) return '#7B1FA2';
      return '#8E24AA';
    }};
    transform: ${props => {
      if (props.$disabled) return 'none';
      if (props.$selected) return 'scale(1.1)';
      return 'translateY(-2px)';
    }};
  }
`;

export const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 20px auto;
  padding: 20px;
  background: ${colors.cardFront};
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 800px;
`;

export const StatItem = styled.div`
  color: ${colors.text};
  font-size: 1.1rem;
  font-weight: bold;
`;

export const ThemeSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px auto;
  padding: 15px;
  background: ${colors.cardFront};
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 800px;
`;

export const CelebrationOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${colors.overlay};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const CelebrationContent = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  
  h2 {
    color: ${colors.primary};
    margin-bottom: 20px;
  }

  p {
    color: ${colors.text};
    margin: 10px 0;
    font-size: 1.2rem;
  }
`;