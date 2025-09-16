export interface MachineSummary {
  machineType: string;
  level: number;
  score: string;
  minWattTarget: number;
  maxWattTarget: number;
  avgWatt: number;
  maxWatt: number;
  avgPaceMinTarget: number;
  avgPaceMaxTarget: number;
  avgPace: number;
  time250: number;
  time500: number;
  time1000: number;
  totalMeters: number;
}

export interface UserInfo {
  userId: string | null;
  fullName: string;
  email: string | null;
  age: string;
  gender: string;
  profilePicture: string | null;
  height: string;
  weight: string;
}

export interface UserProfile {
  maxWatt: number;
  totalMeters: number;
  maxCalories: number;
  time1000: number;
  time500: number;
  time250: number;
}

export interface MemberProfile {
  userInfo: UserInfo;
  machineSummaryList: MachineSummary[];
  userProfile: UserProfile;
}

export interface MemberProfileResponse {
  data: MemberProfile;
  success: boolean;
  statusCode: number;
  message: string;
}

// Export user types
export * from './user';

// Export machine types
export * from './machine'; 