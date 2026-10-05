---
id: RVW-129
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: REJECT
route: n/a
sources:
  - a design-systems architect's essay, 2026-04 (docs/research/sessions/SESSION-2026-10-05-design-system-reading.md, gitignored)
---

# RVW-129 — a design system needs historical truth (why, and what was rejected) or agents reopen closed debates

## The claim
- **Source:** a design-systems architect's essay, 2026-04.
- **Core assertion:** "Documentation" collapses three truths: **operational** (specs, tokens: tools enforce it), **normative** (what we believe is right) and **historical** (why, and the alternatives rejected). Agents get the first, infer the second, and have no access to the third, so they *"re-open debates that were already closed"*. Record each significant decision as context · problem · solution, including what was considered and set aside, in two or three sentences.
- **Inbox file:** `~/Projects/inbox/bossbuild/A design system is a system of truth…pdf`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | An argument built on cited thinkers (organizational memory, Alexander's generative systems). The citations are framing, and the claim stands on its own reasoning. |
| 3 | Duplicate or sharpen? | **Duplicate; BOSS built all three.** Operational: tokens + manifest. Normative: the style guide's principles with *Rules* and *Wrong if*. **Historical:** `/decide` writes DEC records whose *Why* asks for *"considered · chosen · why-not"*, the playbook shows the DEC beside the swatch it chose, the tokens doc keeps a `## Deprecated` table and the style guide an *Exceptions* table, and `design-decisions-guard` hands the decision to the agent **at the write that touches it**. That last part is the essay's re-opened-debate failure, already closed mechanically. |
| 4 | Who serves / harms? | n/a |
| 5 | Cost / ceremony | n/a |

## Verdict: REJECT
The best articulation in the pile of why BOSS's DEC-beside-the-swatch exists, and worth reading for that. Nothing to add.

## If REJECT / NOT-YET
- **Why not:** duplicate of `/decide` + the playbook's DEC links + `design-decisions-guard`.

## Attribution
The cited thinkers' words were not re-checked and are not used; the verdict rests on the argument.

## Notes
- BOSS version when recorded: 0.329.0
