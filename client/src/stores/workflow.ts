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
          const { selectedStepId } = get();
          const stillExists =
            selectedStepId !== null && workflow.steps.some((s) => s.id === selectedStepId);
          set({
            workflow,
            loading: false,
            selectedStepId: stillExists ? selectedStepId : null,
          });
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
        const before = wf.steps.find((s) => s.id === stepId);
        if (!before) return;
        const previous: Partial<Pick<Step, 'title' | 'description'>> = {};
        for (const key of Object.keys(patch) as Array<keyof typeof patch>) {
          previous[key] = before[key];
        }

        set({
          workflow: {
            ...wf,
            steps: wf.steps.map((s) => (s.id === stepId ? { ...s, ...patch } : s)),
          },
        });

        try {
          await api.updateStep(wf.id, stepId, patch);
        } catch (error) {
          set((state) => {
            if (!state.workflow) return state;
            return {
              workflow: {
                ...state.workflow,
                steps: state.workflow.steps.map((s) => {
                  if (s.id !== stepId) return s;
                  const restored = { ...s };
                  for (const key of Object.keys(patch) as Array<keyof typeof patch>) {
                    if (restored[key] === patch[key]) {
                      restored[key] = previous[key]!;
                    }
                  }
                  return restored;
                }),
              },
              error: error instanceof Error ? error.message : String(error),
            };
          });
        }
      },

      moveStep: async (stepId, position) => {
        const wf = get().workflow;
        if (!wf) return;
        const before = wf.steps.find((s) => s.id === stepId);
        if (!before) return;
        const previousPosition = before.position;

        set({
          workflow: {
            ...wf,
            steps: wf.steps.map((s) => (s.id === stepId ? { ...s, position } : s)),
          },
        });

        try {
          await api.moveStep(wf.id, stepId, position);
        } catch (error) {
          set((state) => {
            if (!state.workflow) return state;
            return {
              workflow: {
                ...state.workflow,
                steps: state.workflow.steps.map((s) =>
                  s.id === stepId && s.position === position
                    ? { ...s, position: previousPosition }
                    : s,
                ),
              },
              error: error instanceof Error ? error.message : String(error),
            };
          });
        }
      },
    }),
    {
      name: 'revolab:workflowStore:v2',
      partialize: (state) => ({ selectedStepId: state.selectedStepId }),
    },
  ),
);
