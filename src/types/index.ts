/** Global types. Enumerations are string-literal unions derived from constants, never TS enums. */
import type { Role } from '@/constants/roles';
import type { UserStatus } from '@/constants/statuses';

export type Id = string | number;

export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly roles: readonly Role[];
  readonly status: UserStatus;
  /** ISO date. */
  readonly createdAt: string;
}

export interface Paginated<T> {
  readonly items: readonly T[];
  readonly total: number;
}

export interface ApiErrorBody {
  readonly message?: string;
}
