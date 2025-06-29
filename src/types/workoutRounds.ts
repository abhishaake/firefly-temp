import type { WorkoutBlock } from "./workoutBlocks";

export interface WorkoutRound {
    roundId: number;
    name: string;
    sequenceNo: number;
    workoutBlocks: WorkoutBlock[];
  } 
  