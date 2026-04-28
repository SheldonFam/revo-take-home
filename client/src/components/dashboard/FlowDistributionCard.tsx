import { useMemo, useState } from 'react';
import { Pie, PieChart, ResponsiveContainer, Cell } from 'recharts';
import { Calendar } from 'lucide-react';
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
import { formatPercent } from '@/lib/format';

const RANGES = ['Week · 12–19 Jul 2025', 'Week · 5–11 Jul 2025'] as const;

export function FlowDistributionCard() {
  const [range, setRange] = useState<(typeof RANGES)[number]>(RANGES[0]);
  const state = useAsync(() => api.getFlowDistribution(), []);

  const slices = useMemo(() => (state.status === 'ready' ? state.data : []), [state]);

  return (
    <CardShell
      title="Flows Distribution"
      className="col-span-6"
      action={
        <Select value={range} onValueChange={(v) => setRange(v as (typeof RANGES)[number])}>
          <SelectTrigger className="h-9 w-[220px] text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <SelectValue />
            </div>
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
        <Skeleton className="h-48 w-full" />
      ) : (
        <div className="flex items-center gap-6">
          <div className="h-44 w-44 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={slices}
                  dataKey="pct"
                  nameKey="flow"
                  innerRadius="65%"
                  outerRadius="100%"
                  stroke="none"
                  paddingAngle={0}
                  startAngle={90}
                  endAngle={-270}
                >
                  {slices.map((s) => (
                    <Cell key={s.flow} fill={s.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className="flex-1 space-y-2 text-sm">
            {slices.map((s) => (
              <li key={s.flow} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: s.color }}
                    aria-hidden
                  />
                  <span className="text-foreground">{s.flow}</span>
                </span>
                <span className="font-semibold tabular-nums" style={{ color: s.color }}>
                  {formatPercent(s.pct)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </CardShell>
  );
}
