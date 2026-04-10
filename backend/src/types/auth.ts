export interface AuthUser {
  id: number;
  email: string;
}

export interface JwtUserPayload {
  id: number;
}

export interface UserProfileInput {
  name: string;
  age: number;
  gender: string;
}

export interface OnboardingInput {
  goals: string;
  stressLevel: string;
  studyHours: number;
}

export interface AppUser extends AuthUser {
  name: string | null;
  age: number | null;
  gender: string | null;
  onboardingCompleted: boolean;
  goals: string | null;
  stressLevel: string | null;
  studyHours: number | null;
  createdAt: string;
}
