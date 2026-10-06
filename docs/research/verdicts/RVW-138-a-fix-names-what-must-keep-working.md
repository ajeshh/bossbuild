---
id: RVW-138
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: ADAPT
route: UP stages/L1-mvp/template/.claude/skills/spec/ (SKILL.md step 4 + templates/feat-record.md)
---

# RVW-138 — a bug-fix spec names the behaviour next door that must not change

## The claim
- **Source:** Kiro bugfix specs (opened 2026-10-05, https://kiro.dev/docs/specs/bugfix-specs/). `bugfix.md` holds
  Current, Expected and **Unchanged** blocks: *"WHEN [condition] THEN the system SHALL CONTINUE TO [existing
  behavior]"*. A regression test is generated from the Unchanged block.
- **Core assertion:** a fix is safest when it states what it must leave alone, because that line becomes
  the regression test.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | **One vendor's design.** The underlying failure, where a fix breaks the neighbour, is the commonest complaint about AI-assisted fixing, but BOSS holds no EVID for it. Graded on its own merits. |
| 3 | Duplicate or sharpen? | **Sharpens.** `/spec` admits *"plenty of good FEATs are a bug, a small fix"* (`spec/SKILL.md:50`), but its **Paths that must not break** cover only money, destructive and negative (`feat-record.md:79-89`). None of these is *the behaviour beside this fix*. And `/spec`'s own ladder already puts *"a failing test"* above prose. |
| 4 | Who serves / harms? | It serves `vibe-coder-newbie` and `vibe-virtuoso`, who live in fix-loops. No harm if optional. |
| 5 | Cost / ceremony | Neutral. One optional line, omitted unless the FEAT is a fix, following the template's *"a missing line is an answer"* rule. |

## Verdict: ADAPT
Add a fourth, optional path for fixes: **Neighbour path — what this change must not alter**, written as
the concrete pair (*"saving a draft still works when the title is empty"*). `/spec`'s ladder then turns it
into the regression test. Drop EARS and the three-block file: BOSS records a fix in the FEAT it already
has, not a second artifact type.

## If ADOPT / ADAPT
- **What to do:** one bullet in `feat-record.md` § Paths that must not break, and one ask in `/spec`
  step 4, only when the FEAT is a fix. → `/extract` (UP).
- **Modified:** no SHALL grammar, no `bugfix.md`, no property tests. One line inside the existing section.

## Attribution
**Verified** — the `SHALL CONTINUE TO` template is on the page (read from the server-rendered HTML).

## Notes
- BOSS version when recorded: 0.329.0
