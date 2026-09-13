---
id: RVW-059
type: verdict
owner: product-lead
status: recorded
created: 2026-06-21
verdict: ADAPT
route: UP library/practices/ai-ux-patterns.md
---

# RVW-059 — accessibility dark patterns (exclusion-by-design as deception)

## The claim
- **Source:** `/humane-refresh` first sweep, pass 2 (verified 3-0) — see
  [SESSION-2026-06-21-humane-refresh.md](../sessions/SESSION-2026-06-21-humane-refresh.md). Primary: CHI '25
  Lewis/Martinez/Das/Fogarty (n=16 visual-AT users, DOI 10.1145/3706598.3713784); CSCW '25 "When
  Accessibility Becomes a Trap"; arXiv 2503.05263 (ADHD susceptibility, Mildner/Stefanidi).
- **Core assertion:** an inaccessible flow (unlabeled element, inaccessible CAPTCHA, unsubscribe buried low in
  keyboard-nav order, a pre-ticked promo checkbox invisible to a screen reader) is **"effectively deceptive"
  to anyone who can't perceive or escape it** — a distinct exclusion-by-design harm, *even when
  unintentional*. Accessibility barriers both *are* dark patterns and *amplify* the classic ones; ADHD users
  recognized far fewer (11.7 vs 16.4) and were most vulnerable to forced-action and false-urgency.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No — serves #6, and pairs exactly with the "effect, not intent" line just adopted (RVW-057): the harm doesn't need malice. |
| 2 | Evidence grade | **Strong** — peer-reviewed CHI/CSCW '25 + arXiv, 3-0 verified. |
| 3 | Duplicate or sharpen? | **New.** BOSS's catalog has *nothing* on accessibility as a dark-pattern surface. The closest is the generic "keep every door open" — this names a whole cohort the door is closed to. |
| 4 | Who serves / harms? | Serves every founder (most ship an unlabeled element or an inaccessible CAPTCHA without knowing it's a *deceptive* harm, not just a compliance miss). The harmed party — disabled/neurodivergent users — never consented to being excluded → third-party-harm side of [conscience-voicing](../../../library/practices/conscience-voicing.md) (name once even if unwelcome). |
| 5 | Cost / ceremony | **Net-light** — one compact entry + "WCAG is a floor, not a ceiling." Not a full a11y audit framework (that'd be #2 ceremony and out of lane). |

## Verdict: ADAPT
Genuinely new and well-evidenced, and it sharpens the "effect, not intent" line BOSS just adopted: the most
common accessibility failure is *unintentional*, and to the person it locks out it's indistinguishable from a
deliberate trap. Add a compact entry to the dark-patterns § — accessibility barriers as exclusion-by-design
deception, with **WCAG framed as the floor not the ceiling** and the cohort named (blind/low-vision via AT;
ADHD/neurodivergent via amplified urgency/forced-action). Keep it a *recognition heuristic + humane
alternative*, not an audit framework: label every interactive element, give cancel/unsubscribe equal-or-higher
keyboard-nav priority, offer non-visual auth, and test deceptiveness *under assistive tech*. Do **not** import
WCAG itself — pin it as the reference.

## If ADOPT / ADAPT
- **What to do:** add an "accessibility / exclusion-by-design" entry to the dark-patterns § of
  `ai-ux-patterns.md` (definition + the AT/ADHD cohorts + humane alternative + WCAG-as-floor); note it
  doubles the force of "effect, not intent." → `/boss-learn` (UP).
- **What's modified from the claim:** scoped to a recognition heuristic, not an audit methodology; framed for
  AI-native builders (the generated checkout/consent flow nobody tested under a screen reader).

## Notes
- Prior related verdicts: [RVW-056](RVW-056-canonical-dark-pattern-superset.md), [RVW-057](RVW-057-dark-pattern-regulatory-teeth.md) ("effect not intent" — this leans on it).
- Harm axes: **societal (exclusion/discrimination)** + autonomy + psychological — all already in [harm-taxonomy.md](../../../library/practices/harm-taxonomy.md); no new axis, but worth naming exclusion explicitly there as a societal-harm instance.
- Regulatory teeth: ADA, EU Accessibility Act, WCAG; CPRA's effect-based test makes unintentional exclusion actionable.
- BOSS version when recorded: 0.95.0 (→ bump on implementation).
</content>
