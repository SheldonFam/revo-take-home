# Revolab Track A

AI-powered call centre workflow management — React frontend + Express backend.

## Run

**Requirements:** Node 20+, pnpm 9+.

```bash
pnpm install
pnpm dev
```

`pnpm dev` runs both processes:
- **Client** — Vite dev server at http://localhost:5173 (open in your browser)
- **Server** — Express API at http://localhost:4000 (proxied by Vite under `/api`)

Workflow edits persist to `server/data/workflows.json`. Delete that file to reset to seed.

## API

All endpoints are JSON in / out, under `/api/v1/`.

| Method | Path | Query / Body | Response |
|---|---|---|---|
| GET | `/workflows/:id` | — | `Workflow` |
| PATCH | `/workflows/:workflowId/steps/:stepId` | `{ title?, description?, position? }` (≥1 field) | `Step` |
| GET | `/analytics/summary` | — | `SummaryMetric[]` |
| GET | `/analytics/flow-distribution` | `?week=2025-W29` | `FlowSlice[]` |
| GET | `/analytics/call-distribution` | `?month=2025-06` | `CallDistribution[]` |
| GET | `/analytics/calls-handled` | `?range=today\|7d\|30d` | `CallsHandledPoint[]` |
| GET | `/analytics/total-duration` | `?week=2026-W17` | `TotalDurationResponse` |
| GET | `/calls` | `?limit=10` | `CallRecord[]` |

Error responses use `{ error: { code, message, fields? } }`. Codes: `validation_error` (400), `not_found` (404), `internal_error` (500).

### Examples

```bash
# Read a workflow
curl http://localhost:4000/api/v1/workflows/wf_inbound

# Update a step's title
curl -X PATCH \
  -H "Content-Type: application/json" \
  -d '{"title":"Qualify caller"}' \
  http://localhost:4000/api/v1/workflows/wf_inbound/steps/step_qualify
```

## What's intentionally out of scope

Auth, rate limiting, request logging, real database (file-based persistence is the take-home choice), Docker, CI, deployment, automated tests (the two `curl` examples above cover the writable path; everything else was smoke-tested manually during development), production build (`pnpm dev` is the only run path), mobile responsive (`<1280px`), and node creation/deletion/edge editing in the workflow builder.

## Project layout

```
revolab/
├── client/              # Vite + React 19 + TS + Tailwind + shadcn/ui
├── server/              # Express + TS + tsx-watch
├── packages/shared/     # zod schemas + inferred types (workspace dep)
├── docs/
│   ├── assessment/      # original take-home brief + reference screenshots
│   └── superpowers/     # local design + plan artifacts (gitignored)
└── README.md
```

## Assessment context

The original take-home brief is preserved verbatim at [`docs/assessment/`](./docs/assessment) (auto-rendered by GitHub). Reference screenshots live alongside in [`docs/assessment/reference/`](./docs/assessment/reference).
