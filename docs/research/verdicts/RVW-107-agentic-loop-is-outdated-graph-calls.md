---
id: RVW-107
type: verdict
owner: pm
status: recorded
created: 2026-09-24
verdict: REJECT
route: n/a
sources:
  - https://www.reddit.com/r/ClaudeCode/comments/1wp9nga/the_agentic_loop_is_outdated/ (read via the thread's RSS feed, 2026-09-24)
  - https://github.com/merijjeyn/jive (repo metadata only: created 2026-09-21, 54 stars)
---

# RVW-107 — "the agentic loop is outdated": plan a DAG once, execute it with a cheap classifier

## The claim
- **Source:** r/ClaudeCode, u/merijjeyn, promoting their harness Jive.
- **Core assertion:** replace the LLM → tool call → LLM loop with "graph calls". The strong model
  plans a DAG of bash and classifier nodes once, and the classifier runs it, which the post claims
  cuts latency and tokens several-fold with accuracy on par.
- **Inbox file:** none (URL given in session).

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | **n=1 self-benchmark by the tool's author, confounded.** Jive's arm could call the classifier API and the Claude Code and Codex arms could not (u/UglyChihuahua). One task's token count disagrees with the author's own demo, 11.1k vs 62.4k+ (u/ugworm_). The demos 404. No quality measure (u/Beautiful_Baseball76). |
| 3 | Duplicate or sharpen? | **Duplicate of RVW-072** (graph engineering → REJECT) and RVW-024 (one strong agent). The "plan with the strong model, execute cheap" half is already `model-routing.md`'s shapes, and the host ships a workflow runtime. |
| 4 | Who serves / harms? | Serves no cohort BOSS has. A harness swap is off BOSS's altitude, since BOSS rides on the host. |
| 5 | Cost / ceremony | Heavier: a second harness. |

## Verdict: REJECT
Its evidence is its own weakest point: one arm of the benchmark was handed the tool that the
comparison is about. The durable idea, plan with the strong model and let the cheap one execute, is
already on the shelf (RVW-072, `model-routing.md`), so there is nothing new to adopt.

## If REJECT / NOT-YET
- **Why not:** confounded benchmark, and the idea duplicates RVW-072.

## Attribution
Self-reported by the author. The repo exists and is three days old. None of the benchmark numbers
verify, and the thread's commenters falsified two of them.

## Notes
- Prior related verdicts: RVW-072, RVW-024, RVW-012.
- One general lesson is already in `outside-claims.md`: when someone benchmarks their own tool,
  check whether each arm could use the same tools before reading the gap.
- BOSS version when recorded: 0.327.0
