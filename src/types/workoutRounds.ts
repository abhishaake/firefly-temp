import type { WorkoutBlock } from "./workoutBlocks";

export interface WorkoutRound {
    name: string;
    sequenceNo: number;
    workoutBlocks: WorkoutBlock[];
  } 
  