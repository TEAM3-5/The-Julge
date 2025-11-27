export const USER_ROLE = {
  OWNER: 'owner',
  MEMBER: 'member',
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE]; // 'owner' | 'member'
