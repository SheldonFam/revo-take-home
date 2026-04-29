import { z } from 'zod';

// ── Workflow / Step ──────────────────────────────────────────

export const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const OutcomeSchema = z.object({
  label: z.string(),
  icon: z.string(),
});

export const StepKindSchema = z.enum(['trigger', 'process', 'terminal']);

export const StepSchema = z.object({
  id: z.string(),
  kind: StepKindSchema,
  title: z.string(),
  description: z.string(),
  position: PositionSchema,
  primaryOutcome: OutcomeSchema.nullable(),
  secondaryOutcome: OutcomeSchema.nullable(),
  connections: z.array(z.string()),
  likes: z.number().int().nonnegative(),
  dislikes: z.number().int().nonnegative(),
});

export const WorkflowSchema = z.object({
  id: z.string(),
  name: z.string(),
  steps: z.array(StepSchema),
});

// PATCH body — at least one of title/description/position required.
export const StepPatchSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    position: PositionSchema.optional(),
  })
  .refine((o) => Object.values(o).some((v) => v !== undefined), {
    message: 'At least one of title, description, or position is required',
  });

// ── Analytics ────────────────────────────────────────────────

export const SummaryMetricKeySchema = z.enum([
  'foodDelivery',
  'tableReservation',
  'paymentProcessing',
  'otherFlows',
]);

export const SummaryMetricSchema = z.object({
  key: SummaryMetricKeySchema,
  label: z.string(),
  value: z.number(),
  trendPct: z.number(),
  subLabel: z.string(),
});

export const FlowSliceSchema = z.object({
  flow: z.string(),
  pct: z.number(),
  color: z.string(),
});

export const DayOfWeekSchema = z.enum([
  'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun',
]);

export const CallDistributionSchema = z.object({
  day: DayOfWeekSchema,
  hourly: z.array(z.number()),
});

export const CallsHandledRangeSchema = z.enum(['today', '7d', '30d']);

export const CallsHandledPointSchema = z.object({
  date: z.string(),
  successful: z.number(),
  unsuccessful: z.number(),
});

export const DurationByDaySchema = z.object({
  day: DayOfWeekSchema,
  seconds: z.number(),
});

export const TotalDurationResponseSchema = z.object({
  totalSeconds: z.number(),
  byDay: z.array(DurationByDaySchema),
});

// ── Calls ────────────────────────────────────────────────────

export const CallStatusSchema = z.enum(['success', 'hang_up']);

export const CallRecordSchema = z.object({
  id: z.string(),
  flow: z.string(),
  subscription: z.string(),
  occurredAt: z.string(),
  status: CallStatusSchema,
});

// ── Query params ─────────────────────────────────────────────

export const WeekQuerySchema = z.object({
  // ISO 8601 week: W01–W53
  week: z
    .string()
    .regex(/^\d{4}-W(0[1-9]|[1-4]\d|5[0-3])$/, 'Expected ISO week (e.g. 2025-W29)'),
});

export const MonthQuerySchema = z.object({
  // ISO 8601 month: 01–12
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Expected ISO month (e.g. 2025-06)'),
});

export const RangeQuerySchema = z.object({
  range: CallsHandledRangeSchema,
});

export const LimitQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
});

// ── Error envelope ───────────────────────────────────────────

export const ApiErrorCodeSchema = z.enum([
  'validation_error',
  'not_found',
  'internal_error',
]);

export const ApiErrorSchema = z.object({
  error: z.object({
    code: ApiErrorCodeSchema,
    message: z.string(),
    fields: z
      .array(
        z.object({
          path: z.array(z.union([z.string(), z.number()])),
          message: z.string(),
        }),
      )
      .optional(),
  }),
});
