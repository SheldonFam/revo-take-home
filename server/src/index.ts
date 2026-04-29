import express from 'express';
import { workflowsRouter } from './routes/workflows.js';
import { analyticsRouter } from './routes/analytics.js';
import { callsRouter } from './routes/calls.js';
import { errorMiddleware } from './middleware/error.js';

const PORT = 4000;
const app = express();

app.use(express.json());

app.use('/api/v1/workflows', workflowsRouter);
app.use('/api/v1/analytics', analyticsRouter);
app.use('/api/v1/calls', callsRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
