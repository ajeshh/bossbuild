---
id: RVW-024
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: REJECT
route: n/a (confirms existing architecture — IDEA-028)
---

# RVW-024 — prefer one strong agent over a multi-agent swarm (+ the two-week entropy cliff)

## The claim
- **Source:** latent.space/p/cognition (Cognition / Walden Yan, May 2026)
- **Core assertion (load-bearing, claim 1):** one strong driver + isolated sandboxes beats chaotic
  agent-to-agent swarm messaging for real work. (Claim 2: unreviewed autonomous coding decays to the
  worst-engineer baseline in ~2 weeks.)
- **Inbox file:** `docs/research/inbox/single-strong-agent-over-swarm.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No — it *agrees* with BOSS's architecture. |
| 2 | Evidence grade | Respected source (Cognition/swyx); anecdotal ("most practical use", "about two weeks"). |
| 3 | Duplicate or sharpen? | **Duplicate / confirmation.** BOSS already does this — it ships no multi-agent swarm orchestration; agents are advisory personas invoked one at a time; the host-subtraction audit ([[IDEA-028]]) concluded *keep the single judgment layer, don't build orchestration*. |
| 4 | Serves / harms? | n/a — no change proposed. |
| 5 | Cost / ceremony | Adopting swarm orchestration would *add* the weight BOSS already declined. |

## Verdict: REJECT
The load-bearing claim (single-driver > swarm) is a **confirmation of BOSS's existing bet**, not a new
practice — so there's nothing to adopt. Recorded as institutional memory: *we considered multi-agent
orchestration, a credible authority affirms single-driver + isolated subagents, BOSS stays aligned
(IDEA-028).* This is a REJECT-of-the-temptation-to-add-swarm, not a rejection of the insight.

## If REJECT / NOT-YET
- **Why not:** duplicates BOSS's shipped architecture; no new build earned.
- **Spun off (claim 2):** the "entropy cliff / review cadence prevents code decay" idea is genuinely
  separate and partly covered by `drift-loop` + `/drift-deep` (which catch *risk* drift, not *code*
  entropy). A code-entropy review cadence *could* be new — but the "two weeks" number is one team's
  anecdote; encoding it would be false precision + nagging. → logged as its own future inbox item if it
  earns one; **do not hardcode the number.**

## Notes
- Prior related: IDEA-028 (host-subtraction — keep judgment, rent firing).
- BOSS version when recorded: 0.66.0
