import React from 'react';
import '../styles/workout.css';
import type { WorkoutRound } from '../types/workoutRounds';

interface CreateWorkoutFigmaHeaderProps {
  workoutRounds?: WorkoutRound[];
  selectedRoundIndex?: number;
  onRoundSelect?: (round: WorkoutRound, index: number) => void;
  onAddRound?: () => void;
}

export const CreateWorkoutFigmaHeader: React.FC<CreateWorkoutFigmaHeaderProps> = ({ workoutRounds = [], selectedRoundIndex, onRoundSelect, onAddRound }) => (
  <div className="figma-header-row">
    <div className="figma-header-left">
      {workoutRounds.map((round, idx) => (
        <div
          key={round.name + idx}
          className={`figma-header-card${selectedRoundIndex === round.sequenceNo ? ' filled' : ' outlined'}`}
          onClick={() => onRoundSelect && onRoundSelect(round, round.sequenceNo)}
          style={{ cursor: 'pointer' }}
        >
          {round.name}
        </div>
      ))}
      <div className="figma-header-plus" onClick={() => onAddRound && onAddRound()} style={{cursor:'pointer'}}><span>+</span></div>
    </div>
    <div className="figma-header-menu"><span>⋮</span></div>
  </div>
); 