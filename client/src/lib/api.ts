import workflowSeed from '@/data/workflow.json';
import callsSeed from '@/data/calls.json';
import metricsSeed from '@/data/metrics.json';
import type {
  Workflow,
  Step,
  CallRecord,
  SummaryMetric,
  FlowSlice,
  CallDistribution,
  CallsHandledPoint,
  CallsHandledRange,
  DurationByDay,
} from '@revolab/shared';

const STORAGE_KEY = 'revolab:workflow:v1';
const FAKE_LATENCY_MS = 80;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), FAKE_LATENCY_MS));
}

function loadWorkflowFromStorage(): Workflow {
  if (typeof window === 'undefined') return workflowSeed as Workflow;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return workflowSeed as Workflow;
    const parsed = JSON.parse(raw) as Workflow;
    if (!parsed?.id || !Array.isArray(parsed.steps)) throw new Error('shape');
    return parsed;
  } catch {
    return workflowSeed as Workflow;
  }
}

function saveWorkflowToStorage(workflow: Workflow): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workflow));
}

export const api = {
  async listWorkflows(): Promise<Workflow[]> {
    return delay([loadWorkflowFromStorage()]);
  },

  async getWorkflow(id: string): Promise<Workflow> {
    const wf = loadWorkflowFromStorage();
    if (wf.id !== id) throw new Error(`Workflow not found: ${id}`);
    return delay(wf);
  },

  async updateStep(
    workflowId: string,
    stepId: string,
    patch: Partial<Pick<Step, 'title' | 'description'>>,
  ): Promise<Step> {
    const wf = loadWorkflowFromStorage();
    if (wf.id !== workflowId) throw new Error(`Workflow not found: ${workflowId}`);
    const idx = wf.steps.findIndex((s) => s.id === stepId);
    if (idx === -1) throw new Error(`Step not found: ${stepId}`);
    const current = wf.steps[idx]!;
    const next: Step = { ...current, ...patch };
    wf.steps[idx] = next;
    saveWorkflowToStorage(wf);
    return delay(next);
  },

  async moveStep(
    workflowId: string,
    stepId: string,
    position: { x: number; y: number },
  ): Promise<void> {
    const wf = loadWorkflowFromStorage();
    if (wf.id !== workflowId) throw new Error(`Workflow not found: ${workflowId}`);
    const idx = wf.steps.findIndex((s) => s.id === stepId);
    if (idx === -1) throw new Error(`Step not found: ${stepId}`);
    wf.steps[idx] = { ...wf.steps[idx]!, position };
    saveWorkflowToStorage(wf);
    return delay(undefined);
  },

  async getSummaryMetrics(): Promise<SummaryMetric[]> {
    return delay(metricsSeed.summary as SummaryMetric[]);
  },

  async getFlowDistribution(week: string): Promise<FlowSlice[]> {
    const map = metricsSeed.flowDistribution as Record<string, FlowSlice[]>;
    const data = map[week] ?? Object.values(map)[0]!;
    return delay(data);
  },

  async getCallDistribution(week: string): Promise<CallDistribution[]> {
    const map = metricsSeed.callDistribution as Record<string, CallDistribution[]>;
    const data = map[week] ?? Object.values(map)[0]!;
    return delay(data);
  },

  async getCallsHandled(range: CallsHandledRange): Promise<CallsHandledPoint[]> {
    const data = metricsSeed.callsHandled[range];
    return delay(data as CallsHandledPoint[]);
  },

  async getTotalDuration(
    week: string,
  ): Promise<{ totalSeconds: number; byDay: DurationByDay[] }> {
    const map = metricsSeed.duration as Record<
      string,
      { totalSeconds: number; byDay: DurationByDay[] }
    >;
    const data = map[week] ?? Object.values(map)[0]!;
    return delay(data);
  },

  async getRecentConversations(limit?: number): Promise<CallRecord[]> {
    const all = callsSeed as CallRecord[];
    return delay(typeof limit === 'number' ? all.slice(0, limit) : all);
  },
};
