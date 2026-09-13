---
id: FEAT-037
type: feature
owner: designer
status: shipped
gist: Four slices from IDEA-112 — element families 4 → 10 in the pattern set; a usage page per component written at its review and rendered on the card; the tree read for components with no row; a lifecycle with `proposed` as the front door for a designer or teammate to ask for a part.
for: the founder, the agent that builds the next screen, and the designer or teammate who has no way to ask for a part today
created: 2026-09-13
building_since: 2026-09-13
shipped_on: 2026-09-13
from: IDEA-112
program: design-system
relates: FEAT-033, IDEA-108
---

# The library keeps itself

## Goal
Anything built becomes a reusable, documented part without a separate act; a new part is asked for
with its reason; the index cannot quietly lag the tree; and a person — not only an agent — can read
when to use a part and how to ask for one.

## Assumptions (the plan-time record)
- **Assumed:** the six new families are decisions, not elements — each a table of *the situation · the rule · the anti-pattern* in the pattern-set template, under *Element families — seed only the ones this product has* → _confirmed / corrected to: …_
- **Assumed:** the usage page is `docs/design/components/<Name>.md` with frontmatter `component:` · `status:` (proposed · draft · stable · deprecated · retired) · `design:` (optional) and sections When it applies · When it doesn't · Why it exists · Variants and when · Content · Layout · Accessibility · Research; `/design-review` writes it at the review of that component; the reuse guard points its *say why* line there → _confirmed / corrected to: …_
- **Assumed:** `boss design` scans `src/components/**`, `app/components/**`, `lib/components/**`, `components/**`, `src/ui/**` (the `/design-library` list) for PascalCase files with the usual extensions, skipping tests, stories and barrels, and reports those with no index row as *unindexed* — a boundary, not a fix; it never writes the row → _confirmed / corrected to: …_
- **Assumed:** a usage page with `status: proposed` renders under *Asked for* whether or not the code exists; the index row's status wins when both exist and disagree, and the page says so → _confirmed / corrected to: …_
- **Assumed:** the request path for a person is three sentences in Resources: to ask for a part, write its usage page as `proposed`; to change a token, a DEC; to retire a part, the Retired row → _confirmed / corrected to: …_

## Acceptance criteria
- [x] The pattern-set template carries ten element families, each as decisions with an anti-pattern column.
- [x] A usage-page template ships; `/design-review` writes it at the component's review; `component-reuse-guard`'s *say why* line names the page.
- [x] `boss design` renders the usage page on the card (Usage first, the frame after), marks components without one, and `--questions` lists them with the moment (*at /design-review of that component*).
- [x] `boss design` reports components in the tree with no index row, on the page and in `--questions`; a test with two files and one row reports one.
- [x] `proposed` renders under *Asked for*; Resources carries the three-sentence request path.
- [x] Tests: families parse; a usage page with all sections and one with holes; unindexed scan (skips tests/stories/index); a proposed page without code; status disagreement.

## What "wrong" looks like
- A row written by BOSS into the founder's index.
- A usage page invented from the component's name.
- A page-shaped file (`DashboardPage.tsx`) reported as an unindexed component.

## Paths that must not break
- **Destructive path:** still exactly one file under `.boss/`; nothing under `docs/` or `src/` written.

## Smoke check
- `node --test test/design.test.js`; the `/tmp` scaffold with three component files, one row, one usage page, one proposal.

## Log
- 2026-09-13 — specced from IDEA-112.
- 2026-09-13 — **landed** (under Unreleased). 32 design tests. The one surprise: a deprecated component was asked for a usage page — a retirement doesn't need a *when*; skipped. The section-heading regex was built from `re.source` with the `^` left in, so Content/Layout/Research read as empty until the test with a real page caught it.
