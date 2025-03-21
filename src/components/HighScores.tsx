import React from 'react';
import styled from 'styled-components';
import { HighScore } from '../types';
import { formatTime } from '../utils/timeUtils';

const HighScoresContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const ScoresTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
  background: #9C27B0;
  color: white;
  padding: 15px;
  text-align: left;
  font-weight: 600;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f5f0f7;
  }

  &:hover {
    background: #efe5f3;
  }
`;

const TableCell = styled.td`
  padding: 12px 15px;
  border-top: 1px solid #eee;
`;

const Title = styled.h2`
  color: #9C27B0;
  text-align: center;
  margin-bottom: 20px;
`;

const BackButton = styled.button`
  padding: 10px 20px;
  background: #9C27B0;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 20px;
  transition: all 0.3s ease;

  &:hover {
    background: #7B1FA2;
    transform: translateY(-1px);
  }
`;

interface HighScoresProps {
  scores: HighScore[];
  onBack: () => void;
}

const HighScores: React.FC<HighScoresProps> = ({ scores, onBack }) => {
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);

  return (
    <HighScoresContainer>
      <Title>High Scores</Title>
      <ScoresTable>
        <thead>
          <tr>
            <TableHeader>Rank</TableHeader>
            <TableHeader>Player</TableHeader>
            <TableHeader>Score</TableHeader>
            <TableHeader>Level</TableHeader>
            <TableHeader>Time Left</TableHeader>
            <TableHeader>Date</TableHeader>
          </tr>
        </thead>
        <tbody>
          {sortedScores.map((score, index) => (
            <TableRow key={score.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{score.playerName}</TableCell>
              <TableCell>{score.score}</TableCell>
              <TableCell>{score.maxLevel}</TableCell>
              <TableCell>{formatTime(score.timeRemaining)}</TableCell>
              <TableCell>{new Date(score.date).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </ScoresTable>
      <BackButton onClick={onBack}>Back to Game</BackButton>
    </HighScoresContainer>
  );
};

export default HighScores; 