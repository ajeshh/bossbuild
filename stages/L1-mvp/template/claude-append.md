## MVP working rules (added on `boss unlock mvp`)

> {{MODE}} mode adds the smallest spine that lets you build: a spec, a smoke gate, a devlog, a
> session-end ritual. Capture and validate still come first. Don't out-ceremony the work.

0. **Open the session before you work in it.** The session start hands Claude where you stopped and
   what is in flight; `boss status` and `docs/RESUME.md` have the rest. A way back in, not an agenda.
1. **Spec before code.** A non-trivial change starts with `/spec` (`FEAT-NNN`: goal, acceptance
   criteria, smoke check). Throwaway one-liners don't need it.
2. **Smoke before commit.** `/smoke` green before the commit; red is information — fix it, or write
   the regression down.
3. **Devlog every session.** `/log` — what landed, what's next, what surprised you.
3b. **Write a found task down before you act on it**, in the FEAT: a **task** on *Found while
   building*, **new scope** as a `spun_to:` id (never a criterion added mid-build), an **open
   question** under *Open questions*. Every session start reads those back; what is only in the chat
   is gone at the next compaction.
4. **`/close` at session end** — RESUME, a `/log` entry, and the **Next** line rule 0 reads back.
5. **Open → spec → build → smoke → log → close.** That's the loop. Skipping a step often? Ask whether
   it's the wrong step or the wrong moment before adding ceremony.
6. **The conscience still runs** — Quickstart's nudges keep firing behind MVP's.

## Git workflow and shipping

Review is the bottleneck now, not typing: small batches, and read the test diff hardest.
`boss craft git-workflow` has the rest.

- **Trunk-based.** Short-lived branches, merged daily. Your smoke check is your CI until a push deploys.
- **Localhost is not shipped.** A real, cheap, reversible URL early — `/ship`.
- **Never a secret in the client bundle; with a public database key, row-level security is the wall**
  — and the agent does not turn it on by default. `/ship`'s pre-flight and `/red-team --paths` check it.
- **Anything that runs without you** (a schedule, overnight, an agent loop): before it runs, name what
  breaks at 3am, what says pass or fail, and who is told — `boss craft automation`.

## Who's here

`boss map` lists this rung's skills and loops, live. **Builders:** `tester` (smoke + acceptance),
`planner` (the *when*), `designer` (tokens, the five states, a11y, the copy — `/design-review`).
**Mentors:** `mentor-architect`, `mentor-customers`, `mentor-capital`, `mentor-cofounder` (dormant while
you're solo). `/consult` asks the ones with a stake and keeps their disagreement visible. IDs:
`FEAT-NNN` (`docs/IDS.md`). When the app earns design rigor, a real db and a board: `boss unlock v1`.
