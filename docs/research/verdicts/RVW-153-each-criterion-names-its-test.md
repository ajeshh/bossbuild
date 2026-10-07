---
id: RVW-153
type: verdict
owner: pm
status: recorded
created: 2026-10-06
verdict: REJECT
feeds: IDEA-154 T4
---

# RVW-153 — each acceptance criterion names the test that proves it, so spec drift shows as red

## The claim
- **Source:** inferred from the living-spec field (a delta-merge toolkit's open issues; a rival that keeps
  "code as the source of truth") and a test-quality paper. All are named in docs/research/sessions/SESSION-2026-10-06-spec-and-agent-driven-practice.md (gitignored; sources named there).
- **Core assertion:** tie each shipped criterion to a test that keeps running, and you get a living spec
  without a merge step.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | An inference from complaints, not a measured practice. |
| 3 | Duplicate or sharpen? | **Duplicate.** `/log`'s tick format (RVW-136) is `— <what you ran → what you saw>`, so a criterion proved by a test already names the command. `/spec`'s *most executable artifact* ladder writes criteria as failing tests. `engineering.md` names each bug's test for the bug. What's left, a mandatory test name, would be a new field for the same act. |
| 4 | Who serves / harms? | Would push `first-product`, whose criteria are often checked by hand, toward ceremony. |
| 5 | Cost / ceremony | Heavier for no new behaviour. |

## Verdict: REJECT
Already covered by three pieces BOSS ships. Re-open only if a founder's shipped criterion silently stops
being true while its test exists elsewhere unnamed.

## Attribution
n/a. This was an inference, not a quoted claim.

## Notes
- Prior related verdicts: RVW-136 and RVW-140 (`specced_at`, rejected).
- BOSS version when recorded: 0.330.0
