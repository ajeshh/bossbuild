# /ship — step 3c, making the push deploy

If yes, the cheapest rung first:

- **The host's own git integration** — most hosts deploy on push and build a preview per branch once
  the repo is connected. One setting, nothing to maintain. Usually the whole answer.
- **A CI job** — only when the host has no integration or the deploy needs a step it can't run. One job,
  not a matrix.

Either way, **two things travel with it, or it isn't safe to hand over:**

1. **The smoke gates the deploy.** The command in `.boss/smoke.json` runs before the deploy, and a red
   one stops it. Without that, every push is an unreviewed deploy.
2. **Step 3b runs without you.** Nobody is at the keyboard to hit the live URL anymore, so the pipeline
   does it after the deploy and fails loudly if it doesn't answer, or the step 3b channel is what
   catches it. If 3b was answered `not yet`, say once: *from here, a broken deploy reaches users before
   it reaches you.* Don't re-ask the 3am question.

Write *"deploys on push"* into the stack profile so this is never offered again, and name the new
rollback (usually the host's *redeploy previous*, or a revert commit). Declined is fine; record it and
don't re-offer. `--preview` is the one-branch version of the same thing.
