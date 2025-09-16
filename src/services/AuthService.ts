import { BaseApiService } from './BaseApiService';
import { API_CONFIG } from './config';
import { transformBackendResponse, createErrorResponse } from './utils';
import type { ApiResponse, LoginRequest, LoginResponse, LoginApiResponse, BackendApiResponse } from '../types/api';

export class AuthService extends BaseApiService {
  constructor() {
    super({
      baseURL: API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.AUTH),
      timeout: API_CONFIG.AUTH_TIMEOUT
    });
  }

  async signIn(credentials: LoginRequest): Promise<LoginApiResponse> {
    console.log('AuthService.signIn called with:', credentials);
    const response = await this.api.post<BackendApiResponse<LoginResponse>>('/signIn', credentials);

    // Transform the backend response to our standard ApiResponse format
    const transformedResponse: LoginApiResponse = {
      data: response.data.data,
      status: response.data.statusCode,
      message: response.data.message,
      success: response.data.success,
    };

    console.log('AuthService.signIn response:', transformedResponse);
    return transformedResponse;
  }

  async signOut(): Promise<ApiResponse<void>> {
    try {
      const response = await this.api.post<BackendApiResponse<void>>('/signOut');
      return transformBackendResponse(response.data);
    } catch (error: any) {
      return createErrorResponse(error, 'Error signing out', undefined);
    }
  }
} 