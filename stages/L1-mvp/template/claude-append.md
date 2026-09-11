## MVP working rules (added on `boss unlock mvp`)

> {{MODE}} mode adds the smallest spine that lets you actually build: a spec, a smoke gate, a devlog, a
> session-end ritual. Same conscience — capture and validate still come first. Don't out-ceremony the work.

0. **Open the session before you work in it.** If you have been away a few days, BOSS opens it for you — the `reentry` hook hands Claude what you last landed and what you said was next, the moment the session starts. That is a way back in, not an agenda; ignore it freely. For the fuller picture, run `boss status` and read `docs/RESUME.md`. `/close` wrote down where you stopped and what you said was next; starting without reading it is how a session spends its first twenty minutes re-deriving what you already knew. `boss status` answers it in one read — how long you've been away, what you last landed, what you said was next, and what the work has actually taught you. If you've been away a while, that line comes first on purpose.
1. **Spec before code.** Any non-trivial change starts with `/spec` — promotes an idea to `FEAT-NNN` with a goal, acceptance criteria, and a smoke check. Throwaway one-liners don't need it.
2. **Smoke before commit.** `/smoke` runs the stack's "is the app even working" gate. Green before the commit, red is information — fix or document the regression.
3. **Devlog every session.** `/log` appends a dated entry to `docs/devlog.md` — what landed, what's next, what surprised you. Lighter than commits, denser than `CHANGELOG`. Future-you reads it before starting work.
3b. **Write a found task down before you do anything with it.** The acceptance criteria in the FEAT are the work you *planned*; the things you notice at hour three are the ones that go missing, because they live only in this chat. Put them in `.claude/rules/feature-context.md` as you find them, sorted three ways: a **task** stays on that list, genuinely **new scope** becomes a `spun_to:` id (never a criterion bolted onto a FEAT already in flight), and an **open question** goes to that file's questions block. The conscience will notice when the list in the chat has outrun the file, but **it fires on a timestamp and cannot see whether you already wrote them down** — it is a reminder, not a referee. The cost of skipping this is not lost minutes: recovering by re-reading what you built tells you what you *did*, and can never tell you what you *meant to do next*.
4. **`/close` at session end.** Updates `docs/RESUME.md` (state + next tasks + open decisions) and writes a `/log` entry — including the **Next** line, which is what rule 0 reads back.
5. **Open → spec → build → smoke → log → close.** That's the loop. When you find yourself skipping a step often, ask whether it's the wrong step or the wrong moment — don't paper over it with more ceremony.
6. **The conscience still runs.** Quickstart's nudges (validation drift, "Done!" graduation) keep firing — MVP doesn't replace the front of the funnel, it sits behind it.

## Git workflow (trunk-based, review-bounded)

> AI changed which part of version control hurts: an agent writes code several times faster and you deliver only a little more, because **review** is now the bottleneck. Keep batches small enough that two humans can actually stand behind what merged. Full depth: `git-workflow` practice.

- **Trunk-based default.** Commit to `main` or branches that live hours, not days; merge daily; keep few active branches — the shape DORA associates with elite delivery. (The framing, not the multiplier: DORA's primary is a gated PDF, so every figure in circulation is second-hand.) `/smoke` green before every commit is what makes that safe — your smoke check *is* your CI until surface area earns a real pipeline.
- **Worktrees are how you parallelize agents — capped at ~2–4 = your *review* capacity, not your agent count.** You can spawn ten agents; you can't read ten diffs well. More agents than you can review isn't throughput, it's unreviewed code with your name on the merge. One worktree per `FEAT` (a vertical slice) so they don't collide.
- **Risk-tiered review, not blanket gates.** Low-risk (copy, styling, isolated pure functions) — a glance. High-risk (auth, money, migrations, deletes, deploys, AI-mediated paths) — the *other* human reviews it, and `/smoke` + `/evals` + `/red-team` are that high-risk tier.
- **Read the test diff harder than the code.** Agents under pressure to go green will quietly rewrite assertions to match broken behaviour. Ask: *did the behaviour get fixed, or did the expectation get lowered?*
- **Whoever clicks merge owns what the agent wrote.** "The AI wrote it" is not an owner. **Ownership = the prompt-author's intent + the reviewer's acceptance** — the agent is the instrument.
- **Three tiers, not two: local / tracked / public.** `.gitignore` keeps secrets and per-person tool state off the repo; the working record (decisions, evidence, canvas) *commits*, because a record only you can read isn't one. "Private repo" is a switch, not a tier — flipping it publishes every commit you ever made, key-adding ones included. And ignoring a file stops commits, not agent reads.
- **Mob the hard problems.** With an AI as your pair, you question its suggestions *less*. For genuinely novel/risky work, put both humans + the agent on it together rather than one founder solo in a worktree.
- **Honesty anchor (METR, n=16):** experienced devs on mature repos were 19% *slower* with AI while *believing* they were 20% faster. Trust the green `main` and the merged diff, not the feeling of speed.

## Shipping (localhost is not shipped — whatever "shipped" means for what you're building)

> The CI half above keeps `main` green; this is the **CD** half — *is this where a real user can hit it, or just you?* An app only you can reach is a pseudo app: you can't prove pain, fit, or willingness-to-pay on it. Full depth: `ship-it-live` practice; the runner: `/ship`.

- **Deploy early, cheap, reversible.** Get a real URL at MVP, not at launch — smallest viable host, reversible-and-cheap over impressive. "I'll deploy when it's polished" costs you the only thing that's scarce this early: contact with a real user. (The "reliability is premature at MVP" counter doesn't survive scrutiny — what staying on localhost saves you isn't worth what it costs.)
- **Secrets & authz at the boundary — the leg with teeth.** Never ship a secret in the client bundle, and if the app talks to a database with a public/anon key, the row-level security is what stands between your users and the internet — and the AI does **not** configure it by default. This is the signature vibe-coded leak (CVE-2025-48757 / MoltBook — 170+ apps, 1.5M credentials, founders who wrote no code). `/ship`'s pre-flight + `/red-team`'s pre-ship pass catch it; run them before the first public URL.
- **Rollback ≠ reversible.** Instant rollback restores the *app*, not the *database* — a migration that ran doesn't un-run. Name the revert path before you deploy, and make schema changes backward-compatible (expand-migrate-contract) so a code rollback never strands the data.
- **Honesty anchor (DORA 2024):** AI adoption correlated with *worse* delivery stability and throughput. Faster shipping isn't safer shipping — the instrument is measured (change-fail rate, time-to-restore), not the feeling.

## What MVP adds

**Run `boss map`.** It renders this rung's skills and loops from the install itself, in the order you
actually use them — which is why this file no longer lists them. A hand-typed inventory here was ~100
lines read on *every* turn, and it drifted from the manifest the moment either moved.

- **Builders:** `tester` (the smoke gate + acceptance checks), `planner` (sequencing — the *when*, as
  against `product-lead`'s *what*), `designer` (the whole surface: tokens, the five states, a11y and
  the copy inside them — `/design-review` before code, `/ux-check` after).
- **Mentors:** `mentor-architect` (stack + architecture), `mentor-customers` (first 100, channels,
  positioning), `mentor-capital` (model, pricing, what someone would actually pay), `mentor-cofounder`
  (a founding *team* across different skill sets — dormant while you're solo). **You don't have to
  pick one:** `/consult` routes a cross-cutting question to whoever has a stake and **keeps their
  disagreement visible** rather than averaging it into one confident answer. The split is the decision.
  *(Agents must be named somewhere in this file or nothing will ever invoke them — `check-manifests`
  enforces exactly that, which is how this list survived the cut the inventory above did not.)*

- **Conventions:** `FEAT-NNN` for features in build (`docs/IDS.md`); `docs/devlog.md` is append-only;
  `docs/RESUME.md` is the living state pointer; `docs/loops/` sits alongside `docs/ideas/`;
  `docs/design/DESIGN_TOKENS.md` arrives JIT when `design-tokens-loop` opens.
- **Graduation:** when the app earns design-system rigor, a real db, prototypes and a board →
  `boss unlock v1`.
