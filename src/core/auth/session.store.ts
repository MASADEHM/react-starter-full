import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Role } from '@/constants/roles';
import type { User } from '@/types';

interface SessionState {
  readonly user: User | null;
  readonly accessToken: string | null;
  signIn: (user: User, accessToken: string) => void;
  signOut: () => void;
}

/**
 * The signed-in session. Read by the axios interceptor (token), the guards and the layout
 * (user, roles). Written only by the auth feature. Persisted so a reload keeps the session.
 */
export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      signIn: (user, accessToken) => set({ user, accessToken }),
      signOut: () => set({ user: null, accessToken: null }),
    }),
    {
      // Bump when the stored shape changes; older entries are then discarded.
      name: 'app-session-v1',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const selectSignedIn = (s: SessionState): boolean => s.user !== null;

/** True when the user holds any of the roles. A UX gate only: the API enforces authorisation. */
export const hasRole = (user: User | null, roles: readonly Role[]): boolean =>
  user !== null && roles.some((r) => user.roles.includes(r));
