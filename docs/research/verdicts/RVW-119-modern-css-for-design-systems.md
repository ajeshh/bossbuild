---
id: RVW-119
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: REJECT
route: n/a
sources:
  - a front-end developer's feature roundup on a design-system vendor's blog, 2026-09 (docs/research/sessions/SESSION-2026-10-05-design-system-reading.md, gitignored)
---

# RVW-119 — use new HTML/CSS (sibling functions, :has, @custom-media, popover, @scope, text-box-trim) in the design system

## The claim
- **Source:** a front-end writer's roundup.
- **Core assertion:** the platform now does what libraries and build steps did. Use sibling-count()
  for adaptive spacing, `:has` for context, `@custom-media` so breakpoints become tokens,
  `popover` to end z-index fights, `@scope` for containment, `text-box-trim` for optical spacing.
  Fewer dependencies, a more contained system.
- **Inbox file:** `~/Projects/inbox/bossbuild/New HTML and CSS features…pdf`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | It doesn't contradict one, but it is **stack-specific**, and BOSS's shipped design skills are stack-neutral (`mobile-app` and native surfaces read the same skills). |
| 2 | Evidence grade | Accurate feature descriptions. Browser support is the author's word as of the date, and `@custom-media` is admitted not final. |
| 3 | Duplicate or sharpen? | Nothing in it is a design-*system* mechanism BOSS lacks. The one systemic point, breakpoints as tokens, is already covered by BOSS's token families. |
| 4 | Who serves / harms? | Web founders, as craft knowledge. Shipped as instruction, it would be noise for everyone else. |
| 5 | Cost / ceremony | It would put a dated feature list into shipped text, which then rots. |

## Verdict: REJECT
Good web craft, wrong layer. The agent writing a founder's CSS knows these features. BOSS's job is
the system around the CSS, not the CSS. For BOSS's own site: the site is frozen except for
correctness until the install signal reads, so this is not a task there either.

## If REJECT / NOT-YET
- **Why not:** stack-specific and model-known. BOSS names the rung, not the technique.

## Attribution
The author's own roundup; support claims not re-checked.

## Notes
- BOSS version when recorded: 0.329.0
