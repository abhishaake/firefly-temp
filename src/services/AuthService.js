import { BaseApiService } from './BaseApiService';
export class AuthService extends BaseApiService {
    constructor(baseURL) {
        super({ baseURL });
    }
    async login(credentials) {
        const response = await this.post('/auth/login', credentials);
        return response;
    }
    async logout() {
        const response = await this.post('/auth/logout');
        localStorage.removeItem('auth_token');
        return response;
    }
    async refreshToken() {
        const response = await this.post('/auth/refresh');
        return response;
    }
    async getCurrentUser() {
        const response = await this.get('/auth/me');
        return response;
    }
}
