import type { ApiResponse, BackendApiResponse } from '../types/api';

/**
 * Transforms a backend API response to our standard ApiResponse format
 */
export function transformBackendResponse<T>(
  response: BackendApiResponse<T>
): ApiResponse<T> {
  return {
    data: response.data,
    status: response.statusCode,
    message: response.message,
    success: response.success,
  };
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse<T>(
  error: any,
  defaultMessage: string,
  defaultData: T
): ApiResponse<T> {
  return {
    data: defaultData,
    status: 500,
    message: error?.message || defaultMessage,
    success: false,
  };
}

/**
 * Safely extracts data from a backend response, with fallback
 */
export function extractBackendData<T>(
  response: BackendApiResponse<T>,
  fallback: T
): T {
  return response.data || fallback;
} 