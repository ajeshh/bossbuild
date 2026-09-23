---
id: IDEA-122
type: idea
kind: capability
owner: Ajesh
status: building
proof: none
proof_note: stated by Ajesh 2026-09-23, not by a founder — EVID-001/003 are about orientation, not ops. Slice 1 is carried on the "silent failure" principle, not on demand; the first founder who ships and then says "I didn't know it was down" (or doesn't) is the evidence
gist: BOSS gets a founder to the first deploy well and stops there. After it — is it up, who hears when it isn't, does the next push deploy itself, what runs while you sleep — is advice at best. Fold the missing half into /ship, one rung at a time; no new skills.
created: 2026-09-23
program: operate
relates: IDEA-119, IDEA-121
---

# IDEA-122 — After the first ship (up, deployed, running without you)

## Current shape

Ajesh, 2026-09-23: *"for deployments, continuous deployments, having agents constantly work 24/7,
monitoring on deployment .. for entrepreneurs i am not sure how good boss is at setting up and
scaffolding those parts up."*

Measured the same day against what BOSS ships (altitude: **what BOSS ships a founder**):

- **First deploy — strong.** `/ship`: stack-aware reachability, secrets/authz pre-flight, cheapest
  reversible host, rollback with the database caveat, a kill switch for AI features.
- **Is it up? — nothing.** No post-deploy check of the live artifact, no error capture, no uptime
  ping. `/health` and `/measure` are product signals. The only ops seam is `/incident`'s one line
  (*"log errors with a timestamp… a file is fine"*), and `/incident` is a Scale skill. At MVP the
  founder's alerting system is a user's email.
- **Continuous deployment — nothing.** `/ship` is one-shot; `git-workflow.md` deliberately holds
  CI at *"your `/smoke` is your CI"* and never names when that's outgrown.
- **24/7 agents — a practice, not a scaffold.** `automation.md` is right (rung 0 = script + schedule;
  the three questions; rent the runner — the host's scheduled agents or CI). Reached only via
  `boss craft automation`, `/ai-first-init`, `mentor-architect`. Its question 3, *"who gets told
  when it fails?"*, is stated and never asked at a moment.

Shape: **fold into `/ship`, don't add skills** (the EVID-001 mandate: compose + subtract).

## Slices

1. **Is it up, and who hears when it isn't** — `/ship` step 3b: hit the live artifact after the
   deploy (a smoke against production, not localhost); ask once who finds out at 3am and set up the
   cheapest rung (host logs → an external uptime check → error capture); record the answer,
   `not yet` included, in the stack profile. `--rollback` verifies the restored build the same way.
   *Shipped 2026-09-23 — see Log.*
2. **CD when earned** — on the second manual `/ship` of the same stack, offer once to connect the
   repo so a push to main deploys (host's git integration first, a CI job second), gated by the
   smoke that already exists. Also: `git-workflow.md` names the moment `/smoke`-as-CI is outgrown.
3. **Running without you** — when a founder asks *"can this run overnight / on a schedule / without
   me?"*, walk `automation.md`'s three questions at that moment and set it up on the host's
   scheduler, the failure channel written before the trigger. Owner: `mentor-architect` or `/ship`
   — open.

## Open questions

- Slice 3's moment: which reader catches *"run this overnight"* — a conscience moment, the
  architect mentor, or `/ai-first-init`? A new skill is the last answer, not the first.
- Does the Scale `/incident` seam line move down to MVP now that `/ship` asks the question? (Probably
  it becomes a pointer back to the stack profile.)

## Log

- 2026-09-23 — captured; slice 1 built into `stages/L1-mvp/template/.claude/skills/ship/SKILL.md`
  (step 3b, step 4 verify, a Rules line, the description).
