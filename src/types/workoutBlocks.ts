export interface WorkoutBlock {
    workoutRoundId: number;
    sequenceNo: number;
    blockName: string;
    blockType: string;
    durationSeconds: number;
    multiplier: number;
    gear: number;
    targetMetric: string;
    targetValue: number;
    scoring: string;
  } 
  