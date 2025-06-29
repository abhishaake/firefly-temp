import { AuthService } from './AuthService';
import { ClassService } from './ClassService';
import { WorkoutService } from './WorkoutService';
import { TrainerService } from './TrainerService';
import { MemberService } from './MemberService';
import { MemberProfileService } from './MemberProfileService';

export class ServiceFactory {
  private static authService: AuthService;
  private static classService: ClassService;
  private static workoutService: WorkoutService;
  private static trainerService: TrainerService;
  private static memberService: MemberService;
  private static memberProfileService: MemberProfileService;

  static getAuthService(): AuthService {
    if (!this.authService) {
      this.authService = new AuthService('http://localhost:8080');
    }
    return this.authService;
  }

  static getClassService(): ClassService {
    if (!this.classService) {
      this.classService = new ClassService();
    }
    return this.classService;
  }

  static getWorkoutService(): WorkoutService {
    if (!this.workoutService) {
      this.workoutService = new WorkoutService();
    }
    return this.workoutService;
  }

  static getTrainerService(): TrainerService {
    if (!this.trainerService) {
      this.trainerService = new TrainerService({ baseURL: 'http://localhost:8080' });
    }
    return this.trainerService;
  }

  static getMemberService(): MemberService {
    if (!this.memberService) {
      this.memberService = new MemberService({ baseURL: 'http://localhost:8080' });
    }
    return this.memberService;
  }

  static getMemberProfileService(): MemberProfileService {
    if (!this.memberProfileService) {
      this.memberProfileService = new MemberProfileService();
    }
    return this.memberProfileService;
  }
} 