import { BaseApiService } from './BaseApiService';
import { API_CONFIG } from './config';
import { createErrorResponse } from './utils';
import type { Member, CreateMemberRequest, UpdateMemberRequest, MembersPaginatedResponse } from '../types/member';
import type { ApiResponse } from '../types/api';

interface ApiMemberResponse {
  data: {
    users: {
      userId: number;
      fullName: string;
      email: string;
      age: string;
      gender: string;
      profilePicture: string;
      height: string;
      weight: string;
    }[];
    page: number;
    size: number;
    totalPage: number;
  };
  success: boolean;
  statusCode: number;
  message: string;
}

export class MemberService extends BaseApiService {
  constructor() {
    super({
      baseURL: API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.DEFAULT),
      timeout: API_CONFIG.DEFAULT_TIMEOUT,
    });
  }

  private transformApiMemberToMember(apiMember: any, index: number): Member {
    const [firstName, ...lastNameParts] = apiMember.fullName.split(' ');
    const lastName = lastNameParts.join(' ');

    return {
      userId: apiMember.userId,
      fullName: apiMember.fullName,
      email: apiMember.email,
      age: apiMember.age,
      gender: apiMember.gender,
      profilePicture: apiMember.profilePicture,
      height: apiMember.height,
      weight: apiMember.weight,
      firstName,
      lastName,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async getAllMembers(page: number = 0, size: number = 10, search: string = ''): Promise<ApiResponse<MembersPaginatedResponse>> {
    try {
      const response = await this.api.get<ApiMemberResponse>(`/dashboard/members/users?page=${page}&size=${size}&name=${search}`);

      const members = response.data.data.users.map((apiMember, index) =>
        this.transformApiMemberToMember(apiMember, index + (page * size))
      );

      const paginatedResponse: MembersPaginatedResponse = {
        users: members,
        page: response.data.data.page,
        size: response.data.data.size,
        totalPage: response.data.data.totalPage,
      };

      return {
        data: paginatedResponse,
        status: response.data.statusCode,
        message: response.data.message,
        success: response.data.success,
      };
    } catch (error) {
      throw new Error(`Failed to fetch members: ${error}`);
    }
  }
} 