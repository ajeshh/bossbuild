---
name: import
description: Bring existing material into this project — point at a file, a folder, or a URL (Word doc, Google Doc, Obsidian note, PDF, slide deck, online reference) and BOSS pulls a durable copy into docs/source/ and folds it into your idea. Use it during spin-up or anytime later to add to a captured idea. The on-ramp for "I already jotted this somewhere." Usage - /import <path-or-url> [more paths/urls] [IDEA-NNN]
---

# /import — bring your own material in

The idea you're building usually exists *before* the project folder does — in a Word doc, a Google
Doc, an Obsidian vault, a PDF, a deck, a link. This skill is the on-ramp: **point at it, BOSS pulls it
in.** No retyping, no "where do I even put this."

This is the deliberate, add-material counterpart to `/boss` (which ingests during first spin-up).
Run `/import` anytime — including well after the idea is captured — to add more sources to it.

## 0. Orient (silent)

Read, in order:
- `.boss/manifest.json` — current stage.
- `docs/ideas/` and `docs/IDS.md` — existing ideas + the next free `IDEA-NNN` (read the files).
- If the founder named an `IDEA-NNN`, read that idea doc — you're adding to it, not starting over.

Don't announce these reads.

## 1. Collect the sources

Take everything the founder pointed at — files, folders, URLs, in any mix:
- **Local files** — `.md`, `.txt`, `.pdf` (read it), `.docx` (extract the text), Obsidian notes, slide
  decks. Read each.
- **A folder** — read the text-bearing files in it; don't recurse into binaries you can't parse.
- **URLs** — a Google Doc share link, a published page, a reference. Fetch each.
- **Nothing given** — ask once: *"Point me at what you've got — a file path, a folder, or a URL (or a
  few). I'll pull them in."*

If a source can't be read (image-only PDF, an auth-walled link, an unsupported binary), **say so plainly
and skip it** — don't guess at its contents. Name what you skipped and why.

## 2. Snapshot — the project owns a copy

For each source you successfully read, write a durable copy into `docs/source/` (create the folder if
absent):
- **A file** → `docs/source/<original-filename>` (copy it in).
- **A URL** → `docs/source/<slug>.md` with the source URL on the first line, then the fetched text.

This is the "create a dupe" the founder asked for: the idea survives if the original moves, changes, or
goes offline. **Snapshot first, interpret second** — don't paraphrase away the source.

## 3. Fold into the idea

- **Adding to an existing idea** (`IDEA-NNN` named, or only one idea exists): append a dated entry to
  that idea's capture log noting what you pulled in and the 1-2 lines it changes about the idea's shape.
  Update the "current shape" at the top if the new material genuinely sharpens or shifts it. Reference
  the snapshot paths under `docs/source/`.
- **No idea yet** (a fresh project, founder ran `/import` instead of `/boss`): this is really spin-up —
  hand off to `/boss`'s shaping. Read all sources, then create `docs/ideas/IDEA-001-<slug>.md` (frontmatter
  `id`, `type: idea`, `owner: pm`, `status: ready`) seeded from the material. Don't make the founder
  run a second command to see their idea captured.

## 4. Wrap up — and point at the next step

Tight summary: what you pulled in (and into which `IDEA-NNN`), where the copies live (`docs/source/`),
anything you skipped and why. **End with the single next step** — usually `/canvas <IDEA-NNN>` if the
idea now has legs, or "keep adding with `/triage` or `/import`" if it's still forming. Close on the
action, not the recap.

## Rules

- **Snapshot before interpret.** The project owns a copy of every source you read. Never summarize a
  source away without first saving it.
- **Skip honestly.** If you can't read something, say so and skip it — no hallucinated contents.
- **Don't over-capture.** A pasted one-liner doesn't need a `docs/source/` file; a real document does.
- **One idea, many facets.** Multiple sources for one idea fold into one `IDEA-NNN` — don't spawn an
  idea per file.
- **Capture, don't build.** Like `/boss`, this is intake — don't start implementing the product here.
