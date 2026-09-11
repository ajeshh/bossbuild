# `/design-tokens-init` — the component index (bundled resource)

> Loaded **on demand**. Write this to `docs/design/COMPONENTS.md` when the project's **first**
> component exists.

## Why an index, and why it is not the same call as the prototype registry

The registry next door says *don't create it for a single sketch; that's ceremony.* This file gets
the opposite call on purpose, and the difference is worth stating because it looks like an
inconsistency:

> A prototype is a throwaway, so a registry of one is bookkeeping.
> **A component is a precedent, so an index of one is where the second one gets written down.**

And the second one is the whole hazard. BOSS's own failure catalog names **pattern reinvention**
(`Button` → `CTAButton` → `PrimaryButton`, all near-identical) and **billion-line drift** (code grows
linearly with screens) as the two most expensive AI-UI failures. Both begin at component number two.

## The mechanism: retrieval beats instruction

The prevention BOSS prescribed for years was a prompt convention — *"search `components/` for similar
patterns first; reuse before creating."* That is a **filter**: it works only for as long as every
future prompt remembers. It is the same shape as *"reference tokens by name in every prompt"*, which
is the sentence `design-tokens-guard` exists because nobody keeps.

What changes the outcome is giving the agent **something to open** instead of something to recall.
An index with the name, the purpose and the import line answers *"does something like this already
exist?"* in one read, before a file gets created. That is the one honest claim here — the direction
is well supported; **no compliance percentage is**, so don't quote one.

## What it can and cannot promise at this rung

Say this plainly in the file, because this program's documents have a history of claiming more than
their mechanism delivers:

- **At MVP this index is authored, so it can go stale.** The staleness is *visible* — a component in
  the tree with no row — but nothing enforces it. It is a better filter, not yet a boundary.
- **At V1 `/design-library` generates `manifest.json` from the code** with a source hash per
  component, and staleness becomes mechanical. Same fields, one source of truth: **the generated
  manifest supersedes this file; it never sits beside it.**

```markdown
---
id: components
type: design
owner: designer
status: active
updated: {{DATE}}
---

# Component index — {{PROJECT_NAME}}

> **Open this before creating a component.** Reuse first, extend second, create last.
> A new component gets its row in the same change that creates it.

| Component | What it's for | Import | Variants | Missing states |
|---|---|---|---|---|
| `Button` | primary and secondary actions | `import { Button } from '@/components/Button'` | primary · secondary · ghost | — |
| `EmptyState` | what a list shows before there is data | `import { EmptyState } from '@/components/EmptyState'` | — | loading |

**Missing states** names the holes in the five-state requirement (default / hover / active /
disabled / empty+loading). A dash means none are missing. Leaving the column blank is not the same
as a dash — an unfilled cell means nobody checked.

## The API is part of the system too

The table above records what a component *looks like*. The other half is **how it is called**, and it
is the half a developer feels every day and a design review never looks at: `variant` here and `type`
there, `onClick` beside `onPress`, `disabled` next to `isDisabled`.

This is **pattern reinvention moved one level in** — from what components look like to how they are
invoked — and it inherits terminology's best property: **it is a word list, so it is greppable.**

**One word per concept, in props too:**

| Concept | We call it | Never |
|---|---|---|
| the visual variation | `variant` | `type`, `kind`, `style`, `appearance` |
| the primary action handler | `onClick` | `onPress`, `onSelect`, `handleClick` |
| the off state | `disabled` | `isDisabled`, `inactive`, `enabled={false}` |
| the loading state | `loading` | `isLoading`, `pending`, `busy` |

**Fill this in from what you already have, not from this example** — the table above is BOSS's
illustration of the *shape*, not a recommendation about which words to pick. Whatever the existing
components already say is the right answer, unless they disagree with each other, in which case
picking one is the work.

## Not a component

Pages and routes do not get rows — they are compositions, not building blocks. The landing page is
the exception worth naming: it is the surface a stranger judges you by and it was usually written
before any of this existed, so it carries its own row here once `/design-library` runs at V1.

## Retired

A component nobody imports is not neutral. It is a wrong answer sitting in the index where the next
search will find it. Delete it, and keep the row here with the reason.

| Component | Why retired | On |
|---|---|---|
| `CTAButton` | was `Button variant="primary"` all along — merged | {{DATE}} |
```

## The rule that goes with it

The index answers *what exists*. It cannot answer *why the button was never a component in the first
place*, and that is the more expensive failure. Ask an AI for a screen and you get a page-shaped
component — `DashboardPage.tsx` with its buttons, cards and inputs defined inline. Every one of those
is a primitive that never got extracted, and the next screen reinvents it.

> **Build the button, then use it on the page. Don't build the page and leave the button inside it.**

That sentence is the seed-time fix and it costs nothing. The V1-time fix is a refactor across every
screen already shipped. Same decision, two prices — which is exactly the seed-that-scales test, and
why this lands at MVP rather than waiting for a component set worth rendering.
