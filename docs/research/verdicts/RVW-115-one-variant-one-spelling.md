---
id: RVW-115
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: ADAPT
route: DOWN src/design.js (a finding on the card) + one line in /design-library
sources:
  - a component-API essay by a design-systems consultant, on a design-system vendor's blog, 2026-09 (name and URL: docs/research/sessions/SESSION-2026-10-05-design-system-reading.md, gitignored)
---

# RVW-115 — tokens got governance and props didn't: one prop, one name; one value, one spelling

## The claim
- **Source:** a consultant's essay from auditing several multi-platform component libraries.
- **Core assertion:** tokens have a spec and a review, but props get coined on the spot. So the
  button's variant is `outline` while the chip's is `outlined`. Build a **prop map**: every prop,
  its type, its values and the components that use it. Give the shared axes (size, variant, color)
  canonical values and an anti-synonym glossary with an `aliases` record, and report the drift
  *descriptively* ("resolve nothing, migrate nothing"). One system had 214 distinct props, and only
  14 of them were shared axes.
- **Inbox file:** `~/Projects/inbox/bossbuild/How to design better component APIs…pdf`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | **n=1 practitioner, with one audit's numbers** (214/14), unreplicated. The mechanism is not asserted, though. It is visible: two spellings of one meaning is a lookup failure, and it is the same failure RVW-110 *reproduced in BOSS* one layer down (the canonical component hiding behind a synonym). |
| 3 | Duplicate or sharpen? | **Sharpens.** BOSS already holds the raw material in two places. `manifest.json` carries `variants` per component (`/design-library` step 3 reads "the props that create variants"), and `src/design.js` parses variants from the manifest, the index and each usage page's *Variants, and when* table. `component-reuse-guard` already asks for *"enumerated variants, not boolean piles."* **Nothing compares one component's variant values with another's.** The renderer has every variant list on one page and says nothing when `Card: outlined` sits beside `Button: outline`. |
| 4 | Who serves / harms? | Serves anyone whose agent builds components across sessions. That is every UI cohort, and especially `vibe-virtuoso`, whose components come from many sessions that never saw each other. No one is harmed: it is a line on a card, and it blocks nothing. |
| 5 | Cost / ceremony | Neutral. No new file, field or moment. The `aliases` record and the glossary are **refused** (below). |

## Verdict: ADAPT
Take the drift report and leave the governance. `boss design` already renders drift on the
component, never in a separate report (`/design-library` § *Drift is rendered ON the component*),
and it already has every variant list in hand. Have it flag two components whose variant values
differ only in form (`outline` / `outlined`, `sm` / `small`). That is the essay's "descriptive first
pass" done deterministically, with no AI and no new data.

## If ADOPT / ADAPT
- **What to do (DOWN):** in `src/design.js`, after components are collected, normalize each variant
  value (lowercase, strip `-ed`/`-d`/`-s`, plus a fixed list of size abbreviations) and, where two
  components hold different raw values with the same normal form, push a `findings` entry on both
  (`kind: vocabulary`, *"`outlined` here, `outline` on Button — one spelling"*). **Rule 8 first:** a
  test with two manifest rows (`Button: outline`, `Card: outlined`), shown to produce no finding on
  today's code, then shown to produce one. Add one line to `/design-library` step 3: *a value
  another component already spells is spelled the same way.*
- **What's modified from the original:** no prop map file, no `aliases` field, no canonical-axis
  glossary and no prop-name drift (`sizeVariant` vs `size`). Those are V1+/multi-library tools; a
  founder's library is a dozen components. Variant *values* only, because those are what the
  manifest already holds. The synonym pairs a stem can't catch (`base`/`neutral`/`default`) are left
  alone: a fixed synonym list would be BOSS inventing a vocabulary for the founder.
- **Re-open the larger half if:** a founder project's library outgrows one screen of components, or
  a project ships two platforms from one design system.

## Attribution
Verified as the author's own experience; the numbers are the author's and are not checkable. The
attributed framing of what an API answers ("what does it receive / do / how does it look") is cited
to another practitioner and was not traced, and the verdict doesn't use it.

## Notes
- Prior related verdicts: RVW-110 (synonym hides the component, same shape at the name level),
  RVW-078 (retrieval beats recall), IDEA-132 (manifest gained edges).
- Outcome (2026-10-05, Ajesh: "go for it"): landed DOWN. `variantVocabulary()` in `src/design.js` flags a value spelled two ways across components (size words mapped, `-ed/-s/-e` folded) as a `vocabulary` finding on both cards. Test written failing first. One line in `/design-library` step 3. CHANGELOG `## Unreleased`.
- BOSS version when recorded: 0.329.0
