import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/query';
import type { Id, Paginated, User } from '@/types';
import { usersService } from '../services/users.service';
import type { UserInput } from '../types/users.types';

export const useUsers = (search: string) =>
  useQuery<Paginated<User>, Error>({
    queryKey: queryKeys.users.list(search),
    queryFn: () => usersService.list(search),
    placeholderData: (previous) => previous,
  });

export const useUser = (id: Id | undefined) =>
  useQuery<User, Error>({
    queryKey: queryKeys.users.detail(id ?? ''),
    queryFn: () => usersService.getById(id ?? ''),
    enabled: id !== undefined,
  });

/** Every write invalidates the whole `users` tree: list and detail caches both change. */
function useInvalidateUsers() {
  const client = useQueryClient();
  return () => client.invalidateQueries({ queryKey: queryKeys.users.all });
}

export const useCreateUser = () => {
  const invalidate = useInvalidateUsers();
  return useMutation<User, Error, UserInput>({ mutationFn: usersService.create, onSuccess: invalidate });
};

export const useUpdateUser = () => {
  const invalidate = useInvalidateUsers();
  return useMutation<User, Error, { id: Id; input: Partial<UserInput> }>({
    mutationFn: ({ id, input }) => usersService.update(id, input),
    onSuccess: invalidate,
  });
};

export const useDeleteUser = () => {
  const invalidate = useInvalidateUsers();
  return useMutation<void, Error, Id>({ mutationFn: usersService.remove, onSuccess: invalidate });
};
