import { API } from '@/constants/api-endpoints';
import { apiCall } from '@/core/api/api-helpers';
import { axiosInstance } from '@/core/api/client';
import type { Id, Paginated, User } from '@/types';
import type { UserInput } from '../types/users.types';

class UsersService {
  list = (search: string): Promise<Paginated<User>> =>
    apiCall(() => axiosInstance.get<Paginated<User>>(API.USERS.ROOT, { params: search ? { search } : {} }));

  getById = (id: Id): Promise<User> => apiCall(() => axiosInstance.get<User>(API.USERS.BY_ID(id)));

  create = (input: UserInput): Promise<User> => apiCall(() => axiosInstance.post<User>(API.USERS.ROOT, input));

  update = (id: Id, input: Partial<UserInput>): Promise<User> =>
    apiCall(() => axiosInstance.put<User>(API.USERS.BY_ID(id), input));

  remove = (id: Id): Promise<void> => apiCall(() => axiosInstance.delete<void>(API.USERS.BY_ID(id)));
}

export const usersService = new UsersService();
