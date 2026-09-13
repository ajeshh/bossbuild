---
id: RVW-028
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: REJECT
route: n/a
---

# RVW-028 — "Non-technical people can ship enterprise-grade products without code; plan more, prompt less"

## The claim
- **Source:** https://www.lennysnewsletter.com/p/getting-paid-to-vibe-code — Lazar Jovanovic (Lovable's first professional vibe coder)
- **Core assertion:** A non-technical person can ship "enterprise-grade" products purely with AI; a no-code background is an *advantage*; most time should go to planning/chat not prompting; a PRD + markdown file system keeps agents aligned; kick off 4–5 parallel prototypes; design taste is the future-defining skill.
- **Inbox file:** docs/research/inbox/professional-vibe-coder-jovanovic.md

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | Tension with the PRINCIPLES.md "why." "Enterprise-grade without code / no background is an advantage" leans toward the **pseudo-app overconfidence BOSS exists to counter** — not a flat contradiction, but the framing cuts against the thesis. |
| 2 | Evidence grade | **n=1, paywalled, inspirational.** One practitioner's workflow at one company; no outcomes data. Lowest tier. |
| 3 | Duplicate or sharpen? | **Duplicate** of existing BOSS practice on every actionable point: "plan more than prompt" = context-discipline + upstream-conscience ([[IDEA-026]]); "PRD + markdown keeps agents aligned" = BOSS's declarative-markdown-state thesis + CLAUDE.md; "parallel prototypes" = `/pretotype`; "design taste matters" = RVW-020 (Mollick) + designer/ui-designer. |
| 4 | Who serves / harms? | Encourages `non-tech-founder` / `first-product`. But "no background is an advantage / enterprise-grade without code" can **harm** `first-product` and `domain-expert` (regulated, real reliability stakes) by feeding the exact confidence-without-evidence BOSS is built to check. |
| 5 | Cost / ceremony | Nothing concrete to adopt; the prescriptions are already shipped. |

## Verdict: REJECT
The actionable nuggets are all duplicates of practice BOSS already encodes, the evidence is a single paywalled anecdote, and the headline framing ("enterprise-grade without code, no background is an advantage") leans into the pseudo-app overconfidence BOSS's whole reason-for-being pushes against. Nothing here earns a change.

## If REJECT / NOT-YET
- **Why not:** Duplicate practice + n=1 evidence + thesis-tension framing. Three independent reasons; any one suffices.
- **Retain as:** cohort color, not practice — it's a live data point on how `vibe-virtuoso`/`non-tech-founder` *talk about themselves*. Worth a glance next time the personas refresh ([[IDEA-009]]); do not delete the inbox note for that reason.

## Notes
- Prior related verdicts: RVW-020 (Mollick — know-what-good-looks-like), RVW-016 (Cagan — build-to-learn-vs-earn). Same thesis-family; this adds no new ground.
- BOSS version when recorded: 0.69.0
