---
name: import
description: Bring existing material in — a file, a folder, a URL, or text you paste. BOSS keeps a dated copy in docs/source/, folds it into your idea, then says what else it could fill (a count, a rival, a tagline, a persona line) and writes each record only when you say yes. Any time, not just at spin-up. Usage - /import <path-or-url | pasted text> [more] [IDEA-NNN]
---

# /import — bring your own material in

The idea you're building usually exists *before* the project folder does — in a doc, a note-taking
app, a PDF, a deck, a link. This skill is the on-ramp: **point at it, BOSS pulls it in.** No
retyping, no "where do I even put this."

This is the deliberate, add-material counterpart to `/boss` (which ingests during first spin-up).
Run `/import` anytime — including well after the idea is captured — to add more sources to it.

It is also the door for everything the playbook is missing. `boss playbook` draws every record
you haven't written as a hole with a question; a deck or a report usually answers several of them
at once. This skill reads what you dropped, names which holes it could fill, and fills the ones you
say yes to — in the shape the owning verb would have written. **Notice passively; write explicitly;
never invent.**

## 0. Orient (silent)

Read, in order:
- `.boss/manifest.json` — current stage.
- `docs/ideas/` and `docs/IDS.md` — existing ideas + the next free `IDEA-NNN` (read the files).
- If the founder named an `IDEA-NNN`, read that idea doc — you're adding to it, not starting over.

Don't announce these reads.

## 1. Collect the sources

Take everything the founder pointed at — files, folders, URLs, in any mix:
- **Local files** — `.md`, `.txt`, `.pdf` (read it), `.docx` (extract the text), notes from a
  note-taking app, slide decks. Read each.
- **A folder** — read the text-bearing files in it; don't recurse into binaries you can't parse.
- **URLs** — a shared-doc link, a published page, a reference. Fetch each.
- **Pasted text** — the founder typed or pasted it into chat: *"here's everything I know about my
  company"*, three paragraphs, a list of rivals, notes from a meeting. That is a source too. Read it
  as you would a file; it gets no `docs/source/` copy (it's already in the founder's words, in the
  chat) unless it is long enough to lose — then save it as `docs/source/<date>-notes.md`.
- **Nothing given** — ask once: *"Point me at what you've got — a file path, a folder, a URL, or just
  paste it. I'll pull it in."*

If a source can't be read (image-only PDF, an auth-walled link, an unsupported binary), **say so plainly
and skip it** — don't guess at its contents. Name what you skipped and why.

## 2. Snapshot — the project owns a copy

For each source you successfully read, write a durable copy into `docs/source/` (create the folder if
absent):
- **A file** → `docs/source/<YYYY-MM-DD>-<original-filename>` (copy it in; today's date in front).
- **A URL** → `docs/source/<YYYY-MM-DD>-<slug>.md` with the source URL on the first line, then the
  fetched text.

The date is part of the name on purpose: a figure from March is not a fact about today, and the
playbook shows the date beside the file. A founder can also copy files into `docs/source/` by hand
(the folder's README says so) — running `/import` on a file already there is how it gets read in.

This is the "create a dupe" the founder asked for: the idea survives if the original moves, changes, or
goes offline. **Snapshot first, interpret second** — don't paraphrase away the source.

## 3. Fold into the idea

- **Adding to an existing idea** (`IDEA-NNN` named, or only one idea exists): append a dated entry to
  that idea's capture log noting what you pulled in and the 1-2 lines it changes about the idea's shape.
  Update the "current shape" at the top if the new material genuinely sharpens or shifts it. Reference
  the snapshot paths under `docs/source/`.
- **No idea yet** (a fresh project, founder ran `/import` instead of `/boss`): this is really spin-up —
  hand off to `/boss`'s shaping. Read all sources, get the number with `boss id IDEA`, then create
  `docs/ideas/IDEA-NNN-<slug>.md` seeded from the material — **in `/boss` step 3's living-doc shape**
  (`owner: product-lead`, `status: seedling`, a `gist:`, and a dated `Capture log` bullet). The dated
  bullet is not optional: without it the idea is invisible to `capture-loop` and the conscience never
  comes back to it. Don't make the founder run a second command to see their idea captured.

## 3b. Assess — what else this fills

The idea doc got its entry. Now the rest: a source usually answers questions the idea doc doesn't
hold. Read `boss playbook --questions` (the open holes, each with the verb that fills it), then
read the source against that list and say, in **at most five lines**, what it could fill — the
record, the specific bit, where it came from:

> This speaks to three open questions —
> · **People** (canvas): a count — *"6,400 registered agencies"*, p.4 · write it in with the source?
> · **Competition**: two rivals named — Rotawise, CareSheet · add them to the table?
> · **Brand**: a tagline on the cover · set it as `tagline:`?
> Two things it says have no record in BOSS yet (who is on the team; money raised so far) — I've
> left those. Yes to any of the three?

Then, for each **yes**, write the record **in the owning verb's shape** — never a new shape:
- a persona line → `/persona`'s six fields (`who`, `context`, …); enrich the existing file if one
  exists, never a second persona for the same person.
- a rival → a row in `docs/competition/README.md` and its `docs/competition/<slug>.md`, in
  `/comp-eval`'s columns, with today as the `checked` date.
- a tagline, a colour, a *what it is not* → the matching line in `docs/BRAND.md`.
- a count, a price, a market figure → the canvas cell, written **with its source and date** in the
  cell (*"6,400 registered agencies — <the report>, 2026"*). If there is no canvas yet, it waits for
  `/canvas`; say so.

Four rules keep this honest:
- **A document's number is a claim with a source, never evidence.** It fills a cell; it never becomes
  an `EVID`. Evidence is what a real person said or did (the ladder in `/evidence`).
- **A transcript is someone else's words** — route it to `/evidence`, which grades it; never lift a
  sentence from a transcript into a canvas cell as fact.
- **Nothing is written without a yes**, and a record that already exists is **updated against what
  it holds** (*"People says 6,400; the new deck says 5,900 — update?"*), never overwritten quietly.
- **Five lines, then stop.** More than that is the questionnaire this skill exists to avoid. What
  has no record yet — a bio, prior capital, the five-year line — is named as *no record holds this
  yet* and left; don't invent a home for it.

If the source fills nothing beyond the idea doc, skip this step without ceremony.

## 4. Wrap up — and point at the next step

No receipt of what was saved. Say only what they need: anything you couldn't read or skipped, and
why; which idea it went into if that isn't obvious (by what it is, the `IDEA-NNN` alongside). **End with the single next step** — usually `/canvas <IDEA-NNN>` if the
idea now has legs, or "keep adding with `/idea` or `/import`" if it's still forming. Close on the
action, not the recap.

## Rules

- **Snapshot before interpret.** The project owns a copy of every source you read. Never summarize a
  source away without first saving it.
- **Skip honestly.** If you can't read something, say so and skip it — no hallucinated contents.
- **Don't over-capture.** A pasted one-liner doesn't need a `docs/source/` file; a real document does.
- **One idea, many facets.** Multiple sources for one idea fold into one `IDEA-NNN` — don't spawn an
  idea per file.
- **Capture, don't build.** Like `/boss`, this is intake — don't start implementing the product here.
- **Notice passively, write explicitly, never invent.** Say what a source could fill; write only what
  the founder says yes to, in the shape the owning verb uses.
