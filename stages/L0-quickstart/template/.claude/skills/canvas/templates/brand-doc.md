# The brand doc (bundled resource — shared, not owned)

> Loaded **on demand**. Write this to **`docs/BRAND.md`** — note the path: **not** `docs/design/`.
> It lives beside `/canvas` because that's where the brand usually starts, and because Quickstart
> skills stay on disk at every rung. `/pretotype`, `/design-tokens-init` and `/landing` all point here.

## Why it is not a design document

Brand is upstream of design, not part of it. Design *consumes* it — the accent colour, the type
pairing and the voice in a button all trace back to it — but so do the landing page, the pitch, the
first email, and the words a founder uses in a sales call. **Filing it under `docs/design/` makes it
the designer's, and it isn't.**

> It is closest to the **entrepreneur's** lens: who this is for, what it promises, what it refuses,
> how it sounds. Any lens can grow it, and none of them owns it.

**And it is not marketing.** Marketing is what you *do* with a brand — positioning, channels,
campaigns, the launch. That is downstream, it belongs with the go-to-market work (`/landing`, and the customers mentor once MVP is unlocked), and it
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

**Whoever needs it first.** Usually that's `/canvas`: once Problem, Promises and Story are written, it
seeds a nascent doc (who it's for, what it promises, the story in one line) so the brand starts
with the venture, not with the first page. `/landing`, `/pretotype` and `/design-tokens-init` all
read it, and if none has created it yet, whichever runs first does, from the canvas **Promises** cell
plus whatever the founder has already said. A later seeder fills in the skeleton's missing sections
and never rewrites a line already written. Seed it, mark it nascent, say out loud that it is a living doc — then get on with the
thing they actually asked for.

No single owner is the point, not an oversight. A shared artifact with one owning skill becomes that
skill's artifact, and then the other lenses stop writing to it.

```markdown
---
id: brand
type: brand
owner: "@you"          # the founder. No agent owns this — any lens may add to it
status: nascent         # nascent | active — the brand doc's own two words (docs/IDS.md); only you flip it
updated: YYYY-MM-DD
readers: /canvas · /landing · /pretotype · /design-tokens-init · /design-review · boss playbook · boss design · the design and customer mentors, from MVP
tagline: unknown          # one line, when there is one — the pages carry it under the name
story: unknown            # the story in one line, yours: "<this> AND <this>, BUT <the problem>, THEREFORE <what you do>" — the cover and slide one carry it
accent: unknown           # the one owned colour, as hex, once /design-tokens-init's anchor chooses it
logo: unknown             # path to the mark (.svg) when there is a file — no file, no drawing, never a placeholder
---

# Brand — {{PROJECT_NAME}}

> **Living, and yours.** No skill or agent owns this file — `/canvas`, `/pretotype`, `/landing` and the
> design and customer mentors all read it and any of them may add to the log. The shape at the top sharpens as you
> learn; the log below is append-only.
> Mark anything you don't know yet as `unknown` and leave it — a confident answer arrived at with no
> information is worse than a blank.

## Current shape

- **Who it's for:** <the person, in the words they'd use about themselves>
- **What it promises:** <from the canvas Promises cell — the one thing it's for>
- **What it refuses:** <the thing you will not do, and competitors will. The sharpest line here>
- **How it sounds:** <2–3 traits, each "X, not Y", with what it costs you — "plain, not clever"
  costs you delight>
  - *Example:* <optional — one real sentence you wrote that got a reaction, and where it came from
    (`— EVID-NNN`). Traits alone don't carry a voice; one true example does. Leave it out until you
    have one>
- **What it is NOT:** <the nearest thing people will mistake it for>
- **What they use instead today:** <what your person does about this now, without you — the phone
  tree, a spreadsheet, a rival, nothing. From `/interview`, in their words>
- **The name, and why:** <if it means something, say what. If it doesn't, say that too>

**Where each line comes from.** End a line with what backs it — `— EVID-NNN`, `— DEC-NNN`, a
learned-row date, or `— belief`. A page, a deck or a pitch can then lift the lines that something
backs and say the beliefs are beliefs. A line with no pointer reads as a belief.

## Origin, as it happened

How it really started — dated, plain, and the honest motive. **Nothing here that a witness would
dispute.** Origin stories get checked, and a polished one that turns out to be marketing costs more
than a plain one ever earns. If it started with an itch at work, say that; nobody needs a garage.

- <YYYY-MM-DD — what happened, who was there, what you noticed>

## How we build

The values — one headline each, then what it means in practice and what it costs you. Three is
plenty; a value with no cost is a slogan. `boss playbook` renders each as a page-sized block under
**Values**; the canvas Principles cell stays the short form.

- **<headline>** — <what it means, in one or two sentences you would say out loud>. *Costs:* <what
  you give up to hold it>.

## What we've learned (append-only — never rewrite a row)

The half that makes this a brand rather than a guess. Every row is something that actually happened.

| Date | What happened | What it says about the brand |
|---|---|---|
| YYYY-MM-DD | ★ a user, two weeks in, called it "the thing that nags me nicely" — EVID-NNN | the conscience reads as care, not surveillance — keep that |
| | a competitor comparison someone made unprompted | |
| | a word that landed, or one that got a blank look | |

**Where rows come from:** `/evidence` debriefs and digests · a support thread · what someone
called it when they explained it to a friend · the phrase that made a stranger nod. **Not from
brainstorming.** A row you invented is the failure mode above, wearing a table.

**Their words get quoted, so write the row so a quote can travel.** `boss playbook` puts the
words in quotation marks on the Brand chapter, and a deck or a landing page can lift them. So:
- **Quote exactly**, inside the quotation marks. No tidying.
- **Credit by role, not by name.** Write *an owner, nine-carer agency*, never *Sarah at Brightcare*,
  unless that person said yes to being named; then write their name and `(named with consent)`.
- **End the row with where it came from** (`— EVID-NNN`, `— interview 2026-06-04`, `— support
  thread`), so anyone reading the page can trace the quote back to the study or the insight.
- **Star the key ones.** Start the row with ★ when those are the words to lead with. Starred rows
  are shown large; the rest smaller. With nothing starred, the newest lead.

**When the shape itself changes, log the change here too.** Rewrite the line in *Current shape*,
then append a row whose third column starts `shape:` or `voice:` and says what it was and why it
moved — `voice: plain over playful (was: playful) — two users read the jokes as not taking their
data seriously`. Git keeps the diff; only this row keeps the *why*, and the why is the brand. The
playbook reads these rows as the brand's history.

## Decided

Load-bearing brand calls that earned a `DEC` — the visual anchor from `/design-tokens-init`, a name
change, a positioning shift. Link them; don't restate them.

- <DEC-NNN — the brand anchor: neutral, radius, type pairing, accent, signature>
```

## After seeding

- **It grows from evidence, not from sessions.** The best source is `/interview` and `/evidence` —
  when a debrief surfaces the words a real person used, that is a row here as well as an `EVID`.
- **`/design-tokens-init` reads it for the anchor**, and the anchor becomes a `DEC`. That is the one
  place brand hardens into a decision, and it is deliberately narrow.
- **`/landing` and `/pretotype` read it for voice and positioning** — and a page generated from a
  nascent brand should *say* it is plainer than it will be, rather than inventing personality to fill
  the gap.
- **The customers mentor reads it for positioning** (from MVP), which is the clearest demonstration that this file
  is not the designer's: the same document feeds the design system and the go-to-market, and neither
  gets to own it.
