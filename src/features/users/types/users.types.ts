import type { Role } from '@/constants/roles';
import type { UserStatus } from '@/constants/statuses';

export interface UserInput {
  name: string;
  email: string;
  roles: Role[];
  status: UserStatus;
}
