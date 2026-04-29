import type { z } from 'zod';
import type {
  WorkflowSchema, StepSchema, StepKindSchema, OutcomeSchema, PositionSchema,
  StepPatchSchema,
  SummaryMetricSchema, SummaryMetricKeySchema,
  FlowSliceSchema, CallDistributionSchema, DayOfWeekSchema,
  CallsHandledRangeSchema, CallsHandledPointSchema,
  DurationByDaySchema, TotalDurationResponseSchema,
  CallStatusSchema, CallRecordSchema,
  ApiErrorSchema, ApiErrorCodeSchema,
} from './schemas';

export * from './schemas';

export type Workflow = z.infer<typeof WorkflowSchema>;
export type Step = z.infer<typeof StepSchema>;
export type StepKind = z.infer<typeof StepKindSchema>;
export type Outcome = z.infer<typeof OutcomeSchema>;
export type Position = z.infer<typeof PositionSchema>;
export type StepPatch = z.infer<typeof StepPatchSchema>;

export type SummaryMetric = z.infer<typeof SummaryMetricSchema>;
export type SummaryMetricKey = z.infer<typeof SummaryMetricKeySchema>;
export type FlowSlice = z.infer<typeof FlowSliceSchema>;
export type CallDistribution = z.infer<typeof CallDistributionSchema>;
export type DayOfWeek = z.infer<typeof DayOfWeekSchema>;
export type CallsHandledRange = z.infer<typeof CallsHandledRangeSchema>;
export type CallsHandledPoint = z.infer<typeof CallsHandledPointSchema>;
export type DurationByDay = z.infer<typeof DurationByDaySchema>;
export type TotalDurationResponse = z.infer<typeof TotalDurationResponseSchema>;

export type CallStatus = z.infer<typeof CallStatusSchema>;
export type CallRecord = z.infer<typeof CallRecordSchema>;

export type ApiErrorPayload = z.infer<typeof ApiErrorSchema>;
export type ApiErrorCode = z.infer<typeof ApiErrorCodeSchema>;
