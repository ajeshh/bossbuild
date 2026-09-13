---
id: IDEA-113
type: idea
owner: designer
status: building
gist: The design space is the decision record made visual — every block traces to a choice the product made — so the team, a designer and the agents build from those choices instead of drifting; it is not a pattern library, and nothing BOSS seeds is ever presented as the product's decision. Families are options BOSS knows about and appear only when the product uses them; the agent is handed the product's OWN decisions at the write; divergence is a number on the page.
created: 2026-09-13
from: IDEA-112
relates: IDEA-107, IDEA-108, FEAT-037
---

# The decision record, not a pattern library

> Ajesh, 2026-09-13: *"boss helps capture and showcase design choices, to make it reusable,
> consistent and continue to support the emergence. the visual html is a showcase of all the design
> decisions it has made so that the team, and agents can keep leveraging it without diverging from
> it. its meant to help scale the org. its not a pattern library. even the components are just
> showing which components are in use to be leveraged."* And: *"the families should only appear when
> there is content in them. like if someone builds for cli, then its different right? its only if
> they use it. we just know the families exist as options in case."*

## The frame, in one paragraph

Every block on `boss design` traces to a choice somebody made — a DEC on a token, a principle the
founder wrote, a pattern the product grew, a reading `/design-review` marked *observed*, an exception
dated, evidence graded. Its job is to let the team, a designer and the agents keep building *from
those choices* — how one person's taste scales to an org without a meeting per screen. Components on
it are **what is in use, so it gets leveraged** rather than re-made. The system *emerges*: the page
shows what has been decided so far, holes for what hasn't, and the moment each hole gets earned.
**BOSS never supplies the choices.**

## What this corrects

- The ten element families (FEAT-037) are **options BOSS knows about**, not content. A CLI has no
  overlays; a print-first product has no toasts. They appear on the page only when the product
  *uses* the family — a decided row of its own, or the family is in the tree with nothing decided
  (a hole: *overlays — in use, nothing decided*). Everything else is one line: *N more families
  exist as options*. `/design-review` seeds a family the first time a screen has it, keyed off the
  product's `shape`; a CLI never gets overlay rows written into its file.
- The seeded rows that do exist in a product's `PATTERNS.md` (*Always*, *If AI-mediated*, a
  family's prompts) are **prompts, not decisions** — rendered quietly, counted separately, and a
  prompt becomes the product's rule only when adopted into *Ours* with a `PAT-n`.
- The ledger counts only the product's own decisions.
- "Patterns as guards" was drifting toward a pattern library — BOSS's seed in the agent's ear.
  Re-aimed: **the guard hands the agent the product's own decisions** — a `PAT-n`, a Do/Don't pair,
  a dated exception at that path — at the moment a write touches their situation. Never a seeded row.

## The plan, in order

| # | Build | Mechanism |
|---|---|---|
| 1 | **Families only when used** | in-use detection from the index, the tree and the usage pages (names: Modal · Toast · Tabs · Checkbox · Banner · Card …); a family renders when it has decided rows or is in use; seeded rows render as prompts under it; the rest is one line |
| 2 | **Seeding keyed off shape** | `/design-review` seeds a family the first time a screen has it, never all ten; the template says so |
| 3 | **`design-decisions-guard`** (opt-in, MVP) | on a component-shaped write: the product's `PAT-n` rows whose situation the write touches, the Do/Don't pair it violates, the exception recorded at this path — three lines, once per file per decision; it logs a line to `.boss/trace.jsonl` so the number below has a source |
| 4 | **The divergence number** | *Kept honest* gains: decisions handed to the agent this week · new components vs. widened · off-decision writes — from the trace; the org-scale signal |
| 5 | The designer's return trip (`boss design --check <exported.json>`) · the eval set against the product's own decisions | later, in that order |

**Refused:** shipping components; a plugin; any seeded rule presented as the product's.

## Capture log
- 2026-09-13 — seed (Ajesh's two messages above). Rows 1–3 building as FEAT-038.
- 2026-09-13 — rows 1–3 landed as FEAT-038. Next: row 4, the divergence number, from the trace the guard now writes.
