---
name: practice
description: Capture a craft learning — a better way to build with AI you found — as a shared, attributed PRAC-NNN record your cofounder gets too. The team's commons for staying current on the fast-moving agentic-AI craft, so you both build on each other's discoveries instead of re-learning them. Staleness-aware: AI moves fast, so a practice can carry a review date. Usage - /practice <what you learned>
---

# /practice — the shared craft commons

The craft of building with AI changes monthly — new models, new agent patterns, a cheaper way to do the
thing you did the expensive way last week. Each founder picks up discoveries on their own; without a
shared place, they stay trapped in one person's head, and a cofounder re-learns the same lesson the hard
way (or keeps doing it the outdated, expensive way).

A **practice** is one such learning, written down once and **shared** with the whole team: *"use streaming
for the long generations — it cut perceived latency in half"*, *"the cheap model is plenty for the
classification step, ~10× cheaper than the deliberate one"*, *"this prompt structure stopped the JSON drift."* The point
isn't ceremony — it's that **you both get current together and can focus on building**, not on worrying
whether you're behind or overspending.

## When to reach for it

- You found a genuinely better/cheaper/newer way to do something with AI and your cofounder would benefit.
- You hit a sharp edge (a model quirk, a cost trap, an agent failure mode) and worked out how to handle it.
- A `/vet` verdict or outside best-practice proved itself in *your* build — capture what actually held.

Skip it for one-off trivia or anything that belongs in the code as a comment. A practice is a *transferable*
lesson, not a changelog line.

## How to run it

1. **Resolve who learned it** (the credit — and so a teammate knows who to ask):

   ```bash
   gh api user --jq '.login' 2>/dev/null || git config user.name
   ```

   Use it as `@<login>`; leave `@you` if neither resolves. Never fabricate.

2. **Pick the next number.** Highest `PRAC-NNN` in `docs/practices/` + 1 (first is `PRAC-001`). Create the
   directory if needed.

3. **Write `docs/practices/PRAC-NNN-<slug>.md`:**

   ```markdown
   ---
   id: PRAC-NNN
   type: practice
   owner: "@<github-login of whoever learned it>"
   status: active           # active | stale | retired
   created: {{today}}
   applies_to: <what this is about — e.g. "Claude Code" / "model: opus-4.8" / "prompting" / "cost">
   review_by: <YYYY-MM-DD>   # optional — when to re-check it's still the best way (see staleness below)
   ---

   # PRAC-NNN — <the learning, in one line>

   ## What we learned
   The practice itself, concretely enough that your cofounder could apply it tomorrow.

   ## Why it works
   The reasoning — so it transfers, and so a teammate can tell when it stops applying.

   ## How to apply
   The shortest path to using it here. A snippet, a command, a setting — whatever makes it real.
   ```

4. **Fill from what the founder gave you.** Don't pad it. A two-line practice that's true beats a page that
   guesses. Blanks are honest.

## Staleness — the part that keeps you current (not just documented)

The AI craft moves fast, so a practice can quietly **go out of date** — a model that was cheapest last
month isn't, a workaround a new release made unnecessary. Two honest moves:

- **Set `review_by:`** for anything tied to a specific model, price, or tool version — a date to re-check
  *"is this still the best way?"* (Don't set it for timeless practices.) When it passes, `/revalidate` the
  practice the same way you would a paused idea: still true? still the best way? anything changed? → keep /
  update / retire (flip `status:` to `retired`, or supersede with a new `PRAC`).
- This is the team's quiet defense against **being outdated or overspending** — BOSS surfaces the question;
  you don't have to carry the anxiety of tracking every model release yourself.

## Shared by construction

`docs/practices/` **commits with the repo** (it's not gitignored), so the moment you push, every practice
is backed up and your cofounder has it. Attribution (`owner:`) is recognition + a pointer to who to ask —
not a scoreboard. This is the hive-mind half of the founder layer: you each make the other richer.

## What this is not

- Not a style guide or the conventions doc — those live in `AGENTS.md`. A practice is a *discovered lesson*,
  often AI-specific and time-sensitive.
- Not a place to log every change. If it isn't transferable craft, it doesn't earn a `PRAC`.
- Not a ranking. The commons measures *what the team knows*, never *who contributed more*.
