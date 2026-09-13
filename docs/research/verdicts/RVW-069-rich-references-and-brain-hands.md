---
id: RVW-069
type: verdict
owner: mentor-architect
status: recorded
created: 2026-08-11
verdict: ADAPT
route: UP library/practices/harness-engineering.md (two sections) — shipped v0.141.0
retroactive: true
---

# RVW-069 — "Rich references beat markdown specs" + "Decouple the brain from the hands"

Two findings from the same sweep, both aimed at `harness-engineering.md`, recorded together because
they answer the same question — *what should the durable artifact around the model actually be made of?*

## The claims

- **A · Rich references.** Anthropic, [Claude 5 context engineering](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models) (shift 6):
  prefer HTML artifacts, code, test suites and rubrics over prose. *"An HTML mockup of a design will
  generally produce better results than a description of the design or a screenshot."*
- **B · Brain/hands decoupling.** Anthropic Engineering, [Scaling Managed Agents](https://www.anthropic.com/engineering/managed-agents):
  separate Claude + harness (brain) from execution environments + tools (hands), joined by a durable
  session log outside the context window. Stateless harness; interchangeable sandboxes; **pets vs. cattle**.

## Rubric

| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **A: no.** **B: partially fights #2** — the full architecture is enormous ceremony for a solo founder, and adopting it wholesale is exactly the "become a framework" failure (R&H #1). This is why the verdict is ADAPT, not ADOPT. |
| 2 | Evidence grade | **High, first-party, but different kinds.** A is guidance behind a measured ablation. B is an **architecture description of a shipped product** — strong evidence it works *at Anthropic's scale*, weak evidence it's right at a founder's. |
| 3 | Duplicate or sharpen? | **A sharpens `harness-engineering`'s existing spec-driven section** — which took a stance on the spec being *durable* and said nothing about its *format*. **B sharpens "the model is a dependency you don't control"** — same thesis, structural rather than attitudinal. |
| 4 | Who serves / harms? | **A serves every cohort, most of all non-technical founders** — "build a crude mockup" is a lower bar than "write a precise spec," and it works better. **B serves `eng-builder` / `returning-founder`; would harm beginners** if presented as something to build. |
| 5 | Cost / ceremony | **A: neutral-to-lighter** (a crude mockup is often *less* work than three paragraphs). **B: heavy if adopted literally** — hence stripping it to a principle. |

## Verdict: ADAPT

### A — adopted nearly whole, as a ladder

The stance generalizes past HTML: **an artifact the agent can execute, render or diff beats prose
describing it.** Written as an explicit ordering so it's usable at any altitude:

> prose < a screenshot < a rendered mockup < a failing test < a rubric the verifier runs

with the three concrete routings — UI → a crude HTML mockup; logic → acceptance criteria **as failing
tests**; anything fuzzy → a **rubric**. This lands as *"the spec is the durable artifact"* taken one
step further: **the more executable the artifact, the less the model has to guess.**

### B — stripped to the one line a founder can use today

The architecture is **not** adopted. What survives is the principle underneath it:

> **Anything you can't afford to lose belongs in the session log, not in the agent's context.**

— which is the same instinct as `/close` and `RESUME.md`, now with a *reason*: a crashed or poisoned
session should cost a restart, not the work. The **pets vs. cattle** framing is kept because it is the
memorable half and it transfers at any scale. The stateless-harness and interchangeable-hands details
are recorded as the shape this grows into, explicitly flagged as *"well before they need the
architecture."*

**Rejected on sight:** anything that would have a founder building a session store, a sandbox
abstraction layer, or a tool-interface registry. That is a platform team's problem, and BOSS shipping
it as guidance would be the framework-bloat failure it exists to warn against.

## What shipped (v0.141.0)

`library/practices/harness-engineering.md` — two new sections: **"The spec's *format* is a lever too"**
(under spec-driven, where the format question belongs) and **"Decouple the brain from the hands"**
(after the model-is-a-dependency section it extends).

## ~~The open thread~~ → CLOSED in v0.143.0

Rich references implied BOSS's `/spec` should *produce* one — a mockup, a failing test, a rubric —
not just describe it in markdown. For one version the practice said an executable artifact is better
while `/spec` still wrote prose: **the doctrine moved ahead of the tool**, the same shape as the
RLS/`db-architect` and test-diff/`tester` holes.

`/spec` now carries the ladder (**prose < screenshot < rendered mockup < failing test < rubric**) with
three concrete routings — UI → a crude HTML mockup; logic → acceptance criteria **as failing tests**
(which ties it to `testing-with-agents` §2: a test derived from the spec can fail, one derived from
the implementation cannot); anything fuzzy → a rubric the verifier reads.

**Bounded on purpose.** The section ends by saying *don't force it* — a one-line copy change doesn't
need a mockup. Without that, a ladder becomes a checklist, and a checklist becomes the ceremony
Principle #2 exists to prevent. The operative question is *"what's the cheapest artifact that removes
the most ambiguity?"*, and sometimes the honest answer is one clear sentence.
