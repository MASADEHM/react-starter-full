import { API } from '@/constants/api-endpoints';
import { apiCall } from '@/core/api/api-helpers';
import { axiosInstance } from '@/core/api/client';
import type { User } from '@/types';
import type { LoginRequest, LoginResponse } from '../types/auth.types';

class AuthService {
  login = (request: LoginRequest): Promise<LoginResponse> =>
    apiCall(() => axiosInstance.post<LoginResponse>(API.AUTH.LOGIN, request));

  me = (): Promise<User> => apiCall(() => axiosInstance.get<User>(API.AUTH.ME));
}

export const authService = new AuthService();
