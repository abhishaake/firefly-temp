import { BaseApiService } from './BaseApiService';
import type { ApiResponse } from '../types/api';
import type { ClassItem } from '../types/class';

const mockClasses: ClassItem[] = [
  {
    classId: '1',
    className: 'Flow Mobility',
    date: '13 May,2025',
    startTimeEpoch: '1715580600', // Example epoch for 11:30 AM
    trainer: 'Anna Rowe',
    gymLocation: 'Dublin Central',
    workoutId: 1,
    workoutName: 'Workout Block 1',
    description: 'Mobility class',
  },
  {
    classId: '2',
    className: 'Cardio Crush',
    date: '13 May,2025',
    startTimeEpoch: '1715589600', // Example epoch for 01:00 PM
    trainer: 'Anna Rowe',
    gymLocation: 'Galway Bay',
    workoutId: 2,
    workoutName: 'Workout Block 1',
    description: 'Cardio class',
  },
  {
    classId: '3',
    className: 'Flow Mobility',
    date: '14 May,2025',
    startTimeEpoch: '1715661600', // Example epoch for 10:00 AM
    trainer: 'Anna Rowe',
    gymLocation: 'Cork Quay',
    workoutId: 3,
    workoutName: 'Workout Block 1',
    description: 'Mobility class',
  },
  {
    classId: '4',
    className: 'Cardio Crush',
    date: '14 May,2025',
    startTimeEpoch: '1715661600', // Example epoch for 10:00 AM
    trainer: 'Anna Rowe',
    gymLocation: 'Dublin Central',
    workoutId: 4,
    workoutName: 'Workout Block 1',
    description: 'Cardio class',
  },
  {
    classId: '5',
    className: 'Rock Endurance',
    date: '14 May,2025',
    startTimeEpoch: '1715661600', // Example epoch for 10:00 AM
    trainer: 'Anna Rowe',
    gymLocation: 'Limerick Park',
    workoutId: 5,
    workoutName: 'Workout Block 1',
    description: 'Endurance class',
  },
];

export class ClassService extends BaseApiService {
  constructor() {
    super({ baseURL: 'https://firefly-admin.cozmotech.ie/api' });
  }

  async getClasses(): Promise<ApiResponse<ClassItem[]>> {
    // return this.get<ClassItem[]>('/classes');

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      data: mockClasses,
      status: 200,
      message: 'Mock data',
    };
  }

  async getAvailableClasses(): Promise<ApiResponse<ClassItem[]>> {
    try {
      return await this.get<ClassItem[]>('/app/class/available');
    } catch (error: any) {
      return {
        data: [],
        status: 500,
        message: error.message || 'Failed to fetch available classes',
      };
    }
  }

  async getClassById(classId: string): Promise<ApiResponse<ClassItem>> {
    try {
      return await this.get<ClassItem>(`/v1/class/${classId}`);
    } catch (error: any) {
      return {
        data: {} as ClassItem,
        status: 500,
        message: error.message || 'Failed to fetch class details',
      };
    }
  }

  async getClassBookingDetails(classId: string): Promise<ApiResponse<any>> {
    try {
      return await this.get<any>(`/v1/class-bookings/details?classId=${classId}`);
    } catch (error: any) {
      return {
        data: null,
        status: 500,
        message: error.message || 'Failed to fetch class booking details',
      };
    }
  }

  async getGymLocations(): Promise<ApiResponse<any[]>> {
    try {
      return await this.get<any[]>('/v1/gym-locations');
    } catch (error: any) {
      return {
        data: [],
        status: 500,
        success: false,
        message: error.message || 'Failed to fetch gym locations',
      };
    }
  }

  async createClass(classData: any): Promise<ApiResponse<any>> {
    try {
      return await this.post<any>('/v1/class', classData);
    } catch (error: any) {
      return {
        data: null,
        status: 500,
        success: false,
        message: error.message || 'Failed to create class',
      };
    }
  }

  async updateClass(classId: string, classData: any): Promise<ApiResponse<any>> {
    try {
      return await this.put<any>(`/v1/class/${classId}`, classData);
    } catch (error: any) {
      return {
        data: null,
        status: 500,
        success: false,
        message: error.message || 'Failed to update class',
      };
    }
  }
} 