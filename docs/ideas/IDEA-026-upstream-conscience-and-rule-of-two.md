---
id: IDEA-026
type: idea
owner: product-lead
status: shipped
gist: Fire the conscience at planning rather than review, where a misalignment is still cheap — plus the Rule-of-Two ring for agents that touch untrusted input, private data and the outside world.
proof: library/practices/agent-security.md
created: 2026-06-20
---

# IDEA-026 — Upstream conscience (fire at planning, not review) + the Rule-of-Two security ring

> Seed: 2026-06-20 trends + dhun research pass
> ([SESSION-2026-06-20](../research/sessions/SESSION-2026-06-20-trends-and-dhun-scan.md)). The biggest
> *conceptual* delta from the leader scan. Sharpens [[IDEA-022]]'s living conscience and
> [[IDEA-011]]'s override discipline; pairs the conscience reframe with a security default.

## Part A — fire upstream

The most-repeated 2026 idea across independent voices:

- **Maggie Appleton** (Apr 2026): agent alignment is a coordination crisis that *surfaces too late at
  PR time*; bring context **upstream**, align *before* implementation.
- **Andrew Ng** (2026): **"the Product Management Bottleneck"** — as building gets cheap, the
  constraint is *deciding what to build*, not building it right.
- **Karpathy** (Apr 2026): protect the founder's *understanding* — the one thing they can't outsource.

BOSS's loops/moments largely fire on **work already done** (drift, restraint, design-drift all read
artifacts that exist). The leverage Appleton/Ng name is *earlier*: interrupt **before** the agent
writes 500 lines — *"is this worth building?"* not *"is this built right?"* This is a **reframe of
where the conscience sits**, not just one more moment.

### Finding (2026-06-20 host-subtraction audit): most of Part A is ALREADY SHIPPED

The audit ([host-subtraction-pass-001](../dossier/host-subtraction-pass-001.md)) + a check of the
existing loops found **`spec-loop` already does the upstream restraint**: it fires (skill-invoked, when
the founder reaches for `/spec`) when canvas-loop hasn't closed — *"name what's missing, offer to back
up, hand the decision back."* That IS "don't build before you've named who it's for." So Part A is not
a new always-on loop — it's **a voice sharpening of `spec-loop`**: add the explicit *"is this worth
building / who's it for / what's the riskiest assumption"* framing to the restraint it already fires.
Lower-risk than feared (skill-invoked, already gated by the founder running `/spec`; not unprompted).
**Caveat from v0.52:** `/prototype` established building-first-to-sketch is legitimate and the
conscience fires *after* the sketch — so the sharpening targets `/spec`-**for-real** (committing to
build for keeps), never sketch time. **SHIPPED v0.54** (Ajesh: "Yes"): the `/spec` restraint frame now
carries the upstream question — *not "is it built right?" but "is it worth building? who is this for,
what's the bet that could sink it?"* (Ng/Appleton 2026) — and explicitly respects `/prototype`
(sketch freely; this fires only at build-for-real). NOT a new `worth-building-loop` (would redundantly
overlap spec-loop + caution + drift). Part B (agent-security) shipped v0.48/v0.50. **IDEA-026 done.**

### The design problem (originally why it was exploring)
- The cheapest upstream signal is at **spec/plan time** — when an IDEA promotes to a FEAT, or when a
  founder asks Claude to "just build X." A `plan`-time predicate ("does this have a named pain / a
  riskiest assumption / a kill criterion yet?") fires once, cheaply, before the build.
- Native host `plan mode` + `/goal` are the natural mount points (see [[IDEA-028]]) — a plan-mode
  exit hook or a SessionStart-on-new-FEAT check, not a per-tool-call hook.
- Risk: an upstream nag is the *most annoying* place to be wrong (it blocks momentum at the worst
  moment). It must be **rare, high-confidence, and skippable** — the inverse of over-firing.
  Eat [[IDEA-013]]'s frequency ledger here from day one.

## Part B — the Rule-of-Two security ring

**Simon Willison** (2026): security is *architectural, not patchable*; safety classifiers are
**non-deterministic**; sandbox by default; pin dependencies; apply Meta's **"Agents Rule of Two"**
(an agent should have at most two of: untrusted input, access to private data, ability to act/exfil).
BOSS ships the exact lethal-trifecta surface onto a founder's machine (CLAUDE.md + skills + hooks).

BOSS already shipped `secrets-guard` (v0.44) — the natural next ring:
- A `library/practices/agent-security.md` that names the lethal trifecta + Rule-of-Two in
  founder-language, routed JIT (not a wall of security text up front).
- A reframe of the conscience contract: **hooks are a deterministic guard *around* a
  non-deterministic model** — never trust the classifier alone (this is also the auto-mode hard-deny
  pattern from [[IDEA-028]]).
- Dependency-pinning + sandbox defaults as a cohort-gated nudge (domain-expert / regulated first).

## Smallest shippable slice
Part B first (cheaper, lower-risk): the `agent-security.md` practice + the "deterministic guard around
a non-deterministic model" framing folded into the conscience docs. Part A (upstream firing) needs the
[[IDEA-028]] host-mount decision first — capture, don't build until the plan-mode mount is chosen.
