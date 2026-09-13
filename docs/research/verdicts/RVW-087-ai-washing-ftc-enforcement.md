---
id: RVW-087
type: verdict
owner: pm
status: recorded
created: 2026-08-24
verdict: ADOPT
route: DOWN library/deceptive-patterns.json — claims-ai-washing status candidate → adopted
sources:
  - https://www.ftc.gov/news-events/news/press-releases/2024/09/ftc-announces-crackdown-deceptive-ai-claims-schemes
  - https://www.ftc.gov/news-events/news/press-releases/2025/02/ftc-finalizes-order-donotpay-prohibits-deceptive-ai-lawyer-claims-imposes-monetary-relief-requires
---

# RVW-087 — AI washing is enforced, not just disliked: RVW-058's re-open condition has come due

## The claim
- **Source:** `docs/research/inbox/ai-washing-ftc-operation-ai-comply.md`
- **Core assertion:** Marketing an AI capability the product does not have is an enforced deceptive
  pattern, so the catalog row should stop rendering `UNVETTED`.
- **This is a deferred claim returning, not a new one.** [[RVW-058]] ruled **NOT-YET** in June 2026
  purely on evidence grade, and named its own re-open condition: *"the FTC's Sept-2024 'Operation AI
  Comply' is a real, citable"* thing, closest to ready. That is the condition being asserted.

## Step 3 — attribution: ✅ VERIFIED IN FULL, from the primaries

Both fetched and read (ftc.gov 403s WebFetch; retrieved by curl and parsed).

- **Operation AI Comply exists, as named.** Press release dated **September 25, 2024**, subtitled
  *"agency announces five law enforcement actions against operations that use AI hype or sell AI
  technology that can be used in deceptive and unfair ways."* **Five actions ✅.** Named in the
  release: DoNotPay ("world's first robot lawyer"), a company selling an AI tool for generating fake
  reviews, and multiple online-storefront money-making schemes.
- **The DoNotPay final order verifies to the digit.** Verbatim: *"After receiving five comments, the
  Commission voted 5-0 on January 16, 2025, to approve the final order and send responses to the
  commenters."* And: *"The final order requires DoNotPay to pay $193,000 in monetary relief and
  notify consumers who subscribed to the service between 2021 and 2023... The order also prohibits
  DoNotPay from advertising that its service performs like a real lawyer unless it has sufficient
  evidence to back it up."*
- **Every figure in the shipped `teeth` string checks out**: 2024-09-25 · five actions · 5-0 ·
  2025-01-16 · $193,000 · 2021–2023 · the conduct prohibition. Note the teeth cites the **vote**
  date (2025-01-16), not the press release date (2025-02-11) — the more precise anchor, and correct.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No — it *is* Principle #6 and BOSS's anti-hype voice, pointed at the founder's own marketing copy. |
| 2 | Evidence grade | **Top of the scale.** Not a study, not a practitioner: a federal enforcement sweep with named respondents and a **final order carrying money and conduct relief**. This is the highest grade any claim in the catalog holds. RVW-058's NOT-YET was *purely* about evidence grade, and the grade has moved as far as it can. |
| 3 | Duplicate or sharpen? | Non-duplication was checked and closed 2026-08-21 (see inbox file) and I did not redo it. The row is the product **claiming to be AI at all**; `claims-capability-misrepresentation` is the model **overstating what it can do** — opposite direction, different surface. |
| 4 | Who serves / harms? | ⚠️ **The bar needs saying plainly, and the sweep says it:** all five actions target *unsubstantiated capability or earnings claims that induce a purchase*. The row is **not** warning a founder off the adjective "AI-powered" on a landing page. Its own `honest` field already carries the correct test — *"a claim you cannot demo."* Serves every cohort; harms none, because it asks for accuracy, not modesty. |
| 5 | Cost / ceremony | Zero. One row already in the catalog, surfaced only on `social-proof-and-claims`. This changes one word of metadata. |

## Verdict: ADOPT
The re-open condition RVW-058 wrote for itself has been met, and then some — it anticipated a
citable *sweep*, and what exists is a **finalized order**. Every specific in the shipped teeth
verifies against the primary. Promote `status: candidate` → `adopted`; the row stops rendering
`UNVETTED`.

## If ADOPT / ADAPT
- **What to do:** `library/deceptive-patterns.json` → `claims-ai-washing.status = "adopted"`. No copy
  change: the `looks_like`/`honest`/`teeth` text was already accurate, which is itself the finding.

## 🪞 The reflexive check the inbox file required — BOSS PASSES
The inbox file made this a condition: *"BOSS is itself an AI-adjacent product making claims about
what its conscience does. If this row lands, it applies reflexively."* Run across `README.md`,
`web/index.html`, `web/_data.json` and all 15 `site/*.html`, for
`AI-powered|AI-driven|AI-native|AI-first|powered by AI|intelligent|machine learning|neural|smart`:

- **README and the two index pages: zero hits.** BOSS's public copy describes *what it does*
  (scaffolds, modes, a conscience that fires just-in-time) and never claims a capability.
- **Seven hits across `site/`, all clean on inspection** — `AI-native interface patterns`,
  `git workflow for AI-native building`, `/ai-first-init`, `mentor-architect coaches on AI-native
  build`. Every one describes **the founder's building context**, not a capability BOSS possesses.

**BOSS passes its own row.** Recorded because a pass is a finding: the row is not one BOSS would
have to exempt itself from.

## Notes
- Prior related verdicts: [[RVW-058]] (NOT-YET, June 2026 — this closes it).
- BOSS version when recorded: 0.227.0
