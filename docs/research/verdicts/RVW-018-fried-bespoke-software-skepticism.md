---
id: RVW-018
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: ADAPT
route: DOWN stages/L0-quickstart/template/.claude/skills/canvas (humane "build or buy?" check)
---

# RVW-018 — the AI "bespoke software revolution" is overhyped; often "buy the boring SaaS" is the honest answer

## The claim
- **Source:** world.hey.com/jason/the-bespoke-software-revolution... (Jason Fried / 37signals, Mar 2026)
- **Core assertion:** giving everyone AI build-tools doesn't make everyone a builder; most people want the
  problem *gone*, not a system to maintain. Custom software is usually bloated and built wrong.
- **Inbox file:** `docs/research/inbox/fried-bespoke-software-skepticism.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No — it *serves* #6 (humane): sometimes the honest answer is don't-build. A loaded gun at BOSS's premise, which is healthy to face. |
| 2 | Evidence grade | Respected contrarian (Fried), credible n=1 argument — opinion, but sharp and from the calm-company lineage BOSS draws on. |
| 3 | Duplicate or sharpen? | **New.** BOSS has no explicit "should this even be built, or bought?" humane check. |
| 4 | Serves / harms? | Serves the founder (saves them building the wrong thing). Risk: over-applied, it discourages the very building BOSS enables — so it must be **scoped**. Fried's target is *internal business tooling*; BOSS serves *product* builders. |
| 5 | Cost / ceremony | Light — one humane-lens question at the canvas gate. |

## Verdict: ADAPT
Adopt a scoped humane-lens check, not the blanket claim. The transferable kernel: *before committing to
build, ask whether the honest answer is to build it — or to use/buy something that already solves it.*
Scope it to where Fried's warning actually binds (tool-shaped / internal-process ideas), not to genuine
product ventures, so it sharpens the humane lens without becoming a discouragement.

## If ADOPT / ADAPT
- **What to do:** a one-line humane prompt in `/canvas` (the "who's harmed / is this real" pass): *"Is the
  honest move to build this, or would using/buying an existing tool serve the person better?"* — fire it
  for internal-tool-shaped ideas; stay silent for product ventures. → `/boss-learn` DOWN.
- **Modified from original:** scoped to tool-shaped ideas; reframed as "build the *right* thing (sometimes
  that's not-building)", never "don't build."

## Notes
- Pairs with the humane lens (`mentor-humane`) and the pseudo-app thesis. Worth confronting head-on.
- BOSS version when recorded: 0.66.0

## Routed via /boss-learn — APPLIED v0.67.0 (2026-06-20)
The ADAPT landed as specified above. See registry/CHANGELOG.md 0.67.0.
