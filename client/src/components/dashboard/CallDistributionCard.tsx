import { useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { useAsync } from '@/hooks/useAsync';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CardShell } from './CardShell';

const RANGES = ['Month · Jun-Jul 2025', 'Month · May-Jun 2025'] as const;

// Show business hours only — 9:00 through 17:00 inclusive
const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17];

export function CallDistributionCard() {
  const [range, setRange] = useState<(typeof RANGES)[number]>(RANGES[0]);
  const state = useAsync(() => api.getCallDistribution(range), [range]);

  const max = useMemo(() => {
    if (state.status !== 'ready') return 1;
    return Math.max(
      1,
      ...state.data.flatMap((d) => HOURS.map((h) => d.hourly[h] ?? 0)),
    );
  }, [state]);

  return (
    <CardShell
      title="Call Distribution"
      className="col-span-6"
      action={
        <Select
          value={range}
          onValueChange={(v) => setRange(v as (typeof RANGES)[number])}
        >
          <SelectTrigger className="h-8 w-[180px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RANGES.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      {state.status !== 'ready' ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="grid grid-cols-[auto_1fr] gap-x-3">
          {/* Top-left empty cell */}
          <div />

          {/* Day labels (top, x-axis) */}
          <div className="grid grid-cols-7 gap-2 pb-2 text-[11px] text-muted-foreground text-center">
            {state.data.map((d) => (
              <span key={d.day}>{d.day}</span>
            ))}
          </div>

          {/* Hour labels (left, y-axis) */}
          <div className="grid gap-1 text-[11px] text-muted-foreground tabular-nums pr-1 text-right">
            {HOURS.map((h) => (
              <span key={h} className="leading-[24px]">
                {h}:00
              </span>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="grid grid-cols-7 gap-2">
            {HOURS.map((h) => (
              <div key={h} className="contents">
                {state.data.map((day) => {
                  const value = day.hourly[h] ?? 0;
                  const intensity = value / max;
                  return (
                    <div
                      key={`${day.day}-${h}`}
                      className="h-6 rounded-md bg-chart-1"
                      style={{ opacity: 0.25 + intensity * 0.75 }}
                      title={`${day.day} ${h}:00 — ${value} calls`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </CardShell>
  );
}
