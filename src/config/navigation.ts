import type { ComponentType } from 'react';
import { DashboardOutlined, TeamOutlined } from '@ant-design/icons';
import { ROLES } from '@/constants/roles';
import type { Role } from '@/constants/roles';
import { ROUTES } from './routes';

export interface NavItem {
  readonly label: string;
  readonly to: string;
  readonly icon: ComponentType;
  /** Omit for every signed-in role. The guard on the route reads the same list. */
  readonly roles?: readonly Role[];
}

/** What the side rail offers. One entry per feature landing screen. */
export const NAVIGATION: readonly NavItem[] = [
  { label: 'Dashboard', to: ROUTES.DASHBOARD, icon: DashboardOutlined },
  { label: 'Users', to: ROUTES.USERS, icon: TeamOutlined, roles: [ROLES.ADMIN] },
];
