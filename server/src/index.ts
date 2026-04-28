import express from 'express';

const PORT = 4000;
const app = express();

app.use(express.json());

app.get('/api/v1/health', (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
