---
id: RVW-140
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: REJECT
---

# RVW-140 — stamp the git commit a spec was written against, so drift can be detected

## The claim
- **Source:** Kiro issue #9435 (2026-06-15, backlogged by Kiro;
  https://github.com/kirodotdev/Kiro/issues/9435): *"the codebase may have changed in ways that invalidate
  assumptions… Currently, there's no way to know."* Proposes storing the git ref when a spec is created.
- **Core assertion:** a spec should carry its base commit, so a later reader can see what moved since.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | **n=1 user request**, accepted into a vendor backlog and not built. |
| 3 | Duplicate or sharpen? | **Derivable.** Every FEAT carries `created:` (`feat-record.md` frontmatter), and BOSS already reads dates out of git (`src/gitdates.js`). `git log --since=<created> -- <paths>` gives the same answer without a stored field, and a stored SHA goes stale on a rebase where a date does not. |
| 4 | Who serves / harms? | Neutral. |
| 5 | Cost / ceremony | One field per FEAT that every reader must trust and nothing checks. That is the dead-field shape BOSS's audits keep finding. |

## Verdict: REJECT
The need is real, but the field isn't the answer: the answer is a computation BOSS can already do. If
re-entry ever needs *"N files this FEAT touches changed since it was written"*, `/revalidate` computes it
from `created:` at read time. Don't store what a command computes.

## If REJECT / NOT-YET
- **Why not:** it duplicates a date BOSS already holds, as a less durable value.
- **Note for later (not a re-open condition):** if a founder re-enters a paused FEAT and builds against
  stale assumptions, the fix is in `/revalidate`'s *"Has anything changed the answer?"* line
  (`revalidate/SKILL.md:29`), as a computed diff.

## Attribution
**Verified** at the issue. It is a user's request, not a Kiro feature.

## Notes
- BOSS version when recorded: 0.329.0
