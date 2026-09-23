# `/design-tokens-init` — the STYLE_GUIDE skeleton (bundled resource)

> Loaded **on demand**. Write this to `docs/design/STYLE_GUIDE.md`, alongside `DESIGN_TOKENS.md`.
>
> **Why both files exist, and why neither replaces the other:** tokens are the *what* (the values and
> their names); the style guide is the *how and why* (how they compose into patterns, and what
> decision each pattern encodes). `/design-review` and `designer` both read this
> file — it was read by three consumers and written by nothing for a long time.
>
> Keep it short. A style guide nobody re-reads is a style guide nobody follows; three pages of
> filled-in decisions beat thirty of aspiration.

```markdown
---
id: style-guide
type: design
owner: designer
status: active
updated: YYYY-MM-DD
---

# Style guide — {{PROJECT_NAME}}

> The *how* to `DESIGN_TOKENS.md`'s *what*. Tokens hold the values; this holds the decisions.

## Design principles (3–5, no more)

Each one is a **direction that contains a tradeoff** — if a reasonable person couldn't argue the
opposite, it isn't a principle, it's a mood. Then descend each into rules, because **an agent can't
act on a principle; it can only act on a rule.**

### 1. <Principle — e.g. "Calm over engaging">
- **Statement:** <one sentence, in the second person of the experience — "Your evening gets shorter,
  not louder." A name is a label; the statement is what a stranger could design from>
- **Grounded in:** <where it came from — an `EVID-NNN`, a persona file, a stage of the journey. A
  principle nothing outside the room names renders as *asserted* on `boss design`; it is still a
  principle, but it can only be reaffirmed until something can test it>
- **Why:** <what this buys the user, and what you're giving up to get it>
- **Guideline:** <how to approach it — e.g. "notifications are opt-in and batched daily">
- **Rules:** <checkable instructions — e.g. "no unread-count badges; no red dots; no auto-playing motion">
- **Wrong if:** <the cheapest thing you'd expect to see if this principle is wrong — e.g. "people
  keep asking where the notifications went". A principle is a decision, and every other decision here
  carries a falsifier. Without one it can only ever be reaffirmed, and a rule that can only be
  reaffirmed is how a design system stops being able to learn.>

### 2. <Principle>
- **Why:** … · **Guideline:** … · **Rules:** …

### 3. <Principle>
- **Why:** … · **Guideline:** … · **Rules:** …

## The signature

The one thing someone could describe about this interface without naming the product. (From the
5-token distinctiveness pass — if you can't name it, you shipped the mean.)

- **It is:** <the signature — a typographic choice, a motion, a color relationship, a shape language>
- **It appears:** <where — and where it deliberately doesn't>

## Logo

The mark is a file, and it lives where the brand does: `logo:` in `docs/BRAND.md`'s frontmatter is
its path (`wordmark:` too, if the wordmark is a drawing rather than the name set in the display
face). **Nothing is drawn until there is a file** — a placeholder mark becomes the logo in about a
week. The five rules below are what a designer asks for first and what a founder never writes down.

- **Clear space:** <e.g. the height of the mark on every side>
- **Minimum:** <on screen and in print — e.g. 16px / 6mm; below this the mark alone, never the lockup>
- **Colour:** <on paper · on the accent · one colour for print; which are allowed>
- **Tagline:** <when the tagline sits with the mark, and when it doesn't>
- **Misuse:** <the pair you refuse — stretched · gradient · recoloured · below minimum>

## Composition — four slots, and they start empty on purpose

Tokens say what a colour *is*. Components say what a button *is*. **This says what a page is** — and
it is the difference between an interface that is *consistent* and one that looks *designed*.

> **A blank slot here is not a gap.** These are decisions that exist whether or not you make them: a
> product with no answer still has an answer, it just hasn't looked at it. The slot is named so the
> decision becomes **noticeable** when it happens — not so you fill it in on day one, when you know
> least. **Name the slot; earn the value.**

**Each slot has a floor and a value, and they are different kinds of thing.** The **floor** is craft
knowledge — it is true for almost every product and it is pre-filled here, because withholding it
would be withholding a fact. The **value** is a decision — it belongs to this product and it is
blank until earned. *Name the slot, earn the value* is right for values and wrong for floors; a slot
can carry its floor and leave its value empty.

Mark each answer **`observed`** (read back off what you already built — the honest default) or
**`declared`** (you chose it deliberately). The distinction matters: an observed answer is a
description you can still change your mind about; a declared one is a decision that should be
defended. Most rows start observed and some graduate.

### 1. Type roles — *which faces, when, and why*

Most products need **two** roles, not four. More roles is the commonest way a young interface starts
looking unresolved.

| Role | The face | Used for | Deliberately NOT used for | |
|---|---|---|---|---|
| Display | | headings that carry the brand | body copy, UI labels | `observed`/`declared` |
| Body | | anything someone reads | | |
| UI | | labels, buttons, form fields | long prose | |
| Mono | | code, ids, numbers you compare | | |

- **Floor (pre-filled):** one family, or two that are clearly distinct — never two that nearly match ·
  body measure under ~80 characters · a serif body gets a little more line-height than a sans ·
  never accent a single word in a headline with italic, bold or colour — it is the commonest tell of
  a generated page · no ALL-CAPS labels by default. *(Bringhurst's* Elements of Typographic Style *is
  the reference; the short form is a floor, not a value.)*
- **The scale:** <how many sizes, and what relates them — a ratio, a set of steps, or "four sizes we
  picked and stuck to". Any of the three is a real answer; not knowing which is not.>
- **Type colour:** <which token pairs carry text — `text.body` on `surface.background`, etc. This is
  not a typography decision, it is a **token pair**, which means it is also the contrast check.>

### 1b. Icons — *the set, and it is a dependency*

Cheap to decide now, expensive later: swapping sets means touching every use site, and **mixing two
sets is visible to anyone even if they can't say why.** Same shape as the type-roles slot — a
foundation choice, not a per-screen one.

- **The set:** <one, named>
- **Sizes that exist:** <two or three, not "whatever fits">
- **Icon-only is allowed when:** <and it still needs an accessible name>
- **What an icon never does:** <carry meaning nothing else carries — the accessibility floor already
  says *nothing by colour alone*; the same rule for shape>

The icons themselves are files — one SVG each under `docs/design/icons/`, drawn from there by
`boss design` and copied as one sprite. **The stroke is in the file, not in the CSS:** an icon whose
markup relies on a stylesheet for its stroke is invisible everywhere the stylesheet isn't.

### 2. Rhythm — *the spacing that makes it feel like one thing*

- **Floor (pre-filled):** one base unit and everything a multiple of it · the measure above governs
  the container, not the other way round · density is one setting, with the other named as the
  exception.
- **Base step:** <the unit everything is a multiple of>
- **Steps actually used:** <a scale you use 4 of beats a scale you defined 9 of>
- **Measure:** <max line length for body text — the single cheapest readability decision there is>
- **Container:** <how wide does content get, and what happens outside it>
- **Density:** <comfortable | compact — and where the other one is used>

### 3. Surface language — *how a thing is separated from what is behind it*

There are five ways, and the decision is **which one is primary**, not which ones exist:

> border · shadow · fill · space alone · nothing

- **Floor (pre-filled):** one primary means · a structural device — a border, a divider, a
  numbered marker, an eyebrow — encodes information about the content or it doesn't appear; `01 / 02 /
  03` only when the content is actually a sequence · one radius does not go on everything regardless
  of hierarchy.
- **Primary means:** <one of the five>
- **Secondary, and when:** <e.g. "shadow only for things that float above the page — menus, dialogs">
- **Raised means:** <what earns elevation, and what doesn't>

**Mixing all five is what makes an interface look unresolved**, and it is what generated UI does by
default, because each screen picks whichever the model reached for that turn.

### 4. Hierarchy — *what makes the most important thing most important*

The one slot that most decides whether this looks designed. There are five levers — **size, weight,
colour, space, position** — and a product should reach for them **in the same order everywhere.**

- **Floor (pre-filled):** colour is never the *only* carrier (the accessibility floor already says
  so) · spend the boldness in one place — one element is the memorable thing and everything around
  it stays quiet · motion that nobody triggered is used once, for one orchestrated moment, not as a
  fade-and-slide on every section.
- **Our order:** <e.g. "space first, then size, then weight — colour is never the primary carrier,
  because it can't be the only signal anyway">
- **What we never use for emphasis:** <e.g. all-caps, italics, more than one accent on a screen>

> Colour cannot be your primary hierarchy lever even if you want it to be — *nothing communicated by
> colour alone* is already in the accessibility floor below. The two constraints agree, which is
> usually a sign the rule is real.

## Composition patterns

How tokens combine. One row per recurring pattern; add as they emerge, don't invent up front.

| Pattern | Tokens it composes | The decision it encodes |
|---|---|---|
| Primary action | `color.action.primary` + `radius.default` + `font.body/semibold` | one primary per view — a second primary means the view has two jobs |
| Surface / card | `color.surface.raised` + `space.4` + `radius.default` | elevation by surface token, never an ad-hoc shadow |
| Destructive action | `color.feedback.danger` + confirm step | destructive actions are never one click from idle |

## Layout — six sub-slots, and they start empty on purpose

Nobody decides how a page is built until the third screen, and by then two screens have decided it
differently. The slot has a shape so the decision has somewhere to land; **name the slot, earn the
value** — a sub-slot stays blank until a screen needs it, and a blank one renders as a hole on
`boss design`, never as a default.

- **Base unit:** <e.g. 4 — the spacing scale is multiples of it>
- **The ramp:** <which steps mean *inside a control* · *between controls* · *between sections*>
- **Grid anatomy:** <columns · gutters · margins · the regions a page has>
- **Breakpoints:** <as `breakpoint.*` tokens in `tokens.json`, so a media query is a name, not a
  number typed twice>
- **Responsive techniques:** <reposition · resize · reflow · hide · re-architect — which are allowed,
  and which a component uses (a row reflows, a button resizes, a chip keeps its shape)>
- **Density:** <one, until a second is earned>

**Responsive, only if the product has a screen that changes shape.** Fill this when there is more
than one surface — a laptop, a phone on a bus, paper (a FEAT that prints is a print surface) — as
*must · may · never* per surface. A touch target has a number (`target.min` in the tokens, 44 is the
usual) so the rule stops living as prose in three places. A CLI, an API, a single fixed surface: leave
it blank and say so.

## Component API shape — the composition rule for props

How a component is *called* is part of the system, and it drifts the same way colour does. Four
floors, pre-filled because every mature system converged on them:

- **Enumerated variants, not boolean piles.** `variant="danger" size="sm"`, never
  `isDanger isSmall isPrimary` — three booleans are eight states nobody designed, and it is the
  shape an agent produces by default.
- **Children for content.** `<Notice variant="success">Saved</Notice>`, not `text="Saved"`. The
  platform already has a way to put content inside a thing; a custom prop for it is a second way.
- **Strict props where the design decided; parts where the consumer decides.** If the icon colour
  follows `variant`, it is not a prop. If the consumer genuinely composes the inside — a list item
  with a leading visual, a label and a trailing action — expose the parts (`Item`, `Item.Leading`,
  `Item.Action`) rather than twelve props that reconstruct them.
- **One escape hatch, named, and it is not `style`.** A single `className`-shaped override on the
  root, so the exceptional case has somewhere to go and the token guard can see it. A `theme` prop
  or a bag of style props on every component is the system leaking out of its own container.

And the rule underneath all four: **behaviour comes from a primitive, style comes from tokens.**
Keyboard model, focus, ARIA — use a headless primitive that already implements the APG for that
widget (or the platform's own control on mobile) and put the tokens on top. Hand-rolling a
dropdown's keyboard handling is the one place an agent reliably ships an inaccessible component, and
it is the one place there is no reason to.

## The five states

Every interactive component specifies all five. **Empty and loading are the two that get skipped**,
and they're the two users hit first on a slow network or a fresh account.

| Component | default | hover | active | disabled | empty / loading |
|---|---|---|---|---|---|
| <Button> | ✓ | ✓ | ✓ | ✓ | n/a |
| <List> | ✓ | — | — | — | **✓ what does an empty list say?** |

> Re-check this table after a redesign. Iteration passes drop states quietly, because a missing
> empty state is invisible in the screenshot you're looking at.

- **How a state changes a colour:** <one rule for the whole system — e.g. rest → hover → active gets
  darker by a fixed mix with the ink; selected takes the accent; disabled is the same colour at reduced
  opacity, never a new grey. One rule, so five states on twelve components is one decision, not sixty.>

**Name states structurally** — `button-primary-hover`, not "the hover state of the primary button".
A prose checklist is something a reviewer has to remember to check; a naming convention makes a
missing state something you can **enumerate**. Same requirement, moved from filter to boundary, for
the price of a naming rule.

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

- <trait — e.g. "plain over clever"> — giving up: <e.g. personality in the microcopy>
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
- **Alternative text:** <what an image is *for* here, not what it shows — "the week, with Tuesday
  uncovered", never "chart". Decorative images say so (`alt=""`); an icon-only control names its act>
- **Inclusive language:** <the words this product refuses and what it says instead — the humane lens
  already owns this; name it here so the copy can be checked against it>

> **If this product has an AI feature, most of its copy is generated at runtime, not written here.**
> System prompts, refusal and hedge language, retry and rate-limit messages, the words before a
> destructive agent action — that's product copy in whoever's voice the model defaults to, which is
> nobody's. Set the voice for those surfaces too, or the model sets it for you in exactly the moments
> that matter most: the failures.

## Exceptions

Deliberate departures, dated. **An exception recorded is a decision; an exception unrecorded is
drift** — and next time it reads as precedent.

**Read this table before adding to it.** One of a kind is an exception. Two is worth noticing.
**Three of the same kind means the rule is wrong** — narrow it, split it, or retire it. A rule with
three standing exceptions isn't being followed, it's being worked around, and the working-around is
the real convention now. *Three exceptions* is the same threshold as *twice is a pattern*, pointed
the other way: this is how a rule gets taken back, and a system that can only add rules locks design
in instead of letting it emerge.

| Date | Where | What | Why |
|---|---|---|---|
| | | | |
```
