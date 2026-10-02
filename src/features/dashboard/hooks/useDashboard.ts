import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/query';
import { dashboardService } from '../services/dashboard.service';
import type { DashboardSummary } from '../types/dashboard.types';

export const useDashboardSummary = () =>
  useQuery<DashboardSummary, Error>({ queryKey: queryKeys.dashboard.summary, queryFn: dashboardService.summary });
