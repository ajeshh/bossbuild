# The patterns behind BOSS

*For builders of agent tooling. BOSS is a zero-dependency CLI that scaffolds a startup
project for Claude Code and rides alongside the founder as a "conscience" — nudging when the work
drifts from the bet that could sink it. This doc names the engineering patterns it's built on, with
real numbers, because the patterns generalize past this one tool.*

> Honest up front: BOSS has strong internal rigor and **zero real founders yet** (its own canvas calls
> that 100% of its remaining risk). Nothing here is "this works at scale" — it's "here's how it's
> built." The limits section is not buried.

## 1. The conscience separates the doer from the judge

The 2026 motif Anthropic keeps returning to: *don't let an agent grade its own homework; put the
reviewer in a fresh context that sees only the artifacts.* ([harness design](https://www.anthropic.com/engineering/harness-design-for-long-running-application-development))

BOSS's conscience is built that way, and it adds one twist: it fires **unprompted**. It's a
deterministic `UserPromptSubmit` hook (438 lines of Node, **zero model calls of its own**) that reads
predicate-gated "loops" (`docs/loops/*.md`), and *only when a cheap predicate trips* hands the model a
**bounded instruction** — read the riskiest-assumption line + the last ~5 devlog entries, nothing
wider — and asks it to judge in a clean context. The doer (the session doing the work) and the judge
(the conscience's bounded read) never share a window. The hook is the deterministic tripwire; the
judgment is the model's, in isolation. ([Anthropic on hooks](https://code.claude.com/docs/en/best-practices):
*"use hooks for actions that must happen every time… hooks are deterministic."*)

## 2. Three eval surfaces, with numbers, transcripts read

*"Every probabilistic system starts with a specification of correctness."* BOSS runs three channels:

- **Unit tests — the deterministic floor.** **57 cases**, zero-dep (`node:test`), covering the state
  projections, the scaffold's non-destructive guarantees, and the CLI contract. Several are marked
  `REGRESSION` and name the shipped bug they lock. Cheapest of the three; runs first.
- **Gate evals — deterministic, conscience-specific.** **129 cases / 0 failures**, asserting the
  predicate machinery fires (and stays silent) exactly when it should. Pure structural facts, no model.
- **Judgment evals — LLM-as-judge, calibrated, GRADED.** **43 golden-transcript cases** across the
  semantic moments (drift / caution / capture / humane), each judged by a *separate* model pass with
  examples of the judge being wrong, and recorded as `GRADED` against human labels. The judge never sees
  the conscience's own reasoning — only the transcript. ([demystifying evals](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents): *"read the transcripts!"*)

The split mirrors the field's 60/30/10 guidance (deterministic / judge / human) and the error-analysis
discipline (Hamel Husain): cases come from real failure modes, sorted binary pass/fail, not Likert.

**The honest limit, learned the hard way.** For 56 releases BOSS had good eval surfaces and *no gate
wiring them to the release*, so the doc generator and the drift checker reported real problems into an
empty room. Coverage is not the same as a loop that runs. `npm run release` is the loop; the numbers
above are checked by it, against reality, rather than transcribed from memory.

## 3. Trace-native error analysis

`auto-log` (a dormant, opt-in `SubagentStop` hook) appends an honest line per writer-subagent to a
local `.boss/trace.jsonl` — what was touched, by whom. `/judge-traces` then runs Hamel-style error
analysis on the founder's *real* sessions (binary failure taxonomy → route recurring modes to the
learn loop), not on cases someone imagined. Collection (passive) and judgment (deliberate) are kept
strictly apart — never fused into an always-on auto-grader.

## 4. Progressive-disclosure skills (the token numbers)

29 skills across the mode ladder, averaging **~1.7k tokens each** — comfortably under Anthropic's
**<5000-token** SKILL.md guidance ([Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)).
They load **just-in-time**: until invoked, only a ~100-token description is in context, so the
always-loaded surface stays small no matter how many skills ship. Bodies that grow push detail into the
prose, not the metadata.

## 5. Cost discipline: dormant by default, measured honestly

A hook that fires a process on every tool call has real latency. So BOSS's higher-coverage hooks
(`secrets-guard`, `auto-log`, `memory-cue`) ship **dormant** — registration is the opt-in on-switch;
an unregistered script costs nothing. And the conscience prices itself by **frequency, not tokens** (a
hook that never calls a model can't honestly price tokens; over-firing is the real cost) via a local
`.boss/conscience-log.jsonl` ledger. Measure-only; self-throttle deferred (humane before viable).

## 6. Security as architecture, framed honestly

The lineage Anthropic teaches — prompts → allowlists → sandboxing → classifiers — with BOSS's place in
it stated plainly: the **universal zero-cost floor** is a `permissions.deny` block in every scaffold;
the **opt-in ceiling** is the `secrets-guard` hook (a *deterministic* guard around a *non-deterministic*
model — never trust the classifier alone); the practice doc names the **lethal trifecta** + Meta's
**Rule of Two**. No safety theater: the guard is honest about being fail-open and partial, the floor is
what's load-bearing. ([sandboxing](https://www.anthropic.com/engineering/claude-code-sandboxing))

## 7. Portable by construction (AGENTS.md)

Working rules live in **`AGENTS.md`** (the cross-tool standard — Codex/Cursor/Copilot read it);
`CLAUDE.md` is a thin Claude layer that imports it via `@AGENTS.md` (no duplication). The CLI and docs
are host-agnostic; only the *unprompted conscience* is Claude-bound (hooks don't port) — and that
boundary is named, not accidental.

## 8. The same persona, both directions

A persona (`/persona`) is one evolving agent the founder points two ways: **forward** to guide product
decisions ("would my user want this?") and **back** to QA a build (Husain-discipline structured
reactions, comparable across versions). Synthetic shrinks as real evidence grows, visibly; every
consult ends with "go ask a real one" (the Mom Test). Never validation — a pre-filter that sharpens the
questions.

## The honest limits

- **No real users.** Everything above is internal rigor. The thing that turns "clever" into "matters"
  — founders actually using it — hasn't happened. BOSS's own conscience would (and does) flag this.
- **The conscience is Claude-bound.** Unprompted firing needs a hook primitive; that doesn't port. The
  deterministic CLI does.
- **A synthetic judge/persona is still synthetic.** BOSS leans on this everywhere and says so every
  time, but the meaning critique (Indi Young) stands: it's language about reactions, not reactions.

## Zero-dep, self-hosted

No runtime dependencies (Node built-ins only); all machine state is local JSON. BOSS is its own first
project — it eats the dogfood it serves. The whole library is plain markdown + small Node files,
inspectable and reversible.

---

*BOSS is MIT/open: [github.com/ajeshh/bossbuild](https://github.com/ajeshh/bossbuild). The
principles it enforces on its users are in [PRINCIPLES.md](../PRINCIPLES.md); it holds itself to them.*
