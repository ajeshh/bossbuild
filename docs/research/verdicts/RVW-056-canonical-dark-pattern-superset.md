---
id: RVW-056
type: verdict
owner: product-lead
status: recorded
created: 2026-06-21
verdict: ADAPT
route: UP library/practices/ai-ux-patterns.md
---

# RVW-056 — the canonical academic dark-pattern superset (the classic-web patterns the AI-chatbot taxonomy omits)

## The claim
- **Source:** `/humane-refresh` first sweep, pass 1 (verified) — see
  [SESSION-2026-06-21-humane-refresh.md](../sessions/SESSION-2026-06-21-humane-refresh.md). Primary:
  Gray et al. CHI 2024 "Ontology of Dark Patterns Knowledge" (DOI 10.1145/3613904.3642436, 64 synthesized
  pattern types from 10 taxonomies); Mathur et al. Princeton CSCW 2019 "Dark Patterns at Scale"
  (arXiv:1907.07032, 7 categories / 15 types from an ~11K-site crawl); Brignull deceptive.design.
- **Core assertion:** BOSS's dark-pattern checklist (the CDT 37, five families) is *AI-chatbot-shaped* and
  omits the canonical **commerce / interface / obstruction** patterns the web has named for a decade —
  roach-motel / un-deletable accounts, sneak-into-basket, drip & partitioned pricing, fake countdown timers
  and low-stock messages, confirmshaming, visual interference, forced enrollment/continuity, trick
  questions. An AI product inherits these the moment it has an account, a paywall, or a checkout — so the
  catalog should name them too.
- **Inbox file:** n/a (research-sourced; durable in the SESSION note above).

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No — directly serves #6 (humane before viable). Risk is #2 (ceremony) if we import all 64. |
| 2 | Evidence grade | **Strong.** Peer-reviewed (CHI 2024, CSCW 2019), the canonical practitioner library (Brignull), 3-0 adversarial verification. The single best-evidenced finding of the sweep. |
| 3 | Duplicate or sharpen? | **Mostly additive, partly sharpening.** CDT covers *difficult-to-delete*, *fake social proof*, *guilt-on-exit* — these generalize. The whole **Obstruction** family, **sneaking/commerce** mechanics, and **manufactured urgency/scarcity timers** are genuinely new to the catalog. |
| 4 | Who serves / harms? | Serves every cohort building a product with auth/payments/checkout — `non-tech-founder`, `vibe-coder-newbie`, `first-product` most (they ship a Stripe checkout without knowing "drip pricing" is a named, regulated harm). Harms no cohort. |
| 5 | Cost / ceremony | **Net-neutral if curated, heavy if imported whole.** 64 patterns frozen into a skill = the RVW-001 anti-pattern. A compact named-families extension + pinned canonical refs = right altitude. |

## Verdict: ADAPT
The evidence is the strongest in the sweep and the gap is real: BOSS's lens is AI-chatbot-shaped and goes
quiet exactly where most first-time founders will actually build a dark pattern — the account-deletion flow,
the checkout, the upgrade nag. **But do not import all 64 patterns** (that's the RVW-001 freeze-a-list
anti-pattern, and #2 ceremony). Fold in a *compact named-families extension* to the dark-patterns § of
[`ai-ux-patterns.md`](../../../library/practices/ai-ux-patterns.md): **Obstruction**, **Sneaking /
commerce**, **Manufactured urgency & scarcity**, **Interface interference / misdirection** — each one line +
its humane alternative, framed as "the classic-web patterns an AI product inherits the moment it has an
account, a paywall, or a checkout." Pin the canonical sources (Brignull, Mathur, Gray) as the reference, the
way the catalog already pins Shape of AI / HAX — so the *list* lives upstream and stays refreshable, not
frozen here.

**Set aside (considered, not adopted):** "manipulation-as-a-service" (Mathur's finding of 22 vendors selling
dark patterns turnkey) is a real and striking *market fact*, but it isn't a pattern a founder *builds* or
*catches* — it's not actionable in a build-time checklist and doesn't earn a harm axis. Note it in the
SESSION record; don't put it in the catalog.

## If ADOPT / ADAPT
- **What to do:** add the four named families (compact, humane-alternative each) to the dark-patterns § of
  `ai-ux-patterns.md`; pin Brignull/Mathur/Gray to the canonical-references block. → `/boss-learn` (UP).
- **What's modified from the original claim:** curated to four BOSS-relevant families instead of the full
  64-type ontology; framed for AI-native builders (the account/paywall/checkout inheritance), not as a
  general e-commerce audit; the *list* stays a pinned external reference, not a frozen internal enumeration.

## Notes
- Prior related verdicts: [RVW-031](RVW-031-cdt-dark-pattern-taxonomy.md) (ADAPT — the CDT 37 this extends).
- Harm axes: no new axis needed — these hit **economic** (drip/hidden pricing) and **autonomy** (obstruction,
  manufactured urgency), both already in [harm-taxonomy.md](../../../library/practices/harm-taxonomy.md). The
  gap was *pattern-naming*, not *harm-naming*.
- BOSS version when recorded: 0.94.0 (→ bump on implementation).
</content>
