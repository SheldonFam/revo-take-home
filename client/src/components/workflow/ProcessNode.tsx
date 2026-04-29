import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import type { Step } from '@revolab/shared';
import { StepCard } from './StepCard';

export type ProcessNodeType = Node<{ step: Step }, 'process'>;

export function ProcessNode({ data, selected }: NodeProps<ProcessNodeType>) {
  const { step } = data;
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
