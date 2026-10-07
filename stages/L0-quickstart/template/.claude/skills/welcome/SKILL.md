---
name: welcome
description: First time using BOSS? Start here. What BOSS is, what's already in this folder, what to do next, how the conscience works and how to pause it. Beginners get the full tour with terms defined; experienced founders get the 30-second version and a pointer to /boss. Usage - /welcome
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
- `docs/ideas/` — empty in a fresh project; one file per idea in a working one.

Don't announce these reads. Just orient.

## 0.5 Adopted repo? Different tour. (`manifest.adopted === true`)

**Take this branch before anything below.** If `adopted` is `true`, open
[`reference/adopted.md`](reference/adopted.md) and follow it.

## 0.7 Say what BOSS leaves behind (once, plainly, unprompted)

BOSS writes a **marked block** into `CLAUDE.md` / `AGENTS.md`, wrapped in an HTML comment that starts
`<!-- boss:`. That marker is how `boss remove` knows exactly what to take back out — and it is also,
unavoidably, **a fingerprint that can be found by searching public repositories.**

Say so. Once, in a sentence, without ceremony:

> *"BOSS leaves a marked comment in your `CLAUDE.md` so it can cleanly remove itself later. It's also
> findable if someone searches public repos — that's how I'd know anyone's using this at all. `boss
> remove` takes it out with everything else."*

**Why this is stated rather than left implicit:** counting people who never agreed to be counted is
surveillance, however public the data. The marker is load-bearing (removal depends on it) so it stays
— but a founder learns about it from BOSS, not from discovering it.

**Do not turn this into a pitch.** No "and if you'd like to support us…". `boss credit` exists for a
founder who *asks* how to credit BOSS; it is never offered here.

## 1. Open with a small introduction

> *"Welcome. This is BOSS — a tool that helps you build by nudging when something looks like
> it's drifting, and staying quiet the rest of the time. I'm Claude; I'll be working with you
> on this project. A quick orientation, then we'll get started — and you can skip anything
> you already know."*

That's it. No more than 3-4 sentences. The founder is here to build, not to read.

## 2. Ask the cohort question (if unset)

**Steps 2 and 2.5 go out as one message, two numbered items** (*"1. which of these sounds like you
(optional)… 2. solo, or with someone?"*). They answer both in one reply. Skip an item whose answer is
already on file.

Read `cohort` from `.boss/config.json`. If `null` (the default — never asked), ask the SAME open
question `/boss` step 6 asks. If it is `skipped`, they were asked and declined: don't ask again.

> *"Quick optional thing — which of these sounds most like where you're starting from? It changes
> how much I explain and how BOSS frames a nudge, nothing else. If none fit, skip:*
> - *this is the first thing you've built* (`first-product`)
> - *you've shipped a couple of small things with AI; no engineering or startup background* (`vibe-coder-newbie`)
> - *you know a business or a trade, and the AI is how you'll build* (`non-tech-founder`)
> - *you've built real systems; this is your first company* (`eng-builder`)
> - *you ship a lot; finishing one is the hard part* (`vibe-virtuoso`)
> - *right-sized on purpose — a calm company, not a venture* (`indie-hacker`)
> - *you've shipped real products before; depth, not 101* (`returning-founder`)
> - *being wrong has real costs — health, legal, money, safety* (`domain-expert`)
> - *skip — leave it generic"*

The phrase is the question; the slug in parentheses is what gets stored, and it is the same list
the site's *where you're starting from* uses — one vocabulary, not two. On answer, write the slug
to `.boss/config.json` (don't disturb other fields). **If they skip, write `"cohort": "skipped"`** —
every reader treats it as unset, and it is how `/boss` knows not to ask again. Move on. **Don't
argue their pick** — they can edit the file later, and live use will sharpen it.

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
walk the full tour — open [`reference/tour.md`](reference/tour.md) and follow it. **Use plain language and define every term the first time it
appears.** Sections are short on purpose — 2-3 sentences each, not paragraphs.

### 3b. Experienced cohorts → 30-second version

If cohort is `eng-builder`, `vibe-virtuoso`, `indie-hacker`, or `returning-founder`:

> *"You probably don't need the tour. The short version: you're in Quickstart mode; the
> folder has `CLAUDE.md` (project rules), `.boss/` (mode + config), `.claude/` (skills +
> agents the project has access to). Run `/boss` to spin up — point it at your idea however it
> exists (a sentence, a file, a Google Doc / Obsidian / PDF / deck, a URL, or several); it pulls
> a copy into `docs/source/` and shapes it. `/import` adds more material to an idea later.
> The conscience (`UserPromptSubmit` hook) will nudge if it sees drift; `boss conscience pause`
> silences all of it, or you can turn down just the kind of nudge that keeps missing
> (`boss conscience` lists them by name).*
>
> *Nothing about how you work with me changes — BOSS adds verbs for the seams between building,
> not a layer in front of it. `boss status` when you come back; `boss map` for the whole surface.
> That's it. Ready when you are."*

Then **stop**. Don't elaborate. They'll ask if they want more.

### 3c. Domain-expert → middle path

If cohort is `domain-expert`, do the full tour ([`reference/tour.md`](reference/tour.md)) but **emphasize the high-stakes framing**
inline: BOSS treats hallucination as a human-in-the-loop event for this cohort; the AI cost
logger (`/ai-cost`, MVP-mode) defaults to privacy-first logging; the conscience errs
on the side of speaking when stakes are real. Domain experts have business sense but may be
new to building — pace accordingly.

## 4. The full tour (beginner cohorts)

Open [`reference/tour.md`](reference/tour.md) and follow it.

## 5. Wrap up — end on ONE exact next step

The founder has just read a fair amount. The single most important thing now: they leave knowing
*exactly what to type* — one literal command, not a menu. After a lot of content, a fork ("/boss or
/idea, your pick") re-triggers the forgetting this whole skill exists to prevent. So **recommend one
action, put the literal command on its own line, and demote the alternative to a single parenthetical:**

> *"That's the tour. Your next step — just one thing:*
>
> ***`/boss <your idea>`** — a sentence, or a path to a doc / a link / a Google Doc. I'll pull it in,
> shape it, and capture it. That's the whole start.*
>
> *(Only have a fragment, not a whole idea yet? `/idea <a thought>` instead — same start, lower stakes.)"*

Never end on *"pick whichever feels right."* One bold, literal, do-it-now command; the fallback gets a
parenthetical, not equal billing. The founder should be able to act without re-reading anything above.

## Rules

- **Re-runnable.** `/welcome` does nothing destructive. Re-running is fine; the founder might
  want to re-orient mid-project. Don't refuse to re-run.
- **Cohort changes the depth.** Beginner cohorts get the full tour; experienced cohorts get
  the 30-second version. The cohort question is asked ONCE; the answer persists in
  `.boss/config.json`.
- **No power moves.** Don't run `/boss`, `/idea`, or any other skill *for* the founder.
  Suggest them; let the founder decide. /welcome is orientation, not action.
- **Don't oversell.** BOSS is a build tool, not a religion. If the founder says "this
  is overkill for what I'm doing," they may be right — point at `boss conscience pause`,
  point at the override grammar, point at the JIT principle. Don't argue.
