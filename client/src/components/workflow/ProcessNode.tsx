import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { Step } from '@/types';
import { StepCard } from './StepCard';

type ProcessNodeData = { step: Step };

export function ProcessNode({ data, selected }: NodeProps<{ data: ProcessNodeData }>) {
  const step = (data as ProcessNodeData).step;
  const hasOutgoing = step.connections.length > 0;
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !border-0 !bg-muted-foreground/60"
      />
      <StepCard step={step} selected={selected} />
      {hasOutgoing && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!h-2 !w-2 !border-0 !bg-primary"
        />
      )}
    </>
  );
}
