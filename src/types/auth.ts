import type { UserRole } from '@/constants/auth';

export type MemberType = 'employee' | 'employer';
export type Role = UserRole;

export interface SignupUser {
  id: string;
  type: MemberType;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: Role;
  };
}
