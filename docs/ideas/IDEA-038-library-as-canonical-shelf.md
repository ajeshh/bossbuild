---
id: IDEA-038
type: idea
owner: mentor-architect
status: shipped
gist: library/agents|skills|hooks was a shelf nothing read, nothing deployed from, and nothing had ever written to. Cut in v0.248.0 — the shelf holds what BOSS knows, the stages hold what BOSS ships.
proof: test/learn-destination.test.js
created: 2026-06-20
resolved: 2026-09-08
---

# IDEA-038 — `library/` as the canonical managed-artifact shelf; templates become thin

**Occasioned by:** the RVW-045 misroute (a harm-taxonomy "routed into mentor-humane" landed in BOSS's
gitignored `/.claude/` and shipped to nobody) → `mentor-architect` verdict (2026-06-20).

## The smell
`library/agents/` exists, contains a duplicate `mentor-venture.md`, and is **read by nothing**. Scaffold
(`applyStage()`, `src/scaffold.js`) and sync (`managedFiles()`, `src/sync.js`) both read agents/skills/hooks
**only** from `stages/<id>/template/`. So a reusable artifact (a mentor/skill/hook definition) *can't* be
reused without copy-paste — the exact lock-in Principle #3 forbids — because the deployment path doesn't
look at the shelf. Skills + hooks are similarly split-brained (live in both `library/` and templates).

## The north star (proposed 2026-06-20 — NOT what shipped; see below)
Make `library/` the **canonical source of truth** for every managed artifact; stage templates become
**thin manifests** that *resolve* agents/skills/hooks from the library JIT per mode. Then: one source per
artifact, a data-driven mode→artifact mapping, and the learning loop (Principle #1 UP) feeds the same
shelf scaffold reads from — mentors-as-UP becomes real.

## Why it's an IDEA, not a now-fix (mentor-architect)
- It's a **deployment-engine rewrite** (touches `managedFiles()` + `applyStage()`, the two load-bearing
  CLI functions) — not a file move; substitution + managed-file drift-detection must keep working for both
  fresh scaffold *and* incremental sync.
- It's **partly a one-way door**: once in-the-wild projects sync against a library-sourced layout,
  reverting means re-reconciling their stamps.
- The duplication pain is currently **1 file** — Principle #2 says don't pay for the abstraction before
  the project earns it. **Let it be pulled by real cross-mode reuse from the learning loop** (e.g. when
  practitioner-seeded mentors that span multiple modes need one source), not pushed by a routing bug.

## Smallest first step (if/when pursued)
Pick one artifact class (agents), add a resolver so a manifest entry can name `library/agents/<x>` and the
deployer pulls it; prove it for fresh scaffold + sync on one mentor; then generalize. Graduates to a FEAT
when the loop creates real DRY pressure. See `docs/architecture/2026-06-20-mentor-internal-vs-shipped-boundary.md`.

---

## ✅ RESOLVED 2026-09-08 (v0.248.0) — by SUBTRACTION, the inverse of the north star

🔴 **The deferral's own reason is falsified. It was never 1 file.** Surveyed at v0.245.0: **8 artifacts
in `library/` had a shipped twin, and 4 had drifted — every one stale on the library side.**

| artifact | state |
|---|---|
| `agents/mentor-founder.md` | 62L vs 103L shipped — no role-shift ladder, no `/health` hinge, no *read the state first*, no `/consult`, no dossier beat |
| `skills/boss-sync/SKILL.md` | 48L vs 119L |
| `hooks/design-tokens-guard.js` | **missing the v0.243.0 shape-range fix**: no `.swift/.kt/.dart/.xml`, no Android tokens-file skip, no packed-color-int pattern |
| `hooks/secrets-guard.js` | pointed at `library/practices/context-discipline.md` — **the dead pointer `src/craft.js` exists to kill** |
| `skills/boss-learn`, `hooks/auto-log.js`, `hooks/memory-cue.js` | identical — reconciled BY HAND during v0.245.0 |
| `practices/` (33 files) | no twin at all — genuinely canonical, real reader in `boss craft` |

🔴 **And the mechanism had never been used once.** `learn()` writes a CHANGELOG line of the form
``Learned `x` into `library/<cat>/x` ``. That string appears **zero times in 245 releases**. Every file
in those folders was hand-placed. *Not an abstraction the project hadn't earned — one it tried and
didn't use.*

**Two facts decided the direction:**

1. The north star's only unique payoff is **cross-mode reuse** — one agent file serving two rungs. It
   has never happened. `designer` L2→L1, `mentor-capital` L2→L1, `mentor-hiring` L2→L3: agents **move
   between rungs; they don't live at two.** Paying a one-way-door rewrite of `applyStage()` +
   `managedFiles()` for reuse the product has never needed is the wrong trade.
2. `library/` **ships in the npm tarball** (`files` in package.json), so those 7 files were on every
   founder's disk, read by nothing on their machine — `src/paths.js` exports exactly one library path,
   `PRACTICES_DIR`.

**Shipped instead:** the three mirror folders deleted; `boss learn --as agents|skills|hooks` requires
`--mode` and lands in `stages/<id>/template/.claude/<class>/`, **registering the artifact in that
stage's manifest** (a file the manifest doesn't claim never syncs, so copying alone would have moved
the dead drop rather than closed it). A new hook files as `optionalHooks` — whether it fires for every
founder is a decision, not a side effect. Registration is deduped, per the v0.189.0 `designer` race.

**Rejected: gating the drift** (reconcile the 4, add `check:shelf`). It would have made a false claim
*enforceable* rather than *true*, and a checker whose job is keeping a duplicate in sync is the ceremony
PRINCIPLE #2 refuses.

🔴 **`library/README.md` line 3 was false** — *"the superset that stages draw from"*; stages draw from
nothing. [[checkers-state-intents-they-dont-enforce]] n=28, in the shelf's own front door.

**Guards:** `test/learn-destination.test.js`, 5 cases, verified to fail when planted. The load-bearing
one is the *stronger* form — **no shelf file may share a basename with anything that ships** — because
that is the assertion that would have caught the original drift, rather than only the folder's return.

**Left open, deliberately:** `memory-seed/` has the same no-reader property, but it is content with no
shipped twin rather than a mirror, and it is empty of actual seeds — [[IDEA-020]]'s hole, not this one.
Folding it in would have widened a clean subtraction.
