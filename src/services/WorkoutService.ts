import { BaseApiService } from './BaseApiService';
import { API_CONFIG } from './config';
import { transformBackendResponse, createErrorResponse } from './utils';
import type { ApiResponse, BackendApiResponse } from '../types/api';
import type { Workout } from '../types/workout';
import type { WorkoutWrapper } from '../types/workoutWrapper';

export class WorkoutService extends BaseApiService {
  constructor() {
    super({ 
      baseURL: API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.DEFAULT),
      timeout: API_CONFIG.WORKOUT_TIMEOUT 
    });
  }

  async getWorkouts(): Promise<ApiResponse<WorkoutWrapper>> {
    try {
      const response = await this.api.get<BackendApiResponse<WorkoutWrapper>>('/dashboard/workouts');
      return transformBackendResponse(response.data);
    } catch (error: any) {
      return createErrorResponse(error, 'Error fetching workouts', {} as WorkoutWrapper);
    }
  }

  async getWorkoutDetails(workoutId: number): Promise<ApiResponse<Workout>> {
    try {
      const response = await this.api.get<BackendApiResponse<Workout>>(`/dashboard/workouts/details?workoutId=${workoutId}`);
      return transformBackendResponse(response.data);
    } catch (error: any) {
      return createErrorResponse(error, 'Error fetching workout details', {} as Workout);
    }
  }

  async createWorkout(workoutData: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.post<BackendApiResponse<any>>('/dashboard/workouts', workoutData);
      return transformBackendResponse(response.data);
    } catch (error: any) {
      return createErrorResponse(error, 'Error creating workout', null);
    }
  }

  async updateWorkout(workoutId: number, workoutData: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.put<BackendApiResponse<any>>(`/dashboard/workouts/${workoutId}/complete`, workoutData);
      return transformBackendResponse(response.data);
    } catch (error: any) {
      return createErrorResponse(error, 'Error updating workout', null);
    }
  }
} 