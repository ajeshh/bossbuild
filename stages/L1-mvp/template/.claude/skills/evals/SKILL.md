---
name: evals
description: Build and run the eval set for an AI-mediated FEAT — "is it correct?" paired with /smoke's "is it alive?" Husain's discipline applied to LLM-mediated control-flow in {{PROJECT_NAME}} — look at your data, build the eval set FIRST, categorize failures by mode, vibes-based eval is only a starting point. Usage - /evals [FEAT-NNN | --new <feat>]
---

# /evals — the AI-correctness gate

`/smoke` answers *is the app alive?* `/evals` answers *is the AI part correct?* In MVP mode, every
FEAT that puts an LLM in the control flow needs an eval set — even a tiny one. The discipline is
**Husain's**: *almost all AI quality problems are visible in the data, and almost no one looks.*
This skill is "look."

The MVP rule: **20 examples beats 0.** Even an unsophisticated eval set caught vibes earlier than
no eval set ever could. Categorize failures so the next iteration can target a category, not just
"make it better."

## Step 0 — does it already exist, and is this the right rung?

**Look for eval sets before you make one** — `docs/evals/**`, `evals/**`. If it's there: say so and stop
when it's fine (a complete outcome, not a failure to act), or name the *specific* gap and offer the
*specific* edit when it's behind. Never quietly generate a second one.

**Rung: MVP.** Applies only when the project has an LLM in control flow. If this project is **earlier** than that, don't run this — leave the seam instead:
**Keep the bad outputs. One folder, paste the failure in, no format. That is eval case #1 and it exists for about thirty seconds before someone closes the tab.** That is the whole ask; it is *not* an eval harness, a judge, a rubric, a ci gate, a scoring loop. Every eval set is built from real failures you actually saw. You can write the harness any day; you cannot recover the weird output you deleted, and reproducing it on demand is exactly the thing a non-deterministic system will not do for you.

## Correctness ≠ safety — the adversarial half

A clean `/evals` pass means the AI part is *correct* — not that it's *safe*. Safety holds under normal
use and **degrades under adversarial / jailbreak prompts across every model** (Stanford HAI AI Index
2026: 362 AI incidents in 2025, up from 233; the industry reports capability benchmarks and almost never
the responsibility half). So an `/evals` run isn't *done* until **`/red-team`** has run the adversarial
half — its OWASP-Agentic battery is what that pass should probe. Correctness is `/evals`; resistance
under attack is `/red-team`; shipping an AI feature needs **both**, not either alone.

## When to run it

- A FEAT-NNN involves an LLM call whose output drives behaviour (not just user-facing prose).
- *Before* you ship the FEAT — eval-set-FIRST, not retrofitted.
- After a real-user bug report — add the failing case to the eval set, then fix.
- Regression — after any model swap, prompt change, or upstream library bump, re-run the set.

## How to run it

1. **Pick the FEAT.** Read the FEAT spec's *Evals* section. If it doesn't exist (FEAT pre-dates the
   v0.21.0 spec template), add it: declare an `Eval set path: docs/evals/FEAT-NNN.yml`.
2. **Create or open** `docs/evals/FEAT-NNN.yml`. Format: a YAML list of cases, each with
   `id / category / scenario / inputs / expected / why`. Categorize `should-pass` and
   `should-fail` (the latter sub-categorized by failure mode per Husain's discipline —
   `over-applies / hallucinates / refuses-wrongly / format-violation / etc.`).
3. **Run them.** Either:
   - A runner script (Node, ~150 lines like BOSS's own `docs/architecture/conscience-evals/
     runner.js`) — preferred, machine-runnable, becomes a CI gate
   - Or manually walk each case, recording pass/fail and what failed
4. **Report.** One line per case: `✓ <id>  <scenario>` or `✗ <id>  → <reason>`. Summary table by
   failure category — the categorized failure count IS the design signal for next iteration.
5. **Add the failure** when something breaks live. Each real-world bug becomes a case in the set;
   the set grows from real friction.

## Eval set format (recommended)

```yaml
- id: feat-007-pass-001
  category: should-pass
  scenario: <one-line natural description>
  inputs:
    <synthetic state / prompt / context>
  expected:
    <pass/fail criteria — what "right" looks like>
  why: <why this case matters>

- id: feat-007-fail-001
  category: should-fail
  failure_mode: hallucination  # one of: garbage | refusal | hallucination | timeout | cost-spike | other
  scenario: <one-line>
  inputs: …
  expected:
    fires: true  # the detector / guard / refusal catches this
  why: <what could go wrong if missed>
```

Same shape as BOSS's own conscience-evals — copy that runner.js as a starting point if Node fits
your stack.

## Failure-state coverage requirement (v0.30.0+ — for AI-mediated FEATs)

For any FEAT that puts an LLM in the user-visible path (i.e., one that declares responses in
`docs/ai-failure-states.md`), the eval set **must include at least one `should-fail` case
per declared failure state**, categorized by `failure_mode` matching the canonical names:

- `garbage` — schema-invalid / malformed / off-topic output
- `refusal` — safety-template / over-cautious non-answer / "I can't help with that"
- `hallucination` — confidently-wrong content (fabricated citations, invented APIs, etc.)
- `timeout` — call hangs / network drops / 5xx response
- `cost-spike` — input or output token count exceeds declared per-call cap

This closes the *"failure-state handlers can be stubs forever"* loophole. The handler stubs
in `src/` satisfy the `ai-failure-state-loop` predicate; the eval cases here verify the stubs
*actually do something* when the failure surfaces.

A handler whose `Eval-tested` field in `docs/ai-failure-states.md` reads `STUB` means the
founder has committed to writing this eval case — either now, or under a recorded override
(IDEA-008) with a re-open condition. **STUB without an override is the failure mode this
upgrade prevents.**

Cohort-aware: `first-product` may legitimately ship STUB + override on day-one builds
(*"haven't seen this failure yet; will write the case when FEAT-002 ships"*); `domain-expert`
in high-stakes domains should not ship STUB without an external escalation route documented.

## Sharpening (2026 — Hamel Husain / Shreya Shankar)

The 2026 update to the eval discipline, from the people who teach it. Fold these in:

- **Error analysis comes first — on *real* traces, not invented cases.** Read your actual
  session/agent traces, sort the failures into a taxonomy, *then* build evaluators for the modes you
  actually see. Inventing eval cases before you've looked at real failures is "eval-driven
  development" done backwards. (If the project runs BOSS's `auto-log` trace substrate, `.boss/trace.jsonl`
  is exactly this raw material — IDEA-025.) Error analysis is 60–80% of the work.
- **Binary pass/fail, not 1–5 scores.** A Likert score hides the decision. Force each case to a
  yes/no — "did it do the thing or not" — and let the *categorized* failures carry the nuance. Scores
  feel rigorous and measure nothing.
- **One expert, not a committee.** Pick a single "benevolent dictator" who owns what pass means for
  this FEAT. Averaging three people's vibes produces mush. (For high-stakes domains, that expert is a
  domain expert — see the rule below.)
- **Don't let the model grade its own homework.** If you use LLM-as-judge, the judge must be a
  *separate* pass from the call that produced the output, with its own examples of the judge being
  wrong. A right answer reached through a bad/dangerous tool path is still a failure — evaluate the
  *trajectory*, not just the endpoint. (For a FEAT with a real multi-step tool flow, assert on the
  tool *sequence*, not only the final output; **UK AISI's Inspect** is the graduation-grade harness to
  reach for if you outgrow hand-rolled trajectory checks — point at it, don't rebuild it.)
- **Cost hierarchy.** Cheap deterministic assertions first; reserve LLM-as-judge for the persistent,
  genuinely-semantic failures. A useful mix to aim for: ~60% deterministic / ~30% LLM-as-judge /
  ~10% human-in-the-loop.
- **Reliability ≠ single-shot — measure pass^k.** Non-deterministic output means a case that passes
  once can fail the next call. Run each load-bearing case **k times and count how often it *all*
  succeeds** (pass^k, from τ-bench) — that consistency rate, not one green run, is the real reliability
  signal. Zero-dependency: a loop around the case you already wrote. (τ-bench / UK AISI Inspect are the
  graduate-grade harnesses to point at when you outgrow it, never a CLI dependency.)

## Online evals — the production half (not just a pre-ship gate)

Everything above is *offline* (pre-ship correctness). The 2026 addition is the *online* half: once the FEAT is
live with real traffic, **score a sample of production traffic continuously** — shadow-run your evaluators on,
say, ~5% of live sessions, alert on quality/drift, and **auto-curate the failing traces back into the eval set**
(they become tomorrow's regression cases). The loop is **traces → evals → product metrics**, joined on the
user/session. Offline `/evals` catches *known* failure modes; online eval catches the *novel* ones and the
distribution shift a model/prompt change introduces.

- **JIT:** turns on only when the FEAT is live with enough traffic that you can't hand-read every output —
  before that, offline is correct and sufficient (don't build production-eval machinery for n<10).
- **Offline eval can lie.** A documented case had the *lower*-offline-scoring variant win on business results —
  so treat offline as a *filter*, not a green light; the live A/B on a real outcome metric is the real signal.
- **Tooling is a pointer, not a dependency:** self-hosted Langfuse/Phoenix (OSS) for the inner loop, PostHog for
  the product-outcome loop. See [`/measure`](../measure/SKILL.md) + `analytics-for-ai-products` for the
  post-ship metric vocabulary (task-completion, cost-per-successful-outcome) this feeds.

## Structured outputs (Liu discipline) — strongly recommended

If the LLM call's output drives subsequent code (control flow, data routing, decisions), **schema
the output**. Pydantic-first / Zod-first / any-structured-output. Free-form prose is for human
eyeballs only. The eval set then asserts on the *schema*, not on prose interpretation. This single
practice eliminates ~80% of LLM-pipeline brittleness (Jason Liu).

## Rules

- **Eval-set first.** Write 20+ cases before the LLM call ships, not retrofitted after. If you
  don't know what 20 cases are, you don't yet know what the FEAT does.
- **Categorize failures.** Failure-mode categorization is more valuable than success count.
  Husain: *failure modes are more valuable than success modes — categorize systematically.*
- **Vibes are a starting point.** First 5 iterations on vibes is fine; the 6th wants rubrics.
- **Look at your data.** When a case fails, *open the actual model output side-by-side with the
  prompt*. The fault is almost always visible.
- **LLM-as-judge is fine but only with examples of the judge being wrong.** Without that,
  you've added a confidently-wrong layer on top of a confidently-wrong layer.
- **Domain expertise beats LLM eval** when stakes are real (medical, legal, financial). A
  doctor reviewing 30 outputs beats GPT reviewing 3,000 in the same domain.
- **Eval is not CI — yet.** Run on commit when the cost is small. Run on every commit when the
  cost is justified. Decide deliberately.
- **Correctness isn't safety.** A green `/evals` pass isn't *done* until `/red-team`'s adversarial pass
  runs — safety degrades under attack even when correctness holds (AI Index 2026). Two rails, both required.
- **Non-deterministic ≠ run-once.** Measure consistency across k trials (pass^k), not a single happy-path run.
