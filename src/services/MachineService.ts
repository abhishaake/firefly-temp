import { BaseApiService } from './BaseApiService';
import { API_CONFIG } from './config';
import { transformBackendResponse, createErrorResponse } from './utils';
import type { ApiResponse, BackendApiResponse } from '../types/api';
import type { Machine, Location, MachinesApiResponse, LocationsApiResponse, CreateMachineRequest, UpdateMachineRequest, MachineApiResponse, MachineDeleteApiResponse } from '../types/machine';

export class MachineService extends BaseApiService {
  constructor() {
    super({
      baseURL: API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.DEFAULT),
      timeout: API_CONFIG.DEFAULT_TIMEOUT,
    });
  }

  async getActiveLocations(): Promise<ApiResponse<Location[]>> {
    try {
      const response = await this.api.get<LocationsApiResponse>('/dashboard/active-locations');
      return {
        data: response.data.data.locations || [],
        status: response.data.statusCode,
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      return createErrorResponse(error, 'Failed to fetch active locations', []);
    }
  }

  async getAllMachinesByLocation(locationId: number): Promise<ApiResponse<Machine[]>> {
    try {
      const response = await this.api.get<MachinesApiResponse>(`/dashboard/machines/all?locationId=${locationId}`);
      return {
        data: response.data.data.machines || [],
        status: response.data.statusCode,
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      return createErrorResponse(error, 'Failed to fetch machines for location', []);
    }
  }

  async getMachineById(machineId: number): Promise<ApiResponse<Machine>> {
    try {
      const response = await this.api.get<MachinesApiResponse>(`/dashboard/machines/${machineId}`);
      const machine = response.data.data.machines?.[0];
      if (!machine) {
        throw new Error('Machine not found');
      }
      return {
        data: machine,
        status: response.data.statusCode,
        success: response.data.success,
        message: response.data.displayMessage,
      };
    } catch (error: any) {
      return createErrorResponse(error, 'Failed to fetch machine details', {} as Machine);
    }
  }

  async createMachine(machineData: CreateMachineRequest): Promise<ApiResponse<Machine>> {
    try {
      const response = await this.api.post<MachineApiResponse>('/dashboard/machines/create', machineData);
      if (!response.data.success) {
        throw new Error('Failed to update machine');
      }
      return {
        data: response.data.data,
        status: response.data.statusCode,
        success: response.data.success,
        message: response.data.displayMessage,
      };
    } catch (error: any) {
      return createErrorResponse(error, 'Failed to create machine', {} as Machine);
    }
  }

  async updateMachine(machineData: UpdateMachineRequest): Promise<ApiResponse<Machine>> {
    try {
      const response = await this.api.post<MachineApiResponse>('/dashboard/machines/update', machineData);
      if (!response.data.success) {
        throw new Error('Failed to update machine');
      }
      return {
        data: response.data.data,
        status: response.data.statusCode,
        success: response.data.success,
        message: response.data.displayMessage,
      };
    } catch (error: any) {
      return createErrorResponse(error, 'Failed to update machine', {} as Machine);
    }
  }

  async deleteMachine(machineData: UpdateMachineRequest): Promise<ApiResponse<void>> {
    try {
      const response = await this.api.post<MachineDeleteApiResponse>('/dashboard/machines/delete', machineData);
      if (!response.data.success) {
        throw new Error('Failed to delete machine');
      }
      return {
        data: undefined,
        status: response.data.statusCode,
        success: response.data.success,
        message: response.data.displayMessage,
      };
    } catch (error: any) {
      return createErrorResponse(error, 'Failed to delete machine', undefined);
    }
  }
} 