---
id: RVW-148
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: REJECT
---

# RVW-148 — /spec should point at the FEAT's *Still unknown* rather than copy it into feature-context.md

## The claim
- **Source:** the open-source spec toolkit removed a step that copied its constitution into templates:
  *"Propagation duplicated the single source of truth."* It kept the copy only as an opt-in that rewrites
  while unchanged (`docs/research/sessions/SESSION-2026-10-05-spec-driven-reading.md` (gitignored; names and URLs live there)).
- **Core assertion:** copies drift; point to the source instead.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | **Practitioner, reversed after use.** That makes it a strong lesson for the general rule. |
| 3 | Duplicate or sharpen? | **BOSS already holds the general rule** (flows: *"The index, not a second copy"*). Step 6b's copy is a deliberate exception, written down as *"same content, two lifetimes"*. The FEAT keeps what wasn't known **at spec time**, as a record. `feature-context.md` is the working copy that gets answered **during** the build and compressed at `/close`. A pointer would make the record get edited mid-build, and the spec-time snapshot would be lost. |
| 4 | Who serves / harms? | n/a |
| 5 | Cost / ceremony | Neutral. |

## Verdict: REJECT
The lesson is right about copies of one truth. These are two truths with different lifetimes, by design.
Recorded so it isn't relitigated.

## Attribution
**Verified** by the deep-dive pass.

## Notes
- BOSS version when recorded: 0.329.0
