import type { WorkoutRound } from "./workoutRounds";

export interface WorkoutMedia {
  mediaId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

export interface Workout {
  workoutId: number;
  name: string;
  description: string;
  duration: string;
  createdBy: string;
  workoutRounds: WorkoutRound[];
  media?: WorkoutMedia[];
  audioFileId?: number;
} 
