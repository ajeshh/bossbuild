# `/scout sort` — file what you were handed where it belongs

Read after `/inbox` brings something in, or on any file the founder names. The routing table is in
`SKILL.md` (what kind of thing it is → where it goes); this is how the two most common routes run —
the founder's own idea material, and the questions a document can answer.

**Mark it sorted when you're done** — in `docs/source/.inbox.json`, keyed by the copy's name exactly as it sits in `docs/source/`,
date prefix included (`2026-10-07-deck.pdf`, not `deck.pdf`):
`{ "<file>": { "sorted": "YYYY-MM-DD", "to": "<where it went>", "kind": "<what it was>" } }`.
`kind` is one of `idea`, `rivals`, `market`, `evidence`, `claim`, `technical`, `legal`, `hr`,
`reference`. A `legal` or `hr` item with no home yet gets its `kind` and **no** `sorted` — it is held,
and `boss inbox` lists it as held. Never move the file.

## 1. Your own idea material — fold it into the idea

- **Adding to an existing idea** (`IDEA-NNN` named, or only one idea exists): append a dated entry to
  that idea's capture log noting what you pulled in and the 1-2 lines it changes about the idea's shape.
  Update the "current shape" at the top if the new material genuinely sharpens or shifts it. Reference
  the snapshot paths under `docs/source/`.
- **No idea yet** (a fresh project, founder ran `/inbox` instead of `/boss`): this is really spin-up —
  hand off to `/boss`'s shaping. Read all sources, get the number with `boss id IDEA`, then create
  `docs/ideas/IDEA-NNN-<slug>.md` seeded from the material — **in `/boss` step 3's living-doc shape**
  (`owner: product-lead`, `status: seedling`, a `gist:`, and a dated `Capture log` bullet). The dated
  bullet is not optional: without it the idea is invisible to `capture-loop` and the conscience never
  comes back to it. Don't make the founder run a second command to see their idea captured.

## 2. Assess — what else this fills

The idea doc got its entry. Now the rest: a source usually answers questions the idea doc doesn't
hold. Read `boss playbook --questions` (the open holes, each with the verb that fills it), then
read the source against that list and say, in **at most five lines**, what it could fill — the
record, the specific bit, where it came from:

> This speaks to three open questions —
> · **People** (canvas): a count — *"6,400 registered agencies"*, p.4 · write it in with the source?
> · **Competition**: two rivals named — Shiftwise, Coverly · add them to the table?
> · **Brand**: a tagline on the cover · set it as `tagline:`?
> Two things it says have no record in BOSS yet (who is on the team; money raised so far) — I've
> left those. Yes to any of the three?

Then, for each **yes**, write the record **in the owning verb's shape** — never a new shape:
- a persona line → `/persona`'s six fields (`who`, `context`, …); enrich the existing file if one
  exists, never a second persona for the same person.
- a rival → a row in `docs/competition/README.md` and its `docs/competition/<slug>.md`, in
  `/scout market`'s columns, with today as the `checked` date.
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
- **Five lines for everything brought in this turn — not per file — then stop.** More than that is the questionnaire this skill exists to avoid. What
  has no record yet — a bio, prior capital, the five-year line — is named as *no record holds this
  yet* and left; don't invent a home for it.

If the source fills nothing beyond the idea doc, skip this step without ceremony.

## 3. Wrap up — and point at the next step

No receipt of what was saved. Say only what they need: anything you couldn't read or skipped, and
why; which idea it went into if that isn't obvious (by what it is, the `IDEA-NNN` alongside). **End with the single next step** — usually `/canvas <IDEA-NNN>` if the
idea now has legs, or "keep adding with `/idea` or `/inbox`" if it's still forming. Close on the
action, not the recap.
