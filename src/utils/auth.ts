import type { UserRole } from '@/constants/auth';

export const getRedirectPathByRole = (role: UserRole): string => {
  switch (role) {
    case 'owner':
      return '/owner';
    case 'member':
      return '/member';
    default:
      return '/posts';
  }
};
