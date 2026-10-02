import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { Skeleton } from 'antd';
import { ROUTES } from '@/config/routes';
import { ROLES } from '@/constants/roles';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { AppLayout, ErrorBoundary, RequireAuth, RequireRole } from '@/shared';

// One chunk per feature. A feature's index is its public API; the router imports nothing deeper.
const LoginPage = lazy(() => import('@/features/auth').then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('@/features/dashboard').then((m) => ({ default: m.DashboardPage })));
const UsersPage = lazy(() => import('@/features/users').then((m) => ({ default: m.UsersPage })));

const chunk = (node: ReactNode) => (
  <ErrorBoundary>
    <Suspense fallback={<Skeleton active paragraph={{ rows: 8 }} />}>{node}</Suspense>
  </ErrorBoundary>
);

export const router = createBrowserRouter([
  { path: ROUTES.LOGIN, element: chunk(<LoginPage />) },
  {
    element: <RequireAuth />,
    children: [
      {
        path: ROUTES.HOME,
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to={ROUTES.DASHBOARD} replace /> },
          { path: ROUTES.DASHBOARD, element: chunk(<DashboardPage />) },
          {
            element: <RequireRole roles={[ROLES.ADMIN]} />,
            children: [
              { path: ROUTES.USERS, element: chunk(<UsersPage />) },
              // The drawer lives in the URL: `:id` is a record id or the literal `new`.
              { path: `${ROUTES.USERS}/:id`, element: chunk(<UsersPage />) },
            ],
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
