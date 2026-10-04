---
id: IDEA-135
type: idea
kind: capability
owner: product-lead
status: seedling
gist: Every guard BOSS has against runaway building counts records (FEAT files, canvas cells, devlog entries), and the founder who builds by asking the AI for feature after feature writes none of them, so all four stay silent for exactly the case they exist for. Read the build itself against the last time a real person was heard from, and make the cost of a feature the surface you now own, not the tokens it took.
created: 2026-10-04
relates: IDEA-133, IDEA-055, EVID-004, EVID-001, EVID-003
altitude: what BOSS ships a founder (not BOSS's own practice)
source: Ajesh, 2026-10-04, relaying a founder (EVID-004) — "how do we prevent the runaway expensive building, because 1 line of code is expensive, 10000s with ai, people forget the cost.. not from oh it took 10 tokens to build it, but it creates a lot of complexity tht they now have to solve for..."
---

# IDEA-135: The build outruns the evidence

## The signal (EVID-004; product terms only — the record holds the rest)

A founder asked AI for a prototype small enough to get feedback. It grew to ten half-built,
buggy features. Progress was reported as a feature count; no end user shaped the form; the idea
could not be said in one line. Second independent founder on the pair *scope runs away · the why
goes quiet* (EVID-001 was the first). Still rung 1, and not about BOSS.

## The measurement under it (true whether or not anyone complained)

BOSS already ships four guards for this. Each keys on a record the runaway path never writes:

| Guard | Opens when | This founder |
|---|---|---|
| `focus-loop` (MVP) — "stop starting, start finishing" | ≥4 `docs/ideas/FEAT-*.md` in building/drafting/blocked | 10 features, **0 FEAT files** → never opens |
| `drift-loop` (MVP) — building around the riskiest assumption | canvas *Riskiest assumption* filled + ≥3 devlog entries | no canvas, no devlog → never opens |
| `spec-loop` / `restraint` (MVP) | canvas *Riskiest assumption* filled | never opens |
| `verification-loop` (MVP) | a FEAT marked shipped | never opens |

`/prototype` says *one core thing* (§2), on the first turn only; nothing holds it on turn two.

**Same shape as EVID-003** (`/boss` checking keyed to an artifact the front door didn't produce):
the conscience watches the paperwork, and the founder who most needs it does no paperwork. A
founder who keeps records is already partly on check. See the *checkers state intents they don't
enforce* pattern.

## Ajesh's frame: the cost is the surface, not the tokens

A line of code used to be expensive to write, so founders rationed it. Now it is nearly free to
write and exactly as expensive to **own**: every feature is code to debug, a state to keep
consistent, a thing to explain, and noise between the founder and what a user would have said
about the one thing that mattered. The ledger founders keep (tokens, minutes) is the wrong one.

## Candidates — compose and subtract; no new skill

Not decided. Superseded in direction by *Outcome as the spine* below: candidates 1–4 become
what a current outcome makes possible, not four separate mechanisms.

(Corrected 2026-10-04, Ajesh: IDEA-133 is **not** *collect the why first*. It is *keep building all
the pieces, even blank; fill blanks as they arrive; show what is incomplete; and keep sharing it
compellingly in the playbook*.)

1. **Re-key `focus` to the build, not the board.** The signal BOSS can read without the founder
   writing anything: how much the source has grown since the newest EVID (or since the project
   started, if none). *"You've built a lot since anyone outside saw it"* — then the one cut: *which
   one thing would you put in front of a person this week?* Offers `/interview` or `/pretotype`;
   never blocks. Needs a check first: can the loop runtime read git or file growth, or only file
   contents? (`verification-loop` already globs `$source`.)
2. **Hold the one core thing past turn one.** `/prototype` names it; write it down where the
   conscience can read it (the IDEA's gist?), so a second and third feature can be asked about
   against it rather than silently added.
3. **The one line as the anchor.** IDEA-133's heart (why · problem · where it goes) plus `/idea
   gist`. When a founder can't say it in one line, that is the moment to stop adding, not a copy
   problem. Shared with IDEA-133 — do not build twice.
4. **Name the owned cost** when a new feature is asked for in a build with no evidence since: one
   line, in the founder's own terms (*"that's an eleventh thing to keep working"*), not a token count.

## Outcome as the spine (Ajesh, 2026-10-04: thinking, not decided)

> *"being outcome oriented might be the way? like what outcome are you trying to achieve? and then
> using that as a guidelines?"*

**Name it precisely, or it turns into output.** An outcome is a change in what a person *does*
(Josh Seiden, *Outcomes Over Output*, 2019), not a thing built. "Ship booking" is output; "three
people book a slot without my help" is an outcome. The EVID-004 founder had only outputs, so a
feature count was the only progress they could share.

**Three levels; two already have a home:**

| Level | Question | Where it lives today | Gap |
|---|---|---|---|
| The why | why this, for you | `/boss` → `motivation`, `in_a_few_years`; canvas Problem | IDEA-133 |
| The venture outcome | what "it worked" looks like | `/boss` → `success_looks_like`; playbook Vision "It worked when" | asked once, asserted, never checked |
| **The current outcome** | what are you trying to make happen *next*, with a real person, by when | closest: canvas *Experiment this week* (read only by `drift-loop`'s exit; **not in the playbook**) | **the missing guideline** |

**What one current outcome does, everywhere at once:**
- **Playbook (the mirror, not the nag).** The Product chapter currently *leads with "What has
  shipped"*, a feature list, which is the thing the EVID-004 founder kept sharing. Lead instead
  with: *what we're trying to make happen next → what we built for it → what people did*. Work
  not tied to an outcome sits under *built, not yet tried by anyone*, shown honestly the way holes
  are. A blank current outcome is a dashed hole like any other. The ten-feature founder's page
  would read *Current outcome: blank · Built: 10 · Tried by a person: 0*, with no lecture needed.
  It also gives them something better than a count to share.
- **Conscience.** One question, only when a new feature is asked for: *does this move "<their
  outcome, in their words>"?* If the outcome is blank, ask for it instead. Never blocks.
  Candidates 1, 2 and 4 above collapse into this.
- **Story (IDEA-133).** An outcome closes like a DEC does, with `outcome: hit · missed · learned,
  and why`, reusing the `revisit_by`/`outcome:` pattern. Each closed outcome is a Ganz
  challenge → choice → outcome beat in *How it grew*. One field feeds the playbook, the story and
  the guard.

**Risks.** Outcome-as-KPI becomes vanity (Goodhart); keep it a sentence about a person, in the
founder's words. Before there are users, the outcome is a learning outcome (*find out whether…*),
and that counts. Blank is shown as blank, never filled by BOSS.

**Leaning:** reuse the canvas *Experiment this week* cell as the current outcome (re-worded to an
outcome, shown in the playbook) rather than adding a field. One at a time per venture; FEATs point
at it.

## After research, audit and a persona read (2026-10-04)

Three passes: outside frameworks (notes and sources in the gitignored
`docs/research/sessions/SESSION-2026-10-04-outcome-over-output.md`; re-open any page before quoting
it in shipped text), an overlap audit of what BOSS already ships, and the vibe-virtuoso persona
(synthetic, not evidence).

**The audit changes the shape: about 70% of this exists, under four names, and the playbook shows
none of it.**
- *What we'll test next*: canvas *Experiment this week*, pretotype *Designed to test*, FEAT
  *Learning hypothesis*, the top ROADMAP bet.
- *What result counts*: canvas and FEAT *What result would change the plan*, pretotype *Threshold
  for yes*, DEC *Falsifier*.
- *How it turned out*: `outcome: held · fell · can't tell yet` (DEC, FEAT), pretotype *Decision*.
  So **drop the proposed `hit · missed · learned`**; it would be a fifth vocabulary.
- Written and never read: canvas *What result would change the plan*, the pretotype log's fields,
  FEAT *Goal* and *Validated learning*, `/onboard`'s docs, ROADMAP bets outside `/spec`. The
  `/prototype` core thing is never written at all.
- Already free: the conscience injects `success_looks_like` into every moment it fires, so the
  current outcome can ride the same channel.

**Gaps the outside read found in the proposal:**
1. *It asks only about benefit, never cost.* Fowler's YAGNI names the **cost of carry**, which is
   Ajesh's "surface you own" with a source behind it. Keep candidate 4's carry clause.
2. *No "done".* Half-built is the failure; walking skeleton and tracer bullet both mean one thin
   slice working end to end before the next starts. Ten half-built features can all honestly
   "move the outcome". Each built row needs a state: works end to end · half built · untried.
3. *Feature tied straight to outcome, skipping the person.* Torres puts the need between them;
   Adzic makes the actor required. The outcome names **who does what by when**; each built row
   shows the need (an EVID) or a hole.
4. *No clock.* Torres's unit is weekly contact; Shape Up's circuit breaker gives no extension by
   default. Keep candidate 1's clock (build since the last EVID).
5. *Filters, never removes.* Adzic treats unattached work as a problem to fix or remove. *Untried*
   can lead to `/sunset`; a "no" parks the feature (the existing NO-LIST), not just a question.

**Overbuild risks:**
- Outputs dressed as outcomes, and Goodhart. The model checks the sentence's *shape* (a person, a
  verb they do, a date) and reshapes an output-shaped answer; it never scores a number or blocks.
- A north-star number before any users. Before users, the outcome is a **learning outcome** tied
  to the riskiest-assumption cell, or BOSS ends up with two aims.
- Importing the frameworks' artifacts (an opportunity tree, an impact map, a PR/FAQ). Each shrinks
  to a clause on what already exists.

**Persona (synthetic):** would write mush ("get feedback from 5 builders"), answer "does this
move it?" with a reflexive yes, and pick "learned" every time. What bites is a **receipt**: the
yes logged beside the feature and shown later next to *nobody used it*. Wants a count, not a
moral (*4 built for this, 0 tried, asking for a 5th*), one outcome as a hard limit, the question
on the 3rd feature rather than every one, and the page framed as a better build-in-public post.
Also asked *who* to show it to.

### Revised shape (merge four into one; show it)

1. **One current outcome per venture, hard limit**: *who · does what · by when*. Before users, it
   is a learning outcome tied to the riskiest assumption. Home: the canvas heartbeat, merging
   *Experiment this week* + *What result would change the plan*, rather than a new field.
   `/prototype` writes its core thing as the first draft.
2. **Closes with the existing vocabulary**, plus one sentence on why. `revisitDue()` fires on the
   date; no extension by default. The pretotype *Decision* and FEAT *Learning hypothesis* point at
   it instead of restating it.
3. **Playbook Product chapter leads with it**: outcome → what we built for it (each with a state
   and the need it answers) → what people did. Unattached work sits under *untried*, which can
   lead to `/sunset`.
4. **One conscience moment, keyed to the build, not records**: fires on the third thing built
   since the last EVID. Says the count plainly, asks *does this move <outcome>?* and names the
   carry. The answer is logged and becomes the receipt on the page. A "no" offers the NO-LIST.
   Offers `/interview` for *who to show it to*.

**Subtract alongside:** the never-read fields above, the second success vocabulary, and the
proposed `next_outcome:` field.

**Naming (Ajesh, 2026-10-04):** *"what we are testing next"*, not *this week*; "this week"
assumes a weekly build. If the canvas cell is the home, it is renamed accordingly (drift-loop's
exit regex and `moment-frames.js` read the old label).

**Questioned (Ajesh, 2026-10-04):** *"is outcome even the right approach? or is it an assumption
itself?"* Open. A research pass on what product leaders and founders say about off-base agentic
building, including the case against outcome-first, is running.

## On "done" — Ajesh's note (2026-10-04, verbatim; reads as dictated)

> "Done is a threshold, it is a milestone for crossing over into where we can best take it
> together, and then trusting that afterwards, the in relationship to add, subtract will keep
> changing. In tech or art projects, is this question of like, well, how much more can you do? And
> I think this is where the narrative of perfection, a fear of releasing it and being like, well,
> is it gonna be accepted? Are gonna people want one more thing? And I think. Instead, oh, it is a
> form of debt. And bringing to life, and it is the jet of, hey, all the ways we have worked till
> this point are ending, We have to leave that container collectively and being available to new
> signals … the constraints that they have been playing with come alive in a new way, which is, how
> does time relate, how does culture relate, how to resources, how does humanity? Are they
> available for more?"
>
> "I do agree half build is a failure."
>
> "… What is a consent for continued engagement? And what is the true cost? Are you available to
> receiving? And the feedback that pays your additional pursuit had this impact. If it's just you
> pursuing it, then that's okay, but again, to what extent … are you still in your own
> availability to continue doing it … Or you think your needs are so important, that you can
> impact the rest of the people. And it's a careful dance because both things can be true … being
> available to sit with the discomfort. But you may have overtaken one too many steps."

**Read (mine, for Ajesh to correct):**
- **Done is a threshold, not a finish line**: the point where the work leaves the founder's
  container and is met by others. After it, adding and subtracting is guided by that relationship.
  The test is *ready to be met*, not *complete*. That fits "half-built is a failure": a thin thing
  that works end to end can cross; ten half-things can't.
- **Unreleased work is a debt.** Perfection and the fear of not being accepted keep the work
  inside. *Hypothesis:* the ten features in EVID-004 were partly that. Adding features and
  reporting a count is a way to keep showing progress without being exposed to a verdict.
- **The true cost is wider than code.** Time, the people around the founder, resources and the
  founder's own capacity. Continuing past the threshold needs **consent** from whoever else pays,
  and the founder's honest **availability** (including to *receive* feedback). Pursuing it alone
  is fine; the question is to what extent, and at whose expense.
- **Both can be true.** The founder's need to keep going and the cost to others; the dance is the
  interplay, and sitting with the discomfort of crossing before it feels finished.

**What it might change:** the moment's question becomes *is this ready to be met, and who meets it
next?* rather than *does this move the outcome?*; the carry cost names time and people, not only
code; and the humane lens (consent, availability) belongs in it. Not decided; waiting on the
research pass.

## Is outcome-first right? Research pass 2 (2026-10-04)

Notes and sources: gitignored `docs/research/sessions/SESSION-2026-10-04-against-agent-drift.md`
(practitioners, 2025–26; all opinion, no comparative study; re-open before quoting).

- **Before users, a measured outcome is contested; naming what you are testing is not.** Nobody
  found argues a venture should build with no declared test, and nobody asks a pre-user founder
  for a behaviour-change number.
- **The build-to-think camp still chooses by use.** Those who say "throw it away and redo it" or
  "demos before memos" keep what real people adopt. They observe the outcome after the fact
  instead of declaring it, and they have an audience on tap; a pre-user founder doesn't.
- **Against "just build":** Shreyas Doshi (Dec 2025) on becoming attached to, and shackled by,
  everything you build. That is EVID-004.
- **Convergence:** a person who used it decides what survives; a short written intent before the
  agent starts; small steps, and stop when it builds what you didn't ask for (Kent Beck's signal);
  throwing work away is cheap and normal; judgment and saying no are now the scarce work.

**It meets Ajesh's note on "done":** a threshold where the work is met by someone else, and
unreleased work as debt. Both say the unit is **the meeting** (who sees it, and what they do),
not a pre-declared metric.

### Shape, third revision (not decided)

1. **What we're testing next, and who will see it.** No behaviour-change framing until there are
   users; a date is a timebox, not a target.
2. **Done = ready to be met:** one thin thing working end to end. It closes with the existing
   vocabulary when the timebox ends; no extension by default.
3. **Playbook:** what we're testing → what we built for it (state) → **who saw it and what they
   did**. *Untried* offers throw-away or restart as easily as `/sunset`.
4. **Conscience moment on the third thing built since anyone outside saw it:** *who has seen the
   last three?* It names the true cost (time, people, capacity, not only code), offers restart,
   throw-away or the NO-list, and logs the answer as the receipt. Best-supported of the four.

## Can the conscience see the build? Probed 2026-10-04: yes, with existing predicates

A throwaway project per case; the real `loop-runtime.js` (`loadLoops` + `classifyLoop`), with two
candidate loop specs. No runtime change.

| Case | `outpaced_by: {path_glob: $source, behind: docs/evidence/EVID-*.md, min: 3}` | `count_at_least $source ≥3` + `count_at_most EVID-* ≤0` |
|---|---|---|
| A: no EVID, 10 files in `src/` | unopenable (silent) | **open** |
| B: EVID, then 3 newer files | **open** | unopenable |
| C: EVID, then 2 newer files | unopenable | unopenable |
| D: no EVID, code in `server/` | unopenable | unopenable (blind: `server/` isn't in the default `$source` globs) |

**What it means:**
- **Two loop files, one moment.** Entry predicates only AND, and `outpaced_by` deliberately goes
  quiet when the artifact it measures against doesn't exist. EVID-004's founder is case A (no
  evidence ever), which only the second spec sees. Two loops can share one moment; no runtime
  change is needed.
- **Re-key the existing `focus` moment, don't add one.** `focus` is used only by `focus-loop`
  (L1, FEAT-counting). These belong in **L0**: the runaway founder is likely still in Quickstart
  with no FEATs.
- **The unit is files changed, not things built.** Ten features in one file reads as 1; one
  feature across eight files reads as 8. It is a coarse gate; the model judges what is behind it,
  as `focus` already does. "The third thing" in the shape becomes "enough has changed since anyone
  saw it", with the threshold tuned on real trees.
- **"Seen by someone" is wider than an EVID.** `behind` takes a comma list, so a pretotype log or
  a shipped-and-shown record can count too. Which ones is open.
- **Known blind spots, all failing quiet:** code outside the default `$source` globs (configurable
  in `.boss/config.json`), and fresh clones reset modification times, so it under-fires.
- Cost: the `$source` walk already runs per prompt for other loops (capped at 1,500 files).

## Slice 1 landed (2026-10-04, `3cf20a9`, Unreleased; Ajesh: "continue")

`stages/L0-quickstart/template/.boss/loops/unseen-loop.md` (≥1,500 source lines, no EVID) and
`unseen-since-loop.md` (≥6 source files newer than the newest EVID), both on the existing `focus`
moment with their own branch in `moment-frames.js`; registered in the L0 manifest. Tested with the
real hook on a throwaway project: silent on a fresh scaffold, a 300-line starter, code in an
unknown folder, evidence newer than the code, and five changed files; fires on ten features with
no evidence and on six files changed after evidence. Voiced by a model in two cases: the runaway
gets one plain line and *who has seen the last few?*; one feature getting deeper gets silence.
Unit tests 658/658, conscience evals 154/154.

Six gate evals in `conscience-evals/moment-unseen.yml` (160/160 with them); CHANGELOG bullet under
Unreleased. **Still open:** the thresholds (1,500 lines, 6 files) are guesses to tune on real
trees; which records besides EVID count as "seen"; no judgment-layer eval (voicing) yet.

**Next slices, in order:** (2) the playbook's Product chapter leads with *what we're testing
next → what we built for it → who saw it and what they did*, mocked on Kettlewick first;
(3) the canvas heartbeat cell renamed *What we're testing next* and merged with *What result
would change the plan* (drift-loop's exit regex and `moment-frames.js` read the old label);
(4) the receipt: the founder's answer to the moment logged beside the work it was about.
Left over from testing: `~/.boss/projects/walkies-1ebcc07f/` (a test run's conscience state,
written to the real `~/.boss` because the test exported the wrong variable; safe to delete).

## Slice 2 mocked (2026-10-04, in a scratch worktree, nothing tracked changed)

Product chapter on Kettlewick, two renders: the real record set, and a runaway copy (no evidence,
testing line blank, ten FEATs all half built). Mechanism: the canvas line is read as *What we're
testing next* (old label still accepted); an EVID's existing `about:` field naming a FEAT says who
met it (no new field); each FEAT shows its state (works · half built) and its Goal as *for:*.
Order: testing next → what we built, and who has met it → how it works → screens → shape → not.
`product-testing` joins the VC and Story cuts.

**What the renders showed:**
- Filled: reads as intended (*6 built · 2 met by someone*), but the list folds after three, and
  the two things someone met (FEAT-001/002, older) are the ones folded. Met things should sort first.
- Runaway: the dashed hole and *10 built · 0 met by someone* say it with no lecture. But *nobody
  outside has met this yet* repeats ten times; when nothing is met, say it once. A `_not yet_`
  Goal prints as *for: not yet*; a placeholder should read as absent.
- **Limit:** the page shows only recorded work. EVID-004's founder wrote no FEATs, so their page
  would be empty, not a mirror. The conscience (slice 1) covers that founder; the page covers the
  one who records.
- The testing block is wide with empty space under one sentence; it may want to be narrower.

## Open questions

- One current outcome per venture, or one per FEAT? (Leaning: per venture; focus is the point.)
- Reuse the canvas experiment cell, or a new `current_outcome:` on the venture IDEA?
- Does `success_looks_like` ever get checked, or stay a north star? (Leaning: north star, never scored.)

- Does this founder use BOSS? If yes, which mode, and did any moment fire? That moves the grade.
- Did Ajesh see the ten features first-hand (→ `observed-behavior`)?
- Is "source growth since the last EVID" honest across stacks, or does it need the model's
  judgment behind a coarse gate, the way `focus` already does?
