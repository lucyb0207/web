# Contributing to `web` — openinterp.org

The Next.js site behind [openinterp.org](https://openinterp.org). TypeScript, Tailwind, static-prerendered on Vercel.

## Setup

```bash
git clone https://github.com/OpenInterpretability/web
cd web
npm install
npm run dev       # http://localhost:3000
```

## Before opening a PR

```bash
npm run build       # must pass (TypeScript + static prerender)
npm run typecheck   # optional but appreciated
```

## Scope of this repo

| In scope | Out of scope |
|---|---|
| New Trace Theater scenarios (`lib/trace-scenarios.ts`) | Model-training code (goes in `notebooks` repo) |
| New Circuit Canvas features, atlas UI, lab UI | Python SDK logic (goes in `cli` repo) |
| `/interpscore` leaderboard entries (one PR = one SAE) | Research code (goes in `mechreward` repo) |
| Copy edits, accessibility, mobile fixes, dark mode | Blog posts (Q3 — separate `blog` route TBD) |
| New pillar sub-routes (Q2+) | |

## Common PR patterns

### 1. Add a Trace Theater scenario
- File: `lib/trace-scenarios.ts`
- Append to `extraScenarios` array using the `TraceScenario` interface
- Use unique feature IDs (don't reuse existing ones — grep to confirm)
- Include ≥1 counterfactual for the most dramatic feature
- Screenshot of it working locally in the PR

### 2. Submit an SAE to the leaderboard
- File: `lib/leaderboard.ts`
- Add one entry with components filled in from your `interpscore.json`
- Link your HuggingFace SAE repo in the PR description
- Maintainers may independently re-run notebook 18 to verify

### 3. Fix a bug / polish UI
- File: wherever it lives
- If UI: include a before/after screenshot

## Design system

- Colors: `brand-*` (indigo), `accent-*` (cyan), `ink-*` (neutral).
- Components: `card`, `chip`, `gradient-text` utilities in `app/globals.css`.
- Icons: `lucide-react` — keep bundle lean by importing individually.
- Don't introduce new CSS files without asking first.

## Deploy

Maintainer-only (Vercel is wired to `OpenInterpretability/web main`). Your merged PR auto-deploys.

## Questions

Open a [Discussion](https://github.com/OpenInterpretability/web/discussions) for anything open-ended. For bugs, use the issue template.
