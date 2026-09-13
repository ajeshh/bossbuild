---
id: RVW-031
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
updated: 2026-06-20 (full report read — primary source in docs/source/)
verdict: ADAPT
route: UP → library/practices/ai-ux-patterns.md (humane-alternative checklist) + a /red-team --humane dimension + an optional /evals sycophancy dimension
---

# RVW-031 — a named dark-pattern taxonomy for conversational AI (CDT, May 2026)

## The claim
- **Source:** Joshi, Adjagbodjou & Luria (2026), *Dark Patterns in AI Chatbots: A Taxonomy to Inform Better Design*, Center for Democracy & Technology. **CC-BY** (quotable/adaptable with attribution). Full report read: `docs/source/2026-05-28-CDT-Research-Dark-Patterns-in-AI-Chatbots-Report-final-2.pdf`.
- **Core assertion:** AI chatbots carry **37 enumerable dark patterns across 5 categories** (Data & Memory Exploitation · Informationally Misleading Design · User Autonomy Compromised for Engagement · False Social & Emotional Connection · Incentivized & Coercive Monetization). Crucially, these can **emerge from LLM behavior (training/fine-tuning/RLHF/system prompts), not only deliberate design** — so they must be tested for in the *built* product, not just avoided at design time. The report pairs the taxonomy with constructive "better design" recommendations.
- **Inbox file:** `docs/research/inbox/cdt-dark-patterns-ai-chatbots-taxonomy.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No — it *operationalizes* #6 (humane before viable). It's the humane lens as a checklist. |
| 2 | Evidence grade | Practitioner-grade from a credible digital-rights org (CDT). Not peer-reviewed, but a structured, named taxonomy grounded in observed product behavior — well above n=1 vibe. |
| 3 | Duplicate or sharpen? | **Sharpens — and bigger than first read.** [[ai-ux-patterns]] covers *good* AI-UX (trust-repair, edit-before-execute, three interrupt registers) but has no *named-anti-pattern* inverse, no *humane-alternative* guidance, and no *test-the-built-thing* angle. CDT supplies all three. The monetization category also cross-links to `mentor-business` (the [[RVW-030]] pricing playbook should inherit "monetization dark patterns to avoid"). |
| 4 | Who serves / harms? | Serves every cohort building an AI product (esp. `vibe-coder-newbie`/`first-product`, most likely to ship a manipulative default *unknowingly* — the emergent-not-intentional finding is precisely about them). Harm only if it becomes a scolding gate — scope it suggestive, not blocking. |
| 5 | Cost / ceremony | Light-to-moderate. A referenced checklist + recommendations in an existing practice = light. The `/red-team --humane` dimension + optional `/evals` sycophancy dimension are real surface but reuse existing skills (not new always-on hooks). REJECT-worthy only if turned into a new mandatory hook moment. |

## Verdict: ADAPT
The strongest humane-side candidate in this sweep — almost purpose-built for BOSS's conscience, and the full report is richer than the abstract suggested. ADAPT (not ADOPT) because it should be **scoped and split into BOSS's existing surfaces, not imported wholesale**. Four things to take, in priority order:
1. **The humane-alternative checklist** (not just the anti-patterns — CDT's "do this instead": default conversations to *end*, opt-in/default-on *strip-the-social-layer*, genuine delete controls, no emotional language near a purchase). Fold into [[ai-ux-patterns]], attributed.
2. **A `/red-team --humane` dimension** that tests the *built* product for emergent patterns (sycophancy especially) — because CDT's load-bearing finding is that these **emerge from model behavior, not only intent**. Bridges to [[RVW-032]].
3. **The risk split** — CDT's "dark in isolation → avoid entirely" (Targeting Users When Vulnerable, Agents Playing on Emotions, Sneaky Purchases) vs. "fine with guardrails" maps onto BOSS's conscience-vs-censor line ([[conscience-voicing]]): hard-name the first set, surface-the-tension on the rest.
4. **(Optional, earn-it) an `/evals` sycophancy dimension** — CDT argues sycophancy/emotional-reinforcement should be a measured, publicly-reported quality metric. That's an evals dimension, not a checklist item. Defer unless a founder is building an affective product.

All suggestive, never a new gate (the conscience names a cost; it doesn't make a choice unavailable).

## If ADOPT / ADAPT
- **What to do:** Route **UP** in two passes — (a) `library/practices/ai-ux-patterns.md` gains a "Dark patterns + humane alternatives (recognize-as-you-build)" block carrying the 5-category taxonomy *and* CDT's four recommendation buckets, attributed CC-BY; (b) `/red-team` gains a `--humane` dimension that probes the built product (esp. sycophancy / engagement-prolonging / emotional-manipulation-near-purchase). Cross-link the monetization row into `mentor-business`'s pricing guidance. The `/evals` sycophancy dimension is a deferred follow-on. → hand to `/boss-learn`.
- **What's modified:** Scope to the founder's *own* product (not "audit everyone's chatbot"); keep suggestive; take the *constructive recommendations* alongside the anti-patterns (BOSS points at the fix, not just the cost); attribute CDT.

## Notes
- Prior related verdicts: [[RVW-032]] (emergent agent misbehavior — the test-the-built-thing bridge), [[RVW-030]] (mentor-business pricing — monetization-pattern cross-link), [[RVW-014]] (same practice neighborhood), [[conscience-voicing]].
- Primary source archived: `docs/source/2026-05-28-CDT-Research-Dark-Patterns-in-AI-Chatbots-Report-final-2.pdf` (CC-BY).
- BOSS version when recorded: 0.74.0

## `/boss-learn` outcome — 2026-06-20 (routed UP, v0.82.0)
- Routed UP: the 5-family / 37-pattern dark-pattern checklist + CDT's constructive humane-alternatives into `library/practices/ai-ux-patterns.md`; a new **`/red-team --humane`** dimension (probe the built product for emergent patterns, esp. sycophancy). Held conscience-not-censor (names cost + alternative; never blocks). The optional `/evals` sycophancy dimension stays a deferred follow-on. Bundled with [[RVW-045]]. VERSION 0.82.0 + CHANGELOG; `/tmp`-verified.
