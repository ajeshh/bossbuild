---
id: margin-trap-loop
type: loop
stage: L1-mvp
runner_type: hook
attributed_to: [Parthasarathy (a16z — the AI margin trap; cost scales with engagement), Tunguz (AI gross margins 50–65% vs SaaS 70–85%), Ajesh Shah (PRINCIPLE #6 — the humane guard: never profit from the user's struggle)]
also_relevant: [Poyar (usage-based pricing when cost tracks usage), GitHub Copilot ($10 price / ~$20 cost cautionary case), Husain (look-at-your-ledger, applied to margin not just spend)]
entry:
  - exists: { path: .boss/cost-log.jsonl }
  - count_at_least:
      path_glob: docs/cost-reviews/REVIEW-*.md
      pattern: '^- \*\*Total spend:\*\*'
      min: 1
exit:
  - any_file_matches:
      path_glob: docs/cost-reviews/REVIEW-*.md
      pattern: '([Gg]ross[- ]?margin|[Mm]argin band|% of (ARPU|price|revenue)|[Cc]ost[- ]per[- ]user vs)'
drift_moment: margin-trap
---

# Loop: margin-trap (MVP) — the cost that scales with your best users

The other cost loops watch spend against a *budget*. This one watches spend against your *price* —
the number the budget never had. In an AI product the two diverge in a way SaaS founders aren't primed
for: **cost-per-user scales with engagement, so your heaviest users are your least profitable.** The
canonical cautionary case is Copilot ($10 price / ~$20 cost per active user in the early days); the
structural fact is that AI gross margins run 50–65% where classic SaaS runs 70–85% (Tunguz, a16z). A
founder can be delighted by usage and quietly losing money on every power user — the margin trap.

There's a second, humane edge the same ledger reveals (PRINCIPLE #6): when a big share of a user's cost
is **retries and regenerations** — the product working *less* — the business is being paid *more* when
the user struggles. That's a model to design out, not a margin to optimize. This loop is the one place
BOSS is positioned to notice it, because the raw per-call ledger is where struggle shows up.

## The judgment the predicate can't do (and the model can)

The predicate gate is deliberately coarse: *there is a real per-call cost ledger, and the founder is
far enough along to be reviewing spend.* Regex can confirm those two facts exist. It **cannot** read
the ledger, find the price, and decide whether cost-per-active-user has crossed the ~10–15%-of-ARPU
line — or whether the cost is being driven by struggle. That call is the model's, and it's the whole
value of the moment.

So the loop opens the door; the model walks through with judgment. When the door is open, the
conscience hands the model a bounded instruction — read the most recent cost review, a bounded tail of
`.boss/cost-log.jsonl`, and wherever a price/ARPU actually lives (the canvas willingness-to-pay cell, a
pricing `DEC`, the per-user economics in `docs/ai-cost-budget.md`) — and asks two things: is
cost-per-active-user a dangerous fraction of the price, and is the cost driven by the user's struggle?
If neither, **stay silent** — a healthy margin earns quiet, exactly like a validated risk quiets `drift`.

Same shape as `drift-loop` / `focus-loop`: a cheap structural gate fronting a judgment the regex can't
make, fired *unprompted* through the hook — because a founder happily watching usage climb is precisely
the one who won't stop to ask whether each new power user is costing them money.

## Entry artifact

Two facts, both structural:

1. **`.boss/cost-log.jsonl` exists** — a real per-call AI-spend ledger (the logger `/ai-cost` wires).
   This is the "cost-log exists" precondition literally: there's real cost-per-user data *and* the raw
   trail where retries/regenerations show up.
2. **≥1 cost review with real numbers** — `docs/cost-reviews/REVIEW-*.md` containing a
   `- **Total spend:**` line (the same artifact `/cost-review` writes). This is the "operating, and
   watching the economics" signal: the founder has real usage and is far enough along that
   cost-vs-*price* is a live question, not premature ceremony.

The pair matters. A cost log with no review is a founder who wired instrumentation but isn't yet
operating; a review with no raw ledger has no per-call trail to judge the margin or the struggle from.
Both together = the honest moment the margin question becomes real.

## Why it doesn't fire early (Principle #2)

Pre-revenue, there is no price and no ARPU, so there is nothing to compare cost against — the moment
would be premature, and it stays shut (no cost review yet). At the first LLM call the `cost` moment
already covers *"name the bill"*; this loop is the *later* question — *"the bill has a price to sit
against now; what's your margin, and who's costing you money?"* — and it waits for the operating
evidence before asking.

## Exit artifact

A cost review that actually **examines margin** — `docs/cost-reviews/REVIEW-*.md` containing a
gross-margin / cost-as-%-of-price / cost-per-user-vs-price line (`Gross margin`, `margin band`,
`% of ARPU|price|revenue`, `cost-per-user vs`). Once a review has looked at the margin (the Tier-2
`/cost-review` gross-margin band writes exactly this; a founder addressing it by hand writes the same
line), the trap has been *seen* — the loop closes. Watching cost against budget was never the same as
watching it against price; the exit is the moment those two finally meet on the page.

## Drift

`entry: satisfied` (cost ledger + a real cost review) AND `exit: not satisfied` (no review has looked
at margin yet) = loop OPEN → conscience emits the `margin-trap` moment. The model composes the voice
(per `boss-voice`: seasoned hand, assume intelligence), reads only the bounded slice, and judges
before speaking — **not** a "you're growing!" reward and **not** a generic "watch your margins" lecture;
the value is the specific *"~X¢ per active user against your $Y price is Z% — and it's your heaviest
users driving it"* cut, or the humane *"a big share of that spend is retries; you're being paid more
when it works less"* cut. Cohort-aware: indie-hacker gets the calm cost-as-%-of-revenue / sustainable-
margin frame; returning-founder gets the blunt "your best users are your least profitable — is the
price wrong or the cost?"; non-tech-founder gets plain "it costs you more each time someone uses it —
is the price covering that?"; domain-expert gets the stakes-aware read (high-cost workflows where the
per-outcome economics have to hold).

## Cost (BOSS eating its own dogfood)

- The **predicate gate is the cost control** — the model reads the ledger only after the cheap Node
  checks confirm both a real ledger *and* a real review exist. Every other prompt the hook emits nothing.
- The read is **bounded** — the latest review + a tail of the ledger + the one place a price lives,
  never the whole project.
- The model fires **at most once per session** and stays silent when the margin is healthy and the
  cost isn't struggle-driven. It **points**, never gates: `/cost-review` (the margin band) and
  `mentor-business` (price/packaging) do the work; this only makes the cost visible.

## Known limitation (documented, like cost-review-loop's)

The gate keys on `/cost-review` having run (a review with real spend on file). A founder operating a
priced AI product who never runs `/cost-review` — reviewing spend elsewhere, or not at all — won't get
the auto-nudge; they reach the same judgment by running `/cost-review` (which now carries the
gross-margin band) or asking `mentor-business` directly. This is the deliberate Principle-#2 trade:
better to stay quiet until there's real operating evidence than to fire on a milestone. The predicate
vocabulary also can't compute the ratio itself — that's the model's job by design, the same split
`drift-loop` and `focus-loop` make.

## How to remix

- **Skip / override:** legitimate when the economics are genuinely fine (e.g. a flat-fee enterprise
  contract where per-user cost is irrelevant, or a deliberately-subsidized free tier with a funded
  runway). Override grammar:
  ```
  - **OVERRIDE:** skipped `margin-trap-loop` — rationale: <e.g. the heavy users are on the enterprise
    plan where per-seat price already covers 10× the cost; the loss is on the free tier by design>.
  ```
- **Tune the threshold:** the ~10–15%-of-ARPU line is a heuristic, not a law — a high-touch product
  with a big price can absorb more; a thin-margin consumer play can't absorb that much. The founder
  sets the real line in their cost budget; the model reads it there.

## Cite

Parthasarathy / a16z (the AI margin trap — cost scales with engagement; your best users are your least
profitable). Tunguz (AI gross margins 50–65% vs SaaS 70–85%). GitHub Copilot ($10 price / ~$20 cost —
the canonical cautionary case). Poyar (usage-based pricing is the structural answer *when* cost tracks
usage). Husain (look-at-your-ledger, extended from spend to margin). PRINCIPLE #6 (humane before
viable — never build a business that profits from the user's struggle; the retry/regeneration read is
that principle made operational).
