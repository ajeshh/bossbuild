---
id: IDEA-097
type: idea
owner: product-lead
status: shipped (v0.303.0, 2026-09-11)
gist: BOSS asks What / Who / Smallest-version and never *why you* — so every downstream read (canvas branch, mentor advice, the conscience's ladder nudges) assumes a founder who wants a paying customer. One question at intake, one field, and the readers that already exist.
program: mirror
proof: stages/L0-quickstart/template/.claude/hooks/lib/loop-runtime.js
proof_note: >
  `readIntentContext` + `MOTIVATIONS` in the shipped runtime lib; the intent line in
  moment-frames.js; `printIntent` in src/orientation.js wired into `boss status`; the question in
  /boss 3.5 and the two fields in /boss + /idea templates; readers in /canvas, /consult,
  /interview; fields declared in docs/IDS.md. 7 tests. The gap it closed was verified first:
  `grep -ri motivation stages/ src/` returned one hit, `/idea`'s rule never to INVENT one. Source
  was a rival's design (docs/competition/founder-plugins-source-read.md, haytham Step 0), not a
  founder — compose-on-a-hypothesis, held to the mandate: no skill, no loop, no command.
created: 2026-09-11
relates: EVID-001, EVID-003, DEC-011, IDEA-096, IDEA-099, COMP-founder-plugins-source-read
---

# IDEA-097 — founder intent at intake

> Seed: the source read of five founder plugins, 2026-09-11. haytham's Step 0 asks three things
> before any analysis — *why are you building this*, *what does success look like in 3 months*,
> *what are you working with* — and every downstream agent calibrates to the answer: a `learning`
> founder gets no revenue tables; `community` motivation is not scored on willingness-to-pay.
> Ajesh: *"is awesome. im surprised we dont do it! heck yeah!! lets do it."*

## What is true today

- `/boss` step 2 reflects **What / Who / Smallest version that proves it**, in the founder's words.
  Step 3.5 stops for *"ready to build, or is there more?"* Neither asks *why you* or *what "it
  worked" means to you.
- The canvas gets at the **venture's** shape — the *"if it won't earn"* branch, DEC-011's company /
  co-op / commons — at canvas time, which is three capture-log entries later. That is the venture's
  model, not the founder's motivation, and it arrives after the conscience has already started
  speaking.
- The conscience's ladder nudges (`stated-pain → observed-behavior → commitment`) and `/interview`'s
  *"the single follow-up commitment to ask for"* presume a founder who wants someone to pay or
  commit. For a learning founder, a commons builder, or someone solving their own problem, that is
  the wrong nudge — well-meant and mis-aimed.
- `/idea`'s `gist:` rule: *"a gist that asserts a motivation nobody wrote is a small fabrication."*
  The field is conceptually there; nobody ever asks the founder to write it.

## The shape — compose, don't add

**One question, in `/boss` 3.5, before the paperwork:**

> *"Two more things and then we set it up: why this one — and what would 'it worked' look like in
> three months?"*

Quick answers are fine; *"skip"* is a complete answer and writes nothing (haytham's rule, kept:
never infer what they declined to say).

**One field, in the IDEA doc frontmatter**, plus the answer *verbatim* as a Capture-log line:

```yaml
motivation: <one of: learning | revenue | community | credibility | own-problem | unset>
success_looks_like: "<their sentence, unedited>"
```

The enum is for the readers; the sentence is for the founder. Map their words to the enum and show
the mapping before saving — it is their idea and their words.

**The readers — all of which already exist:**

| Reader | What changes |
|---|---|
| `/canvas` | Opens the Business Model cell on the branch the motivation points at, instead of asking which branch. `Metrics` gets *their* success sentence beside "for people and planet." |
| `/consult` | Feeds `motivation` + `success_looks_like` to every mentor with the question. `mentor-capital` defaults to *"not yet"* harder on its raise half when motivation ≠ revenue. (`mentor-fundraising` is dev-workspace only — it ships to nobody.) |
| conscience (`canvas-loop`, `drift`, evidence nudges) | Picks the ladder rung to point at: `revenue` → commitment; `community` → observed-behavior (someone showed up twice); `learning` / `own-problem` → the nudge is *"did you learn the thing / does it solve it for you"*, not *"did anyone pay"*. |
| `boss status` re-entry read | Renders the success sentence once, under the idea, so *"where am I"* has *"toward what"* beside it. |
| `/interview` debrief | The commitment it asks for is shaped by motivation — a `community` founder's commitment is *"will you come back Tuesday,"* not *"will you pay."* |

## Tasks

1. The question in `/boss` 3.5 — one line, cohort-ordered like the existing check; *"skip"* honoured.
2. The two frontmatter fields written by `/boss` step 3 **and** `/idea` (both capture paths produce
   one document — the rule already in `/boss`). **Decided in the build: `/idea` asks nothing** — the
   lightest step stays light; `/canvas` asks if the fields are still empty when it opens Business Model.
3. **The interpretation line** (IDEA-097's twin task, from the same source read): in step 2's
   reflection, at most one line naming a reading BOSS chose for an ambiguous term — *"I'm reading
   'marketplace' as two-sided with payments; if it's a directory, say so."* Proceed, don't ask.
   Corrected → Capture log; uncorrected → Open questions. Cap: one, maybe two; more than three
   ambiguous terms means the idea is too vague and *then* you ask.
4. Readers, in this order: `/canvas` branch pick → `/consult` context → conscience rung → `boss
   status` line → `/interview` commitment shape. Each is a few lines in an existing file.
5. `boss records` / `check-backlog` know the two keys (the n=25 lesson: a misspelled field is
   silent — declare it where the readers are).
6. *(IDEA-099's, not this record's)* `boss new --idea` seeds both fields when the door heard them first.

## Refusals

- **No motivation is inferred.** If they skip, the field is `unset` and every reader behaves as
  today. `read.md`'s rule holds: an opinion about the person must be one they can inspect and edit.
- **No scoring against motivation.** haytham calibrates a *verdict* to intent; BOSS renders no
  verdict (canvas: *"coverage is a fact; readiness is a verdict"*). The field changes which
  question gets asked, never a grade.
- **No new skill, loop or command.** This is one question and five readers.
- **Not asked again.** Motivation can change; the founder edits the frontmatter or says so in a
  capture-log line. BOSS does not re-ask on a timer (DEC-016's spirit).

## Gate

Ships when: a `/tmp` scaffold answers the question, `/canvas` opens on the right branch without
asking, and `/consult` on a `community`-motivated idea shows `mentor-capital` saying *"not yet"* in
its own words. Falsifier: a founder skips it three times running — then the question is in the
wrong place, and it moves or goes.

## Capture log

- 2026-09-11 — seeded from the five-plugin source read; approved by Ajesh (*"heck yeah"*), held
  until the batch list is complete. Task 3 folded in from the same read (Ajesh: *"yes makes sense"*).
- 2026-09-11 — **shipped v0.303.0**, tasks 1–5 (task 6 is IDEA-099's). **Gate: two of three legs
  verified** — the `/tmp` scaffold prints *Toward:* and the conscience frame carries the intent line;
  the `/canvas` branch pick and the `/consult` *"not yet"* are skill text and need a model run on a
  real idea, which has not happened. The one surprise in the build: the phantom-agent
  check refused a `/consult` line naming `mentor-fundraising` — it ships to nobody (folded into
  `mentor-capital` at v0.189.0), which the dev workspace's own 19 agents make easy to forget
  (the *dev workspace described as shipped* memory names this). `/idea` deliberately asks
  nothing — the question lives in `/boss` and falls through to `/canvas`; the falsifier (three skips
  in a row → move it) is now live rather than hypothetical.
