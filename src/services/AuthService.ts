import { BaseApiService } from './BaseApiService';
import type { ApiResponse, LoginRequest, LoginResponse, LoginApiResponse } from '../types/api';

export class AuthService extends BaseApiService {
  constructor() {
    super({ 
      baseURL: 'https://firefly-admin.cozmotech.ie/api/app/auth',
      timeout: 10000 
    });
  }

  async signIn(credentials: LoginRequest): Promise<LoginApiResponse> {
    console.log('AuthService.signIn called with:', credentials);
    const response = await this.post<LoginResponse>('/dashboard/signIn', credentials);
    console.log('AuthService.signIn response:', response);
    return response;
  }

  async signOut(): Promise<ApiResponse<void>> {
    return this.post<void>('/signOut');
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return this.post<{ token: string }>('/refresh');
  }
} 