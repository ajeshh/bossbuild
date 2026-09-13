---
id: RVW-078
type: verdict
owner: product-lead
status: recorded
created: 2026-08-20
verdict: ADAPT
route: DOWN stages/L2-v1 (the portable component index — already shipped v0.166.0); shadcn/ui MCP REFUSED
---

# RVW-078 — a component you retrieve beats a token you're asked to remember

## The claim
- **Source:** [CHI EA '26, doi:10.1145/3772363.3798616](https://dl.acm.org/doi/10.1145/3772363.3798616)
  · [Figma, *Design Systems and AI: why MCP servers are the unlock*](https://www.figma.com/blog/design-systems-ai-mcp/)
- **Core assertion:** For design-system compliance in AI-generated UI, a **registry-based** strategy
  (retrieve pre-built components) beats instruction- and context-based strategies (put the style
  guide in the prompt), so BOSS should give the agent a component registry rather than a convention.
- **Inbox file:** `docs/research/inbox/design-system-retrieval-beats-instruction.md`

## Attribution — PARTLY VERIFIED, with the headline number quarantined

- ✅ **The paper is real and the method verifies** from the ACM listing: three strategies compared
  (instruction / context / registry), ReAct agents, shadcn/ui MCP for retrieval, metrics of compliance
  rate, task time and token usage.
- ❌ **The "registry-based hits ~95% compliance" figure DOES NOT VERIFY.** The ACM body returns 403;
  that number came from a **blog summary**. It appears in no shipped BOSS doc and must not.
- ⚠️ **Three structural weaknesses the claim's promoters omit:** it is an **Extended Abstract**, not a
  CHI full paper; **GPT-5 both generated and evaluated** compliance, which is an LLM grading its own
  family's output; and Study 2 is a self-described *"exploratory pilot."*
- ⚠️ **Figma is selling the MCP server.** Direction over multipliers.

**Effect:** the *direction* is credible and mechanically obvious. The *magnitude* is unestablished.

## Rubric

| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **The portable half: no** — it *serves* #3 (nothing valuable locked in code). **The shadcn/ui MCP half: YES — #4, stack-neutral.** BOSS assumes no stack; recommending a React-specific component registry as the mechanism bakes one in. This is the sharp edge and it splits the claim in two. |
| 2 | Evidence grade | **Pattern-with-weak-data.** Real venue, credible method, unverifiable magnitude, self-grading evaluator. Enough to justify a *cheap* structural change; nowhere near enough to justify a stack commitment. |
| 3 | Duplicate or sharpen? | **Sharpens, and BOSS already owned the argument** — `design-system.md` says *"a prompt convention is a filter; a check in the harness is a boundary"* about **colors** and never extended it to **components**. The claim's real contribution is noticing the unapplied half. |
| 4 | Who serves / harms? | **Serves** projects with a real component count (V1+). **Harms MVP**: a registry at three components is ceremony, and the retrieval itself costs tokens and wall-clock — a cost the paper measures and the hype omits. |
| 5 | Cost / ceremony | **Portable index: net neutral** (generated from code, no new authoring). **Vendor MCP: heavier** — a dependency, an auth surface, and a stack lock-in. |

## Verdict: ADAPT

Take the mechanism, refuse the vendor. The **portable component index** (`manifest.json`: name ·
purpose · import line · variants, generated from code) delivers what the paper actually demonstrates
— *retrieval beats recall* — with **no stack assumption and no dependency**. The shadcn/ui MCP is
the paper's *implementation detail*, not its finding, and adopting it would trade a principle for a
convenience.

**A note on how this was decided:** the index **already shipped** (v0.166.0), before this verdict
existed. Retrospective again. The verdict holds — but it is confirming a build, not gating one, and
that is the weaker of the two jobs `/vet` does.

## If ADAPT — what changes
- **Keep** the generated component index and the source-hash staleness check. Already in
  `stages/L2-v1/.../design-library/`.
- **Refuse** the shadcn/ui MCP pointer on PRINCIPLE #4. If a founder's stack is React and they ask,
  that's their call — BOSS names the **rung** (retrieval over instruction), never the vendor. Same
  rule that killed RVW-011.
- **Never cite the 95% figure.** If someone reads the paper, re-open with the real numbers.

## Notes
- Prior related: [[RVW-011]] (naming vendors), [[RVW-077]] (the same retrospective-vet problem).
- **Still owed:** the paper body. The claim would strengthen materially if the real compliance deltas
  and the token/latency costs were read.
- BOSS version when recorded: 0.171.0
