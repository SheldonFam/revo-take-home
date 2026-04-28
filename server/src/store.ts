import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  WorkflowSchema,
  StepSchema,
  type Workflow,
  type Step,
  type StepPatch,
  type CallsHandledRange,
  type TotalDurationResponse,
  type CallRecord,
  type SummaryMetric,
  type FlowSlice,
  type CallDistribution,
  type CallsHandledPoint,
} from '@revolab/shared';
import callsSeed from './data/calls.json' with { type: 'json' };
import metricsSeed from './data/metrics.json' with { type: 'json' };
import workflowSeed from './data/workflow-seed.json' with { type: 'json' };
import { NotFoundError } from './errors.js';

// store.ts lives at server/src/store.ts; __dirname → server/src
// '..' goes up to server/, then 'data' lands on server/data — the
// gitignored writable runtime location.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'workflows.json');
const DB_TMP = `${DB_FILE}.tmp`;

function loadOrSeed(): Workflow[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = WorkflowSchema.array().parse(JSON.parse(raw));
      return parsed;
    }
  } catch (err) {
    console.warn(
      `[store] workflows.json failed to load (${(err as Error).message}); falling back to seed`,
    );
  }
  const seeded = WorkflowSchema.array().parse([workflowSeed]);
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(seeded, null, 2), 'utf8');
  return seeded;
}

let workflows: Workflow[] = loadOrSeed();

function persist(): void {
  fs.writeFileSync(DB_TMP, JSON.stringify(workflows, null, 2), 'utf8');
  fs.renameSync(DB_TMP, DB_FILE);
}

function getWorkflow(id: string): Workflow {
  const w = workflows.find((w) => w.id === id);
  if (!w) throw new NotFoundError(`Workflow ${id} not found`);
  return w;
}

function updateStep(workflowId: string, stepId: string, patch: StepPatch): Step {
  const w = getWorkflow(workflowId);
  const idx = w.steps.findIndex((s) => s.id === stepId);
  if (idx === -1) throw new NotFoundError(`Step ${stepId} not found`);
  const current = w.steps[idx]!;
  const next: Step = StepSchema.parse({ ...current, ...patch });
  w.steps[idx] = next;
  persist();
  return next;
}

function getTotalDuration(key: string): TotalDurationResponse {
  const map = metricsSeed.duration as Record<string, TotalDurationResponse>;
  const data = map[key];
  if (!data) throw new NotFoundError(`Duration data for ${key} not found`);
  return data;
}

export const store = {
  getWorkflow,
  updateStep,
  getTotalDuration,
  getSummaryMetrics: (): SummaryMetric[] => metricsSeed.summary as SummaryMetric[],
  getFlowDistribution: (key: string): FlowSlice[] => {
    const map = metricsSeed.flowDistribution as Record<string, FlowSlice[]>;
    return map[key] ?? [];
  },
  getCallDistribution: (key: string): CallDistribution[] => {
    const map = metricsSeed.callDistribution as Record<string, CallDistribution[]>;
    return map[key] ?? [];
  },
  getCallsHandled: (range: CallsHandledRange): CallsHandledPoint[] => {
    const map = metricsSeed.callsHandled as Record<CallsHandledRange, CallsHandledPoint[]>;
    return map[range] ?? [];
  },
  getRecentConversations: (limit?: number): CallRecord[] => {
    const all = callsSeed as CallRecord[];
    return typeof limit === 'number' ? all.slice(0, limit) : all;
  },
};
