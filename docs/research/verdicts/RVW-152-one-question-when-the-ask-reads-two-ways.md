---
id: RVW-152
type: verdict
owner: pm
status: recorded
created: 2026-10-06
verdict: ADAPT
route: DOWN stages/L0-quickstart/template/.claude/agents/coder.md
feeds: IDEA-154 T5
---

# RVW-152 — the builder asks one question when an ask could mean two things

## The claim
- **Source:** a peer-reviewed study of underspecified coding tasks (ICLR 2026), named in docs/research/sessions/SESSION-2026-10-06-spec-and-agent-driven-practice.md (gitignored; sources named there).
- **Core assertion:** models can't tell a well-specified ask from an underspecified one, and letting them
  ask recovers a lot (up to 74% on one benchmark).

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | Could, if it nags: the conscience's *stay quiet the rest of the time*. Scoped below so it can't. |
| 2 | Evidence grade | Peer-reviewed, attribution verified. "Up to 74%" is a ceiling, and the models tested predate the current ones. Moderate. |
| 3 | Duplicate or sharpen? | Sharpens. `/spec`'s elicitation pass covers a FEAT. `coder` covers nothing for the ask that arrives without one (grep: no ambiguity rule in `coder` or the CLAUDE blocks). RVW-139 is a different claim, about recommended answers inside `/spec`. |
| 4 | Who serves / harms? | Serves `non-tech-founder` and `first-product`, whose asks are the most often underspecified and who can least spot a wrong guess in the code. It would harm `returning-founder` and `vibe-virtuoso` if it asked about everything, hence the narrowing. |
| 5 | Cost / ceremony | Neutral if it's narrow. One line. |

## Verdict: ADAPT
Ask only when the two readings would build *different things*, and ask one question that names both
readings. A detail that changes nothing gets a sensible default and a mention in the report. That keeps
the gain and stays out of the way.

## If ADOPT / ADAPT
- **What to do:** one line in `coder.md`. When an ask could mean two things that would build different
  code, ask which, in one question naming both. Otherwise pick the reading that fits, build it, and say
  which you picked.
- **Modified from the claim:** narrowed from "ask clarifying questions" to one question on a real fork.

## Attribution
Verified. The arXiv page says "Accepted at ICLR 2026", and both quoted phrases are in the abstract.

## Notes
- Prior related verdicts: RVW-139.
- BOSS version when recorded: 0.330.0
