import axios from 'axios';
import type { AxiosError } from 'axios';
import { env } from '@/config/env';
import { ROUTES } from '@/config/routes';
import { useSessionStore } from '@/core/auth/session.store';

export const axiosInstance = axios.create({ baseURL: env.apiUrl, timeout: 30_000 });

// The token is read per request, not once at module load, so a fresh sign-in is picked up.
axiosInstance.interceptors.request.use((config) => {
  const token = useSessionStore.getState().accessToken;
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});

// 401 means the session is gone: clear it and go to sign-in. 403 is left to the page, since it is
// an authorisation failure, not an authentication one. On the login page itself a 401 is the
// expected answer to a wrong password, so no redirect loop.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && !window.location.pathname.startsWith(ROUTES.LOGIN)) {
      useSessionStore.getState().signOut();
      window.location.assign(ROUTES.LOGIN);
    }
    return Promise.reject(error);
  },
);
