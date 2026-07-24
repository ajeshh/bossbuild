---
id: focus-loop
type: loop
stage: L1-mvp
runner_type: hook
attributed_to: [Ajesh Shah (PRINCIPLES — "compress the loop from idea to evidence")]
also_relevant: [David J. Anderson (Kanban — limit work-in-progress), Jim Benson (Personal Kanban — "stop starting, start finishing"), Eric Ries (validated learning over motion), Ryan Singer / Basecamp (Shape Up — the circuit-breaker + fixed appetite: finish-or-kill on the aged item, no default extension)]
entry:
  - count_at_least:
      path_glob: docs/ideas/FEAT-*.md
      pattern: '^status:\s*(building|drafting|blocked)'
      min: 4
exit:
  - count_at_least:
      path_glob: docs/ideas/FEAT-*.md
      pattern: '^status:\s*(shipped|done)'
      min: 1
drift_moment: focus
---

# Loop: focus (MVP) — the board's own drift signal

The board (`boss board`) already projects the work. This loop reads the *shape* of that projection
for the oldest startup failure there is: **a pile of things started, nothing finished.** Four or more
FEATs sitting in Building and not one shipped is not productivity — it's motion. AI makes starting the
next thing nearly free, so "stop starting, start finishing" (Benson) is exactly the discipline that
erodes first.

This is the board → conscience bridge (IDEA-034 Track D). The other MVP moments catch *structural*
gaps (no budget, no failure-states, a named risk left untested). This one catches a *flow* problem the
columns make visible: WIP accumulating with no graduation.

## The judgment the predicate can't do (and the model can)

The predicate gate is deliberately coarse: *≥4 FEATs are in flight and none has shipped.* Regex can
count columns; it cannot tell whether those four are **scattered abandonment** (each started, then
dropped for the next shiny thing — the real focus problem) or **four genuinely parallel tracks** a
small team is legitimately carrying. That call is the model's, and it's the whole value of the moment.

So the loop opens the door; the model walks through with judgment. When the door is open, the
conscience hands the model a bounded instruction — read the board projection (`boss board`, or the
in-flight FEATs' status + `building_since`), nothing wider — and asks: is this a founder spreading
themselves thin, or honest parallel work? If it's the former, name the specific pile in one spare line
and ask which *one* they'd finish first. If it's honest parallel work, stay silent. Silence is the
correct output when the founder is actually shipping-minded.

Same shape as `drift-loop` / `caution-loop`: a cheap structural gate fronting a judgment the regex
can't make, fired *unprompted* through the hook — because a founder buried in WIP is precisely the one
who won't stop to ask whether they've over-committed.

## Entry artifact

**Work-in-progress overload** — `docs/ideas/FEAT-*.md` has ≥4 files whose `status` is `building`,
`drafting`, or `blocked` (the board's "Building" column). Four is the threshold where the V1 `/board`
skill says cross-FEAT sequencing starts to matter; below it, the pile isn't yet a smell.

Confidence scales with overshoot (the runtime reads the count): 4 in flight → low, ~5–7 → medium,
8+ → high. The deeper the unfinished pile, the louder the signal.

## Exit artifact

**At least one shipped FEAT** (`status: shipped` or `done`). Shipping anything closes the loop — the
founder has proven they can finish, and the never-graduated-pile smell no longer applies. The good
outcome of a focus nudge is a FEAT crossing into Shipped.

## Drift

`entry: satisfied` (≥4 in flight) AND `exit: not satisfied` (nothing shipped yet) = loop OPEN →
conscience emits the `focus` moment. The model composes the voice (per `boss-voice`: seasoned hand,
assume intelligence), reads only the board, and judges before speaking — **not** a "you're so busy!"
reward and **not** a generic "limit your WIP" lecture; the value is the specific *which one would you
finish first* cut. And for the *oldest* item still stuck in build (the board's `⌛` aged flag), the moment
now offers the Shape-Up **circuit-breaker**: *finish it this session, or `/sunset` it honestly* — a thing
perpetually 70%-done is WIP, not a plan (and a flag left at 5% forever is the same trap). It **offers**
`/sunset`, never pushes it — IDEA-044's guardrail holds: the conscience points at the honest ending from inside
a moment that already fired; the founder chooses. Cohort-aware: returning-founder gets the blunt "you've started five things and
shipped none — which one is real?"; first-product gets "finishing one beats starting three, here's
why" taught plainly; indie-hacker gets the calm "small and done beats big and open" frame.

## Cost (BOSS eating its own dogfood)

- The **predicate gate is the cost control** — the model reads the board only after the cheap Node
  count confirms the pile. Every other prompt the hook emits nothing.
- The read is **bounded** — the board projection / in-flight FEAT statuses, never the whole project.
- The model fires **at most once per session** and stays silent when the parallelism is honest.

## Known limitation (documented, like drift-loop's)

Exit is "≥1 shipped *ever*," so the moment targets the never-finished pile and goes quiet after the
first ship — even if a large WIP pile rebuilds later. A "shipped *recently*" semantic would need a
date-windowed count the predicate vocabulary doesn't have yet (the same gap `building_since` aging
fills on the board side). Deferred until there's evidence the rebuilt-pile case matters; the board's
own aging flag (`⌛ Nw in build`) already surfaces the stuck items visually in the meantime.

## How to remix

- **Skip / override:** legitimate when the four-in-flight is real parallel work (e.g. a designer, a
  backend track, and an AI-eval track genuinely running at once). Override grammar:
  ```
  - **OVERRIDE:** skipped `focus-loop` — rationale: <e.g. three of these are blocked-on-review, not
    abandoned; the one active build ships this week>.
  ```
- **Tune the threshold:** a solo founder might set `min: 3`; a small team carrying real parallel
  tracks might set `min: 6`. The threshold is the team's honest WIP limit, not a universal number.

## Cite

PRINCIPLES.md (compress idea→evidence). Benson (*Personal Kanban* — stop starting, start finishing),
Anderson (Kanban WIP limits), Ries (validated learning over motion), Singer/Basecamp (*Shape Up* — the
circuit-breaker: finish-or-kill on the aged item, no default extension). The loop is the *when*; the
model's judgment + `boss board` + `/close` (ship one) or `/sunset` (end the oldest one honestly) are the *how*.
