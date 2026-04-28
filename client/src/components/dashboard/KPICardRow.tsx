import { api } from '@/lib/api';
import { useAsync } from '@/hooks/useAsync';
import { Skeleton } from '@/components/ui/skeleton';
import { KPICard } from './KPICard';

export function KPICardRow() {
  const state = useAsync(() => api.getSummaryMetrics(), []);

  if (state.status !== 'ready') {
    return (
      <div className="col-span-12 grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="col-span-12 grid grid-cols-4 gap-4">
      {state.data.map((m) => (
        <KPICard key={m.key} metric={m} />
      ))}
    </div>
  );
}
