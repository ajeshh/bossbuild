---
id: IDEA-119
type: idea
kind: capability
owner: Ajesh
status: shipped (2026-09-23, under Unreleased)
proof: stages/L1-mvp/template/.claude/skills/ux-check/SKILL.md
gist: The host now ships a command that launches and drives the app, and a security review of pending changes. /ux-check was marking rendered checks "not checked" for want of the first; /red-team --paths was re-deriving the generic half of the second. Point both at the host, keep BOSS's own half.
created: 2026-09-23
program: harness
relates: IDEA-103, IDEA-120
---

# IDEA-119 — Lean on the host's own run and review

## Current shape

Ajesh (2026-09-23), after the model moved to Opus 5.5: *"anything to overall improve how we do it for
shipped."* → *"go for all of it."* Altitude: what BOSS ships to a founder.

**The model is not the trigger** (`model-routing.md`: shipped artifacts name no model and inherit).
What moved is the host. Three candidates were raised; two are shipped, one is a recorded NO.

**Checked before building:** the brew binary (2.1.236, the oldest one on this machine) carries the
launch-and-drive skill, `security-review` and `/schedule` (`strings` on the binary). Not newest-only.

## Tasks

- [x] **A. `/ux-check` step 2 — the host may be able to render.** A built-in command that starts the
  app and drives it (browser included, screenshots) turns *not checked* into *observed* with nothing
  installed. The session holding the shell renders; the `designer` agent still has no Bash. Named as a
  class (no-vendor-names rule), look-then-use, the observed/inferred split unchanged.
- [x] **B. `/red-team --paths` — hand the generic half to the host's review.** A built-in security
  review of pending changes covers the OWASP-basics half; give it the FEAT's three paths as context.
  It sees the diff, not the history or the running app — the secrets-in-history scan and the three
  run-it paths stay BOSS's. Subtraction, not a new step.
- [x] **C. Schedule `/cost-review` and `/comp-eval` — NO.** Measured: `.boss/cost-log.jsonl` is
  gitignored in every founder project, so a scheduled cloud run reviews an empty file; `/comp-eval`
  says *"Not a tracker"*; `/roadmap`, `/health`, `/revalidate` all refuse a schedule BOSS chose; and
  `automation.md` already hands the founder who asks to the host's scheduled agents. Nothing to add.

## Not done, on purpose

- Model or `effort:` keys in shipped files — the routing rule says inherit. `effort:` waits for `/recalibrate`.
- The multi-agent Workflow tool in a shipped skill — explicit opt-in per run and heavy token use; wrong for a first-product founder.
