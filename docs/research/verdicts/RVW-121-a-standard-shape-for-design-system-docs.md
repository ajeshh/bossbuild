---
id: RVW-121
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: NOT-YET
route: n/a
sources:
  - a design-system vendor's post on an open documentation spec moving to a W3C community group, 2026-08 (docs/research/sessions/SESSION-2026-10-05-design-system-reading.md, gitignored)
  - https://www.w3.org/community/designsystemdocs/ (W3C Design System Documentation Community Group, created 2026-07-30; existence verified 2026-10-05)
---

# RVW-121 — design-system documentation is getting a standard shape (a W3C community group)

## The claim
- **Source:** a vendor's lead advocate, whose company has joined the group and builds its own
  audit tool on the spec.
- **Core assertion:** documentation is the last unstandardized layer. An open, machine-readable spec
  of seven entity types (components, tokens, themes, foundations, patterns, guides, chunks), built
  from standard blocks (guidelines, API, states, accessibility), serves people, parsers and agents
  from one source. Its new W3C community group could take it the way tokens went with DTCG.
- **Inbox file:** `~/Projects/inbox/bossbuild/The Design System Documentation Spec and the W3C…pdf`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. Portability is BOSS's own argument (*don't monetize lock-in*; DTCG emitted for that reason). |
| 2 | Evidence grade | The group's existence is **verified**. Everything about the spec's maturity and adoption comes from a vendor with a product built on it, and the author says the hard part (standardizing prose without flattening it) is unsolved. Community groups publish *reports*, not W3C standards. |
| 3 | Duplicate or sharpen? | **The same question as RVW-079** (DESIGN.md), one layer up. BOSS's `docs/design/` already has most of the entities: tokens, foundations (style guide), components (usage pages), patterns (PATTERNS.md), and `manifest.json` as the machine half. Conforming means changing the container, not adding knowledge. |
| 4 | Who serves / harms? | Would serve a founder whose designer uses a tool that reads the spec. Today that's nobody we know of. |
| 5 | Cost / ceremony | A format migration for every project's design docs. Heavy, and against an unstable spec. |

## Verdict: NOT-YET
The direction is right, and the DTCG precedent makes it plausible. But a five-week-old community group
and a vendor's enthusiasm are not a stable spec. RVW-079's rule holds: wait for a lifecycle, not
for features.

## If REJECT / NOT-YET
- **Re-open condition:** any one of these. (a) The group publishes a draft report with a versioned
  schema. (b) An agent host, or a design tool founders actually use, reads the format natively. (c) A
  founder's designer asks for it. Then the move is an **emitter**, like DTCG: `boss design` writes
  the format from `docs/design/` and the manifest. It is never a migration of the source docs.
- **Watch:** add the group to the design watchlist so the re-open fires on an event, not memory.

## Attribution
Partly verified. The community group exists, with the mission quoted and the creation date matching.
The spec's contents and the "seven entity types" were taken from the post, not from the spec itself.

## Notes
- Prior related verdicts: RVW-079 (DESIGN.md, NOT-YET, same lifecycle reasoning), RVW-082 (seam not vendor).
- BOSS version when recorded: 0.329.0
