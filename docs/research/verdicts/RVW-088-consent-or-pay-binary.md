---
id: RVW-088
type: verdict
owner: pm
status: recorded
created: 2026-08-24
verdict: ADAPT
route: DOWN library/deceptive-patterns.json (consent-or-pay) + library/practices/monetization-in-practice.md (the counterweight)
sources:
  - https://www.edpb.europa.eu/system/files/2024-04/edpb_opinion_202408_consentorpay_en.pdf
  - https://www.edpb.europa.eu/system/files/2026-02/edpb_work-programme_2026-2027_en.pdf
---

# RVW-088 — "consent or pay" is a pattern only when it is a BINARY; the paid tier was never the defect

## The claim
- **Source:** `docs/research/inbox/consent-or-pay-as-a-deceptive-pattern.md`
- **Core assertion:** "Accept tracking, or subscribe" is a deceptive pattern, not a fair trade.
- The inbox file set its own bar: *"If the vet cannot draw that line crisply, the row should be
  REJECTED, not softened — a pattern a founder cannot distinguish from a decent business model will
  fire on decent business models."*

## Step 3 — attribution: ✅ VERIFIED, and the staleness check FLIPPED on me

**Opinion 08/2024 — fetched and read (PDF).** *Opinion 08/2024 on Valid Consent in the Context of
Consent or Pay Models Implemented by Large Online Platforms*, **adopted 17 April 2024**. The shipped
teeth's scope claim verifies from the body, ¶28: *"The definition may cover, among others, certain
controllers of 'very large online platforms', as defined under the DSA and 'gatekeepers', as defined
under the DMA."* ¶27 supplies the case-by-case test — 'large scale' processing, whose factors include
*"the number of data subjects concerned, the volume of data and the geographical extent."* **It does
not reach a solo founder ✅.**

🔴 **The part worth recording as method.** The teeth says broader guidance *"was promised and is
unconfirmed."* A web search told me the opposite — that the broader-scope guidelines *"were already
adopted in their version for public consultation."* **The primary says no.** In the EDPB Work
Programme 2026-2027 (adopted 11 Feb 2026), that sentence is a **footnote attached to an asterisk**,
and the asterisk marks *pseudonymisation, legitimate interest, DSA/GDPR interplay, blockchain, BCR
Processor referential,* and the e-commerce-accounts recommendation. **"Guidelines on 'consent or pay'
models" carries no asterisk.** The search summary had read the footnote onto the wrong list item.

Had I trusted the snippet, this verdict would have shipped a false statement about a regulator.
**n=11 for [[vet-verify-attribution]], and a new flavour: the misattribution was committed by the
search layer, not the source** — a footnote silently re-pointed at a neighbouring bullet. The teeth
was right and is now *stronger* than it claimed: promised in 2024, two stakeholder events held, and
**still not at public consultation 22 months later** while six sibling guidelines passed it.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | **Regulatory opinion of the EU's own data-protection board**, read in full — top of the scale for a `teeth` field. |
| 3 | Duplicate or sharpen? | No existing row covers it (checked 2026-08-21). |
| 4 | Who serves / harms? | 🔴 **This is where the row was genuinely at risk.** As written it could fire on a legitimate paid ad-free tier — the way a lot of calm companies fund themselves, and something BOSS's own catalog endorses ("charge for capability"). That would have harmed exactly the `indie-hacker` cohort BOSS is closest to. |
| 5 | Cost / ceremony | One row, surfaced only on `consent-ui`, plus one bullet in a practice that already exists. |

## Verdict: ADAPT
The claim survives, but **only in a narrower form than it was written**, and the primary supplies the
line the inbox file demanded. The defect is **not the paid tier — it is the binary.** The EDPB's
actual holding is that a controller should offer *"an 'equivalent alternative' that does not entail
the payment of a fee,"* and where a fee is charged, *"should consider also offering a further
alternative, free of charge, without behavioural advertising, e.g. with a form of advertising
involving the processing of less (or no) personal data."*

So the test a founder can actually apply is **count the doors.** Two doors (consent / pay) is the
pattern. Three doors — including a free one with contextual ads — is a business model. That line is
crisp, comes from the primary, and cannot fire on an honest ad-free tier.

## If ADOPT / ADAPT
- **`consent-or-pay.status` → `adopted`**, with `looks_like`/`honest` rewritten to the binary test.
- **`teeth`** keeps the verified scope and gains the 2026-02-11 re-verification plus the principle
  worth carrying to a small team: *"personal data cannot be considered as a tradeable commodity...
  preventing the fundamental right to data protection from being transformed into a feature that
  data subjects have to pay to enjoy."*
- 🔴 **The counterweight, which the inbox file made a CONDITION of adoption, and which I verified was
  genuinely missing:** `monetization-in-practice.md` contained **no** guidance on ad-free tiers,
  advertising or free tiers — zero hits — so the catalog would have been BOSS's only voice on the
  subject, stating the manipulative reading with nothing stating the legitimate one. A bullet now
  sits in its humane clause saying plainly that a paid ad-free tier is normal and often *pro*-user,
  and that what turns it is the binary. **Adopting the row without this would have been the harm in
  rubric Q4, shipped.**
- **Modified from the original claim:** the inbox guessed the line was *"priced to be refused."*
  The primary says otherwise — price is a secondary, case-by-case factor; **absence of the third
  door is the defect.** Dropped the pricing test entirely.

## Notes
- BOSS version when recorded: 0.227.0
