import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CallStatus } from '@revolab/shared';

interface StatusBadgeProps {
  status: CallStatus;
  className?: string;
}

const COPY: Record<CallStatus, string> = {
  success: 'Success',
  hang_up: 'Hang Up',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = status === 'success' ? 'success' : 'warning';
  return (
    <Badge variant={variant} className={cn('gap-1.5 font-medium', className)}>
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          status === 'success' ? 'bg-success' : 'bg-warning',
        )}
      />
      {COPY[status]}
    </Badge>
  );
}
