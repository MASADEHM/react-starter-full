import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import type { Role } from '@/constants/roles';
import { hasRole, selectSignedIn, useSessionStore } from '@/core/auth/session.store';
import { AccessDenied } from '@/shared/components/ui/EmptyState';

/** Sends anyone without a session to sign-in, remembering where they were going. */
export function RequireAuth() {
  const signedIn = useSessionStore(selectSignedIn);
  const { pathname } = useLocation();
  if (!signedIn) return <Navigate to={ROUTES.LOGIN} state={{ from: pathname }} replace />;
  return <Outlet />;
}

/** Refuses the screen unless the user holds one of the roles. A UX gate; the API is the boundary. */
export function RequireRole({ roles }: { roles: readonly Role[] }) {
  const user = useSessionStore((s) => s.user);
  if (!hasRole(user, roles)) return <AccessDenied />;
  return <Outlet />;
}
