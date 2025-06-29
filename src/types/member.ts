export interface Member {
  userId: string;
  fullName: string;
  email: string;
  age: string;
  gender: string;
  profilePicture: string;
  height: string;
  weight: string;
  firstName?: string; // Derived from fullName
  lastName?: string;  // Derived from fullName
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMemberRequest {
  fullName: string;
  email: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  profilePicture?: string;
}

export interface UpdateMemberRequest extends Partial<CreateMemberRequest> {
  id: string;
}

export interface MembersPaginatedResponse {
  users: Member[];
  page: number;
  size: number;
  totalPage: number;
} 