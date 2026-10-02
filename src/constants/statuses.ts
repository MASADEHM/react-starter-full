export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INVITED: 'INVITED',
  DISABLED: 'DISABLED',
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];
