export type MemberType = 'employee' | 'employer';

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
    type: MemberType;
  };
}
