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

## Density & rhythm

- **Spacing scale in use:** <which steps — a scale you use 4 of beats a scale you defined 9 of>
- **Line length:** <max measure for body text>
- **Default density:** <comfortable | compact — and where the other one is used>

## Accessibility floor (not negotiable, not a phase)

- Contrast: body text ≥ 4.5:1, large text ≥ 3:1 — check the *token pairs*, not screenshots
- Every interactive element has a visible focus state
- `prefers-reduced-motion` honored by every animation
- Nothing communicated by color alone

## Voice in the interface

- **Buttons:** <verb-first? sentence case?>
- **Errors:** <what the user should do, not what the system failed at>
- **Empty states:** <what to do next, not "nothing here">

## Exceptions

Deliberate departures, dated. **An exception recorded is a decision; an exception unrecorded is
drift** — and next time it reads as precedent.

| Date | Where | What | Why |
|---|---|---|---|
| | | | |
```
