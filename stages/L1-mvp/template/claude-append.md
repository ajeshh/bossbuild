## MVP working rules (added on `boss unlock mvp`)

> {{MODE}} mode adds the smallest spine that lets you actually build: a spec, a smoke gate, a devlog, a
> session-end ritual. Same conscience — capture and validate still come first. Don't out-ceremony the work.

1. **Spec before code.** Any non-trivial change starts with `/spec` — promotes an idea to `FEAT-NNN` with a goal, acceptance criteria, and a smoke check. Throwaway one-liners don't need it.
2. **Smoke before commit.** `/smoke` runs the stack's "is the app even working" gate. Green before the commit, red is information — fix or document the regression.
3. **Devlog every session.** `/log` appends a dated entry to `docs/devlog.md` — what landed, what's next, what surprised you. Lighter than commits, denser than `CHANGELOG`. Future-you reads it before starting work.
4. **`/close` at session end.** Updates `docs/RESUME.md` (state + next tasks + open decisions) and writes a `/log` entry. Read RESUME first thing next session.
5. **Spec → build → smoke → log → close.** That's the loop. When you find yourself skipping a step often, ask whether it's the wrong step or the wrong moment — don't paper over it with more ceremony.
6. **The conscience still runs.** Quickstart's nudges (validation drift, "Done!" graduation) keep firing — MVP doesn't replace the front of the funnel, it sits behind it.

## Git workflow (trunk-based, review-bounded)

> AI changed which part of version control hurts: the agent writes code ~4× faster, but **review** is now the bottleneck. Keep batches small enough that two humans can actually stand behind what merged. Full depth: `git-workflow` practice.

- **Trunk-based default.** Commit to `main` or branches that live hours, not days; merge daily; keep fewer than ~3 active branches (DORA: ~2.3× more likely to be elite). `/smoke` green before every commit is what makes that safe — your smoke check *is* your CI until surface area earns a real pipeline.
- **Worktrees are how you parallelize agents — capped at ~2–4 = your *review* capacity, not your agent count.** You can spawn ten agents; you can't read ten diffs well. More agents than you can review isn't throughput, it's unreviewed code with your name on the merge. One worktree per `FEAT` (a vertical slice) so they don't collide.
- **Risk-tiered review, not blanket gates.** Low-risk (copy, styling, isolated pure functions) — a glance. High-risk (auth, money, migrations, deletes, deploys, AI-mediated paths) — the *other* human reviews it, and `/smoke` + `/evals` + `/red-team` are that high-risk tier.
- **Read the test diff harder than the code.** Agents under pressure to go green will quietly rewrite assertions to match broken behaviour. Ask: *did the behaviour get fixed, or did the expectation get lowered?*
- **Whoever clicks merge owns what the agent wrote.** "The AI wrote it" is not an owner. **Ownership = the prompt-author's intent + the reviewer's acceptance** — the agent is the instrument.
- **Mob the hard problems.** With an AI as your pair, you question its suggestions *less*. For genuinely novel/risky work, put both humans + the agent on it together rather than one founder solo in a worktree.
- **Honesty anchor (METR, n=16):** experienced devs on mature repos were 19% *slower* with AI while *believing* they were 20% faster. Trust the green `main` and the merged diff, not the feeling of speed.

## Shipping (localhost is not shipped)

> The CI half above keeps `main` green; this is the **CD** half — *is this where a real user can hit it, or just you?* An app only you can reach is a pseudo app: you can't prove pain, fit, or willingness-to-pay on it. Full depth: `ship-it-live` practice; the runner: `/ship`.

- **Deploy early, cheap, reversible.** Get a real URL at MVP, not at launch — smallest viable host, reversible-and-cheap over impressive. "I'll deploy when it's polished" costs you the only thing that's scarce this early: contact with a real user. (The "reliability is premature at MVP" counter doesn't survive scrutiny — what staying on localhost saves you isn't worth what it costs.)
- **Secrets & authz at the boundary — the leg with teeth.** Never ship a secret in the client bundle, and if the app talks to a database with a public/anon key, the row-level security is what stands between your users and the internet — and the AI does **not** configure it by default. This is the signature vibe-coded leak (CVE-2025-48757 / MoltBook — 170+ apps, 1.5M credentials, founders who wrote no code). `/ship`'s pre-flight + `/red-team`'s pre-ship pass catch it; run them before the first public URL.
- **Rollback ≠ reversible.** Instant rollback restores the *app*, not the *database* — a migration that ran doesn't un-run. Name the revert path before you deploy, and make schema changes backward-compatible (expand-migrate-contract) so a code rollback never strands the data.
- **Honesty anchor (DORA 2024):** AI adoption correlated with *worse* delivery stability and throughput. Faster shipping isn't safer shipping — the instrument is measured (change-fail rate, time-to-restore), not the feeling.

## What MVP adds (alongside Quickstart)

- **Skills:**
  - `/spec` — promote idea → `FEAT-NNN` spec (v0.21.0+: includes validated-learning field per
    Ries, evals field per Husain, moment #4 restraint check against canvas-loop)
  - `/smoke` — build-health gate; configured per stack
  - `/evals` — AI-correctness gate paired with smoke (Husain; v0.21.0+). For any FEAT with
    LLM in control flow, the eval set lives in `docs/evals/FEAT-NNN.yml`. 20 cases beats 0;
    categorize failures by mode.
  - `/pretotype` — demand-test the bet BEFORE building (Savoia; v0.21.0+). Fake-door / WoZ /
    Mechanical-Turk / Pinocchio / YouTube test / impresario. Set the threshold before running.
  - `/design-tokens-init` — scaffold the three-layer token system at the *first UI commit*
    inflection (IDEA-010 Phase 2; v0.21.0+). Cohort-aware delivery. Prevents the 47-blues /
    pattern-reinvention / billion-line-drift failure modes.
  - `/ai-cost` — declare the AI spend contract at the *first LLM-call* inflection (v0.25.0+).
    Cohort-aware budgets (first-product strict, vibe-virtuoso inspect-only, domain-expert
    privacy-first), per-call cost logger, review cadence. Closes `cost-budget-loop`.
  - `/cost-review` — read the ledger (the cadence /ai-cost only declared; v0.30.0+). Reads
    `.boss/cost-log.jsonl`, summarizes by FEAT + user + cohort, compares against budget,
    flags surprises, writes `docs/cost-reviews/REVIEW-YYYY-MM-DD.md`. Closes
    `cost-review-loop`. *Both halves required: declare AND read.*
  - `/ai-first-init` — bake AI-first discipline upfront (v0.26.0+). Conductor skill that
    walks the founder through `docs/ai-first.md` (declare what's AI-mediated) → structured
    outputs (Liu, `docs/schemas/`) → eval set (Husain, via `/evals`) → cost budget
    (`/ai-cost`) → failure-state design (`/ai-failure-states`). Run after `boss unlock mvp`
    when the project is AI-native. The "from day one" sequence.
  - `/ai-failure-states` — design the five failure modes' UX before they happen (v0.26.0+).
    Garbage / refusal / hallucination / timeout / cost-spike, each with a declared response +
    stub fallback handler in code. Cohort-aware. Closes `ai-failure-state-loop`. **Domain-
    expert cohort: hallucination response defaults to human-in-the-loop, not retry.**
  - `/extract` — PRINCIPLE #1's own discipline as a skill (v0.29.0+). Reads recent work and
    proposes 1-3 extraction candidates, each routed **UP** (into BOSS's `library/<cat>/`
    via `boss learn`) or **DOWN** (into the app's `src/`) — or honest **NOT-YET**. The
    LLM-as-judge counterpart to predicate-based loops; closes `extraction-loop`. *Two
    destinations, not one.*
  - `/drift-deep` — the deep, whole-project drift audit (v0.37.0+). The 1M-context *"am I
    fooling myself across EVERYTHING I've built?"* counterpart to the cheap, bounded `drift`
    hook moment. Reads the canvas + ALL devlog + every FEAT spec + the actual `src/` code and
    judges whether the body of work validates the named riskiest assumption or builds around
    it. Verdict (on-aim / drifting / mixed) → `docs/drift-audits/DRIFT-YYYY-MM-DD.md`.
    Deliberate + founder-invoked (the cost discipline: a whole-project read can't be
    per-prompt) — no loop, no nudge, you run it when you want the truth.
  - `/ship` — put it where a real user can hit it (v0.92.0+, FEAT-024). The CD half: detect
    the stack → deploy-time pre-flight (no client-bundled secrets; server-side authz/RLS
    actually on — the CVE-2025-48757 / MoltBook vibe-coded-leak surface) → cheapest reversible
    host → hand back the live URL + the rollback path. Stack-neutral (no baked-in target);
    the pre-flight is a check, not a gate. Full depth: `ship-it-live` practice.
  - `/log` — devlog
  - `/close` — session-end RESUME update
- **Builder agents:** `tester` (owns the smoke gate + acceptance checks for FEATs);
  `planner` (sequencing — the *when*, distinct from `product-lead`'s *what*); `designer`
  (the whole surface — how it looks *and* how it behaves: tokens, the 5 states, empty/loading/
  error, accessibility, and the copy inside all of it. Runs `/design-review` before code and
  `/ux-check` after. One designer, not a visual/interaction split — that split is an org chart,
  not a seam in the work).
- **Mentor agents:** `mentor-architect` (AI-native stack/architecture, advisory);
  `mentor-customers` (first 100, channels, positioning); `mentor-capital` (model, pricing, what someone
  would actually pay — it owns `/money`'s first-price step); `mentor-cofounder` (a founding *team*
  working across different skill sets — the seam AI widens by making you both faster separately;
  dormant and irrelevant if you're solo, `boss team add` is what makes it earn its place).
- **You don't have to pick one.** `/consult` is the door: ask your question once, and it routes to
  the mentors who actually have a stake, gives you each lens in its own voice, and **keeps the
  disagreement visible** rather than averaging it into one confident answer — *"fundraising says
  raise now; business says your unit economics aren't ready"* is the useful output, not a bug in
  it. The split is the decision. Use it for anything cross-cutting; ask a single mentor directly
  when you already know whose question it is.
- **Loops** (on the v0.18 generic loop primitive, MVP-stage):
  - `spec-loop` — gates spec writing on canvas-loop closure (encodes moment #4 restraint;
    skill-side detection via `/spec`)
  - `pretotype-loop` — records that demand-testing happened before significant build
  - `design-tokens-loop` — JIT scaffolds the design token system when UI starts accumulating
    (conscience emits `coherence` moment when entry-met / exit-unmet)
  - `cost-budget-loop` — opens at the first LLM SDK call in `src/` without a budget doc
    (conscience emits `cost` moment when entry-met / exit-unmet; v0.25.0+)
  - `ai-failure-state-loop` — opens at the first LLM SDK call in `src/` without a failure-
    states design doc + fallback handlers (conscience emits `failure-mode` moment when
    entry-met / exit-unmet; v0.26.0+). Same entry inflection as `cost-budget-loop`; the two
    failure modes always coexist at the AI-mediated boundary.
  - `extraction-loop` — PRINCIPLE #1's own discipline (v0.29.0+). Opens when `docs/devlog.md`
    has ≥3 dated entries and no `EXTR-NNN` extraction record exists. Conscience emits the
    `capture` moment; founder runs `/extract` to record the routing decision (UP / DOWN /
    NOT-YET). First hook-runner loop whose entry is *time-of-work* (devlog count) rather than
    *file-state predicate* — sets the precedent for future judgment-required moments.
  - `cost-review-loop` — the cadence half of cost discipline (v0.30.0+). Opens once
    `docs/ai-cost-budget.md` exists and no cost-review file is on record. Conscience emits
    the `cost-stale` moment; founder runs `/cost-review` to read the ledger. Second
    time-of-work entry pattern (declaration → read sequence).
  - `drift-loop` — the work vs. the named risk (v0.31.0+). Opens when a canvas has a real
    **Riskiest assumption** + `docs/devlog.md` has ≥3 dated entries + no real **Experiment
    this week** validation plan. Conscience emits the `drift` moment — the gap *between*
    `caution` (no risk named) and `done` (graduation). The first moment fronting a *model
    judgment the predicate can't make*: the gate is cheap (risk named + work piling up + no
    plan), but the model reads a bounded set (risk line + ~5 recent devlog + open FEAT) and
    judges whether the work is *testing* the risk or building *around* it — naming the specific
    gap, staying silent when on-aim. Closes when the validation plan is recorded (`/canvas`)
    or run (`/pretotype`).
- **Conventions:** `FEAT-NNN` for features in build (already listed in `docs/IDS.md`);
  `docs/devlog.md` is append-only (override grammar lives here per IDEA-008);
  `docs/RESUME.md` is the living state pointer; `docs/loops/` lives alongside `docs/ideas/`;
  `docs/design/DESIGN_TOKENS.md` arrives JIT when design-tokens-loop opens.
- **Graduation:** when the app earns design-system rigor / a real db / prototypes / a board
  → `boss unlock v1`.
