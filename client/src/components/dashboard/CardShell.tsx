import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CardShellProps {
  title?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function CardShell({ title, action, className, children }: CardShellProps) {
  return (
    <Card className={cn('rounded-xl border-border p-5 shadow-none', className)}>
      {(title || action) && (
        <header className="mb-4 flex items-center justify-between">
          {title && (
            <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {title}
            </h3>
          )}
          {action}
        </header>
      )}
      {children}
    </Card>
  );
}
