export { API_CONFIG } from './config';
export { ServiceFactory } from './ServiceFactory';
export * from './utils';

// Re-export individual services for convenience
export { AuthService } from './AuthService';
export { ClassService } from './ClassService';
export { WorkoutService } from './WorkoutService';
export { TrainerService } from './TrainerService';
export { MemberService } from './MemberService';
export { MemberProfileService } from './MemberProfileService';
export { UserService } from './UserService';
export { MachineService } from './MachineService';
export { MediaService } from './MediaService';

// Export the singleton instance
import { ServiceFactory } from './ServiceFactory';
export const services = ServiceFactory; 