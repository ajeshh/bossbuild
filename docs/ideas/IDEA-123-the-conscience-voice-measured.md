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

## Open questions

- ~~Is ~60 words the right ceiling?~~ Answered by Ajesh 2026-09-23: no ceiling, proportionality.
- Conscience cross-session dedup (IDEA-121 tier 2, offered by the peer session): it's the "once"
  half of rule 2 across sessions. Take it here if the pilot shows repeats.
- Should the "Your call" hand-back survive in some form? The practice wants the decision handed back;
  the tic is the same four words every time.

## Capture log

- 2026-09-23: captured from the Opus 5.5 regrade corpus (`/recalibrate` + `/regrade`, commits
  `6b398b1`, `7e5e1d2`); numbers computed over the four scratch decision files.
