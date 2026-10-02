/** Public surface of shared. Features import from here. */
export { AppLayout } from './components/layout/AppLayout';
export { ErrorBoundary } from './components/layout/ErrorBoundary';
export { PageHeader } from './components/ui/PageHeader';
export { EmptyState, AccessDenied } from './components/ui/EmptyState';
export { StatusTag } from './components/ui/StatusTag';
export { KpiRow } from './components/ui/KpiRow';
export type { Kpi } from './components/ui/KpiRow';
export { BarList } from './components/ui/BarList';
export type { Bar } from './components/ui/BarList';
export { DataTable } from './components/ui/DataTable';
export { FilterChips } from './components/ui/FilterChips';
export type { FilterChip } from './components/ui/FilterChips';
export { FormDrawer, drawerStyles } from './components/ui/FormDrawer';
export { RequireAuth, RequireRole } from './guards/PrivateRoute';
export { useSearchParam } from './hooks/useSearchParam';
