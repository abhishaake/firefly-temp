import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse, ApiError, ApiConfig } from '../types/api';
import { API_CONFIG } from './config';

export class BaseApiService {
  protected api: AxiosInstance;

  constructor(config?: Partial<ApiConfig>) {
    // Use centralized config with optional overrides
    const finalConfig: ApiConfig = {
      baseURL: config?.baseURL || API_CONFIG.BASE_URL,
      timeout: config?.timeout || API_CONFIG.DEFAULT_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    };

    this.api = axios.create(finalConfig);
    this.setupInterceptors();
  }

  protected setupInterceptors(): void {
    this.api.interceptors.request.use(
      (config) => {
        // Don't add Authorization header for login requests
        if (config.url?.includes('/signIn')) {
          console.log('Login request - skipping Authorization header');
          return config;
        }

        const token = localStorage.getItem('auth_token');
        console.log('Token from localStorage:', token ? 'Token exists' : 'No token found');
        if (token) {
          config.headers.token = token;
          console.log('Authorization header set:', `Bearer ${token.substring(0, 20)}...`);
        } else {
          console.log('No token found, skipping Authorization header');
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.log('API Response Error:', error.response?.status, error.response?.data);
        if (error.response?.status === 401) {
          console.log('401 Unauthorized - clearing token and redirecting to login');
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  protected handleError(error: any): ApiError {
    if (error.response) {
      return {
        message: error.response.data?.displayMessage || 'An error occurred',
        status: error.response.status.toString(),
        errors: error.response.data?.errors,
      };
    }
    return {
      message: error.message || 'Network error',
      status: '0',
    };
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.get(url, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  protected async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.post(url, data, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  protected async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.put(url, data, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.delete(url, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  protected async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.patch(url, data, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  protected async uploadFile<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const uploadConfig: AxiosRequestConfig = {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'multipart/form-data',
        },
      };
      
      const response: AxiosResponse<ApiResponse<T>> = await this.api.post(url, formData, uploadConfig);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
} 