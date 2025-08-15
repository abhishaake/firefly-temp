import { BaseApiService } from './BaseApiService';
import type { MemberProfileResponse } from '../types';

export class MemberProfileService extends BaseApiService {
  constructor() {
    super({ 
      baseURL: 'https://firefly-admin.cozmotech.ie/api/v1/dashboard',
      timeout: 15000 
    });
  }

  async getMemberProfile(userId: string): Promise<MemberProfileResponse> {
    const response = await this.api.get(`/user?userId=${userId}`);
    return response.data;
  }
} 