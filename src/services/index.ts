import { AuthService } from './AuthService';
import { ClassService } from './ClassService';
import { WorkoutService } from './WorkoutService';
import { TrainerService } from './TrainerService';
import { MemberService } from './MemberService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

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
    this.trainerService = new TrainerService({ baseURL: 'http://localhost:8080' });
    this.memberService = new MemberService({ baseURL: 'http://localhost:8080' });
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