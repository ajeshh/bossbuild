---
id: IDEA-028
type: idea
owner: mentor-architect
status: shipped
program: host-and-portability
proof: none
proof_note: The audit produced DECISIONS (retire onto the host / sit on top / keep), not an artifact. Its output is recorded in the record itself and in the mechanisms that were retired.
created: 2026-06-20
---

# IDEA-028 — Host-subtraction audit (what to retire onto the native host vs. keep as judgment)

> Seed: 2026-06-20 trends pass
> ([SESSION-2026-06-20](../research/sessions/SESSION-2026-06-20-trends-and-dhun-scan.md)). A
> **subtraction** idea — on-voice for BOSS ("the seasoned hand who doesn't need the credit"). Twin of
> [[IDEA-006]] (host portability) and [[IDEA-014]] (model recalibration): both are about BOSS knowing
> what the host now owns. Advisory — a `mentor-architect` pass, not a feature.

## The observation

The Claude Code host shipped, in 2026, native primitives that do what BOSS's early-2026 design
hand-rolls:

| Native primitive (2026) | What BOSS hand-rolls today |
|---|---|
| `/goal` — persist across turns until a completion condition holds | predicate loops that re-fire until a condition is met |
| `/loop` — self-paced recurring run | the loop-runner cadence |
| **dynamic Workflows** — Claude writes the orchestration script | hand-authored multi-agent coordination |
| **auto-mode hard-deny rules** — classifier + unconditional blocks | the `secrets-guard` PreToolUse pattern (partly) |
| hooks see `effort.level` / `$CLAUDE_EFFORT`; conditional `if` hooks | static hook firing |

Mollick (2026): *"the harness, not the model, is the differentiator."* The corollary BOSS must face:
**when the harness absorbs a mechanism, re-rolling it is no longer differentiation — it's drift.**

## The strategic question

For each BOSS mechanism, decide: **retire onto the host**, **sit on top of the host primitive**, or
**keep as the differentiated judgment layer.** The judgment layer is BOSS's moat (conscience,
mentors, modes, the humane lens, UP/DOWN learning) — the *plumbing* underneath increasingly is not.

- **Likely retire / sit-on-top:** the loop *cadence* mechanics → `/loop`; loop-until-condition →
  `/goal`; multi-agent coordination scripts → dynamic Workflows; per-tool hard blocks → auto-mode
  hard-deny rules. BOSS keeps the *predicate's judgment*, rents the *firing machinery*.
- **Keep (the moat):** which moments exist and why; the voice/register; UP/DOWN routing; mode gates;
  humane-before-viable; the venture brain ([[IDEA-022]]).

## Why now / why not

- **Now:** [[IDEA-026]]'s upstream conscience wants a mount point (plan mode / `/goal`); choosing it
  *is* a host-subtraction decision. And the loop-runner is maintenance surface BOSS could shed.
- **Restraint:** BOSS's loop runtime ([[IDEA-008]]/FEAT-001) works and 100+ evals pass against it.
  Retiring working machinery for host primitives risks churn + a portability regression ([[IDEA-006]]:
  hooks don't port to non-Claude hosts — so host-native loops are *less* portable, not more). So this
  is **decide deliberately, retire nothing speculatively.**

## Smallest shippable slice
A `mentor-architect` audit doc (`docs/dossier/host-subtraction-pass-001.md`): the table above, a
keep/retire/sit-on verdict per mechanism, and the [[IDEA-026]] mount-point recommendation. No code
retired until a verdict is taken with Ajesh. Produces the decision that unblocks [[IDEA-026]] Part A.
