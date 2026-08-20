---
name: boss-sync
description: Pull current BOSS practices into this project — bring the installed modes' skills/agents up to the latest version as a reviewed, narrated diff, then bump the project's BOSS pin. The judgment layer over `boss sync`. Usage - /boss-sync
---

# /boss-sync — bring this project current

The distribution half of the learning loop (PRINCIPLES #1): improvements promoted UP into the BOSS
library flow back DOWN into every connected project. This skill brings *this* project's BOSS-managed
files (the skills, agents, and hooks of its installed modes) up to the current version — reviewed, not
blind. Hook *registrations* are merged into `.claude/settings.json` additively, never clobbering your
own permissions or hooks.

## 0. Orient (silent)

- `boss status` — current mode, the project's BOSS pin, and whether newer practices exist.
- `boss changelog --full` — **what changed since this project's pin**, straight from the installed
  package. This is the narration you'll give the user (not just a file list); without it you are
  describing files moving, which is the blind sync this skill exists to prevent.

## 1. Preview

Run `boss sync` (no flags). It lists each BOSS-managed file (skills, agents, hooks) as `new`,
`changed (N lines)`, or up to date, across all installed modes; flags a `~ merge settings/hooks` line if
hook registrations need adding to `.claude/settings.json`; and reconciles any stale mode label (e.g. an
old `L0-sketch` pin → `L0-quickstart`).

## 2. The artifact question — the one a file diff can't answer

`boss sync` now flags any changed or new skill whose **output you already have**:
`↳ you already have the landing page — app/page.tsx`. That line is the whole reason this step exists.

**The unit of an update is the artifact, not the file.** "The landing skill changed by 40 lines"
tells the founder nothing. For each flagged entry, read the CHANGELOG for what actually changed and
answer one question: **would this have altered the thing they already built?**

- **No** → say so in one clause and move on. Most changes are refinements to how the skill *generates*,
  which is irrelevant to a page that already exists. Re-running a generator over work that already
  works is churn, and churn dressed as an update is worse than silence.
- **Yes** → name the *specific* gap in *their* artifact, not the diff. *"The share-card section is new
  — your page has no `og:image`, so it renders as a bare grey URL when anyone pastes it. Four tags."*
  Then offer that edit alone. Never "want me to re-run /landing?" — that discards their work and asks
  them to approve it.

If BOSS **just installed** a skill onto a repo that already has the artifact (the `+ new` + flag case),
that founder adopted an existing project. Say what the skill is *for* and that they already have one,
so it reads as recognition rather than a tool about to overwrite them.

The discipline: `boss craft seed-to-scale`.

## 3. Review the changed files (the judgment)

Before applying, for each **changed** file:
- Read the project's current copy and the incoming version. Summarize what actually changes.
- **Flag conflicts:** if the project edited a BOSS-managed file locally, a sync overwrites it. Call this
  out by name and ask before clobbering. (v1 syncs BOSS-managed skills/agents only — see scope below.)
- Tie changes back to the CHANGELOG entries so the user understands *why*, not just *what*.

## 4. Retired — the part that needs a real conversation

`boss sync` lists anything under **"No longer shipped by BOSS — still in your project"**: things BOSS
installed here and has since retired. Each carries what replaced it and why, from the supersede
ledger. **This is not a file list; it's the one place BOSS changes how the founder works.** Walk it
in this order, per item ([[DEC-003]]):

1. **Say what changed and why** — in their terms, from the ledger's `why` + `migrate`, not
   "deprecated." If BOSS has *no* record (the CLI says so), say that plainly rather than inventing a
   rationale: *"this went and BOSS didn't record why — worth a look before you drop it."*
2. **Say what it means for their project specifically.** Did they use it? Check — grep their `docs/`
   for artifacts it produced, look for it in `devlog`/`RESUME`. *"You ran this twice in June; those
   notes stay where they are"* is worth ten lines of general explanation.
3. **Then ask. It is their call, and a "no" is a complete answer.** Keeping a retired skill is
   legitimate — it still works, it's just no longer maintained. Record a "no" with `/decide` so it
   isn't re-litigated next sync.
4. **If yes — you do the migration, not just the delete.** `boss sync --apply --remove` removes the
   files; that is the *smallest* part. The work is moving them across: point their habits at the
   replacement, update any `docs/` or `CLAUDE.md` references to the old name, and say what their next
   session should look like. **Deleting the file and leaving them to figure out the new way is not a
   migration.**

**Two hard rules.** Never run `--remove` without an explicit yes — the flag exists precisely so the
consent is a separate act. And if the CLI marks an item **`you edited this`**, it is *theirs*; it is
never removed, and you should ask what they changed — that edit is a signal about what BOSS got
wrong. When BOSS says it **can no longer tell** whether they edited it, treat it as possibly-theirs
and tell them to check `git log` on that path first.

## 5. Apply

- `boss sync --apply` — writes the new/changed files and bumps the project's `.boss` pin to current.
  **It removes nothing**, by design.
- `boss sync --apply --remove` — the same, plus removes the retired files they agreed to drop.
  Only after step 4.
- Then show `git diff` and let the user review and commit. The project is the source of truth for its
  own history; BOSS just proposes the update.

## Scope

- Syncs **BOSS-managed skills, agents, and hook scripts** for installed modes.
- **Merges hook registrations into `.claude/settings.json`** additively — adds the `UserPromptSubmit`
  (etc.) entries BOSS ships, matched by command so it's idempotent, and **preserves your permissions and
  any hooks you added.** This is the one user-editable file sync touches, and only the `hooks` block.
- Does **not** auto-merge `CLAUDE.md` or other `settings.json` keys. If the CHANGELOG implies those should
  change, surface it and let the user merge by hand.
- New skills/agents/hooks added to a mode since the pin are pulled in; nothing is removed.

## Rules

- Review before `--apply`. Never overwrite a locally-edited managed file without flagging it first.
- Narrate from the CHANGELOG — the user should learn what's new, not just see files move.
- Don't commit for the user; hand them a clean `git diff` to review.
