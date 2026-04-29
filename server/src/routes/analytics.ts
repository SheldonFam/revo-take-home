import { Router } from 'express';
import {
  WeekQuerySchema,
  MonthQuerySchema,
  RangeQuerySchema,
} from '@revolab/shared';
import { store } from '../store.js';

export const analyticsRouter = Router();

analyticsRouter.get('/summary', (_req, res) => {
  res.json(store.getSummaryMetrics());
});

analyticsRouter.get('/flow-distribution', (req, res) => {
  const { week } = WeekQuerySchema.parse(req.query);
  res.json(store.getFlowDistribution(week));
});

analyticsRouter.get('/call-distribution', (req, res) => {
  const { month } = MonthQuerySchema.parse(req.query);
  res.json(store.getCallDistribution(month));
});

analyticsRouter.get('/calls-handled', (req, res) => {
  const { range } = RangeQuerySchema.parse(req.query);
  res.json(store.getCallsHandled(range));
});

analyticsRouter.get('/total-duration', (req, res) => {
  const { week } = WeekQuerySchema.parse(req.query);
  res.json(store.getTotalDuration(week));
});
