import Link from 'next/link'
import { ArrowLeft, ExternalLink, Award, GitPullRequest, BookOpen } from 'lucide-react'
import {
  leaderboard,
  INTERP_SCORE_WEIGHTS,
  INTERP_SCORE_VERSION,
  type LeaderboardEntry,
} from '@/lib/leaderboard'
import { site } from '@/lib/constants'

export const metadata = {
  title: 'InterpScore Leaderboard — OpenInterp',
  description:
    'Composite SAE evaluation ranking. Loss recovered + alive features + L0 sweet spot + sparse probing + TPP — weighted, transparent, open to revision.',
}

function pct(x: number, digits = 2) {
  return `${(x * 100).toFixed(digits)}%`
}

function rankBadge(rank: number) {
  const styles = [
    'bg-gradient-to-br from-amber-300 to-amber-600 text-black shadow-md',       // 🥇
    'bg-gradient-to-br from-slate-300 to-slate-500 text-black shadow-sm',       // 🥈
    'bg-gradient-to-br from-orange-400 to-orange-700 text-white shadow-sm',     // 🥉
  ]
  return (
    <div
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm ${
        rank <= 3
          ? styles[rank - 1]
          : 'bg-black/5 dark:bg-white/10 text-ink-900/60 dark:text-ink-50/60'
      }`}
    >
      {rank}
    </div>
  )
}

function ComponentBar({ label, value, weight }: { label: string; value: number; weight: number }) {
  const pctWidth = Math.max(0, Math.min(1, value)) * 100
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1">
        <span className="text-ink-900/60 dark:text-ink-50/60">
          {label} <span className="font-mono text-ink-900/40 dark:text-ink-50/40">·{' '}×{weight.toFixed(2)}</span>
        </span>
        <span className="font-mono font-semibold text-brand-600 dark:text-brand-400">
          {value.toFixed(3)}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all"
          style={{ width: `${pctWidth}%` }}
        />
      </div>
    </div>
  )
}

export default function InterpScorePage() {
  const weightEntries = [
    ['loss_recovered', INTERP_SCORE_WEIGHTS.loss_recovered, 'reconstruction fidelity'],
    ['alive', INTERP_SCORE_WEIGHTS.alive, '1 − dead feature fraction'],
    ['l0_score', INTERP_SCORE_WEIGHTS.l0_score, 'exp(−|log(L0/80)|) · peaks at L0 ≈ 80'],
    ['sparse_probing', INTERP_SCORE_WEIGHTS.sparse_probing, 'AUROC on held-out labels (SAEBench)'],
    ['tpp', INTERP_SCORE_WEIGHTS.tpp, 'Targeted Probe Perturbation (causal faithfulness)'],
  ] as [string, number, string][]

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 mb-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back home
      </Link>

      <div className="mb-8">
        <span className="chip bg-brand-500/10 text-brand-700 dark:text-brand-300 ring-brand-500/30 ring-inset">
          LIVE · {INTERP_SCORE_VERSION}
        </span>
        <h1 className="mt-4 text-5xl sm:text-6xl font-semibold tracking-tight text-balance inline-flex items-center gap-3">
          <Award className="h-10 w-10 text-brand-600 dark:text-brand-400" />
          InterpScore
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-ink-900/70 dark:text-ink-50/70 leading-relaxed text-balance">
          Composite SAE evaluation — one number that summarizes reconstruction, sparsity, dead-feature pressure, interpretability, and causal faithfulness. Transparent weights, editable formula, individual components always reported.
        </p>
      </div>

      {/* Formula card */}
      <div className="card p-6 bg-gradient-to-br from-brand-500/5 to-accent-500/5 mb-10">
        <h2 className="text-lg font-semibold tracking-tight mb-3">Formula · v0.0.1</h2>
        <pre className="font-mono text-xs md:text-sm bg-ink-950 text-ink-50 rounded-lg p-4 overflow-x-auto mb-4">
{`InterpScore = 0.30 × loss_recovered
            + 0.15 × (1 − dead_frac)
            + 0.15 × l0_score          # exp(−|log(L0/80)|) · peaks at L0 ≈ 80
            + 0.25 × sparse_probing_auc
            + 0.15 × tpp_score`}
        </pre>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs">
          {weightEntries.map(([k, w, desc]) => (
            <div key={k} className="flex items-baseline gap-2">
              <span className="font-mono text-brand-600 dark:text-brand-400 font-semibold">
                {w.toFixed(2)}
              </span>
              <span className="text-ink-900/80 dark:text-ink-50/80 font-medium">{k}</span>
              <span className="text-ink-900/50 dark:text-ink-50/50">— {desc}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-ink-900/60 dark:text-ink-50/60 leading-relaxed">
          <strong>Why a composite when SAEBench authors (Karvonen 2025) explicitly refuse one?</strong>{' '}
          Because it makes SAEs comparable at a glance. We mitigate the "obscuring tradeoffs" objection by
          reporting every component alongside the score and versioning the weights. If you disagree with the
          weights, PR a different set — we mint InterpScore v0.0.2 with your formula tagged.
        </p>
      </div>

      {/* Leaderboard table */}
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">Leaderboard</h2>
        <div className="text-xs text-ink-900/50 dark:text-ink-50/50 font-mono">
          {leaderboard.length} entries · sorted by InterpScore desc
        </div>
      </div>

      <div className="card p-0 overflow-x-auto mb-12">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b border-black/10 dark:border-white/10 text-left">
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-ink-900/40 dark:text-ink-50/40 w-16">
                #
              </th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-ink-900/40 dark:text-ink-50/40">
                SAE
              </th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-ink-900/40 dark:text-ink-50/40 text-right">
                d_sae / k
              </th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-ink-900/40 dark:text-ink-50/40 text-right">
                tokens
              </th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-ink-900/40 dark:text-ink-50/40 text-right">
                loss_rec
              </th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-ink-900/40 dark:text-ink-50/40 text-right">
                alive
              </th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-ink-900/40 dark:text-ink-50/40 text-right">
                probing
              </th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-ink-900/40 dark:text-ink-50/40 text-right">
                tpp
              </th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400 text-right">
                InterpScore
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((e) => (
              <LeaderboardRow key={e.sae_repo + e.layer} e={e} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Score breakdown cards */}
      <h2 className="text-2xl font-semibold tracking-tight mb-6">Score breakdowns</h2>
      <div className="grid gap-4 md:grid-cols-2 mb-12">
        {leaderboard.slice(0, 4).map((e) => (
          <article key={e.sae_repo + e.layer + 'break'} className="card p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  {rankBadge(e.rank ?? 0)}
                  <h3 className="font-semibold truncate">{e.model}</h3>
                </div>
                <div className="mt-1 font-mono text-[11px] text-ink-900/50 dark:text-ink-50/50">
                  {e.layer} · d_sae={e.d_sae.toLocaleString()} · k={e.k}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-ink-900/40 dark:text-ink-50/40">InterpScore</div>
                <div className="text-2xl font-bold gradient-text">{e.interp_score.toFixed(3)}</div>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <ComponentBar label="loss_recovered" value={e.components.loss_recovered} weight={INTERP_SCORE_WEIGHTS.loss_recovered} />
              <ComponentBar label="alive" value={e.components.alive} weight={INTERP_SCORE_WEIGHTS.alive} />
              <ComponentBar label="l0_score" value={e.components.l0_score} weight={INTERP_SCORE_WEIGHTS.l0_score} />
              <ComponentBar label="sparse_probing" value={e.components.sparse_probing} weight={INTERP_SCORE_WEIGHTS.sparse_probing} />
              <ComponentBar label="tpp" value={e.components.tpp} weight={INTERP_SCORE_WEIGHTS.tpp} />
            </div>
            {e.notes && (
              <p className="mt-4 text-xs italic text-ink-900/50 dark:text-ink-50/50 leading-relaxed">
                {e.notes}
              </p>
            )}
          </article>
        ))}
      </div>

      {/* Submit CTA */}
      <div className="card p-8 bg-gradient-to-br from-brand-500/5 to-accent-500/5 mb-10">
        <div className="flex items-start gap-3 mb-4">
          <GitPullRequest className="h-6 w-6 text-brand-600 dark:text-brand-400 mt-1" />
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Submit your SAE</h2>
            <p className="mt-2 text-sm text-ink-900/70 dark:text-ink-50/70 max-w-2xl leading-relaxed">
              Run notebook{' '}
              <code className="font-mono text-xs bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded">
                18_interpscore_eval.ipynb
              </code>{' '}
              on your SAE — it writes{' '}
              <code className="font-mono text-xs bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded">
                interpscore.json
              </code>{' '}
              to your HF repo, then open a PR to{' '}
              <code className="font-mono text-xs bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded">
                OpenInterpretability/web
              </code>{' '}
              adding one line to{' '}
              <code className="font-mono text-xs bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded">
                lib/leaderboard.ts
              </code>
              . A Q2 2026 automated ingestion endpoint will accept the JSON URL directly.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="https://github.com/OpenInterpretability/notebooks/blob/main/notebooks/18_interpscore_eval.ipynb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
          >
            <BookOpen className="h-4 w-4" /> Open the eval notebook
          </Link>
          <a
            href="https://github.com/OpenInterpretability/web/edit/main/lib/leaderboard.ts"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-black/10 dark:border-white/15 px-5 py-2.5 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <GitPullRequest className="h-4 w-4" /> Open PR on leaderboard.ts
          </a>
          <a
            href={`mailto:${site.contact}?subject=${encodeURIComponent('InterpScore weights proposal')}`}
            className="inline-flex items-center gap-2 rounded-lg border border-black/10 dark:border-white/15 px-5 py-2.5 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            Propose v0.0.2 weights
          </a>
        </div>
      </div>

      {/* Methodology */}
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Methodology</h2>
        <div className="grid gap-3 md:grid-cols-3 text-sm">
          <div className="card p-5">
            <h3 className="font-semibold">Source metrics</h3>
            <p className="mt-2 text-ink-900/70 dark:text-ink-50/70 leading-relaxed">
              All 5 components come from <a href="https://arxiv.org/abs/2503.09532" target="_blank" rel="noopener noreferrer" className="text-brand-600 dark:text-brand-400 hover:text-brand-700 inline-flex items-center gap-0.5">SAEBench <ExternalLink className="h-3 w-3" /></a>{' '}
              (Karvonen et al. 2025) + <a href="https://arxiv.org/abs/2406.04093" target="_blank" rel="noopener noreferrer" className="text-brand-600 dark:text-brand-400 hover:text-brand-700 inline-flex items-center gap-0.5">Gao et al. 2024 <ExternalLink className="h-3 w-3" /></a>. No new metric is invented — only the weighted combination.
            </p>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold">Why these weights</h3>
            <p className="mt-2 text-ink-900/70 dark:text-ink-50/70 leading-relaxed">
              Reconstruction (0.30) is necessary-not-sufficient. Interpretability (0.25) is the differentiator. Causal faithfulness (0.15) is the honesty check. L0 + alive (0.15 + 0.15) prevent Goodharting toward trivial solutions.
            </p>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold">Trust model</h3>
            <p className="mt-2 text-ink-900/70 dark:text-ink-50/70 leading-relaxed">
              Numbers come from user-submitted <code className="font-mono text-xs bg-black/5 dark:bg-white/5 px-1 py-0.5 rounded">interpscore.json</code> files on HF SAE repos. Independently verifiable — re-run notebook 18 on any SAE and compare. External entries (Gemma Scope, Anthropic) use published paper numbers with clear attribution.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function LeaderboardRow({ e }: { e: LeaderboardEntry }) {
  return (
    <tr className="border-b border-black/5 dark:border-white/10 last:border-b-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
      <td className="p-4 align-middle">{rankBadge(e.rank ?? 0)}</td>
      <td className="p-4 align-middle">
        <a
          href={`https://huggingface.co/${e.sae_repo}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex flex-col hover:text-brand-600 dark:hover:text-brand-400"
        >
          <span className="font-medium">{e.model}</span>
          <span className="font-mono text-[10px] text-ink-900/50 dark:text-ink-50/50 group-hover:text-brand-600 dark:group-hover:text-brand-400">
            {e.sae_repo} · {e.layer} <ExternalLink className="inline h-3 w-3" />
          </span>
        </a>
      </td>
      <td className="p-4 align-middle font-mono text-right text-xs">
        {e.d_sae.toLocaleString()} / k={e.k}
      </td>
      <td className="p-4 align-middle font-mono text-right text-xs text-ink-900/60 dark:text-ink-50/60">
        {e.tokens_trained}
      </td>
      <td className="p-4 align-middle font-mono text-right">{e.components.loss_recovered.toFixed(3)}</td>
      <td className="p-4 align-middle font-mono text-right">{pct(e.components.alive, 1)}</td>
      <td className="p-4 align-middle font-mono text-right">{e.components.sparse_probing.toFixed(3)}</td>
      <td className="p-4 align-middle font-mono text-right">{e.components.tpp.toFixed(3)}</td>
      <td className="p-4 align-middle font-mono text-right font-bold gradient-text text-base">
        {e.interp_score.toFixed(3)}
      </td>
    </tr>
  )
}
