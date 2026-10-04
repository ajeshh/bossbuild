---
id: IDEA-132
type: idea
kind: capability
owner: product-lead
status: shipped (Unreleased)
proof: stages/L2-v1/template/.claude/skills/design-library/SKILL.md
gist: The design system an agent builds with is a graph — which tokens a component reads, which components it composes, where it may not go — and BOSS held the nodes but not the edges.
created: 2026-10-04
---

# The design system as a graph — the edges the manifest and the usage page were missing

## Current shape
_The best articulation so far. Rewrite this as the idea sharpens._
- **What:** A practitioner thread on design-system sources of truth (2026) landed on three claims:
  code is the truth and the design tool authors; each component needs a rules file that says what may
  be its parent, child and sibling; and the system needs a generated map of components and tokens so
  an agent reads one file instead of grepping. Read against BOSS (grep first):
  - **Code is the truth** — already the load-bearing rule of `/design-library` and IDEA-107's design-tool answer.
  - **A rules file per component** — already exists: the usage page, `docs/design/components/<Name>.md`
    (IDEA-112), with *When it applies / When it doesn't / Layout*. **Missing:** nesting as its own
    section, and any route from the page to the write — the guard reads PATTERNS and the style guide,
    never a usage page.
  - **A generated map** — `manifest.json` is it, generated from the code, minus the edges: `usedIn` is
    a count, there is no token list, no composes list. **And a shipped claim with nothing behind it:**
    the skill says a card's *Code* copies "the tokens the component uses as JSON from the manifest"; the
    schema had no such field and `boss design` copied only the import line and source.
  - **A decisions file per component** — declined: DEC records, the Exceptions and Retired tables and
    `chosen — DEC-NNN` beside a swatch already hold it; a per-component file is a second copy.
- **Who it's for:** the agent building the next screen (the reader that cannot ask), and the founder
  who changes `color.action.primary` and wants to know what moves.
- **Built (2026-10-04, Unreleased):**
  1. `manifest.json` gains `tokens` and `composes`, generated at step 3; `boss design`'s Code copies
     the tokens and the card names what it composes.
  2. The usage page gains `## Composition` — *Inside / Holds / Never inside / Never holds*, blank until
     a bad nesting has happened (name the slot, earn the value).
  3. `design-decisions-guard` reads the *Never* lines and hands the rule over when a write opens both
     tags. Crude by the same design as the rest of the guard: co-occurrence, not a parse.
- **Not built:** a separate `graph.md` or a graph tool — the manifest is the graph, and a second file
  beside it is the two-sources trap. Revisit only if an agent is seen grepping past the manifest.

## Capture log
- **2026-10-04 · Ajesh** — pasted the thread and a founder's design-system repo shape (DTCG tokens,
  YAML anatomy, Style Dictionary, a React library in a component explorer, skills for patterns): *"anything
  we can learn or improve?"* → read against BOSS → *"ok lets fix and complete it."*
