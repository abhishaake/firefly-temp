export interface User {
  userId: string;
  fullName: string;
  email: string;
  type: 'ADMIN' | 'TRAINER';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password?: string;
  type: 'ADMIN' | 'TRAINER';
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  userId: string;
}

export interface CreateUserResponse {
  userId: string;
  fullName: string;
  email: string;
  type: 'ADMIN' | 'TRAINER';
  message: string;
} 