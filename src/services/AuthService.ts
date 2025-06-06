import { BaseApiService } from './BaseApiService';
import type { LoginRequest, LoginResponse, ApiResponse } from '../types/api';

export class AuthService extends BaseApiService {
  constructor(baseURL: string) {
    super({ baseURL });
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.post<LoginResponse>('/auth/login', credentials);
    return response;
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await this.post<void>('/auth/logout');
    localStorage.removeItem('auth_token');
    return response;
  }

  async refreshToken(): Promise<ApiResponse<LoginResponse>> {
    const response = await this.post<LoginResponse>('/auth/refresh');
    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<LoginResponse['user']>> {
    const response = await this.get<LoginResponse['user']>('/auth/me');
    return response;
  }
} 