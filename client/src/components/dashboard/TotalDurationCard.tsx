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

const WEEKS = ['Week 14-20 of 2026', 'Week 7-13 of 2026'] as const;

export function TotalDurationCard() {
  const [week, setWeek] = useState<(typeof WEEKS)[number]>(WEEKS[0]);
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
        <Select value={week} onValueChange={(v) => setWeek(v as (typeof WEEKS)[number])}>
          <SelectTrigger className="h-8 w-[180px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {WEEKS.map((w) => (
              <SelectItem key={w} value={w}>
                {w}
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
            <div className="text-xs text-muted-foreground">peak this week</div>
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
