import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardShellProps {
  title?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function CardShell({ title, action, className, children }: CardShellProps) {
  return (
    <section className={cn('rounded-xl border border-border bg-card p-5', className)}>
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
    </section>
  );
}
