import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import { useAsync } from '@/hooks/useAsync';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CardShell } from './CardShell';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatTimeAgo } from '@/lib/format';
import { useSearchStore } from '@/stores/search';

const COLLAPSED_LIMIT = 8;

export function LastConversationsCard() {
  const [expanded, setExpanded] = useState(false);
  const state = useAsync(() => api.getRecentConversations(), []);
  const query = useSearchStore((s) => s.query);

  const filtered = useMemo(() => {
    if (state.status !== 'ready') return [];
    const q = query.trim().toLowerCase();
    if (!q) return state.data;
    return state.data.filter((row) => {
      const status = row.status.replace('_', ' ').toLowerCase();
      return (
        row.flow.toLowerCase().includes(q) ||
        row.subscription.toLowerCase().includes(q) ||
        status.includes(q)
      );
    });
  }, [state, query]);

  const rows = expanded ? filtered : filtered.slice(0, COLLAPSED_LIMIT);
  const canExpand = filtered.length > COLLAPSED_LIMIT;

  return (
    <CardShell
      title="Last Conversations"
      className="col-span-6"
      action={
        canExpand ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? (
              <>
                Show less <ChevronDown className="h-3 w-3 rotate-180" />
              </>
            ) : (
              <>
                Show more <ChevronRight className="h-3 w-3" />
              </>
            )}
          </Button>
        ) : null
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
            {rows.length === 0 ? (
              <tr className="border-t border-border">
                <td colSpan={4} className="py-6 text-center text-muted-foreground">
                  {query.trim()
                    ? `No conversations match "${query.trim()}"`
                    : 'No conversations yet'}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-border">
                  <td className="py-2 text-foreground">{row.flow}</td>
                  <td className="py-2 text-muted-foreground tabular-nums">{row.subscription}</td>
                  <td className="py-2 text-muted-foreground">{formatTimeAgo(row.occurredAt)}</td>
                  <td className="py-2">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </CardShell>
  );
}
