---
id: IDEA-134
type: idea
kind: capability
owner: product-lead
status: seedling
gist: A chapter-by-chapter read of what the playbook says, against what a reader or a deck needs. Most weak spots are the page leading with the wrong record (Vision opens on the promise, Product never shows the idea's own one-line description), not missing records; the real gaps are a product picture and faces on Team.
created: 2026-10-04
relates: IDEA-133, IDEA-106, IDEA-129, FEAT-027, FEAT-036, FEAT-039
altitude: what BOSS ships a founder, read through the Kettlewick demo
source: Ajesh, 2026-10-04: "ok lets focus on content. also for teams, like what would be needed on a deck, its a good v1. also a way for folks to add profile images to the folder or somewhere so that it can show up? maybe a better product summary of what the whole product is in description? even the vision feels a bit weak. lets do a full assessment of all the pieces and what to improve for content"
---

# IDEA-134: The playbook's content, chapter by chapter

## How this was read
Every chapter of the Kettlewick playbook, rendered with All selected (2026-10-04, after IDEA-133). Each gap is
sorted by where the fix belongs:
- **R**: render. The record exists and the page leads with the wrong one, or doesn't show it.
- **A**: ask. BOSS never asks the founder for it, or asks somewhere they'd never look.
- **D**: demo. Kettlewick's own records are thin or malformed, and BOSS isn't at fault.

A deck needs roughly: what it is · the problem · why now · the product, shown · who it's for and how
many · the rivals · the model · traction · the team · the ask. The playbook holds every one of these
except **the product, shown**.

## Chapter by chapter

| Chapter | What a reader needs | What it shows now | Gap | Fix |
|---|---|---|---|---|
| **Cover** | name, one line, the heart | strong since IDEA-133 | the name renders **lowercase** (`kettlewick`): BRAND.md has no `wordmark:`, so the folder slug shows | **D**: `wordmark: Kettlewick` |
| **1 Vision** | where this goes, and why it matters | headline = the **promise** (*We find cover before the kettle boils*), which is a product line; the few-years line is the 4th card; *Who is building it* repeats Team | **weak because it leads with the wrong record.** The vision is there, but buried | **R**: the headline becomes the founder's `in_a_few_years` line (falling back to the promise); the order becomes few-years → why → principles; *Who is building it* moves to after these. No mission statement: still refused, and not needed |
| **2 Product** | what the whole product is, in a paragraph, and **what it looks like** | headline = the *What* bullet; the shape bullets; the FEAT list; *What it is not*. **The idea's own one-line description (`gist:`) appears nowhere on the page.** The best description of the product in use (the Story cell's *7:40 on a Monday…*) sits in Problem | no summary, no picture | **R**: the headline becomes the gist (*Shift cover by phone for small home-care agencies — one tap when a carer calls in sick, and the cover is found before the kettle boils*); a **How it works** card shows the Story cell's workflow (the cell renders whole, as the rule says, and Problem keeps its why-now link). **A**: a **screenshot slot**. `/ship` is the natural moment (IDEA-106 kicked-up #23, still open); `docs/product/screens/*.png` render as the product's own picture. **D**: Kettlewick gets one screen |
| **3 Customers** | who, specifically | persona snippets, with the synthetic/real ledger | the headline repeats the first card's opening line (the headline rule) | leave it. Priya at 100% synthetic is the ledger working |
| **4 Problem** | the pain, felt | the cell + Story + evidence chips | none; it's strong | if How it works moves to Product, Problem keeps the cell and a link |
| **5 Market** | how many, and how you know | *About 6,400*, the register, dated | none | — |
| **6 Competition** | rivals, and why they'd win | table, key rivals, where they break | none; it's the strongest chapter | — |
| **7 Canvas** | the whole canvas | three frames | none | — |
| **8 Business model** | price, cost, runway, the ask | all four, the ask as an honest *not yet* | none | — |
| **9 Evidence / 10 Learnings** | proof, and the arc | the chart, the ladder, the beats | none since IDEA-133 | — |
| **11 Decisions** | the calls and what would prove them wrong | four cards | **DEC-004 renders "no ## Decision section"**: the fixture isn't in `/decide`'s shape | **D**: rewrite DEC-004 as Context / Decision / Why / Falsifier |
| **12 Risks / 13 Health** | harm named early; how it's going | both strong | none | — |
| **14 Team** | for a deck: **a face**, name, role, the one credible line, the relevant past, what's missing | everything except faces | **no photos**, and the way to add one is in a README nobody opens | **R**: a photo is picked up from the folder by name. Drop `marta.jpg` beside `marta.md` and it shows, with no field to edit (dropping the file is the choice, as the README already says). On the founder's own page, a card with no photo gets a small note saying how, hidden in slides, print and copies; never a stand-in face. **D**: Kettlewick's three people need portraits, which is a decision (below) |
| **15 Brand / 16 Values** | identity, voice, what they hold | strong since IDEA-133 | none | — |

## The pollution: BOSS's own playbook as the test case
Ajesh: *"if you look at bossbuild's own playbook as an example, we can see how non-essential info gets in and
pollutes it, rather then make it prose ready."* Rendered 2026-10-04 (`boss playbook` here). BOSS's records are
working notes kept for building, so they show every way working notes leak onto a page meant for a reader. Five
patterns. All but the last will reach founders as their records grow.

- **P1 · Revision notes become the content.** The canvas cells carry their own history (`🟢 v0.5 — RE-AIMED WITH
  AJESH, not swept.`, `⚠️ What changed: …`). Since a chapter headline is the record's first sentence, the
  headlines read **"UNCHANGED BY DECISION, with the cost named."** (Vision), **"RE-AIMED WITH AJESH, not
  swept."** (Customers, Market), **"the tension survived; the ASSUMPTION inside it did not."** (Problem). The
  story-as-text inherits the same lines. *Fix (R + A):* the playbook reads a cell's **current answer only**. A
  convention: history goes below the answer under a `History:` line, and the page and the headline skip it.
  `/canvas` writes revisions that way, so the history stays in the file and the page reads as prose.
- **P2 · Process words and internal ids in the prose.** *What it is today* says "boss learn stages a proven
  pattern… (bump VERSION + CHANGELOG)"; cells cite `DEC-009`, `PRINCIPLES #1`. *Fix (R):* in reader-facing
  blocks (cover, Vision, Product, the story as text, the Story cut), bare record ids become quiet chips or
  disappear, and backticked commands stay code. (The ids stay in the full page, where they're the trail.)
- **P3 · Learnings is the build log, not the story.** It reads every IDEA's capture log and the devlog, so it
  fills with "IDEA-133: Trap in move 3: git history is the editors' history…", commit hashes and
  "(`c2c7e21`, Unreleased)". *Fix (R):* Learnings reads **the venture's** capture log and the devlog's *Landed*
  lines only, with no capability IDEAs, and strips hashes. *How it grew* already tells the arc; Learnings
  becomes the few lines behind it.
- **P4 · Every decision, venture and build alike.** Twenty-two cards: version stamping, conscience state keyed
  per person and the eval suite sit beside *BOSS stays an incubator*. A reader needs the venture's calls.
  *Fix (A + R):* `/decide` records `scope: venture | build` (asked once, defaulting to build when the decision
  names code, a file or a tool). The playbook shows venture decisions; build decisions stay on the board and in
  the Internal cut.
- **P5 · The renderer's own diagnostics on the reader's page.** "no ## Decision section" (four times here, once
  on Kettlewick), "no ## Where it breaks in its file yet", "an entry with only a heading". These are notes to
  the founder about their files, shown to whoever they hand the page to. *Fix (R):* never in a block body. They
  go to `boss playbook --questions` (the terminal list already exists for exactly this) and, at most, a quiet
  marker on the founder's own view that's hidden in slides, print and copies.
- **BOSS-only · the wrong venture.** The canvas pairs with `IDEA-001` by number, and `IDEA-001-learning-loop.md`
  is a shipped feature with no `kind:` field, so Product and *Once upon a time* describe `/boss-learn`. CLAUDE.md
  says every IDEA here is a capability; this record never got the field. *Fix (D, for BOSS):* `kind: capability`
  on the old records. *Fix (R, general):* a pairing by number never picks a record that has `shipped_on:` or a
  FEAT promotion, or else says which record it took.

**The principle under all five:** the playbook is for someone who wasn't in the room. A record is for the person
building. A block shows the record's **current answer, in its own words**, and the trail (history, ids,
hashes, file diagnostics) stays one click away in the file, never in the sentence.

## Recommended order
0. **Make it prose-ready first** (P5, P1, P3, then P2 and P4). A page that reads as working notes undoes every
   content gain below. P5 and P3 are render-only and cheap; P1 needs the `History:` convention in `/canvas`; P4
   needs the `scope:` question in `/decide`.
1. **Product leads with the gist, plus How it works** (R). This is the biggest content gain: it's the *"what is the whole
   product"* answer Ajesh asked for, and both records already exist.
2. **Vision leads with where it goes** (R). Same move: the record is there, but the page opened on the wrong one.
3. **Team photos by file name, plus the quiet note** (R).
4. **Kettlewick fixes** (D): wordmark, DEC-004's shape, portraits, one product screen. Then the wider Kettlewick pass
   already on the list (RESUME, 2026-10-04).
5. **The screenshot slot** (A), when `/ship` next changes, or on its own if the demo screen proves the shape.

## Built (2026-10-04, Ajesh: *"fix the rest"*; portraits: *"implement, it was more of what is on kettlewick real or fake photos"*)
- `839f60d` prose-ready: P1 (`History:`, current answer only), P2 (ids out of reader prose), P3 (Learnings =
  devlog + the venture's log, no hashes), P4 (`/decide` `scope:`; build decisions one line each), P5 (no file
  notes on the page; a hand-written DEC shows its first paragraph). Kettlewick's DEC-004 was in the wrong shape.
- `2f83c0a` Vision leads with the few-years line (the echoing card hides on the page, stays a slide);
  Product leads with the gist, then **How it works** (the Story cell, once; Problem points there), then
  *What it looks like* from `docs/product/screens/` (and `/ship` keeps one).
- `cc363e9` the photo mechanism: `marta.jpg` beside `marta.md` shows, and a faceless card says how in its foot.
- Next commit: a shipped record is never the venture; Kettlewick gets its wordmark and decision scopes; 112 BOSS
  IDEA records get the `kind: capability` that CLAUDE.md always claimed for them.
- **Still open:** Kettlewick's faces, **real or fictional photos, Ajesh's call** (the mechanism is built, the
  demo stays faceless until then); a Kettlewick product screen (its `src/` is `.tsx` with no build, so there's
  no honest capture yet); **BOSS's own `docs/ideas/CANVAS.md` (Ajesh's, gitignored) needs its revision notes
  moved under `History:`** before its headlines read as prose; BOSS's DECs (gitignored) need `scope:`.

## Decisions for Ajesh
1. **Kettlewick's portraits.** They're fictional people. Options: (a) illustrated portraits that read as drawings,
   which are honest about being fictional (recommended); (b) generated photo-real faces of nobody, which look more
   like a real deck but pass a made-up person off as a photo; (c) leave them faceless, so the demo never shows the
   feature.
2. **How it works: move or repeat?** The Story cell renders whole wherever it appears. Show it in Product and keep a
   link from Problem (recommended), or show it in both.
