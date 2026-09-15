---
id: IDEA-079
type: idea
owner: product-lead
status: shipped
proof: stages/L0-quickstart/template/.claude/agents/prompt-coach.md
shipped_on: 2026-09-08
evidence: >
  [VERIFIED] mechanically. (1) `stages/L0-quickstart/template/.claude/agents/prompt-coach.md`
  quotes Simon Willison — *"prompt is code; treat it as code. Version it. Document it. Don't reuse
  a half-remembered prompt; save the good ones"* — and stores the founder's saved prompts in
  `docs/dossier/founder-prompt-patterns.md` (lines 44 and 78). (2) `/close` tells founders to keep
  kickoff prompts in "a shell alias, a snippets app, the `Prompt for the next session` block".
  (3) `.claude/commands/` — the host's project-level, git-committed, runnable prompt store —
  appears NOWHERE in BOSS: `grep -rn "claude/commands\|slash command" stages/ library/ src/`
  returns nothing. It is real on this host: 2.1.132 lists `.claude/commands` beside `.claude/skills`
  and `.claude/agents` in its own discovery paths, and surfaces newly-committed ones as "New from
  your team". FOUNDER DEMAND [n=0] — prompt-coach crossed to Quickstart at v0.236.0 and no founder
  has used it yet.
proof_note: >
  This is a SMALL finding and should not be inflated. Nothing is broken; a markdown playbook is a
  perfectly good playbook. The claim is narrower: BOSS teaches a discipline ("save the good ones")
  and then stores the output somewhere it cannot be run, one directory away from where it could.
gist: >
  `prompt-coach` builds the founder a prompt playbook and files it as prose. The same prompt in
  `.claude/commands/foo.md` is `/foo` — invocable, versioned with the repo, visible to a cofounder,
  and carried into any session on any machine because it is a tracked file. The dossier version has
  to be found, opened, and copy-pasted. BOSS quotes "version it, treat it as code" and then ships
  the snippets-app answer.
created: 2026-09-08
source: >
  Ajesh, 2026-09-08 — "prompt storage ... prompt governance". Found by grepping the shipped surface
  for every host prompt-persistence mechanism and finding one of them named zero times.
---

# Prompt storage points away from the one place a prompt can run

## What ships today

- **`prompt-coach`** (Quickstart since v0.236.0, an agent not a skill — which is why it could
  cross without touching the 48-skill wall) rewrites a prompt, names the pattern, and appends to
  `docs/dossier/founder-prompt-patterns.md`, "create on first use".
- **`/close`** points kickoff prompts at "a shell alias, a snippets app, the `Prompt for the next
  session` block", with the honest note that they "bit-rot against the actual RESUME".

Both are reasonable. Neither names `.claude/commands/`.

## Why the distinction is load-bearing rather than pedantic

A prompt in `docs/dossier/founder-prompt-patterns.md` is **documentation of a prompt**. A prompt in
`.claude/commands/ship-check.md` is **the prompt**, and it:

- runs as `/ship-check` with no copy-paste step
- commits with the repo, so it survives a new laptop, reaches a cofounder, and appears in the
  host's "New from your team" surface when someone adds one
- is diffable, so a prompt that stopped working has a history
- is the same shape as the skills BOSS already ships, so a founder who outgrows a command has a
  path to a skill rather than a rewrite

That last point is the interesting one. **`.claude/commands/` is the rung below a skill.** BOSS
ships 48 skills and no way for a founder to author the small thing that precedes one. The founder's
own repeated prompt is exactly the pattern `/boss-learn` is built to promote, and today it has
nowhere to be promoted *from*.

## The proposed move (composition, no new surface)

One paragraph in `prompt-coach`, and one line in `/close`:

> When a pattern has earned it — you have reached for the same prompt three times — offer to
> promote it to `.claude/commands/<name>.md` so it becomes `/<name>`. The dossier keeps the
> *lesson*; the command carries the *prompt*.

The dossier stays. It is the teaching surface, and the pattern names are what the founder is meant
to internalise. The command is where a proven prompt goes to stop being retyped.

## ✅ Resolved 2026-09-08 (v0.245.0)

Shipped as the smallest thing that closes the contradiction, and no more:

- **`prompt-coach` gained step 3b** — when the founder reaches for the same prompt again (*they*
  notice, not the agent), offer to promote it to `.claude/commands/<name>.md`. Offer once, take the
  answer, don't push. The dossier keeps the *lesson*; the command carries the *prompt*.
- **The patterns table's "Document the good ones" row now names both homes** and says which is which.
- **`/close` no longer points at a snippets app** for kickoff prompts; it names `.claude/commands/`.
- 🔴 **The invented "three times" threshold was DROPPED.** The draft below proposed it and flagged it
  as unevidenced in the same breath. The shipped wording hands the judgment to the founder, who has
  the one piece of information the rule was standing in for.
- **What was NOT built:** any authoring path, template, or scaffold for commands. The observation
  that `.claude/commands/` is *the rung below a skill* is real and stays a note — building a ladder
  onto it would be the addition EVID-001 forbids.

## Open questions as originally filed

1. Does this cross a boundary? `.claude/commands/` is Claude-Code-specific, like `.claude/rules/`
   and hooks. `context-discipline` already draws that line (host-neutral principles, Claude-Code
   mechanisms) and BOSS already ships four Claude-only surfaces, so probably not — but the answer
   belongs in `registry/boundary.json`, not in this record.
2. Three-times-is-a-pattern is invented. There is no evidence for the threshold. Either find one or
   let the founder say when.
3. **`prompt-coach` has zero founder-hours on it.** Changing it before anyone has used it is
   speculative by definition. Cheapest honest version: leave the agent alone and add the sentence
   only when a founder has actually accumulated patterns.

## Related

- [[IDEA-080]] — the other half of "where does a durable thing live"; same machine-local question.
- EVID-001 — bloat is the founder's stated fear; this adds a *file the founder writes*, not
  surface BOSS ships, which is the correct side of that line.
