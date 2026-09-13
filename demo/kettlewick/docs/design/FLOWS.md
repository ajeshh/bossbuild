---
id: flows
type: design
owner: designer
status: active
updated: 2026-09-08
---

# Flows — Kettlewick

> **Open this before designing a screen that sits in a sequence.** A flow composes with the ones
> already here; it does not invent a new navigation model. One row per flow, the detail in its FEAT.

| Flow | Entry | Steps | Ends at | Owned by |
|---|---|---|---|---|
| Find cover for a visit | the uncovered row | 3 | the visit is covered and the owner has confirmed | `FEAT-001` |
| Answer an ask | the carer's phone | 1 | a yes or a not-this-one, one thumb | `FEAT-002` |
| Import the week | the owner's spreadsheet | 2 | Monday's visits on the day view | `FEAT-004` |

---

## Find cover for a visit · `FEAT-001`

**Happy path**

| # | Step | Asks the user for | Why it's needed *now* |
|---|---|---|---|
| 1 | tap *Ask* on the row | nothing — the three are chosen | the visit is uncovered and the owner is looking at it |
| 2 | wait for the first yes | nothing | the carers answer; the row's chip says *asked* |
| 3 | confirm the yes | one tap | the owner stays the one who decides (principle 3) |

| Cut | Why |
|---|---|
| a note to the carers | asked for in the first version; nobody wrote one — the visit's time and client are the note |
| pick which three | the owner ranked carers in her head, which is the league table DEC-003 refuses; the three are the ones who could |

**First-run path** — the owner has no carers in Kettlewick yet: step 1 is the empty state with one action, *Add your carers*, and the ask waits until three exist.

**Failure path** — nobody says yes by the time the owner set: the row says *no cover yet — ask three more*, and nothing already sent is lost; the three who were asked are not asked twice.

## Answer an ask · `FEAT-002`

**Happy path**

| # | Step | Asks the user for | Why it's needed *now* |
|---|---|---|---|
| 1 | yes / not this one | one tap | the ask is the whole screen; anything else is the owner's |

| Cut | Why |
|---|---|
| a reason for no | a carer's reason is theirs; the owner never sees it, so it was never needed |

**First-run path** — the carer has never opened the app: the ask card is the first screen, with the owner's name on it; no sign-up before the answer.

**Failure path** — the visit was covered by someone else before the tap: the card says who, and the tap does nothing harmful.

## Import the week · `FEAT-004`

**Happy path**

| # | Step | Asks the user for | Why it's needed *now* |
|---|---|---|---|
| 1 | paste the week from the spreadsheet | the sheet as it is | the rota stays the spreadsheet (DEC-002); this is the only way in |
| 2 | check the day | a glance | the parse is shown as rows before it becomes the day |

| Cut | Why |
|---|---|
| map the columns by hand | the first nine sheets all had time · client · carer in some order; the parse guesses and step 2 catches it |

**First-run path** — an empty sheet: step 2 is the empty state — "Nothing to import yet."

**Failure path** — a row the parse can't read: it stays on the check screen marked *couldn't read*, the rest import, nothing typed is lost.
