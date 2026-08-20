# `/design-tokens-init` — the STYLE_GUIDE skeleton (bundled resource)

> Loaded **on demand**. Write this to `docs/design/STYLE_GUIDE.md`, alongside `DESIGN_TOKENS.md`.
>
> **Why both files exist, and why neither replaces the other:** tokens are the *what* (the values and
> their names); the style guide is the *how and why* (how they compose into patterns, and what
> decision each pattern encodes). `/design-review`, `ui-designer` and `ux-designer` all read this
> file — it was read by three consumers and written by nothing until v0.146.0.
>
> Keep it short. A style guide nobody re-reads is a style guide nobody follows; three pages of
> filled-in decisions beat thirty of aspiration.

```markdown
---
id: style-guide
type: design
owner: ui-designer
status: active
updated: {{DATE}}
---

# Style guide — {{PROJECT_NAME}}

> The *how* to `DESIGN_TOKENS.md`'s *what*. Tokens hold the values; this holds the decisions.

## Design principles (3–5, no more)

Each one is a **direction that contains a tradeoff** — if a reasonable person couldn't argue the
opposite, it isn't a principle, it's a mood. Then descend each into rules, because **an agent can't
act on a principle; it can only act on a rule.**

### 1. <Principle — e.g. "Calm over engaging">
- **Why:** <what this buys the user, and what you're giving up to get it>
- **Guideline:** <how to approach it — e.g. "notifications are opt-in and batched daily">
- **Rules:** <checkable instructions — e.g. "no unread-count badges; no red dots; no auto-playing motion">

### 2. <Principle>
- **Why:** … · **Guideline:** … · **Rules:** …

### 3. <Principle>
- **Why:** … · **Guideline:** … · **Rules:** …

## The signature

The one thing someone could describe about this interface without naming the product. (From the
5-token distinctiveness pass — if you can't name it, you shipped the mean.)

- **It is:** <the signature — a typographic choice, a motion, a color relationship, a shape language>
- **It appears:** <where — and where it deliberately doesn't>

## Composition patterns

How tokens combine. One row per recurring pattern; add as they emerge, don't invent up front.

| Pattern | Tokens it composes | The decision it encodes |
|---|---|---|
| Primary action | `color.action.primary` + `radius.default` + `font.body/semibold` | one primary per view — a second primary means the view has two jobs |
| Surface / card | `color.surface.raised` + `space.4` + `radius.default` | elevation by surface token, never an ad-hoc shadow |
| Destructive action | `color.feedback.danger` + confirm step | destructive actions are never one click from idle |

## The five states

Every interactive component specifies all five. **Empty and loading are the two that get skipped**,
and they're the two users hit first on a slow network or a fresh account.

| Component | default | hover | active | disabled | empty / loading |
|---|---|---|---|---|---|
| <Button> | ✓ | ✓ | ✓ | ✓ | n/a |
| <List> | ✓ | — | — | — | **✓ what does an empty list say?** |

> Re-check this table after a redesign. Iteration passes drop states quietly, because a missing
> empty state is invisible in the screenshot you're looking at.

**Name states structurally** — `button-primary-hover`, not "the hover state of the primary button".
A prose checklist is something a reviewer has to remember to check; a naming convention makes a
missing state something you can **enumerate**. Same requirement, moved from filter to boundary, for
the price of a naming rule.

## Density & rhythm

- **Spacing scale in use:** <which steps — a scale you use 4 of beats a scale you defined 9 of>
- **Line length:** <max measure for body text>
- **Default density:** <comfortable | compact — and where the other one is used>

## Accessibility floor (not negotiable, not a phase)

- Contrast: body text ≥ 4.5:1, large text ≥ 3:1 — check the *token pairs*, not screenshots
- Every interactive element has a visible focus state
- `prefers-reduced-motion` honored by every animation
- Nothing communicated by color alone

## Do / Don't

The rules from your principles above, as **pairs**. `/design-library` renders these side by side —
a rule in prose is a sentence you skim; the same rule as two rendered examples is a thing you *see*.

Only write pairs you'd actually enforce. Three real ones beat twelve aspirational ones.

| Do | Don't | Because |
|---|---|---|
| one primary action per view | two buttons competing for the same weight | a second primary means the view has two jobs |
| disabled controls say *why* they're disabled | a greyed-out button with no explanation | the user can't act on a dead end they can't diagnose |
| <your rule> | <the specific thing you keep seeing> | <the principle it serves> |

> These are the **rule** rung of the ladder — the only rung an agent can act on. If a principle
> above never produced a row here, it isn't steering anything yet.

## Terminology

**One word per concept.** The cheapest content rule to write, the most expensive to change late —
renaming a core noun hits copy, routes, schema, tests and every prompt at once. It is also the one
content rule that is **mechanically checkable**, which makes it the first one worth having.

| Use | Never | Because |
|---|---|---|
| <the word> | <the synonyms that keep creeping in> | <what the distinction protects> |

Pick the user's word over the internal one. If the team says "org" and users say "team", the product
says **team** — and the code can say whatever it likes.

## Voice in the interface

**Voice is constant** (the personality — it doesn't change between screens). **Tone shifts by
context** (how that voice sounds when things go well vs. badly). Get both down to real strings; an
agent can't act on an adjective.

> **This section is deferrable, and deferring it is a real choice.** If you haven't watched people
> use the product yet, you can't tell "plain over clever" from "friendly over formal" — and a table
> filled in because it was asked for steers nothing. **Do the Terminology section above first**; it's
> checkable and it pays off immediately. Come back here once there's enough copy to be inconsistent
> about. (High-stakes domains are the exception: how the product speaks when it's *uncertain or
> wrong* is load-bearing on day one — fill the Error and Warning rows before anything else.)

**Voice — 3 traits, each with a tradeoff** (same test as the principles: could someone argue the
opposite?):

- <trait — e.g. "plain over clever"> — giving up: <e.g. personality in themicrocopy>
- <trait> — giving up: <what>
- <trait> — giving up: <what>

**Tone by context:**

| Context | How the voice shifts | Real string |
|---|---|---|
| Success | <brief, no confetti?> | <"Saved."> |
| Error | what to do next, not what failed | <"That file's too big — try under 10MB."> |
| Warning | <how much friction?> | <> |
| Destructive confirm | name the consequence, not "are you sure" | <"Delete 14 records. This can't be undone."> |
| Empty state | what to do next, not "nothing here" | <"No projects yet — start one."> |
| Loading | <what's happening, if it's slow> | <> |

**Surfaces:**

- **Buttons:** <verb-first? sentence case?>
- **Errors:** <what the user should do, not what the system failed at>
- **Empty states:** <what to do next, not "nothing here">

> **If this product has an AI feature, most of its copy is generated at runtime, not written here.**
> System prompts, refusal and hedge language, retry and rate-limit messages, the words before a
> destructive agent action — that's product copy in whoever's voice the model defaults to, which is
> nobody's. Set the voice for those surfaces too, or the model sets it for you in exactly the moments
> that matter most: the failures.

## Exceptions

Deliberate departures, dated. **An exception recorded is a decision; an exception unrecorded is
drift** — and next time it reads as precedent.

| Date | Where | What | Why |
|---|---|---|---|
| | | | |
```
