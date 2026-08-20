---
name: persona
description: Build your app's target-user persona from your idea, grow it from what you know + online research + any real user research you drop in, and consult it as an agent voice — both to guide product decisions ("would my user want this?") and to QA your builds ("how would she react to this screen?"). A pre-filter that sharpens the questions you take to real users; never a replacement for talking to them. Usage - /persona [derive | enrich <slug> | consult <slug> "question"]
---

# /persona — your user's voice, as a thinking tool

The first thing every app has is a *user*. If you're building a chore tracker for moms, the first
persona is **a mom managing a household** — and most product decisions get easier when you can ask her.
`/persona` builds that voice from your idea, grows it as you learn more, and lets you consult it: to
**guide** what you build, and to **QA** what you built.

> **What it is:** a sharpening tool — a fast, honest *pre-filter* that helps you write better questions
> and catch obvious misses. **What it isn't:** a real user. A synthetic persona will tend to like your
> idea more than a real person would, and it can't know what it wasn't told. Use it to get *ready* for
> real conversations (Rob Fitzpatrick's *Mom Test*), never to skip them. BOSS will say this once, then
> get out of the way.

## Modes

### `derive` (default when no persona exists yet)
Read the captured idea (`docs/ideas/*.md`) + its canvas if one exists.

**If those are thin or empty — which is the normal case in a repo BOSS adopted rather than
scaffolded — read `.boss/brain/read.md` too.** `/comprehend` writes its read of an existing
codebase there: what the app does, who it appears to be for, what's already built. Deriving a
persona from a blank page while BOSS holds a whole-repo read it never handed over is the version
of this that wastes the founder's time.

⚠️ **Grade it honestly: a repo read is `synthetic`.** It is inferred from *code*, not from a
person — arguably further from real evidence than your own knowledge of your user, because a
codebase tells you what someone decided to build, never whether anyone wanted it. Mark it in the
body as *derived from your repo, not from a person*, and let it start the ledger, never lift it.

Propose the **one primary target user** (start with one; secondary users come later). Write
`docs/personas/<slug>.md`:

```
who         — one line ("a working mom, 30s-40s, running a household of 4")
context     — when/where/why they'd reach for this (the situation, not demographics)
jobs        — what they're actually trying to get done (jobs-to-be-done, not features)
pains       — what's hard / annoying / failing about how they do it today
values      — what they care about, what would make them trust or abandon a tool
what we DON'T know yet — the open questions a real conversation would answer (be honest + specific)
---
Evidence ledger:  synthetic <N%> · real <N%>   (starts 100% synthetic)
Notable refactors: (dated bullets when evidence reshapes the persona)
```

Name what's a guess. The `what we don't know` block is the most valuable part — it's the interview
guide for when you talk to a real one.

### `enrich <slug>` — grow it from evidence
Offer the four sources; fold in what they choose; **shift the ledger** (real grows, synthetic shrinks):
- **Q&A with you** — ask what *you* already know about this user (you chose this problem for a reason —
  you often know a lot). Your knowledge is real evidence (n≥1).
- **Online research** — have your host search the web for real-world data about this group, and
  ground the archetype in what comes back. Better than a guess; still averaged, so mark it
  synthetic-leaning.
- **Drop in real research** — point at interviews / surveys / notes (a file, folder, or URL); ingest
  via `/import` and fold the real signal in. **This is the strongest source** — it shrinks the
  synthetic share fastest. (A UX researcher dropping a study here is the ideal case.)
- **Passive** — read the idea / canvas / build for who-the-user-is clues already on record (no new
  tracking; the work already names them).

Each enrich pass: update the persona body, add a dated `Notable refactor` bullet, re-weight the ledger.

### `consult <slug> "question"` — ask the voice (both directions)
Answer **in the persona's voice**, and run in whichever direction fits:
- **Guidance** (before/during build): *"would she want X? how would she react to this flow?"*
- **QA** (after build): react to a screen / feature you built — structured (first feeling · what she'd
  do · where she'd bounce · what she'd want different), so you can compare versions over time.

Every consult: **balance interest with concerns** (don't just cheerlead), **name what the persona
can't know** (the blind spots from the ledger), and **close with the caveat** — *"that's a synthetic
read at <real%> real evidence; go ask <N> real ones before you bet on it."*

## The discipline (why this is honest and not snake oil)

- **Pre-filter, never validation.** A persona consult is a sharpened guess. The conscience uses it to
  push you *toward* real contact (`/canvas` "who's served", `/pretotype` demand test, the Mom Test),
  never as a substitute. If you're about to build for real on persona signal alone, that's the moment
  BOSS asks: *have you talked to one?*
- **Synthetic shrinks as real grows.** The ledger is visible on purpose — you always see how much of
  "your user" is real evidence vs. BOSS's average. The persona is the same artifact across its life;
  today's version is just early in it.
- **Name the blind spots.** LLMs reflect internet-averages and can't *do* behavior — only describe it.
  Higher-stakes or niche users (regulated, marginalized, very specific) are exactly where the synthetic
  read misses most; say so loudly for those.

## Cohort-aware
- `first-product` / `non-tech-founder` — plain language; the deliverable is "a clear picture of who
  you're building for + the questions to go ask them," not a research artifact.
- `eng-builder` / `returning-founder` — terse; lead with the `what we don't know` gaps and the
  cheerleading caveat; they know personas can lie.
- `domain-expert` — flag hard that domain stakes (clinical/legal/financial) aren't in training data
  with enough specificity; their own expertise outranks the synthetic read.

## Rules
- **One persona first.** Start with the primary user; add segments only when the idea clearly serves
  distinct users.
- **Real beats synthetic, always.** Dropped-in research and your own knowledge outweigh online
  averages, which outweigh pure derivation. Weight the ledger accordingly.
- **Caveat every consult.** The go-talk-to-a-real-one line is non-negotiable — a persona that forgets
  it's synthetic is the pseudo-app trap with a friendly face.
- **It's both.** The same persona guides decisions *and* QAs builds — point it forward or back.
