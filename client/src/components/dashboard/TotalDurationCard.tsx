import { useMemo, useState } from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis } from 'recharts';
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

const WEEKS = [
  { key: '2026-W17', label: 'Week · 20–26 Apr 2026' },
  { key: '2026-W16', label: 'Week · 13–19 Apr 2026' },
] as const;

type WeekKey = (typeof WEEKS)[number]['key'];

export function TotalDurationCard() {
  const [week, setWeek] = useState<WeekKey>(WEEKS[0].key);
  const state = useAsync(() => api.getTotalDuration(week), [week]);

  const peak = useMemo(() => {
    if (state.status !== 'ready') return null;
    return state.data.byDay.reduce((acc, d) => (d.seconds > acc.seconds ? d : acc));
  }, [state]);

  return (
    <CardShell
      title="Total Duration"
      className="col-span-6"
      action={
        <Select value={week} onValueChange={(v) => setWeek(v as WeekKey)}>
          <SelectTrigger className="h-8 w-[180px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {WEEKS.map((w) => (
              <SelectItem key={w.key} value={w.key}>
                {w.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      {state.status !== 'ready' ? (
        <Skeleton className="h-32 w-full" />
      ) : (
        <div className="grid grid-cols-[auto_1fr] items-end gap-6">
          <div>
            <div className="text-3xl font-semibold tabular-nums">
              {state.data.totalSeconds}s
            </div>
            <div className="text-xs text-muted-foreground">this week</div>
          </div>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={state.data.byDay} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={axisTickStyle} />
                <Bar
                  dataKey="seconds"
                  radius={[6, 6, 0, 0]}
                  animationDuration={chartTheme.animationDuration}
                >
                  {state.data.byDay.map((d) => (
                    <Cell
                      key={d.day}
                      fill={chartTheme.colors.primary}
                      fillOpacity={d.day === peak?.day ? 1 : 0.35}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </CardShell>
  );
}
