---
id: CONSCIENCE-EVALS
type: architecture
owner: product-lead
status: draft-needs-ajesh-review
created: 2026-05-22
loop: ../../loops/eval.md
---

# Conscience evals — measuring when BOSS speaks

> **Tier note ([[DEC-013]], v0.213.0).** The cases and runners in here are **tracked** — they are
> tests, and four public claims about BOSS's own rigour were resting on them while no reader could
> open them. `judgment/transcripts/` is **deliberately NOT tracked**: those are recorded model
> outputs stamped with a voice-hash, and editing a frame marks them STALE by design. Re-generate
> them locally with `npm run regrade:keyless`; do not expect them in a fresh clone.

> The eval set behind the conscience. Run by [`runner.js`](runner.js). Updated whenever the
> detector fires wrongly or a new moment is authored. First cut written by Claude; **Ajesh's
> sharpening pass is the second cut and is load-bearing** — these examples encode his model of
> when the conscience should/shouldn't speak.

## Why this exists

The conscience hook (v0.12.0+) decides whether to inject a *signal* into Claude's context — the
nudge that becomes moment #1 ("what does this prove?") or moment #2 ("Done!"). Until now we had
no way to ask "did the detector get it right?" — every change to the trigger logic was vibes-based.

Per [Hamel Husain](https://hamel.dev): *almost all AI quality problems are visible in the data,
and almost no one looks.* This eval set is the looking.

## The eval format

Each example is a YAML record with these fields:

```yaml
- id: <stable id, e.g. m1-sf-001 for moment-1, should-fire, #001>
  category: should-fire | should-not-fire
  failure_mode: <only for should-not-fire — see categories below>
  scenario: <one-line natural-language description>
  project_state:
    # Synthetic project state the runner constructs in a temp dir
    ideas:
      - file: IDEA-001-foo.md
        capture_log_entries: 5
        canvas: false
      - file: IDEA-002-bar.md
        capture_log_entries: 3
        canvas: false
    # Optional: prior conscience-fires recorded in devlog
    devlog_acknowledgements: 0
  expected_detection:
    fires: true | false
    moment: caution | done | null
    confidence: high | medium | low
    suppress_if: []
  why: <1-2 line rationale>
```

The runner constructs the synthetic state in a temp dir, invokes the hook (or skill detector)
against it, parses the structured output, and asserts.

## Failure mode categories (for should-NOT-fire examples)

Per Husain's discipline: *failure modes are more valuable than success modes.* Categorize what
goes wrong, so the next iteration can target specific categories.

For moment #1 (caution / validation drift):

| Category | Means | Example |
|---|---|---|
| `over-fires-on-fresh-project` | Project is too new for the signal to be honest — the threshold was wrong | Brand-new repo, one IDEA file, one capture-log entry, hook fires |
| `fires-mid-other-work` | The drift exists but the user is clearly in unrelated work | User is mid-debug session asking about a stack trace; hook fires unhelpfully |
| `repeats-itself` | Hook already fired this session/cycle and nothing changed | Already nudged 10 minutes ago; user hasn't acted; firing again is nagging |
| `shame-toned` | The signal text would land as scolding rather than care | Wording presumes incompetence; misreads the founder's stage |
| `false-positive-canvas-exists` | A filled canvas exists but the detector missed it | Canvas's riskiest assumption is filled with text the regex didn't match |
| `false-positive-not-drift` | Multiple captures exist but they're *intentionally* exploratory, not drift | Founder is deliberately surveying alternatives — no commitment yet |
| `acknowledged-already` | User already overrode/acknowledged this drift in the devlog | Override line says "skipping pretotype, prior product validates"; hook should respect |

For moment #2 (Done! graduation):

| Category | Means | Example |
|---|---|---|
| `fires-too-early` | Cells filled with placeholders, not real answers | Canvas has all cells filled but most are `_(not yet)_` variants |
| `performed-warmth` | The graduation language reads as scripted/saccharine | "Amazing job!" rather than the seasoned-hand voice |
| `removes-agency` | Pushes the founder to unlock MVP before they've decided | Treats `boss unlock mvp` as the obvious next step rather than offering it |
| `riskiest-assumption-stale` | The riskiest assumption text was filled long ago but never tested | Plan exists in the cell, but no devlog entries indicate it was run |
| `triggered-by-trivial-change` | Canvas was edited but not in a way that crosses the threshold | Adding a comma, not substance |

## How to run

```bash
node docs/architecture/conscience-evals/runner.js
```

Output: per-example pass/fail + a summary table by moment and category. Non-zero exit if any
case fails (so CI can use this as a gate).

## How to add an example

When the conscience fires wrongly (or fails to fire when it should), add a case:

1. Identify which moment + which side (should-fire / should-NOT-fire).
2. If should-NOT-fire: pick the closest failure_mode (or add a new one to this README + the
   categories list).
3. Write the synthetic `project_state` that triggers the case. Keep it minimal — only the state
   the detector reads.
4. Set `expected_detection` to what *should* happen.
5. Run the runner; verify the new case fails (it should — that's why you're adding it).
6. Fix the detector; verify the case now passes; verify no prior case regressed.

This is the *Husain quality loop*. The set grows from real friction; the detector improves by
case-driven iteration.

## Current cut

- **Moment #1 (caution):** see [`moment-1-caution.yml`](moment-1-caution.yml). First cut by
  Claude on 2026-05-22. Needs Ajesh-sharpening pass.
- **Moment #2 (Done!):** see [`moment-2-done.yml`](moment-2-done.yml). First cut by Claude on
  2026-05-22. Moment #2 lives in the `/canvas` skill prompt today (no hook); the eval set
  drives expected skill behavior. Needs Ajesh-sharpening pass.
- **Moment: cost (cost-budget-loop, L1-mvp):** see [`moment-cost.yml`](moment-cost.yml). Added
  in v0.27.0. Hook-runner loop; the cases test entry detection across providers (Anthropic /
  OpenAI / Vercel AI SDK), partial-closure (budget doc alone, logger alone), full closure, and
  multi-moment co-firing with failure-mode at the first LLM-call inflection. Needs Ajesh-
  sharpening pass.
- **Moment: failure-mode (ai-failure-state-loop, L1-mvp):** see
  [`moment-failure-mode.yml`](moment-failure-mode.yml). Added in v0.27.0. Hook-runner loop;
  cases isolate failure-mode by closing cost-budget-loop. Same first-LLM-call inflection;
  different exit (failure-states doc + handler ref). Needs Ajesh-sharpening pass.
- **Moment: coherence (design-tokens-loop, L1-mvp):** see
  [`moment-coherence.yml`](moment-coherence.yml). Added in v0.27.0. Hook-runner loop; cases
  test entry across style patterns (className= / styled-components / inline style=) +
  confidence scaling (3 = low; 12+ = high) + partial closure (doc alone, refs alone) + full
  closure. Needs Ajesh-sharpening pass.

## Multi-moment assertions (v0.27.0+)

When multiple loops share an entry inflection (e.g., the first LLM SDK call opens BOTH
`cost-budget-loop` and `ai-failure-state-loop`), an eval case can assert against the full
signal set rather than just the first signal:

```yaml
expected_detection:
  fires: true
  moments: [cost, failure-mode]   # all listed moments must appear in actual signals
```

Use this when the test isn't trying to isolate one loop — the multi-moment case captures the
natural state of a founder hitting the AI-mediated boundary without any discipline declared.

## Synthetic-file fixtures (v0.27.0+)

The minimal YAML parser doesn't support multi-line scalars, so file content lives in the
`FIXTURES` registry in [`runner.js`](runner.js). Eval YAML references them by name:

```yaml
src_files:
  - { path: src/api.ts, fixture: anthropic_call }
docs_files:
  - { path: docs/ai-cost-budget.md, fixture: cost_budget_doc }
```

Available fixtures (as of v0.27.0): `anthropic_call`, `openai_call`, `vercel_ai_call`,
`vercel_ai_stream`, `no_llm_code`, `cost_budget_doc`, `cost_logger_ref`, `failure_states_doc`,
`failure_handlers_ref`, `style_decls_low`, `style_decls_high`, `style_decls_two`,
`style_styled_components`, `style_inline_objects`, `design_tokens_doc`, `token_refs`, `empty`.

Add new fixtures to `runner.js`'s `FIXTURES` map when a new test needs file content the
existing set doesn't cover. Keep fixtures minimal — *just enough* to fire the predicate
under test.

## Honest scope flag (Claude's note)

This first cut is a *model of Ajesh's model* of the conscience. The examples are plausible and
opinionated, but they reflect Claude's reading of the boss-ethos / boss-voice / triage skill /
canvas skill — not Ajesh's lived sense of the founder's experience. Treat as a draft to argue
with. The wrongness in cut 1 is the data that makes cut 2 useful.
