---
id: IDEA-114
type: idea
kind: capability
owner: product-lead
status: building (slice 1 — `kind:` on the record, the writers and the pickers; the board's split is a task)
gist: An IDEA record is two different things wearing one word — the venture idea a founder walked in with (one per project; /boss writes it, /canvas tests it, the playbook renders it) and a capability idea ("add X"; many per project; /idea writes it, /spec promotes it). Name the kind on the record so the pickers stop guessing.
proof: stages/L0-quickstart/template/.claude/skills/idea/SKILL.md
proof_note: The shipped `/idea` template writes `kind: capability` and no venture fields; `/boss` writes `kind: venture`. `src/playbook.js readIdea()` and the loop runtime's `readIntentContext()` rank `kind: venture` first (tests in test/playbook.test.js and test/conscience.test.js). The board's split is not built.
created: 2026-09-13
program: records
relates: IDEA-106, IDEA-015, IDEA-111, DEC-008
source: Ajesh, 2026-09-13 — "what is an idea in boss? I think its getting interchanged.. A founder may have a new idea for an app.. Thats one.. The other is.. when they have a new feature or something they are exploring.. we default and save it as idea right? … i also just dont wanna get it confused in our own building."
---

# Two kinds of idea

## Current shape

`docs/IDS.md` defines `IDEA-NNN` as *"a raw idea / planned capability"*. The slash is two things
sharing one record type, one template, one status ladder and one set of pickers:

| | the **venture** idea | a **capability** idea |
|---|---|---|
| what it is | the thing the founder walked in with | "we should add X" |
| how many | one per project (a few candidates on day 0) | many |
| who writes it | `/boss` on day 0 | `/idea`, any day |
| what carries it | `motivation`, `success_looks_like`, `in_a_few_years`, `prior_capital`, the Canvas section | `gist`, Current shape, the capture log |
| what reads it | `/canvas`, `boss playbook` (Vision + Model chapters), `boss status` *Toward:* line, `canvas-loop` | `/spec` → FEAT, `boss board`, `check:backlog` |
| its life | validated or killed | `seedling → … → shipped` |

**Where the same word bites** (all found 2026-09-13, none built against yet):

- `/idea`'s template writes the four venture fields and *"when this has legs, run `/canvas`"* on
  every idea. BOSS's own tree is the proof that nobody means it: 113 IDEAs, all capability-shaped,
  **0 of 113** set `prior_capital`. BOSS's actual venture idea is not an IDEA at all — it is
  `docs/ideas/CANVAS.md` (Ajesh's own, gitignored).
- `/canvas` with no argument picks *"the most active idea"*. After five feature captures, "most
  active" is a feature, and BOSS pressure-tests a feature as a business.
- `src/playbook.js readIdea()` picks the **newest** idea when no canvas names one — so once a
  founder captures a feature, the playbook's Vision chapter renders that feature as the venture.
  `readIntentContext()` in the loop runtime is safer only by accident: it requires a set
  `motivation`, and only venture ideas have one.
- `/boss` routes on *"are there any IDEA files"* (`no IDEA-*.md → day 0`). The venture idea is
  implicitly the first file; nothing marks it, so once there are ten files no skill can find it.
- The status vocabulary is a build ladder. A venture idea does not *ship*.

**The fix is a field, not a prefix.** A second ID class (`VENT-NNN`?) is ceremony, and would
re-file 113 existing records. `kind: venture | capability` on the IDEA frontmatter:

- `/boss` writes `kind: venture`. `/idea` writes `kind: capability`, and asks the one question
  only when the project has no venture idea yet ("is this the thing you're building, or a piece
  of it?").
- The four venture fields and the Canvas section are written only on `kind: venture`.
- Every picker prefers `kind: venture`: `/canvas` no-arg, `readIdea()`, `readIntentContext()`.
  Fallback for records that predate the field: an idea with `motivation` set is a venture idea;
  otherwise newest (today's behaviour, so nothing regresses).
- A record with no `kind:` reads as `capability` — which is what all 113 of BOSS's own are.

**BOSS's own building, stated once so it stops being re-asked:** every `IDEA-NNN` in this repo is a
*capability* idea. BOSS's venture idea is the canvas. When a session says "the idea", it means a
capability unless it says "the venture".

## Capture log
- 2026-09-13 — Ajesh: *"what is an idea in boss? I think its getting interchanged."* Grepped the
  definition, the two writers, the three pickers; the table above is what came back. Slice 1 is
  the field + writers + pickers.

## Open questions
- `boss board` shows the venture idea as a card in the same columns as the capabilities. Should it
  sit above the columns (where IDEA-015 already put the riskiest assumption), or be filtered out?
  **Task, not this slice.**
- Day 0 with two candidate venture ideas (a founder choosing between apps): two `kind: venture`
  records is a real state. `/canvas` should then ask which, not pick. Written, not built.
- Should `check:backlog` refuse the venture fields on a `kind: capability` record? Measure the gap
  first — today it is 0 violations because nobody fills them; a gate over a 0-gap is ceremony.
