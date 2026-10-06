# `/spec` — name the flow, cut a step (bundled resource)

> Loaded **on demand** from `SKILL.md`, at step 7b, only when this FEAT has a user-facing surface.

Step 4 of `/spec` asked which paths must not break. This asks the question upstream of it: **is
this sequence right at all?**

It is a step and not a review because it is the one design judgment a review structurally cannot
give you. An AI design review reliably improves feedback and scannability and moves **flow
efficiency by almost nothing** — whether two screens should be one, whether the person should have
been asked this at all, survives the review intact. **No amount of checking produces a flow nobody
designed.** So it gets decided here, while the FEAT is still prose and changing it is free.

In the record's **Flow** section, write:

- **The steps, each with what it asks the user for and why it is needed *now*.** One line each.
- **The cut.** *A step that cannot say why it is needed now is the step to cut.* Cut at least one
  or say plainly that you tried and every step held — that sentence is a real answer, and it is
  different from not having looked. *"We need company size for pricing tiers"* is a reason to
  collect it eventually; it is not a reason to ask before they have seen the product work.
  **Keep the cut rows** — a question you decided not to ask is the decision most likely to be
  silently reversed by someone who assumes it was an oversight.
- **Three paths, not one.** The happy path, the **first-run path** (the same flow when the user
  has nothing — almost always the one that ships broken, because the builder never sees it after
  day one), and the **failure path** (a step can't complete: where do they land, what do they
  still have, can they get back in). This is the five-state requirement raised one level.

Then add one row to **`docs/design/FLOWS.md`** — name, entry, step count, where it ends, which
FEAT owns it. Create it from [`flow-index.md`](flow-index.md) if it isn't
there. **The index, not a second copy**: two copies of a flow diverge, and the one people read is
never the one that got updated. Read it first — a new flow composes with the ones already there
rather than inventing a second navigation model.

Then, **the first time** a flow is written and **only then**, create
`docs/product/JOURNEY.md` from [`journey-map.md`](journey-map.md) — the tier
above the flow index, and one page for the whole product rather than a section per feature.
Afterwards just check it: does this FEAT's flow serve a stage that's already on the map, or does
it add one?

**Why a second file and not a heading in `FLOWS.md`.** The flow index holds in-app sequences, and
it is structurally unable to hold the two places users are most often lost: **before they sign
up**, and **after they have succeeded once and are deciding whether you are part of their week.**
Three skills are already standing on different parts of that arc — `/landing`, `/onboard`,
`/health` — and until this file exists none of them shares a map, which is how a
product ends up with a good landing page, a good first run, and nobody in week three.

Two things make it worth the ten minutes, and neither is the table itself:

- **The gaps section.** The stages with no serving flow and no FEAT that owns them. That list is
  the output; a journey where every stage is covered is either a finished product or a map drawn
  to look tidy.
- **The edge users.** Not edge *cases* — the three paths above already own those. **People** the
  happy journey assumes away: the user with no data, the user with ten thousand rows, the person
  who is not the buyer, someone on a screen reader, someone acting in bad faith. Name the ones
  that are real here and delete the rest.

⚠️ **Label every stage `observed` / `said` / `assumed`.** Most start assumed and that is fine. An
assumed row that stops being labelled becomes "research" in about six weeks — to you as much as
to anyone else — and a journey map invented at a desk is more dangerous than none, because it
looks like it came from somewhere.

**Skip all of this for a FEAT with no surface.** A background job has no flow, and asking for one
is the ceremony PRINCIPLE #2 refuses.
