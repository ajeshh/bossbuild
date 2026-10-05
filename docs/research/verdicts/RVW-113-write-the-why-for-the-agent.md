---
id: RVW-113
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: REJECT
route: n/a
sources:
  - a design engineer's post on a design-system vendor's blog, 2026-06 (docs/research/sessions/SESSION-2026-10-05-design-system-reading.md, gitignored)
---

# RVW-113 — an agent starts every day as a day-one hire, so write the "why" down

## The claim
- **Source:** a design lead at a small identity-verification company.
- **Core assertion:** a component an agent generates can look right and drift underneath. Its
  label style or hint text is off-token, so a later rebrand misses it. Agents need the rules *as
  they generate* (as code comments for a small team, or served by a docs tool), and the missing
  context is usually the *why*. Example: one score-dial component with two shapes, because some
  results are steps and some are percentages.
- **Inbox file:** `~/Projects/inbox/bossbuild/Eliminate the back-and-forth…pdf`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | n=1 practitioner, one illustrative example. |
| 3 | Duplicate or sharpen? | **Duplicate.** Rules at the write: `design-tokens-guard` (off-token, deprecated), `component-reuse-guard` and `design-decisions-guard` (PATTERNS, usage-page *Never* lines). Code comments as the doc source: the `@dsCard` first-line markers (RVW-081). The *why*: the usage page's *Why it exists* and *Variants, and when*, which already cite the same public-sector design system's research-backed pages as the model. |
| 4 | Who serves / harms? | n/a |
| 5 | Cost / ceremony | n/a |

## Verdict: REJECT
A clear statement of a problem BOSS already guards at the write. The score-dial example is a good
illustration of a variant whose reason is a data shape. That belongs in the founder's own usage
page, not BOSS's practice.

## If REJECT / NOT-YET
- **Why not:** duplicate (guards + usage page + RVW-081 markers).

## Attribution
The author's own experience; the reference to another post on writing for LLMs was not followed.

## Notes
- Prior related verdicts: RVW-081, RVW-110, IDEA-112 (usage page).
- BOSS version when recorded: 0.329.0
