---
id: IDEA-103
type: idea
owner: tester
status: shipped (v0.320.0, 2026-09-12 — one case, two graders, Δ = 1.0)
gist: Claude Code ships `claude plugin eval` (scored, reproducible, with a no-plugin baseline arm) and BOSS ships as a plugin with no `evals/` cases — so the second instrument on the watchlist cannot run. One case is enough to start, and the door is the case - `/boss:welcome` hears the idea and says it back (IDEA-099), graded by whether the reply contains the founder's own words.
proof: plugin/evals/door/prompt.md
proof_note: >
  Two cases - plugin/evals/door/ (v0.320.0) and plugin/evals/repo-door/ (v0.321.0, with 1.0 / without
  0.33). plugin/evals/door/{prompt.md, graders/reflection.md, graders/offer-and-wait.md}; plugin.json
  experimental.evals = plugin/evals; `npm run eval:plugin`. Three runs on 2.1.269 - with 1.0 / without 0
  / delta 1.0, $0.19-0.26 each. Results dir gitignored. NOT verified - a real founder at the door (n=0).
created: 2026-09-12
relates: IDEA-099, DEC-017, RVW-102, SESSION-2026-09-12-agentic-practice-since-the-harness-sweep
---

# IDEA-103 — a plugin eval suite, so the instrument can run

> Seed: 2026-09-12, the vet sweep added `claude plugin eval` (host 2.1.269) to the watchlist as the
> second *instrument* beside `/skill-doctor`. Ajesh: *"same for plugin eval?"* Checked the same day:
> the plugin ships no cases, so there is nothing to run. An instrument with no probe is a tap in name.

## What the host offers (from `--help`, fetched)
- Cases: `evals/**/case.yaml`, or `prompt.md` + `graders/*.md`; results to `<plugin>/evals/results/`.
- `--ablation with-without` by default when a plugin resolves: a **no-plugin baseline arm** and the
  score delta — which is the one number BOSS has never had: *does the plugin change what the model
  does, against the same prompt without it?*
- `--judge-model` (default haiku), `--max-cost-usd`, `--json`, HTML report (`--no-publish` to keep local).

## The first case, and why it is the door
IDEA-099 shipped the door (`/boss:welcome` hears the idea first, says it back, offers once, writes
nothing) and named three behaviours to measure with n=0 founders. A plugin eval is the cheapest of
those measurements: **prompt** = a founder's one-paragraph idea; **graders** = (1) the reply contains
at least two of the founder's own nouns, (2) the reply asks *why this one*, (3) no file is written
(`tool_used: Write` absent), (4) `tool_used: Skill` fires — the with-only indicator. The baseline arm
without the plugin should fail (1)–(3) or not fire (4); if it passes them anyway, the door is not
adding anything and that is worth knowing before Phase 3 outreach.

## Built the same day — what the first run taught
Run 1 failed *offer-and-wait* 3/3: no Bash in the sandbox, so the door apologised for the shell and named the
install fallback, and the judge read a named command as an act. Fix was to the CASE - `Bash(boss:*)` allowed,
grader fails only on scaffolding or proceeding. `tool_used: Skill` is the wrong indicator for a slash command
(0× even when it fired); the baseline's "Unknown command" is the indicator. Runs 2 and 3 - 1.0 / 0 / Δ 1.0.

## Not now, and why (as written before the build)
One case is a build (a dir, a yaml, three graders, a run, a results file to read). The tree is mid-
release with a peer session; and the door has n=0 real founders — an eval that scores the door before
anyone has walked it is the right *order* only if it is cheap. It is cheap. **Re-open: the next quiet
session, before the plugin is submitted to `claude-community` (DEC-017).**
