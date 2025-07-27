import type { FieldValidationError, GenericResponse } from './api';

export const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface UserLoginResponse extends GenericResponse {
  token: string;
  user: UserInfo;
}

export interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterUserResponse extends GenericResponse {
  errors?: FieldValidationError[];
}

export interface UserProfileResponse extends GenericResponse {
  data: UserInfo;
}
