import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Step } from '@revolab/shared';
import { nodeVisual } from './nodeIcon';

interface StepCardProps {
  step: Step;
  selected?: boolean;
}

export function StepCard({ step, selected }: StepCardProps) {
  const { Icon, tone } = nodeVisual(step);

  return (
    <div
      className={cn(
        'w-[180px] rounded-xl border bg-card px-3.5 py-3 transition-colors',
        selected
          ? 'border-primary/70 ring-1 ring-primary/40'
          : 'border-border hover:border-border/80',
      )}
    >
      <div className={cn('flex h-6 w-6 items-center justify-center rounded-md', tone)}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="mt-2 text-sm font-semibold leading-tight text-foreground">
        {step.title}
      </div>
      <div className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">
        {step.description}
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <ThumbsUp className="h-3 w-3" />
          <span className="tabular-nums">{step.likes}</span>
        </span>
        <span className="flex items-center gap-1">
          <ThumbsDown className="h-3 w-3" />
          <span className="tabular-nums">{step.dislikes}</span>
        </span>
      </div>
    </div>
  );
}
