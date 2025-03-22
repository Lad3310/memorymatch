import React from 'react';
import styled from 'styled-components';
import { LEVEL_CONFIGS } from '../types';

interface LevelSelectorProps {
  currentLevel: number;
  onLevelSelect: (level: number) => void;
  disabled: boolean;
}

const LevelSelectorContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 10px 0;
`;

const LevelButton = styled.button<{ $selected: boolean; $disabled: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  border: 2px solid #9C27B0;
  background-color: ${props => props.$selected ? '#9C27B0' : 'transparent'};
  color: ${props => props.$selected ? '#FFFFFF' : '#9C27B0'};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.6 : 1};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => !props.$disabled && (props.$selected ? '#7B1FA2' : 'rgba(156, 39, 176, 0.1)')};
  }
`;

const LevelSelector: React.FC<LevelSelectorProps> = ({ currentLevel, onLevelSelect, disabled }) => {
  return (
    <LevelSelectorContainer>
      {Object.keys(LEVEL_CONFIGS).map((level) => (
        <LevelButton
          key={level}
          onClick={() => !disabled && onLevelSelect(Number(level))}
          $selected={currentLevel === Number(level)}
          $disabled={disabled}
        >
          Level {level}
        </LevelButton>
      ))}
    </LevelSelectorContainer>
  );
};

export default LevelSelector; 