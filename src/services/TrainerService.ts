import { BaseApiService } from './BaseApiService';
import { API_CONFIG } from './config';
import { createErrorResponse } from './utils';
import type { Trainer, CreateTrainerRequest, UpdateTrainerRequest } from '../types/trainer';
import type { ApiResponse } from '../types/api';

interface ApiTrainerResponse {
  data: {
    panelUsers: {
      firstName: string;
      lastName: string;
      email: string;
    }[];
  };
  success: boolean;
  statusCode: number;
  message: string;
}

export class TrainerService extends BaseApiService {
  constructor() {
    super({
      baseURL: API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.DEFAULT),
      timeout: API_CONFIG.DEFAULT_TIMEOUT,
    });
  }

  private transformApiTrainerToTrainer(apiTrainer: any, index: number): Trainer {
    return {
      id: `trainer-${index + 1}`,
      firstName: apiTrainer.firstName,
      lastName: apiTrainer.lastName,
      email: apiTrainer.email,
      phone: undefined,
      specialization: [],
      experience: 0,
      rating: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async getAllTrainers(search: string = ''): Promise<ApiResponse<Trainer[]>> {
    try {
      const response = await this.api.get<ApiTrainerResponse>(`/dashboard/trainers?name=${search}`);

      const trainers = response.data.data.panelUsers.map((apiTrainer, index) =>
        this.transformApiTrainerToTrainer(apiTrainer, index)
      );

      return {
        data: trainers,
        status: response.data.statusCode,
        message: response.data.message,
        success: response.data.success,
      };
    } catch (error) {
      throw new Error(`Failed to fetch trainers: ${error}`);
    }
  }
} 