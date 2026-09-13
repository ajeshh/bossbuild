---
id: RVW-097
type: verdict
owner: pm
status: recorded
created: 2026-09-10
verdict: NOT-YET
route: n/a
sources:
  - docs/research/sessions/SESSION-2026-09-10-documentation-craft.md
---

# RVW-097 — BOSS should ship a documentation discipline as a practice founders inherit

## The claim
- **Source:** Ajesh, 2026-09-10, in session: *"the process of how we do help, and create and manage
  content to keep it in alignment, can become a part of boss, because a lot of apps don't do
  documentation well, too verbose, too light, out of date… so how we crack the code."*
- **Core assertion:** BOSS's own documentation mechanism (generated/hand-written split, `covers:`
  tripwires, freshness stamps, a gate that reports coverage against ground truth) is good enough
  and general enough to become a practice every BOSS project inherits.
- **Note on lane:** this is an *internal* proposal, not a stranger's claim. It is vetted rather
  than routed straight to `/boss-learn` because the thing being proposed is a **new shipped
  surface**, and the standing founder mandate is compose-and-subtract. The check on that is
  exactly what `/vet` is for.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **#1 pulls FOR it** (sort proven patterns UP). **#2 pulls hard against it** — "never premature ceremony." The mechanism is **one day old**. It has been run on exactly one repo, by one person, and it shipped with two defects found within the hour (see below). Sorting UP at n=1-day is the definition of premature. |
| 2 | Evidence grade | **n=1, and the n is BOSS itself on its first day.** Worse: the honest evidence currently points at *immaturity*, not maturity. The `covers:` mechanism did not do what three of its own comments claimed, and `library/help/` shipped untracked — meaning its freshness half was structurally unable to fire and `npm run check` would have failed on any clone. A practice built from this yesterday would have encoded two bugs as guidance. |
| 3 | Duplicate or sharpen? | **Substantially duplicate.** `library/practices/documentation.md` already exists (330 lines) and already owns "what gets written down." It also **already refuses the generative half by name**: *"A doc generator. Docs that nobody chose to write are the ones nobody read."* The genuinely new material is two paragraphs, and both belong inside that file. |
| 4 | Who serves / harms? | Serves `eng-builder`, `returning-founder`, `vibe-virtuoso` — people with a repo big enough to have docs that rot. **Actively harms `first-product` and `non-tech-founder`**, who do not yet have a user, let alone a documentation-decay problem. Shipping them a freshness discipline is ceremony against a problem they do not have, and app-bloat is the #1 named risk on BOSS's own canvas and the founder's own stated fear (EVID-001). |
| 5 | Cost / ceremony | **Heavier, on the surface under an explicit subtract mandate.** 48 skills, n=2 independent founders both saying the offering is unready. A new documentation practice + gate is precisely "more surface ≠ more readiness." |

## Verdict: NOT-YET

The instinct is right and the timing is wrong. **Three of the four mechanism claims this pass tested
were killed because BOSS already holds the position more sharply in-repo, and the fourth was refuted
by BOSS's own implementation** — which is the clearest possible signal that what exists needs
sharpening, not that a new thing needs shipping.

There is also a specific reason to wait rather than a general one: **the mechanism's two load-bearing
parts were both broken until today.** `reviewed:` was decorative in both checkers, and
`library/help/` was untracked so the freshness comparison could never fire. Neither has now survived
a single review cycle. A practice is a claim that something *works*; nobody yet knows whether this
one does.

## If REJECT / NOT-YET
- **Why not:** premature (PRINCIPLE #2) against an n=1-day mechanism whose two central pieces were
  defective on day one, largely duplicating a practice that already exists and already refuses the
  generative half — and it adds founder surface under a standing subtract mandate at n=2.
- **Re-open condition — all three, and they are cheap:**
  1. **One full review cycle survived.** A `covers:` tripwire fires on a real source change, a human
     re-reads and bumps `reviewed:`, and the flag clears *because of the re-read* rather than
     because a file was touched. That is the mechanism doing its job once, observed.
  2. **A second repo.** The mechanism has only ever run against BOSS. It needs to work somewhere
     with a different shape — and BOSS has four other registered projects on this machine.
  3. **A founder-side signal.** Any evidence that a real BOSS user has a documentation-rot problem.
     There is currently **none** — zero EVID records mention documentation. Absent that, this
     practice serves BOSS's maintainer, not BOSS's founders, and should stay internal.
- **What to do instead, now:** fold the two genuinely-new sentences into
  `library/practices/documentation.md` — *"a generated surface is not automatically drift-proof:
  audit it for hand-authored data and stamp that data like prose"* and *"`covers:` is a change
  tripwire, not a staleness verdict"* — plus the cross-reference to `context-discipline.md` that
  `documentation.md` is currently missing. That is a `/boss-learn` UP-sharpen against an existing
  file, needs no new surface, and is the whole adoptable delta.

## Attribution
**n/a — internal proposal.** The supporting literature was verified exhaustively and mostly did not
survive: see SESSION-2026-09-10-documentation-craft §2. Of note, two citations a documentation
practice would have been tempted to lean on **do not say what they are reputed to say**: Diátaxis
*does* address upkeep as a principle (the claim that it does not was wrong, and was mine), while
"the paradox of sense-making" is **not Carroll's** — it is the title of Raymond S. Nickerson's 1991
review of him, and the openly-readable PDF circulating under Carroll's book title is that review.

## Notes
- Prior related verdicts: RVW-096 (ADAPT — the one outside claim that survived, routed as a sharpen
  to `context-discipline.md`), RVW-002 (ADAPT — lean CLAUDE.md).
- This verdict is the check working as designed: the proposal came from the founder, and the
  skeptical pass says not yet. Recording the *no* is the point — without it this returns next month
  and costs the same debate.
- BOSS version when recorded: 0.273.0
