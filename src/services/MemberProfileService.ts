import { BaseApiService } from './BaseApiService';
import { API_CONFIG } from './config';
import { createErrorResponse } from './utils';
import type { MemberProfile, MemberProfileResponse } from '../types';
import type { BackendApiResponse } from '../types/api';

export class MemberProfileService extends BaseApiService {
  constructor() {
    super({ 
      baseURL: API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.DEFAULT),
      timeout: API_CONFIG.DEFAULT_TIMEOUT 
    });
  }

  async getMemberProfile(userId: string): Promise<MemberProfile> {
    try {
      const response = await this.api.get<BackendApiResponse<MemberProfile>>(`/dashboard/members/user?userId=${userId}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch member profile: ${error.message}`);
    }
  }
} 