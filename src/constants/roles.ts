export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABEL: Readonly<Record<Role, string>> = {
  ADMIN: 'Administrator',
  USER: 'User',
};
