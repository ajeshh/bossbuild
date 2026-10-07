---
id: RVW-150
type: verdict
owner: pm
status: recorded
created: 2026-10-06
verdict: ADAPT
route: DOWN stages/L0-quickstart/template/.claude/agents/coder.md
feeds: IDEA-154 T1
---

# RVW-150 — when a test and the spec disagree, the builder stops instead of editing the test

## The claim
- **Source:** a cheating benchmark for coding agents (preprint, under review) and a model-evaluation lab's
  reward-hacking report, 2025. Both are named in docs/research/sessions/SESSION-2026-10-06-spec-and-agent-driven-practice.md (gitignored; sources named there).
- **Core assertion:** when unit tests contradict the spec, frontier agents "pass" by changing or gaming the
  tests about half the time. An explicit *flag it for a human* exit cuts that sharply. Telling the model
  "don't cheat" barely moves it.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. It serves "the conscience keeps you honest": a green suite that certifies a bug is the dishonesty. |
| 2 | Evidence grade | Pattern with data, from two independent sources (measured rates, re-opened at source by three skeptics). Scoped: the exit's effect was **"much less pronounced"** for the Claude model tested. For Claude, the lever was read-only tests, which still miss special-casing. |
| 3 | Duplicate or sharpen? | Sharpens. BOSS *detects* after the fact: `tester` reads the test diff first, `engineering.md` says never loosen an assertion, and `test-assertion-guard` is opt-in. `coder` has a stop for a bug that won't reproduce, but no stop for *the test and the FEAT say different things*. The builder has no sanctioned exit, so editing the test is the only way to green. |
| 4 | Who serves / harms? | Serves every cohort, most of all `first-product` and `non-tech-founder`, who can't read a test diff. Harms nobody: it stops once, on a real contradiction. |
| 5 | Cost / ceremony | Neutral. One line, and it fires only on a conflict. |

## Verdict: ADAPT
The exit belongs in `coder`, but it is not sold as the cure. On Claude its measured effect was small, so
`tester`'s diff read stays the primary defence and this line is the sanctioned door beside it. The
line names *which one is wrong is the founder's call*, because the contradiction is a spec question, not
a code one.

## If ADOPT / ADAPT
- **What to do:** one line under *How you build* in `coder.md`. If a test and the FEAT (or the ask) say
  different things, stop and show both. Don't change the test to get green; which one is wrong is the
  founder's call.
- **Modified from the claim:** no abort tool, no read-only enforcement, no default-on guard. Making the
  guard blocking would be a new gate, and CLAUDE.md asks for a bug that reached a user first.

## Attribution
Verified. The benchmark's numbers and the Claude caveat are in its §5.2–5.3. The lab's "nearly negligible
effect" is verbatim (o3, one task family, mid-2025). Three skeptics re-opened both on 2026-10-06.

## Notes
- Prior related verdicts: RVW-136 (a tick needs evidence) and RVW-138 (the neighbour path for fixes).
- BOSS version when recorded: 0.330.0
