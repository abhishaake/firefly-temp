export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

// New interface for the actual backend API response structure
export interface BackendApiResponse<T> {
  data: T;
  success: boolean;
  statusCode: number;
  message: string;
  displayMessage: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  message: string;
  status: string;
  errors?: Record<string, string[]>;
}

export interface LoginRequest {
  email: string;
  password: string;
  type: 'ADMIN' | 'TRAINER';
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
}

export interface LoginApiResponse extends ApiResponse<LoginResponse> {
  data: LoginResponse;
}

export interface ApiConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
} 