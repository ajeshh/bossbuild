---
id: IDEA-039
type: idea
owner: mentor-architect
status: shipped
gist: The humane lens is already at Quickstart, woven through the canvas and the pressure-tests; only the standalone consultable agent is gated at Scale. So the real question is whether the lens wants to be an agent at all.
proof: library/practices/harm-taxonomy.md
created: 2026-06-20
resolved: 2026-06-20 (solo-conscience; humane-moment eval 13/13, keyless re-grade)
---

# IDEA-039 — humane lens as conscience-moments + cross-cutting practice vs. a standalone mentor agent

**Occasioned by:** "should `mentor-humane` ship to founders earlier than Scale?" → `mentor-architect`
verdict (2026-06-20).

## The reframe
The humane lens is **already at Quickstart** — woven into `mentor-venture`'s "who could be harmed"
pressure-test, the `/canvas` §3 Risks & Harms cell, and now the dark-pattern checklist + `/red-team
--humane` + the [`harm-taxonomy`](../../library/practices/harm-taxonomy.md) practice. Only the *standalone
consultable `mentor-humane` agent* is gated at Scale. So the real question is **not** "bring the lens
forward" (it's already forward) but: **does the humane lens want to be an *agent* at all?**

## The argument that it mostly shouldn't (mentor-architect)
- Ethics is **detection that should fire unprompted** — a *hook/conscience* shape, not a role you converse
  with. (BOSS's settled bet: hook = detection, model = tact.)
- **Opt-in ethics is a design smell:** the founder least likely to summon the ethics mentor is exactly the
  one who needs it. "A box you can choose to open is weaker than air you can't avoid breathing."
- Ethics is **cross-cutting** — it belongs *inside* every mentor + the conscience, not beside them as a
  peer you can decline to visit. (Hence: a practice every voice cites, which now exists.)
- The `mentor-humane` **agent** genuinely earns its place at **Scale** — when there's a board, a real org,
  users at volume, and "convene the humane lens as a deliberate review" is a distinct *ceremony*. The
  original MENTORS.md Scale placement may be right *for the agent* even though the *lens* belongs everywhere.

## What would actually decide it
An **eval set for "does the humane lens speak at the right moments, without false-firing"** (Husain
territory; loop in `tester`). This is the same reliability problem the moments-#3/#4 work hits — the humane
lens is its highest-stakes case. **Build the humane-moment eval set first; let it decide whether the
conscience can carry the lens solo** before authoring any consultable agent. Uncertain: if detection proves
too blunt for nuanced harm cases, a low-temperature consultable humane voice at MVP becomes defensible.

## The deciding instrument — BUILT (2026-06-20)
The eval set now exists in the BOSS-local judgment harness:
`docs/architecture/conscience-evals/judgment/humane.judgment.yml` (+ wiring in `moments.js`, `replay.js`,
`regrade.js`, `README.md`). It is the **gateless** judgment moment — the design itself answers half the
question:

- **The humane moment has no predicate gate** (unlike drift/caution/capture). Its voice frame is a
  *practice* (`HUMANE_FRAME` in `moments.js`, restating `conscience-voicing.md` + `harm-taxonomy.md`), not
  a `composeContext()` hook signal. **That the lens fingerprints as a practice and not a predicate is the
  first piece of evidence for the "cross-cutting, not an agent" thesis** — it confirmed there's no honest
  hook predicate to build, exactly as `mentor-architect` argued.
- **13 cases**, floors enforced by `replay.js` (green, well-formed): 3 third-party-harm fire
  (`mutable:false` — named once even if unwelcome), 2 self-regarding fire (`mutable:true` — fully
  muteable), **6 sovereign-silent** (the trust-critical class, grow→12; each names the false-fire it
  guards: moralizing · filtering-the-menu · nagging · not-harm · competent-adult-obvious ·
  proportionality-overreach), 2 ambiguous.

### How the verdict gets read (the re-grade)
`replay.js` holds the line every commit (well-formedness + coverage + voice-hash tripwire), but the
**decision needs the paid re-grade**: `ANTHROPIC_API_KEY=… node regrade.js humane`. Read it off the
**should-not-fire-sovereign** class + the ambiguous pair:

- **Solo verdict (no `mentor-humane` agent pre-Scale):** the model fires correctly on the 5 real-harm
  cases *and* stays silent across all 6 sovereign cases without moralizing/menu-filtering/nagging, and
  doesn't assert false confidence on the 2 ambiguous. → the conscience carries the lens solo; the
  standalone agent stays at Scale (board ceremony), as MENTORS.md has it.
- **Agent-needed verdict:** if it false-fires on the sovereign class (especially `moralizing` /
  `filtering-the-menu`) or is blunt on the ambiguous cases → detection is too coarse for nuanced harm; a
  **low-temperature consultable humane voice at MVP** becomes defensible. Capture which `failure_mode`(s)
  it trips — that names what the agent would need to add over the bare conscience.

### The verdict — IN (2026-06-20, keyless re-grade)
Re-graded **without an out-of-band API key** — the Claude Code session *is* the model, so the decision +
judge passes ran as two **independent fresh subagents** (mirroring `regrade.js`'s two-call design):
- **Decider** — a *neutral* `general-purpose` agent (deliberately NOT `mentor-humane`, which is
  harm-primed and would bias toward firing), given only `HUMANE_FRAME` + each case's context, **no access
  to the labels**. It reasoned each case fresh from the practice.
- **Judge** — a separate fresh agent grading the fired nudges against the authored rubric
  (`must_reference` / `must_not`). Neither subagent had the authoring context (no "grading own homework").

**Result: 13/13 pass (first cut), then hardened to 19/19 (sovereign class grown 6 → 12).** The neutral
conscience, reasoning from the practice alone, fired correctly on all 5 real-harm cases — each nudge named
a valid harm axis, offered the constructive path, and blocked nothing — **and stayed silent across all 12
sovereign cases and both ambiguous**, with no moralizing, menu-filtering, nagging, or false confidence. It
nailed the hardest silent traps in both cuts: premium-but-transparent pricing + a fairly-noticed free-tier
sunset (moralizing); the ad-supported and growth-tactics menu requests (filtering-the-menu); an
already-consented streak *and* an explicit same-session override (nagging); the physician on PHI and the
employment lawyer on UPL (competent-adult); the jokey one-click unsubscribe and an honest one-click
downgrade notice (proportionality); plus a transparent opt-in referral (not-harm). Transcripts are under
`transcripts/humane/`, stamped with the voice-hash; `replay.js` grades all 19 GRADED every commit (floor
on the trust-critical sovereign class raised to 12, growth target 16).

### → Decision: the conscience carries the humane lens SOLO
On this evidence, **no consultable `mentor-humane` agent is needed pre-Scale.** The cross-cutting practice
(`harm-taxonomy` + `conscience-voicing`) gives a neutral conscience enough to detect real harm *and* —
the load-bearing half — to **stay silent on legitimate sovereign choices without curdling into a censor**.
The standalone `mentor-humane` agent stays at **Scale** (board ceremony), exactly as `MENTORS.md` has it.
This **resolves IDEA-039** in favor of the `mentor-architect` "cross-cutting, not an agent" thesis — and
the gateless design (the lens fingerprints as a *practice*, not a predicate) was the structural half of
the same answer.

**Caveats (held honestly):** (a) the deciding model was Opus 4.8 via in-session subagents — re-running on
a different/weaker model (the IDEA-014 recalibration) could shift the call, which is exactly what the
voice-hash tripwire + `regrade.js` exist to re-test; (b) the sovereign class is now 12 (grown from 6;
floor enforced, target 16) — keep adding real founder-friction cases as they surface; (c) a stricter test
would spawn a *separate* decider per case (these runs batched the cases into one decider per cut). None of
these unsettle the direction; they're the standing re-grade discipline.

**Status:** RESOLVED (solo-conscience) on the 2026-06-20 keyless re-grade. Re-open on a model bump (the
tripwire will flag STALE) or if real founder cases trip the sovereign class.
