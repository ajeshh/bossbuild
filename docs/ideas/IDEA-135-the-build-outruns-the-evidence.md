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

## Open questions

- One current outcome per venture, or one per FEAT? (Leaning: per venture; focus is the point.)
- Reuse the canvas experiment cell, or a new `current_outcome:` on the venture IDEA?
- Does `success_looks_like` ever get checked, or stay a north star? (Leaning: north star, never scored.)

- Does this founder use BOSS? If yes, which mode, and did any moment fire? That moves the grade.
- Did Ajesh see the ten features first-hand (→ `observed-behavior`)?
- Is "source growth since the last EVID" honest across stacks, or does it need the model's
  judgment behind a coarse gate, the way `focus` already does?
