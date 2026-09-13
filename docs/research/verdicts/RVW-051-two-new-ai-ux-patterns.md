---
id: RVW-051
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: ADAPT
route: UP → library/practices/ai-ux-patterns.md (two net-new patterns)
---

# RVW-051 — two net-new AI-UX patterns: generative-UI control spectrum + memory-as-object

## The claim
- **Source:** Generative-UI control spectrum — static / declarative / open-ended (CopilotKit/AG-UI 2026); memory-as-a-reviewable-object (memory-systems literature + ChatGPT/Notion memory-control practice, 2025–2026).
- **Core assertion:** (a) When an agent *renders UI*, the load-bearing decision is how much control the frontend keeps (open-ended = high-stakes). (b) Personalization memory needs a control surface — view/edit/correct/delete/scope what the AI remembers.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | [THOUGHT-LEAD] — practitioner framings, no usability data. |
| 3 | Duplicate or sharpen? | **Net-new.** `ai-ux-patterns.md` has the behavioral patterns but no "who renders this?" axis and nothing on memory UX. The memory pattern is also self-relevant (BOSS *is* a memory-carrying tool — `.boss/`, MEMORY.md). |
| 4 | Who serves / harms? | Serves founders building generative-UI or memory features; no harm. |
| 5 | Cost / ceremony | Light — two pattern entries in an existing practice. |

## Verdict: ADAPT
Two genuinely net-new patterns in a practice BOSS already maintains. ADAPT: add (1) the generative-UI **control spectrum** as a judgment prompt ("how much should the model be allowed to render?" — open-ended is a high-stakes gate, fits BOSS's risk-tier instinct) and (2) **memory-as-a-reviewable-object** (the footprints principle extended from actions to *what the system remembers about you*). Strip the framework/protocol specifics; keep the judgment. The memory pattern doubles as dogfood — BOSS should hold it because it is one.

## If ADOPT / ADAPT
- **What to do:** Route **UP** → two new sections in `ai-ux-patterns.md`. → hand to `/boss-learn`.
- **What's modified:** Patterns-as-judgment-prompts, not vendor frameworks.

## Notes
- Prior related: [[RVW-031]] (dark patterns, same practice neighborhood); NN/g 2026 trust framing = REJECT-duplicate (already held; use only to refresh the citation date).
- BOSS version when recorded: 0.74.0

## `/boss-learn` outcome — 2026-06-20 (v0.90.0, final /vet sweep bundle)
- **Routed UP** (with [[RVW-052]]) into `library/practices/ai-ux-patterns.md`: two net-new sections —
  **§9 Generative UI control spectrum** (static → declarative → open-ended; open-ended belongs in the §4
  irreversibility tier) and **§10 memory-as-a-reviewable-object** (view/edit/correct/delete/scope; the §5
  footprints principle extended from *what the agent did* to *what the system knows*; doubles as BOSS
  dogfood). Kept as judgment-prompts; vendor framework/protocol specifics stripped. **Shipped in v0.90.0**
  (the consolidated final-sweep bundle, commit `b35ac66`) after holding for the concurrent FEAT-023 stream.
