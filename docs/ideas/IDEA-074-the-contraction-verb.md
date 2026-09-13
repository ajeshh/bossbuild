---
id: IDEA-074
type: idea
owner: product-lead
status: exploring
proof: ⚠️ EVIDENCE→CONTESTED (the problem — see the 2026-08-24 appendix), REFUTED (the proposed cure), n=0 (founder demand)
proof_note: >
  Three separable claims, three different grades — keeping them apart is the whole point.
  (1) The PROBLEM was graded [EVIDENCE] on GitClear's 623M-change telemetry — moved code, their
  refactoring proxy, falling 13% (2023) → 3.8% (2026), duplication +81%. Verified against the
  primary. Vendor telemetry, correlational. ⚠️ 2026-08-24 — CONTESTED, do not cite unqualified.
  A full read of the GitClear PDF finds the sample is "about two-thirds private corporations that
  have opted in", i.e. its own paying customers — a population that CHURNS, which is a direct
  attack on a time-SLOPE claim — and the 2025 data carries NO AI/human attribution, so the causal
  half is inference over a time series, not measurement. An independent 1,356-repo study
  (arXiv:2607.05677) finds "no broad deterioration". The grade is Ajesh's call; the defects are not.
  See the appendix.
  (2) The PROPOSED CURE — a scheduled refactor cadence — is REFUTED by both named practitioners
  BOSS respects. Fowler, verbatim: "a team that's using refactoring well should hardly ever need
  to plan refactoring." Beck's unit of rhythm is per-feature, not per-quarter.
  (3) The GAP this leaves — BOSS has no verb that asks "what should stop existing?" — is real and
  has n=0 founder demand. Nobody has asked for it. BOSS's own repo has the symptom; a founder
  project has not.
gist: >
  Every reduction-shaped thing BOSS ships is additive or holds-the-line. `/extract` promotes
  patterns UP or consolidates them DOWN; `quality-ratchet` stops a baseline sliding; `/sunset`
  ends a whole project. Nothing between "consolidate this duplication" and "kill the project"
  asks the founder's codebase the plainest question there is — WHAT SHOULD STOP EXISTING? That
  absence used to be harmless, because refactoring was never a practice: it was a side-effect of
  a human reading the code they were about to edit. When an agent types, nobody reads, and the
  side-effect stops. The boy-scout rule did not get abandoned — it lost its host.
created: 2026-08-24
source: >
  Ajesh, 2026-08-24 — "usually with AI, refactor, rewrites, slimming down the code, redesigning db
  and such needs to be a built-in cadence. im wondering what experts say, lets vet. lets see what
  boss offers, if we should offer anything and what?"
verdict: RVW-083 (ADAPT — diagnosis kept, cadence refused)
relates: RVW-053, RVW-076, RVW-083, EVID-001, EVID-003, IDEA-028, IDEA-030, IDEA-055, PRINCIPLES#1,
  PRINCIPLES#2, SESSION-2026-08-24-prototype-generation-craft
---

# IDEA-074 — The contraction verb: BOSS can grow a codebase and can end one, but cannot shrink one

## The finding, in one paragraph

Martin Fowler's position on refactoring has been settled for twenty years and it is the opposite of a
cadence: *"something you do continuously, as regular and indivisible a part of programming as typing
if statements."* That advice has a hidden dependency — **a human typing the if statements.** The
boy-scout rule was never a discipline anyone scheduled; it was a by-product of reading a file in order
to change it. Agents change files nobody read. GitClear's 2026 telemetry is what that looks like at
scale: moved code, their refactoring proxy, fell from **13% of changed lines in 2023 to 3.8% in 2026**
while copy/paste rose 9.4% → 15.7%. **Refactoring did not decline. Its host died.**

The wrong inference is the popular one: schedule it. Fowler names that as the *symptom* — *"you're
faced with slower progress and difficult conversations with sponsors about refactoring iterations."*
The right inference is that the rule needs a **new host**, and in an agent-driven build the honest host
is a breakpoint, not a calendar. **BOSS already fires on breakpoints.** That is PRINCIPLE #1.

## What BOSS offers today (the honest inventory)

| Surface | What it does | Direction |
|---|---|---|
| PRINCIPLE #1 + `/extract` + `extraction-loop` | pause at a breakpoint, sort the pattern UP (library) or DOWN (app core) | **additive** — promotes and consolidates |
| `quality-ratchet` | one number, one direction, never slides back | **holds the line** |
| `scalable-architecture` | modular-monolith-first, "extract when forced", one-way doors | **defers** |
| `data-schema` | schema decisions are one-way doors; migrations are the reviewable history | **defers** |
| `seed-to-scale` | "does it already exist?" · what rung is this on · leave the seam | **prevents** |
| `mentor-architect` | the 70%-problem boundary marker (RVW-053, 2024 GitClear vintage) | **judgment** |
| `/comprehend` | *"a refactor that buys nothing this month is a refactor that can wait"* | **restrains** |
| `/sunset` (L0) | end the project honestly | **terminal** |
| `/code-health`, `/refactor-wave` (L3) | named in the Scale manifest, README and GUIDE as **deliberately not authored**, symptom-gated | **not built** |

Read down that column: **prevent, defer, hold, promote, restrain, end.** There is no *reduce*. The
ladder jumps from "consolidate this duplication into a named module" straight to "sunset the project."

**BOSS is honest about the gap** — the L3 manifest, `README.md` and `GUIDE.md:193` all say `/code-health`
and refactor waves are not built and are waiting on a real symptom. That is the right posture and this
idea does not undo it.

## The one thing that IS wrong today

`stages/L0-quickstart/template/CLAUDE.md:43` ships this to every founder on day one:

> | **Scale** | PM org, refactor automation, code-health, product council | a fully blown-out, complex app |

Three of those four do not exist and are not scheduled. Every other surface that names them says
"deliberately not built yet"; the **mode-ladder table a founder actually reads first** says they are
what Scale *adds*. Small, real, and fixable in one line — the 17th instance of
[[checkers-state-intents-they-don't-enforce]], in its README flavour.

## What to offer — in confidence order, and the top two are not features

**1. Refresh the citation, don't add a surface.** `mentor-architect` carries the **2024** GitClear
figures. The 2026 slope is the same finding three years sharper. One paragraph edit.

**2. Name the substrate argument** in `mentor-architect`, suggestive and never a gate — the same
treatment RVW-053 got. *Refactoring stopped being automatic because it was never a practice; it was a
side-effect of reading the code you were editing.* This is the genuinely-new idea in the whole pass and
**it costs nothing to ship** because it is framing on a surface that already exists.

**3. Fix the L0 mode table.** One line.

**4. The contraction verb itself — HELD, not built.** If it is ever earned, the shape that survives the
rubric is *not* a 48th skill. It is a **question added to `/extract`'s existing pass**: `/extract`
already stops at a breakpoint and already asks "what pattern is here?" — the missing half is "and what
here has stopped earning its place?" Same trigger, same file, same record (`EXTR-NNN`). **Compose and
subtract, per [[EVID-001]]'s standing mandate — never a new verb.**

## Why #4 is held — and this is the load-bearing restraint

- **n=0.** No founder has asked. The symptom BOSS can point at is **BOSS's own** — 221 releases, 47
  shipped skills, a `RESUME.md` that needed three archive passes against its own 400-line gate.
  Building a founder feature from BOSS's own itch is precisely the inversion [[EVID-001]] flagged:
  seven post-launch releases for operators BOSS had zero of.
- **It harms the cohorts BOSS most needs to reach.** A prompt to go tidy, aimed at a founder with no
  users, is the **pseudo-app trap wearing an engineering hat** — it feels like rigor and produces
  nothing. `vibe-virtuoso` is the acute case: 50+ repos, zero traction, and a refactor beat is a
  legitimate-sounding reason not to ship. `first-product` and `vibe-coder-newbie` cannot yet tell
  "this code is slowing me down" from "nobody wants this."
- **Fowler's own failure mode is the thing being proposed.** Any surface that makes refactoring a
  *plan* is the artifact of having already skipped the opportunities.
- **Scale already queues it.** `/refactor-wave` is symptom-gated at L3. Opening a second front at MVP
  without evidence jumps that queue for nothing.

**Re-open trigger:** a real founder project shows the symptom in a form BOSS can name — an `EVID` past
`stated-pain`, or a `/health` / `/comprehend` run whose honest read is *"the code is what's slowing you
down,"* not *"you have no users."*

## What this pass did NOT cover — say it out loud

- **The schema / DB half of the question was not researched at all.** Ajesh asked about "redesigning
  db"; zero sources were gathered on it. `data-schema.md` already says schema decisions are one-way
  doors and migrations are the reviewable history — **whether the AI era changes that is unexamined.**
  This is the most defensible next research angle and it is genuinely open.
- **The counter-argument was searched for and not found.** "AI makes large refactors cheap, so rewrite
  rather than refactor" turned up only vendor content. Recorded as **absent, not refuted** — this idea
  has not heard the other side, and the rewrite-vs-refactor literature (Spolsky, strangler-fig) was not
  re-read.
- **The DORA specifics do not verify.** Only *"AI's primary role is as an amplifier"* came off
  `dora.dev`; the instability and rework-rate numbers everyone quotes rest on secondary summaries.
  Second time this has happened ([[RVW-076]] was the first) — worth treating as a standing caution
  about that source, not a one-off.

---

# APPENDIX 2026-08-24 — what [`SESSION-2026-08-24-prototype-generation-craft`](../research/sessions/SESSION-2026-08-24-prototype-generation-craft.md) does to this idea

Seed: Ajesh — *"i think both of these go hand in hand, different parts of the same puzzle."* Correct.
That pass went looking for how to improve `/prototype` and came back holding **two of the three gaps
this record says out loud it did not cover**, plus a primary source for this record's best idea.

## 1. 🔴 The inventory table is missing a row — and it changes the shape of the gap

This record's central claim is that the ladder *"jumps from 'consolidate this duplication into a
named module' straight to 'sunset the project'"*. It does not. There is one rung in between, and the
table omits it:

| Surface | What it does | Direction |
|---|---|---|
| `/prototype` **rule at SKILL.md:112–114** — *"When the sketch earns a real build, **restart it**… don't grow the sketch into production"* | throw the artifact away and rebuild | **REDUCE — the only one BOSS ships** |

So the honest diagnosis is sharper than *"there is no reduce."* **BOSS has exactly one reduce verb,
it sits at the far extreme (discard everything), it fires at L0 where founders are newest — and it is
unevidenced.** The 2026-08-24 pass found it is built on a misattributed citation (Cagan is credited
for Jeff Patton's phrase, per Cagan's own article) with a fabricated clause bolted on (*"a throwaway"*
is **Brooks 1975, retracted by Brooks in 1995**). **A ladder with one rung at the wrong end is a
different problem from a ladder with a missing middle** — and it argues the first contraction work
BOSS owes anyone is *subtractive*: fix the rung it already ships before designing a new one.

## 2. ✅ CLOSES the "counter-argument absent, not refuted" gap — and the answer is symmetric

This record states: *"'AI makes large refactors cheap, so rewrite rather than refactor' turned up only
vendor content. Recorded as **absent, not refuted** — this idea has not heard the other side, and the
rewrite-vs-refactor literature (Spolsky, strangler-fig) was not re-read."*

It has now been read to the root, and **the other side has no evidence base either**:

- The taproot for *"big-bang rewrites fail"* — **Brodie & Stonebraker 1993** — rests on one uncited
  sentence (*"It has been applied and has failed many times"*), with N=2 case studies of the
  incremental arm and **no rewrite control**. **Bisbal et al., *IEEE Software* 16(5), 1999**: *"the
  literature contains **no successful, practical experience reports** from projects using a
  comprehensive migration approach."*
- **No RCT, quasi-experiment, matched-cohort study or outcome dataset comparing rewrite against
  incremental hardening exists.** Every circulating percentage traces to vendor lead-gen or to CHAOS,
  which peer review calls *"meaningless figures"* (Eveleens & Verhoef, *IEEE Software* 27(1), 2010).
- **arXiv:2608.20446 (2026)** names the gap exactly: *"the point at which accumulated debt makes such
  a codebase **cheaper to replace than to maintain is not visible in any dataset**."*

**And the actual answer to "AI makes refactors cheap" was found — it is that cheapness is SYMMETRIC.**
Kirsch, *The Flawed Ephemeral Software Hypothesis*: *"**AI does not make software ephemeral**…it
shifts the bottlenecks to **validation, integration, and ergonomics**. The hard part of software
engineering has never been writing code."* The same engine that rebuilds cheaply refactors cheaply,
so cheapness **cannot be a reason to prefer either arm** — and felt-cheapness is not real cheapness
(METR RCT: devs *"take **19% longer**"* while believing AI *"sped them up by 20%"*).

**Net for this record:** upgrade *"absent, not refuted"* → **"searched to the root; symmetric
nullity."** This does not weaken the HELD verdict on the contraction verb — **it strengthens it, and
changes its character.** Holding is no longer the merely-cautious posture; it is the **evidenced**
one. Nobody knows, and BOSS would be inventing a discipline on folklore.

## 3. ⚠️ CONTESTS the PROBLEM grade — the slope is measured on a churning sample

The `proof:` line grades the problem [EVIDENCE] on GitClear. A full read of the PDF finds three
defects beyond the *"vendor telemetry, correlational"* this record already honestly flags:

1. **The sample is GitClear's own paying customers** — *"about two-thirds private corporations that
   have opted in to anonymized data sharing."* That population **churns with the sales pipeline**,
   which is a direct attack on a claim whose entire content is a **slope** (13% → 3.8% across years).
2. **No AI/human attribution in the 2025 data.** The causal half — *"refactoring's host died because
   agents type"* — is **inference over a time series**, not measurement.
3. **It measures no defects, no delivery, no business outcomes** — only diff classifications — and
   imports its defect claim from DORA's *survey*.

**And there is now a counterweight this record has never heard:** a **1,356-repo** OSS study
(arXiv:2607.05677) — *"We find **no broad deterioration** in code-quality signals or pull request
merging rates. However, developers **perceive** others' AI-generated code as harder to maintain than
their own."* That last clause names the bias that manufactures the narrative.

**This does not overturn the substrate argument** (§4 below gives it a much better foundation). It
means the *quantitative* half should stop carrying the weight. Recommend: keep the diagnosis, demote
the numbers to illustration, and **never ship a GitClear figure as a founder-facing fact.**

## 4. ⭐ GIVES this record's best idea a 1985 primary source — and a sharper question

This record calls the substrate argument *"the genuinely-new idea in the whole pass"* and grounds it
in Fowler's hidden dependency (*a human typing the if statements*). **There is a far older and much
harder primary: Peter Naur, *Programming as Theory Building* (1985)**, verified against the text:

> "**program revival, that is reestablishing the theory of a program merely from the documentation,
> is strictly impossible**… the existing program text should be discarded and the new-formed
> programmer team should be given the opportunity to solve the given problem afresh… **at no higher,
> and possibly lower, cost.**"

Naur's condition for discarding is that **the theory-holders are gone.** In agent-typed code **no
human ever held the theory** — the program is born dead in Naur's sense. That is this record's
*"refactoring lost its host"* thesis, forty years earlier, from a source nobody can call vendor
telemetry. **Ship the substrate argument on Naur, not on GitClear.**

**And Naur sharpens the verb itself.** §4 of this record proposes adding to `/extract`: *"what here
has stopped earning its place?"* Naur says discard the **text**, never the **knowledge** — which
points at a better question, and one that dodges the pseudo-app trap this record correctly fears:

> **"What here can no one explain?"**

Willison's rule is the same test, stated operationally: *"**I won't commit any code to my repository
if I couldn't explain exactly what it does to somebody else.**"* Why this beats *"what should stop
existing?"* for BOSS's cohorts: a founder with **no users** can answer *"what can't I explain?"*
honestly and cheaply. *"What should I delete?"* invites exactly the tidying theatre this record
refuses — it is answerable by `vibe-virtuoso` at 2am with zero traction and feels like rigor.
**Comprehension is checkable at n=0 users; contraction is not.**

## 5. 🎯 A narrow, EVIDENCED beachhead if the verb is ever earned — and it is security, not smell

The one place *"this must be structurally reworked"* has real evidence is **not** code smell.
**Veracode 2025 GenAI Code Security Report**, verbatim from the PDF: *"Across all models and all
tasks, **only 55% of generation tasks result in secure code**. In other words, in **45% of the tasks
the model introduces a known security flaw**"* — **flat across two years and 150+ models.**
Architectural security failures (no auth boundary, secrets on the client) are not lint you refactor
away. Meanwhile the code-smell half argues *against* an event: of 484,366 AI-introduced issues,
**89.3% are code smells** and **77.3% were resolved in place by ordinary maintenance**
(arXiv:2603.28592) — i.e. continuous, which is Fowler's position, which this record already holds.

**So if the contraction verb is ever earned, its first rung is security-shaped, not tidiness-shaped**
— and BOSS already has the surface (`schema-guard`, `/red-team`), so it stays compose-and-subtract.

## 6. ✅ ESCALATES the DORA caution from "standing caution" to a hard rule

This record says the DORA specifics *"do not verify"* and that it is the second time. It is worse
than unverifiable. **Full-text grep of the DORA 2024 report: "rewrite" 0 times, "greenfield" 0
times, "refactor" once.** DORA is **silent** on rewrite-vs-incremental — any claim otherwise is
fabricated. Two more, both sharp:

- DORA's *"code quality"* is **self-reported satisfaction** (*"The level of satisfaction or
  dissatisfaction with the quality of code…"*), not a measurement.
- **DORA 2024 reports AI *improving* it (+3.4%)** — the figure **GitClear omits while citing the
  same report's stability number (−7.2%)**. A source this record leans on is quoting half of a
  report at a source this record already distrusts. That is the *which-half-of-the-number* failure,
  one level up.

DORA is now **n=3** and recorded in memory as a repeat offender. **Rule: cite DORA's framing, never
its figures.**

## 7. 🔗 One anti-pattern names both halves of the puzzle

Boeing, in Avgeriou/Ozkaya et al., *Technical Debt Management: The Road Ahead* (arXiv:2403.06484):

> "**Reified Prototyping**: Occurs when software solutions are built to support initial capability
> demonstrations and are then evolved into production solutions… results in **high-cost
> re-engineering**."

That is `/prototype`'s hazard and this record's contraction gap **as one named anti-pattern, from a
safety-critical organisation.** And its remedy does double duty: product-line engineering, modular
composition, and *"frequent and incremental upgrade"* — which **supports this record's refusal of a
cadence** and **refutes `/prototype`'s restart rule**, from a single source. Same shape in Foote &
Yoder's *Big Ball of Mud* (*"a simple throwaway program begets a BIG BALL OF MUD"*), whose
prescription is *"the way to arrest entropy in software is to refactor it"* and whose RECONSTRUCTION
bar is *"beyond repair, or even comprehension."*

The one authority that genuinely licenses discarding early is **Fowler's *Sacrificial Architecture***
— *"**While it can be reasonable to sacrifice an entire system in its early days**, as a system grows
it's more effective to sacrifice individual modules"* — and it constrains itself in the way
`/prototype` does not: *"explore what the best modular structure should be **so that you can build on
that knowledge for the replacement**."* Reasoned argument, not evidence.

## 8. What does NOT change

- **n=0 stands.** The pass surfaced **zero** founder demand for a contraction verb. Nothing here is a
  re-open trigger; the trigger in this record is unchanged and still correct.
- **The cure stays REFUTED.** Nothing found argues for a cadence; §2 and §5 both argue continuous.
- **The held shape stays held.** No new skill. If earned: a question inside `/extract`'s existing
  pass — now better specified (§4) and with a narrower first rung (§5).
- **The schema/DB half is STILL unresearched.** This pass did not touch it either. It remains the
  most defensible next angle, and it is now the **only** one of this record's three stated gaps left
  open.

## 9. Recommended edits to this record — none of them build anything

1. Add the `/prototype` restart rule to the inventory table as the **one existing reduce verb**, and
   restate the gap as *"one rung, at the wrong end"* rather than *"no rung."* (§1)
2. Re-ground the substrate argument on **Naur 1985**; demote GitClear to illustration. (§3, §4)
3. Change the proposed `/extract` question to **"what here can no one explain?"** (§4)
4. Upgrade the counter-argument note from *"absent, not refuted"* to **"symmetric nullity"** — and
   say plainly that this makes HOLDING the evidenced posture. (§2)
5. Harden the DORA note to **"cite the framing, never the figures."** (§6)

⛔ Still refused, unchanged: no 48th skill · no cadence · no founder-facing GitClear figure · nothing
that asks a founder with no users to go tidy.

---

# APPLIED 2026-08-24 — status of the five recommended edits

| # | Recommendation | Status |
|---|---|---|
| 1 | Add `/prototype`'s restart rule to the inventory as the one existing reduce verb | ⚠️ **MOOT — and the finding inverted.** That rule was **deleted** in v0.223.0 ([[RVW-086]]: unvetted, resting on a doctrine Brooks retracted). So the honest inventory is not *"one rung at the wrong end"* — it is back to **zero reduce verbs**, and this record's original diagnosis stands unamended. |
| 2 | Re-ground the substrate argument on Naur 1985; demote GitClear | ✅ **SHIPPED v0.225.0.** `mentor-architect` now carries Naur's *"reestablishing the theory of a program merely from the documentation is strictly impossible"* — and the point that in an agent build **nobody ever held that theory.** All four GitClear slope figures removed. |
| 3 | Change the proposed `/extract` question to *"what here can no one explain?"* | ⬜ **Unapplied — still a HELD proposal**, correctly. n=0 is unchanged; nothing here earns a build. Recorded so the shape is right if it is ever earned. |
| 4 | Upgrade the counter-argument note to "symmetric nullity" | ✅ Recorded in the 2026-08-24 appendix §2. Rewrite-vs-harden is **empty in both directions** — the taproot (Brodie & Stonebraker 1993) rests on one uncited sentence. **This makes HOLDING the evidenced posture, not merely the cautious one.** |
| 5 | Harden the DORA note | ✅ **Escalated past a note into a shipped guard.** `test/prototype.test.js` now fails if any GitClear slope figure returns to founder-facing craft text. Rule: **cite the framing, never the figures.** |

## What v0.225.0 also caught, which this record did not know

🔴 **The "70% problem" is Addy Osmani's *framing*, not a measurement** — no study sits behind it, and
`mentor-architect` was shipping it as a number beside a vendor slope. It is now marked *"say it as a
shape, never as a number."* **A frame that arrives wearing a percentage is a number nobody has to
defend** — the same shape as the four vendor statistics that failed this session (GitClear, CHAOS,
DORA, OX Security).

**Net for this record:** the diagnosis survives intact and is now better sourced than when it was
written. The *cure* is still refused, the *verb* is still held at n=0, and the schema/DB half was
researched and **closed at Ajesh's direction** (see `SESSION-2026-08-24-schema-practice-refresh`) —
two of its citations turned out to be dead, which is the whole reason that pass earned its keep.

