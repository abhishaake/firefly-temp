import { BaseApiService } from './BaseApiService';
import { API_CONFIG } from './config';
import { transformBackendResponse, createErrorResponse } from './utils';
import type { ApiResponse, BackendApiResponse } from '../types/api';
import type { CreateUserRequest, CreateUserResponse, User } from '../types/user';

export class UserService extends BaseApiService {
  constructor() {
    super({
      baseURL: API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.DEFAULT),
      timeout: API_CONFIG.DEFAULT_TIMEOUT,
    });
  }

  async createUser(userData: CreateUserRequest): Promise<ApiResponse<CreateUserResponse>> {
    try {
      const response = await this.api.post<BackendApiResponse<CreateUserResponse>>('/dashboard/create-user', userData);
      return transformBackendResponse(response.data);
    } catch (error: any) {
      return createErrorResponse(error, 'Failed to create user', {} as CreateUserResponse);
    }
  }

  async getAllUsers(): Promise<ApiResponse<User[]>> {
    try {
      const response = await this.api.get<BackendApiResponse<User[]>>('/dashboard/users');
      return transformBackendResponse(response.data);
    } catch (error: any) {
      return createErrorResponse(error, 'Failed to fetch users', []);
    }
  }

  async getUserById(userId: string): Promise<ApiResponse<User>> {
    try {
      const response = await this.api.get<BackendApiResponse<User>>(`/dashboard/users/${userId}`);
      return transformBackendResponse(response.data);
    } catch (error: any) {
      return createErrorResponse(error, 'Failed to fetch user details', {} as User);
    }
  }

  async updateUser(userId: string, userData: Partial<CreateUserRequest>): Promise<ApiResponse<User>> {
    try {
      const response = await this.api.put<BackendApiResponse<User>>(`/dashboard/users/${userId}`, userData);
      return transformBackendResponse(response.data);
    } catch (error: any) {
      return createErrorResponse(error, 'Failed to update user', {} as User);
    }
  }

  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    try {
      const response = await this.api.delete<BackendApiResponse<void>>(`/dashboard/users/${userId}`);
      return transformBackendResponse(response.data);
    } catch (error: any) {
      return createErrorResponse(error, 'Failed to delete user', undefined);
    }
  }
} 