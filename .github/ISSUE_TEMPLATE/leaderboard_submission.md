---
name: 📊 Submit an SAE to the InterpScore leaderboard
about: You ran notebook 18 on your SAE and want it on the site
labels: ["leaderboard-submission"]
---

**SAE repo on HuggingFace**: `your-user/your-sae`

**Model + layer**:
- base model: `org/model-name`
- layer:

**Configuration**:
- `d_sae`:
- `k` (TopK):
- training tokens:

**InterpScore components** (paste the output of notebook 18):
```json
{
  "loss_recovered": ...,
  "alive": ...,
  "l0_score": ...,
  "sparse_probing": ...,
  "tpp": ...,
  "interp_score": ...
}
```

**Notebook version**: (e.g. `18_interpscore_eval v0.0.1`)

**Anything else reviewers should know** (training corpus, compute hours, known limitations):

**By submitting I confirm**:
- [ ] The score was computed by an unmodified run of `18_interpscore_eval.ipynb`
- [ ] The SAE repo on HF is public
- [ ] I'll open a PR adding one entry to `lib/leaderboard.ts` after this issue is triaged
