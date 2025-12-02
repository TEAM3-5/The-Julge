import { USER_ROLE, type UserRole } from '@/constants/auth';

export const getRedirectPathByRole = (role: UserRole): string => {
  switch (role) {
    case USER_ROLE.OWNER:
      return '/owner/notice';
    case USER_ROLE.MEMBER:
      return '/member/notice';
    default:
      return '/guest/notice';
  }
};
