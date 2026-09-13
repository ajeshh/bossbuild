---
id: RVW-080
type: verdict
owner: product-lead
status: recorded
created: 2026-08-20
verdict: NOT-YET
route: n/a (the retirement sentence was taken as ADAPT in v0.167.0; the versioning machinery is deferred)
---

# RVW-080 — should BOSS teach design-system versioning and deprecation?

## The claim
- **Source:** [Nathan Curtis / EightShapes, *Versioning Design Systems*](https://medium.com/eightshapes-llc/versioning-design-systems-48cceb5ace4d)
  · UXPin · Design Systems Collective · figr.design · Magic Patterns
- **Core assertion:** Design systems rot without managed change — SemVer, gradual deprecation with
  EOL dates, 1–2 release migration windows, codemods, RFCs, a centralized changelog, CI that fails on
  undocumented breaking changes, and adoption-driven retirement (<5% after six months → deprecate).
- **Inbox file:** `docs/research/inbox/design-system-lifecycle-versioning.md`

## Attribution — PARTLY VERIFIED

- ✅ **Nathan Curtis / EightShapes is a genuinely respected practitioner** BOSS already cites
  (the token layer-cake, purpose-naming). *Versioning Design Systems* is his and is real.
- ⚠️ **But his context is explicitly multi-team enterprise** — systems with *consuming teams* who
  break when you change something. Citing him for a solo founder is **using a real authority outside
  the conditions that made him right**, which is the subtler cousin of a wrong attribution.
- ❌ The operational specifics — *"codemods handle ~90% of migrations"*, *"<5% adoption after six
  months"* — trace to **vendor blogs selling design-system tooling**, not to Curtis. Quarantined.

## Rubric

| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **YES — #2, just-in-time support, never premature ceremony.** SemVer on a token file, an RFC process, a cross-functional working group and a two-release deprecation window for **one person with no consuming teams** is the exact failure BOSS exists to refuse. This alone caps the verdict. |
| 2 | Evidence grade | **Respected practitioner, wrong conditions.** Strong for teams; inapplicable at BOSS's stage. |
| 3 | Duplicate or sharpen? | **The one founder-scale piece was already extracted and shipped (v0.167.0)** — *a component nobody uses is drift you're paying to maintain*, mirroring the prototype registry's subtraction rule. The rest is new and unwanted. |
| 4 | Who serves / harms? | **Serves** teams with multiple consumers of one system — a population BOSS has ~none of. **Harms every current cohort**, and worst the ones who'd comply: `first-product` and `non-tech-founder` would dutifully set up a deprecation process for a component library only they use. |
| 5 | Cost / ceremony | **Heaviest of the sweep.** Process, not artifacts — and process is the form of ceremony BOSS is least able to remove later. |

## Verdict: NOT-YET

Correct advice, wrong reader. It fails PRINCIPLE #2 for BOSS's actual cohort, and the single piece
that *is* founder-scale — retirement as subtraction — was already taken. Filed NOT-YET rather than
REJECT because the advice becomes right the moment the conditions change, and the conditions are
nameable.

**The general rule worth carrying out of this one:** *a respected source cited outside the conditions
that made it right is a weaker citation than an unknown source cited inside them.* Curtis isn't
wrong; he's answering a question BOSS's founders don't have yet.

## Re-open condition
A BOSS project acquires a **second consumer** of its design system — a second app, a published
component package, or a second engineer who breaks when a component changes. Until a change can hurt
someone who isn't the author, versioning is bookkeeping.

## Notes
- Prior related: [[RVW-014]], [[RVW-052]] — the standing pattern that design advice arrives
  enterprise-dosed and needs scaling down for a solo founder.
- BOSS version when recorded: 0.171.0
