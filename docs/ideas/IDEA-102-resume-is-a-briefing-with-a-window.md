---
id: IDEA-102
type: idea
owner: product-lead
status: shipped (v0.318.0 — the 200-line window in `boss status`, the rule in both /close copies, the archive folded into the devlog, the length check in `npm run check`)
gist: docs/RESUME.md is read first every session and reached 737 lines / ~15.6k tokens two days after an archive pass. The concept (a handoff briefing) is right; the design has three defects - it is the only guaranteed-read file so everything leaks into it, its compaction rule has no number and no runner, and it is a rewrite-shaped file being append-written with facts a command computes. Fix by subtraction, here and in the shipped /close.
proof: src/orientation.js
proof_note: >
  Shipped half - `boss status` prints one line when docs/RESUME.md is past its window (RESUME_WINDOW in
  src/orientation.js), silent otherwise; the /close template (both copies) carries the window rule in
  the file it writes. Own half - docs/RESUME.md under the window, RESUME-ARCHIVE.md retired into the
  devlog, the length check in `npm run check` (check-dogfood) as a hard finding, not a release-time
  advisory.
created: 2026-09-12
relates: IDEA-087, IDEA-077, IDEA-094, RVW-101, EVID-001
---

# IDEA-102 — RESUME is a briefing with a window, and the window is a number

> Seed: Ajesh, 2026-09-12 — *"what is our approach to resume? is it the right way? i feel like we are
> often adding random things, or hitting the max and it needs pruning."* Then: *"file, and then lets fix
> both for here and in app."*

## What was measured (2026-09-12, v0.317.0)

- **737 lines / 62.5 KB / ~15.6k tokens**, read first every session by rule (CLAUDE.md rule 1). The
  release gate's threshold is ~400 lines; it flagged 671 on 2026-09-10, an archive pass ran, and two
  days later the file was 737. The check is a *report, not a gate* (`release.js` §7), and it lives in
  `npm run release`, which the file itself notes nobody runs — the v0.314.0 pattern (*a gate in the
  wrong loop is a gate on paper*), applied to this file.
- The `updated:` frontmatter field alone was **5.5 KB** — 51 lines narrating ten releases and a lifted
  npm hold, in a field that should hold a date.
- It said *"briefing, not a log"* **three times** and was structured as a stack of dated
  `## State (shipped, vX → vY)` sections — a log. 58 distinct version strings, 38 record ids.
- The State sections were **out of order** (09-10, 09-10, 09-09, *"older windows archived"*, then
  09-11, 09-12, 09-12 below the marker).
- **npm's version was stated seven times and disagreed with itself** (0.268 · 0.295 · 0.306 · "ten
  unpublished"). Not carelessness: the file is gitignored, written by concurrent sessions, and holds
  facts `npm run check:published` computes in one line.
- `docs/devlog.md` — the append-only history `/log` feeds, and the file the shipped re-entry read
  (`boss status`, the `reentry` hook) actually parses — was **161 lines / 12 KB**. The narrative went
  into RESUME instead.

## The diagnosis

The concept is right and sourced (`harness-engineering.md` names it the harness's memory; Anthropic's
compaction pattern says the same). The design was wrong in three ways, none of them discipline:

1. **RESUME is the only file guaranteed to be read, so it is a magnet.** Three kinds of content had no
   read-every-session home and leaked in: incidents (durable lessons), standing operating rules
   (concurrent sessions, versions-are-floors, never-open-for-write-before-reading), and per-session
   narrative. None of that is state. The same disease is visible in the auto-memory index, whose
   "one-line pointers" run six lines each — any guaranteed-read file becomes a magnet unless something
   drains it.
2. **The compaction rule was never written into the file.** BOSS's own shipped practice
   (`context-discipline.md`, *Session-state docs*) says: write the rule into the file — the window as
   a **number**, where the rest goes, what stays canonical. RESUME's header stated the second and third
   and never the first. So every split happened under pressure, which is how the archive was destroyed
   once and how sections arrived out of order. The practice states an intent BOSS's own file did not
   keep.
3. **A rewrite-shaped file being append-written, holding facts that go stale in minutes.** `/close`
   says *rewrite, don't append* and *under a page*; sessions appended. Version numbers, test counts and
   npm lag are computed by `npm run check` and `boss status`; writing them down manufactures staleness.

## The fix — subtraction, both altitudes

**Here (BOSS's own tree):**
- RESUME rewritten to a fixed skeleton with **no dated State stack**: ground truth (commands, no
  numbers) · now (in flight, uncommitted) · next (≤5, ordered) · waiting on Ajesh (one line + pointer
  each) · held (one line + re-open condition) · the evergreen prompt. Window rule in the header.
- Per-session narrative → `docs/devlog.md`, **moved in full** (the State sections and the whole of
  `RESUME-ARCHIVE.md`, verbatim, dated). `RESUME-ARCHIVE.md` retired: a gitignored single-copy graveyard
  that was destroyed once, duplicating what devlog + CHANGELOG hold. Two history files is one too many.
- Incidents + standing operating rules → `CLAUDE.md` working rules (read first; gitignored here — that
  is IDEA-087's door, not this one's).
- The length check moves into `npm run check` (`check-dogfood`, hard finding at the window) and out of
  `release.js`'s advisory.
- `registry/dogfood.json`: `docs/devlog.md` was `exempt` as *"substituted by RESUME"* — written before
  the devlog existed. Now `exercised`.

**In app (shipped):**
- `/close` (both copies): step 2 carries the window as a number; the RESUME template it writes carries
  the rule in its own header; *"under a page"* becomes *"under the window — move, don't trim"*.
- `boss status` prints **one line** when `docs/RESUME.md` is past the window, silent below it. A
  composition on the surface where *where am I* is already asked; no new verb, no hook, no count that
  can only go up.
- `context-discipline.md`: the dogfood paragraph gains the number it learned.

## Found while building

- **The shipped re-entry parser could not read the devlog BOSS was writing.** `readDevlogHead`
  (`reentry.js`) accepted only a bare `## YYYY-MM-DD` heading; four of BOSS's six entries carried a
  suffix (`## 2026-09-12 (later — …)`), so `boss status` in this tree said *"Back after 23 days"* and
  quoted the 08-21 session. The home history is being moved into had one runner, and it was blind to
  the convention in use. Fixed in the shipped lib (date first, anything after), with a test. Founders
  would have hit this the first time they titled an entry.

## Not done, and why

- Un-ignoring `docs/RESUME.md`, `devlog.md`, `CLAUDE.md` — IDEA-087, a one-way door, Ajesh's.
- A `SessionStart` hook that prints the window line — the `reentry` hook only fires after three days
  away, and a line at every start is the over-fire the conscience refuses. `boss status` is enough.
- Trimming the auto-memory index — named as the same pattern; a different file, a different session.

## Log

- 2026-09-12 — filed and built the same session (v0.318.0). Before: 737 lines. After: see the devlog
  entry for the number.
