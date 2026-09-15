---
id: IDEA-059
type: idea
owner: tester
status: deferred (candidate 1 shipped v0.170.0; the rung 2-4 band v0.179.0; candidates 2 and 3 re-open on a real signal)
proof: stages/L1-mvp/template/.claude/skills/spec
proof_note: Rung 1 and the rung 2-4 band shipped (v0.170.0, v0.179.0) inside `/spec`; candidates 2 and 3 remain gated on a real signal. Path-existence is too coarse to prove the remainder.
created: 2026-08-20
source: Ajesh, 2026-08-20 — "what about our testing framework, and how we from seed to scale,
  integrate and develop testing via boss, so that we are shipping just in time enough level of
  testing, triaging, self healing, rca or ensuring failures is getting caught? in boss we have it,
  but it may be underbaked for what boss is trying to do."
---

# IDEA-059 — Testing is a spike at MVP, not a ladder; and nothing tells you it broke

> **The read in one line.** BOSS's *pre-ship* testing craft is genuinely good and lands entirely on
> one rung. What's missing is the **shape** (it never grows at V1 or Scale), the **back half** of the
> loop (detect → triage → RCA → prevent), and — the finding that matters most — **any unprompted
> moment at all**, in the one domain where an agent most reliably fools you.

## Where we actually are

| Mode | Testing surface | Verdict |
|---|---|---|
| **L0 Quickstart** (16 skills, 3 agents) | nothing | probably correct — see the refusals |
| **L1 MVP** (26 skills, 5 agents) | `/smoke` · `/evals` · `/red-team` · `/judge-traces` · `tester` | strong at the **ends**, hollow in the **middle** — see the rung audit |
| **L2 V1** (4 skills, 7 agents) | nothing | **the gap** |
| **L3 Scale** (1 skill) | `/incident` | post-mortem only, after you already know |

Testing arrives fully-formed at MVP and **stops growing**. V1 is the rung that adds `db-architect`
and four mentors — the point where a product earns regression suites, CI as a gate, and coverage
discipline — and it carries no testing verb, no testing agent, no testing loop.

This is the JIT ladder failing in the **opposite direction from the usual one**. BOSS is well-defended
against too much ceremony too early (Principle #2). It has no defense against ceremony that is
*earned and never arrives*, because every mechanism BOSS owns for calibrating ceremony is
subtractive. Worth naming as a general risk, not just a testing one.

## 🔴 Correction (2026-08-20, same day): the gap is not only between modes — it is INSIDE L1

The mode table above is true and was the wrong altitude to stop at. `testing-with-agents.md` already
carries a six-rung JIT ladder (*"what to test first, when you have nothing"*), and unlike
`quality-ratchet` it **is** wired — `tester` and `/spec` both reference it. Lining its rungs up
against what BOSS actually ships is the sharper audit:

| Rung (from the practice) | Verb that delivers it |
|---|---|
| 1. Does it run? one smoke path | ✅ `/smoke` |
| 2. **The money path** — the flow that, broken, means no product | ❌ **nothing** |
| 3. **The destructive path** — deletes, charges, sends, publishes | ❌ **nothing** |
| 4. **The negative path** — can user A reach user B's data | ❌ **nothing** |
| 5. Evals on the AI paths | ✅ `/evals` |
| 6. Judge validation | ✅ `/judge-traces` |

> **This table is the audit as it stood, kept for the record. Rungs 2–4 were closed in v0.179.0 —
> see *BUILT* below.** Named in `/spec` (+ the FEAT template), proved by `/red-team --paths`, walked
> by `tester`, and — for rung 4 only, and only when a shipped FEAT names a negative path —
> guarded by `verification-loop`.

**BOSS jumps from "does it run" to "is the AI good," and rungs 2–4 — exactly the unit / integration
/ end-to-end band — have no verb, no agent step and no loop.** Two aggravations:

- **Rung 4 is the one BOSS itself calls non-negotiable.** The practice says *"non-negotiable once
  there are two users"*; `ship-it-live.md` names authz/RLS as **the** headline vibe-coded breach
  class. BOSS names the most important test a founder will write and ships nothing to help write it.
- **Neither shipped verb answers "is my ordinary logic correct?"** `/smoke` tests aliveness,
  `/evals` tests the model. A founder building a **non-AI** feature has no verb — while the practice
  warns *"test the deterministic parts deterministically first; the model is expensive to debug through."*

**Vocabulary check, and it is stark: `"unit test"` appears ZERO times in `library/` + `stages/`.**
`"end-to-end"` appears twice and neither is about E2E testing (worktrees; and `/smoke`).

### What this says about `verification-loop` (shipped the same day)

Its exit is `.boss/smoke.json` — **rung 1**. So recording one smoke command silences the conscience
permanently while rungs 2–4 stay empty. The low bar was deliberate (a nudge must not nag) but against
this ladder **the loop goes quiet exactly where the real gap starts.** The fix is not to raise the bar
— it is that **rungs 2–4 need a verb before the loop has anywhere higher to point.** Recorded as a
known limitation of what shipped, not defended.

### ✅ BUILT (v0.179.0) — rungs 2–4, composed, no 48th skill

Shipped exactly as the correction predicted: **composition, not a new verb.** 47 skills before, 47
after. Where each rung landed, and why there:

| Piece | Where | Why there |
|---|---|---|
| **Naming** rungs 2–4 | `/spec` step 4 + a gated *Paths that must not break* section in the FEAT template | A path is nearly free to name while deciding what "done" means and near-impossible to retrofit. Acceptance criteria were already the right neighbourhood. |
| **Proving** them | `/red-team --paths` | The pre-ship app-security pass was **already non-AI** (secrets in the bundle, OWASP basics) and already framed as *turn prevention into evidence*. Rung 4 was the hole inside a section that existed. |
| **In-loop check** | `tester` step 4 | It already walks acceptance criteria; the paths are the founder's own list of what would hurt. |
| **The vocabulary** | `testing-with-agents.md` | "unit test" went from **0 → 3** occurrences. Unit/integration/E2E named as *shapes* mapped onto the rungs, with the honest reason the middle band goes unwritten: unit tests are what an agent volunteers to write, which is also why they're the ones most likely green-by-construction. |
| **The conscience** | `verification-loop`, guarded second exit | Below. |

**The one thing that needed new mechanism, and it wasn't a skill.** The founder chose "raise the bar
only where the risk is real," and the loop runtime could not express it: exit predicates are AND-ed,
with no OR and no conditional, so *"require this only for projects that earned it"* had no encoding.
Added `when:` — a guard list on any predicate; if unmet the predicate is **vacuously satisfied**.

That is a bigger deal than the one loop that uses it. This document's own thesis was that **every
mechanism BOSS owns for calibrating ceremony is subtractive**, so it has no defense against ceremony
that is *earned and never arrives*. `when:` is the additive one — a bar that turns on when earned.
No existing loop uses it, so all eleven shipped loops evaluate byte-identically.

**The guard reads the founder's own words, not the shape of their code.** Rung 4 turns on only when a
FEAT at `shipped`/`done` names a negative path — the line `/spec` writes. Both halves earned their
place in the build:

- **Shipped-only** was a correction found while writing the eval cases. The first guard matched any
  FEAT, so *specifying* a feature you hadn't built would open rung 4 against surface that doesn't
  exist. Nothing is exposed until it ships — the same logic the entry predicate already uses to
  refuse a shipped spec with no code. Cases `m-unver-206`/`207` pin it from both sides.
- **The founder's words, not inference**, is the anti-nag rule. BOSS never concludes "you probably
  have user data." A founder whose honest answer is *"nobody, it's single-user"* gets the pre-v0.179
  behaviour exactly: one smoke command, silence. `m-unver-205` is the most important case in the set —
  if the honest answer became the expensive one, founders would learn to leave the line blank.

**The frame had to learn to branch, or it would have lied.** The rung-1 frame asserts *"nothing is
recorded that can answer is it alive"*. Said to a founder who recorded smoke months ago, that is
flatly false — the overclaim pattern this repo keeps catching in itself. So exit evidence now carries
`ok`, and `unverified` has two frames: rung 1, and a rung-4 frame that **opens by acknowledging the
smoke command exists** and quotes the founder's own negative-path line back to them.

Gate **136 → 143, 0 failed.** Verified against the real hook in a scaffolded `/tmp` project across
five scenarios: rung 4 fires with smoke present · recording the result closes it · no negative path
stays silent · a negative path on a `building` FEAT stays silent · flipping it to `shipped` opens it.

**Also fixed in passing:** `boss status --conscience --verbose` rendered an unmet `any_file_matches`
as `0 / 0 file(s) match` — true and useless. The evidence now carries its glob, so it reads
`0 / 0 file(s) match in docs/red-team/RT-*.md`. Every loop using that predicate benefits; the second
exit is just what made it visible.

### What is still NOT built

- **Rung 2 and 3 have a naming home and a proving home, but no *unprompted* moment.** Only rung 4
  guards the loop. That is deliberate — rung 4 is the one with a named breach class — but a founder
  who never runs `/red-team --paths` still has an unproved money path and nothing says so.
- **Candidate 2 (post-ship detection) and candidate 3 (the L2 rung) are untouched**, both still
  gated on a real signal. n=0 on both.
- **`quality-ratchet.md` still has no runtime.** Named in this doc's leg 5 and unchanged.

### This displaces candidate 3

The L2 rung was ranked third. **Rungs 2–4 at L1 now outrank it** — they are earlier in the ladder,
BOSS's own practice already calls one of them non-negotiable, and they are the band a founder asks
about by name ("what about unit tests and end-to-end?"). Still gated on the subtraction mandate: the
honest first move is almost certainly **composition into `/spec`** (acceptance criteria already name
the paths) rather than a new verb.

## The loop, leg by leg

**1. Detect, pre-ship — strong, keep.**
`/smoke` (alive) vs `/evals` (correct) is a real distinction most tooling blurs. `tester`'s
*read the test diff harder than the code* is the sharpest line BOSS owns: assertion churn with no
acceptance-criteria change, a case deleted "because it was flaky," a widened matcher — each treated
as a claim someone must defend. Nothing to fix here.

**2. Detect, post-ship — THE HOLE. Nothing exists.**
A sweep of `library/practices/` and all four `stages/` for error tracking / monitoring / alerting /
uptime / on-call returns **zero**; the only near-hits are *cost* observability and the subprocessor
list in `/trust`. `/incident` opens on an outage the founder already knows about. So the founder runs
`/ship`, and **BOSS has no opinion on how they find out it broke.** This is the exact leg the ask
named ("ensuring failures is getting caught") and the only one with no answer at all.

**3. Triage — absent, and the vocabulary is occupied.**
Nothing sorts a failure into *bug / flake / spec disagreement / model regression*. And `/triage`
already means **idea capture** in L0, so the obvious name is taken — a naming problem to solve before
a build, not during one.

**4. RCA — one skill, at the wrong altitude.**
Only `/incident` (L3, outage-scoped, output = "the ONE systemic lesson"). Nothing serves the far more
common case: *this bug keeps coming back and I don't know why.* That is an L1/L2 need answered only
at L3, which most projects never reach.

**5. Prevent — the mechanism ships as reading material.**
[`quality-ratchet.md`](../../library/practices/quality-ratchet.md) is the one "quality moves in one
direction" idea BOSS owns, and **nothing in `stages/` references it**. A practice with no runtime.

## 🔴 The finding to lead with: the conscience is silent on testing

Fourteen loops ship across four modes — spec, drift, focus, cost ×2, design ×2, coordination,
AI-failure-states, margin, pretotype, extraction, canvas, capture. **Not one fires on testing.**

BOSS's entire differentiator is the *unprompted* judgment layer. The domain where an AI agent most
reliably fools a founder is **tests the agent wrote itself** — which is BOSS's own named failure mode,
written down in `tester` and `testing-with-agents.md`. That domain is the only craft area with no
unprompted moment. The best line in the product fires **only if the founder already remembers to ask.**

That is the same class of defect as v0.165.0's: the knowledge is present and correct, and has no route
to the founder at the moment it matters. There it was a mentor that never named its own subject; here
it is a conscience that never speaks about the one thing it is best positioned to catch.

## The refusals (decide these before building anything)

- **Self-healing assertions: REFUSE, loudly.** BOSS's own practice says agents rewrite assertions to
  match broken behaviour. A self-healing test layer *automates that failure mode* — BOSS becoming the
  thing it warns against. `/smoke` already states the stance (*"Don't try to fix it inside this skill
  — surface it; the user or the `tester` agent decides"*).
- **Self-healing infrastructure: allow, narrowly.** Retry, reseed, restart a flaky harness. The split
  is *the environment may heal itself; the expectation may not.* Worth stating as one line, because
  today the stance is written once in `/smoke` and was never re-decided as models improved — the same
  "a deferral whose condition expired" shape `mcp.md` was caught by.
- **L0 stays empty.** A Quickstart founder has no product to regress. Adding testing there is the
  ceremony Principle #2 refuses, and EVID-001 holds — a beginner told to write tests on day one
  learns that BOSS is homework.
- **No coverage percentage, ever.** A number that rewards writing tests for the easy half. The ratchet
  (one number, one direction) is the honest version and it already exists.

## The three candidates, in value order

**1. A testing conscience moment — ✅ SHIPPED v0.170.0** as `verification-loop` / moment `unverified`. Cheapest, most BOSS-shaped, uses a mechanism
that already ships, adds **no skill**. Candidate predicates (all cheap, all deterministic): shipped
with no smoke check; assertions changed with no acceptance-criteria change in the same diff; the eval
set unrun across N FEATs. This is pure composition — it puts the `tester` line where it fires
unprompted. **It is also the only one of the three that needs no new vocabulary and no founder
decision**, which is why it goes first.

**2. Post-ship detection, composed into `/ship`.** The missing leg. `/ship` already runs a pre-flight;
the honest extension is one question — *"how will you learn this broke?"* — stack-neutral, no vendor
(Principle #4, the rule that killed RVW-011). Not a monitoring integration; a decision, in the shape
of `mcp.md`'s three shapes. **Gated on:** naming the rung honestly for a pre-PMF app, where the right
answer is often "you'll hear it from your one user."

**3. The L2 rung — what testing *becomes* at V1.** The ratchet gets a runtime; regression discipline;
CI as a gate rather than a mention. **Gated on** the naming problem (`/triage` is taken) and on the
subtraction mandate — this is the one that would grow the surface, so it needs the strongest case.

## What shipping (1) actually taught

- **The two-predicate entry was load-bearing for more than correctness.** Requiring *both* a
  shipped FEAT and real `src/` is what makes the loop cross-talk with **nothing** — `moment-focus`
  has FEATs and no source, the cost/failure-mode sets have source and no FEATs. Two eval cases now
  pin that rather than trusting it.
- **`computeConfidence` reads whichever count predicate comes FIRST**, so predicate *order*
  silently sets reported confidence. Ordering the `src/**` character-count first would have made
  every fire "high" off file size alone. Left as-is (changing it touches all 11 shipped loops and
  the gate) but now pinned by a test and named here — a real trap for the next loop author.
- **Two silent authoring traps in the eval harness**, both of which fail *green*: the YAML parser
  supports neither multi-line scalars (a wrapped `why:` made 6 of 7 cases vanish while the suite
  still reported passing) nor `\n` escapes in inline `content:` (literal backslash-n, so `^status:`
  never matched). Worth a harness fix or a loud parse-count assertion — **a suite that silently
  drops cases is worse than one that fails.**

## Earn-it gates (what would make each real)

- **(1)** needs nothing external — it is composition of held knowledge, same class as v0.165.0's
  mentor rows. Ship when convenient.
- **(2)** and **(3)** are both stronger with a real signal: a founder who shipped and didn't find out,
  or a project that reached V1. **n=0 on both today.** Applying the `mcp.md` discipline honestly, a
  market read is not the demand half — and the standing mandate is compose-and-subtract.

## Related

[[IDEA-056]] (the freshness discipline — testing's practice is fresh; the *ladder* is what rots) ·
`testing-with-agents.md` · `quality-ratchet.md` · `git-workflow.md` (the review half) ·
EVID-001 (compose and subtract) · v0.165.0 (the same "owns the subject, never names it" defect).

## Re-grade 2026-09-09 — nothing here is executable, and the gate section said otherwise

**Both remaining candidates are n=0 gated by this record's own text**: candidate 2 (post-ship
detection) wants *a founder who shipped and didn't find out*; candidate 3 (the L2 rung) wants *a
project that reached V1*, and is the one that would **grow** the surface, so it carries the heaviest
burden under the standing mandate.

🔴 **The "Earn-it gates" section is stale and was the only thing that read as executable.** It says
*"**(1)** needs nothing external — it is composition of held knowledge... **Ship when convenient.**"*
Candidate **(1) shipped at v0.170.0** as `verification-loop` / moment `unverified` — the section
above it says so. A gate describing a shipped candidate as ready-to-ship is how a parked record keeps
looking like live work. Read the candidate list, not the gate list.

`deferred`, trigger written: **a real post-ship signal, or a project that reaches V1.**
