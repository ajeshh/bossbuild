---
id: RVW-123
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: REJECT
route: n/a
sources:
  - a design-principles author's essay on a design-system vendor's blog, 2026-08 (docs/research/sessions/SESSION-2026-10-05-design-system-reading.md, gitignored)
---

# RVW-123 — design principles only count if they decide between two valid options

## The claim
- **Source:** the founder of a public library of design principles, and author of a book on them.
- **Core assertion:** every system runs out at its edges (extend or create? two valid patterns? an
  unanticipated case), and principles exist for those gaps. Most are moods ("keep it simple") that
  decide nothing. A working principle is a trade-off ("coherence over completeness"). Accessibility
  is a *standard*, not a principle, because a principle can be weighed away. Cite the principle in
  the component's documentation, as the reason.
- **Inbox file:** `~/Projects/inbox/bossbuild/Your design system has principles…pdf`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | A respected practitioner in exactly this niche; argument, no data. |
| 3 | Duplicate or sharpen? | **Duplicate; BOSS's template goes further.** `style-guide.md`: *"a direction that contains a tradeoff — if a reasonable person couldn't argue the opposite, it isn't a principle, it's a mood"*, 3–5 maximum, with *Statement · Grounded in · Why · Guideline · Rules · Wrong if*. A principle must descend into checkable rules (*"an agent can't act on a principle; it can only act on a rule"*) and carry a falsifier, which the essay doesn't ask for. Accessibility is already *"Accessibility floor (not negotiable, not a phase)"*, a separate section rather than a principle. Extend-or-create is `component-reuse-guard`'s *reuse, adjust, or new?* plus the usage page's *Why it exists*. |
| 4 | Who serves / harms? | n/a |
| 5 | Cost / ceremony | The one unshipped piece (a principle citation on each component page) adds a field where *Why it exists* already holds the reason. Heavier for no new behaviour. |

## Verdict: REJECT
BOSS reached the same place and then went further: principles become rules and falsifiers, so they
act at the write instead of being cited in a meeting. The per-component citation is declined as a
second place to say why.

## If REJECT / NOT-YET
- **Why not:** duplicate of `style-guide.md` § Design principles and the accessibility floor.

## Attribution
The author's own argument.

## Notes
- BOSS version when recorded: 0.329.0
