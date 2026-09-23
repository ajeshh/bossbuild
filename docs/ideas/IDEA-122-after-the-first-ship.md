---
id: IDEA-122
type: idea
kind: capability
owner: Ajesh
status: shipped
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
   *Shipped 2026-09-23 — see Log.*
3. **Running without you** — when a founder asks *"can this run overnight / on a schedule / without
   me?"*, walk `automation.md`'s three questions at that moment and set it up on the host's
   scheduler, the failure channel written before the trigger. *Shipped 2026-09-23 as an MVP working
   rule — see Log.*

## Open questions

- ~~Slice 3's moment~~ — answered: the MVP working rules (`claude-append.md`), because they are the
  one reader loaded on every turn, so any phrasing of *"run this overnight"* meets it. Not a
  conscience moment (it would fire on a keyword and has no timestamp to read), not a skill.
- ~~Existing MVP projects do not get the slice 3 rule~~ (true when written: `claude-append.md`
  folded into CLAUDE.md once, at unlock). `mentor-architect`'s
  *automation shape* (which does sync) carries the same three questions. ~~Is that enough?~~ —
  first answered with a paste-line in `For you:`, then overtaken the same afternoon: a peer's
  `aaf0ad4` (IDEA-121) made `boss sync` update BOSS's CLAUDE.md block at region scope, so the rule
  reaches existing projects unasked. The paste-line stays for founders who edited the block.
- ~~Does the `/incident` seam move down?~~ — no; it stays Scale's, and now points back at the stack
  profile `/ship` wrote (seam edited in `registry/surface-ladder.json` and the skill together).

## Log

- 2026-09-23 — captured; slice 1 built into `stages/L1-mvp/template/.claude/skills/ship/SKILL.md`
  (step 3b, step 4 verify, a Rules line, the description).
- 2026-09-23 — slices 2 and 3 built. `/ship` step 3c: deploy-on-push offered once, when the stack
  profile exists and nothing deploys on push (no counter field — the profile *is* the signal);
  host's git integration before a CI job; the smoke gates the deploy and 3b's live check runs after
  it, or the offer isn't made. `git-workflow.md` names the outgrown moment (a push that deploys by
  itself). MVP working rules: the three questions before anything runs unattended, and the CI line
  in the Git section now points at the same moment.
- 2026-09-23 — both open questions closed without a new mechanism: the paste-line in `For you:`,
  and `/incident`'s seam pointing at `/ship`'s stack profile. Nothing left on this record but the
  proof — a founder who ships with it.
