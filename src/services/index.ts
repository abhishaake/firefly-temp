import { AuthService } from './AuthService';
import { ClassService } from './ClassService';
import { WorkoutService } from './WorkoutService';
import { TrainerService } from './TrainerService';
import { MemberService } from './MemberService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://firefly-admin.cozmotech.ie/api';

class ServiceFactory {
  private static instance: ServiceFactory;
  private authService: AuthService;
  private classService: ClassService;
  private workoutService: WorkoutService;
  private trainerService: TrainerService;
  private memberService: MemberService;

  private constructor() {
    this.authService = new AuthService(API_BASE_URL);
    this.classService = new ClassService(API_BASE_URL);
    this.workoutService = new WorkoutService();
    this.trainerService = new TrainerService({ baseURL: 'https://firefly-admin.cozmotech.ie' });
    this.memberService = new MemberService({ baseURL: 'https://firefly-admin.cozmotech.ie' });
  }

  public static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  public getAuthService(): AuthService {
    return this.authService;
  }

  public getClassService(): ClassService {
    return this.classService;
  }

  public getWorkoutService(): WorkoutService {
    return this.workoutService;
  }

  public getTrainerService(): TrainerService {
    return this.trainerService;
  }

  public getMemberService(): MemberService {
    return this.memberService;
  }
}

export const services = ServiceFactory.getInstance(); 