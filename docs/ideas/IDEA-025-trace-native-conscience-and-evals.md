---
id: IDEA-025
type: idea
owner: product-lead
status: shipped
gist: Judge the real session, not a golden one — error analysis over actual traces, binary pass/fail, failure modes discovered before evaluators get built.
program: ai-native-boss
proof: stages/L1-mvp/template/.claude/skills/judge-traces
created: 2026-06-20
---

# IDEA-025 — Trace-native conscience & evals (judge the real session, not a golden one)

> Seed: 2026-06-20 trends + dhun research pass
> ([SESSION-2026-06-20](../research/sessions/SESSION-2026-06-20-trends-and-dhun-scan.md)). **The
> keystone** of that pass — it gates the sharpest of [[IDEA-026]] and underwrites [[IDEA-021]]'s
> honest-trace bet and [[IDEA-022]]'s living conscience.
>
> **Status: P1 shipped v0.48 (`auto-log` substrate, dormant). P2 shipped v0.53 (`/judge-traces` —
> the deliberate reader: error analysis on real traces, binary taxonomy, route to `/boss-learn`).
> P3 (sleep-time learn loop) still staged — needs accumulated traces + real failure modes to design
> against.**

## The shift (what 2026 taught that BOSS's design predates)

Two 2026 leader claims point the same way:

- **Hamel Husain** (Jan/Mar 2026): error analysis on **100+ real traces** is 60-80% of eval work;
  *discover failure modes first, then build evaluators*; **binary pass/fail, not Likert**; one
  expert, not a committee; **ship evals as an agent skill.**
- **Harrison Chase** (Jan 2026): **"traces, not code, are the source of truth"**; **"sleep-time
  compute"** — agents read their own past traces and rewrite their own instructions.

BOSS's judgment channel today (`judgment/replay.js`, golden transcripts, `regrade.js`) grades
**hand-authored golden transcripts**. That's the right *instrument* but the wrong *input* at the
limit: it measures BOSS against cases BOSS imagined, never against what actually happened in a
founder's session. The sharper version judges **the real trace.**

## The substrate already exists — in dhun

dhun's `.claude/hooks/auto-log.sh` (SubagentStop) auto-captures every agent's work to
`agent-work.jsonl` + a `devlog.yaml` stub, infers the agent from changed file paths, and dedups by
hash (SC-012/018). That is precisely the **trace substrate** a trace-native judge needs. BOSS has
manual `/log` + `/close` and the `.boss/conscience-log.jsonl` *frequency* ledger ([[IDEA-013]]) — but
no automatic **content** trace of what was done and how the conscience landed.

## The arc (phased; capture-then-earn)

1. **Phase 1 — trace substrate (build now).** Port auto-log as a zero-dep `library/hooks/auto-log.js`
   (Node built-ins only; same predicate/runner discipline as [[IDEA-008]]). Writes an append-only
   `.boss/trace.jsonl` (session, tool, files-touched, conscience-fired?, founder-response-shape) with
   hash dedup. **Dormant by default** (a SubagentStop hook fires per subagent — same opt-in switch as
   `secrets-guard`, R&H #1 cost discipline). This is the only piece that needs to ship to unlock the
   rest.
2. **Phase 2 — error-analysis-as-skill.** A `/judge-traces` skill (Hamel's pattern): read N real
   traces, surface a **binary** failure taxonomy (fired-when-it-shouldn't / silent-when-it-should /
   wrong-register), founder-confirms (one expert). Reuses the existing `judgment/` machinery; the
   input flips from golden → real.
3. **Phase 3 — sleep-time learn loop.** The taxonomy feeds `/boss-learn` (UP/DOWN). BOSS proposes a
   skill/predicate edit *from accumulated traces*; founder confirms. Closes [[IDEA-001]] with a real
   feedback source instead of intuition. **This is the "rewrite your own instructions from traces"
   idea — earn it after Phase 2 proves the taxonomy is honest.**

## Restraint / risk

- A content trace is *closer to surveillance* than the frequency ledger — so: **local-only,
  append-only, measure-don't-instrument-the-human, read-on-demand** (inherit [[IDEA-021]]'s contract
  verbatim). Never auto-share-up.
- Don't let the judge grade its own homework — the 2026 field warning. Phase 2's judge must be a
  **separate** pass from the conscience that produced the trace (60/30/10 deterministic/judge/human).
- Dogfood target: BOSS's own repo first (it spawns subagents constantly — the trace will be real).

## Smallest shippable slice
Phase 1 only: `library/hooks/auto-log.js` + L1 template (dormant) + a `.boss/trace.jsonl` schema doc.
Everything downstream is deferred behind "Phase 1 traces prove worth reading."
