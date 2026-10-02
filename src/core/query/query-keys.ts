import type { Id } from '@/types';

/**
 * Hierarchical query keys. Invalidating a parent (`users.all`) also invalidates every child.
 * Always reference keys through this factory, never inline arrays.
 */
export const queryKeys = {
  auth: { me: ['auth', 'me'] as const },
  dashboard: { summary: ['dashboard', 'summary'] as const },
  users: {
    all: ['users'] as const,
    list: (search: string) => ['users', 'list', search] as const,
    detail: (id: Id) => ['users', 'detail', id] as const,
  },
} as const;
