---
id: RVW-149
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: ADAPT
route: DOWN .gitattributes (BOSS's own repo)
---

# RVW-149 — stop concurrent work colliding on the CHANGELOG

## The claim
- **Source:** the open-source spec toolkit generates its changelog from commit subjects at release, so no
  change edits a shared file (`docs/research/sessions/SESSION-2026-10-05-spec-driven-reading.md` (gitignored; names and URLs live there)).
- **Core assertion:** a shared, hand-edited changelog is a collision point for parallel work.
- **Altitude:** BOSS's own repo, not something it ships.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | Their method does: commit subjects can't be BOSS's product prose. |
| 2 | Evidence grade | **Measured here, 2026-10-05.** Landing IDEA-150's three lanes, `registry/CHANGELOG.md` conflicted on 7 rebased commits: 2 in lane C and 5 in lane A. Every conflict was two new bullets under `## Unreleased`, and every resolution was "keep both". |
| 3 | Duplicate or sharpen? | **New.** The memory names CHANGELOG as a sweep site, and nothing prevents it. |
| 4 | Who serves / harms? | It serves every concurrent session. Harm: a union merge also keeps both sides of an *edit* to the same line, which would be a duplicate. Those edits are rare, and the founder-facing CHANGELOG test reads the result. |
| 5 | Cost / ceremony | One line in `.gitattributes`. Fragments plus a stamp-time join would touch the release script, `sync`'s reader and several gates. |

## Verdict: ADAPT
Not fragments: git's built-in `union` merge driver on `registry/CHANGELOG.md`. A rebase that meets two new
bullets keeps both with no conflict, which is exactly the resolution done by hand seven times today.

## If ADOPT / ADAPT
- **What to do:** add `registry/CHANGELOG.md merge=union` to `.gitattributes`. → built as IDEA-150 E5.
- **Re-open:** if a union merge ever duplicates an edited bullet, go to fragments.

## Attribution
The source's method was **verified** by the deep-dive pass; the collision count is first-hand.

## Notes
- BOSS version when recorded: 0.329.0
