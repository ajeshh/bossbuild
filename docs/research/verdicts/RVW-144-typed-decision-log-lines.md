---
id: RVW-144
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: REJECT
---

# RVW-144 — type every decision-log line (decision | change | override | assumption | event) and account for each at the end

## The claim
- **Source:** BMAD `.memlog.md`, written only through `_bmad/scripts/memlog.py`, as read by the research
  pass on 2026-10-05. At Finalize, every logged item is accounted for: it went into the brief, the
  addendum, or was set aside.
- **Core assertion:** typed, append-only lines make re-entry and audit free.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | **n=1 tool.** BMAD's own users still report re-entry problems (#2760, #1354). |
| 3 | Duplicate or sharpen? | **Duplicate by structure.** BOSS gives each type a home, not a tag. Decisions are DEC records. Assumptions are the FEAT's **Assumptions** section with the founder's answer beside each, plus *Still unknown*. Changes go to the **Build log**. Found tasks go to `feature-context.md`. Open assumptions are already read back at close (`/log` step 5: *"read the bet back"*). |
| 4 | Who serves / harms? | It harms `first-product` and `non-tech-founder` with a vocabulary to learn, for no new capability. |
| 5 | Cost / ceremony | Heavier: a script, a tag vocabulary, and a reconciliation pass. |

## Verdict: REJECT
BOSS answers the same need with sections instead of tags. That is lighter for a founder to read and
already wired into close-out. A second, typed log beside them would be two places saying one thing.

## If REJECT / NOT-YET
- **Why not:** duplicate structure, and added ceremony.

## Attribution
**Partly verified.** It was read from the BMAD repo by the research pass and not re-opened for this
verdict.

## Notes
- BOSS version when recorded: 0.329.0
