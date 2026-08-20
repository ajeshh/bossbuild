---
name: design-library
description: Generate the visual design library for {{PROJECT_NAME}} — a self-contained HTML gallery of foundations (color/type/spacing), components (every variant, all five states) AND the rule sets (principles, do/don't pairs, terminology, voice), rendered from the code and tokens so it cannot drift. Writes `docs/design/library/` + a manifest that doubles as the agent's reuse index. Renders drift ON the component instead of filing it in a report nobody opens. Re-run any time; it is idempotent. Usage - /design-library [--check]
---

# /design-library — the system you can actually look at

Markdown can't show you a button. `DESIGN_TOKENS.md`, `STYLE_GUIDE.md` and `PROTOTYPES.md` are the
right artifacts and they are all *unlookable* — which means the one question a founder actually asks
(*"what do I already have, and does it still match what I said?"*) has no surface that answers it.

This builds that surface: one self-contained HTML library, generated from the code and the tokens,
that a founder, a designer, a stakeholder **and the agent** can all read.

## Step 0 — does it already exist, and is this the right rung?

**Look for the visual design library before you make one** — `docs/design/library/**`. If it's there: say so and stop
when it's fine (a complete outcome, not a failure to act), or name the *specific* gap and offer the
*specific* edit when it's behind. Never quietly generate a second one.

**Rung: V1.** If this project is **earlier** than that, don't run this — and there is **no seam** worth planting, which is a complete answer rather than a gap: It costs the same at V1 as it would have at MVP, minus the components that did not exist yet. The rung below it is the tokens file, and that seam is already `design-tokens-init`'s.

## The load-bearing rule: GENERATED, never authored

**The code is the source of truth. This library is derived from it.**

Never hand-maintain a card. Never let the library become a second place a component is defined. A
gallery authored *beside* the code is the two-sources-of-truth trap — the same battle every
design-tool sync loses, and it always ends with two definitions of a button and a reconciliation
problem nobody has time for.

Which also settles the question people ask first: *"how do I update the library and push the change
back to everywhere the component is used?"* **You don't, because you never had to.**
`src/components/Button.tsx` *is* the button; every use site imports it; editing it updates all of
them. That propagation isn't a feature to build — it's what a component already is. The library's job
was never propagation. It's **visibility, reuse, and drift.**

## The library is not just components — it's the rule sets too

Three sections, and the middle one is the one everybody forgets:

### 1. Foundations — the tokens, made visible
Color swatches with their **semantic token name** (not the hex) and the contrast ratio of each
text/background pair · the type scale as real specimens · the spacing scale as rendered bars ·
radius, elevation, motion. Someone should be able to point at a swatch and say its name.

### 2. Rules — the style guide, rendered
The half that makes this a *design system* rather than a component dump. Pulled from
`STYLE_GUIDE.md`:

- **The 3–5 principles, each with its tradeoff** ("Calm over engaging" — and what you're giving up)
- **Do / Don't pairs, rendered side by side.** This is the highest-value thing on the page. A rule
  in prose (*"no unread-count badges"*) is a sentence you skim. The same rule as two rendered
  examples is a thing you *see* — and it's the SHOW delivery the cohort guidance already prescribes,
  made structural instead of conversational.
- **The five-state table**, with the states actually rendered
- **Terminology** — one word per concept. The single most checkable content rule you own.
- **Voice in the interface** — button labels, error copy, empty-state copy, as real strings
- **The signature** — the one thing someone could describe without naming the product
- **Exceptions**, dated. An exception recorded is a decision.

> If the library shows only components, it teaches the agent and the founder that design *is*
> components. It isn't. The rules are the part that survives a rewrite.

### 3. Components — every variant, all five states
Each component gets its own card: name, source path, **the import line to copy**, one-line purpose,
every variant, and all five states rendered (default / hover / active / disabled / empty+loading).
Missing states are rendered as a visible gap, not silently omitted — you cannot skim past a hole.

> **Name states like variants, not like prose.** In the manifest and in any component tokens, a state
> is `button-primary-hover` — a *structural* name — not a sentence in a review checklist. The
> difference matters: a checklist entry is something a reviewer must remember to look for, while a
> missing structural name is a hole you can **enumerate**. It's the five-state requirement moved from
> filter to boundary, and it costs nothing but a naming convention.

## What it writes

```
docs/design/library/
  index.html                  # the shell — foundations + rules + links every card
  components/<name>.html      # one per component; first line is the @dsCard marker
  manifest.json               # the machine half (see below)
```

Every component file's **first line** is:

```html
<!-- @dsCard group="Components" -->
```

Foundations and rules cards use `group="Type"`, `"Colors"`, `"Spacing"`, `"Brand"`. That marker is
free to write and means the library drops straight into a host design-system pane if the founder
ever syncs it — see the handoff section. If they never do, it's an inert comment.

### `manifest.json` — the half that does the real work

```json
{
  "generated": "<ISO date>",
  "tokensSource": "docs/design/DESIGN_TOKENS.md",
  "components": [
    {
      "name": "Button",
      "source": "src/components/Button.tsx",
      "sourceHash": "<sha256 of the source file, first 12 chars>",
      "purpose": "primary and secondary actions",
      "import": "import { Button } from '@/components/Button'",
      "variants": ["primary", "secondary", "ghost"],
      "states": { "default": true, "hover": true, "active": true, "disabled": true, "empty": "n/a" },
      "usedIn": 14,
      "findings": [
        { "severity": "serious", "kind": "raw-value", "detail": "#3B82F6 at line 42 — should be color.action.primary" }
      ]
    }
  ]
}
```

**`sourceHash` is why this is a boundary and not a filter.** Re-run `/design-library --check`: if a
component's current source hash differs from the manifest, its card is **stale** and says so. That is
mechanically checkable — no prompt has to remember, no reviewer has to notice. It is the same move
`design-tokens-guard` makes for hex codes, applied to the library itself.

**The manifest is also the agent's reuse index.** `name` + `purpose` + `import` + `variants` is
exactly what an agent needs to answer *"does something like this already exist?"* before writing a
new file. The design system's biggest unenforced rule — *reuse first, extend second, create last* —
has been a polite sentence in a prompt. This gives it something to actually look at.

## Drift is rendered ON the component, not filed in a report

`/ux-check` writes findings to `docs/design/ux-check-*.md`. Those files are correct and nobody opens
them twice. Put the finding where the eye already is:

| Badge | Meaning |
|---|---|
| 🔴 **off-token** | raw hex / rgb / spacing literal in the source — the 47 blues, caught |
| 🟠 **missing state** | a state the five-state rule requires and the component doesn't have |
| 🟠 **near-duplicate** | another component shares most of this one's shape — pattern reinvention |
| 🟡 **stale card** | source hash moved since generation — re-run |
| ⚪ **unused** | imported nowhere — **delete it in this pass.** A component nobody uses isn't neutral: it's a wrong answer sitting in the reuse index where the next search will find it |

A clean library is a page of components with no badges. That is a status you can take in at a
glance, and — unusually for this codebase's design surface — it's a **positive** signal as much as a
warning. It shows what you've built, not only what's wrong.

## How to run it

1. **Check the preconditions.** `docs/design/DESIGN_TOKENS.md` must exist (if not, run
   `/design-tokens-init` first — no tokens, no library). `STYLE_GUIDE.md` should exist; if it's still
   skeleton, generate the library anyway and mark the rules section as unfilled — a visibly empty
   rules section is a better prompt than a missing one.
2. **Find the components.** Detect the stack, then scan the conventional location
   (`src/components/**`, `app/components/**`, `lib/components/**`, `components/**`). Skip tests,
   stories and index barrels.

   **Then scan the public surface** — the landing page, the marketing routes, whatever `/landing`
   generated. It is usually *not* in the component tree: it was written at MVP, before the token
   layer existed, often as one standalone page. That makes it simultaneously the surface most likely
   to be off-token and **the only one a stranger ever sees**. A drift check scoped to `src/` covers
   everything except the front door. These are pages, not components, so they get no cards — they get
   a **surfaces** row on the shell, carrying the same off-token and stale badges.
3. **Read each component.** Extract: exported name, the props that create variants, which states it
   handles, the import path, and any raw style values. One line of purpose — from a doc comment if
   there is one, otherwise inferred and marked as inferred.
4. **Count usage.** Grep the import across the repo. Zero means ⚪ unused.
5. **Look for near-duplicates.** Compare names and prop shapes across components.
   `Button`/`CTAButton`/`PrimaryButton` is the canonical smell. Flag pairs, don't merge them — the
   founder decides, you propose.
6. **Render each card** as static HTML+CSS that consumes the **real token values**, so the card looks
   like the component does. This is an honest approximation, not a live render — say so on the page,
   once, in small type. An approximation labeled as one is useful; an approximation presented as
   truth is the mockup hazard all over again.
7. **Render the shell** — foundations from the tokens file, rules from the style guide, a link to
   every card, and a summary line: *"14 components · 3 findings · generated <date>."*
8. **Write `manifest.json`** with a source hash per component.
9. **Report** the findings list in the session, ordered by severity, and point at the library path.

`--check` runs steps 1–5 and 8, reports drift, and **writes nothing but the manifest.** Use it in a
review pass when you want the verdict without regenerating the pages.

## Prototypes compose from this library

The prototype registry already carries the rule that a mockup must import your tokens *or* be labeled
a throwaway sketch — because an off-system mockup is a confident, complete-looking answer that the
implementation will faithfully reproduce, raw hexes and all.

**Once this library exists, that rule sharpens one level up: a prototype should compose the
components that already exist, not redraw them.** A mockup that invents a new button injects a new
*component* at spec time, and a component is far more expensive than a color. Same hazard, bigger
blast radius.

## So does the landing page

The same rule, pointed at the surface with the widest blast radius of all. `/landing` runs at MVP and
generates from the brand and the tokens — correct at the time, and it means the page was built *before*
this library existed. Once it does exist, the landing page composes from it rather than carrying its own
private copy of the button.

Two reasons this one matters more than a prototype drifting:

- **It is the only surface judged by someone who has never seen the product.** An internal screen that
  drifts costs you a slightly incoherent app. A front door that drifts costs you the first impression,
  and the visitor never files the bug — they just leave.
- **It drifts on claims, not only on style.** A prototype can only look wrong. A landing page can be
  *false* — naming a feature that shipped differently, a price that changed, an integration that was
  removed. Style drift is a badge; **a false claim is the thing to actually fix**, and it is the one
  kind of drift a token check will never catch.

This also makes prototyping faster, which is the honest selling point: the library is a pile of
working, on-brand HTML. Copy from it. A prototype built out of real components is a genuine preview
of what will ship rather than a picture of something adjacent to it.

## When a real designer shows up

The library is the handoff artifact, and it's already built. A designer gets a **URL, not a repo
checkout** — foundations, rules, and every component with its states, all in a form they can react to
without installing anything.

Two seams worth naming, in order of how real they are:

- **Tokens are genuinely two-way.** Tokens are structured data with stable IDs, which is why this is
  the one layer where design-tool sync actually works. Emit DTCG (`/design-tokens-init` already does
  where the stack allows), push to the design tool's variables, pull their changes back.
- **Components are one-way, each direction, by a different mechanism.** Design→code mapping is
  mature. Code→editable-design-file round-trip is **not** well established — treat any claim that it
  is as unproven until you've watched it work on your own components.

**If the host offers a design-system sync, know what it actually wants before promising anything.**
The `@dsCard` first-line marker this skill writes is the right convention and matches. **The rest is
not the same artifact**, and saying otherwise would be the overclaim this practice keeps making:

- A host sync runs **its own converters** over a **Storybook or package layout** — the real component
  library — and emits a bundle (`_ds_bundle.js`, a `styles.css` `@import` closure, a per-component
  directory of preview/source/types/prompt files, and a content-hash anchor for incremental re-syncs).
- This skill emits a **human-readable gallery**. One page, no build step, opens from the filesystem.

So they are **complementary, not interchangeable**: the gallery is what a person looks at; the sync
bundle is what a design tool consumes. Don't present one as the other, and **don't build a sync
engine, a hosting surface or a card index** — that's the host's job, and building a second one is how
this skill becomes the thing it exists to prevent.

> The useful convergence: a host sync reads your **real components**, and so does this. Both work for
> exactly the same reason — element-shaped components in a conventional layout. That's the
> *component boundaries* row of the seed-that-scales test, paying off twice. A codebase of
> page-shaped components has nothing for either one to read.

## Handing it to a designer

The library **is** the handoff artifact, so the brief is mostly assembly. When a designer joins —
contract, fractional, or a friend doing you a favor — generate `docs/design/HANDOFF.md` alongside it:

1. **What this product is** — one line from the canvas Promises cell. The brand anchor, not a pitch.
2. **What's decided and why** — the 3–5 principles with their tradeoffs. A designer who doesn't know
   *"calm over engaging"* was a decision will helpfully propose engaging.
3. **What's fixed vs. open** — the accessibility floor and the five-state requirement are **not**
   negotiable; type, color and spatial composition mostly are. Say which is which up front, or you'll
   relitigate it in review.
4. **Where the system already is** — the library URL, `DESIGN_TOKENS.md`, and **DTCG export** if the
   stack emits it. Tokens are structured data with stable IDs, which makes them the one layer that
   round-trips to a design tool cleanly. That's the seam; offer it first.
5. **What's actually wrong** — the open findings. Off-token values, missing states, near-duplicates.
   **This is the most useful page in the brief** and the one founders skip out of embarrassment. A
   designer who can see the mess can fix it; one who can't will build on top of it.
6. **What you need from them** — scoped. *"Empty and error states for these four components"* beats
   *"make it look better."* The five-state table is a ready-made work order.

**The thing to get right: a designer is not an outside professional you brief and wait on.** They
join the work *and* bring their own tool that has to interoperate with your repo — which is why this
lives here, next to the system, rather than in a generic engagement brief. Hand them a URL, not a
repo checkout, and name the token seam on day one.

## Cohort-aware delivery

Per `.boss/config.json`:

- **`vibe-coder-newbie` / `first-product`** — SHOW. Open the library and walk one component:
  *"these are the five states; this one's missing empty — that's what your users hit on day one."*
  The page is the teaching.
- **`eng-builder` / `returning-founder`** — terse. *"Library's at `docs/design/library/`. 3 findings,
  worst is a near-duplicate: `CTAButton` vs `Button`."* Skip the tour.
- **`vibe-virtuoso`** — lead with the manifest, not the gallery. They'll want the reuse index and the
  hash-staleness check; they've seen a component gallery before.
- **`non-tech-founder` / `domain-expert`** — plain language, consequence-first: *"this is every piece
  of your interface on one page, so you can see whether it still looks like one product."*
- **`indie-hacker`** — right-sized. One HTML file, no build step, no service, no account. It's a file
  in the repo. Say so, that's the pitch.

## Rules

- **Generated, never authored.** If you find yourself hand-editing a card, stop — fix the component
  or fix the generator. A hand-edited card is a lie with a shelf life.
- **Zero-dependency output.** Self-contained HTML + inline CSS. No build step, no framework, no CDN.
  It must open from the filesystem in a browser, forever, with no `npm install`.
- **Label the approximation once.** The cards are rendered from token values, not executed from
  component code. Say it once in small type; don't repeat it on every card.
- **Propose duplicates, never merge them.** Consolidating two components is a design decision with a
  blast radius. Flag the pair, show them side by side, let the founder call it.
- **Idempotent.** Re-running produces the same output for unchanged input. No timestamps in the body
  beyond the single generated line, so the diff stays readable.
- **Don't generate for three components.** If the project has fewer than ~5 components, the library
  is ceremony and the founder can see everything already. Say so and stop.
- **The rules section is not optional.** A library of components with no principles, no do/don'ts and
  no terminology is a component dump. It's the half that makes the other half mean something.
