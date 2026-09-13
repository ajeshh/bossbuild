---
id: IDEA-090
type: idea
owner: product-lead
status: shipped (2026-09-13 — three shelves, provenance_public on the twelve, the exactly-one check; it found two more)
gist: 12 of 33 practices are surfaced on no page and 12 of 33 carry no public provenance — and they are almost the same 12, all product-shaped.
program: founder-surface
created: 2026-09-10
proof: scripts/gen-site.js
proof_note: >
  Nothing on disk yet — this is the measurement, not the fix. When built, the proof would be
  PRODUCT_GROUPS / PROJECT_GROUPS blocks in scripts/gen-site.js plus a check that every practice
  appears in exactly one craft group. Deliberately not stubbed: an empty group renders an empty
  section, which looks like an answer.
---

# The practice shelf has an engineering bias — in its surfacing, not its content

## Current shape

**Found by writing the four craft pages (2026-09-10).** Engineering came out at 1,758 words easily
and the other three had to be dragged to 1,270–1,749. The reason was not effort and not subject
matter. Engineering was written from the **practice shelf** — dense, argued, sourced prose. The
others were written from **skill descriptions**, which are one-line summaries.

Then the measurement, and it is worse than a writing problem:

| | count |
|---|---|
| practices on the shelf | **33** |
| surfaced on the engineering page (`ENG_GROUPS`) | 21 |
| **surfaced on NO page at all** | **12** |
| **carrying no `provenance_public:`** | **12** |

**And they are almost the same twelve.** Eleven appear on both lists.

`activation` · `ai-adoption-culture` · `analytics-for-ai-products` · `celebration-of-done` ·
`conscience-voicing` · `first-dollar` · `founder-role-shifts` · `harm-taxonomy` · `landing-page` ·
`monetization-in-practice` · `retention` · (`deceptive-patterns` surfaced nowhere but attributed;
`seed-to-scale` attributed nowhere but surfaced.)

🔴 **Read the list: it is the product and founder half of BOSS.** Activation, retention, the first
dollar, pricing, the landing page, how the founder's own role shifts. The shelf is not
engineering-heavy in what it *knows* — it is engineering-heavy in what it can *show*.

## Two causes, and they compound

1. **`ENG_GROUPS` is a hand-maintained list on an engineering page.** It is the only grouping that
   exists, so a product-shaped practice has nowhere to be rendered. It is not excluded; there is no
   door.
2. **`provenance_public:` is empty on twelve.** Even given a page, their lineage cannot be shown —
   and the craft pages' whole claim is *"every position names who it was learned from."* A practice
   with no public provenance is one the site structurally cannot stand behind.

The compounding is the interesting part: **the invisible ones are the un-attributed ones.** Nothing
made that happen on purpose. A practice nobody renders is a practice nobody notices is missing a
field — which is the same shape as `library/help/` shipping untracked (v0.273.0) and the `shipped:`
field nobody read (IDEA-077).

## The smallest version that proves it

1. **`PRODUCT_GROUPS` and `PROJECT_GROUPS`** in `scripts/gen-site.js`, mirroring `ENG_GROUPS`, so
   the Product and Project pages render their own shelves instead of being hand-written summaries.
2. **Fill `provenance_public:` on the twelve.** The private `provenance:` is already written on most
   of them — this is largely a rewrite for an outside reader, not new research.
3. **A check with teeth:** every practice appears in **exactly one** craft group, and every practice
   has a non-empty `provenance_public:`. Exactly-one rather than at-least-one — a practice in two
   groups is a categorisation someone fudged.

⚠️ **Do not stub the groups.** An empty `PRODUCT_GROUPS` renders an empty section, and an empty
section reads as an answer. Either it has entries or it does not exist yet.

## Shipped — 2026-09-13 (Unreleased)

The smallest version, as written: `PRODUCT_GROUPS` (finding fit · money · going public), `PROJECT_GROUPS`
(the founder · the team) and a `CONSCIENCE_GROUPS` shelf on the conscience page, rendered from the same
files and the same receipt as engineering; `provenance_public:` on the twelve — five of them say plainly
*no outside source is claimed*, because the private record names none and a manufactured citation is
the thing `/vet` exists to catch; and the check with teeth: **every practice on exactly one shelf, every
practice with a public provenance, an exemption map that requires a reason** (empty today). The check's
first run found **two the hand count had missed** — `accessibility` and `deceptive-patterns`, carried by
the old catch-all as a note nobody read. Open question 1 resolved by rendering `harm-taxonomy` and
`conscience-voicing` on the conscience page rather than exempting them; question 2 stays open (the
product and project pages keep their hand-written positions and gain a generated shelf, the split
engineering already had); question 3 stands.

## Open (as written)

1. **Some of the twelve may not deserve a craft page.** `conscience-voicing` and `harm-taxonomy` are
   arguably internal; `deceptive-patterns` already has a home on Charter. The check should have an
   explicit exemption list with a reason per entry, not a silent skip — the lesson from the
   citation-debt denominator (v0.229.0), where forgetting to add an entry *shrank* the problem.
2. **Whether the craft pages should be generated at all.** Engineering renders `ENG_GROUPS`
   generatively *and* carries hand-written positions. That split works. The question is whether
   Product and Project should follow it or stay hand-written, and the honest answer is that nobody
   knows until the groups exist.
3. **This is internal surface, not founder surface** — it changes what oyeboss.build can show, not
   what a founder's project contains. It does not spend the compose-and-subtract budget.
