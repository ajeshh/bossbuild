---
name: smoke
description: Run the project's smoke check — "is the app even working right now?" Stack-configured. The minimum gate before a commit in MVP mode. Fast. Doesn't test correctness, tests aliveness. Usage - /smoke
---

# /smoke — is the app even alive?

A smoke check is not a test suite. It's the **fastest possible signal that the app still runs.** In
MVP it's the one gate before a commit: if smoke is red, you broke something basic; if it's green,
you've earned the right to ask deeper questions (which the `tester` agent handles).

Smoke is **stack-specific** — there's no universal command. This skill's job is to find the
project's smoke command and run it; if there isn't one yet, help configure it (once).

## Step 0 — does it already exist, and is this the right rung?

**Look for the build-health gate before you make one** — `.boss/smoke.json`. A project can have a smoke gate under another name — a `verify`/`check` make target, a `test` script that actually boots the app, a pre-commit hook. If they have one, the gap is BOSS's blindness, not their discipline; say so and wire to it rather than adding a second. If it's there: say so and stop
when it's fine (a complete outcome, not a failure to act), or name the *specific* gap and offer the
*specific* edit when it's behind. Never quietly generate a second one.

**Rung: MVP.** If this project is **earlier** than that, don't run this — and there is **no seam** worth planting, which is a complete answer rather than a gap: A gate costs the same to add later. What is genuinely lost belongs to `spec` above — the criterion, not the runner.

## How to run it

1. Look for the smoke command, in this order:
   - `.boss/smoke.json` → `{ "command": "...", "configuredAt": "..." }` (preferred — explicit).
   - `package.json` → `"scripts": { "smoke": "..." }`.
   - The project's stack convention (Node: `npm run build`; Python: `python -m <pkg> --version` or `pytest -x tests/smoke`; Rust: `cargo check`; Go: `go build ./...`).
2. **If no smoke is configured yet:** don't guess silently. Ask the user what proves the app is
   alive — one command, fast (under ~30s), no network if possible. Save it to `.boss/smoke.json`
   and append a one-line note to `docs/devlog.md` recording the choice.
3. Run it. Stream output. Report the result in one line:
   - **Green:** `✓ smoke — <cmd> (<duration>)`. Done.
   - **Red:** `✗ smoke — <cmd>` plus the first failing chunk of output. Don't try to fix it inside
     this skill — surface it; the user (or the `tester` agent) decides.
4. If the FEAT-NNN being built specifies its own smoke check in its spec, run that *in addition*
   to the project-wide smoke. A FEAT-specific smoke is the acceptance check stripped to its bones.

## The first time — plant the two cheapest enforced conventions with it

When you save `.boss/smoke.json` for the first time, ask one more question and stop there: **does the
stack have a strict typecheck and a formatter, and are they on?** (`tsc --strict` / `mypy --strict` /
`cargo clippy`; Prettier or Biome / `ruff format` / `rustfmt`.) If they exist and are off, turn them on
now and fold the typecheck into the smoke command — `"tsc --noEmit && <boot>"`. Two config lines, not a
practice: this is the seam `seed-to-scale` names, because a strict mode is the cheapest enforced
convention there is and the most painful one to retrofit onto a codebase an agent has been growing
for three months. If the stack has neither, say so and move on — nothing to plant.

**Then offer the runner, once.** The gate only holds if something runs it at the moment nobody
remembers to — when Claude finishes a turn and says "done." `.claude/hooks/smoke-guard.js` is that:
a dormant `Stop` hook that runs this command once per turn that touched source, reports green in
one line, and hands red back as a reason to keep going (exactly once — it never blocks twice on the
same failure). The file's header has the settings.json block to paste; `boss help hooks` lists it
with the other guards. **Documented conventions rot; enforced ones compound** — `/smoke` documents
the gate, `smoke-guard` is what enforces it. Offer it; don't register it for them.

## What smoke is and isn't

- **Is:** does the app start, build, or run its happiest path without exploding.
- **Isn't:** does the feature work correctly. That's acceptance criteria, owned by `tester`.
- **Isn't:** the whole ladder. Smoke is **rung 1** of six (`boss craft testing-with-agents`).
  Rungs 2–4 — the money path, the destructive path, and *can user A reach user B's data* — are named
  in the FEAT by `/spec` and proved by `/red-team --paths`. Green smoke means you've earned the right
  to ask those, not that they've been answered.
- **Isn't:** a CI replacement. CI runs the full suite; smoke is the human-loop gate.
- **Isn't:** flaky. If smoke is intermittent, fix the smoke — it has one job, and being trustworthy is it.

## Rules

- Keep it under 30 seconds, ideally under 10. If smoke gets slow, narrow it — move the heavy stuff to `tester`.
- Smoke is a gate, not a suite. One green/red line is the whole interface.
- If smoke goes red mid-build, **stop and look** — don't accumulate more changes on top of a broken base.
- Document the smoke command in `.boss/smoke.json` once; don't re-ask the user every session.
