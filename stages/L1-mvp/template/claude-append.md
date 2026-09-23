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

## Git workflow and shipping

Review is the bottleneck now, not typing — keep batches small enough to stand behind, and read the
test diff harder than the code. `boss craft git-workflow` holds the rest (worktrees capped at review
capacity, risk-tiered review, who owns an agent's merge, local / tracked / public).

- **Trunk-based.** Short-lived branches, merge daily. `/smoke` green before every commit, or the regression written down (rule 2) — your smoke
  check *is* your CI until a push deploys by itself — then it runs where the deploy runs, and gates it.
- **Localhost is not shipped.** Get a real URL early, cheap and reversible — `/ship`, and
  `boss craft ship-it-live` for why and how.
- **Never a secret in the client bundle; with a public database key, row-level security is the wall**
  — and the agent does not turn it on by default. `/ship`'s pre-flight and `/red-team --paths` check it.
- **Anything that runs without you** (a schedule, overnight, an agent loop): before it runs, name what breaks if it runs wrong at 3am, what says pass or fail, and who is told when it fails — `boss craft automation`.

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
  `docs/RESUME.md` is the living state pointer; `.boss/loops/` holds the conscience loops;
  `docs/design/DESIGN_TOKENS.md` arrives JIT when `design-tokens-loop` opens.
- **Graduation:** when the app earns design-system rigor, a real db, prototypes and a board →
  `boss unlock v1`.
