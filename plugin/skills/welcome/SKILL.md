---
name: welcome
description: Start here if you installed BOSS as a plugin. Says what BOSS is in a paragraph, checks whether this folder already carries it, asks what you're building and says it back — then, on your go, opens one of two doors (`boss new` for an idea, `boss adopt` for a repo you already have) and hands you to the project's own /welcome. Usage - /boss:welcome
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

## Step 3 — hear it first (step 0 of the ladder)

BOSS sets a project up at the right level of ceremony and grows it only as earned. This is the rung
*below* Quickstart: **nothing is set up yet** — no folder, no files — and the only thing that happens
is the founder says what they're building and hears it said back. Ask one question, plainly:

> What are you building?

- **If the answer is a repo they already have** (*"I've got a codebase"*, a path, *"adopt"*) →
  skip the reflection and go to the **repo** door below.
- **If the answer is an idea** — a sentence, a paragraph, a rough shape — **say it back before
  anything else.** Follow the heading `## 2. Shape it (product-lead lens)` in
  `${CLAUDE_PLUGIN_ROOT}/stages/L0-quickstart/template/.claude/skills/boss/SKILL.md` — that section
  and nothing after it. It is four lines: what it is, who it's for, the smallest version that proves
  it, and — if one word could be read two ways — which way you read it. **In their words; don't
  smooth it.** A founder corrects a wrong reflection far more readily than they answer an open
  question. Do not run steps 1, 3 or 3.5 of that file: they snapshot sources, allocate ids and ask
  about motivation — all of which presume a project, and none of which belong at the door.

  Then the offer, one line, and wait:

  > Want me to set this up here as a project?

  - **Yes** → the **idea** door below. Derive a kebab-case name from what they said, show it, take
    their edit.
  - **No, or more to say** → keep talking about the idea. Offer once more after the next thing they
    say that is about it. Never block on setup; a good reflection nobody saved beats an empty
    scaffold somebody did.

**Nothing here writes a file.** The reflection lives in the chat. When they say go, the project's
own `/boss` will ask for the idea again after the restart — that retype is one sentence, and whether
it lands or stalls is the first real signal from this door. Do not try to carry it across.

### The two doors

- **An idea** → `boss new <name>` in the *parent* folder they want the project under. Then: `cd <name>`
  and open Claude Code there.
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
  cohorts and the conscience's off switch) and `/boss <your idea>` (the spin-up — *"tell it the idea
  again in a sentence; it will ask you two things I didn't."*).
- Stop there. Three commands is the ceiling for a first contact.

## What this skill never does

- Never installs BOSS's skills, agents or hooks *from the plugin* into the project. The CLI is the
  only writer; the plugin is a door. (DEC-017 — if you are curious why, it is one page.)
- Never runs `boss new` or `boss adopt` without the founder's explicit go.
- Never writes the idea anywhere. Step 0 has no files; the reflection is the value, and the project's
  `/boss` is where it gets remembered. If that retype ever turns out to be where founders stall,
  `boss new --idea` is specced in IDEA-099 — *place and validate a model-authored doc, never
  compose one* — and it gets built then, not before.
- Never asks why they're building it or what success looks like. Those are `/boss` step 3.5's
  questions and they live in the project, where the fields they write live.
- Never says "welcome back", counts days, or narrates what they missed. That is the conscience's
  restraint, and it applies here too.
