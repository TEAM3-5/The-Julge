export type UserRole = 'owner' | 'member';

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
