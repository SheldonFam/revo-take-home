import { Router } from 'express';
import { LimitQuerySchema } from '@revolab/shared';
import { store } from '../store.js';

export const callsRouter = Router();

callsRouter.get('/', (req, res) => {
  const { limit } = LimitQuerySchema.parse(req.query);
  res.json(store.getRecentConversations(limit));
});
