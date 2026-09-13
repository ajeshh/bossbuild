---
id: RVW-026
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: ADAPT
route: DOWN stages/L1-mvp/template/.claude/skills/close (brain-write staleness discipline)
---

# RVW-026 — memory staleness is a write-side problem; design for evolution, not replacement

## The claim
- **Source:** mem0.ai/blog/state-of-ai-agent-memory-2026 (Mem0, June 2026)
- **Core assertion:** treat staleness as a write-side concern; tag memories with composable identity scopes
  (user/agent/session/org), default async writes, and design for the unsolved gap — "a fact accurate until
  they change jobs becomes confidently wrong."
- **Inbox file:** `docs/research/inbox/venture-brain-staleness-evolution.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | The retrieval-stack/identity-scope machinery imports dependency weight (zero-dep conflict). The *staleness discipline* doesn't. |
| 2 | Evidence grade | Vendor (Mem0) pitch for memory-as-infrastructure — but it names a *real* unsolved problem BOSS's brain has. |
| 3 | Duplicate or sharpen? | **Sharpens a gap in the v0.65 brain.** BOSS has living memory (`forget`/recency) + "trust what you see over the brain" (voicing) — both partial. The *evolution-not-replacement* + *staleness-as-write-side* lens is sharper on the "confidently-stale read" failure. |
| 4 | Serves / harms? | The discipline serves (a brain that doesn't confidently mislead). The full stack harms (deps the cohort can't carry). |
| 5 | Cost / ceremony | Kernel is light (a check in `/close`'s brain-write). Stack is heavy. |

## Verdict: ADAPT
Adopt the **staleness-as-write-side discipline** narrowly; reject the retrieval-stack + identity-scope
machinery (over-ceremony for a markdown brain, forbidden deps). The kernel: when the conscience updates
the brain at `/close`, it should actively *revise or retire* standing-summary claims that the work has
overtaken (the riskiest assumption shifted, a pivot happened) — the brain **evolves**, it doesn't just
accrete. This hardens exactly the v0.65 brain we just shipped.

## If ADOPT / ADAPT
- **What to do:** a line in `/close`'s brain-write step — *"before appending, re-check the standing summary:
  has the work overtaken any claim in it? Revise or retire stale lines; the brain evolves, it doesn't just
  grow."* Reinforces the recency-window/`forget` already there. → `/boss-learn` DOWN.
- **Modified from original:** discipline only; no identity-scope schema, no retrieval stack, no async-write
  infra.

## Notes
- Sharpens FEAT-022 (v0.65 brain + living memory). Pairs with RVW-021 (the relationship/outcome side).
- BOSS version when recorded: 0.66.0

## Routed via /boss-learn — APPLIED v0.67.0 (2026-06-20)
The ADAPT landed as specified above. See registry/CHANGELOG.md 0.67.0.
