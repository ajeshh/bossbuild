---
id: IDEA-143
type: idea
kind: capability
owner: Ajesh
status: deferred (trigger — the site freeze lifts: the 2026-10-14 `copy_install` read, then Ajesh's go)
proof: none
proof_note: a backlog for the next website pass, not a build. Nothing on the site changes while it is frozen (CLAUDE.md, 2026-09-23); its proof is the pass itself, recorded when it runs.
gist: The website backlog. When the site freeze lifts, assess the overall overview first, as one read of the whole site, before adding anything. Items wait here as maybes until that pass, starting with how the ecosystem shows up without a page about it.
created: 2026-10-05
relates: IDEA-137, IDEA-138, IDEA-060, IDEA-110
---

# The website pass after the freeze — assess the overview first

## Current shape
_The best articulation so far. Rewrite this as the idea sharpens._

- **What:** the website backlog. Site work is frozen except for correctness until `copy_install` shows
  traffic (first read 2026-10-14). When it lifts, the first move is **an assessment of the overall
  overview**: read the whole site as a stranger would and ask whether it still says what BOSS is,
  before any item below is added. Items here are **maybes**. The pass picks, cuts or keeps them.
- **Why the overview first** (Ajesh, 2026-10-05): *"when we are updating the website, we should assess
  overall overview."* Adding pieces one at a time is how a site drifts away from one story.
- **Rules every item carries:** a line on the site is no stronger than what backs it (IDEA-138, the
  claims ecosystem, applied to BOSS's own front door); no *"only BOSS"* claim before a `/comp-eval`;
  PRINCIPLES' one sentence moves only by Ajesh's `/decide`.

## How the site is run (2026-10-05)

There is no weekly cadence; the site moves with releases. Three loops, each with a trigger:

- **Every deploy** (Ajesh's: stamp → publish → `npm run deploy`): clear what `npm run check:site`
  lists as *trailing* (18 pages on 2026-10-05) — re-read the page against what moved, then bump its
  `reviewed:`. Broken claims already block the release; trailing pages never did, so they pile up.
- **The overview pass** — whole site read as a stranger, reorganise or *subtract* — runs when the
  freeze lifts, then **quarterly**, or sooner when real evidence says a reader couldn't place BOSS
  (EVID-002, EVID-005). Adding a page is the last answer, not the first (EVID-002's falsifier).
- **Intake:** a shipped capability a founder would *feel* gets a one-line maybe below, the same day.
  Internal plumbing doesn't (the CHANGELOG rule). Evidence about the site is cited by id here, never
  quoted — the words stay in `docs/evidence/`.

## Backlog — maybes, for the overview pass to sort

- [ ] **M0 · Start where the founder already is** (2026-10-05, EVID-005, EVID-002). A non-technical
  founder, already building with AI tools and unhappy with what they'd built, read the site and could
  not say how or when BOSS would help; it read as too long. The overview pass's first test: **can that
  reader, on the first screen, see their situation and what BOSS does about it?** Not a new page.
  - **Two doors, not one** (Ajesh, same day: *"its not just for folks who built something with ai,
    but its also for folks starting a new app idea. How do they supercharge it like a Boss?"*).
    *Starting from an idea* → `/boss <idea>`; *already building, and it's drifting* → `boss adopt`.
    Both exist; on 2026-10-05 the home page reaches them only after the definition line and the
    install commands, and the second door is a one-line aside.
  - **Order the first screen by the reader, not the product:** which door is yours → what BOSS does
    on day one for that door (one concrete before/after each) → *then* install. Requirements (Node,
    Claude Code) after the reader has a reason to care.
  - Ajesh's *"supercharge it like a Boss"* is a candidate line for the voice pass, not copy yet; the
    one sentence in PRINCIPLES stays the definition and moves only by `/decide`.

- [ ] **M1 · The ecosystem, shown not named** (2026-10-05). No *Ecosystems* page and no architecture
  diagram. The ecosystem is real only where BOSS's parts hand work to each other, so show the hand-offs
  as one-line moments on the pages that already exist (`design.html`, `engineering.html`,
  `governance.html`). Each must be true and tested when it goes up:
  - *Your components moved to the manifest at V1; the reuse check moved with them.* (the flow reader, IDEA-137)
  - *`/landing` won't write a line your evidence doesn't back.* (claims, IDEA-138)
  - *`/evals` starts from what already failed.* (AI behaviour, IDEA-139)
  - *BOSS flags an unused component and asks; it doesn't delete it.* (`948ff12`)
  - **At most one sentence naming the whole**, and only after C8 (the founder-side reader) catches a
    real break in a founder's project: *"Design, code, claims and AI each keep their own rules, and BOSS
    keeps the hand-offs between them from breaking."* It touches the one sentence → `/decide` (IDEA-137 Q8).
  - **Never on the site:** *ecosystem of ecosystems* as a heading, *liveliness, alive, dead, pulse,
    healthy, pollutant*, the permaculture/Alexander lineage (credited in `docs/ECOSYSTEMS.md`, not
    marketed), a count of ecosystems, *nobody else does this* (killed 3-0, IDEA-137 R4).
- **Already waiting elsewhere, for the same pass:** what the site shares (`SHARE-SORT-2026-10-04`,
  RESUME's *Waiting on Ajesh*) · the Kettlewick showcase rework (RESUME, FEAT-039).

## Capture log
- **2026-10-05 · Ajesh** — *"i wonder how do we talk about the ecosystem overall in the website, whats
  the best marketing approach without over documentation?"* → show the mechanism, never the metaphor
  (M1). Then: *"add it to website backlog as maybe. i think when we are updating the website, we should
  assess overall overview."* → this record; the overview comes first.
