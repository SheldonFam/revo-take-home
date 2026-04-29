import { Router } from 'express';
import { StepPatchSchema } from '@revolab/shared';
import { store } from '../store.js';

export const workflowsRouter = Router();

workflowsRouter.get('/:id', (req, res) => {
  res.json(store.getWorkflow(req.params.id));
});

workflowsRouter.patch('/:workflowId/steps/:stepId', (req, res) => {
  const patch = StepPatchSchema.parse(req.body);
  const step = store.updateStep(req.params.workflowId, req.params.stepId, patch);
  res.json(step);
});
