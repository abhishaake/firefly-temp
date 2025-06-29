import type { ApiResponse } from '../types/api';
import type { Workout } from '../types/workout';
import type { WorkoutWrapper } from '../types/workoutWrapper';

const API_URL = 'http://localhost:8080/api/v1/workouts';
const API_TOKEN = 'FfbhuYx_pSVRl7npG8wQIw';

export class WorkoutService {
  async getWorkouts(): Promise<ApiResponse<WorkoutWrapper>> {
    try {
      const response = await fetch(API_URL, {
        headers: {
          'token': API_TOKEN,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch workouts');
      }
      const data = await response.json();
      // If the API returns workouts directly, use data; otherwise, adjust as needed
      return {
        data: data as WorkoutWrapper,
        status: response.status,
        message: 'Fetched from remote API',
      };
    } catch (error: any) {
      return {
        data: {} as WorkoutWrapper,
        status: 500,
        message: error.message || 'Error fetching workouts',
      };
    }
  }

  async getWorkoutDetails(workoutId: number): Promise<ApiResponse<Workout>> {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/workouts/details?workoutId=${workoutId}`, {
        headers: {
          'token': API_TOKEN,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch workout details');
      }
      const data = await response.json();
      return {
        data: data.data as Workout,
        status: response.status,
        message: 'Fetched workout details from remote API',
      };
    } catch (error: any) {
      return {
        data: {} as Workout,
        status: 500,
        message: error.message || 'Error fetching workout details',
      };
    }
  }
} 