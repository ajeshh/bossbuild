---
id: DEC-001
type: decision
owner: "@ajeshh"
decided_by: founder
status: decided
created: 2026-06-20
reversibility: costly
revisit_by: 2026-09-20
---

# DEC-001 — The founder-layer state cut: shared venture brain, per-person conscience relationship

> BOSS's **own first `/decide`** — dogfooding the decision log on the one genuinely costly-to-reverse call
> in the founder-layer program (IDEA-037 / FEAT-021 slice 3). **Drafted with the recommended call below;
> Ajesh to confirm or supersede** (a new `DEC` with `supersedes: DEC-001`, per the supersede-don't-edit rule).

## Context

For a founding team, BOSS's state splits into "shared with the team" vs "private to one founder." Most of
it is **already drawn correctly** for a venture (confirmed in the scaffold template `.gitignore`): a
venture commits its `docs/` — ideas, canvas, `DEC-NNN` decisions, research, RESUME — so they're **backed up
and keep the cofounder in the loop** the moment the team shares a repo. (BOSS gitignores its *own* docs, but
that's the released-OSS-app choice, not what ventures inherit — the released-vs-dev distinction.)

The one piece still undrawn is the **venture brain** (`.boss/brain/`), which has two parts with different
natures:
- `.boss/brain/read.md` — the conscience's **POV on the venture** (what it is, the riskiest assumption,
  the pattern it's seen). About the *venture*.
- `.boss/brain/relationship.md` — what the conscience **said to me and what I did with it** (landed /
  ignored / overrode). About a *person* and their relationship with the conscience.

Today the template gitignores the conscience *logs* but **neither** brain file — so without a decision,
`relationship.md` would commit and leak one founder's private nudge history to the other.

## Decision

**Split the brain by nature:**
- **`read.md` (venture POV) → SHARED** (committed, travels with the repo). Both founders see and enrich one
  hive-mind read on the venture. This is the generative "keep-in-the-loop" value, and it's already the
  default; it also gives the join-moment seeding for free (a cofounder who clones starts with the venture's
  memory).
- **`relationship.md` + `.boss/trace.jsonl` → PER-PERSON** (gitignored, local). The conscience speaks to a
  *person*; one founder's relationship with it never informs a nudge the other sees. (Shipped as slice 3a:
  the template now gitignores these.)

## Why

- **Research §4 + all three mentor passes converge** (IDEA-037):
  a shared *venture* record + a per-founder *relationship* memory, **never merged**. The venture POV is
  about the venture (shareable, generative); the relationship is about a person (private).
- **Contextual Integrity** (the principled "no by default"): surfacing founder A's relationship-with-the-
  conscience to founder B *changes the recipient* → a non-consented flow → a violation, even though the
  data is "in the repo." So `relationship.md` must stay per-person regardless of how convenient sharing is.
- **Rejected — everything shared:** leaks per-person nudge history (the CI violation above); also sets up
  the conscience to favor the founder it has more rapport with (the SEC-named fiduciary failure).
- **Rejected — everything per-person:** kills the hive-mind read *and* the backup/keep-in-the-loop value
  that already works for free. The whole demand signal was *"keep everyone in the loop"* — a private brain
  fights that.

## Falsifier — what would prove this wrong, and by when?

By the first real founding-team session (revisit ~2026-09-20): if a team reports the **shared `read.md`
surfaced something one founder considered private**, OR the **per-person/shared split confused them** (they
expected the brain to be wholly shared, or wholly private), the cut was wrong — flip `read.md` per-person
(supersede with `DEC-002`) or collapse to one shared brain. Cheap check: it rides on the same "get this in
front of one team" experiment the canvas already owns; no separate work to find out.

## Consequences

- **Done (slice 3a):** template gitignores `.boss/brain/relationship.md` + `.boss/trace.jsonl` (the
  per-person half). `read.md` stays committed (shared) — confirming the status quo, not a new exposure.
- **Reversible at a cost:** if a team later wants private POVs, gitignore `read.md` too — doable, but you
  can't un-share what's already in history (hence `reversibility: costly`, not `one-way`: the leak fix
  *prevents* the irreversible accident; this confirms an already-shared file).
- **Follow-on (namespacing):** `.boss/brain/index.json` indexes *both* read and relationship entries, so its
  per-person entries are a minor residual. The clean fix is the architect's per-founder namespace
  (`.boss/founders/<handle>/` for relationship + trace + index), which also makes per-person files
  *structurally* unable to collide in git. Deferred to a later slice (needs `brain.js`/`conscience.js` path
  changes); the gitignore is the safe interim.
- **If Ajesh flips this** (wants a per-person brain POV too): supersede with `DEC-002`, and add `read.md` to
  the template gitignore. The slice-3a leak fix stands either way.
