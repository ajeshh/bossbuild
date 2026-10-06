---
id: RVW-142
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: REJECT
---

# RVW-142 — decide how much ceremony a change needs after reading the code: intent gaps, irreversible actions, footprint

## The claim
- **Source:** BMAD `docs/build/build-a-change.md:97-101` (opened 2026-10-05,
  https://raw.githubusercontent.com/bmad-code-org/BMAD-METHOD/main/docs/build/build-a-change.md), and
  CHANGELOG v6.12.0: *"Build decides how much ceremony a change needs after investigating it, not
  before."*
- **Core assertion:** judge three observable facts about a change. If all are clean, take the light
  path. Anything flagged gets a written plan first.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. It is #2 restated. |
| 2 | Evidence grade | **Practitioner, shipped and iterated.** BMAD reached it by subtraction over several releases. |
| 3 | Duplicate or sharpen? | **Duplicate, spread across three places.** Intent gaps = `/spec` step 3's *"Here's what I had to assume"*. Irreversible = the **destructive path**, which already demands *"a test **and** a human gate"*, and step 8's *"what's out of the agent's authority"*. Footprint = step 8's plan-mode offer *"when the FEAT touches code you haven't read, spans more than a couple of files"*. Step 0 also asks whether this should be a FEAT at all. |
| 4 | Who serves / harms? | n/a. BOSS already serves the same need. |
| 5 | Cost / ceremony | Adopting it would add a second router beside the one BOSS has. |

## Verdict: REJECT
BOSS asks all three questions already; it just doesn't name them as a trio. Keep it as a **receipt**: an
independent team with 75k monthly installs reached BOSS's shape by cutting back. That is worth knowing,
and not worth building.

## If REJECT / NOT-YET
- **Why not:** duplicate of `/spec` steps 0, 3, 4 (destructive path) and 8.

## Attribution
**Verified** — `build-a-change.md:97-101`.

## Notes
- Prior related: RVW-108 (role-agent split, REJECT), which is the same "receipt, not build" shape.
- BOSS version when recorded: 0.329.0
