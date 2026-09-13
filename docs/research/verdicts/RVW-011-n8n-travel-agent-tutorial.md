---
id: RVW-011
type: verdict
owner: product-lead
status: recorded
created: 2026-06-02
verdict: REJECT
route: n/a
---

# RVW-011 — build a ReAct travel agent in n8n (hands-on tutorial)

## The claim
- **Source:** Hamza Farooq & Jaya Rajwani, "Agents in Action" Day 7. `docs/research/inbox/n8n-react-travel-agent-tutorial.md`
- **Core assertion:** *Here is how to assemble a working ReAct travel agent in n8n* (LLM parse → Search
  MCP via SerpAPI → Email MCP → Calendar MCP → emailed summary).

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **Yes — PRINCIPLE #4** (stack-neutral; stacks are learned, not assumed). BOSS does not bake in an n8n + SerpAPI + specific-MCP recipe. |
| 2 | Evidence grade | n=1 author demo, no outcome data. Hamza corpus. |
| 3 | Duplicate or sharpen? | Neither — it's a stack-specific build tutorial, nothing to adopt at the BOSS layer. |
| 4 | Who serves / harms? | A founder *might* follow it, but BOSS wouldn't prescribe this stack. |
| 5 | Cost / ceremony | N/A. |

## Verdict: REJECT

Out of scope — a stack-specific build tutorial, killed cleanly by PRINCIPLE #4. If a stack profile
like this ever enters BOSS, it's an *output* of a real project's learning loop (UP via `/boss-learn`),
never adopted from a tutorial.

## If REJECT / NOT-YET
- **Why not:** PRINCIPLE #4 (stack-neutral) + n=1 demo, no transferable practice.

## The keeper
Folded into [[RVW-008]] as the **worked example** of the three-categories framework — a Category-1/2
ReAct agent a PM assembles in a no-code tool, which is exactly that framework's "most teams start
here" point. Useful only as illustration, not on its own.

## Notes
- Author-concentration discount applies (Hamza corpus).
- BOSS version when recorded: 0.41.0
