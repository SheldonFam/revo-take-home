import { Triangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SummaryMetric } from '@revolab/shared';
import { formatTrend } from '@/lib/format';

interface KPICardProps {
  metric: SummaryMetric;
}

export function KPICard({ metric }: KPICardProps) {
  const isUp = metric.trendPct >= 0;
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {metric.label}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-3xl font-semibold tabular-nums">
          {new Intl.NumberFormat().format(metric.value)}
        </div>
        <div className="text-sm text-muted-foreground">{metric.subLabel}</div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
            isUp ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive',
          )}
        >
          <Triangle
            className={cn('h-2.5 w-2.5 fill-current', !isUp && 'rotate-180')}
            strokeWidth={0}
          />
          {formatTrend(metric.trendPct)}
        </span>
        <span className="text-xs text-muted-foreground">vs last week</span>
      </div>
    </div>
  );
}
