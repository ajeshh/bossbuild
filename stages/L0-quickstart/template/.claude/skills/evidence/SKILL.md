---
name: evidence
description: Capture one piece of evidence about your riskiest assumption as a durable EVID-NNN record — paste your notes or describe what happened, and BOSS drafts the file with an HONEST grade on a fixed 3-rung ladder (stated-pain → observed-behavior → commitment). The thing the whole thesis centers on finally gets an object, so a signal from a real conversation stops evaporating into memory. The conscience reads this ledger and goes quieter when real commitments exist. Usage - /evidence [paste notes | describe what happened]
---

# /evidence — evidence as a first-class object

BOSS has an ID for ideas (`IDEA`), features (`FEAT`), decisions (`DEC`), practices (`PRAC`), verdicts
(`RVW`) — but **evidence, the thing the entire thesis centers on, had no object.** So when a founder took
the conscience's best line — *"a 15-minute call with the right person beats `/canvas`"* — and did the
call, the result had nowhere to live. It evaporated, and three weeks later the riskiest assumption was
still arguing from vibes.

`/evidence` fixes that. One signal → one file → a place the conscience can actually see.

## What it does

You paste raw notes (or describe what happened); BOSS drafts `docs/evidence/EVID-NNN-<slug>.md` with an
honest grade, links the canvas assumption it bears on, and shows it to you before saving.

## The 3-grade ladder (fixed — three rungs, blunt on purpose)

The grade is the load-bearing field. Its power is its bluntness — resist growing the taxonomy.

- **`stated-pain`** — someone *said* it hurts. Weakest. The Mom Test warns talk is nearly free.
- **`observed-behavior`** — you *watched* them struggle, reach for a workaround, or bounce. Behavior
  beats opinion.
> 🔴 **Desk research is not evidence, and there is no rung for it.** All three grades describe **what
> a person did** — so a competitor's pricing page, a market-size estimate or an industry article has
> no honest place on this ladder ([[DEC-008]]). It is not a loose fit; there is no rung it could
> occupy. **And the reason it matters is downstream: the conscience reads this ledger and goes quieter
> when commitments exist** — so filing research here would let an afternoon of googling silence the
> exact nudge that exists to push you toward a real conversation, while the riskiest assumption stayed
> untested. Research lives in the artifact it informs (`docs/competition/`, a canvas cell) with a
> **source URL and the date you checked it**. It can *motivate* an `EVID` — "three rivals charge $40,
> so go ask someone what they'd pay" — but it never becomes one. If research raised a real question,
> the honest next step is `/interview`.

- **`commitment`** — they gave up something real: **time, money, reputation, a calendar slot.** The only
  grade that cost the other person something.

**Grade honestly, and push back on inflation.** If the founder writes *"they said they'd totally use
it"* → that's `stated-pain`, not `commitment`. Say so plainly, once: *"'I'd totally use this' is
stated-pain — a compliment, not a receipt. A commitment is when they gave up time, money, or a slot.
Want me to grade it stated-pain?"* Then take their call. You surface the honest read; you don't overrule
them.

## How to run it

1. **Read what the founder gave you.** Notes from a call, a description of something you watched, a
   metric, a pretotype result. If they gave you nothing, ask one question: *"What happened, and who was
   it with?"* — don't block.

2. **Pick the next number.** Look in `docs/evidence/` for the highest `EVID-NNN`; add one (skip the
   `README.md`). First one is `EVID-001`. Create the directory if it doesn't exist. (Same next-number
   logic `/decide` uses for `DEC` files.)

3. **Resolve the owner** (whoever captured it). Use their GitHub handle if it resolves, else `@you` —
   never fabricate:

   ```bash
   gh api user --jq '.login' 2>/dev/null || git config user.name
   ```

4. **Grade it — the one judgment that matters.** Map what happened to exactly one rung. When in doubt,
   grade *down*: a signal you're unsure about is weaker than you hope, not stronger. Name the specific
   thing that would raise the grade (*"if she'd actually booked the call, that's commitment"*).

5. **Link the assumption.** If a canvas exists (`docs/ideas/*-canvas.md`), read its riskiest-assumption
   line and put a short phrase of it in `assumption:`. If none exists, ask the founder which bet this
   bears on in one sentence — don't block.

6. **Draft the file, show it, then save:**

   ```markdown
   ---
   id: EVID-NNN
   type: evidence
   owner: "@<login>"
   status: active
   date: {{today}}
   source: <who / where — a person, a session, a metric>
   method: interview        # interview | observation | pretotype | metric | commitment-test
   grade: stated-pain       # stated-pain | observed-behavior | commitment
   assumption: <the canvas riskiest assumption this bears on, in a phrase>
   ---

   # EVID-NNN — <one-line summary of the signal>

   <≤10 lines. What actually happened, in plain words. No spin, no rounding up.
   If you pitched instead of listened, say so — that context matters to future-you.>
   ```

## Guardrails

- **Never a score, never a dashboard-of-shame.** You're writing down a fact, not filling a meter. No
  "validation level 3/10." Counts and grades are facts shown once in context.
- **Grades are fixed and few (3).** Don't invent `warm-lead` or `soft-commit`. The ladder's power is that
  it's blunt.
- **Not a CRM.** No contact management, no pipeline, no scheduling. One signal, one file.
- **The body stays ≤10 lines.** Evidence is a signal, not a transcript. (Keep the full transcript in
  `docs/source/` via `/import` if you want it.)

## Why it's worth the minute

It closes BOSS's epistemic loop: the conscience asks for evidence → you act → **the evidence lands
somewhere the conscience reads** → the conscience calibrates (and gets specific: *"three stated-pain
signals, zero commitments — what would a commitment test look like?"*). Related: **`/interview`** preps a
call and debriefs it straight into `EVID` files; **`/canvas`** cites the `EVID` ids bearing on its
riskiest assumption.
