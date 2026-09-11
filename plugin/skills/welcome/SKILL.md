---
name: welcome
description: Start here if you installed BOSS as a plugin. Says what BOSS is in a paragraph, checks whether this folder already carries it, and opens one of two doors — `boss new` for an idea, `boss adopt` for a repo you already have — then hands you to the project's own /welcome. Usage - /boss:welcome
---

# /boss:welcome — the front door

You installed BOSS as a Claude Code plugin. That did two things and only two: it put the `boss`
command on your PATH inside this session, and it gave you this skill. **Everything else BOSS does
lives in a project, not in the plugin** — the mentors, the conscience that catches drift, the 48
skills — and it arrives when you run one of two commands below. This skill is the hand that points
at them.

## Step 1 — where are we?

Check, quietly, before saying anything:

```
ls .boss/manifest.json 2>/dev/null && boss status
```

- **If `.boss/manifest.json` exists**, this folder already carries BOSS. Say so in one line, tell
  them the project's own `/welcome` is the fuller tour and `/boss` is the spin-up, and stop. Do not
  re-scaffold, do not run `boss adopt` on a project that has it.
- **If it does not**, continue.

Also run `boss --version` once. If it fails, the plugin's `bin/` did not reach PATH — say that
plainly, give them `npm install -g oyeboss` as the fallback, and do not pretend the rest works.

## Step 2 — what BOSS is, in the founder's register

One short paragraph, no more. Assume intelligence; never assume knowledge. Roughly:

> BOSS is a just-in-time startup incubator that runs inside Claude Code. It sets a project up at the
> right level of ceremony — Quickstart when you have an idea, MVP when you have a thing, V1 and Scale
> when you have earned them — and grows it from there. It brings a mentor board for the parts code
> can't teach, and a conscience that says one thing when you're drifting and stays quiet when you're
> not. You can pause it any time. Nothing runs while you're away.

If they clearly already know what it is (they say so, or they are asking a specific question),
skip this. A returning founder does not need the paragraph twice.

## Step 3 — two doors

Ask one question, plainly:

> Starting from an idea, or bringing a repo you already have?

- **An idea** → `boss new <name>` in the *parent* folder they want the project under. Ask for the
  name if they did not give one; kebab-case it. Then: `cd <name>` and open Claude Code there.
- **A repo** → `boss adopt` **in that repo's root**. Nothing of theirs is overwritten — BOSS's
  files are added beside them, and `boss remove` takes them back out. If Claude Code is not
  currently open at that root, say so; running adopt from the wrong folder scaffolds the wrong
  folder.

Run the command only when they say go. Show the command before running it. If it errors, show
the error and stop — do not improvise a fix in someone's repo.

## Step 4 — the hand-off, and the one thing that needs a restart

After `boss new` or `boss adopt`:

- The project's skills appear in this session as Claude notices the new `.claude/skills/`
  directory — but **the conscience is a hook in `.claude/settings.json`, and hooks load at session
  start.** Say this in one sentence: *restart Claude Code in the project folder so the conscience
  is live.*
- Then point at exactly two things: `/welcome` (the project's own orientation, which knows about
  cohorts and the conscience's off switch) and `/boss <your idea>` (the spin-up).
- Stop there. Three commands is the ceiling for a first contact.

## What this skill never does

- Never installs BOSS's skills, agents or hooks *from the plugin* into the project. The CLI is the
  only writer; the plugin is a door. (DEC-017 — if you are curious why, it is one page.)
- Never runs `boss new` or `boss adopt` without the founder's explicit go.
- Never says "welcome back", counts days, or narrates what they missed. That is the conscience's
  restraint, and it applies here too.
