export interface ClassItem {
  classId: number;
  className: string;
  description: string;
  date: string;
  startTimeEpoch: number;
  gymLocation: number;
  workoutName: string;
  workoutId: number;
  trainerId: number;
  trainerName: string;
}

// Interface for the classes response data structure
export interface ClassesResponseData {
  classes: ClassItem[];
}

// Interface for the complete classes API response
export interface ClassesApiResponse {
  data: ClassesResponseData;
  success: boolean;
  statusCode: number;
  message: string;
  displayMessage: string;
} 
