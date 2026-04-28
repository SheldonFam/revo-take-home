import { Maximize2, Minus, Move, Plus } from 'lucide-react';
import { Panel, useReactFlow } from '@xyflow/react';
import { useWorkflowStore } from '@/stores/workflow';
import { cn } from '@/lib/utils';

export function ZoomControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const selectedStepId = useWorkflowStore((s) => s.selectedStepId);

  if (selectedStepId) return null;

  return (
    <Panel position="top-right" className="!m-4">
      <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card/90 backdrop-blur">
        <ControlButton onClick={() => zoomIn({ duration: 150 })} label="Zoom in">
          <Plus className="h-4 w-4" />
        </ControlButton>
        <ControlButton onClick={() => zoomOut({ duration: 150 })} label="Zoom out">
          <Minus className="h-4 w-4" />
        </ControlButton>
        <ControlButton onClick={() => fitView({ padding: 0.2, duration: 200 })} label="Fit to view">
          <Maximize2 className="h-4 w-4" />
        </ControlButton>
        <ControlButton onClick={() => fitView({ padding: 0.4, duration: 200 })} label="Reset view" border={false}>
          <Move className="h-4 w-4" />
        </ControlButton>
      </div>
    </Panel>
  );
}

interface ControlButtonProps {
  onClick: () => void;
  label: string;
  border?: boolean;
  children: React.ReactNode;
}

function ControlButton({ onClick, label, border = true, children }: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
        border && 'border-b border-border',
      )}
    >
      {children}
    </button>
  );
}
