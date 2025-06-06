import { AuthService } from './AuthService';
import { ClassService } from './ClassService';
import { WorkoutService } from './WorkoutService';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
class ServiceFactory {
    constructor() {
        Object.defineProperty(this, "authService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "classService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "workoutService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.authService = new AuthService(API_BASE_URL);
        this.classService = new ClassService(API_BASE_URL);
        this.workoutService = new WorkoutService();
    }
    static getInstance() {
        if (!ServiceFactory.instance) {
            ServiceFactory.instance = new ServiceFactory();
        }
        return ServiceFactory.instance;
    }
    getAuthService() {
        return this.authService;
    }
    getClassService() {
        return this.classService;
    }
    getWorkoutService() {
        return this.workoutService;
    }
}
export const services = ServiceFactory.getInstance();
