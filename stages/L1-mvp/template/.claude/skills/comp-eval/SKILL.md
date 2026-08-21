---
name: comp-eval
description: Find out who else is solving this, and keep knowing. Researches the competitive field for {{PROJECT_NAME}} — features, pricing, differentiators, and the honest "why they might win" — then files it as a living set under docs/competition/ you add to over time. Name a space and it goes looking; name a rival you heard about and it evaluates that one into the same table. Every claim carries a source URL and the date it was checked, or it is marked unverified — because a confidently invented price is the failure mode here. Usage - /comp-eval [<space or problem> | add <name> | recheck [<name>]]
---

# /comp-eval — who else is solving this, and what would make them win

The one business question you **cannot** answer out of your own head. Every other cell on the canvas
asks something you know or could work out; *"who else is selling a fix?"* has a tail you are
structurally blind to, and that tail is where the unpleasant surprise lives.

> **What it is:** a standing, growing picture of the field, with sources attached.
> **What it isn't:** a scoreboard you win. If every row ends in *"…but we're better,"* you drew the
> landscape instead of looking at it, and the exercise has told you nothing.

## Step 0 — does it already exist, and is this the right rung?

Look for `docs/competition/` before making one. If it's there: say so and **work from it** — add,
recheck, or sharpen. Never quietly generate a second field.

**Rung: MVP.** Earlier than that, the canvas's Problem cell already asks the right-sized version
(*what do they use today instead*). If this project is at Quickstart, answer it there and come back —
**though if the founder's real question is "does this already exist?", that is a build-or-buy
question and the canvas has a cell for it.** Say so rather than running a full field survey.

## Modes

### `<space or problem>` — go find them (the default)
Search the field for anything a person with this problem might use instead. Cast wider than
products:

- **Direct** — tools built for this exact job.
- **Adjacent** — tools built for something else that people bend into this job.
- **The unglamorous ones that actually win most often** — a spreadsheet, an agency, an intern, a
  WhatsApp group, a paper form. *These beat software constantly and almost never appear on a
  competitive slide.*
- **Doing nothing.** Always a row. Often the incumbent. If the pain is survivable, "nothing" is what
  you are really up against, and no feature list beats it.

For each: what it does, **what it costs**, who it's for, and where it's weak. Then the bar below.

### `add <name>` — the founder heard about one
The common case, and the reason this is a living set rather than a report. Take the name, research
that one, file it into the same shape. **No regeneration of the others** — their `checked` dates are
theirs, and silently refreshing them would erase the record of what was actually verified when.

### `recheck [<name>]` — re-verify what's gone stale
Re-check the named rival, or every row past the staleness threshold. Report **what changed**, not
just the new value: *"Beta was $29, is now $39"* is the signal; the current number alone isn't.

## 🔴 The honesty bar — this is the whole skill

**A confidently invented price is the failure mode here, and it is a very easy one to hit.** A model
will produce plausible tier names and dollar figures for a product it half-remembers, and the founder
will paste them into a deck.

1. **Every factual cell carries a source URL and a `checked` date, or it says `unverified`.** No
   "approximately," no "around $50," no remembered pricing. **If you did not open the page, you do
   not know the price.**
2. **"Contact sales" is an answer** — record it as *not public*, because opaque pricing is itself a
   differentiator and tells the founder something real about who that rival sells to.
3. **Every rival gets a `why they might win` line, and it must be honest.** Not a strawman. If you
   cannot write a real one, that is a finding: either you don't understand them yet, or they are not
   actually a competitor.
4. **Name what you did not find.** Spaces you couldn't search well, rivals you know exist but
   couldn't verify, regions you didn't cover. A field survey that reports only what it found reads
   as complete when it isn't.
5. **Stale rows say so.** Anything past ~90 days renders with its age. Competitor pricing moves
   monthly; a table that hides its own age will get quoted into a pitch six months late.

## What it writes

```
docs/competition/
  README.md          # the table — one row per rival, with checked dates
  <slug>.md          # one per rival: the detail, the sources, what changed when
```

`README.md` holds the comparison:

| Rival | What it is | Pricing | Why they might win | Where they're weak | Checked |
|---|---|---|---|---|---|
| Acme | direct — team plans | $49/user/mo ([src](#)) | owns the integration everyone needs | slow, no API | 2026-08-20 |
| A spreadsheet | the real incumbent | free | zero learning curve, infinitely flexible | breaks past ~5 people | 2026-08-20 |

Each `<slug>.md` carries the depth a table can't: what they actually do, quotes from their own
positioning, what changed at each recheck (dated, append-only — **the drift is the interesting part**),
and open questions.

## How it connects

- **The canvas's Problem cell** asks *who else is selling a fix, and why might they win.* This is
  where that answer lives — cite `docs/competition/` from the cell rather than duplicating it.
- **`mentor-capital`** reads this when the raise question is live; *"who else is doing this"* is
  something an investor asks in the first ten minutes.
- **`/pretotype`** — if a rival already does exactly this, the honest demand test may be *"would you
  switch?"* rather than *"would you use it?"*
- **The canvas's Build-or-buy cell** — sometimes this skill's real output is *"buy the thing."* Say
  it plainly when it's true; that is a complete outcome, not a failed survey.

## Rules

- **Sources or silence.** Unsourced facts don't enter the table.
- **Add, don't regenerate.** The set grows; existing rows keep their own verification dates.
- **No scoreboard.** No composite scores, no "leader" quadrant. The founder reads the field and
  decides; a number that ranks rivals is a judgement wearing arithmetic.
- **Not a tracker.** No pipelines, no alerts, no monitoring daemon. This is a view you refresh
  deliberately, not a service that watches the market for you.
- **"Doing nothing" is always a row.**
