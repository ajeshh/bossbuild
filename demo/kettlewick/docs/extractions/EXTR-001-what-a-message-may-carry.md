---
id: EXTR-001
type: extraction
owner: product-lead
status: recorded
created: 2026-09-12
trigger: third-repetition
---

# EXTR-001 — What a message may carry becomes one function in the app's core

## Recent context
FEAT-007 was specced today: a model drafts the ask, so for the first time a visit leaves
Kettlewick for somewhere that isn't a carer's phone. The last four devlog entries are the card form
(FEAT-003), the first prepaid month (EVID-004), the two-week check-ins, and this spec. Reading `src/`
before the build starts turned up the same few lines written three times: pick the day, the time and
the area off a visit, and leave the rest behind.

## Candidate 1: what a message may carry
- **What it is:** the choice of which visit fields go into a text. The ask (FEAT-001), the "it's
  taken" text to the other two carers, and the "goes out at 6:30" notice (FEAT-005) each pick their
  own fields off the visit row, by hand, three slightly different ways.
- **Where it lives now:** inline in the three senders, beside the template strings.
- **Route:** DOWN
- **Rationale:** used three times in this product (signal A, same work repeated), and about to be
  used a fourth time by the one caller that can leak: the model prompt. It depends on this domain
  (visits, areas, carers' first names), so a sibling project couldn't reuse the code. The value is in
  the code: one place that says what leaves.
- **If DOWN:** target `src/ask/facts.js`. The smallest valuable cut: one function that builds the
  facts from an allow-list (`toPromptFacts(visit, carers)`, so a field added to a visit later stays
  out until someone adds it on purpose), with the template text (`fallbackAsk(facts)`) moved next to
  it. The three senders and the FEAT-007 prompt all read from it. Its test asserts what is *absent*
  (no client name, street, postcode, care note or phone number), not what is present.

## Candidate 2: the "say when" time
- **What it is:** turning a queued send time into words a carer reads: "goes out at 6:30" on the
  carer's card, the owner's day view, and now the draft sheet (PAT-4, PROG-001 task C1).
- **Where it lives now:** `sendTime()` in `src/rota/cover.js` computes it; each surface words it.
- **Route:** NOT-YET
- **Rationale:** three surfaces, but the wording isn't settled: C1 ("tomorrow, 7am" in the carer's
  own words, not a timestamp) is still open, and the copy already disagrees with the rule in one
  place (see the FEAT-007 design review). Extracting a phrasing nobody has agreed on would freeze
  the disagreement.
- **If NOT-YET:** re-open when C1 closes, so there is one agreed phrasing to extract.

## What didn't make the cut
- **"A model call answers with the old text when it can't"** — looked UP (stack-neutral, any project
  with a model call). It isn't new: BOSS already ships it as `/ai-failure-states`. Routing it UP would
  have written a second copy of a practice that exists. Here it is just how FEAT-007 is built.
- **The round of three** (`ROUND = 3` in `cover.js`) — one constant, already in one place. Nothing to
  extract.
- **The PrintSheet's raw print colour** — an exception on record (2026-09-08), waiting for a print
  token family, which is a design change, not an extraction.

## Notes
- Source devlog entries: 2026-09-05 → 2026-09-12
- Related FEATs: FEAT-001, FEAT-005, FEAT-007; DEC-005 (2026-09-13) later set what the model may see
  to four fields, and that list lives in this function
- BOSS version when this was recorded: 0.325.0
- Done 2026-09-16, inside the FEAT-007 build: `src/ask/facts.js`, tested in `test/ask.test.js`
