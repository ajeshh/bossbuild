# The brand doc (bundled resource — shared, not owned)

> Loaded **on demand**. Write this to **`docs/BRAND.md`** — note the path: **not** `docs/design/`.

## Why it is not a design document

Brand is upstream of design, not part of it. Design *consumes* it — the accent colour, the type
pairing and the voice in a button all trace back to it — but so do the landing page, the pitch, the
first email, and the words a founder uses in a sales call. **Filing it under `docs/design/` makes it
the designer's, and it isn't.**

> It is closest to the **entrepreneur's** lens: who this is for, what it promises, what it refuses,
> how it sounds. Any lens can grow it, and none of them owns it.

**And it is not marketing.** Marketing is what you *do* with a brand — positioning, channels,
campaigns, the launch. That is downstream, it belongs with `mentor-customers` and `/landing`, and it
has its own artifacts. Collapsing the two is how a brand doc quietly becomes a landing-page brief and
stops being read by everything else.

## Why it starts nascent and stays that way for a while

*"Brand starts early MVP but stays nascent, keeps learning, and then grows."*

So this is a **living document with a capture log**, the same shape `/idea` uses — a *current shape*
at the top that sharpens, and an append-only log underneath that never gets rewritten. It is not a
brand guidelines PDF and must not be allowed to become one before there is anything to guide.

**The failure mode to refuse:** a complete-looking brand document written on day one, from
imagination, that everything downstream then faithfully obeys. A confident answer arrived at with no
information is worse than a blank, because a blank invites a question and a confident answer ends it.
**Write what you actually know; mark the rest unknown and leave it.**

## Who seeds it, which is deliberately not one skill

**Whoever needs it first.** `/landing`, `/pretotype` and `/design-tokens-init` all read it, and
whichever one runs first creates it from the canvas **Promises** cell plus whatever the founder has
already said. Seed it, mark it nascent, say out loud that it is a living doc — then get on with the
thing they actually asked for.

No single owner is the point, not an oversight. A shared artifact with one owning skill becomes that
skill's artifact, and then the other lenses stop writing to it.

```markdown
---
id: brand
type: brand
owner: "@you"          # the founder. No agent owns this — any lens may add to it
status: nascent
updated: {{DATE}}
readers: /landing · /pretotype · /design-tokens-init · /design-review · designer · mentor-customers
---

# Brand — {{PROJECT_NAME}}

> **Living, and yours.** No agent owns this file — `designer`, `mentor-customers`, `/landing` and
> `/pretotype` all read it and any of them may add to the log. The shape at the top sharpens as you
> learn; the log below is append-only.
> Mark anything you don't know yet as `unknown` and leave it — a confident answer arrived at with no
> information is worse than a blank.

## Current shape

- **Who it's for:** <the person, in the words they'd use about themselves>
- **What it promises:** <from the canvas Promises cell — the one thing it's for>
- **What it refuses:** <the thing you will not do, and competitors will. The sharpest line here>
- **How it sounds:** <2–3 traits, each with what you're giving up — "plain over clever" costs you delight>
- **What it is NOT:** <the nearest thing people will mistake it for>
- **The name, and why:** <if it means something, say what. If it doesn't, say that too>

## What we've learned (append-only — never rewrite a row)

The half that makes this a brand rather than a guess. Every row is something that actually happened.

| Date | What happened | What it says about the brand |
|---|---|---|
| {{DATE}} | a user called it "the thing that nags me nicely" | the conscience reads as care, not surveillance — keep that |
| | a competitor comparison someone made unprompted | |
| | a word that landed, or one that got a blank look | |

**Where rows come from:** `/interview` and `/research` debriefs · a support thread · what someone
called it when they explained it to a friend · the phrase that made a stranger nod. **Not from
brainstorming.** A row you invented is the failure mode above, wearing a table.

## Decided

Load-bearing brand calls that earned a `DEC` — the visual anchor from `/design-tokens-init`, a name
change, a positioning shift. Link them; don't restate them.

- <DEC-NNN — the brand anchor: neutral, radius, type pairing, accent, signature>
```

## After seeding

- **It grows from evidence, not from sessions.** The best source is `/interview` and `/research` —
  when a debrief surfaces the words a real person used, that is a row here as well as an `EVID`.
- **`/design-tokens-init` reads it for the anchor**, and the anchor becomes a `DEC`. That is the one
  place brand hardens into a decision, and it is deliberately narrow.
- **`/landing` and `/pretotype` read it for voice and positioning** — and a page generated from a
  nascent brand should *say* it is plainer than it will be, rather than inventing personality to fill
  the gap.
- **`mentor-customers` reads it for positioning**, which is the clearest demonstration that this file
  is not the designer's: the same document feeds the design system and the go-to-market, and neither
  gets to own it.
