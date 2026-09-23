---
id: IDEA-123
type: idea
kind: capability
owner: Ajesh
status: captured
proof: none
proof_note: warrant is the craft curve and BOSS's own stated rule, not demand. The rule ("once, briefly, no sermon. One sentence.") is BOSS's; the measurement shows the output doesn't keep it.
gist: The conscience's rules are right and its output doesn't keep them — measured on 17 Opus 5.5 nudges, median 97 words against a one-sentence rule, "Your call" in 11 of 17, a skill menu in 8. The judge never checks length or tics, so every one passed. Measure first, then tighten the frames, then re-grade.
created: 2026-09-23
relates: IDEA-039, IDEA-121
---

# IDEA-123 — The conscience's voice, measured against its own rules

## Current shape

Ajesh, 2026-09-23: *"the language of the conscience and how boss talks, wondering if we should make it
even better now that you are smarter and can see how to improve it."*

**Altitude:** the conscience is one mechanism that runs on BOSS's own sessions and on every founder's,
so this is **what BOSS ships**. "How BOSS talks" beyond the conscience (skill output, CLI copy, the
mentors) is wider and is not in this slice.

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

1. **Make the rule checkable.** Add to the judge rubric, or a deterministic pass over transcripts:
   a word ceiling (propose ~60, since one sentence plus a hand-back is ~40), repeated stock phrases
   across a set, and internal labels in founder copy. Re-score today's 17 and expect most to fail.
   That is the baseline.
2. **Tighten the frames** where the measurement points: one pointer rather than a skill menu, the
   hand-back said in the moment's own words or not at all, no taxonomy labels, the humane lens's
   "point at who'd know". Voice changes go through `voice-keeper` and the `boss-voice` constants.
3. **Re-grade and compare** against the baseline, keeping the specificity. A shorter nudge that
   drops the founder's quoted words is a regression, not a win.
4. **Only then** look past the conscience (mentor and skill copy), as its own slice.

## Open questions

- Is ~60 words the right ceiling, or should it vary by moment? Humane third-party harm may earn more
  than a drift nudge.
- Should the "Your call" hand-back survive in some form? The practice wants the decision handed back;
  the tic is the same four words every time.

## Capture log

- 2026-09-23: captured from the Opus 5.5 regrade corpus (`/recalibrate` + `/regrade`, commits
  `6b398b1`, `7e5e1d2`); numbers computed over the four scratch decision files.
