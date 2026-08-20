# `/design-tokens-init` — the prototype registry (bundled resource)

> Loaded **on demand**. Write this to `docs/design/PROTOTYPES.md` once the project has both a token
> system and more than one mockup.

## Why a registry, and why it's the thing that makes rich references safe

BOSS's `/spec` now says an executable artifact beats prose — *a crude HTML mockup outperforms three
paragraphs about the layout.* That's true, and it introduces a hazard worth naming plainly:

> **A mockup that doesn't consume your tokens is worse than prose.**
> Prose is obviously incomplete, so the implementer fills the gaps from the design system. A mockup
> is a *confident, complete-looking answer* — so the implementation reproduces it faithfully, raw
> hexes and all. An off-system mockup injects the 47 blues at **spec time**, before a line of product
> code exists, and it does it with the authority of something you can see.

So the rule that makes the rich-reference ladder safe is one line:

**A prototype imports the same tokens as the product, or it is labeled a throwaway sketch.**

Both are legitimate. What's not legitimate is a mockup that *looks* like a design decision and
silently isn't one.

The second job is subtraction. Prototypes accumulate — a `prototype/` folder of twelve HTML files
where nobody remembers which was adopted, which was rejected, or why. The registry is the same
discipline `/extract` applies to patterns: **the ones that didn't make the cut are as load-bearing as
the ones that did**, because without them you re-explore the same dead end in six weeks.

```markdown
---
id: prototypes
type: design
owner: ui-designer
status: active
updated: {{DATE}}
---

# Prototype registry — {{PROJECT_NAME}}

> Every prototype here **imports `docs/design/DESIGN_TOKENS.md`** — or is explicitly marked
> `sketch`, meaning it is not a design decision and nothing should be implemented from it.

## Live

| Prototype | Explores | Tokens | Status | Notes |
|---|---|---|---|---|
| `prototype/onboarding-v2.html` | can signup fit in one screen | ✅ imports | `exploring` | started {{DATE}} |
| `prototype/dashboard.html` | density for power users | ✅ imports | `adopted` → `FEAT-012` | the compact table won |

**Status vocabulary** — `sketch` (throwaway, off-system, decides nothing) · `exploring` (live
question) · `adopted` (graduated to a FEAT — link it) · `discarded` (answered; keep the row).

## Discarded — and what they answered

The most valuable column in this file. A discarded prototype is a **question already answered**;
deleting the row means paying for the answer twice.

| Prototype | Explored | Why discarded | Answered on |
|---|---|---|---|
| `prototype/sidebar-nav.html` | sidebar vs top nav | sidebar cost too much width at the mobile breakpoint we actually need | {{DATE}} |

## Graduation checklist

Before a prototype becomes product code:

- [ ] It imports the token system (no raw hex survived the move)
- [ ] All five states exist, not just the happy one the screenshot showed
- [ ] It's referenced from the FEAT that adopts it
- [ ] Its row here says `adopted` and names the FEAT
```

## Where the prototype lives

Keep prototypes in a clearly-a-sketch location (`prototype/`), never mixed into `src/`. The
separation is what lets a prototype be ugly and fast without anyone mistaking it for product — and
what lets you delete twelve of them without a second thought.


## Once a component library exists, the rule sharpens

The token rule above (*imports the tokens, or it's labeled a sketch*) is the MVP-stage version. At V1,
`/design-library` renders every component you already have — and the rule moves up a level:

> **A prototype composes the components that exist; it doesn't redraw them.**

Same reasoning, bigger blast radius. An off-token mockup injects the 47 blues at spec time. An
**off-library** mockup injects a whole new *component* at spec time — and a component costs far more
to unwind than a color, because it arrives with its own states, its own props, and its own future
call sites.

This is also the selling point, not just the discipline: `docs/design/library/` is a pile of working,
on-brand HTML. Copy from it. A prototype built out of real components is a preview of what will
actually ship, instead of a picture of something adjacent to it — and it's faster to make.
