---
id: patterns
type: design
owner: designer
status: active
updated: 2026-09-08
---

# Patterns — Kettlewick

> **Open this before designing a screen.** A pattern is a recurring decision with a rule — one level
> above a component, one below a flow. Add one when the same decision comes up **twice**.

## Always

| Pattern | The situation | The rule | Anti-pattern |
|---|---|---|---|
| **Five states** | any interactive element | default / hover / active / disabled / empty+loading are named before code, not discovered after | shipping the happy path and meeting the rest in a bug report |
| **Empty state** | any list before there is data | say what to do next, and make the action reachable from here | "Nothing here yet." · an illustration with no action |
| **Error copy** | any failure a user can see | say what to do next, not what failed | "Oops! Something went wrong." |
| **Destructive confirm** | delete, revoke, cancel | name the consequence and whether it can be undone | "Are you sure?" |
| **Terminology** | every user-facing string | one word per concept, from the table in `STYLE_GUIDE.md` | *visit* here, *shift* there, *slot* in the text message |

## Element families — seeded the first time a screen had one

### Data display — the one AI-generated UI gets worst

| Pattern | The situation | The rule | Anti-pattern |
|---|---|---|---|
| **Zero / one / many / far too many** | any list of visits | all four are designed, not just "many" | a day view that's beautiful at 6 visits and unusable at 40 |
| **One sort by default, and say which** | the day view | time order, stated | an order the owner has to reverse-engineer |

### Feedback — banners, notifications, badges, progress

| Pattern | The situation | The rule | Anti-pattern |
|---|---|---|---|
| **Severity has four levels and one is enough** | any message to the owner | amber for uncovered, the accent for covered, danger only on the confirm; colour *and* a shape | five shades of alert; red for everything |
| **A badge is a number someone will act on** | a count on navigation | never — principle 1; the day view is the count | an unread count that never clears |

## Ours — patterns this product grew

| ID | Pattern | The situation | The rule | Anti-pattern | Family | Principle | First seen |
|---|---|---|---|---|---|---|---|
| **PAT-1** | Shape before colour | a visit's state anywhere — row, card, paper | a hollow ring, a half-filled ring, a filled disc; colour is the second channel | a coloured dot; a tick icon | feedback | 1 · Calm over urgent | 2026-08-26 |
| **PAT-2** | The act on the row | a visit needs cover; the owner is scanning | the ghost *Ask* sits on the row; it names who will be asked; the row never opens a page | a detail page with the act at the bottom | data display | 2 · The row is the unit | 2026-09-02 |
| **PAT-3** | Ask three, first yes fills | an uncovered visit; the owner taps Ask | the three who could — no ranking, no league table (DEC-003); the first yes fills; the owner confirms | broadcast to everyone; auto-assign; a "best match" score | feedback | 3 · Ask, don't assign | 2026-09-02 |
| **PAT-4** | Say when, after 8pm | anything queued by the 8pm rule (DEC-003) | the screen says the time it will go — "goes out at 7am" — on the carer's card and the owner's day | a silent queue; a disabled control with no reason | feedback | 1 · Calm over urgent | 2026-09-08 |
| **PAT-5** | Rows sit, the card floats | any surface that holds a visit | a row is paper on ground with a bottom rule; only the confirm dialog and the carer's card take `shadow.raised` — border for things that sit, shadow for things that float | a card inside a card; a shadow on every row | layout primitives | 2 · The row is the unit | 2026-09-05 |

## Refused — and why

| Pattern | Why refused | On |
|---|---|---|
| streak counter for carers | engagement-shaped, not value-shaped; a league table by another name (DEC-003) | 2026-08-20 |
| "smart fill" — auto-assign the likeliest carer | the relationship is the product; principle 3 | 2026-08-26 |
| a red badge on the day tab | principle 1; the day view is the count | 2026-09-02 |
