---
id: RVW-042
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: ADOPT
route: UP → /red-team (agent-native dimensions) + library/practices/agent-security.md
---

# RVW-042 — the OWASP Top 10 for Agentic Applications (ASI), Dec 2025

## The claim
- **Source:** OWASP **Top 10 for Agentic Applications (ASI)**, released Dec 9 2025 — ASI01 Goal Hijack, ASI02 Tool Misuse, ASI03 Identity/Privilege Abuse, ASI04 Agentic Supply Chain, ASI05 Unexpected Code Execution, ASI06 Memory/Context Poisoning, ASI07 Insecure Inter-Agent Comms, ASI08 Cascading Failures, ASI09 Human-Agent Trust Exploitation, ASI10 Rogue Agents (each tied to a real 2025 incident: EchoLeak, GitHub MCP exploit, Replit meltdown).
- **Core assertion:** An agent builder's real attack surface is the *agentic* Top 10 (tool misuse, MCP supply chain, memory poisoning), not the stateless LLM Top 10.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | [EVIDENCE]-anchored — incident-driven, community-consensus framework (the recognized standard). |
| 3 | Duplicate or sharpen? | **Genuine sharpen.** `/red-team` currently cites the *stateless* OWASP LLM Top 10; for anyone shipping an agent, the ASI list is the correct, more-current threat model. |
| 4 | Who serves / harms? | Serves every founder shipping an agent (a growing majority on BOSS). No harm. |
| 5 | Cost / ceremony | Light — refresh a citation + add agent-native categories to an existing skill/practice. |

## Verdict: ADOPT
A clean, current, standards-grade upgrade to a rail BOSS already has. `/red-team` and `agent-security.md` are built around the stateless LLM Top 10; the ASI Top 10 (Dec 2025) is the agent-native successor and is exactly the right thing to test for now that most founders ship agents. Earns its place: doesn't contradict a principle, real evidence, sharpens (not duplicates), serves without harm, near-zero ceremony.

## If ADOPT / ADAPT
- **What to do:** Route **UP** → add the ASI categories (tool misuse, MCP/agentic supply chain, memory poisoning, identity/privilege, gate-the-irreversible) to `/red-team` + `library/practices/agent-security.md`; keep the LLM Top 10 for the stateless layer. → hand to `/boss-learn`.

## Notes
- Prior related: [[RVW-032]] (agentic misalignment), [[RVW-044]] (containment/control defaults), [[RVW-040]] (the adversarial pass should test this list).
- BOSS version when recorded: 0.74.0
