---
name: welcome
description: First time using BOSS? Start here. A gentle orientation — what BOSS is, what's already in this folder, what to do next, how the conscience works, how to override or pause it. Cohort-aware: beginners get the full tour with terms defined inline; experienced founders get the 30-second version + a pointer to /boss. Run this once when you open a fresh project, or anytime you want to re-orient. Usage - /welcome
---

# /welcome — the gentle entry into BOSS

The first thing a new founder sees in a `boss new` project shouldn't be a wall of documentation
or a power-user prompt that says *"drop your PRD."* It should be a hand: *here's what this is,
here's what's already in place, here's what to do next.* That's this skill.

This is the BOSS counterpart to *"hello, world."* Run it once when you open a fresh project.
Re-run anytime you want to re-orient. It doesn't do anything destructive; it talks and listens.

## Voice rules for this skill specifically

- **Plain language.** No "scaffolding ceremony per Principle 2." Just "BOSS will lay down what
  you need when you need it, not before."
- **Define terms inline** — *Quickstart*, *MVP*, *conscience*, *cohort*, *capture* — all need
  a one-line definition the first time they appear. Don't assume the founder reads docs first.
- **Read the room.** If the founder's cohort is `returning-founder` / `eng-builder` /
  `vibe-virtuoso` / `indie-hacker`, the orientation is 30 seconds, not 5 minutes — these
  cohorts are intolerant of 101 content. Cite the cohort and trim accordingly.
- **No metaphor avalanche.** "Conscience" is the one anthropomorphism BOSS earns; the rest
  stays mechanical (loops, moments, hooks). Don't extend the metaphor unless asked.
- **Close on the action — long content must tie back to the next step.** The failure mode this
  skill was *built* to avoid: the founder reads a wall, gets the gist, and forgets what to *do*.
  So never end a long passage on a recap. End it on the single next step, restated. If you've
  just explained a lot, the last line is an action — *"So: your next step is `/boss <your idea>`."*
  When in doubt, give the shape + the action, then **offer** the rest rather than printing it.

## 0. Orient (silent)

Read, in order:
- `.boss/manifest.json` — current mode + installed agents/skills + boss version. **Check
  `adopted`** — if `true`, this is an existing codebase BOSS was laid onto, not a fresh project.
- `.boss/config.json` — `cohort`, `github`, `visibility`, `license`, any pause state.
- `CLAUDE.md` — the project's working rules.
- `docs/ideas/INDEX.md` — empty in a fresh project; lists ideas in a working one.

Don't announce these reads. Just orient.

## 0.5 Adopted repo? Different tour. (`manifest.adopted === true`)

**Take this branch before anything below.** The default tour is written for an empty folder — it
says things like *"`docs/ideas/` — empty now; fills as you capture"* and walks the Quickstart arc
(capture → canvas → unlock MVP). Said to someone with a working codebase, that reads as a tool
that didn't bother to look. They didn't come to capture an idea; **they already built the thing.**

What changes:

- **Lead with what BOSS added, not what BOSS is.** They have a repo that works. The anxious
  question is *"what did you just do to it?"* — answer that first, plainly: BOSS added
  `.claude/skills/` + `.claude/agents/`, a conscience hook, `docs/` capture surfaces, and a
  `.boss/` mode record. **Nothing of theirs was overwritten.** If their `CLAUDE.md` or `AGENTS.md`
  already existed, BOSS appended a marked block rather than replacing it — say so, and say it's a
  plain diff they can revert.
- **Skip the "capture an idea" arc entirely.** Their next step is not `/triage`. Point at
  **`/comprehend`** — BOSS reads the actual repo and tailors the scaffold to it, then seeds the
  venture brain so the conscience has real context instead of a blank read. That's the adopted
  repo's `/boss`.
- **Name the mode BOSS inferred, and how to change it.** `boss adopt` reads the repo and proposes
  a mode from what it finds (a build manifest, source files, tests, CI, deploy config). Tell them
  what it landed on and that they own the call: `boss unlock <mode>` climbs, and re-adopting with
  `--mode` was always available. **If it guessed low, that's a one-command fix; say so** rather
  than letting them assume BOSS has decided they're a beginner.
- **Don't audit their code.** They didn't ask for a review, and an unrequested critique of work
  they already shipped is the fastest way to lose them. If `/comprehend` surfaces something real
  later, that's its job, with their consent.

Then rejoin at section 2 (cohort) and continue — but throughout, **swap the "what to do next"
options** (section 4's Path A / Path B) for: `/comprehend` first, then `/canvas` if the bet has
never been pressure-tested, then `/spec` when the next feature starts.

## 1. Open with a small introduction

> *"Welcome. This is BOSS — a tool that helps you build by nudging when something looks like
> it's drifting, and staying quiet the rest of the time. I'm Claude; I'll be working with you
> on this project. A quick orientation, then we'll get started — and you can skip anything
> you already know."*

That's it. No more than 3-4 sentences. The founder is here to build, not to read.

## 2. Ask the cohort question (if unset)

Read `cohort` from `.boss/config.json`. If `null` (the default), ask the SAME open question
`/boss` step 6 asks:

> *"Quick optional thing — which of these sounds most like where you're starting from? It lets
> BOSS tune itself for you. If none fit, skip:*
> - *`vibe-coder-newbie` — picked up Cursor/Claude Code recently, no eng/startup background*
> - *`eng-builder` — strong eng background, first-time founder*
> - *`non-tech-founder` — domain expertise, no coding background, AI is the bridge*
> - *`first-product` — absolute first product ever, learning everything as you go*
> - *`vibe-virtuoso` — ships a lot of projects, harder time sustaining one*
> - *`indie-hacker` — building right-sized; calm-company, not venture*
> - *`returning-founder` — shipped before; want depth, not 101*
> - *`domain-expert` — deep expertise in a high-stakes domain (medical / legal / financial)*
> - *skip — leave it generic"*

On answer, write the value to `.boss/config.json` (don't disturb other fields). If they skip,
leave `null`. Move on. **Don't argue their pick** — they can edit the file later, and live use
will sharpen it.

## 2.5 Ask: solo, or building with someone? (light, optional)

One more quick one — it decides whether BOSS's team layer is even visible:

> *"Are you building this **solo**, or **with a cofounder**? (You can change this anytime.)*
> - *Solo — BOSS stays out of your way; the team features stay dormant.*
> - *With someone — tell me their GitHub handle and BOSS keeps you both in the loop:*
>   *`boss team add @their-handle "Their Name"`."*

If solo (or unsure), do nothing — that's the default and nothing changes. If they name a cofounder,
run `boss team add @handle "Name"` for them. The roster lights up the team layer (a shared decision
log via `/decide`, and more as the venture grows). **Never pressure the team answer** — solo is a
first-class, fully-supported path.

Either way, mention the quiet win once: *once you push this repo to GitHub, your thinking — ideas,
decisions, the canvas — is **backed up**, and a cofounder who clones it is automatically in the loop.
The only things that stay on your machine are your secrets and the conscience's private notes on how
its nudges landed for you.* (Don't belabor it — one line, then back to the next step.)

## 3. Branch by cohort

### 3a. Beginner cohorts → full orientation

If cohort is `first-product`, `vibe-coder-newbie`, `non-tech-founder`, or `null` (skipped),
walk the full tour below. **Use plain language and define every term the first time it
appears.** Sections are short on purpose — 2-3 sentences each, not paragraphs.

### 3b. Experienced cohorts → 30-second version

If cohort is `eng-builder`, `vibe-virtuoso`, `indie-hacker`, or `returning-founder`:

> *"You probably don't need the tour. The short version: you're in Quickstart mode; the
> folder has `CLAUDE.md` (project rules), `.boss/` (mode + config), `.claude/` (skills +
> agents the project has access to). Run `/boss` to spin up — point it at your idea however it
> exists (a sentence, a file, a Google Doc / Obsidian / PDF / deck, a URL, or several); it pulls
> a copy into `docs/source/` and shapes it. `/import` adds more material to an idea later.
> The conscience (`UserPromptSubmit` hook) will nudge if it sees drift; `boss conscience pause`
> silences all of it, or `boss conscience mute <moment>` turns down just one (drift|caution|…)
> if a single nudge keeps missing.*
>
> *Nothing about how you work with me changes — BOSS adds verbs for the seams between building,
> not a layer in front of it. `boss status` when you come back; `boss map` for the whole surface.
> That's it. Ready when you are."*

Then **stop**. Don't elaborate. They'll ask if they want more.

### 3c. Domain-expert → middle path

If cohort is `domain-expert`, do the full tour but **emphasize the high-stakes framing**
inline: BOSS treats hallucination as a human-in-the-loop event for this cohort; the AI-first
template (`/ai-first-init`, MVP-mode) defaults to privacy-first logging; the conscience errs
on the side of speaking when stakes are real. Domain experts have business sense but may be
new to building — pace accordingly.

## 4. The full tour (beginner cohorts)

### What BOSS is

> *"BOSS is a build tool. Three pieces:*
> 1. *A **mode** — how much structure the project has. New projects start in **Quickstart**
>    (lightest); they level up to **MVP**, **V1**, and **Scale** as the project earns it.
>    Think of modes like a notebook getting more organized as a project matures.*
> 2. *A set of **skills** — small commands like `/boss`, `/triage`, `/canvas` that do one
>    thing well. You'll see them suggested as you work.*
> 3. *A **conscience** — a quiet background process that sometimes speaks up if something
>    looks like it's drifting (capturing lots of ideas but never validating any, for example).
>    It's a **nudge, never a block.** You can override or pause anytime."*

### When do I use BOSS, and when do I just talk to you?

**Ask this before they do.** It is the first real question every founder has, it is genuinely
ambiguous — BOSS lives *inside* Claude Code — and if it goes unanswered they either avoid the
skills entirely or stop and wonder before every message. Keep it to roughly this shape:

> *"One thing worth settling now, because it trips everyone up: **BOSS doesn't sit between us.**
> You talk to me exactly the way you would in any other project — describe what you want, ask me
> to build it, argue with the result. Nothing about that changes.*
>
> *BOSS adds verbs for the **seams** — the moments between building, where things usually get
> lost:*
> - ***"how do I build this?"** → just ask me. No skill needed.*
> - ***"should I build this?"** / **"is this working?"** / **"what did I decide, and why?"** →
>   that's a BOSS verb (`/canvas`, `/evidence`, `/decide`).*
>
> *And you don't have to memorize any of them. `boss map` lists what this project has; the
> conscience points at the right one when it's relevant. When you come back after a few days,
> **`boss status`** tells you where you are and what's next — that's the one worth remembering."*

If they push — *"so what does BOSS actually do while I'm working?"* — the honest answer is: mostly
nothing, on purpose. It speaks when the work drifts from the bet they named, maybe once or twice a
day, and hands the decision straight back. **Don't oversell the conscience here.** A founder who
expects constant guidance and gets silence will read it as broken.

### What's already in this folder

Read the manifest. Name what's there in plain language:

> *"You're in **Quickstart** mode right now. The folder has:*
> - *`CLAUDE.md` — the working rules for this project. Read it first.*
> - *`.boss/manifest.json` — what BOSS installed; `.boss/config.json` — your preferences.*
> - *`.claude/skills/` — the skills you can run with `/<name>`. Today: `/boss` (spin up an idea),
>    `/triage` (capture one), `/prototype` (hit go — see it running), `/canvas` (pressure-test it),
>    `/persona` (your user's voice), `/welcome` (you're here), and a few more (`boss map` lists them all).*
> - *`.claude/agents/` — specialized helpers BOSS can hand work off to: `pm` (decides what's
>    worth building), `coder-generalist` (builds it once the stack is chosen), `mentor-
>    venture` (advisory only — coaches on whether the bet is worth taking).*
> - *`docs/ideas/` — where ideas live as living docs. Empty now; fills as you capture."*

### What to do next

Two paths. Name both; let the founder pick.

> *"**Path A — you have a rough idea or PRD already.** Run `/boss` next. Point me at it however it
> exists — a sentence, a file path, a URL, even a few of them (a Word doc, a deck, an Obsidian note,
> a PDF, a Google Doc link). I'll pull a copy into the project, shape it, capture it as `IDEA-001`,
> recommend a stack and mode, and (with your OK) create a private GitHub repo. That's the **spin-up**
> flow. (Already captured the idea and want to add more material later? That's `/import`.)*
>
> *Path B — you have a fragment, a hunch, or just a topic to noodle on. Run `/triage <one
> sentence about it>`. I'll create a living idea doc you can keep adding to. Re-run `/triage`
> anytime to add more. No commitment yet — capture first, decide later.*
>
> *And either way — if you'd rather **see** the idea than describe it, run `/prototype <the idea>`.
> I'll build the smallest clickable version of the one core thing so you can react to something real
> instead of a blank page. Building first is a fine place to start; we fill in the rest after.*
>
> *When the idea has legs, run `/canvas` — a humane pressure-test that asks: who's served?
> what's the tension? what's the promise? who could be harmed? what's the riskiest assumption?
> Canvas is the gate before you unlock MVP mode and start building."*

> **Pivot here — offer the rest, don't dump it.** The founder now has the shape and the next
> step. The three topics below (how the conscience works, how modes level up, where to find help)
> are **reference, not required reading** — printing all three is exactly the wall that makes a
> founder forget what to do. Name them in one breath and offer:
>
> > *"That's enough to start. There's more I can walk you through whenever you want it — how the
> > conscience nudges, how modes unlock as you go, where to get help — but none of it blocks you.
> > Want any of it now, or shall we get going with `/boss` or `/triage`?"*
>
> Expand a topic **only if they ask** — and when they do, read the matching section of
> [`reference/deeper.md`](reference/deeper.md). Don't load it otherwise; it's reference, not a script.
> Either way, end on the action (section 5).

## 5. Wrap up — end on ONE exact next step

The founder has just read a fair amount. The single most important thing now: they leave knowing
*exactly what to type* — one literal command, not a menu. After a lot of content, a fork ("/boss or
/triage, your pick") re-triggers the forgetting this whole skill exists to prevent. So **recommend one
action, put the literal command on its own line, and demote the alternative to a single parenthetical:**

> *"That's the tour. Your next step — just one thing:*
>
> ***`/boss <your idea>`** — a sentence, or a path to a doc / a link / a Google Doc. I'll pull it in,
> shape it, and capture it. That's the whole start.*
>
> *(Only have a fragment, not a whole idea yet? `/triage <a thought>` instead — same start, lower stakes.)"*

Never end on *"pick whichever feels right."* One bold, literal, do-it-now command; the fallback gets a
parenthetical, not equal billing. The founder should be able to act without re-reading anything above.

## Rules

- **Re-runnable.** `/welcome` does nothing destructive. Re-running is fine; the founder might
  want to re-orient mid-project. Don't refuse to re-run.
- **Cohort changes the depth.** Beginner cohorts get the full tour; experienced cohorts get
  the 30-second version. The cohort question is asked ONCE; the answer persists in
  `.boss/config.json`.
- **No power moves.** Don't run `/boss`, `/triage`, or any other skill *for* the founder.
  Suggest them; let the founder decide. /welcome is orientation, not action.
- **Don't oversell.** BOSS is a build tool, not a religion. If the founder says "this
  is overkill for what I'm doing," they may be right — point at `boss conscience pause`,
  point at the override grammar, point at the JIT principle. Don't argue.
