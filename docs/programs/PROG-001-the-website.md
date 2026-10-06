---
id: PROG-001
type: program
owner: Ajesh
status: active
created: 2026-10-05
graduated_from: public-surface
gist: oyeboss.build — the site, and the standing work of keeping it true. Upkeep and a backlog of maybes live here, not as an IDEA per pass; an item gets its own IDEA only if it could ship alone and be worth something.
---

# PROG-001 — The website

**The first graduated program** ([IDS.md § `program:`](../IDS.md)). The slug `public-surface` became
this record on 2026-10-05, when the site gained reasoning that belongs to no single member: how it is
run, the rules every change carries, and a backlog that kept turning into a new IDEA per pass
(IDEA-143 was one, and it was a chore, not an idea — Ajesh, 2026-10-05).

**Members:** every record with `program: PROG-001` — `boss records --programs` lists them with
shipped vs open. Not `front-door`: that program is the CLI's first run (unlock, skill descriptions,
the example project), not the site.

## What belongs here vs its own IDEA

The test from [IDS.md](../IDS.md) (*Not every growth is a split*): **could it ship alone and be worth
something?** A copy fix, a reorder, a tile crop, a page read against what moved: a line in the
backlog below. A new capability a founder would feel (a showcase, a fake door, a render): its own
IDEA, with `program: PROG-001`.

## How the site is run

The site moves with releases, not a weekly cadence. Three loops, each with a trigger:

- **Every deploy** (Ajesh's: stamp → publish → `npm run deploy`): clear what `npm run check:site`
  lists as *trailing* — re-read the page against what moved, then bump its `reviewed:`. Broken claims
  already block the release; trailing pages never did, so they pile up.
- **The overview pass** — the whole site read as a stranger, reorganise or *subtract* — runs
  **quarterly**, or sooner when real evidence says a reader couldn't place BOSS (EVID-002, EVID-005).
  Adding a page is the last answer, not the first (EVID-002's falsifier). First pass: 2026-10-05
  (`5ff59d8` home, `6ee90f0` demo; the record is IDEA-143).
- **Intake:** a shipped capability a founder would *feel* gets a one-line maybe below, the same day.
  Internal plumbing doesn't (the CHANGELOG rule). Evidence about the site is cited by id here, never
  quoted — the words stay in `docs/evidence/`.

## Rules every change carries

- **Look at the whole site before adding anything** (Ajesh, 2026-10-05: *"when we are updating the
  website, we should assess overall overview"*). Adding pieces one at a time is how a site drifts away
  from one story.
- A line on the site is no stronger than what backs it (IDEA-138, applied to BOSS's own front door);
  no *"only BOSS"* claim before a `/comp-eval`; PRINCIPLES' one sentence moves only by Ajesh's `/decide`.
- Preview the BUILT page (`site/`, or a worktree build), never `web/*.html` — it has no shell or CSS.
- The freeze of 2026-09-23 is lifted (Ajesh, 2026-10-05; CLAUDE.md).

## Backlog — maybes, for the next pass to pick, cut or keep

- [ ] **D2b · Proof tiles are unreadable at any size** — the renders are 640px captures of a 1280px
  page (`gen-proof.js`), so enlarging only blurs. Needs a sharper render or tight crops of one region.
- [ ] **D4 · Footer install:** npm + brew Copy buttons land at different x on desktop (`_shell.html:82–90`).
- [ ] **D5 · *How it thinks* subnav** adds ~570px on a phone, so /design's first screen is nav + h1.
- [ ] **V1 · Watch one reader with the new first screen** — the hero line is a candidate until a
  stranger reads it aloud. If they still can't say how or when, the line changes, not the length.
- [ ] **M1 · The ecosystem, shown not named.** No *Ecosystems* page and no architecture diagram; show
  the hand-offs as one-line moments on pages that exist (`design.html`, `engineering.html`,
  `governance.html`), each true and tested when it goes up. The candidate lines, the one sentence that
  waits on C8 and `/decide`, and the never-on-the-site words: IDEA-143 § M1.
- [ ] **Waiting elsewhere, for the same pass:** what the site shares (`SHARE-SORT-2026-10-04`,
  RESUME's *Waiting on Ajesh*) · the Kettlewick showcase rework (FEAT-039).

**Distribution, ranked by cost-to-signal** (not site work; kept so the pass doesn't forget): watched
sessions on real drifting repos (read the home page aloud 5 min, then `boss adopt` → `/read-repo`;
each an EVID) → one before/after write-up of `/read-repo` on Ajesh's own project, UTM per channel →
the plugin directory listing → one program-director conversation (IDEA-109) after a session exists.
Deferred: launch-day sites, paid, anything with countdowns or invented proof.

## Log

- **2026-10-05** — graduated from `public-surface`; IDEA-143's upkeep and open backlog folded in
  (Ajesh: *"the website pass was more of a chore not an idea… should be combined into one giant
  website one"*). IDEA-110 and IDEA-117 joined (site work filed under other umbrellas).
