import React from 'react';
import type { Workout } from '../types/workout';

export const WorkoutCard: React.FC<{ workout: Workout }> = ({ workout }) => (
  <div className="workout-card figma-style">
    <div className="workout-card-header">
      <div className="workout-card-title-row">
        <h3 className="workout-card-title">{workout.name}</h3>
        <span className={`workout-card-level level-${workout.level.toLowerCase()}`}>{workout.level}</span>
      </div>
      <div className="workout-card-meta-row">
        <span className="workout-card-meta-item">{workout.duration}</span>
        <span className="workout-card-meta-dot">•</span>
        <span className="workout-card-meta-item">{workout.trainer}</span>
        <span className="workout-card-meta-dot">•</span>
        <span className="workout-card-meta-item">{workout.date}</span>
      </div>
    </div>
    <div className="workout-card-body">
      <p className="workout-card-description">{workout.description}</p>
    </div>
  </div>
); 