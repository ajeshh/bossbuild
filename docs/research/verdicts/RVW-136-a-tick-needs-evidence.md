---
id: RVW-136
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: ADAPT
route: UP stages/L1-mvp/template/.claude/skills/log/SKILL.md (step 4) + close/SKILL.md
---

# RVW-136 — a ticked acceptance criterion should carry evidence, not the builder's word

## The claim
- **Source:** the open-source spec toolkit's done-check step, opened 2026-10-05. `docs/research/sessions/SESSION-2026-10-05-spec-driven-reading.md` (gitignored; names and URLs live there).
- **Core assertion:** *"completion claims are not evidence."* Before calling a feature done, check the
  code against the criteria, counting every task "checked or not". A checkbox is a claim, not a result.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. It serves the one sentence, *"keeps you honest"*, at the exact moment honesty is cheapest to skip. |
| 2 | Evidence grade | **Pattern with data.** A 140k-star project's design reasoning, plus independent user pain from a second tool (an agent-team method's issues): (*"it looks complete, but the sprint tracking says otherwise"*) and agents ticking *"superficial fixes"*). It also matches BOSS's own audit heuristic: checkers state intents they don't enforce. |
| 3 | Duplicate or sharpen? | **Sharpens.** BOSS has the evidence-taker: `tester` walks each criterion with *"a command + its output… No vibes"* (`agents/tester.md:14`). But `/log` step 4 has the session tick criteria *"that are now true"* with no evidence, and step 5 closes a FEAT on *"all criteria ticked + smoke green"*. So **done rests on the unevidenced tick.** The board's *how far* reads the same ticks. A side finding: the FEAT template says *"`/close` ticks the criteria"* (`spec/templates/feat-record.md:31`), `/close` says it does (`close/SKILL.md:55`), and so does `/log`. That is two owners of one act. |
| 4 | Who serves / harms? | It serves every cohort, and most of all `first-product`, `non-tech-founder` and `vibe-coder-newbie`, who cannot judge the code and so can only trust the tick. It harms none, provided it stays one line. |
| 5 | Cost / ceremony | Near-neutral. One clause per tick (*what was run, what was seen*), usually already in the session. The cost lands only on criteria nobody checked, which is the point. |

## Verdict: ADAPT
Adopt the rule, not the machinery. The toolkit runs a whole done-check command in a loop. BOSS needs
one sentence where the tick already happens: **a criterion is ticked with its evidence beside it, or
it stays unticked and is said back as "built, not yet checked".** No new command, no new agent, no new
file. The `tester` verdict line is the natural evidence, but a command and its output from the session
counts too.

## If ADOPT / ADAPT
- **What to do:**
  1. In `/log` step 4, a tick is `- [x] <criterion> — <evidence: command → result, or "tester ✓">`.
     Anything built but unchecked is listed once as *built, not yet checked* and offered to `tester`.
  2. Step 5's done condition reads *every criterion ticked with evidence*.
  3. Settle the owner: the act lives in `/log`, `/close` points to it, and `feat-record.md:31` says
     the same. → `/extract` (UP, stages/L1-mvp).
- **Modified from the original:** no loop, no gap taxonomy, no append-only phases. The evidence goes
  inline on the tick, because that is where the board and the founder already look.

## Attribution
**Partly verified.** *"completion claims are not evidence"* is verbatim in the toolkit's done-check step. The
second half used in the competition file, *"the agent must not tick its own checklist"*, is real but is
about **requirements-quality** checklists, not implementation done-ness (*"`[x]` does NOT mean
implementation work is complete"*). It is
dropped as support here, and the competition file overstated it.

## Notes
- Prior related: RVW-025 (evaluate the trajectory, not just the endpoint), RVW-092 (evidence-gated review).
- BOSS version when recorded: 0.329.0
