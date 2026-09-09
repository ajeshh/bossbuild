---
id: DEC-015
type: decision
owner: "@ajeshh"
decided_by: founder
status: decided
created: 2026-09-08
confirmed: 2026-09-08 — Ajesh, "lets do it accordingly and execute"
reversibility: reversible
revisit_by: 2026-12-08
extends: DEC-001
---

# DEC-015 — Per-person conscience state is keyed to a person, not to a directory

> **✅ CONFIRMED and SHIPPED 2026-09-08 (v0.243.0).** This does **not** supersede
> [DEC-001](DEC-001-founder-layer-brain-cut.md) — DEC-001's cut is right and stays. This changes
> *where the per-person half is stored*, which DEC-001 left as an implementation detail and
> explicitly deferred ("the clean fix is the architect's per-founder namespace … deferred to a
> later slice").

## Context

DEC-001 split the venture brain by nature: `read.md` (about the venture) commits and is shared;
`relationship.md` and `trace.jsonl` (about a person) are gitignored and stay local. The reasoning —
Contextual Integrity — is unchanged and correct.

**"Local" was implemented as "gitignored inside the working directory."** That was equivalent to
"per person" when a person had one working directory. Claude Code's Remote Control makes that false:
its session-spawn mode is *"Each session gets its own git worktree (requires a git repo)"*, and a
worktree is the **same person in a different directory**.

Verified by experiment (IDEA-081) against BOSS's own shipped `.gitignore`:

| File | Present in a fresh worktree | |
|---|---|---|
| `docs/RESUME.md`, `docs/devlog.md`, `.boss/manifest.json`, `.boss/brain/read.md` | ✅ | tracked |
| `.boss/conscience-log.jsonl` | ❌ | gitignored |
| `.boss/brain/relationship.md` | ❌ | gitignored |

So a Remote-Control worktree session starts with **full memory of the venture and none of its own
behaviour.** The frequency ledger `quiet_for` reads is empty and the relationship log — whose stated
purpose is *"it won't re-nag a point you've already answered"* — is absent.

**The failure is concrete: a founder who overrode a nudge on their laptop gets that same nudge again
from their phone.** For a conscience whose entire credibility rests on restraint, that is the worst
available failure, and it is produced by a decision that was correct at the time.

## Decision

**Move the per-person half out of the working tree and key it by *person + project*, machine-local.**

- **Home:** `~/.boss/projects/<key>/` — beside `~/.boss/registry.json` and `~/.boss/removed/`, which
  already exist and already carry per-machine state (`BOSS_HOME`, `src/paths.js:22`).
- **Key:** derived from `.boss/manifest.json`'s `name` + `createdAt`. That file is **tracked**, so it
  is byte-identical in every worktree of the same project, requires no git shell-out from a hook,
  and does not change when a directory is moved or re-cloned.
- **Moves:** `conscience-log.jsonl`, `brain/relationship.md`, `trace.jsonl`.
- **Does not move:** `brain/read.md` (shared, committed — DEC-001 stands), `manifest.json`,
  `config.json`, `cost-log.jsonl` *(open question below)*.

## Why

- **It makes DEC-001's cut true instead of approximately true.** The intent was "about a person →
  private to that person." A worktree-scoped file is private to a *directory*, which is both too
  broad (it would leak if the ignore rule were ever dropped) and too narrow (it forgets across the
  same person's own sessions).
- **The teammate boundary is unchanged and, if anything, stronger.** Nothing per-person is in the
  repo at all any more, so the leak DEC-001 prevented becomes structurally impossible rather than
  gitignore-dependent — the same upgrade DEC-001 itself wanted ("*structurally* unable to collide").
- **It removes two lines from the shipped `.gitignore`** rather than adding machinery. That is the
  subtraction half of EVID-001's mandate, not the addition half.
- **`~/.boss/` is already the answer for machine-local state**, and the 2026-08-21 incident already
  taught BOSS to treat it as such (`boss remove --apply` copies `.boss/` there before deleting).

## Rejected alternatives

- **`.boss/founders/<handle>/` (DEC-001's own deferred proposal).** Solves per-person collision in
  git; does **not** solve worktree amnesia, because it is still inside the working directory. It was
  the right answer to the question DEC-001 was asking and the wrong answer to this one.
- **Commit `relationship.md`.** Fixes amnesia, violates Contextual Integrity, and is exactly what
  DEC-001 rejected. Not reconsidered.
- **Shell out to `git rev-parse --git-common-dir`.** Correct key, real cost — a process on every
  `UserPromptSubmit`, in the hook whose per-prompt cost is already the reason five other hooks ship
  dormant. The manifest read is free by comparison.
- **Do nothing until a founder reports it.** Tempting (demand is n=0) and wrong here: the symptom is
  *the conscience nagging harder*, which a founder experiences as BOSS being annoying, not as a bug
  they would report. It is the one class of defect that silently degrades the product's core claim.

## Falsifier — what would prove this wrong, and by when?

By the first real session driven from a second surface (revisit 2026-12-08): if moving the log out of
the project makes a founder **lose** state they expected to keep — e.g. they clone to a new machine
and expect the conscience to remember them, or they run `boss remove` and cannot find their history —
the storage is in the wrong place and the answer is a per-project file *plus* a machine-local index,
not a machine-local file alone.

Cheap check, available now: the migration below is reversible, and `boss brain` can print where the
state actually lives.

## What actually shipped — including two things this draft got WRONG

Recorded here rather than silently edited, because a decision record that quietly matches the code
is worth less than one that shows where the reasoning was corrected by contact with it.

- 🔴 **WRONG in the draft: "removes two lines from the shipped `.gitignore`."** They **stay**, and
  removing them would have been a leak. The migration *copies* and leaves the original, so every
  project scaffolded before this keeps `.boss/brain/relationship.md` on disk — un-ignoring it would
  have committed the one file DEC-001 exists to protect, to every founder who upgraded. The rules
  are kept with a comment saying they now guard legacy copies.
- 🔴 **NARROWED: `trace.jsonl` did not move.** The draft listed three files. `trace.jsonl` is written
  by `auto-log`, which is **dormant**, lives in a **different stage** with no shared lib import, and
  is named in prose by `/judge-traces`, `/evals`, `stages/L1-mvp/manifest.json` and `boss hooks`.
  Moving it is four prose edits and a cross-stage import for a file nobody's conscience reads.
  **Follow-on, not dropped** — and it carries no harm while it waits, because a dormant hook writes
  nothing. Re-open with the next `auto-log` change.
- ✅ **WIDER than the draft, and it had to be: `.boss/brain/index.json`.** It is **tracked**, it
  **commits**, and it carried `kind: 'relationship'` headlines — *"flagged drift, they overrode it"*.
  So one founder's nudge history reached the other through the index while `relationship.md` was
  correctly private. **DEC-001 named this itself and deferred it as "a minor residual"; it is not
  minor, it is the same leak by another route,** and fixing relationship.md without it would have
  shipped a half-private brain. Entries now split by kind on write and merge on read, so every
  existing consumer (`--diff`, `--forget`, the renderer) is unchanged.
  ⚠️ **You cannot un-share what is already in history** (DEC-001's own words): existing repos have
  relationship headlines in past commits. The split stops new ones and cleans the working file.

## Consequences

- **Migration is required and must be read-both-write-new.** Existing projects have real data at
  `.boss/conscience-log.jsonl` and `.boss/brain/relationship.md`. On first read, if the machine-local
  file is absent and the in-project one exists, copy it up and leave the original in place. **Never
  delete the founder's history as part of a path change** — the 2026-08-21 lesson.
- **Touches three files with hardcoded paths:** `stages/L0-quickstart/template/.claude/hooks/lib/loop-runtime.js`
  (578, 631, 802), `src/brain.js` (63, 85), `src/conscience.js` (215, 230).
- **The shipped `.gitignore` loses two lines** and its explanatory comment needs rewriting — the
  comment is currently the clearest statement of DEC-001 anywhere and must survive the edit.
- **`boss remove` changes:** per-person state is no longer under `.boss/`, so the `~/.boss/removed/`
  copy step must widen or the removal must say plainly that it is leaving the relationship history.
- **Open question, deliberately not decided here: `cost-log.jsonl`.** It is gitignored and reads as
  per-*project* rather than per-person (spend is a venture fact a cofounder plausibly should see).
  It has the same worktree problem and a different answer. Left for a separate call.

## Related

- [DEC-001](DEC-001-founder-layer-brain-cut.md) — the cut this preserves. Its `revisit_by` is
  **2026-09-20**, twelve days after this draft; this is the revisit, arriving early and for a reason
  DEC-001 could not have anticipated.
- IDEA-081 — the Remote Control survey that found it, and the experiment that verified it.
