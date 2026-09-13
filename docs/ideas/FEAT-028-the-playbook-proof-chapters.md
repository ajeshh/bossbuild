---
id: FEAT-028
type: feature
owner: product-lead
status: shipped (under Unreleased, 2026-09-13)
shipped_on: 2026-09-13
gist: `boss playbook` grows the Proof group — Evidence · Learnings · Decisions · Risks & harms · Health — each a projection over a record that exists (EVID frontmatter and title lines, the devlog, DEC records, the Risks cell with the trust page, the newest HEALTH file), never a quote from a real person. First commit adopts the shared page shell so the playbook and the design space are one chrome.
for: the same founder as FEAT-026 — six folders of records, a room that asks "and how do you know?"
created: 2026-09-13
from: IDEA-106
program: business-profile
relates: FEAT-026, FEAT-027, FEAT-030, DEC-004, DEC-008, IDEA-111
---

# The playbook, slice 3 — the Proof chapters

The third of four slices named in [FEAT-026](FEAT-026-the-playbook-render.md) (the number was
reserved there; `boss id` skips it for that reason). Same renderer, same file, same rules: no
composed sentence, a hole is a hole, numbers are counted. **This FEAT closes at the five chapters
below plus the shell adoption.** The deck with profiles is FEAT-029.

## Goal
After the pitch a stranger asks *"and how do you know?"* — this group answers from the records: the
signals on the ladder with their grades and dates, the story so far as the founder logged it, the
decisions with their falsifiers, the harms named and the trust page, and a health read once there
is anything to read. A room sees what backs the pitch and, just as plainly, what doesn't yet.

## Assumptions (the plan-time record)
- **Assumed:** commit 1 adopts `src/page-shell.js` (FEAT-030's): the top bar with the family bar,
  the rail, the block anatomy, Link · Copy and the **copy sheet** replace the playbook's toast — one
  behaviour across spaces. The Humane ⇄ Lean toggle moves from the top bar to the canvas chapter's
  frame bar; the open-questions line moves into the ledger. Slide + the deck stay in the playbook's
  `extraJs`. Not byte-identical (the family bar is new) — the tests are the contract → _confirmed (2026-09-13)_
- **Assumed:** Evidence = every `docs/evidence/EVID-*.md` as one row on the ladder — id, date,
  grade, method, the **title line** (`# EVID-NNN — …`, the founder's own summary), the
  `assumption:` phrase — grouped by grade, commitment first, newest first within a grade.
  **Never the body and never `source:`** — the body is a real person's words and `source:` can be a
  person's name; this page is built to be pasted into a deck. A three-bar strip counts the grades
  (one hue). None → a hole with `/evidence` → _confirmed (Ajesh, 2026-09-13): title line + grade/date/method/assumption; never the body, never `source:`_
- **Assumed:** Learnings = `docs/devlog.md` entries, newest first, up to eight: the `## <date>`
  heading, the **Landed** line, and the **Surprises / decisions** line when present. The chapter
  line is the newest entry's Landed first sentence. No devlog → a hole with `/log` → _confirmed (2026-09-13)_
- **Assumed:** Decisions = every `docs/decisions/DEC-*.md` as a card: the title line, `created:`,
  `reversibility:` and `decided_by:` as chips, the `## Decision` section's first paragraph, the
  `## Falsifier` first sentence with `revisit_by:` (a passed `revisit_by` with no `outcome:` renders
  `overdue`, counted from the date). A DEC named in another's `supersedes:` renders dimmed with
  *superseded by*. None → a hole with `/decide` → _**corrected (Ajesh, 2026-09-13): devlog + the IDEA docs' capture logs, merged by date** — built the same day_
- **Assumed:** Risks & harms = the Risks & Harms cell (the DEC-004 floor, rendered in the chapter as
  the Problem chapter renders its cell) + *Trust* as `docs/trust/TRUST.md`'s first paragraph when
  it exists, else a hole with `/trust` → _confirmed (2026-09-13)_
- **Assumed:** Health = the newest `docs/health/HEALTH-*.md` — its date from the filename and its
  first paragraph (a dated verdict, in the skill's own words) — plus the newest
  `docs/measure/MEASURE-*.md` named the same way; with neither, the chapter is **dormant, not a
  hole**: *live once there are users to read* — `/measure` picks the metric, `/health` reads the
  curve (Ajesh's ruling: after the first user it is acquisition, retention, and when market signals
  start). No number is computed from either file → _confirmed (Ajesh, 2026-09-13): dormant with its condition, not counted as open_
- **Assumed:** the rail gains a **Proof** group (five entries, 9–13) and marks a chapter with
  nothing under it with the shell's `hole-link` style → _confirmed (2026-09-13)_
- **Assumed:** BOSS's own EVID files carry the date inside `source:` and no `method:` — the render
  says `undated` / no method chip rather than parsing prose for a date → _confirmed (2026-09-13)_

**Still unknown (didn't guess):** whether a founder's devlog is ever written by hand in a shape
other than `/log`'s (heading + three bold lines) — the parser takes the heading and any `**Landed:**`
/ `**Surprises**` line it finds and renders an entry with only a heading otherwise.

## Acceptance criteria
- [x] Commit 1: the playbook renders through `shellPage`; every FEAT-026/027 test still passes; the
      family bar links to `design.html` / `board.html` only when they exist (dimmed otherwise); the
      copy sheet appears after a copy; the frame toggle works from the canvas chapter; the open
      line is in the ledger.
- [x] Evidence renders one row per EVID with id · date · grade · method · title · assumption; a test
      asserts no EVID body line and no `source:` value appears in the page.
- [x] Learnings renders devlog entries newest first, ≤ 8, heading + Landed + Surprises; the chapter
      line is a substring of the devlog.
- [x] Decisions renders every DEC as a card with the fields above; a passed `revisit_by` without an
      `outcome:` line renders `overdue`; a superseded DEC renders dimmed.
- [x] Risks & harms renders the cell and the trust paragraph or hole; Health renders the newest
      HEALTH/MEASURE first paragraphs or the dormant block with its condition.
- [x] Every chapter line is a substring of a record on disk or absent (the FEAT-027 test extends).
- [x] `boss playbook`'s open-questions list includes the new holes (Evidence, Learnings, Decisions,
      Trust) with their verbs; Health's dormant state is not a question.
- [x] Nothing fetched; one file written; `docs/` byte-identical after a render (extends to
      `docs/evidence`, `docs/decisions`, `docs/health`, `docs/measure`, `docs/trust`, `docs/devlog.md`);
      CHANGELOG bullets under `## Unreleased` (one per commit).

## What "wrong" looks like
- A quote from an EVID body on the page — a real person's words on a shareable copy.
- A health number BOSS computed (a retention %, a curve) — the file's words only.
- A DEC rendered as current when a later one supersedes it.
- A Learnings chapter that reads as BOSS's summary of the devlog rather than the devlog's own lines.
- The playbook and the design space with two different top bars after commit 1.

## Paths that must not break
- **Destructive path:** still one file, `.boss/playbook.html`.
- **Negative path:** the page is local and single-user; the only "who must not see" is the person
  quoted in an EVID body — kept off the page by construction, and by a test.

## Flow
Unchanged: `boss playbook [--open] [--questions]` asks nothing. No row in `docs/design/FLOWS.md`.

## Smoke check
- `/tmp` scaffold with the template canvas, two EVIDs (one `commitment`), a devlog with two entries,
  two DECs (one superseding the other, one with a passed `revisit_by`), no trust or health →
  `boss playbook` exit 0, `grep -c '<section class="chapter"'` = 13, `overdue` once, `superseded`
  once, `dormant` on Health, and `grep` for the EVID body line finds nothing.

## Validated learning
- **Learning hypothesis:** the Proof group is where a founder first notices the ladder — three
  stated-pain rows and no observed behaviour is the page saying *go watch someone*.
- **What result would change the plan:** founders paste the pitch chapters and never the proof
  (the group folds into a ledger line), or ask for the deck first (029 jumps ahead).

## Out of scope
- The deck with profiles, remove-and-restore, Export PDF — FEAT-029.
- Team · Brand · Roadmap · Board chapters (the Company group) — after 029, or never.
- The competition matrix, charts beyond the grade strip, any new record field.

## Notes
- Source: [IDEA-106](IDEA-106-the-playbook-the-venture-rendered.md) §1 (chapters 9–12 + Health as
  a candidate), §5 (honesty), §13 (Ajesh's rulings on Health); [FEAT-030](FEAT-030-the-design-space-render.md)
  for the shell.
- Out of the agent's authority: adding a field to any shipped template; reading `docs/evidence/`
  bodies for anything but the title line; writing outside `.boss/`; editing `src/page-shell.js`
  (the design lane's — an additive change is theirs to make).
- What Ajesh verifies: the Proof group reads as an honest answer to *how do you know?* on a real
  project; the copy sheet after a copy is welcome and not noise.

## Build log
- 2026-09-13 — Ajesh answered the eight that mattered (two rounds of four). One correction, built
  the same hour: Learnings = devlog + capture logs merged by date (`readLearnings`). Plus the two
  calls: file stays put and prints its URL; `docs/source/` stays and gets a README in the template.
- 2026-09-13 — **landed** (slice 3). Surprise: the peer's in-progress page-shell edit (the `.prompt`
  strip I asked for) briefly broke every render — backticks inside a `String.raw` comment; fixed on
  their side in minutes, a cost of one shared file with two writers. Kept as specced: Health dormant,
  bodies off the page. Not done: the FEAT-027 chapter-line test already covered the new `<h2>`s
  (the corpus is every fixture), so no new line test was needed.
- 2026-09-13 — commit 1 landed: the shell adoption. Not byte-identical, as assumed — the family bar
  and the copy sheet are new, the toast and the hot-reload boot are gone (a file in `.boss/` is never
  live-republished). Found: the shell's copy includes a filled cell's prompt line; asked the design
  lane to strip `.prompt` in the shell's copy (theirs to change).
- 2026-09-13 — specced. Decision: Health is dormant, not a hole, until a HEALTH or MEASURE file
  exists — a hole says *answer this*, and pre-users there is nothing to answer.
