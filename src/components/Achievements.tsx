import React from 'react';
import styled from 'styled-components';
import { Achievement } from '../types/achievements';

const AchievementsOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const AchievementsContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 20px;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 5px;
  line-height: 1;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: #f0f0f0;
    color: #333;
  }
`;

const AchievementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const AchievementCard = styled.div<{ $isUnlocked: boolean }>`
  background: ${props => props.$isUnlocked ? '#E8F5E9' : '#F5F5F5'};
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
  opacity: ${props => props.$isUnlocked ? 1 : 0.7};

  &:hover {
    transform: translateY(-2px);
  }
`;

const AchievementIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const AchievementName = styled.h3`
  color: #333;
  margin: 0 0 5px 0;
`;

const AchievementDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 10px 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #E0E0E0;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 10px;
`;

const Progress = styled.div<{ $progress: number }>`
  width: ${props => Math.min(100, props.$progress)}%;
  height: 100%;
  background: #4CAF50;
  transition: width 0.3s ease;
`;

const Title = styled.h2`
  color: #9C27B0;
  text-align: center;
  margin-bottom: 20px;
  padding-right: 40px;
`;

interface AchievementsProps {
  achievements: Achievement[];
  onClose: () => void;
}

const Achievements: React.FC<AchievementsProps> = ({ achievements, onClose }) => {
  return (
    <AchievementsOverlay onClick={onClose}>
      <AchievementsContainer onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>Achievements</Title>
        <AchievementGrid>
          {achievements.map(achievement => (
            <AchievementCard 
              key={achievement.id}
              $isUnlocked={achievement.isUnlocked}
            >
              <AchievementIcon>{achievement.icon}</AchievementIcon>
              <AchievementName>{achievement.name}</AchievementName>
              <AchievementDescription>{achievement.description}</AchievementDescription>
              <ProgressBar>
                <Progress $progress={(achievement.progress / achievement.requirement.value) * 100} />
              </ProgressBar>
            </AchievementCard>
          ))}
        </AchievementGrid>
      </AchievementsContainer>
    </AchievementsOverlay>
  );
};

export default Achievements; 