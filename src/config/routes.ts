import type { Id } from '@/types';

/** Single source of truth for application routes. */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  /** `ROUTES.USER('new')` opens the create drawer; an id opens that record. Drawers live in the URL so they are linkable. */
  USER: (id: Id) => `/users/${String(id)}`,
} as const;
