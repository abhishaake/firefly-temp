import axios from 'axios';
export class BaseApiService {
    constructor(config) {
        Object.defineProperty(this, "api", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.api = axios.create({
            baseURL: config.baseURL,
            timeout: config.timeout || 30000,
            headers: {
                'Content-Type': 'application/json',
                ...config.headers,
            },
        });
        this.setupInterceptors();
    }
    setupInterceptors() {
        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }, (error) => Promise.reject(error));
        this.api.interceptors.response.use((response) => response, (error) => {
            if (error.response?.status === 401) {
                localStorage.removeItem('auth_token');
                window.location.href = '/login';
            }
            return Promise.reject(this.handleError(error));
        });
    }
    handleError(error) {
        if (error.response) {
            return {
                message: error.response.data.message || 'An error occurred',
                status: error.response.status,
                errors: error.response.data.errors,
            };
        }
        return {
            message: error.message || 'Network error',
            status: 0,
        };
    }
    async get(url, config) {
        const response = await this.api.get(url, config);
        return response.data;
    }
    async post(url, data, config) {
        const response = await this.api.post(url, data, config);
        return response.data;
    }
    async put(url, data, config) {
        const response = await this.api.put(url, data, config);
        return response.data;
    }
    async delete(url, config) {
        const response = await this.api.delete(url, config);
        return response.data;
    }
    async patch(url, data, config) {
        const response = await this.api.patch(url, data, config);
        return response.data;
    }
}
