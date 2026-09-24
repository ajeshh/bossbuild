---
id: RVW-108
type: verdict
owner: pm
status: recorded
created: 2026-09-24
verdict: REJECT
route: n/a
sources:
  - https://www.reddit.com/r/ClaudeCode/comments/1wowilt/i_still_dont_understand_this_agentic_workflow/ (read via the thread's RSS feed, 2026-09-24; ~40 comments)
---

# RVW-108 — split the build into role agents (analyst → architect → coder → reviewer → tester → auditor)

## The claim
- **Source:** r/ClaudeCode thread *"I still don't understand this 'agentic workflow' thing"*. The OP
  prompts, reviews and commits, and asks whether that means they are under-using AI.
  u/Long_Tip_4226's reply is the load-bearing claim.
- **Core assertion:** give each SDLC phase its own agent with its own constraints and output format,
  and "the quality of the output skyrocketed."
- **Inbox file:** none.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | It leans against #2, structure earned rather than installed: seven roles before a single failure has earned them. |
| 2 | Evidence grade | **n=1 vibe** ("skyrocketed", no measure). The thread holds a **counter-report of equal weight** from u/ahm_live: splitting planning, coding, review and testing into separate contexts "lost the reasoning the previous one had", and the reviewer "started confidently approving things the planner had already rejected". They went back to one context plus a written index, and kept exactly one extra step: *a second context reviewing the diff*. u/yawn_solo- adds that the "agents" are one model under different prompts. |
| 3 | Duplicate or sharpen? | **Duplicate, and the counter-report confirms the shelf.** `harness-engineering.md` already says multi-agent is justified only for different tools, different tiers or independent tasks, adversarial review included and synthesis excluded (haytham ADR-026). RVW-024 and RVW-105 record the same thing. The thread's other reusable points are also shelved: worktree-per-task capped at *review* capacity, plus risk-tiered review (`git-workflow.md`); "review the tests, not the lines" (u/morficus) and "an LLM will write 1000 tests for its wrong assumption" (u/Deathspiral222) are `testing-with-agents.md` §1; "skills matter less on newer models" (u/Dizzy_Database_119) is RVW-106. |
| 4 | Who serves / harms? | Harms `first-product` and `vibe-coder-newbie`, who would copy the diagram as if it were the craft. The honest answer to the OP, "your work is one project, one prompt, one diff; you already have the workflow that fits", is the answer BOSS's ladder gives. |
| 5 | Cost / ceremony | Much heavier. |

## Verdict: REJECT
Nothing here is new to BOSS. The thread's best comment argues BOSS's existing position better than
the pipeline argues its own. What is worth keeping is a **receipt**: an independent practitioner
arrived at "one context, plus one second-context diff review" by subtracting. It goes in the notes;
it earns no build.

## If REJECT / NOT-YET
- **Why not:** it duplicates `harness-engineering.md`'s multi-agent rule, n=1 with no measure, and
  the thread carries a counter-report.

## Attribution
Anonymous Reddit, where any comment can speak for itself. The "Fortune-100 tech lead: most code is
agent-written and agent-reviewed" comment (u/ResponsibleOven6) **does not verify** and was not graded.

## Notes
- Prior related verdicts: RVW-024, RVW-008, RVW-105, RVW-106, RVW-072.
- **Seen, not graded:** u/langolf43 on a rubric-scored agent reviewer whose score routes a PR to a
  human or straight through (500+ a11y PRs, Mar–Sep). This is risk-tiered review with an agent
  doing the tiering. It would be a Scale/team question under `git-workflow.md` and has no BOSS
  trigger today.
- The firstmate link in the same thread is a separate claim → RVW-109.
- BOSS version when recorded: 0.327.0
