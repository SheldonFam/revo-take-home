import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';
import type { Step, Workflow } from '@/types';

interface WorkflowState {
  workflow: Workflow | null;
  selectedStepId: string | null;
  loading: boolean;
  error: string | null;

  load: (id: string) => Promise<void>;
  selectStep: (id: string | null) => void;
  closePanel: () => void;
  updateStep: (
    stepId: string,
    patch: Partial<Pick<Step, 'title' | 'description'>>,
  ) => Promise<void>;
  moveStep: (stepId: string, position: { x: number; y: number }) => Promise<void>;
}

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      workflow: null,
      selectedStepId: null,
      loading: false,
      error: null,

      load: async (id) => {
        set({ loading: true, error: null });
        try {
          const workflow = await api.getWorkflow(id);
          set({ workflow, loading: false });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      },

      selectStep: (id) => set({ selectedStepId: id }),
      closePanel: () => set({ selectedStepId: null }),

      updateStep: async (stepId, patch) => {
        const wf = get().workflow;
        if (!wf) return;
        const optimistic: Workflow = {
          ...wf,
          steps: wf.steps.map((s) => (s.id === stepId ? { ...s, ...patch } : s)),
        };
        set({ workflow: optimistic });
        try {
          await api.updateStep(wf.id, stepId, patch);
        } catch (error) {
          set({
            workflow: wf,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      },

      moveStep: async (stepId, position) => {
        const wf = get().workflow;
        if (!wf) return;
        const optimistic: Workflow = {
          ...wf,
          steps: wf.steps.map((s) => (s.id === stepId ? { ...s, position } : s)),
        };
        set({ workflow: optimistic });
        try {
          await api.moveStep(wf.id, stepId, position);
        } catch (error) {
          set({
            workflow: wf,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      },
    }),
    {
      name: 'revolab:workflowStore:v1',
      partialize: (state) => ({
        workflow: state.workflow,
        selectedStepId: state.selectedStepId,
      }),
    },
  ),
);
