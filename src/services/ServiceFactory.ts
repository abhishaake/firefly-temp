import { AuthService } from './AuthService';
import { ClassService } from './ClassService';
import { WorkoutService } from './WorkoutService';
import { TrainerService } from './TrainerService';
import { MemberService } from './MemberService';
import { MemberProfileService } from './MemberProfileService';
import { UserService } from './UserService';
import { MachineService } from './MachineService';
import { MediaService } from './MediaService';

export class ServiceFactory {
  private static authService: AuthService;
  private static classService: ClassService;
  private static workoutService: WorkoutService;
  private static trainerService: TrainerService;
  private static memberService: MemberService;
  private static memberProfileService: MemberProfileService;
  private static userService: UserService;
  private static machineService: MachineService;
  private static mediaService: MediaService;

  static getAuthService(): AuthService {
    if (!this.authService) {
      this.authService = new AuthService();
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
      this.trainerService = new TrainerService();
    }
    return this.trainerService;
  }

  static getMemberService(): MemberService {
    if (!this.memberService) {
      this.memberService = new MemberService();
    }
    return this.memberService;
  }

  static getMemberProfileService(): MemberProfileService {
    if (!this.memberProfileService) {
      this.memberProfileService = new MemberProfileService();
    }
    return this.memberProfileService;
  }

  static getUserService(): UserService {
    if (!this.userService) {
      this.userService = new UserService();
    }
    return this.userService;
  }

  static getMachineService(): MachineService {
    if (!this.machineService) {
      this.machineService = new MachineService();
    }
    return this.machineService;
  }

  static getMediaService(): MediaService {
    if (!this.mediaService) {
      this.mediaService = new MediaService();
    }
    return this.mediaService;
  }
} 