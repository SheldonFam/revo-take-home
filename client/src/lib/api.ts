import {
  WorkflowSchema,
  StepSchema,
  StepPatchSchema,
  SummaryMetricSchema,
  FlowSliceSchema,
  CallDistributionSchema,
  CallsHandledPointSchema,
  TotalDurationResponseSchema,
  CallRecordSchema,
  ApiErrorSchema,
  type StepPatch,
  type CallsHandledRange,
  type Position,
} from '@revolab/shared';
import { z } from 'zod';
import { ApiError } from './apiError';

const API_BASE = '/api/v1';

async function readError(res: Response): Promise<ApiError> {
  try {
    const parsed = ApiErrorSchema.parse(await res.json());
    return new ApiError(
      parsed.error.message,
      parsed.error.code,
      res.status,
      parsed.error.fields,
    );
  } catch {
    return new ApiError(`HTTP ${res.status}`, 'internal_error', res.status);
  }
}

async function get<T>(path: string, schema: z.ZodSchema<T>): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw await readError(res);
  return schema.parse(await res.json());
}

async function patch<T>(
  path: string,
  body: unknown,
  schema: z.ZodSchema<T>,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await readError(res);
  return schema.parse(await res.json());
}

export const api = {
  getWorkflow: (id: string) => get(`/workflows/${id}`, WorkflowSchema),

  updateStep: (
    workflowId: string,
    stepId: string,
    patch_: Pick<StepPatch, 'title' | 'description'>,
  ) =>
    patch(
      `/workflows/${workflowId}/steps/${stepId}`,
      patch_,
      StepSchema,
    ),

  moveStep: (workflowId: string, stepId: string, position: Position) =>
    patch(
      `/workflows/${workflowId}/steps/${stepId}`,
      { position },
      StepSchema,
    ),

  getSummaryMetrics: () => get('/analytics/summary', SummaryMetricSchema.array()),

  getFlowDistribution: (week: string) =>
    get(
      `/analytics/flow-distribution?week=${encodeURIComponent(week)}`,
      FlowSliceSchema.array(),
    ),

  getCallDistribution: (month: string) =>
    get(
      `/analytics/call-distribution?month=${encodeURIComponent(month)}`,
      CallDistributionSchema.array(),
    ),

  getCallsHandled: (range: CallsHandledRange) =>
    get(
      `/analytics/calls-handled?range=${encodeURIComponent(range)}`,
      CallsHandledPointSchema.array(),
    ),

  getTotalDuration: (week: string) =>
    get(
      `/analytics/total-duration?week=${encodeURIComponent(week)}`,
      TotalDurationResponseSchema,
    ),

  getRecentConversations: (limit?: number) =>
    get(
      typeof limit === 'number' ? `/calls?limit=${limit}` : '/calls',
      CallRecordSchema.array(),
    ),
};

// StepPatchSchema is exported here so callers (e.g. tests, devtools) can
// validate patches client-side before sending. Not used by the api object
// itself — server is the validation source of truth.
export { StepPatchSchema };
