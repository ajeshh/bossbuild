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

## Backlog — maybes, for the overview pass to sort

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
