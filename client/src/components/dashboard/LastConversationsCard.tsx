import { ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import { useAsync } from '@/hooks/useAsync';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CardShell } from './CardShell';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatTimeAgo } from '@/lib/format';

export function LastConversationsCard() {
  const state = useAsync(() => api.getRecentConversations(8), []);

  return (
    <CardShell
      title="Last Conversations"
      className="col-span-6"
      action={
        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
          Show more <ChevronRight className="h-3 w-3" />
        </Button>
      }
    >
      {state.status !== 'ready' ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-muted-foreground">
              <th className="pb-2 text-left font-medium">Flow</th>
              <th className="pb-2 text-left font-medium">Subscription</th>
              <th className="pb-2 text-left font-medium">Time</th>
              <th className="pb-2 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {state.data.map((row) => (
              <tr key={row.id} className="border-t border-border">
                <td className="py-2 text-foreground">{row.flow}</td>
                <td className="py-2 text-muted-foreground tabular-nums">{row.subscription}</td>
                <td className="py-2 text-muted-foreground">{formatTimeAgo(row.occurredAt)}</td>
                <td className="py-2">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </CardShell>
  );
}
