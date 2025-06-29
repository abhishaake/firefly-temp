export interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialization?: string[];
  experience?: number;
  rating?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTrainerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialization?: string[];
  experience?: number;
}

export interface UpdateTrainerRequest extends Partial<CreateTrainerRequest> {
  id: string;
} 