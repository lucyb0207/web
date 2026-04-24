---
name: 🎬 Propose a new Trace Theater scenario
about: Add a domain to Trace Theater (e.g. legal, finance, code-gen)
labels: ["trace-scenario", "good first issue"]
---

**Scenario label** (how it shows in the picker):

**Category**: `math` / `code` / `riddle` / `safety` / `medical` / `planning` / `creative` / `multilingual` / `ambiguity` / `tom` / **new** (propose one):

**Prompt** (1-2 sentences):

**Expected response** (paste the tokens you want to show — 15-25 tokens):

**Features you expect to fire** (8-10 features, with rough rationale per feature):
1. `feature_name_1` — fires when the model is doing X
2. `feature_name_2` — fires on tokens Y
3. ...

**Counterfactuals** (pick 1-2 features; describe what the output looks like at α = -3 / 0 / 1 / 3):

**How this helps users**: <!-- e.g. "demonstrates legal-reasoning vs medical-reasoning feature separation" -->

**After we agree on the scope, I'll open a PR adding the scenario to `lib/trace-scenarios.ts`.**
