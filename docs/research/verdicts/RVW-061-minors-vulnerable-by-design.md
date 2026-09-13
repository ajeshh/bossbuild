---
id: RVW-061
type: verdict
owner: product-lead
status: recorded
created: 2026-06-21
verdict: ADAPT
route: UP library/practices/ai-ux-patterns.md
---

# RVW-061 — minors & vulnerable-by-design (addictive-design-off-by-default, age-gate theater, hard teeth)

## The claim
- **Source:** `/humane-refresh` first sweep, pass 2 (verified 3-0) — see
  [SESSION-2026-06-21-humane-refresh.md](../sessions/SESSION-2026-06-21-humane-refresh.md). Primary: **FTC v.
  Cognosphere/HoYoverse** (Jan 2025, $20M, first US loot-box action); **EU DSA minor-protection guidelines**
  (14 Jul 2025); **UK Children's Code / Age-Appropriate Design Code** (ICO, statutory).
- **Core assertion:** products touching minors carry a distinct, now-enforced dark-pattern class — **loot
  boxes / multi-tier virtual-currency obfuscation** (Genshin hid that ~$360–540 bought a 0.3%-odds prize
  through a dollars→crystals→primogems→rolls laundering of cost), **"addictive design" defaults** (streaks,
  autoplay, ephemeral content, push — the EU says disable these by default for minors), and **age-gate
  theater** (self-declaration "is insufficient"). The UK Code is *statutory*: no nudging children to erode
  privacy; high-privacy + profiling-off by default; pro-privacy nudges explicitly OK.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No — serves #6; the "addictive-design-off-by-default" + "pro-privacy nudge OK" rules are a cohort-specific instance of BOSS's own [humane-defaults](../../../library/practices/ai-ux-patterns.md) (ship the good default; the asymmetry is allowed *toward* the user). |
| 2 | Evidence grade | **Strong** — FTC enforcement action + EC guidelines + UK statutory code, 3-0. |
| 3 | Duplicate or sharpen? | **New cohort + sharpening.** CDT covers "targeting the vulnerable" abstractly; this names the *minors* cohort concretely with mechanics (loot boxes, currency-layering, age-gate theater) and the teeth. |
| 4 | Who serves / harms? | Serves any founder whose product *could* reach minors (broader than "kids' apps" — most consumer products). The harmed party (children) is the archetypal non-consenting third party → name-once even if unwelcome. |
| 5 | Cost / ceremony | **Net-light if cohort-gated.** A compact entry that *surfaces when the product may reach minors*, not a blanket COPPA-compliance module (that'd be #2 ceremony). |

## Verdict: ADAPT
Adopt, scoped to "when the product may reach minors / a vulnerable cohort." Three durable rules worth naming,
each cheap and high-signal: (1) **price in real currency, disclose odds** — multi-tier virtual currency that
obscures real-money cost is the loot-box dark pattern (FTC-enforced, $20M); (2) **ship addictive-design
features OFF by default for minors** (streaks/autoplay/push) — the EU's named list, and a clean extension of
BOSS's humane-defaults; (3) **age assurance, not age-gate theater** — a clickable "I am 18" is not age
assurance. Keep it a cohort-gated recognition entry + the pinned teeth (FTC Genshin, EU DSA guidelines, UK
Children's Code), **not** a compliance framework — BOSS scaffolds the humane default and points at the law; it
doesn't become a COPPA checker.

## If ADOPT / ADAPT
- **What to do:** add a cohort-gated "minors & vulnerable-by-design" entry to the dark-patterns § (the three
  rules + humane alternative + pinned teeth). → `/boss-learn` (UP).
- **What's modified from the claim:** scoped to surface only when minors/vulnerable cohorts are in play;
  reduced to the three transferable rules; CA Age-Appropriate Design Code noted as derivative of the UK code
  (it wasn't independently sourced this run), streaks-aimed-at-kids folded into the addictive-design rule.

## Notes
- Prior related verdicts: [RVW-056](RVW-056-canonical-dark-pattern-superset.md) (manufactured urgency/streaks — generalized; here it's the minors-specific, enforced form).
- Harm axes: economic + psychological + autonomy (commercially-illiterate cohort) — all in [harm-taxonomy.md](../../../library/practices/harm-taxonomy.md).
- BOSS version when recorded: 0.95.0 (→ bump on implementation).
</content>
