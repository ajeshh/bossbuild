---
id: IDEA-133
type: idea
kind: capability
owner: product-lead
status: seedling
gist: BOSS asks the founder's why once and never says it back — make the why the centre that the brand, the marketing words and the story grow from, returned to the founder in their own words at the moments that matter, free to deepen, change or end; the playbook's story becomes a view over that, not the point.
created: 2026-10-04
relates: IDEA-106, IDEA-129, FEAT-025, FEAT-036, DEC-004, IDEA-063, IDEA-132
altitude: what BOSS ships a founder (not BOSS's own practice)
source: Ajesh, 2026-10-04 — "I think we could do a really amazing job to tell the story of the company
  for the playbook in a way that creates a powerful story and a way to tell the story of a brand that is
  developing. I think of the playbook as a good v1, but i can think of it as easily as becoming the
  narrative the entrepreneur uses to help share about the idea to others, or ends up reusing the content
  to create their website, or powerpoint and such. I think we need to also think of how the brand, its
  voice, its brand story keeps developing. [a 2026 design-team essay on brand as software] is a good idea
  on how we can best build and scale the building blocks. but we should also make the overall story
  telling, capturing, grow." (Source in docs/research/sessions/SESSION-2026-10-04-brand-as-software.md.)
  → "lets think and research ways to do storytelling, i wanna keep building visually and the story we
  tell that helps entrepreneurs on the playbook. so lets keep expanding the idea and then lets figure
  out the steps to build out the brand, storytelling n such"
---

# IDEA-133: The why at the centre (was: The story that grows)

## Re-aim (2026-10-04): the why first, the story downstream

Ajesh, after the prototype: *"whats the point of this… does this help [marketing brand development]…
reminding entrepreneurs the strong why of why are they building it, what is their vision, what is
the problem they are solving for, and staying grounded in the heart of their why"* → *"yup"* to the
re-aim below.

**The gap, verified in code.** `/boss` §3.5 asks three things once and saves them verbatim:
`motivation:` + `success_looks_like:` (*why this one, for you*; what "it worked" looks like) and
`in_a_few_years:` (the vision). The canvas holds the **Problem**. After that:
- the conscience reads the why **only to calibrate what it asks** (`moment-frames.js`: "Calibrate
  the ASK to it, not the tone"), so the founder never hears it;
- `in_a_few_years` is read by the playbook alone, and `orientation.js` prints the motivation slug;
- nothing asks whether the why is still true, and nothing records it changing.

**The heart is three things, held together**, and BOSS already has a field for each: *why me / why
this* (the personal reason), *the problem I saw* (the canvas Problem), and *where it goes* (the
vision). The re-aim is to stop storing them and start **returning** them.

**The chain this puts at the centre.** Marketing that works is the founder's why meeting the
customer's own words:

> the why (the heart) → the problem seen (EVID) → the promise (BRAND.md) → the words customers repeat (learned rows) → the site, the deck, the story

The story chapter (below) was starting from the end of this chain.

**What the essay contributes, now read in full** (quotes checked against Ajesh's PDF; the source
note holds them):
- It names this exact gap: *"The founder's point of view exists in a recording no one has
  watched."*
- *"A guideline can describe the brand. It cannot participate in the work."* The why in IDEA
  frontmatter describes; it has to take part.
- *"A strong strategy is a decision-making framework… What do we believe? How will we behave?"* The
  why is useful at a fork, not on a poster.
- Its "jazz" centre: the system must know *"what must remain true in either mode."* **For a founder,
  the why is that centre.** The brand can get louder or quieter, and the why is what stays true.
- *"Memory is not imagination. People still have to decide where to go."* BOSS holds the why. The
  founder decides what it means today.

### The order: collect, showcase, keep collecting, then see (Ajesh, 2026-10-04)

> *"its not about guard rails, first its about brand, the why and the overall story of the app in
> terms of what is it that they are trying to do, collecing it, showcasing in a beautiful story for
> the playbook. once we start creating more mechanisms to keep collecting and story. we can then see
> as to if/how to build guard rails. right?"*

Right, and it matches the repo's own rule that a gate needs a reason first. The conscience slice
below was the reflex jumping ahead. The order:

1. **Collect.** Decide what the story is made of and where each piece lives: the heart (why this,
   for you · the problem seen · where it goes, which `/boss` already asks), the brand (BRAND.md,
   plus the five additions), the turns (DECs, EVIDs, learned rows). Most of it is already captured.
   The work is reading it, and filling the few gaps the founder actually writes (the ABT line,
   Origin).
2. **Showcase.** The playbook opens with a beautiful story built from what was collected: the heart
   first, then the brand, then how it grew. Prototype v2 on Kettlewick, then `src/playbook.js`.
3. **Keep collecting.** The mechanisms that let the story grow without a session about it: `/close`
   asks for one line when something changed, `voice:` / `shape:` / `why:` rows, and `/evidence`
   marking customer words that echo the why.
4. **Then see.** Whether anything should come back to the founder unprompted (the conscience
   quoting the why) is decided after 1–3 exist and have been used. It is not designed now.

**The capture mechanism, piece by piece (Ajesh: *"kettlewick is just the demo.. but its the mechanism
inside boss of how we capture it right?"*). Yes: Kettlewick is the full-record fixture, and every
new chapter also needs an empty-tree test, because that is a real founder on day one.**

| Piece | Asked where, today | Stored in | Gap |
|---|---|---|---|
| Why this, for you; what "it worked" means | `/boss` §3.5, once | venture IDEA `motivation:`, `success_looks_like:`, a `— why:` capture-log line | never asked again; a change is never recorded |
| Where it goes | `/boss` §3.5, once | `in_a_few_years:` | same |
| The problem seen; why now | `/canvas` | Problem + Story cells | — |
| Promise, refuses, sounds, NOT, the name | only when `/landing`, `/pretotype` or `/design-tokens-init` first runs | `docs/BRAND.md` | **no page made → no brand doc at all** |
| Words customers used | `/evidence` debriefs | EVID + BRAND.md learned rows | the row is written only if BRAND.md exists |
| The turns | `/decide`, `/evidence` | DEC, EVID (dated) | — (the strongest part) |
| The one-line story (ABT) | nowhere | — | missing |
| Origin, as it happened | nowhere | — | missing |
| Said in chat, held by no record | `/close` 3d | wherever it routes | the nearest thing to an ongoing collector |

The Collect phase therefore has three jobs: **the brand doc starts with the venture, not with the
first page**; **the why can be revisited and its changes recorded**; and **the ABT line and Origin
get a home and a moment to be asked**. Each one extends an existing moment (`/boss`, `/canvas`,
`/evidence`, `/close`). None adds a skill.

**Correction, found while re-reading:** the prototype's "Where it's going — no vision line on
record" panel was **a false hole**. Kettlewick's IDEA-001 has `in_a_few_years: "Every small agency
in the county runs its week on it, and the phone tree is a story the owners tell new staff."` along
with `motivation: own-problem` and `success_looks_like`. The renderer must read the venture IDEA's
frontmatter before it calls anything a hole. v2 fixes this.

### The weave: inside the playbook as it is, not a chapter on top (2026-10-04)

Ajesh: *"i wanna be careful of how it weaves into existing playbook. and how it feels natural inside
that container."* I read the rendered demo first (`site/demo/playbook.html`). The playbook already
has a grammar: a chapter label, a headline that is a record's first sentence, three cards per row,
each card with a grade chip and a source line, gaps as dashed holes, Present cuts by block id.
**The story uses that grammar and adds no chapter.** Vision is already most of "the heart": its
headline is the promise, and its cards are the why, Principles and *In a few years*.

| Story piece | Lands in | As | New styling? |
|---|---|---|---|
| The one-line story (ABT) | **Cover**, under the tagline; **Vision**, first card | a line / a `block`, hole → `/canvas` | none |
| Why this, for you | **Vision** `vision-why` (exists) | the `— why:` capture-log sentence first, then *it worked*; the motivation slug in plain words (`own-problem` → "their own problem"), never the slug | none |
| Where it goes | **Vision** `vision-few-years` (exists) | chip `aspiration`, not `asserted` | one chip class |
| How sure, over time | **Evidence**, first block | the strip (SVG), a pure projection of EVID dates and grades plus DEC dates | the SVG only |
| How it grew (the beats) | **Learnings**, above *The story so far* | beat cards: each a record's own line, spine label, date, chip | a small grid inside one block |
| Words that landed | **Brand** `brand-learned` (exists, counted) | quoted, **if Ajesh reverses FEAT-036's counted-never-quoted rule** | none |
| What they use instead | **Brand** current shape (a new line in BRAND.md) | a `kv` row | none |
| Origin, as it happened | **Brand**, new block | the founder's section verbatim; hole → BRAND.md | none |

Cuts: the ABT line, the strip and the beats join the VC cut. A Story cut is not built until
someone asks.

**Found while reading. Write these down, don't act on them yet:**
- The *why in your words* gap is partly **a demo gap, not a mechanism gap**. `/boss` §3.5 already
  writes a dated `— why: … / it worked = …` capture-log line, but the playbook never reads it, and
  Kettlewick's IDEA-001 doesn't have one. The fix is a renderer read plus a demo line.
- **`/pretotype` (L0) tells you to seed BRAND.md from "`/landing` carries the skeleton at
  `templates/brand-doc.md`"**, but `/landing` is L1, so at Quickstart that skeleton is not on disk.
  This is a seam bug; reproduce it before fixing (CLAUDE.md rule 8). **Wider than it looked
  (verified 2026-10-04 in a throwaway with `BOSS_HOME` set):** after `boss unlock mvp`, `/landing`
  is still not installed (it's an earned verb), so `templates/brand-doc.md` is on disk for almost
  nobody. **Fixed in `bf02333`:** the skeleton moved to `canvas/templates/brand-doc.md` (Quickstart
  skills stay on disk at every rung); `/pretotype`, `/design-tokens-init` and `/landing` point there;
  `/canvas`'s inline seed became a pointer. Verified in throwaways: present at Quickstart and after
  `unlock mvp`, and `boss sync --apply` adds it to an older install.
- **`nascent` is not declared in `docs/IDS.md`.** The brand-doc template writes it and
  `src/playbook.js` reads it, but there is no vocabulary row for `type: brand`. `check:backlog` is
  right to flag it inline; A2 uses a fenced template, which is the checker's documented case for a
  typed record. Declaring the brand doc's vocabulary is a small follow-up.
- **Future todo (Ajesh):** *"kettlewick demo or kettlewick itself its a bit weak overall, and we
  could do it better"*. This is a separate pass on the showcase (FEAT-039), not this IDEA.

### The build, in commits (Collect first, then the weave)
- **A1 · brand-doc template** (text): `story:` in the frontmatter (the one-line story); a *What they
  use instead* line in Current shape; a proof-pointer convention (`— EVID-NNN` / `— DEC-NNN` /
  `— belief`); voice samples under *How it sounds*; `## Origin, as it happened`; `voice:` and
  `shape:` rows in the learned log, with the why.
- **A2 · `/canvas`**: after the Story cell, offer the one-line story, written to BRAND.md `story:`.
  If no BRAND.md exists, seed it nascent from People and Promises, so **the brand starts at the
  canvas, not the first page**.
- **B · the weave** (`src/playbook.js` + tests + the Kettlewick records in the same commit): rows 1–8
  of the table above.
- **Later:** `/close` offers the why again; `/evidence` marks echoes; then decide on the conscience.

### Earlier slice list (kept for reference; phases 3–4 of the order above)

1. **The conscience says the why back, in the founder's own words, when it matters.** When a drift
   or focus moment fires and an intent exists, the frame may quote their sentence once (*"you said
   you're building this because…"*) instead of a generic nudge. It stays at most once per session
   and is never added to every moment. The change goes in `moment-frames.js`: the intent goes from
   *calibrate the ask* to *calibrate, and may be quoted*. Locked by a test, with the voicing rule
   (IDEA-123: length proportional to the stakes).
2. **"Still true?", rarely, and the answer is recorded.** At `/close`, on a slow cadence (a
   `why_checked:` date, say every ~30 days, which is Ajesh's number to set), one line: *"you started
   this because X. Still true?"* *Yes* restamps the date. A change appends a dated `— why: …` line
   to the venture IDEA's capture log (the format `/boss` already writes) and updates the field. *Not
   any more* is a real answer, and `/sunset` exists for it.
3. **The brand points back at the why.** BRAND.md's *What it promises* gets a pointer to the part of
   the why it serves. When `/evidence` hears a customer echo the founder's why, the learned row says
   so. **Those echoes are the lines worth putting on the website**, and they are the honest answer to
   "does this help marketing".
4. **The playbook opens with the heart:** the three lines, in the founder's words, dated, with the
   why's history (the dated `why:` lines) beneath. That is the story chapter, re-grounded: its first
   beat is the founder's real reason and its turns are the why changing. The prototype's panels and
   strip become this chapter's lower half.
5. **Later, gated:** a DEC naming which part of the why it serves. This is the essay's "a belief
   becomes a product decision". It's a new field, so hold it until a founder asks how their choices
   connect.

### The humane line (decide before building)
- **Remind, never push.** "Remember your why" can turn into guilt, or into a sunk-cost voice that
  keeps someone going after the reason has gone. The why is free to deepen, change or end, and every
  surface says so. The conscience never uses the why to argue against stopping (it already never
  suggests quitting; it must not argue against it either).
- **Their words only.** Never paraphrase, summarise or "sharpen" the why. If they skipped it, BOSS
  says nothing (the `/boss` rule: a motivation nobody wrote is a small fabrication).
- **Rarely.** A why quoted every session becomes wallpaper, then nagging.

### Open questions (Ajesh's)
1. Is the cadence for "still true?" a date (≈30 days), an event (a mode unlock, a DEC superseded, a
   `/sunset` considered), or both? Recommendation: both, with events first.
2. Should a *changed* why be celebrated, neutral or asked about? Recommendation: neutral and
   recorded. It is the story's most important beat, not a failure.
3. Slice 1 or slice 2 first? Recommendation: slice 1. The data is already on disk and the conscience
   already reads it, so it is one frame change and a test.

---

## Before the re-aim: the story material (kept; now downstream of the why)
_The best articulation so far. Rewrite this as the idea sharpens._

- **What:** The playbook (FEAT-026..029, 036) is an **index of records**: sixteen chapters, each block
  a record. **The story's pieces already exist, scattered:** the canvas **Story** cell (*why now* and
  the smallest compelling workflow), shown in the Problem chapter as `problem-story`; Vision's *why*;
  **"The story so far"** in Learnings (devlog and capture-log lines, newest first, which is a log and
  not a story); and BRAND.md's *The name, and why*. What is missing is narrower than "a story":
  it is the **through-line** that puts these in order. Nothing says *this is why, this is what we found, this is
  where it turned, this is where it's going*. That through-line is what a founder says out loud to a
  cofounder, an investor or a first hire, and it is what their website's About page and the deck's
  opening three slides need. Three moves, none of them a new skill:
  1. **A story the founder writes, on beats BOSS finds.** BOSS reads the dated records and proposes
     the beats: the why (the canvas Problem cell and the founder's *why this one*), the first person
     who said it hurt (the earliest EVID), the turn (a DEC that changed direction, or a superseded
     one), what changed our mind (BRAND.md learned rows, devlog), where it's going (the vision line).
     Each beat has a slot for **one sentence the founder writes** and cites the record it rests on.
     A beat with no record is a hole. A beat with a record but no sentence is a hole too. BOSS never
     writes the sentence.
  2. **The story opens the playbook, and the other formats reuse it.** The story becomes the first
     chapter, ahead of the canvas, and a cut of its own in Present. `/landing` reads it for the About
     section. The copy sheet carries it as plain prose, so it pastes into slides or a doc. It is one
     answer store with several frames (DEC-004, IDEA-063), extended from the canvas to the narrative.
  3. **The brand's own history, shown.** BRAND.md is tracked, so every past version of `## Current
     shape` is already in git. A Brand-chapter block can show how the shape moved, dated: a line
     changed and the learned row or DEC that changed it. *"We evolve, and you still know it is us"*
     becomes something you can read, not a slogan. The history comes from git. No new record.
- **Why:** EVID-001 asked for orientation and progress. A founder's own story, told on dated
  evidence, is progress they can show someone. It is also the playbook doing the job Ajesh originally
  asked of it (IDEA-106: *"easily copy paste stuff into a presentation"*) one level up, as the
  narrative instead of the blocks.
- **What the essay adds, and what it doesn't** (read against BOSS first). **It has nothing on
  narrative** (confirmed by the peer read, bossbuild-1d). The story half of this idea is Ajesh's own,
  and the essay only bears on the brand-evolution half:
  - *"Jazz": one brand across several registers, with clear relationships between them.* **BOSS has
    this for voice only** (`style-guide.md`, "Voice is constant, tone shifts"). Visual registers
    (product UI vs landing vs deck), and what stays fixed across them, have no slot. This is the
    sharpest thing the essay gives BOSS, and it fits the Brand chapter as a block shown *only when
    written*.
  - *Brand as a living body of decisions, versioned.* **Already true of the shape:** BRAND.md has a
    current shape, an append-only learned log and a Decided list of DECs. **Missing:** any view of
    that history (move 3).
  - *Taste stays human, repetition becomes software.* **Already BOSS's rule:** every word on the
    playbook is the founder's, holes render and are never filled. Move 1 keeps it: BOSS finds and
    cites, the founder writes.
  - *One request → HTML, PDF, PowerPoint.* **Partly here:** the playbook page, Present, Export PDF
    and the copy sheet already exist. A `.pptx` writer is not, and it does not belong in `src/`
    (zero-dep). The host's own document/slide capabilities can take the copy sheet. Name that seam;
    don't build it.
  - *A 70% result is worse than none; send unfamiliar problems to a person.* **The same as the
    hole-not-fill rule.** A story BOSS drafted would be exactly the 70% result.
  - *A large in-house team with a Slack agent over all company knowledge.* **Does not transfer.**
    BOSS's founder is one person with a brand that is still forming. Take the mechanism, not the
    scale.

## Expanded after research (2026-10-04)

Three research passes: story structures, visual forms, and how practitioners keep a brand story and
voice alive. Sources, with which ones were actually opened, are in the gitignored session note.
Researchers are cited by name, and no product or vendor is named.

### The story model: a spine, a test per beat, a line on top

- **Skeleton: the Story Spine** (Kenn Adams, 1991; Pixar's rule #4 is a cut-down version that drops
  the last line). *Once upon a time / Every day / But one day / Because of that (repeats) / Until
  finally / And ever since then.* Each repeated *Because of that* is one dated event, which is the
  same shape as a list of decision records. It fits BOSS's records better than any pitch template.
- **The test each beat must pass: challenge → choice → outcome** (Marshall Ganz, *Public Narrative*,
  2008). A challenge can be an EVID, a choice a DEC, an outcome a devlog entry or a learned row.
  Ganz's three levels, *self / us / now*, also suit a company, a co-op or a commons (DEC-011) better
  than an investor deck does.
- **On top: one ABT line** (Randy Olson): *this AND this, BUT the problem is this, THEREFORE we are
  doing this.* The founder writes it. It is the one-sentence summary the cover, the landing hero and
  the first slide all reuse.

| Beat | Spine | Record that can back it | Hole when |
|---|---|---|---|
| Why | Once upon a time / Every day | canvas Problem + the founder's *why this one*; "every day" is strongest from observed-behavior EVID | no Problem cell |
| The first person who said it hurt | But one day | the **earliest** EVID at stated-pain or higher, with date and their words | no EVID |
| The turn | Because of that | a DEC with its date and *why* | no DEC |
| What changed our mind | Because of that (against) | a **superseded** DEC, a contradicting EVID, a learned row | none on record, which is itself worth saying |
| Where it is now | Until finally | only **commitment**-grade EVID or a shipped FEAT | pre-traction, always |
| Where it's going | And ever since then | the founder's vision line, **shown as theirs, as an aspiration** | no vision line |

**The rule that matters most:** the vision line must never fill *Until finally*. An aspiration in an
outcome slot reads as an achievement. "Where it is now" and "Where it's going" are two beats on
purpose.

**Beats that are always holes, because no record can back them.** BOSS shows them as questions or
leaves them out, and never fills them: market size, financials, a five-year plan; *what could be*;
*winners and losers*; a customer quote written in advance (one framework's template asks for a
hypothetical one, and BOSS refuses even a placeholder); feelings; the inference half of *why now*
(a record can supply the dated outside change, but not the conclusion drawn from it).

**Pitch order is a cut, not a second story.** An investor order (purpose, problem, solution, why
now, market, competition, model, team, ask) maps onto the same beats and chapters. Problem and
solution have records behind them, and the rest show as holes, which makes the gaps an investor
would probe visible. This uses Present's existing cuts.

### The visual: a martini glass of comic panels, with a broken line

- **Reject scrollytelling as the main form.** It breaks print and slides, and a missing beat simply
  doesn't scroll by, so the hole disappears.
- **The form: a martini glass** (Segel & Heer, *Narrative Visualization*, 2010). The *stem* is the
  author-driven line (the ABT sentence, then the beats in order). The *mouth* is the reader opening
  the evidence beneath each beat (`<details>`, expanded in print).
- **Beats as comic panels** (Bach et al., *Design Patterns for Data Comics*, 2018: exposé,
  time-sequence, flashback, the larger picture). A panel is a slide and a grid is a printed page.
  **An empty panel with a dashed border reads as "nothing here"**, which is BOSS's hole convention
  already.
- **A timeline strip across the top that never draws a line through a hole.** Interpolation raises
  viewer confidence (Song & Szafir, 2018). Applying that to story beats is an extrapolation, but a
  safe one.
- **"How the shape changed" as a stacked diff**, newest first. Each change carries a cause chip (the
  learned row or DEC), or a dashed *cause unrecorded* chip. **The original sits verbatim at the
  bottom**, so the reader can judge the drift, the way an annual letter that reprints its first
  letter does.
- Print: `break-inside: avoid` per panel, a page per beat in the deck cut.

### The brand doc: five additions, all small, all fillable from evidence

The research's strongest warning is that **origin stories get checked**. The garage-founder legend
"obtains its staying power not from its accuracy" (Audia & Rider, 2005). Well-known origin myths
were later admitted to be marketing. Readers who find a contradiction feel betrayed. So:

1. **What they use instead today.** This is different from *What it is NOT* (what people mistake
   you for). It is the first step of a positioning sequence (April Dunford) and comes straight from
   `/interview`, so it can be filled honestly on day one. *(Kettlewick: the phone tree, the
   spreadsheet.)*
2. **A proof pointer on every Current-shape line:** an EVID, a DEC, a learned-row date, or the word
   `belief`. This lets the site, the deck and the story **copy only the lines that have a record
   behind them**, and show the beliefs as beliefs. It is the "proof foundation" idea, without
   building pillars on top of it.
3. **`## Origin, as it happened`:** dated, plain, the honest motive. The rule: *nothing here that a
   witness would dispute.* This is where the story's *Once upon a time* gets its founder sentence.
4. **Voice samples:** two or three real sentences under *How it sounds* (ideally ones that drew a
   reaction), plus one line for a hard moment (an error, asking for money). Traits alone don't carry
   a voice; public voice-and-tone guides teach by example.
5. **Voice evolution as a row, not a document.** When a trait changes, append a learned row tagged
   `voice:` *with the why* (`2026-11-02 | two users read the jokes as not taking their data
   seriously | voice: plain over playful (was: playful)`) and mark the trait `(since 2026-11-02)`.
   Public style guides' change logs record what changed but never why; the why is the brand. The
   playbook filters `voice:` rows into the history. This also settles move 3's trap: **brand history
   is dated by its rows, not by git.**

**Refused at this stage** (each one asks a founder at n≈0 to invent): the brand onion, pyramid,
essence and archetypes; market category and the "only we…" sentence as *fields* (fine as a question
asked, never as a blank to fill; positioning before product-market fit is itself contested); a
three-pillar message house before there is proof; mission and vision *statements* and a polished
founder story; a tone matrix per context; a guidelines PDF (the brand doc already refuses this).

## Build steps (proposed, smallest first; each a commit and a CHANGELOG bullet)

1. **Prototype first, no code in `src/`.** A hand-built Story chapter on Kettlewick's real records
   (ABT line, timeline strip, six panels, a dashed hole, the shape history) for Ajesh to react to.
   This follows the site-lift rule: show a mock before asking.
2. **Brand doc template: additions 1–5** (`brand-doc.md`, text only) and **Kettlewick's BRAND.md
   gets them in the same commit** (FEAT-039's standing rule). No renderer change. This one is
   useful even if nothing else ships.
3. **The beats reader** in `src/playbook.js`: pure projection over the canvas, EVID, DEC, FEAT,
   devlog and BRAND.md. It returns six beats, each `{record, date, founderLine | hole}`. Tested on
   Kettlewick and on an empty tree, where every beat is a hole and the chapter says so plainly.
4. **The Story chapter renders**, first in the rail (before Vision): the ABT line, strip, panels,
   holes. The cover reuses the ABT line. `check:demo` stays green.
5. **Where the founder writes:** `/close` 3d already notices what the founder said that no record
   holds. It learns to offer *"that sounds like your story's turn — want it in Origin?"* No new
   skill.
6. **Shape and voice history:** a block in the Brand chapter, built from learned rows and DECs
   (never git), with the original shape verbatim at the bottom.
7. **Reuse:** a Story cut in Present; the copy sheet carries the story as plain prose; `/landing`
   reads the ABT line and Origin for its hero and About sections, with **only the proof-pointed
   lines** used as claims.
8. **Later, gated:** the visual-registers slot (the "jazz" one) once a founder has two surfaces; a
   voice check on downstream copy once a bug reaches a user.

## Refusals, up front
- **BOSS never writes the story's sentences, and never "polishes" the founder's.** It proposes beats
  and cites records. A generated origin story is fabrication with good typography, and it is the
  first thing an investor reads.
- **No brand-guidelines PDF and no voice generator.** The brand doc's own rule: nascent stays
  nascent.
- **No `.pptx`/`.docx` writer in `src/`.** Zero-dep. The copy sheet and the host's own slide
  capability are the route.
- **No new skill** (compose and subtract). The beats are a reader in `src/playbook.js`. Prompting the
  founder for a sentence fits `/canvas` or `/close` 3d, which already notice what no record holds.

## Open questions (Ajesh's)
1. **Where do the sentences live?** A `## The story` section on BRAND.md (the brand doc says brand is
   upstream of marketing, and the story is upstream of both), or on the venture IDEA (`kind:
   venture`), which is the record of *this venture*? This question decides whether the story belongs
   to the brand or to the company.
2. **Is one story enough, or does each audience get its own cut** (investor / first hire / customer),
   the way Present has VC / Internal / All? Recommendation: one story, cut by which beats show,
   never rewritten per audience.
3. **Move 3's unit:** a diff of each `## Current shape` line, or only the lines a learned row or DEC
   explains? Recommendation: only the explained ones. An unexplained change is noise.
4. **Voice evolution** — Ajesh named it, and none of the three moves covers it. *How it sounds*
   changing over time is the same history as move 3. Checking downstream copy against it (the
   essay's "evaluated") is a new check, and this repo's rule is that a new check needs a bug that
   reached a user first. Hold it until there is one. Related, noted by the peer and not earned yet:
   no hook reads BRAND.md, so *What it refuses* and the learned log only reach the work when a skill
   happens to run.

## Gate
n=0 founders have asked for the story. All three moves are renders over records founders already
make. Move 3 needs no founder input at all. Suggested first slice: **move 3 alone**, which is pure
projection and can be demonstrated on Kettlewick (FEAT-039 standing rule: a new chapter adds its demo
record in the same commit). Then the beats reader, with holes.

**Open questions, revised after the research.** Q1 now has a likely answer: the founder's sentences
live in BRAND.md's new `## Origin, as it happened` and on each beat's own record, and the ABT line
sits in BRAND.md frontmatter beside `tagline`. Ajesh confirms or overrules. Q3 is answered: history
is dated by rows, not git. Q2 and Q4 stand.

## Capture log
- 2026-10-04 — captured from Ajesh's message and the essay. A peer window is exploring brand
  development: link to its record when it lands, and don't run two copies.
- 2026-10-04 — the peer (bossbuild-1d, IDEA-132) confirmed the lane and shared its read. Folded in:
  the Story cell and "The story so far" already exist, so the gap is the through-line; the essay has
  no narrative content; the jazz/registers slot; the BRAND.md-unread gap stays a note.
- 2026-10-04 — **Trap in move 3: git history is the editors' history, not the brand's.** In
  `demo/kettlewick/docs/BRAND.md` the commits are ours ("warmer palette", "'rota' swept"). They are
  BOSS editing a fixture. In a founder's repo the same holds for typo fixes and agent reformatting.
  So the dates on a diff are not dates of brand change. Options: (a) only show changes explained
  by a learned row or DEC, and date them by *that* record; (b) an append-only `shape changed` row
  in the learned log, written when the shape is rewritten. (a) needs no new writing. Either way, the
  demo must not render its own git history as Kettlewick's brand history.
- 2026-10-04 — **Kettlewick already has a full arc in dated records**, a ready test case for the
  beats: EVID-001 stated pain (05-20) → EVID-002 "the hour she hates most" (06-04) → DEC-001
  office-first (06-14, **superseded**) → DEC-002 phone-first (07-02, *the turn*) → DEC-003 the
  refusal (07-20) → EVID-003 observed (08-30) → EVID-004 commitment (09-05). The evidence ladder
  climbing over time is a story shape in itself.
- 2026-10-04 — research (three passes) folded in above: story model, visual form, brand-doc
  additions, refusals, eight build steps. **Step 1 done:** a hand-built prototype on Kettlewick's
  records (private artifact https://claude.ai/artifact/VneRpFSPLv7xRkZijEMWzR; source in the
  session scratchpad, not the repo). The ABT line and three founder lines in it are demo fixtures,
  labelled as such. **Waiting on Ajesh's reaction** before step 2.
- 2026-10-04 — **Ajesh on the prototype:** *"whats the point of this. like what does it achieve. also
  when we think of marketing brand development, does this help. I also think about how on the other
  end.. reminding entrepreneurs the strong why of why are they building it, what is their vision,
  what is the problem they are solving for, and staying grounded in the heart of their why"*.
  **Honest answer: the prototype displays the record after the fact.** It serves the rare "show
  someone" moment, and it does little for brand development, which is about *finding* the words that
  land, not displaying them. **The gap he names is real, and it's verified:** `/boss` §3.5 asks the
  why once (`motivation:`, `success_looks_like:`, `in_a_few_years:`, verbatim). After that, the why
  reaches the conscience **only to calibrate the ask** (`moment-frames.js`, "Calibrate the ASK to it,
  not the tone"). `in_a_few_years` is read by the playbook alone, and `orientation.js` prints the
  enum. **The founder never hears their own why again**, and nothing lets it grow or change.
  (Prototype **v2** published to the same URL on 2026-10-04: story first, with a Day one ↔ Today
  toggle. There are no invented sentences; every beat is a record's own line. The false
  "where it goes" hole is fixed. **Open for Ajesh:** v2 quotes learned rows, which reverses
  FEAT-036's *counted, never quoted* rule.)
  Proposed re-aim: the why is the root; the brand's promise, the marketing words and the story are
  downstream of it. See *Re-aim* below once Ajesh picks the job.
