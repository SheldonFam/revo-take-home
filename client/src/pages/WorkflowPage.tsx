import { useEffect } from 'react';
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas';
import { useWorkflowStore } from '@/stores/workflow';

const DEFAULT_WORKFLOW_ID = 'wf_inbound';

export default function WorkflowPage() {
  const workflow = useWorkflowStore((s) => s.workflow);
  const load = useWorkflowStore((s) => s.load);

  useEffect(() => {
    if (!workflow || workflow.id !== DEFAULT_WORKFLOW_ID) {
      void load(DEFAULT_WORKFLOW_ID);
    }
  }, [workflow, load]);

  return (
    <div className="relative h-full w-full">
      <WorkflowCanvas />
    </div>
  );
}
