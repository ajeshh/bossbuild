---
id: IDEA-021
type: idea
owner: product-lead
status: deferred (trigger-gated)
gist: How BOSS learns how BOSS is used, without becoming the surveillance it warns founders about. Mostly already-built primitives read differently, plus one genuinely dangerous deferred piece.
proof: src/fleet.js
created: 2026-06-05
---

# IDEA-021 — Passive instrumentation + the fleet-learning loop (how BOSS learns how BOSS is used)

> **PARKED 2026-08-20** (Ajesh: *"any other idea worth parking / archiving"*). `deferred` is the deliberate status — a decision, not a
> backlog item — and the re-open trigger is written in this file.
>
> **Parked on its own Riskiest-assumption section, which resolves against building:** *"Today the
> fleet is ~one real project (BOSS itself). A cross-project insights view with one project is
> ceremony… Until then the honest build is: keep the artifacts clean and well-shaped, and resist the
> dashboard."* **You cannot learn from a fleet of zero.** The record's own framing is that a polished
> metrics surface at n≈1 is *building around* the real risk rather than reducing it — the same
> discipline as [[IDEA-019]].

> **Capture, don't build** (CLAUDE.md #3). Seed: Ajesh, 2026-06-05 — *"how do we build metrics,
> usage data, new methods, and also to learn how users are using boss, so that we can track proper
> ways to build and improve boss passively?"* The honest answer is mostly **already-built primitives
> read differently** + one genuinely-deferred dangerous piece (share-up). This is the named home for
> that, not a green-light to add analytics.

## The trap (the load-bearing reframe)

BOSS's differentiator is the humane lens; its conscience exists partly to warn founders *against*
passive surveillance and attention-farming. So "passively track how users use BOSS" is the exact
move that makes BOSS the thing it warns against (the `mentor-humane` trigger: *is BOSS becoming the
thing it warns against?*). An analytics SDK that phones home on every command fails PRINCIPLE #6 in
BOSS's own construction.

> **"Passive" can't mean *surveil the user*. It means *the work already leaves an honest trace —
> read the trace, don't instrument the human.***

## The template already exists — generalize IDEA-013, don't import Mixpanel

The conscience frequency ledger ([[IDEA-013]], `src/conscience.js`) is this question answered once,
humanely. Its five pinned decisions are the house style for **all** BOSS instrumentation:

1. **Facts, not estimates** — log `injected_chars` (a fact); refuse a token *guess*. No vanity numbers.
2. **Correctness-invisible side-effect** — delete the logging and output is byte-identical.
3. **Local JSONL, never phones home** — `.boss/*.jsonl`, gitignored, founder-owned.
4. **Measure-only; never silently act on it** — the self-throttle was deferred *indefinitely* because
   acting on the signal silently is the one-way door.
5. **Read on demand** — `boss conscience activity`, not a dashboard that nags.

Everything below is "apply that contract again," not "add a new tracking layer."

## The five honest signal sources (layered by how earned they are)

1. **Artifacts *are* the telemetry (free, already-on).** BOSS projects accrete structured traces as a
   side-effect of working: `.boss/config.json` (mode + cohort), `conscience-log.jsonl`,
   `docs/devlog.md` (overrides), the canvas, the IDEA/FEAT/RVW/EXTR IDs, the CHANGELOG, loop
   open→closed states. The shape of a project's artifact pile **is** the usage data. Read what the
   work leaves behind; don't instrument clicks.
2. **`registry/projects.json` is the one cross-project lens — today, zero new code.** It already
   records every connected project and its mode. A read over it = the first "how is BOSS used across
   projects" view with nothing new built (mode distribution, graduation velocity, who's stuck at
   Quickstart for N days). Highest-leverage cheap move.
3. **The host owns the data BOSS can't honestly see — blocked on [[IDEA-006]].** Tokens, session
   length, turn counts: only the host (Claude Code) can measure these. IDEA-013 already named token
   data as host-contract territory. Don't fake it (the v0.34 cost-theater trap, already refused once).
4. **Opt-in share-up — the dangerous one, gated hard.** `boss sync` pulls patterns *down*; the inverse
   is projects voluntarily contributing anonymized pattern signals *up* so BOSS learns across the
   fleet. **This is where the humane lens has override authority:** opt-in, founder-owned,
   reviewable-before-send, never default-on. Name the *contract* now; build the *pipe* only when a
   second real project exists to compare against.
5. **Proto-personas are the real "users" today.** No real founders yet (conversations overridden
   through v0.19). The persona-reactions loop ([[IDEA-009]]) is the current usage instrument — synthetic
   founders reacting, signal without a human being surveilled.

## Passive collects; deliberate judges — never fuse them

The "new methods" half is PRINCIPLE #1 (pause-extract, UP/DOWN), already served by `/boss-learn`,
`/extract`, `/retro`, `/vet`. **Don't make method-discovery passive** — that's the IDEA-013 mistake
(manufacturing a number to feel data-driven). Instead:

- **Passive layer** flags *candidates* — *"this loop opened 14× and closed 0× across the fleet — the
  practice may be wrong."* An **extraction radar**.
- **Deliberate layer** (`/boss-learn`, a human) judges whether it's a real pattern.

The prize is passive *surfacing* of extraction candidates feeding deliberate judgment — not automated
method-invention.

## The metric that matters (don't fool yourself, reflexively)

BOSS's founding thesis is pseudo-app vs. real-value-app. Applied to BOSS's own metrics:
**skill-invocation counts are engagement vanity.** The signal that matters is the *outcome* — did
projects move idea → evidence? Modes graduated, loops closed, riskiest-assumption tested,
willingness-to-pay reached. Measure graduation and loop-closure, not activity — else BOSS's own
dashboard becomes the pseudo-signal it was built to expose.

## What to build, JIT-sequenced (PRINCIPLE #2)

- **Now (earned, cheap, dogfoodable on BOSS itself today):** `boss insights` — a read over
  `registry/projects.json` + each project's existing artifacts. Mode distribution, loop open/close
  lifecycle, graduation velocity, stuck-projects. Optionally generalize the IDEA-013 ledger to
  skill-invocations + mode-transitions *iff* a thin local JSONL is warranted. Zero network. BOSS is
  its own first user → produces signal on day one.
- **Soon (gated on a 2nd real project existing):** name the opt-in share-up **contract**. Defer the pipe.
- **Blocked:** host-side token/session data → needs the [[IDEA-006]] host contract first.

## Riskiest assumption (resolve before building)

**That cross-project usage signal is needed at n≈1 — vs. BOSS just dogfooding itself and reading its
own artifacts by hand.** Today the fleet is ~one real project (BOSS itself). A cross-project insights
view with one project is ceremony; `boss insights` earns its existence only when (a) there's a second
real project, or (b) reading BOSS's own artifact pile by hand actually hurts. Until then the honest
build is: keep the artifacts clean and well-shaped (so they're readable later), and resist the
dashboard. The same n=0/n=1 discipline as [[IDEA-019]] — a polished metrics surface at n≈1 is
*building around* the real risk (no users), not reducing it.

## Cite

PRINCIPLE #6 (humane before viable — the rule that turns "passive tracking" into a trap and gates the
share-up channel; `mentor-humane` has override authority here), PRINCIPLE #2 (JIT — what keeps
`boss insights` and the share-up pipe deferred until earned), PRINCIPLE #1 (the UP/DOWN extraction the
passive layer *feeds* but never replaces). Related: [[IDEA-013]] (the honest-instrumentation template),
[[IDEA-006]] (where real token/session data lives — the host contract), [[IDEA-009]] (proto-personas =
today's usage instrument), [[IDEA-019]] (the n=0/n=1 don't-build-around-the-risk discipline),
`/boss-learn` + `/extract` + `/retro` + `/vet` (the deliberate judgment layer). Seed: Ajesh, 2026-06-05.

## Gate

**Re-open trigger:** a **second real project** exists (not BOSS, not a `/tmp` throwaway), **or**
reading BOSS's own artifact pile by hand actually starts to hurt. Either one makes a cross-project
read something other than ceremony. Both are this record's own stated conditions.

⛔ **The share-up pipe stays refused regardless of the trigger** — that half is the one that would
make BOSS the passive-surveillance thing its conscience warns founders against, and no amount of
fleet size changes that. If the trigger fires, what re-opens is the opt-in *contract*, not the pipe.
