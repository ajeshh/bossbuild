---
id: RVW-112
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: REJECT
route: n/a
sources:
  - a design-systems PM's post on a design-system vendor's blog, 2026-09 (docs/research/sessions/SESSION-2026-10-05-design-system-reading.md, gitignored)
---

# RVW-112 — AI won't replace design systems; it scales whatever you give it, so weak ones show

## The claim
- **Source:** a short opinion post by a design-systems product manager.
- **Core assertion:** AI scales inconsistency as fast as consistency. Tokens give it structure,
  documentation becomes infrastructure, and adoption becomes trust. Five readiness questions follow,
  ending with *"would a brand-new engineer know how to build your UI from the system alone?"*
- **Inbox file:** `~/Projects/inbox/bossbuild/AI won't replace design systems…pdf`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | Opinion; no data, no example. |
| 3 | Duplicate or sharpen? | **Pure duplicate.** *"A retrievable substrate the agent reads before it generates"* is IDEA-091's one move. Tokens as structure for the AI is `design-system.md`'s AI-failure catalog, duplicated patterns are `component-reuse-guard`, and "documented components" is the usage page. |
| 4 | Who serves / harms? | n/a |
| 5 | Cost / ceremony | n/a; nothing to adopt. |

## Verdict: REJECT
Nothing to take: every claim is one BOSS already made and mechanized. Recorded so it doesn't come back
as a "should we".

## If REJECT / NOT-YET
- **Why not:** duplicate of IDEA-091 + the shipped token/reuse guards.

## Attribution
The author's own opinion; nothing attributed.

## Notes
- BOSS version when recorded: 0.329.0
