---
id: DEC-005
type: decision
owner: "@ajeshh"
decided_by: founder
status: decided
created: 2026-08-20
reversibility: reversible
revisit_by: 2026-11-20
---

# DEC-005 — One designer, one architect: the roster gets subtracted before it gets renamed

> Occasioned by IDEA-064. Related:
> [DEC-001](DEC-001-founder-layer-brain-cut.md) (the founder-layer cut),
> [`docs/MENTORS.md`](../MENTORS.md) (the two-class boundary this decision refuses to cross).

## Context

The question that started this was naming — Ajesh, 2026-08-20: *"should we have better names for
the agents and mentors, that is better more clearer naming. some may stay, some need improvement?"*

Grading BOSS's **15 shipped agents** against its own voice rule — *assume intelligence, never
assume knowledge* — found three failure modes: acronyms a beginner cohort cannot read (`pm`,
`mentor-gtm`, `db-architect`, `ui-designer`/`ux-designer`), names describing a discipline rather
than the question a founder arrives with (`mentor-business`, `mentor-talent`, `mentor-venture`),
and names describing BOSS's internals rather than the founder's need (`coder-generalist`).

**But the two worst entries on that list were not naming problems.** `ui-designer`/`ux-designer`
and `mentor-architect`/`db-architect` are *count* problems wearing naming clothes. Renaming either
pair would have made the collision easier to read and left the duplication in place — the exact
failure mode EVID-001's
compose-and-**subtract** mandate exists to catch.

Two pieces of evidence sharpened it:

**BOSS ships two designers and runs one.** The gitignored workspace has a single `designer` that
owns *"the design of the entire interaction experience."* BOSS found one sufficient for itself
while shipping a `ui-designer`/`ux-designer` split to founders — a split the industry argues about
and whose descriptions BOSS must gloss every single time it names them (*"what things look like"*
vs *"what things do"*). **When the gloss is mandatory, the name is not the thing that is broken.**

**The design layer is scaffolded a rung below the agent that owns it.** MVP ships
`/design-tokens-init`, the `design-tokens-guard.js` hook, `design-tokens-loop` and `/landing`
(which composes tokens). The agent who owns tokens arrives at V1.

> ⚠️ **A correction, recorded because it narrows the claim.** This was first read in-session as a
> live phantom-agent bug of the same class as the `mentor-business` re-runging in v0.189.0. It is
> not. `scripts/check-refs.js` **class 4b is already rung-aware**, and the prose references in
> `design-tokens-init/SKILL.md` and `templates/style-guide.md` were **examined and declared** in
> its `FORWARD_OK` map, with a stated reason: *"Explains WHY tokens get scaffolded at MVP: the V1
> design layer is what consumes them."* That is a legitimate declaration and this decision does not
> overturn it.
>
> **What was genuinely unexamined is narrower and still real:** `AGENT_REF` is
> ``/`([a-z][a-z0-9-]*)`/g`` — it only matches names **in backticks**. A frontmatter `owner:` field
> is not backticked, so it was invisible to the check.
>
> ⚡ **Closed mid-write by a concurrent session, 2026-08-20.** While this record was being drafted,
> a parallel session added `owner:`-frontmatter coverage to class 4b (uncommitted, in the v0.189.0
> working tree). **Its first two findings are exactly the two files below**, and `check:refs` is
> **currently red** on them. That is the mechanism arriving at the same conclusion this decision
> reached by hand — and it means the two findings now need a disposition, not a discovery. Two MVP templates carry
> `owner: ui-designer` ([style-guide.md:17](../../stages/L1-mvp/template/.claude/skills/design-tokens-init/templates/style-guide.md#L17),
> [prototypes-registry.md:33](../../stages/L1-mvp/template/.claude/skills/design-tokens-init/templates/prototypes-registry.md#L33)),
> and `prototypes-registry.md` is **not in `FORWARD_OK` at all** — it has no backticked agent name,
> so nothing ever asked the question about it. A skill *explaining* the ladder and a scaffolded
> artifact *whose owner does not exist yet* are different things that got the same exemption.

## Decision

**Two agents are subtracted. The renames are deferred behind evidence.**

1. **`ui-designer` + `ux-designer` become one `designer`, seated at MVP** — not V1. It owns both
   halves: the visual system (tokens, type, spacing, motion) and flow/state/interaction (the
   five-state requirement, error and empty states, accessibility heuristics).

2. **`/design-review` and `/ux-check` move to MVP with it. `/design-library` and
   `design-drift-loop` stay at V1.** An agent seated a rung below its own tools is the same bug
   inverted. The library needs a real component set to render from and the drift loop is
   enforcement — V1's *"the design layer turns on"* story survives intact.

3. **`mentor-architect` is the only architect in BOSS.** That is the CTO-as-counsel role. The
   mentor/builder line in [`docs/MENTORS.md`](../MENTORS.md) is **not** crossed to get there.

4. **`db-architect`'s discipline becomes a gate, not a chair — at MVP** (resolved 2026-08-20:
   the rung question below was settled by `/ai-first-init`, which already bakes schema design in at
   MVP, and by the breach evidence — the CVE-2025-48757 and MoltBook founders were nowhere near V1). *Design schema before code; review
   schema before code* ships as a hook/loop plus a step in `/spec` — the same shape already chosen
   for the humane lens (*"an ethics mentor a founder can decline to open is weaker than a
   conscience they can't"*, `registry/boundary.json`) and already working for tokens via
   `design-tokens-guard`.

5. **The renames are NOT decided here.** `mentor-venture` → `mentor-founder`, `mentor-gtm` →
   `mentor-customers`, `mentor-business` → `mentor-capital`, `mentor-talent` → `mentor-hiring`,
   `mentor-cofounder` → `mentor-partnership`, `pm` → `product`, `program-manager` → `planner`,
   `coder-generalist` → `builder` are **proposals pending the persona check** (IDEA-064 slice 4).
   `tester`, `mentor-architect`, `mentor-fundraising` and `mentor-pitch` are kept as-is regardless.

## Why

- **Subtract before rename, or you rename twice.** Every rename costs a `supersedes.json` entry
  that is *append-only* — a public promise to founders who already synced. Renaming `db-architect`
  → `schema` and then deleting it two releases later burns that ledger on a name nobody will keep.
  Count first, name second.
- **BOSS's own practice is the strongest evidence available.** One designer has been enough for the
  project with the most opinionated interaction surface in the repo. Shipping founders a heavier
  org than BOSS runs is the ceremony Principle #2 refuses.
- **The mentor/builder line is worth more than the org-chart realism.** A real CTO does write
  schema. But `mentor-architect`'s best trigger phrases are *"is this premature"*, *"should we
  split this"*, *"where does AI fit"* — and an agent that also owns the schema is being asked
  *"is this premature?"* by someone with a stake in the answer being no. **Advisory independence
  is the whole reason the line exists**, and it is cheap to keep.
- **Folding schema into the builder was the tempting wrong answer.** It looks like subtraction and
  is actually self-review — the failure BOSS's own `testing-with-agents` practice names outright
  (*agents rewrite assertions to match broken behavior*). A gate has no stake in the schema.
- **A gate fires; a door has to be opened.** `db-architect` is an agent a founder must remember to
  consult before writing a migration, at exactly the moment they are least likely to. That is the
  argument already won against an opt-in ethics mentor, applied to craft.
- **Design is not a V1 concern for this cohort.** AI-generated UI reliably nails the happy path and
  skips empty/loading/disabled/error — `ux-designer`'s own stated reason for existing. That failure
  lands the first week a founder builds a screen, not at V1.

## Falsifier

*What would prove this wrong, and by when?*

1. **The merge under-serves.** If, across **n ≥ 3 real projects**, founders consistently ask the
   single `designer` a visual question and get flow advice (or the reverse) — or the agent's own
   output shows it dropping one half to serve the other — the split was carrying real load and
   should return. **One agent doing two jobs badly is worse than two names nobody can tell apart.**
2. **The schema gate does not fire, or fires as noise.** If the gate ships and either (a) never
   triggers on a real migration, or (b) triggers so often founders mute it, then schema review
   needed a judgment-bearing agent and the chair should come back — under a name that is not
   "architect."
3. **MVP designer is premature.** If founders at MVP consistently never invoke `designer`,
   `/design-review` or `/ux-check` before unlocking V1, the rung move added surface at the exact
   rung EVID-001 said was already too full. Move it back.

**Check at `revisit_by` 2026-11-20, or on the second occurrence of any, whichever comes first.**

## Consequences

- **`registry/boundary.json`'s `designer` entry must be re-verdicted, and it is a name collision.**
  Its current verdict is `not-yet` with the reason *"already held by ux-designer and ui-designer at
  L2."* **That reason stops being true.** Worse, BOSS's internal `designer` and a shipped
  `designer` would share a name across the boundary, and `check:boundary` *"fails on an `internal`
  or `not-yet` artifact that a shipped file names anyway."* One of the two must be renamed — the
  internal one, since the founder-facing name is the one that has to be plain.
- **`scripts/check-refs.js` frontmatter coverage already landed** (concurrent session, uncommitted).
  It leaves **two red findings** that this decision disposes of: seating `designer` at MVP makes both
  correct and the findings vanish. ⚠️ **The wrong fix is to silence them by adding the two templates
  to `FORWARD_OK`** — that declares the gap intentional at the exact moment it stopped being.
- **Three `FORWARD_OK` entries get deleted, not edited.** Once `designer` seats at MVP, the
  `design-tokens-init` declarations describe a gap that no longer exists. A stale exemption is
  worse than none: it silences a check that would now be correct.
- **`supersedes.json` gets its first `kind: "agent"` entries — four of them.** The field is
  documented and **has never been exercised**; every existing entry is a skill. This is a first
  use, so it needs testing on a real synced project, not assuming.
- **Manifest churn:** `L1-mvp` gains `designer` + `/design-review` + `/ux-check`; `L2-v1` loses
  `ui-designer`, `ux-designer`, `db-architect`, `/design-review`, `/ux-check`. Both `summary`
  fields need rewriting — V1's currently sells *"ui-designer + ux-designer as visual+flow
  authorities, db-architect for real data shape"* as its headline.
- **Reference cost:** `ui-designer` 19 files, `ux-designer` 19, `db-architect` 17 (tracked; both records here sit in the gitignored local tier) — plus
  `docs/MENTORS.md`'s two-class table, `README.md:52-54`, and `stages/L0-quickstart/template/CLAUDE.md:42`,
  which sells `db-architect` as a V1 graduation reason.
- **The honest cost:** `ui-designer`/`ux-designer` are *industry-standard* names. The
  `eng-builder` and `returning-founder` cohorts know exactly what they mean, and a merged
  `designer` reads as less rigorous to them. Accepted — the beginner cohorts are the ones BOSS's
  mode ladder exists to serve, and the split was costing every cohort a gloss.
