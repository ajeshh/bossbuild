---
id: IDEA-014
type: idea
owner: product-lead
status: shipped
gist: Riding the model curve on purpose instead of ad hoc. Fires when the SHAPE of the tradeoff moves — not when a model ships, since BOSS pins capability shapes rather than model names.
program: standing-freshness
proof: library/practices/model-routing.md
created: 2026-06-01
---

# IDEA-014 — Model recalibration as a standing discipline (ride the model curve on purpose)

> **Phase 1 shipped v0.35.0:** the recalibration *engine* (`regrade.js`, live model grading of the
> judgment sets, zero-dep, env-gated) + the *checklist*
> ([MODEL-RECALIBRATION.md](../architecture/MODEL-RECALIBRATION.md)). The capability-profile +
> `/recalibrate` skill stay deferred until a second model/host earns them (PRINCIPLE #2).
>
> **Phase 2 shipped v0.101.0 (Fable Sprint item A):** a second model (Fable 5) now exists, so the
> deferred pieces are earned. Shipped the declarative **`.boss/model-profile.json`** (model table +
> pricing + routing map + `last_recalibrated` + `reopen_on` — read by skills, never by the zero-dep
> CLI), the **`/recalibrate` skill** (the standing pass, event-fired like `/humane-refresh`), and
> **Fable routing at the subagent seam** — all `mentor-*` carry `model: fable`, and `/vet` +
> `/red-team` spawn their verdict/attack subagent on Fable. Hooks and volume work stay on the session
> model (Opus 4.8); the host can't swap per-hook anyway. Compressed rule: *verdicts on Fable, volumes
> on Opus, hooks stay host.* Host-degrade machinery still deferred until [[IDEA-006]] ships a second
> host.

## Current shape

The v0.31–v0.34 arc proved BOSS *can* recalibrate to a stronger model (Opus 4.8 → moved the
conscience from predicate-detection toward model-judgment). But it did so **ad hoc** — a one-off
reaction to one model. Ajesh's point: this should be a **standing capability**, fired on two
recurring events:

1. **A new model from the same vendor ships** (Opus 4.9, a stronger Sonnet…) → *leverage more*:
   what was "too expensive / too unreliable to ask the model" may now be cheap and reliable.
   Boundaries should be revisited, not frozen.
2. **BOSS expands to a host that runs a different model** (Codex, a cheaper-model host, a
   non-Claude agent — IDEA-006 territory) → *recalibrate / degrade gracefully*: a host on a
   weaker/cheaper model may need judge-moments to fall back to predicate-only.

> The load-bearing principle: **every BOSS capability that delegates to a model encodes an implicit
> assumption about what that model can do.** When the model changes, those assumptions are stale.
> Today they're frozen at author-time and only revisited when someone happens to notice.

This is also the *operational* form of the positioning reframe ([positioning §9a]): "BOSS rides the
model curve, doesn't race it" is only true if recalibrating is a discipline, not luck.

## The pieces already exist — they're just not unified

This isn't greenfield; it's *connecting* what's scattered:

- **`regrade.js` + the voice-hash tripwire (v0.32)** — already designed to re-grade judgment evals
  when the frame *or the model* changes. The recalibration trigger is half-built.
- **`eval.md` re-open conditions** — already lists *"the model shifts (host upgrade,
  system-prompt change) → re-run the existing set."*
- **The frequency ledger (v0.34)** — already measures whether judge-moments are cheap enough to add
  more, or firing too often. The "should we leverage more / less" evidence.
- **IDEA-006 (host portability)** — the "different models for different tools" surface; names the
  host contract but defers the port.
- **`/claude-api` skill** — already does Claude-version *migration* for founders' apps. The founder
  faces the same problem BOSS does.

What's missing is the **discipline that fires the recalibration and the profile that drives it.**

## What it could become (for a later pass — not yet decided)

Two artifacts, roughly:

1. **A model-capability profile** — `.boss/model-profile.json` (or per-host): declares the tier of
   the model the conscience is running against, and which judge-moments are active vs. degraded to
   predicate-only. A capable host runs `drift` + judge-backed `caution`; a cheap-model host runs
   the predicate gates only. This is what makes "different models for different tools" concrete: the
   profile gates capability, the moments degrade gracefully.

2. **A recalibration pass** (a skill, maybe `/recalibrate`, or a loop) that fires on the two
   triggers and walks a checklist:
   - Re-grade the judgment evals on the new model (`regrade.js`) — did any drift/caution call
     change? (The tripwire flags this; the pass acts on it.)
   - Revisit each model-delegating boundary: *could this predicate become a judge now?* (leverage
     up) or *does this judge need a fallback for a weaker host?* (degrade down).
   - Read the frequency ledger: are judge-moments cheap/rare enough to add more, or over-firing?
   - For founders: the SAME pass applied to *their* AI-native app (their evals, prompts, cost,
     failure-states) when they switch models — recalibration is a recurring founder task, not just
     BOSS's. This is a strong **UP candidate** (PRINCIPLE #1): a superset practice every AI-native
     project inherits.

## Riskiest assumption (resolve before building)

**That recalibration is frequent/valuable enough to deserve standing machinery — vs. premature
ceremony (PRINCIPLE #2).** Today there's one model and one host. A `/recalibrate` skill with no
second model to recalibrate *to* is the cost-theater trap v0.34 just avoided. The honest test:
- The **leverage-more** trigger is real *now* (4.8 has headroom we haven't used — see below).
- The **degrade-for-weaker-host** trigger isn't real until IDEA-006 ships a second host.
So the near-term earned slice is probably "leverage the current model more, systematically" + a
*lightweight* recalibration checklist (a practice doc), with the capability-profile + skill deferred
until a second model/host actually exists.

> **External signal (added 2026-06-02, via [RVW-001](../research/verdicts/RVW-001-karpathy-four-rule-claude-md.md)):**
> a ~220k-star Reddit thread on the four-rule CLAUDE.md drew a top skeptical comment (StokeJar) that
> independently arrived at *exactly this thesis* — hardcoded model-behavior overrides are brittle
> *because the model/harness curve moves* ("Opus 4.6 didn't ask enough; 4.8 asks too many"), and the
> right move is to recalibrate per model, not freeze rules. A stranger with no knowledge of BOSS
> reasoning his way to the recalibration argument is real outside evidence that this riskiest
> assumption resolves toward *yes, it's valuable* — strengthening the case for the lightweight
> checklist now.

## Near-term: 4.8 leverage we haven't used yet

Concrete headroom, independent of the standing discipline:
- **Deep-context drift pass.** `drift` deliberately does a *bounded* ~5-entry read (cost). With 1M
  context, a periodic *deep* pass could compare the stated riskiest-assumption against the *whole*
  project — the original "are you fooling yourself across everything" check, now affordable.
- **More judge-moments.** The v0.33 pattern (predicate gate → model judgment) generalizes;
  `restraint` / `coherence` / `cost` could gain judgment layers.
- **`regrade.js` actually run.** The deferred judgment grader is itself a "leverage the model" build
  — it turns the labeled sets from "not yet model-verified" into verified.
- **More capable mentors.** 1M context holding the whole dossier + project makes the mentor board
  far less generic.

## Cite

PRINCIPLE #1 (UP — recalibration is a superset practice founders inherit), PRINCIPLE #2 (the rule
that says *don't* build the full machinery until a second model/host earns it). Connects:
[[IDEA-006]] (host portability — the "different models" surface), the positioning compounding
reframe (§9a), `regrade.js` / `eval.md` (the recalibration trigger, half-built), [[IDEA-013]] (the
frequency ledger — the evidence input). The seed: Ajesh, 2026-06-01 — *"when there is new claude or
different models for different tools, we should consider how to keep updating the functionality or
recalibrate to the new."*
