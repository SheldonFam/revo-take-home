import { cn } from '@/lib/utils';
import type { CallStatus } from '@/types';

interface StatusBadgeProps {
  status: CallStatus;
  className?: string;
}

const COPY: Record<CallStatus, string> = {
  success: 'Success',
  hang_up: 'Hang Up',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
        status === 'success' && 'bg-success/15 text-success',
        status === 'hang_up' && 'bg-warning/15 text-warning',
        className,
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          status === 'success' ? 'bg-success' : 'bg-warning',
        )}
      />
      {COPY[status]}
    </span>
  );
}
