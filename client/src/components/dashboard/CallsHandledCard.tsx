import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { api } from '@/lib/api';
import { useAsync } from '@/hooks/useAsync';
import { axisTickStyle, chartTheme } from '@/lib/chartTheme';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CardShell } from './CardShell';
import type { CallsHandledRange } from '@/types';

const RANGES: { value: CallsHandledRange; label: string; sublabel: string }[] = [
  { value: 'today', label: 'Today', sublabel: 'calls today' },
  { value: '7d', label: 'Last 7 days', sublabel: 'calls last 7 days' },
  { value: '30d', label: 'Last 30 days', sublabel: 'calls last 30 days' },
];

export function CallsHandledCard() {
  const [range, setRange] = useState<CallsHandledRange>('today');
  const state = useAsync(() => api.getCallsHandled(range), [range]);

  const total = useMemo(() => {
    if (state.status !== 'ready') return 0;
    return state.data.reduce((acc, d) => acc + d.successful + d.unsuccessful, 0);
  }, [state]);

  const sublabel = RANGES.find((r) => r.value === range)?.sublabel ?? '';

  return (
    <CardShell
      title="Calls Handled"
      className="col-span-6"
      action={
        <Select value={range} onValueChange={(v) => setRange(v as CallsHandledRange)}>
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RANGES.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      {state.status !== 'ready' ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <>
          <div className="mb-2 flex items-baseline gap-3">
            <div className="text-3xl font-semibold tabular-nums">{total}</div>
            <div className="text-xs text-muted-foreground">{sublabel}</div>
          </div>
          <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-chart-1" /> Successful
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-chart-2" /> Unsuccessful
            </span>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={state.data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="successFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartTheme.colors.primary} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={chartTheme.colors.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={chartTheme.colors.grid} vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={axisTickStyle} hide />
                <YAxis axisLine={false} tickLine={false} tick={axisTickStyle} width={28} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: `1px solid hsl(var(--border))`,
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="successful"
                  stroke={chartTheme.colors.primary}
                  strokeWidth={2}
                  fill="url(#successFill)"
                  isAnimationActive
                  animationDuration={chartTheme.animationDuration}
                />
                <Area
                  type="monotone"
                  dataKey="unsuccessful"
                  stroke={chartTheme.colors.secondary}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fill="transparent"
                  isAnimationActive
                  animationDuration={chartTheme.animationDuration}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </CardShell>
  );
}
