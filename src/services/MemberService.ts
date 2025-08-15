import { BaseApiService } from './BaseApiService';
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
      baseURL: 'https://firefly-admin.cozmotech.ie',
      timeout: 15000,
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
      const response = await this.api.get<ApiMemberResponse>(`/api/v1/dashboard/users?page=${page}&size=${size}&name=${search}`);

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
      };
    } catch (error) {
      throw new Error(`Failed to fetch members: ${error}`);
    }
  }

  async getMemberById(id: string): Promise<ApiResponse<Member>> {
    // TODO: Implement when API endpoint is available
    throw new Error('getMemberById API endpoint not implemented');
  }

  async createMember(member: CreateMemberRequest): Promise<ApiResponse<Member>> {
    // TODO: Implement when API endpoint is available
    throw new Error('createMember API endpoint not implemented');
  }

  async updateMember(member: UpdateMemberRequest): Promise<ApiResponse<Member>> {
    // TODO: Implement when API endpoint is available
    throw new Error('updateMember API endpoint not implemented');
  }

  async deleteMember(id: string): Promise<ApiResponse<void>> {
    // TODO: Implement when API endpoint is available
    throw new Error('deleteMember API endpoint not implemented');
  }
} 