---
id: RVW-145
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: ADAPT
route: UP stages/L1-mvp/template/.claude/skills/spec/ + src/records.js
---

# RVW-145 — a FEAT that changes what a shipped FEAT promised links to it, both ways

## The claim
- **Source:** the open-source spec toolkit's evolving-specs guide, plus its most-reacted issue and two
  open ones asking for a way to refine or deprecate a shipped spec. Six community add-ons try to fill
  the gap (`docs/research/sessions/SESSION-2026-10-05-spec-driven-reading.md` (gitignored; names and URLs live there)).
- **Core assertion:** without a link, the next reader of the old spec doesn't learn that its promise
  changed. To know what the system does, they would have to read every spec.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. It supports *the records stay true*. |
| 2 | Evidence grade | **Pattern with data.** The toolkit's most-wanted unbuilt thing (115 reactions on one issue, 72 upvotes on a discussion), and several independent attempts. |
| 3 | Duplicate or sharpen? | **Sharpens.** BOSS links `from`/`promoted_to` and `spun_to`/`spun_from` (`src/records.js`, both checked from both ends). Nothing links a later FEAT that *changes* a shipped one. DEC records already do supersede-don't-edit (`decide/SKILL.md`). |
| 4 | Who serves / harms? | It serves every cohort past the first ship, especially a team where the person reading isn't the person who changed it. No harm. |
| 5 | Cost / ceremony | One question in `/spec` step 0, silent when the answer is no. Two fields, both optional. The existing two-ends check extends to them, so it isn't a new kind of gate. |

## Verdict: ADAPT
BOSS-shaped: `amends: FEAT-NNN` on the new FEAT and `amended_by: FEAT-MMM` on the shipped one, checked from
both ends like `spun_to`. No consolidated spec and no new command.

## If ADOPT / ADAPT
- **What to do:** add the step-0 question to `/spec`, the fields to `feat-record.md`, and the two-ends
  check to `src/records.js`. → built as IDEA-150 E1.

## Attribution
**Verified** at the source by the deep-dive pass, with counts from the issue tracker's API.

## Notes
- BOSS version when recorded: 0.329.0
