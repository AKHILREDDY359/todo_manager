// Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  preferences?: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

export interface SignInRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export type ThemeMode = 'light' | 'dark';

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}