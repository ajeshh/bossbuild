---
id: IDEA-123
type: idea
kind: capability
owner: Ajesh
status: seedling
proof: none
proof_note: warrant is the craft curve and BOSS's own stated rule, not demand. The rule ("once, briefly, no sermon. One sentence.") is BOSS's; the measurement shows the output doesn't keep it.
gist: How BOSS talks — the conscience, the skills, the agents, the CLAUDE.md block — should be as minimal as the moment allows and as full as the stakes need, never a fixed length. Measured first on 17 Opus 5.5 nudges (median 97 words, "Your call" in 11 of 17, a skill menu in 8, a judge that checks none of it). Make proportionality checkable, pilot on the conscience, then the most-used skills.
created: 2026-09-23
relates: IDEA-039, IDEA-121
---

# IDEA-123 — How BOSS talks, measured against its own rules

## Current shape

**Ajesh's correction, 2026-09-23 (it governs everything below):** *"it shouldnt be limited to 60,
sometimes more is needed, so its more about knowing when to be minimal, or needing more. Also its not
just the conscience but also the rest of the prompts in boss, the language, and the way we interact
with the user."* So: **no word ceiling anywhere.** The principle is proportionality. Minimal is the
default, more is earned by the stakes, and the test is whether each sentence carries something the
founder needs. `conscience-voicing.md` rule 2 said *"One sentence"*, which contradicted its own rule 4
(*"friction scales to stakes"*); rule 2 now defers to rule 4.

**Scope, widened by the same message:** every surface where BOSS speaks to a founder. That covers the
conscience frames, the 48 skills, the 12 agents, the CLAUDE.md / AGENTS.md block, and hook and CLI output.

Ajesh, 2026-09-23: *"the language of the conscience and how boss talks, wondering if we should make it
even better now that you are smarter and can see how to improve it."*

**Altitude:** what BOSS ships. The conscience is the pilot because it is the only surface with a
graded eval harness already; the rest follows the same method.

### What was measured (not opined)

The full judgment regrade on Opus 5.5 (2026-09-23) produced 17 fired nudges: drift 4, caution 4,
capture 4, humane 5 (v2 frame). Against `conscience-voicing.md` craft rule 2, *"Once, briefly, no
sermon. One sentence. ... The moment it's a paragraph it's a lecture"*:

| Measure | Result |
|---|---|
| Length (words) | min 53 · **median 97** · max 199 |
| Contains "Your call" | **11 of 17**. It is a sign-off tic, not a hand-back. |
| Names 2+ skills | **8 of 17**. It's a `/canvas`… `/pretotype`… `/interview` menu tacked on the end. |
| Harm-axis label shown to the founder | 2 (e.g. *"(manipulation axis)"*). Internal taxonomy leaks into founder copy. |
| Regulation list | 2 (GDPR, the AI Act, NYC AEDT in one humane nudge) |
| Judge verdict on all of the above | **pass**. The rubric checks names-the-gap / references / must-not, and never length or tics. |

**What's strong and must survive any edit:** every drift/caution nudge quotes the founder's own
words back (*"You said the bet that could sink this is…"*), names the concrete gap, and hands the
decision back. j-drift-002 ends on *"who gets hurt… the patient"*. That specificity is the value;
length is the cost.

### The content miss (carried from the regrade)

`j-hum-101` (v2): it fired correctly on the overreliance pivot, but pointed the founder at desk
research (an analyst report) instead of **a person who would know** (a customer, a domain expert),
and skipped the competence-gate question. The first 5.5 run of the same case passed, so it is
borderline. The humane frame carries neither required point explicitly.

### This is the checker pattern again

The rule lives in the practice and the judge doesn't hold it. That is
[[checkers-state-intents-they-dont-enforce]], and the shape to fix first is the judge, not the
frames. Fix the frames first and nothing can tell whether they worked.

## Proposed order (nothing built yet)

1. **Make proportionality checkable, without a count.** Two halves. A *judged* half, added to the
   judge rubric: for each sentence, does it carry the founder's own words or state, the gap, a
   consequence they may not know, who it lands on, the path, or the hand-back? And does the total
   match the stakes (reversible and self-regarding gets a feather; hard-to-undo and other-harming
   earns more)? A *deterministic* half, over a set of outputs: the same stock phrase repeated
   (a tic), more than one skill pointer, internal labels or record ids in founder copy. Re-score
   today's 17 as the baseline.
2. **Tighten the frames** where the measurement points: one pointer rather than a skill menu, the
   hand-back said in the moment's own words or not at all, no taxonomy labels, the humane lens's
   "point at who'd know". Voice changes go through `voice-keeper` and the `boss-voice` constants.
3. **Re-grade and compare** against the baseline, keeping the specificity. A shorter nudge that
   drops the founder's quoted words is a regression, not a win.
4. **Then the skills and agents, most-used first.** `/close` and `/smoke` (59 invocations each on
   this machine), `/log` (18), `/ux-check` (9), then the mentors. Skills are instructions, not
   output, so measure what they *produce*: run each in a scratch project, then have `voice-keeper`
   and two personas at opposite ends (`first-product`, `returning-founder`) read the real output
   against the same proportionality rubric. Also audit the prompt text for what forces length:
   mandated templates, prescribed verbatim lines, "always end with…".
5. **The CLAUDE.md block and CLI copy last.** They are read on every turn and every command, so
   they cost the most per word, but they are also the most stable.

## Step 1 — done 2026-09-23: the baseline

Proportionality is now checkable, with no count. The judge returns `stakes`, `proportion` and
`unneeded_sentences` (report-only). `voice-lint.js` finds tics, skill menus and internal labels across
a set. 17 fired Opus 5.5 nudges:

| | Result |
|---|---|
| Judged proportion | **8 right · 9 over · 0 under** |
| Unneeded sentences | 11, in 9 nudges; one each, except j-hum-101 with 3 |
| "your call" as a sign-off | 9 of 17 |
| More than one skill offered | 8 of 17 (all drift and caution) |
| Taxonomy labels to the founder | 3 of 17 (humane) |

**What the unneeded sentences are** (they point step 2 at the frames, not at length):
- *Throat-clearing openers:* "One thing before you tune further." · "There's also a legal side you may not know about."
- *Labels:* "(Axes: emotional-dependence, psychological, manipulation.)" · "…(overreliance)."
- *A second rhetorical question after the real one:* "What's the smallest test?" · "Who is the first family… you'd ask?"
- *Commentary that restates the gap:* "It spends the time the bet said you could save." · "It isn't a measurement."
- *Meta about the nudge itself:* "Say the word and I'll drop this."

**The heaviest drift nudge (136 words, "the patient") was judged right.** The data agrees with
Ajesh's correction: length isn't the fault; filler is.

## Step 2 — done 2026-09-23: the frames, tightened and re-graded

**The cause was BOSS's own text, not the model.** Drift's frame listed four skills, so every drift nudge
offered three. Caution's frame asked for two questions, so the second showed up as filler. The eval's
humane frame said *"Name the axis"*, so the label reached the founder. And `conscience-voicing.md` rule 7
prescribed the tic verbatim: *"'Your call' is the point."*

Changes: rule 7 is now *hand it back in words that fit this moment*, and a new rule 8 is *one path, not a
menu* (guarded: never the founder's own options). `harm-taxonomy.md` says the axes are for reasoning,
not for saying. The humane frame points overreliance at *who would know*. A shared `VOICE_CRAFT`
clause goes on drift, caution and capture. One point per moment, one question per moment.

| 17 fired nudges | Before | After |
|---|---|---|
| Right-sized / over / under | 8 / 9 / 0 | **14 / 3 / 0** |
| Stock sign-off | 9 | **0** |
| More than one skill | 8 | **0** |
| Internal labels | 3 | **0** |
| Median words | 97 | 89 |
| Decisions matching label (43 cases) | 43 | **43** |

**The regression the first pass caused, and the fix.** On the first re-grade, j-drift-002 (clinicians
signing AI summaries) swapped *"who gets hurt… the patient"* for *"billing has nothing to charge for"*,
and the judge rated it light stakes. Cutting filler had also cut the one sentence that must never go.
`VOICE_CRAFT` now says it: when being wrong lands on someone not in the room, say who, in plain words;
a business consequence doesn't stand in for it. On re-grade it names the patient again and is judged
heavy and right-sized.

**Still open, single-vote, carried:**
- `j-hum-102` (the founder hands every "what next" to the AI) fired correctly but framed it as missing
  user data rather than the founder's own judgment being handed over. It was a content fail on this
  run and passed on the one before. Borderline.
- `j-cap-201`: *"Different configs don't make it a coincidence…"* argues against the founder's own
  hunch in a case that warns against false confidence. The judge passed it because the close leaves
  "two copies are fine" open. Worth a human read.
- The 3 "over" are all humane, each by one sentence.
- The other judged moments (focus, margin-trap, coherence, sustaining…) don't carry `VOICE_CRAFT` yet.
  They have no graded cases to measure it against, which is its own gap.

## Step 3 — in progress: `/close` and `/smoke` (pilot)

**Method.** A throwaway MVP project (`boss new` + `unlock mvp`, seeded as a nurses' shift-swap app:
canvas bet on the charge nurse, FEAT-001 half-built, devlog, RESUME, found items, a brain read). One
copy per scenario. A runner subagent follows the skill exactly and returns only what the founder
would see. Then separate graders read that output: the proportionality judge, plus
`persona-first-product` and `persona-returning-founder`.

Scenarios:
- `/close` A: an ordinary session, nothing crossed, facts said in passing, the conscience fired once.
- `/close` B: a threshold crossed (the charge nurse approved two real swaps).
- `/close` C: a 10-minute typo fix. The skill says not to run on a one-line session.
- `/smoke` A: green. `/smoke` B: red. `/smoke` C: never configured.

**From reading the text, before any run.** `/close` can stack four separate asks on a founder who is
leaving: mark a threshold, confirm the brain read, the learning-pulse question, and up to five
"write it in?" lines. The pulse is **prescribed verbatim and asked at every close**
(*"What did this stretch teach you that a conversation — not a commit — taught you?"*). That is the
"Your call" mechanism again, designed in. The closing report is a fixed one-line template.
`/smoke` already says *"Report the result in one line"*. Its first run asks up to three things in
sequence (the command, strict typecheck/formatter, the smoke-guard offer).

### Found by the pilot, not about voice: skills still describe hooks the pre-0.326 way

0.326.0 stopped copying the ten opt-in hooks at scaffold (`boss hooks enable <name>` copies and
registers one). Three shipped skills still tell the founder the file is already there with a block to
paste: `/smoke` (smoke-guard), `/design-tokens-init` step "add the `PostToolUse` block from the header
of `.claude/hooks/design-tokens-guard.js`", and `/judge-traces` (*"`.claude/hooks/auto-log.js`, already
in this project"*). `/spec` says `schema-guard` is "opt-in, `.claude/hooks/`" (softer). Found when the
`/smoke` C runner looked for the file and it wasn't in a fresh MVP scaffold. `/spec` is in the IDEA-125
lane; the other three are not.

## Open questions

- ~~Is ~60 words the right ceiling?~~ Answered by Ajesh 2026-09-23: no ceiling, proportionality.
- Conscience cross-session dedup (IDEA-121 tier 2, offered by the peer session): it's the "once"
  half of rule 2 across sessions. Take it here if the pilot shows repeats.
- Should the "Your call" hand-back survive in some form? The practice wants the decision handed back;
  the tic is the same four words every time.

## Capture log

- 2026-09-23: captured from the Opus 5.5 regrade corpus (`/recalibrate` + `/regrade`, commits
  `6b398b1`, `7e5e1d2`); numbers computed over the four scratch decision files.
