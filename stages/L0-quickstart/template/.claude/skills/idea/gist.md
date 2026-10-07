## `gist` mode — write the line the board shows

`/idea gist <ID>` (or `/idea gist` for every record that needs one).

**Why this is a skill and not a CLI flag.** `boss board` is zero-dependency and deterministic: it
renders what is in the file. It cannot *write* a sentence. So the crafting happens once, here, and
gets stored in `gist:` — which also makes it better than generating it on every render, because a
stored line is reviewable, stable, and commits with the record instead of quietly changing.

**Find the work:** `boss records --gists` lists every IDEA and FEAT whose board line was never
chosen — no `gist:` at all (so the board falls back to whatever sentence opened the file), or a
`gist:` that still reads as a paragraph and gets cut mid-thought.

**How to write one.** Read the record **whole** — the title, the current shape, the capture log, the
proof note, the arguments against. Then write ONE sentence that carries **what the thing is and why
it matters**, in the founder's own words wherever they exist. This is not a summary of the document
and not its first sentence; those are what the board already falls back to, and the reason this mode
exists is that they are usually wrong.

Aim for **under 180 characters** so it survives the board's clip with room to spare.

The test: **six weeks from now, opening the board and remembering nothing, does this line bring the
idea back?** A name does not. A category does not.

- ✅ *"A way to point BOSS at a doc you already jotted the idea in, instead of retyping it."*
- ❌ *"An import feature."* — a category, not the thing.
- ❌ *"This record explores the possibility of importing existing material."* — describes the
  record, not the idea.
- ✅ *"The ladder shows four station names and never where you are inside one — day 1 and day 40
  look identical."* — the defect, in one breath.
- ❌ *"Position within the rung."* — that is the title. A gist that restates the title is a wasted
  line.

**Rules.**
- **Never invent.** If the record does not say why it matters, say what it is and stop. A gist that
  asserts a motivation nobody wrote is a small fabrication in the one field built to be trusted.
- **Show it before you save it**, and take their edit — it is their idea and their words.
- **One sentence.** Two is a paragraph; the board renders the first and drops the rest, so the
  second one is invisible work.
- **Never touch anything else in the record.** This mode writes exactly one field.
- **Use the folded form for nothing.** Write `gist: <one line>` inline. (A folded `gist: >` is
  legal and parses correctly, but a one-line value has no reason to be a block.)
