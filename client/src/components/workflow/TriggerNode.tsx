import { Handle, Position, type NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';
import type { Step } from '@/types';
import { nodeVisual } from './nodeIcon';

type TriggerNodeData = { step: Step };

export function TriggerNode({ data, selected }: NodeProps<{ data: TriggerNodeData }>) {
  const step = (data as TriggerNodeData).step;
  const { Icon, tone } = nodeVisual(step);

  return (
    <>
      <div
        className={cn(
          'flex items-center gap-2 rounded-full border bg-card py-1.5 pl-1.5 pr-4 transition-colors',
          selected
            ? 'border-primary/70 ring-1 ring-primary/40'
            : 'border-border hover:border-border/80',
        )}
      >
        <div className={cn('flex h-6 w-6 items-center justify-center rounded-full', tone)}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-sm font-semibold text-foreground">{step.title}</span>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border-0 !bg-primary"
      />
    </>
  );
}
