---
id: RVW-016
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: ADAPT
route: DOWN stages/L0-quickstart/template/.claude/skills/prototype + spec
---

# RVW-016 — build to *learn* vs build to *earn* (delivery is cheap; discovery is the bottleneck)

## The claim
- **Source:** svpg.com/build-to-learn-vs-build-to-earn (Marty Cagan, Apr 2026)
- **Core assertion:** AI collapsed delivery cost, so the bottleneck is *discovering* what's worth building.
  Run discovery as cheap throwaway prototypes ("build to learn"), kept separate from the shippable product
  ("build to earn").
- **Inbox file:** `docs/research/inbox/cagan-build-to-learn-vs-earn.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No — it *is* the thesis (PRINCIPLES "build without fooling themselves"). |
| 2 | Evidence grade | Respected practitioner (Cagan), but decade-old discovery/delivery gospel with "AI" bolted on. |
| 3 | Duplicate or sharpen? | **~80% already shipped** — `/prototype` (v0.52) = build-first-to-see/learn; `/spec` (validated-learning field) = build-to-earn; the upstream conscience (v0.54) already fires "is it worth building?" The *new* bit is the crisp **vocabulary**. |
| 4 | Serves / harms? | The "10-20 prototypes/week + empowered cross-functional team" cadence is enterprise-PM — harms the solo `first-product`/`indie` founder (ceremony BOSS strips out). |
| 5 | Cost / ceremony | The distinction is one line; the cadence is heavy. Take the former, drop the latter. |

## Verdict: ADAPT
The substance is already BOSS's design — but the **"build to learn vs build to earn" naming** is a clean,
clarifying frame worth borrowing (it names exactly the `/prototype`→`/spec` graduation we already ship).
Adopt the vocabulary; reject the prototypes-per-week cadence and the team assumptions.

## If ADOPT / ADAPT
- **What to do:** add the one-line frame to `/prototype` ("this is *build-to-learn* — a sketch to think
  with; building it *for real* is *build-to-earn*, the `/spec` path") — reinforces the sketch-vs-MVP line
  already there. → `/boss-learn` DOWN (skill copy).
- **Modified from original:** drop "10-20/week" + empowered-team framing entirely.

## Notes
- Near-duplicate of `/prototype` + the v0.54 upstream conscience; earns ADAPT only on the vocabulary.
- BOSS version when recorded: 0.66.0

## Routed via /boss-learn — APPLIED v0.67.0 (2026-06-20)
The ADAPT landed as specified above. See registry/CHANGELOG.md 0.67.0.

## 🔴 ADDENDUM 2026-08-24 — the applied text DRIFTED from this verdict. See [[RVW-086]].

This verdict approved **one line**: *"this is build-to-learn — a sketch to think with; building it for
real is build-to-earn, the `/spec` path."* What shipped at v0.67.0 is a **five-line blockquote** that:

- swapped the approved *"a sketch to think with"* for **"a throwaway"** — importing Brooks-1975 framing
  this verdict never contained, and which **Brooks retracted in 1995**;
- stamped **"(Marty Cagan, 2026)"** on a phrase Cagan explicitly credits to **Jeff Patton** in the very
  article cited as this verdict's source — step 3 (verify the attribution) did not exist until v0.159.0,
  so this record never ran it;
- added *"the two modes stay separate on purpose"*, which contradicts Cagan's footnote 3 (*"not to think
  of discovery and delivery as phases"*).

Also recorded here because it was found in the same pass: the *"restart it… rebuild to keep"* mandate at
SKILL.md:110–114 is **NOT** downstream of this verdict — it shipped at **v0.55.0**, before this ADAPT was
applied at v0.67.0, and **no RVW ever authorized it.**

**The general lesson, worth more than the fix:** nothing in BOSS checks that shipped text still matches
the verdict that authorized it. An ADAPT approved as one line shipped as five, and the added material was
the unsupported part.

