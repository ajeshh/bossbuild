---
name: research
description: Turn a real research transcript into product context and graded evidence. Paste (or point at) an interview transcript, a sales call, a support thread, a batch of user messages — anything real a person said — and BOSS extracts honestly-graded EVID records at scale, synthesizes the pains / jobs / verbatim words / workarounds / objections into product context (feeding the canvas and the venture brain), and flags where the witness got led instead of listened to. BOSS analyzes what's in the transcript; it never invents quotes or infers commitment that isn't there. The sibling of /interview - that preps and debriefs one call; this digests a whole transcript. Usage - /research [transcript file | paste the transcript]
---

# /research — turn a transcript into product context + evidence

You talked to someone (or ten someones), and now you have a transcript — an interview recording turned to
text, a sales call, a support thread, a pile of user messages. That raw material is gold, and it usually
rots in a doc nobody re-reads. `/research` digests it: it pulls out every real signal, grades each one
honestly ([[EVID]] ladder), and synthesizes what it all *means* for the product — while flagging the spots
where you led the witness.

**`/interview` and `/research` are siblings:** `/interview` preps *one* Mom-Test call and debriefs your
notes right after; `/research` digests a full transcript (often long, often not something BOSS prepped —
a sales call, a support log) into evidence *and* product context at scale.

## The one rule

**BOSS analyzes what's in the transcript. It never fabricates.** No invented quotes, no inferred
commitment that the words don't support, no rounding "sounds interesting" up to "wants to buy." If the
transcript doesn't say it, it isn't evidence. This is where BOSS's synthetic-vs-real honesty is enforced
mechanically — the grade says exactly how strong each signal is.

## How to run it

1. **Get the transcript in.** If the founder pasted it, use it. If they named a file or URL, pull it into
   `docs/source/` first (that's what `/import` is for — a durable copy) and read from there. If it's long,
   read the whole thing before extracting — signals hide in the back half.

2. **Extract graded evidence — the core.** Walk the transcript and pull out each real signal. For each,
   draft an `EVID-NNN` via the `/evidence` schema (`docs/evidence/`, next-number logic, honest grade):
   - **`stated-pain`** — they *said* something hurts.
   - **`observed-behavior`** — they *described a real thing they did* (a workaround, a tool they pay for, a
     time they gave up). Past action beats opinion.
   - **`commitment`** — they gave up something real in the conversation: agreed to a next step, a pilot, a
     price, an intro, a calendar slot.

   **Grade down when unsure, and push back on inflation out loud** — *"They said 'I'd definitely use this'
   — that's stated-pain, not commitment. Nothing was given up. I'll grade it stated-pain unless you saw a
   real commitment I'm missing."* Batch the drafts, show them, save on the founder's OK. One transcript can
   yield several EVIDs — that's expected; don't force one.

3. **Synthesize product context — what it all means.** Above the individual signals, pull the picture
   together in a short, plain summary (offer to write it into the canvas, seed the venture brain's
   `read.md` so the conscience carries it forward, and — see step 5 — fold it into the persona):
   - **The pain, in their words** — quote *verbatim*. The exact phrasing is the copy you'll write later and
     the language your user actually uses; don't paraphrase it into marketing-speak.
   - **The job they're hiring for** — what were they actually trying to get done?
   - **Workarounds observed** — what do they do *today*? (A painful workaround is the strongest
     product-context signal there is — it's proof the pain is worth effort.)
   - **Objections & non-needs** — what did they push back on, or shrug at? What did they *not* care about
     that you assumed they would? (The "didn't care" is as valuable as the "loved it.")
   - **Who this actually was** — does the real person match the target user, or did you learn your segment
     is off?

4. **Flag the epistemics — where you led the witness.** Read for Fitzpatrick's fluff/compliment/deflection
   taxonomy at transcript scale: moments the founder pitched and then recorded the polite reaction as
   validation, leading questions ("wouldn't it be great if…"), hypotheticals answered as if fact. Name the
   **two or three clearest** in one spare line each — observe, don't scold. *"Around the middle you
   described the feature, then 'that's cool' got treated as a yes — that's a compliment, not a signal."*
   This keeps the evidence honest; it's the same discipline as `/interview`'s pitch-detector, run over a
   whole transcript instead of one call.

5. **Point at the next test.** If a pain looks real but under-proven (all stated-pain, no commitment), name
   the one cheapest test that would raise the grade — often a follow-up commitment ask, sometimes a
   `/prototype` to watch them use. Hand the decision back.

5. **Offer to fold it into the persona.** If `docs/personas/` holds one, this transcript is the
   **strongest enrichment source that exists** — `/persona` says so itself: dropped-in real research
   outweighs your own knowledge, which outweighs online averages, which outweigh pure derivation.
   Offer `/persona enrich <slug>`, carrying what you just synthesized (the pains in their words, the
   job, the workarounds, the objections). No persona yet, but the transcript clearly describes one
   kind of person? Offer `/persona derive` instead.

   **Offer it; never do it silently.** The ledger moving from *synthetic* toward *real* is the single
   most meaningful thing that happens to a persona, and it is only worth anything if the founder
   watched it move. Say what would shift and by roughly how much, then let them choose.

## Guardrails

- **Never fabricate.** (Rule one, worth repeating.) Analysis, not invention.
- **The grade ladder is the ranking.** A transcript full of "sounds great" is a transcript full of
  stated-pain — say so plainly; don't let volume masquerade as strength.
- **Verbatim is sacred.** Quote the user's actual words for pains and jobs. The moment you paraphrase into
  your own framing, you've contaminated the signal.
- **Not a CRM, not a coding-of-qualitative-data tool.** No affinity diagrams, no tagging taxonomies, no
  theme-count dashboards. Signals → grades → product context → the next test. Keep it blunt.
- **Downstream of the real thing.** This digests research you *did*. It is not a substitute for doing it —
  and if the transcripts stop coming, the honest move is another conversation, not another analysis pass.

## Why it's worth it

A transcript you don't digest is a conversation that evaporates — the exact failure `EVID` ([[IDEA-045]])
and `/interview` ([[IDEA-046]]) exist to stop, at the scale of a full transcript instead of one call. Run
this on your real conversations and the canvas's riskiest assumption stops arguing from vibes and starts
arguing from receipts — with the words your users actually used.
