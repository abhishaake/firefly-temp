import { BaseApiService } from './BaseApiService';
import type { ApiResponse } from '../types/api';
import type { Workout } from '../types/workout';
import type { WorkoutWrapper } from '../types/workoutWrapper';

export class WorkoutService extends BaseApiService {
  constructor() {
    super({ 
      baseURL: 'https://firefly-admin.cozmotech.ie/api/v1',
      timeout: 15000 
    });
  }

  async getWorkouts(): Promise<ApiResponse<WorkoutWrapper>> {
    try {
      return await this.get<WorkoutWrapper>('/workouts');
    } catch (error: any) {
      return {
        data: {} as WorkoutWrapper,
        status: 500,
        success: false,
        message: error.message || 'Error fetching workouts',
      };
    }
  }

  async getWorkoutDetails(workoutId: number): Promise<ApiResponse<Workout>> {
    try {
      return await this.get<Workout>(`/workouts/details?workoutId=${workoutId}`);
    } catch (error: any) {
      return {
        data: {} as Workout,
        status: 500,
        success: false,
        message: error.message || 'Error fetching workout details',
      };
    }
  }

  async createWorkout(workoutData: any): Promise<ApiResponse<any>> {
    try {
      return await this.post<any>('/workouts', workoutData);
    } catch (error: any) {
      return {
        data: null,
        status: 500,
        success: false,
        message: error.message || 'Error creating workout',
      };
    }
  }

  async updateWorkout(workoutId: number, workoutData: any): Promise<ApiResponse<any>> {
    try {
      return await this.put<any>(`/workouts/${workoutId}/complete`, workoutData);
    } catch (error: any) {
      return {
        data: null,
        status: 500,
        success: false,
        message: error.message || 'Error updating workout',
      };
    }
  }
} 