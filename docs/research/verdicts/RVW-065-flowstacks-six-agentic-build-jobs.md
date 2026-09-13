---
id: RVW-065
type: verdict
owner: product-lead
status: recorded
created: 2026-07-02
verdict: ADAPT
route: DOWN library/practices/ai-ux-patterns.md (one conscience read) — via /boss-learn
---

# RVW-065 — "The six-job agentic-build pipeline is table-stakes BOSS should adopt"

## The claim
- **Source:** r/WebAfterAI infographic, FlowStacks (flowstacks.xyz) — a curation/"verified" aggregator
- **Core assertion:** Every agentic build needs a canonical six-job pipeline (agent loop · prompt
  optimization · MCP tools · sandbox · evals+red-team · verified recipes), "one tool per job," and a
  holistic incubator should adopt a stance on all six.
- **Inbox file:** [flowstacks-six-agentic-build-jobs.md](../inbox/flowstacks-six-agentic-build-jobs.md)
- **Audit:** [[IDEA-043]]

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | Not as a lens. But adopting the framework tools wholesale would fight **#2** (premature ceremony) and **#4** (stack-neutral — smolagents/DSPy/E2B are stack picks BOSS must not bake). |
| 2 | Evidence grade | **Low.** Anonymous curation infographic; "verified" is self-asserted; n≈0 independent evidence. A best-practice *assertion from a stranger*. |
| 3 | Duplicate or sharpen? | **4 of 6 are duplicates** BOSS already rules on: sandbox → `agent-security.md` (RVW-044); evals+red-team → RVW-040/RVW-050/`/red-team` (RVW-042 OWASP); MCP-as-dual-use → `agent-security.md` + [[IDEA-017]]/[[IDEA-033]]; verified-recipes → the library→`/vet`→`/boss-learn` loop *is* BOSS. Two genuinely **new**: agent-loop guidance, prompt-optimization-as-a-smell. |
| 4 | Who serves / harms? | Framework-adoption serves `eng-builder`/`vibe-virtuoso`; **harms** `first-product`/`non-tech-founder` (six tools to wire = the ceremony that scares beginners off). The *conscience read* of gap 2 serves all cohorts (a voice, not a tool). |
| 5 | Cost / ceremony | Adopting the six as practice = **heavier** (fights R&H #1: BOSS bloats into a framework). The gap-2 sliver = **neutral/lighter** (one moment, no new surface). |

## Verdict: ADAPT

Reject the claim as framed — the six are **not** table stakes BOSS should adopt; they're
engineering-layer parts, and four of six are already covered by existing practice and prior verdicts.
The genuine value was the **audit**, which confirms BOSS's 360° claim mostly *holds* (4/6, and the two
BOSS is strongest on are the two the infographic itself flags as riskiest). One sliver earns adoption:
the DSPy insight, stripped of the tool, is a **conscience read** — *hand-tuning prompts in circles is
a signal you need eval data, not more fiddling* — which is on-voice and ties to trace-native evals
([[IDEA-025]]). The sixth "job" (agent-loop guidance) is real but **NOT-YET**: don't pre-author
engineering guidance for n=0 real agent builds.

## If ADOPT / ADAPT
- **What to do:** one conscience read into `library/practices/ai-ux-patterns.md` (or an evals-signal
  note riding [[IDEA-025]]) naming prompt-thrash as an evals signal — **not** a skill, hook, or new
  tool. → hand to `/boss-learn` (DOWN).
- **Modified from the original:** we adopt the *insight* (prompt-thrash → get eval data), not the
  *tool* (DSPy) and not the *framework framing* (six-tool pipeline). Scoped to a voice so it doesn't
  add ceremony for beginner cohorts.

## If REJECT / NOT-YET
- **Rejected part:** "adopt the six jobs as table stakes" — 4/6 duplicate (cite above), and blanket
  adoption fails #2/#4 and R&H #1.
- **NOT-YET part:** agent-loop guidance (gap 1). **Re-open condition:** a real founder build actually
  ships an agent loop and gets stuck — then a *host-neutral* ([[IDEA-032]]) practice note, pointing at
  patterns not baking a framework.

## Notes
- Prior related verdicts: RVW-042 (OWASP agentic), RVW-044 (agent-security containment), RVW-040
  (clean-evals), RVW-050 (evals-as-pm-spec).
- Related ideas: [[IDEA-043]] (the audit), [[IDEA-033]] (red-team/MCP-publishing), [[IDEA-017]]
  (founder-facing MCP), [[IDEA-025]] (trace-native evals).
- BOSS version when recorded: 0.97.0
