---
id: style-guide
type: design
owner: designer
status: active
updated: 2026-09-10
---

# Style guide — Kettlewick

> The *how* to `tokens.json`'s *what*. Tokens hold the values; this holds the decisions.
> Kettlewick is fictional. Every decision here is written in the shape the verbs write it, so the
> showcase renders from the same files an install would.

## Design principles (3–5, no more)

### 1. Calm over urgent
- **Statement:** Your Monday morning gets shorter, not louder.
- **Grounded in:** EVID-001 and EVID-002 (three owners described the Monday cover call unprompted; one said the hour is the job she hates most); DEC-003 (nothing after 8pm); docs/personas/marta.md
- **Why:** an owner opens Kettlewick when a visit is already uncovered. Urgency is the default state of the job; the app must not add to it. Giving up: the "act now" conversion that badges and red dots buy.
- **Guideline:** one accent, on the one thing you can act on. Everything else is quiet.
- **Rules:** no unread counts; no badges on navigation; no red except the confirm on a destructive dialog; amber for *uncovered*, never red; nothing sent after 8pm, and the screen says when it will go.
- **Wrong if:** an owner misses an uncovered visit that a badge would have caught. Then calm cost a visit, and the rule narrows.

### 2. The row is the unit
- **Statement:** Everything you need about a visit is on its row; you never open anything to know its state.
- **Grounded in:** EVID-003 (an owner covered a Monday visit from the school gate — one thumb, one row); docs/personas/marta.md; journey stage 3
- **Why:** owners scan; they do not browse. A visit's state, who has the ask, and the one act belong on one line. Giving up: detail views, and the room they would give a designer.
- **Guideline:** design the row first; the page is rows.
- **Rules:** a visit's state is a chip on its row; the act is a ghost button on its row; a row never links to a detail page.
- **Wrong if:** owners keep asking "where do I see the note?" — the row is too thin, and a second line earns its place.

### 3. Ask, don't assign
- **Statement:** Kettlewick never puts a carer on a visit; it helps you ask the right three, and the first yes fills it.
- **Grounded in:** EVID-002 (the owner's own words for what she does now: "I ring round"); DEC-003 (no league table — the three are not ranked, they are the three who could); docs/personas/priya.md; journey stage 4
- **Why:** the relationship between owner and carer is the product's whole moat; automation that bypasses it wins the Monday and loses the carer. Giving up: the "smart fill" every rival ships.
- **Guideline:** every act is an ask with a name on it, and a person answers it.
- **Rules:** no auto-assign; the primary button on an uncovered visit is *Ask*, and it names who; a carer's *yes* is one tap, never a form; the owner confirms, always.
- **Wrong if:** owners widen the ask to everyone every time — then asking is broadcasting, and the *three* needs a reason on the screen.

## The signature

The one thing someone could describe about this interface without naming the product.

- **It is:** the status chip — a shape before a colour (a hollow ring for *uncovered*, a half-filled ring for *asked*, a filled disc for *covered*), the same three shapes on the owner's laptop, the carer's phone, and the printed Monday.
- **It appears:** on every row and on the carer's ask card; deliberately not in navigation, never as a badge.

## Logo

The mark is a file: `logo:` in `docs/BRAND.md` points at `docs/brand/mark.svg` — a kettle drawn as one stroke, the same 1.5px as the icon set.

- **Clear space:** the height of the mark on every side
- **Minimum:** 16px on screen, 6mm in print; below that the mark alone, never the lockup
- **Colour:** kettle copper on paper · white on the accent · one colour (`text.body`) for print; never on a photograph
- **Tagline:** *Cover found before the kettle boils* sits with the wordmark on the landing page only; nowhere inside the app
- **Misuse:** stretched · a gradient · recoloured to a signal colour · below minimum

## Composition — four slots, and they start empty on purpose

### 1. Type roles — *which faces, when, and why*

Observed at the 2026-09-02 review, declared 2026-09-05:

- **Display** — Newsreader — the promise: the landing headline, the day's title, the wordmark. Two sizes.
- **Body** — Public Sans — the work: every row, every label, every button. Three sizes.
- **Mono** — JetBrains Mono — the numbers: visit times, counts. One size.
- Six roles in total; a seventh is a question for this file first.

### 1b. Icons — *the set, and it is a dependency*

- **The set:** our own, drawn to match the mark — 1.5px stroke, 24px grid, round caps; six today (`docs/design/icons/`)
- **Sizes that exist:** 16 (inline with text), 20 (in a button), 24 (alone)
- **Icon-only is allowed when:** it sits in a row beside its label, or on the phone toolbar with an accessible name
- **What an icon never does:** carry a visit's state — that is the chip's job, and colour-plus-shape is the floor

The stroke is in the file, not in the CSS.

### 2. Rhythm — *the spacing that makes it feel like one thing*

- Inside a control: `space.2` (8). Between controls: `space.3` (12). Between rows: `space.2`. Between sections: `space.6` (24). The page margin: `space.4` on the phone, `space.8` on the laptop.
- Observed 2026-09-02: the day list used 14px gutters — off the scale; moved to `space.3` (DEC-004).

### 3. Surface language — *how a thing is separated from what is behind it*

- A row is paper on ground with a `border.subtle` bottom rule — no card, no shadow.
- The confirm dialog is `surface.raised` with `shadow.raised` — the only thing that floats.
- Declared: *border for things that sit; shadow for things that float.*

### 4. Hierarchy — *what makes the most important thing most important*

- Space, then weight, then the accent — never size alone. The one act on a screen is the only thing in the accent.

## Composition patterns

| Pattern | Tokens it composes | The decision it encodes |
|---|---|---|
| Primary action | `color.action.primary` + `radius.control` + `font.body` 500 | one primary per view — a second primary means the view has two jobs |
| Visit row | `color.surface.paper` + `border.subtle` + `space.2` + the status chip | the row is the unit; state is a shape before a colour |
| Destructive confirm | `color.action.danger` on the confirm only + the consequence in the title | never one click from idle; the label repeats the consequence |

## Layout — six sub-slots, and they start empty on purpose

- **Base unit:** 4
- **The ramp:** inside a control `space.2` · between controls `space.3` · between sections `space.6`
- **Grid anatomy:** the laptop is one column of rows at 720px max with a 240px rail on the left; the phone is one column edge to edge with `space.4` margins; the day view is one column of visits in time order
- **Breakpoints:** `breakpoint.phone` 480 · `breakpoint.laptop` 960 — two, because there are two surfaces that change shape
- **Responsive techniques:** reflow (the visit row stacks its who under its when on the phone) · resize (the button fills the width on the phone) · keep (the chip never changes) · re-architect (the rail becomes the phone's bottom bar); hide is not allowed — nothing an owner needs is hidden on the phone
- **Density:** one

| Surface | Must | May | Never |
|---|---|---|---|
| Laptop (the owner, Monday morning) | the day in one view; the rail | a second column for the note | a modal that hides the day |
| Phone (the carer, between visits; the owner at the school gate) | one act per screen; 44px targets (`target.min`); yes / no fill the width | the day as a list | a hover-only affordance |
| Paper (one owner in eight prints the Monday) | the three chip shapes in one colour; the day in time order | nothing else | a colour that carries meaning |

## Component API shape — the composition rule for props

| Concept | We call it | Never |
|---|---|---|
| the visual variation | `variant` | `type`, `kind`, `style` |
| the primary action handler | `onAsk` (an ask, never a click) | `onClick`, `onPress` |
| the off state | `disabled` | `isDisabled`, `inactive` |
| the loading state | `loading` | `isLoading`, `pending` |

## The five states

| Component | default | hover | active | disabled | empty / loading |
|---|---|---|---|---|---|
| Button | ✓ | ✓ | ✓ | ✓ | ✓ loading — the label becomes the participle ("Asking…") |
| VisitRow | ✓ | ✓ | ✓ | — | ✓ the empty day says "Nothing uncovered today." |
| StatusChip | ✓ | n/a | n/a | n/a | n/a |
| AskCard | ✓ | ✓ | ✓ | ✓ after 8pm — "This ask goes out at 7am" | ✓ answered — the card says who covered it |
| EmptyState | ✓ | n/a | n/a | n/a | n/a |
| ConfirmDialog | ✓ | ✓ | ✓ | ✓ while the cancel is sending | n/a |
| Toast | ✓ | ✓ pauses the dismiss | n/a | n/a | n/a |
| Rail | ✓ | ✓ | ✓ the current place | n/a | n/a |
| TextField | ✓ | ✓ | ✓ focus ring | ✓ says why | ✓ the label stays; the placeholder is an example, never the label |
| CarerRow | ✓ | ✓ | ✓ | — | ✓ "No carers yet — add the first" |
| ImportRow | ✓ | ✓ | ✓ | n/a | ✓ couldn't-read keeps the line as typed |
| RowSkeleton | ✓ | n/a | n/a | n/a | n/a — it IS the loading state |
| PrintSheet | ✓ | n/a | n/a | n/a | ✓ "Nothing uncovered on Monday" in one colour |

- **How a state changes a colour:** rest → hover mixes the fill 12% with `text.body`; active 22%; selected takes the accent; disabled is the same colour at 45% opacity, never a new grey. One rule for every component.

**Name states structurally** — `button-primary-hover`, not "the hover state of the primary button".

## Accessibility floor (not negotiable, not a phase)

- Contrast: body text ≥ 4.5:1, large text ≥ 3:1 — check the *token pairs*, not screenshots
- Every interactive element has a visible focus state (2px `color.action.primary` outline, 2px offset)
- `prefers-reduced-motion` honored by every animation
- Nothing communicated by color alone — the chip is a shape first

## Do / Don't

| Do | Don't | Because |
|---|---|---|
| one primary action per view | two buttons competing for the same weight | a second primary means the view has two jobs |
| amber for an uncovered visit | red for anything but the destructive confirm | red is a siren, and Monday is loud enough (principle 1) |
| the act on the row — *Ask* | a detail page with the act at the bottom | the row is the unit (principle 2) |
| disabled controls say why — "goes out at 7am" | a greyed-out button with no explanation | the owner can't act on a dead end she can't diagnose |

## Terminology

| Use | Never | Because |
|---|---|---|
| visit | shift, slot, booking, appointment | the owner's word; a *shift* is the carer's whole day |
| carer | caregiver, worker, staff, the help | what they call themselves (EVID-002) |
| cover | fill, assign, book | the product's whole job, in the owner's mouth: *find cover* |
| ask | request, send, notify, ping | the product's stance (principle 3) |
| covered | filled, booked, done, sorted | the word on the chip and in the owner's mouth |

## Voice in the interface

**Voice — 3 traits, each with a tradeoff:**

- plain over clever — giving up: personality in the microcopy
- brief over complete — giving up: the reassurance a longer message would give
- the owner's words over ours — giving up: consistency with what the industry calls things

**Tone by context:**

| Context | How the voice shifts | Real string |
|---|---|---|
| Success | brief, no confetti | "Covered. Priya's on the 9 o'clock." |
| Error | what to do next, not what failed | "Couldn't reach anyone — try again, or ask three more." |
| Warning | name the thing, no exclamation mark | "The 9 o'clock is still uncovered." |
| Destructive confirm | name the consequence, not "are you sure" | "Cancel the 9 o'clock. Priya will be told." |
| Empty state | what to do next, not "nothing here" | "Nothing uncovered today." |
| Loading | the participle of the act | "Asking Priya, Sam and Jo…" |

**Surfaces:**

- **Buttons:** verb first, two or three words, sentence case — *Ask*, *Confirm Priya*, *Keep it*
- **Errors:** what the owner should do, not what the system failed at
- **Empty states:** what to do next, not "nothing here"
- **Alternative text:** what the image is *for* — "Monday, with the 9 o'clock uncovered", never "chart"; the mark is `alt="Kettlewick"`; the chip's shape carries an accessible name (*uncovered*, *asked*, *covered*)
- **Inclusive language:** *carer*, never *the help*; the person they visit is *the client* only in the owner's own records, never in a carer's message; no "she" for carers by default — the name, or *they*

## Exceptions

| Date | Where | What | Why |
|---|---|---|---|
| 2026-08-28 | the printed Monday | two primary-weight actions on one sheet | paper has no hover; both acts must read at a glance — reviewed, kept |
| 2026-09-04 | the day view on the phone | two primary-weight actions | *Ask* and *Confirm* both needed on an answered visit — second of its kind, worth noticing |
| 2026-09-08 | PrintSheet | a raw hex for the print rule | the print stylesheet has no tokens yet — the next token family |
