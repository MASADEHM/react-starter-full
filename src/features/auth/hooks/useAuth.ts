import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import type { Role } from '@/constants/roles';
import { hasRole, useSessionStore } from '@/core/auth/session.store';
import { authService } from '../services/auth.service';
import type { LoginRequest, LoginResponse } from '../types/auth.types';

/** Auth state and the two actions. The session itself lives in core so guards and layout can read it. */
export function useAuth() {
  const user = useSessionStore((s) => s.user);
  const signIn = useSessionStore((s) => s.signIn);
  const signOut = useSessionStore((s) => s.signOut);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const login = useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: (request) => authService.login(request),
    onSuccess: ({ user: signedInUser, accessToken }) => signIn(signedInUser, accessToken),
  });

  const logout = () => {
    signOut();
    queryClient.clear();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return {
    user,
    isSignedIn: user !== null,
    hasRole: (...roles: Role[]) => hasRole(user, roles),
    login,
    logout,
  };
}
