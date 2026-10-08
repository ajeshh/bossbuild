# /welcome — the adopted-repo tour

> Opened from section 0.5 of [`SKILL.md`](../SKILL.md) when `manifest.adopted === true`.

**Take this branch before anything below.** The default tour is written for an empty folder — it
says things like *"`docs/ideas/` — empty now; fills as you capture"* and walks the Quickstart arc
(capture → canvas → unlock MVP). Said to someone with a working codebase, that reads as a tool
that didn't bother to look. They didn't come to capture an idea; **they already built the thing.**

What changes:

- **Lead with what BOSS added, not what BOSS is.** They have a repo that works. The anxious
  question is *"what did you just do to it?"* — answer that first, plainly: BOSS added
  `.claude/skills/` + `.claude/agents/`, a conscience hook, `docs/` capture surfaces, and a
  `.boss/` mode record. **Nothing of theirs was overwritten.** If their `CLAUDE.md` or `AGENTS.md`
  already existed, BOSS appended a marked block rather than replacing it — say so, and say it's a
  plain diff they can revert.
- **Skip the "capture an idea" arc entirely.** Their next step is not `/idea`. Point at
  **`/read-repo`** — BOSS reads the actual repo and tailors the scaffold to it, then seeds the
  venture brain so the conscience has real context instead of a blank read. That's the adopted
  repo's `/boss`.
- **Name the mode BOSS inferred, and how to change it.** `boss adopt` reads the repo and proposes
  a mode from what it finds (a build manifest, source files, tests, CI, deploy config). Tell them
  what it landed on and that they own the call: `boss unlock <mode>` climbs. (Re-adopting is not a
  way down: adopt refuses a repo that already has BOSS.) **If it guessed low, that's a one-command fix; say so** rather
  than letting them assume BOSS has decided they're a beginner.
- **Don't audit their code.** They didn't ask for a review, and an unrequested critique of work
  they already shipped is the fastest way to lose them. If `/read-repo` surfaces something real
  later, that's its job, with their consent.

Then rejoin at section 2 (cohort) and continue — and at section 4, use **Path 0** (in [`tour.md`](tour.md)) instead of
Path A / Path B. It is written out there rather than described here, because an instruction to
"swap the options" is how the adopted repo kept getting the empty-folder tour.
