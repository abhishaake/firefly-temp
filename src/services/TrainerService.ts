import { BaseApiService } from './BaseApiService';
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
  private readonly API_TOKEN = 'FfbhuYx_pSVRl7npG8wQIw';

  constructor(config: { baseURL: string }) {
    super({
      ...config,
      baseURL: 'http://localhost:8080',
      headers: {
        'token': 'FfbhuYx_pSVRl7npG8wQIw',
      },
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
      const response = await this.api.get<ApiTrainerResponse>(`/api/v1/dashboard/trainers?name=${search}`);
      
      const trainers = response.data.data.panelUsers.map((apiTrainer, index) => 
        this.transformApiTrainerToTrainer(apiTrainer, index)
      );

      return {
        data: trainers,
        status: response.data.statusCode,
        message: response.data.message,
      };
    } catch (error) {
      throw new Error(`Failed to fetch trainers: ${error}`);
    }
  }

  async getTrainerById(id: string): Promise<ApiResponse<Trainer>> {
    // TODO: Implement when API endpoint is available
    throw new Error('getTrainerById API endpoint not implemented');
  }

  async createTrainer(trainer: CreateTrainerRequest): Promise<ApiResponse<Trainer>> {
    // TODO: Implement when API endpoint is available
    throw new Error('createTrainer API endpoint not implemented');
  }

  async updateTrainer(trainer: UpdateTrainerRequest): Promise<ApiResponse<Trainer>> {
    // TODO: Implement when API endpoint is available
    throw new Error('updateTrainer API endpoint not implemented');
  }

  async deleteTrainer(id: string): Promise<ApiResponse<void>> {
    // TODO: Implement when API endpoint is available
    throw new Error('deleteTrainer API endpoint not implemented');
  }
} 