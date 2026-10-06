---
id: RVW-146
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: ADAPT
route: UP stages/L1-mvp/template/.claude/skills/spec/templates/feat-record.md + stages/L0-quickstart/template/.claude/agents/coder.md
---

# RVW-146 — a FEAT with several slices names them, and the coder builds one per run

## The claim
- **Source:** the open-source spec toolkit's complex-features guide: run quality drops as context fills,
  so scope each run to one bounded piece. Each story there is independently testable, and an open issue
  reports one long run degrading (`docs/research/sessions/SESSION-2026-10-05-spec-driven-reading.md` (gitignored; names and URLs live there)).
- **Core assertion:** a build split into named, separately testable pieces, one per run, holds up better
  than one long run.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | **Practitioner pattern, plus a user report.** It matches the host's own context limits. |
| 3 | Duplicate or sharpen? | **Sharpens a rule BOSS states and doesn't hold.** `/spec` promotes to a FEAT only when the build has *named slices* (`spec/SKILL.md`, `docs/IDS.md`), yet "slice" appears in neither `feat-record.md` nor `coder.md`. The test names a thing no file holds, a checker stating an intent it doesn't enforce. |
| 4 | Who serves / harms? | It serves `vibe-virtuoso` and `vibe-coder-newbie`, whose long runs degrade. No harm: a one-slice FEAT shows nothing new. |
| 5 | Cost / ceremony | Headings only when there's more than one slice, plus one line in `coder.md`. |

## Verdict: ADAPT
Group the criteria under `### Slice N — what a person can do after it` only when there is more than one
slice. The coder builds one slice per run, then smokes it, ticks its criteria and names the next. These are
criteria groups, not user stories, which `/spec` deliberately refuses.

## If ADOPT / ADAPT
- **What to do:** add the template note and the coder line. → built as IDEA-150 E2.

## Attribution
**Verified** at the source by the deep-dive pass.

## Notes
- BOSS version when recorded: 0.329.0
