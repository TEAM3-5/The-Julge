import { USER_ROLE, type UserRole } from '@/constants/auth';

export const getRedirectPathByRole = (role: UserRole): string => {
  switch (role) {
    case USER_ROLE.OWNER:
      return '/owner';
    case USER_ROLE.MEMBER:
      return '/member';
    default:
      return '/posts';
  }
};
