import { useEffect, useMemo } from 'react';
import {
  Background,
  BackgroundVariant,
  MarkerType,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type NodeMouseHandler,
  type OnNodeDrag,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useWorkflowStore } from '@/stores/workflow';
import type { Step } from '@/types';
import { TriggerNode } from './TriggerNode';
import { ProcessNode } from './ProcessNode';
import { ZoomControls } from './ZoomControls';

const nodeTypes = {
  trigger: TriggerNode,
  process: ProcessNode,
};

function CanvasInner() {
  const workflow = useWorkflowStore((s) => s.workflow);
  const selectedStepId = useWorkflowStore((s) => s.selectedStepId);
  const selectStep = useWorkflowStore((s) => s.selectStep);
  const closePanel = useWorkflowStore((s) => s.closePanel);
  const moveStep = useWorkflowStore((s) => s.moveStep);

  const { fitView } = useReactFlow();

  const nodes: Node[] = useMemo(() => {
    if (!workflow) return [];
    return workflow.steps.map<Node>((s: Step) => ({
      id: s.id,
      type: s.kind === 'trigger' ? 'trigger' : 'process',
      position: s.position,
      data: { step: s },
      selected: s.id === selectedStepId,
    }));
  }, [workflow, selectedStepId]);

  const edges: Edge[] = useMemo(() => {
    if (!workflow) return [];
    return workflow.steps.flatMap<Edge>((s) =>
      s.connections.map((target) => ({
        id: `${s.id}->${target}`,
        source: s.id,
        target,
        type: 'default',
        markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--primary))' },
        style: { stroke: 'hsl(var(--primary))', strokeWidth: 1.5 },
      })),
    );
  }, [workflow]);

  useEffect(() => {
    if (!workflow) return;
    const id = requestAnimationFrame(() => {
      fitView({ padding: 0.2, duration: 0 });
    });
    return () => cancelAnimationFrame(id);
  }, [workflow, fitView]);

  const handleNodeClick: NodeMouseHandler = (_, node) => {
    selectStep(node.id);
  };

  const handleNodeDragStop: OnNodeDrag = (_, node) => {
    moveStep(node.id, node.position);
  };

  if (!workflow) return null;

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodeClick={handleNodeClick}
      onPaneClick={closePanel}
      onNodeDragStop={handleNodeDragStop}
      proOptions={{ hideAttribution: true }}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      defaultEdgeOptions={{ type: 'default' }}
      minZoom={0.4}
      maxZoom={1.6}
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="hsl(var(--border))" />
      <ZoomControls />
    </ReactFlow>
  );
}

export function WorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
