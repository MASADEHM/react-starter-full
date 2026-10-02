import type { Id } from '@/types';

/** Paths relative to `env.apiUrl`. The axios instance carries the base URL. */
export const API = {
  AUTH: { LOGIN: '/auth/login', ME: '/auth/me' },
  DASHBOARD: { SUMMARY: '/dashboard/summary' },
  USERS: { ROOT: '/users', BY_ID: (id: Id) => `/users/${String(id)}` },
} as const;
