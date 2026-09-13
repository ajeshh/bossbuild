---
name: comp-eval
description: Find out who else is solving this, and keep knowing. Researches the competitive field for {{PROJECT_NAME}} (features, pricing, the honest "why they might win") into a living set under docs/competition/. Every claim carries a source URL and checked date, or is marked unverified. Usage - /comp-eval [<space> | add]
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

**Read their 1–2★ reviews before you write `where they're weak` (v0.294.0).** A rival's public
complaints are the cheapest pain evidence you did not have to run an interview for — real people,
in their own words, saying what the current fix fails at. That is the *Problem* cell's raw material
and it is lying in the open. Quote two or three, dated and linked like everything else here, and
resist the pull to read their **praise**: what their users love is a list of features to match,
which is the parity trap this skill exists to keep you out of. Complaints tell you where the field
is weak. Praise tells you what they built. Only one of those is yours to use.

### `add <name>` — the founder heard about one
The common case, and the reason this is a living set rather than a report. Take the name, research
that one, file it into the same shape. **No regeneration of the others** — their `checked` dates are
theirs, and silently refreshing them would erase the record of what was actually verified when.

**Then say what the twist is, against *this* bet (v0.294.0).** A rival filed in isolation is a
fact; a rival read against the canvas's Promises cell is an answer. Two things, both short:

- **Sort it — in evidence, or a watch.** Does any `EVID` record name them — did a real person say
  *"I use X for this"*? If yes, they are on the shortlist and the `why they might win` line is
  load-bearing. If nobody has, mark the row **`watch`**: real, filed, not yet in anyone's mouth.
  Positioning against a rival nobody you talked to has heard of waters down the positioning you
  have (Dunford's *phantom competitor*, and it is the commonest way a field gets padded). **A label,
  not a gate** — the row is written either way, and a `watch` row that later gets named flips.
- **If the twist lands on the differentiator, say so and offer the test.** When what makes them
  different is the same thing that makes you different, the honest demand question changes from
  *"would you use this?"* to **`/pretotype`'s *"would you switch?"*** — and sometimes the honest
  output is *"buy the thing."* Offer that here, in the moment, rather than leaving it as a pointer
  in the rules for the founder to find later. **Do not wait for an EVID to say it** — a solo founder
  who finds an exact-match, funded rival before any user names it should reconsider *now*; that is
  the one case where the `watch` label and the re-aim question part company on purpose.

### `recheck [<name>]` — re-verify what's gone stale
Re-check the named rival, or every row past the staleness threshold. Report **what changed**, not
just the new value: *"Beta was $29, is now $39"* is the signal; the current number alone isn't.

## How deep to go — the research, not just the table (v0.294.0)

Everything above says what to *write*. This says what to *open*, because a comp eval that reads one
rival's homepage and fills a table is a table with a rival's marketing in it. **Per rival, in this
order, and stop when the founder's question is answered — not when the list is exhausted:**

1. **Their own words first** — homepage, the positioning line, who they say it's for. Quote it;
   don't paraphrase. What a company *claims* to be is a fact about them even when it isn't true.
2. **The pricing page, opened.** Every tier, what gates each one, what "contact sales" hides.
   `checked` date on every cell.
3. **The docs or help center — this is where the product actually is.** Marketing says what a
   feature *is*; docs say what it *does*, what it asks the user for, its limits, its defaults, the
   edge cases they wrote a help article about because people hit them. **If you only open one
   thing beyond the pricing page, open this.** A "how they do it" entry written from marketing
   copy is a guess with a citation.
4. **The changelog or release notes** — what they shipped in the last six months tells you what
   they are investing in, and how fast they move. A rival with monthly releases and one with a
   changelog last touched in 2024 are different rivals with the same feature list.
5. **The product itself, if there's a free tier or a demo.** Sign up. Click through the thing you
   care about. Ten minutes in the real product beats an hour of reading about it, and it is the
   only way to catch the gap between the docs and the build.
6. **Reviews — 1–2★ for `where they're weak` and `## Where it breaks`.** The complaints are pain
   evidence in the users' own words. (4–5★ reviews are read *only* under the rule in step 7.)
7. **Their community, if any** — a forum, a Discord, GitHub issues if it's open. This is where
   the workarounds live, and a workaround is a feature request that already has a shape.

**Then, for the features that matter — and only those — write `## How they do it`.** Not every
feature. The three to five that touch this founder's bet: the differentiator, and whatever is being
specced right now. For each, one short entry: the **flow** (what steps, in what order), the
**defaults** (what happens if the user does nothing), what they **ask for vs do automatically**,
the **limits** (plan gates, counts, the thing the help article exists for), and **what their users
have come to expect** — this is the one place 4–5★ reviews are read, because *"I love that it
just…"* is the expectation your version will be measured against.

> **This entry is read by `/spec`, after a feature is decided, as design reference.** It is never
> read to decide *what* to build — that is `/roadmap`'s job and this file has no vote there. The
> line is timing: after the decision, this sharpens the FEAT; before it, it is the parity trap.
> A founder who reads `How they do it` for a feature they have not decided on has opened the wrong
> file, and the honest move is to say so.

**Cite what you opened, not what you inferred.** A docs page, a changelog entry, a screenshot you
took, a review with its date — each entry says which. "Their pricing page suggests…" is inference;
"their pricing page says (checked 2026-09-11)…" is a fact. Both are allowed; they are labelled
differently, and the label is not decoration.

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
open questions, and — as of v0.294.0 — two sections `/spec` opens:

- **`## Where it breaks`** — the specific things their users complain about, dated and linked,
  one line each. Read into *what wrong looks like*. A rival's known breakages are the cheapest
  source of failure modes there is.
- **`## How they do it`** — per feature that matters, the flow, defaults, limits, and what their
  users expect. Read into the FEAT's **Flow** and *Assumptions* **after** the feature is decided,
  as design reference. Written only for the three-to-five features that touch this founder's bet,
  never as a catalog — a catalog is a feature matrix with extra steps, and this file has no vote
  in `/roadmap`.

`/landing` reads the positioning quotes; `/pretotype` reads the `watch`/in-evidence sort. There is
no feature-comparison matrix and there is not going to be one; the by-feature knowledge lives in
each rival's file, keyed to features already decided.

## How it connects

- **The canvas's Problem cell** asks *who else is selling a fix, and why might they win.* This is
  where that answer lives — cite `docs/competition/` from the cell rather than duplicating it.
- **`mentor-capital`** reads this when the raise question is live; *"who else is doing this"* is
  something an investor asks in the first ten minutes.
- **`/pretotype`** — if a rival already does exactly this, the honest demand test may be *"would you
  switch?"* rather than *"would you use it?"* As of v0.294.0 `/pretotype` **reads this field** when
  it picks a pattern, and `add` offers the switch test in the moment — this stopped being a one-way
  pointer.
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
