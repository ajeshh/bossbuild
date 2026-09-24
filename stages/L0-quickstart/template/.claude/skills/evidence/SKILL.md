---
name: evidence
description: Write down what a real person told you, graded honestly, as EVID-NNN records. One thing that happened, your notes from a call, or a whole transcript - it reads the size and does the right amount (a record, a debrief with the one moment you pitched, or a synthesis of pains, jobs and objections). Ladder - stated-pain, observed-behavior, commitment. Usage - /evidence [what happened | notes | transcript]
---

# /evidence — evidence as a first-class object

BOSS has an ID for ideas (`IDEA`), features (`FEAT`), decisions (`DEC`), practices (`PRAC`), verdicts
(`RVW`) — but **evidence, the thing the entire thesis centers on, had no object.** So when a founder took
the conscience's best line — *"a 15-minute call with the right person beats `/canvas`"* — and did the
call, the result had nowhere to live. It evaporated, and three weeks later the riskiest assumption was
still arguing from vibes.

`/evidence` fixes that. What a real person said → graded records → a place the conscience can see.

## Read the size, do the right amount

What decides the work is **how much the founder handed over**, not which verb they typed. One verb,
and it reads what it was given:

| You gave it | What it does |
|---|---|
| **one thing that happened** — a sentence, a metric, a pretotype result, a thing you watched | **a record** — one `EVID`, graded, linked to the bet. Two minutes. |
| **your notes from a call** you just had — a page or less, raw | **a debrief** — every real signal graded, the *one* moment you pitched instead of listened, the one follow-up ask that would raise the grade, and an offer to fold it into the persona |
| **a whole transcript** — a recording turned to text, a sales call, a support thread, a pile of user messages, more than a page | **a digest** — signals graded at scale, then the product context underneath (the pain in their words, the job, the workarounds, the objections, who this actually was), the places you led the witness, and the next test |

Two things are *not* this verb, and you say so in one line:

- **A conversation that hasn't happened yet** — *"I'm meeting someone Thursday"* → **`/interview`**
  preps it as one printable page. That is the only thing `/interview` does now, and it is the half the
  conscience actually points at.
- **Something you read** — a pricing page, a market estimate, an article → **no rung fits.** See the
  red block under the ladder; it never becomes evidence, at any size.

## The one rule

**BOSS writes down what the person said. It never fabricates.** No invented quotes, no inferred
commitment the words don't support, no rounding "sounds interesting" up to "wants to buy." If they
didn't say it, it isn't evidence. This is where BOSS's synthetic-vs-real honesty is enforced
mechanically — the grade says exactly how strong each signal is.

## The 3-grade ladder (fixed — three rungs, blunt on purpose)

The grade is the load-bearing field. Its power is its bluntness — resist growing the taxonomy.

- **`stated-pain`** — someone *said* it hurts. Weakest. The Mom Test warns talk is nearly free.
- **`observed-behavior`** — you *watched* them struggle, reach for a workaround, or bounce — or they
  described a real past action. Behavior beats opinion.
- **`commitment`** — they gave up something real: **time, money, reputation, a calendar slot.** The only
  grade that cost the other person something.

> **Desk research is not evidence, and there is no rung for it.** All three grades describe **what
> a person did** — so a competitor's pricing page, a market-size estimate or an industry article has
> no honest place on this ladder. It is not a loose fit; there is no rung it could
> occupy. **And the reason it matters is downstream: the conscience reads this ledger and goes quieter
> when commitments exist** — so filing research here would let an afternoon of googling silence the
> exact nudge that exists to push you toward a real conversation, while the riskiest assumption stayed
> untested. Research lives in the artifact it informs (`docs/competition/`, a canvas cell) with a
> **source URL and the date you checked it**. It can *motivate* an `EVID` — "three rivals charge $40,
> so go ask someone what they'd pay" — but it never becomes one. If research raised a real question,
> the honest next step is `/interview`.

**Grade honestly, and push back on inflation — out loud, once.** *"'I'd totally use this' is
stated-pain — a compliment, not a receipt. A commitment is when they gave up time, money, or a slot.
Want me to grade it stated-pain?"* Then take their call. You surface the honest read; you don't overrule
them. When in doubt, grade *down*, and name the specific thing that would raise the grade.

## A record — one thing that happened

1. **Read what the founder gave you.** If they gave you nothing, ask one question: *"What happened, and
   who was it with?"* — don't block.
2. **Pick the next number.** Look in `docs/evidence/` for the highest `EVID-NNN`; add one (skip the
   `README.md`). First one is `EVID-001`. Create the directory if it doesn't exist. (Same next-number
   logic `/decide` uses for `DEC` files.)
3. **Resolve the owner** (whoever captured it). Their GitHub handle if it resolves, else `@you` —
   never fabricate:

   ```bash
   gh api user --jq '.login' 2>/dev/null || git config user.name
   ```

4. **Grade it** — the one judgment that matters (see the ladder).
5. **Link the assumption.** If a canvas exists (`docs/ideas/*-canvas.md` or `docs/ideas/CANVAS.md`),
   read its riskiest-assumption line and put a short phrase of it in `assumption:`. If none exists, ask
   the founder which bet this bears on in one sentence — don't block.
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
   about: <optional — what this is research ON, by name: a component (`Button`), a pattern (`PAT-2`), a flow, a canvas cell. The design space shows it on that object; the name does the linking, nothing else>
   ---

   # EVID-NNN — <one-line summary of the signal>

   <≤10 lines. What actually happened, in plain words. No spin, no rounding up.
   If you pitched instead of listened, say so — that context matters to future-you.>
   ```

## A debrief — notes from a call

Do these in order, briefly. Each signal becomes a record exactly as above; batch the drafts, show them,
save on the founder's OK. One call can yield several — don't force one.

1. **Extract every real signal, honestly graded.** Definitions inline the first time, so the founder
   learns the ladder by using it.
2. **Flag AT MOST ONE pitched-instead-of-listened moment.** Fitzpatrick's taxonomy — *compliments*
   ("sounds cool!", usually right after you explained a feature = a compliment, not evidence), *fluff*
   (generic future talk: "I'd definitely…", "I always…"), *deflection*. Name the single clearest one,
   plainly: *"They said 'I'd totally use that' right after you described the feature — that's a
   compliment, not a signal. Next time, don't describe it; ask what they do today."* **Observe, don't
   scold.** Skip it entirely if the call was clean.
3. **Name the one follow-up commitment ask — only if the pain looked real.** The single next commitment
   that would raise the grade (*"she described the Monday scramble in detail — ask if she'll show you
   next Monday's actual spreadsheet. A yes is observed-behavior, not stated pain."*). If the pain didn't
   show up, say so — a useful result, not a failure. **Shape the ask to why they are building this** —
   `motivation:` on the IDEA doc. `revenue` → money or a slot (*"would you pre-pay for the first
   month?"*). `community` → return (*"will you come back Tuesday and bring one person?"*). `learning` or
   `own-problem` → there may be no ask at all, and saying so is the honest debrief. `credibility` → a
   public one (*"would you say that on the record?"*). Unset → the default above.
4. **Offer to fold it into the persona.** If `docs/personas/` holds one, offer `/persona enrich <slug>`
   with what the call actually showed — the source that shrinks the synthetic share fastest, and the
   whole point of having gone. Offer it; never do it silently. The founder should see which parts of
   their assumed user just got contradicted.

## A digest — a whole transcript

1. **Get it in.** Pasted, use it. A file or URL, pull it into `docs/source/` first (`/import` — a
   durable copy) and read from there. If it's long, read all of it before extracting — signals hide in
   the back half.
2. **Extract graded evidence at scale** — each real signal a record as above. Batch, show, save on OK.
3. **Synthesize the product context — what it all means.** Above the individual signals, a short plain
   summary (offer to write it into the canvas, seed the venture brain's `read.md` so the conscience
   carries it forward, and fold it into the persona):
   - **The pain, in their words** — quote *verbatim*. The exact phrasing is the copy you'll write later
     and the language your user actually uses; don't paraphrase it into marketing-speak.
   - **The job they're hiring for** — what were they actually trying to get done?
   - **Workarounds observed** — what do they do *today*? A painful workaround is the strongest
     product-context signal there is — proof the pain is worth effort.
   - **Objections & non-needs** — what did they push back on, or shrug at? The "didn't care" is as
     valuable as the "loved it."
   - **Who this actually was** — does the real person match the target user, or is the segment off?
4. **Flag the epistemics — where you led the witness.** The same taxonomy as a debrief, at transcript
   scale: moments the founder pitched and then recorded the polite reaction as validation, leading
   questions, hypotheticals answered as if fact. The **two or three clearest**, one spare line each.
5. **Point at the next test.** If a pain looks real but under-proven (all stated-pain, no commitment),
   name the one cheapest test that would raise the grade — often a follow-up commitment ask, sometimes
   `/prototype` to watch them use it. Hand the decision back.
6. **Offer the persona fold** as in a debrief. A transcript is the **strongest enrichment source that
   exists** — real research outweighs your own knowledge, which outweighs online averages. No persona
   yet, but the transcript clearly describes one kind of person? Offer `/persona derive` instead.

## Guardrails

- **Never fabricate.** Analysis, not invention. Verbatim is sacred: the moment you paraphrase a pain
  into your own framing, you've contaminated the signal.
- **Never a score, never a dashboard-of-shame.** You're writing down facts, not filling a meter. No
  "validation level 3/10." A transcript full of "sounds great" is a transcript full of stated-pain —
  say so plainly; volume is not strength.
- **Grades are fixed and few (3).** Don't invent `warm-lead` or `soft-commit`.
- **Not a CRM, not a coding-of-qualitative-data tool.** No contact management, no pipelines, no
  affinity diagrams, no theme-count dashboards. Signals → grades → context → the next test.
- **The pitch-detector flags, it doesn't scold.** One observation per debrief; two or three per digest.
- **A record's body stays ≤10 lines.** Evidence is a signal, not a transcript. The transcript itself
  lives in `docs/source/`.
- **Downstream of the real thing.** This writes down research you *did*. It is not a substitute for
  doing it — if the conversations stop coming, the honest move is another conversation, not another
  pass over the old ones.

## Why it's worth the minute

It closes BOSS's epistemic loop: the conscience asks for evidence → you act → **the evidence lands
somewhere the conscience reads** → the conscience calibrates (and gets specific: *"three stated-pain
signals, zero commitments — what would a commitment test look like?"*). Related: **`/interview`** preps
the call this verb debriefs; **`/canvas`** cites the `EVID` ids bearing on its riskiest assumption.
