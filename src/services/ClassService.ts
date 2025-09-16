import { BaseApiService } from './BaseApiService';
import { API_CONFIG } from './config';
import { transformBackendResponse, createErrorResponse } from './utils';
import type { ApiResponse, BackendApiResponse } from '../types/api';
import type { ClassItem, ClassesResponseData, ClassesApiResponse } from '../types/class';
import type { GymLocationResponse } from '../types/gymLocations';

export class ClassService extends BaseApiService {
  constructor() {
    super({
      baseURL: API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.DEFAULT),
      timeout: API_CONFIG.DEFAULT_TIMEOUT
    });
  }

  async getAvailableClasses(): Promise<ApiResponse<ClassesResponseData>> {
    try {
      const response = await this.api.get<ClassesApiResponse>('/dashboard/class/available');

      return {
        data: response.data.data,
        status: response.data.statusCode,
        message: response.data.message,
        success: response.data.success,
      };
    } catch (error: any) {
      return createErrorResponse(error, 'Failed to fetch available classes', {} as ClassesResponseData);
    }
  }

  async getClassById(classId: string): Promise<ApiResponse<ClassItem>> {
    try {
      const response = await this.api.get<BackendApiResponse<ClassItem>>(`/dashboard/class/${classId}`);

      return transformBackendResponse(response.data);
    } catch (error: any) {
      return createErrorResponse(error, 'Failed to fetch class details', {} as ClassItem);
    }
  }

  async getClassBookingDetails(classId: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get<ClassesApiResponse>(`/dashboard/class/details?classId=${classId}`);
      return transformBackendResponse(response.data);
    } catch (error: any) {
      return createErrorResponse(error, 'Failed to fetch class booking details', null);
    }
  }

  async getGymLocations(): Promise<ApiResponse<GymLocationResponse>> {
    try {
      const response = await this.api.get<any>('/dashboard/active-locations');
      return {
        data: response.data.data || {},
        status: response.data.statusCode,
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      return createErrorResponse(error, 'Failed to fetch gym locations', {} as GymLocationResponse);
    }
  }

  async createClass(classData: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.post<ClassesApiResponse>('/dashboard/class', classData);
      return transformBackendResponse(response.data);
    } catch (error: any) {
      return createErrorResponse(error, 'Error creating class', null);
    }
  }

  async updateClass(classId: string, classData: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.put<ClassesApiResponse>(`/dashboard/class/${classId}`, classData);
      return transformBackendResponse(response.data);
    } catch (error: any) {
      return createErrorResponse(error, 'Error updating class', null);
    }
  }

  async getAvailableAssignments(classId: string, roundId: number): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get<any>(`/dashboard/assignments?classId=${classId}&roundId=${roundId}`);
      return transformBackendResponse(response.data);
    } catch (error: any) {
      return createErrorResponse(error, 'Failed to fetch available assignments', null);
    }
  }

  async createAssignment(assignmentData: {
    classId: number;
    machineId: number;
    roundId: number;
    userId: number;
  }): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.post<any>('/dashboard/assignments/create', assignmentData);
      return transformBackendResponse(response.data);
    } catch (error: any) {
      return createErrorResponse(error, 'Failed to create assignment', null);
    }
  }

  async clearAssignment(assignmentData: {
    classId: number;
    machineId: number;
    roundId: number;
    userId: number;
  }): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.post<any>('/dashboard/assignments/clear', assignmentData);
      return transformBackendResponse(response.data);
    } catch (error: any) {
      return createErrorResponse(error, 'Failed to clear assignment', null);
    }
  }

  async stopClass(classId: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.post<any>(`/dashboard/class/stop?classId=${classId}`);
      return transformBackendResponse(response.data);
    } catch (error: any) {
      return createErrorResponse(error, 'Failed to stop class', null);
    }
  }
} 