import { API } from '@/constants/api-endpoints';
import { apiCall } from '@/core/api/api-helpers';
import { axiosInstance } from '@/core/api/client';
import type { DashboardSummary } from '../types/dashboard.types';

class DashboardService {
  summary = (): Promise<DashboardSummary> =>
    apiCall(() => axiosInstance.get<DashboardSummary>(API.DASHBOARD.SUMMARY));
}

export const dashboardService = new DashboardService();
