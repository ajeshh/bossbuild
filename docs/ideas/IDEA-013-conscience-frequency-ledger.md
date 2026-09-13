---
id: IDEA-013
type: idea
owner: product-lead
status: shipped
gist: Measure how often the conscience fires rather than estimating what it costs, so BOSS doesn't become the expensive-AI app it warns founders about.
program: ai-native-boss
proof: src/insights.js
created: 2026-06-01
---

# IDEA-013 — Conscience frequency ledger (BOSS eats its own /ai-cost dogfood, honestly)

> **Shipped v0.34.0.** The honest last build of the "what does Opus 4.8 change about BOSS" arc
> (v0.31 drift → v0.32 judgment evals → v0.33 caution judge-backed → v0.34 this).

## Current shape

As judge-moments multiplied (v0.31 `drift`, v0.33 `caution` now do model *judgment* in the live
turn from a bounded read), the conscience began consuming real tokens per prompt — while BOSS
preaches cost discipline (`/ai-cost`, `cost-budget-loop`, `/cost-review`, the `cost`/`cost-stale`
moments) and never measured its own. The first 4.8 pass flagged the trap: *BOSS becomes the
expensive-AI app it warns against.*

The build started as "conscience **cost** instrumentation." The mentor-architect pass **reframed
it** — and the reframe is the load-bearing decision:

> **Frequency, not cost. Facts, not estimates.**

The conscience hook *never calls a model*. So "conscience cost" decomposes into (a) injection cost
(the `additionalContext` chars added to the turn), (b) induced-judgment cost (the bounded reads
judge-moments trigger in the main turn — **invisible to the hook** and the *dominant* term), and
(c) frequency (most prompts fire nothing). A char→token estimate would manufacture a billable-
looking number while structurally blind to its biggest component — *lying with numbers*, the exact
cost-theater BOSS warns against. PRINCIPLE #2 vetoes the cost version as premature ceremony.

But there's a *real* problem under the cost framing, and it's **over-firing** — the actual
mechanism by which a conscience becomes costly/annoying, and a trust-eroding failure mode the evals
already care about. "How often does each moment fire" is a number you'd *act on* (and the missing
input to future moments' eval sets). So: measure frequency honestly; let the cost question answer
itself later, host-side, when there's real token data (IDEA-006 territory).

## The five decisions (pinned)

1. **Frequency, not cost — facts not estimates.** Log: `ts`, `moments` (type + confidence),
   `judge` (bool — any fired moment induces a bounded read), `injected_chars` (a fact). **No token
   or dollar estimate** — the induced-judgment cost is invisible to the hook; a token number would
   be false precision.
2. **First fire-path side effect; must be correctness-invisible.** The hook goes from pure-emit to
   has-a-side-effect. `logActivity` runs only past the silent early-exit, append-only, single
   write, in its own swallowing try/catch. *Delete it and the conscience output is byte-identical.*
3. **Separate BOSS-meta ledger, never the founder's cost-log.** `.boss/conscience-log.jsonl` —
   BOSS's *overhead on top of* the founder's work, not the founder's app cost. Conflating it with
   `.boss/cost-log.jsonl` would poison `/cost-review`.
4. **Measure-only; self-throttle deferred indefinitely.** A throttle would gag the conscience
   exactly when a drifting founder generates more prompts and needs it most — **humane before
   viable.** One-way door (every "why didn't it speak?" becomes unfalsifiable). This ledger is the
   *evidence* that would earn the throttle conversation; it is not a step toward building one.
5. **Read surface extends the existing one.** `boss conscience activity` (alias `cost`, which
   prints the honest reframe header) + a one-line summary in `boss status --conscience`. No
   `/cost-review`-style cadence skill — that's MVP ceremony BOSS's own overhead hasn't earned.

## What shipped (v0.34.0)

- `logActivity` + `JUDGE_MOMENTS` in the hook lib; `.boss/conscience-log.jsonl` (gitignored).
- `boss conscience activity` / `cost` — fires, judge-share, median injected chars, per-moment
  counts, and the **over-fire smell** (clustering: a moment firing ≥4×/hour or ≥8×/24h — flagged,
  because no per-prompt denominator exists without logging non-fires, which would break the
  instant property).
- `boss status --conscience` activity one-liner.

## Deferred (loudly)

- **Self-throttle** — until evidence (this ledger) demands it. Probably never.
- **Token/dollar estimation** — host-contract territory; the only honest token count comes from the
  host (Claude Code), not the hook. See [[IDEA-006]] (conscience host-portability).
- **A conscience cost-review cadence/skill** — frequency-on-demand is enough.

## Cite

PRINCIPLE #2 (just-in-time, never premature ceremony — the rule that makes the *cost* version
premature and the *frequency* version earned). The frequency ledger is also the failure-dataset
substrate for future moments' evals (Husain). Related: [[IDEA-011]] (the pause primitive — the
other half of "the conscience must be controllable"), [[IDEA-006]] (where honest token data lives).
