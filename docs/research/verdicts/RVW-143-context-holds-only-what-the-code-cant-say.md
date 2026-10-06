---
id: RVW-143
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: NOT-YET
---

# RVW-143 — agent context holds only what the code can't say ("the suite takes eleven minutes" in, "pnpm test" out)

## The claim
- **Source:** BMAD `bmad-project-context` (v6.11.0), as read by the research pass on 2026-10-05:
  *"anything derivable from source is read live and never stored, so `pnpm test` stays out while 'the
  suite takes eleven minutes' goes in."*
- **Core assertion:** the founder's context file should carry only facts the agent can't derive.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | **Practitioner, n=1 tool.** It matches BOSS's own working rule, which was learned the hard way. |
| 3 | Duplicate or sharpen? | **Held at BOSS's altitude, half-held at the founder's.** BOSS's RESUME says *"Facts a command computes are not written here"*, and the shipped `/close` carries it (grep 2026-10-05: the only shipped file that does). The founder's `CLAUDE.md` template and `engineering.md` rules don't say it. But BOSS's skills, not the founder, do most of the writing into context, and they already follow it. |
| 4 | Who serves / harms? | It would serve a founder whose CLAUDE.md is bloating. No harm. |
| 5 | Cost / ceremony | Wherever it lands, it costs always-on tokens, which BOSS budgets (`test/always-on-cost.test.js`). One line, every turn, for a problem nobody has shown. |

## Verdict: NOT-YET
It is a good sentence for a problem BOSS hasn't seen in a founder's repo. Adding always-on lines
pre-emptively is the weight BOSS refuses.

## If REJECT / NOT-YET
- **Re-open condition:** `/read-repo` or an adopted repo shows a founder's `CLAUDE.md` carrying
  command-derivable facts (test commands, file trees, versions). Then the sentence goes where that
  writing happens, not into always-on context.

## Attribution
**Partly verified.** The quote was read from the BMAD repo by the research pass and not re-opened for
this verdict.

## Notes
- BOSS version when recorded: 0.329.0
