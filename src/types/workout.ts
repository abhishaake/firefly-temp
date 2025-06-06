import type { WorkoutRound } from "./workoutRounds";

export interface Workout {
  workoutId: number;
  name: string;
  description: string;
  duration: string;
  createdBy: string;
  workoutRounds: WorkoutRound[];
} 
