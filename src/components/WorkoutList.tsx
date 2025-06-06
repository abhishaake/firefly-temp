import React from 'react';
import type { Workout } from '../types/workout';
import { WorkoutCard } from './WorkoutCard';

export const WorkoutList: React.FC<{ workouts: Workout[] }> = ({ workouts }) => (
  <div className="workout-list">
    {workouts.map((w) => (
      <WorkoutCard key={w.id} workout={w} />
    ))}
  </div>
); 