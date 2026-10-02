import type { Bar, Kpi } from '@/shared';

export interface DashboardSummary {
  readonly kpis: readonly Kpi[];
  readonly activity: readonly Bar[];
}
