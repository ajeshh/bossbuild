---
id: RVW-057
type: verdict
owner: product-lead
status: recorded
created: 2026-06-21
verdict: ADAPT
route: UP library/practices/ai-ux-patterns.md
---

# RVW-057 — regulatory teeth: "effect not intent" + the codified "symmetry in choice" standard

## The claim
- **Source:** `/humane-refresh` first sweep, pass 1 (verified) — see
  [SESSION-2026-06-21-humane-refresh.md](../sessions/SESSION-2026-06-21-humane-refresh.md). Primary:
  California CCPA/CPRA Civ. Code § 1798.140(l) + 11 CCR § 7004 + CPPA Enforcement Advisory 2024-02; EU AI
  Act Art. 5(1)(a)/(b); EDPB Guidelines 03/2022 (six-category consent taxonomy); FTC "Bringing Dark
  Patterns to Light" 2022 (four-category harm taxonomy + named "drip pricing").
- **Core assertion:** BOSS's dark-pattern catalog is purely *descriptive* (here's the bad shape). The law
  now adds two things it lacks: (1) **dark patterns are judged by EFFECT, not intent** — you can build one
  accidentally, and consent obtained via one is legally void (CCPA); (2) a **codified, enforceable humane
  standard** — "symmetry in choice" (11 CCR § 7004(a)(2)): the privacy-protective path must be no
  longer/harder/slower than the less-protective one. Plus binding AI-specific teeth (EU AI Act Art. 5, fines
  to €35M / 7% turnover).
- **Inbox file:** n/a (research-sourced).

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No — it *codifies* #6. The "symmetry in choice" rule is a law-grade version of the catalog's own "keep every door equally open" line ([ai-ux-patterns.md](../../../library/practices/ai-ux-patterns.md) Humane defaults §). |
| 2 | Evidence grade | **Strong** — statute, regulation, and adopted regulatory guidance, 3-0 verified. Highest grade of authority a claim can carry. |
| 3 | Duplicate or sharpen? | **Sharpens, doesn't duplicate.** "Effect not intent" sharpens *conscience-not-censor* (a founder can dark-pattern *by accident* → the conscience's value is catching the unintended one). "Symmetry in choice" gives the existing asymmetry-is-manipulation principle a *concrete, testable bar*. |
| 4 | Who serves / harms? | Serves the founder who asks "is this actually illegal?" (a real, decision-changing question for `non-tech-founder`/`returning-founder`). Harms none. Caveat: must stay a *pointer*, not legal advice — BOSS doesn't give legal advice (bright line). |
| 5 | Cost / ceremony | **Net-light** if it's a reference pointer + one sharpening line; **heavy** if it becomes a compliance-checklist gate. Hold to the former. |

## Verdict: ADAPT
Two genuinely sharpening ideas, one set-aside. **Adopt the "effect not intent" framing** — it's the missing
half of conscience-not-censor: the conscience earns its keep most on the dark pattern the founder *didn't
mean to build*, and the law agrees that's still a dark pattern. **Adopt "symmetry in choice" as the concrete
bar** under the existing Humane-defaults asymmetry principle — BOSS already says "keep every door equally
open"; CCPA § 7004 makes it testable ("is the opt-out path longer than the opt-in?"), which is exactly the
kind of cheap, checkable heuristic the catalog wants. **The broader regulatory map** (EU AI Act Art. 5, EDPB
six-category consent taxonomy, FTC four-category lens, the fragmented EU framework + forthcoming Digital
Fairness Act) is **reference, not practice** — a short pinned pointer for "is this regulated?", explicitly
*not* legal advice and *not* a gate. BOSS scaffolds humane-by-default; it does not become a compliance
framework (that's #2 ceremony and outside its lane).

## If ADOPT / ADAPT
- **What to do:** (1) add an "effect, not intent" line to the dark-patterns § (a dark pattern doesn't need
  malice — the conscience catches the accidental one); (2) name **symmetry-in-choice** as the concrete test
  under the Humane-defaults asymmetry paragraph; (3) add a compact **"regulatory teeth (reference, not legal
  advice)"** pointer block — CCPA effect-based test, EU AI Act Art. 5, EDPB + FTC taxonomies — to the
  canonical-references area. → `/boss-learn` (UP).
- **What's modified from the original claim:** demoted the regulatory *map* from "adopt" to "pinned
  reference"; kept only the two ideas that sharpen existing practice; bright-lined it as non-legal-advice.

## Notes
- Prior related verdicts: [RVW-031](RVW-031-cdt-dark-pattern-taxonomy.md), [RVW-056](RVW-056-canonical-dark-pattern-superset.md) (the pattern-names this pairs with).
- Time-sensitivity: EU law is moving (Digital Fairness Act proposal ~Q3 2026; EDPB 3/2025 interplay
  guidance). The watchlist's `next_review` already flags re-checking the regulatory section.
- BOSS version when recorded: 0.94.0 (→ bump on implementation).
</content>
