import Constants from 'expo-constants';
import { Platform } from 'react-native';

export type ApiUser = {
  id: number;
  name: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: ApiUser;
};

export type CheckinResponse = {
  id: number;
  mood: string;
  sleep: number;
  timestamp: string;
};

export type CheckinHistoryResponse = {
  checkins: CheckinResponse[];
};

export type AnalyzeResponse = {
  stressScore: number;
  state: 'stable' | 'declining' | 'critical';
  recommendation: string;
};

export type StudyPlanResponse = {
  stressScore: number;
  state: 'stable' | 'declining' | 'critical';
  plan: string[];
};

type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const getHostFromExpo = () => {
  const expoConfigHost = Constants.expoConfig?.hostUri?.split(':')[0];
  const expoGoHost = Constants.expoGoConfig?.debuggerHost?.split(':')[0];
  const webHost =
    typeof window !== 'undefined' && window.location?.hostname ? window.location.hostname : null;

  return expoConfigHost || expoGoHost || webHost || null;
};

export const getApiBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }

  const expoHost = getHostFromExpo();

  if (expoHost) {
    return `http://${expoHost}:4000`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:4000';
  }

  return 'http://localhost:4000';
};

type RequestOptions = {
  body?: unknown;
  method?: 'GET' | 'POST' | 'PUT';
  token?: string;
};

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
    });
  } catch {
    throw new ApiError(
      `Cannot reach backend at ${getApiBaseUrl()}. Start the backend and, on a phone, set EXPO_PUBLIC_API_BASE_URL to your computer's LAN IP.`,
      0,
    );
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (data && typeof data.success === 'boolean') {
    const envelope = data as ApiEnvelope<T>;

    if (!envelope.success) {
      throw new ApiError(envelope.message || 'Request failed', response.status);
    }

    return envelope.data as T;
  }

  if (!response.ok) {
    throw new ApiError(data?.error || 'Request failed', response.status);
  }

  return data as T;
};

export const register = (payload: { name: string; email: string; password: string }) =>
  request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: payload,
  });

export const login = (payload: { email: string; password: string }) =>
  request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  });

export const getMe = (token: string) =>
  request<{ user: ApiUser }>('/auth/me', {
    token,
  });

export const createCheckin = (token: string, payload: { mood: string; sleep: number }) =>
  request<CheckinResponse>('/checkin', {
    method: 'POST',
    token,
    body: payload,
  });

export const getCheckinHistory = (token: string) =>
  request<CheckinHistoryResponse>('/checkin/history', {
    token,
  });

export const analyze = (payload: { mood: string; sleep: number }) =>
  request<AnalyzeResponse>('/analyze', {
    method: 'POST',
    body: payload,
  });

export const getStudyPlan = (token: string) =>
  request<StudyPlanResponse>('/study-plan', {
    token,
  });

export const updateProfile = (
  token: string,
  payload: { name: string; age: number; gender: string },
) =>
  request<ApiUser & {
    age: number | null;
    gender: string | null;
    onboardingCompleted: boolean;
    goals: string | null;
    stressLevel: string | null;
    studyHours: number | null;
    createdAt: string;
  }>('/profile/me', {
    method: 'PUT',
    token,
    body: payload,
  });

export const updateOnboarding = (
  token: string,
  payload: { goals: string; stressLevel: string; studyHours: number },
) =>
  request<ApiUser & {
    age: number | null;
    gender: string | null;
    onboardingCompleted: boolean;
    goals: string | null;
    stressLevel: string | null;
    studyHours: number | null;
    createdAt: string;
  }>('/onboarding', {
    method: 'PUT',
    token,
    body: payload,
  });
