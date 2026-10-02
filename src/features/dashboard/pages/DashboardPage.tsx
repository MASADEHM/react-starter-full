import { Alert, Skeleton } from 'antd';
import { apiMessage } from '@/core/api/api-helpers';
import { useSessionStore } from '@/core/auth/session.store';
import { BarList, KpiRow, PageHeader } from '@/shared';
import { useDashboardSummary } from '../hooks/useDashboard';

export function DashboardPage() {
  const user = useSessionStore((s) => s.user);
  const { data, isPending, error } = useDashboardSummary();

  return (
    <div className="page-enter">
      <PageHeader kicker="Overview" title={`Welcome back, ${user?.name.split(' ')[0] ?? ''}`} description="A summary of what is in the system today." />
      {error && <Alert type="error" showIcon message={apiMessage(error)} style={{ marginBottom: 16 }} />}
      {isPending ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : data && (
        <>
          <KpiRow items={data.kpis} />
          <div className="chart-grid">
            <BarList title="Sign-ins this week" bars={data.activity} />
          </div>
        </>
      )}
    </div>
  );
}
