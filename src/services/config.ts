export const API_CONFIG = {
  // Base URL for all API calls
  // BASE_URL: 'http://localhost:8080',

  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://firefly-admin.cozmotech.ie',

  // API version
  API_VERSION: 'v1',

  // Default timeout
  DEFAULT_TIMEOUT: 30000,

  // Auth timeout (shorter for auth operations)
  AUTH_TIMEOUT: 10000,

  // Workout timeout (longer for workout operations)
  WORKOUT_TIMEOUT: 15000,

  // Endpoints
  ENDPOINTS: {
    AUTH: '/api/dashboard/auth',
    DEFAULT: '/api'
  },

  // Get full URL for a specific endpoint
  getUrl: (endpoint: string): string => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
  },

  // Get full URL with version
  getVersionedUrl: (endpoint: string): string => {
    return `${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}${endpoint}`;
  }
} as const; 