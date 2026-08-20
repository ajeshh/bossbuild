---
name: close
description: Session-end ritual — update docs/RESUME.md (state + next tasks + open decisions), append a /log entry, and let the conscience update its read on the venture (.boss/brain/). Run this before stepping away so the next session starts with full context. Usage - /close
---

# /close — leave the project ready for next session

A session that ends without `/close` costs the next session 20 minutes of *what was I doing*. `/close`
is the small ritual that prevents that: it writes the current state to `docs/RESUME.md`, captures
what landed in the devlog (via `/log`), and leaves the working tree in a state your future self can
walk back into cold.

It's the counterpart to *read `docs/RESUME.md` first thing*.

## Before the housekeeping: mark what was crossed

`/close` is also the natural moment to *register a threshold* — because the relentless build never makes
room for it, and a builder who only ever measures what's left slowly forgets that anything was achieved
(see the `celebration-of-done` practice). If this session genuinely crossed one — a FEAT closed, the
first live URL, a mode graduation, the riskiest assumption finally tested — pause and mark it **before**
the forward-looking housekeeping below. The order matters: look back at what you crossed before you look
ahead to what's next.

- **Name what's real, specifically** — not "great session," but *what* got done and *what it now unlocks*.
- **Re-anchor on the why and the who** — reconnect the thing you crossed to the bet (why it mattered) and
  the person you built it for. The build pulls you into the *how*; this pulls you back to the *why*.
- **Let it turn into curiosity** — *"does this land for them now?"* is the honest next feeling, and it's
  the bridge back to the real user. A well-marked threshold makes the founder *want* to go find out — the
  validation instinct, arriving through satisfaction instead of obligation.
- **Proportional, no performed warmth, no streak.** Real thresholds only; most sessions cross none, and
  silence is correct. This is the conscience's restraint with the polarity flipped — never "🎉 great job!"
  (the exact flattery the brain-read step below forbids). Emotional acknowledgement is *making space for
  the founder to feel it*, not BOSS emoting at them.

## How to run it

1. **Append a devlog entry** by running the `/log` flow (FEAT, landed, next, surprises) — which
   also ticks the active FEAT's acceptance criteria and appends to its `## Build log` when there's a
   decision or surprise worth keeping. If `/log` already ran this session, skip — don't duplicate.

2. **Update `docs/RESUME.md`** (create if missing — template below). Rewrite, don't append:
   - **State (current):** the one paragraph someone re-entering the project needs. What's true *now*.
   - **Next tasks (in order):** the 1–3 concrete things to pick up. Concrete = "wire `/foo` to call
     bar()", not "improve the feature."
   - **Open decisions:** things waiting on a call (yours or someone else's). Each with a tentative
     direction so you don't re-litigate from scratch.
   - **Prompt for the next session:** keep it **evergreen** — a pointer + procedure, never a
     status report. *State* and *Next tasks* already carry the current-state surface; restating
     them here just doubles the drift surface. Save kickoff prompts somewhere stable (a shell
     alias, a snippets app, the `Prompt for the next session` block) so they don't bit-rot
     against the actual RESUME. If you find yourself writing *"we're at v0.X"* or *"X just
     shipped"* in this block, delete it — that's what *State* is for.

3. **Update the venture brain** (`.boss/brain/read.md`) — *the conscience's read on this venture,
   not the task state*. This is the one thing in `/close` that isn't a status report: it's the
   conscience forming a point of view it will *remember next session*. That continuity is what makes
   the conscience feel like its own mind instead of a hook that forgets you. See the discipline below
   — it is strict on purpose. Skip this step entirely if the session didn't reveal anything about the
   *shape of the venture or how the founder is working* (a pure mechanical session has nothing to read).

   - **Append, don't rewrite.** Add a dated `## YYYY-MM-DD` section to `.boss/brain/read.md` (create
     the file if absent). The brain is append-mostly — history is the point.
   - **The brain evolves; it doesn't just accrete (staleness is a write-side job).** Before you append,
     re-read the standing summary at the top: has the work *overtaken* any claim in it? A riskiest
     assumption that shifted, a pivot that happened, a "they keep doing X" that's no longer true — a
     once-accurate read becomes *confidently wrong* the moment the venture moves past it. **Revise or
     retire stale lines** in the standing summary as you write the new dated block. The most dangerous
     brain isn't the empty one — it's the one citing yesterday's truth with today's confidence.
   - **Living memory, not infinite memory — compress when the read gets long.** If `boss brain` flags
     that the read spans many sessions (the recency-window nudge), fold the *oldest* dated reads' lasting
     conclusions into the standing summary at the **top** of `read.md` (the preamble, above the first
     dated header), then drop those verbatim old blocks. Keep the recent ~8 dated reads as-is. Compression
     is the model's job (you can summarize meaning); the founder can also evict directly with
     `boss brain forget --before <date>`. The standing summary is what survives; the dated blocks are the
     working history that ages out.
   - **First-person, from the conscience.** "I'm noticing…", "Three sessions in, the pattern is…".
     It's a read, not a log.
   - **Interpretation across time, never facts or claims.** Facts live in the canvas/RESUME/devlog. The
     brain holds *only* what those can't: "they keep rebuilding onboarding instead of talking to a
     user," "conviction on the wedge is hardening, not drifting," "last session they pushed back on the
     drift nudge — and they were right." If a sentence could be a canvas edit or a RESUME task, it
     belongs there, not here.
   - **The must-nots (this is the trust line):** no flattery ("great work!"), no diagnosing the
     founder, no certainty the sessions don't support. If you're not sure, say less. A wrong, confident
     read about a *person* is the one mistake that makes BOSS feel creepy instead of alive.
   - **Ground every claim.** Name what in the actual work supports the read (a FEAT, a devlog pattern,
     a repeated capture). No claim the artifacts can't back. This groundedness is exactly what makes the
     read land as "how did it know that" rather than a fortune cookie.
   - **Honest when thin.** One session in, you don't have a read yet — write that, or write nothing.
     Don't manufacture depth.
   - **Confirmable.** Show the founder the section you're about to write and let them correct it before
     it lands. It's an opinion *about them* — they get the edit. (This stays confirmable until the
     brain-write eval proves the reads are trustworthy; then it can graduate to silent-but-inspectable.)
   - **Stamp the index** after the prose lands: `boss brain record --headline "<one-line of the read>"`
     so `boss brain` / `boss brain --diff` stay truthful without parsing the prose.
   - The founder owns it: it's plain markdown they can read with `boss brain` and correct by editing
     `.boss/brain/read.md` directly.

3b. **Update the relationship log** (`.boss/brain/relationship.md`) — *only if the conscience actually
   said something this session.* This is the loop the frequency ledger only *counts*: did the nudge
   **land**? Append a dated `## YYYY-MM-DD` entry recording, honestly and briefly:
   - **What the conscience flagged** (which moment, in one line — "drift: named retention as the bet but
     built onboarding").
   - **What the founder did with it** — and tag the outcome plainly: *landed* (acted on it), *ignored*
     (moved past without engaging), *overrode* (declined with a stated reason — note the reason; a good
     override is data, not a failure), or *pushed back and was right* (the nudge was wrong — the most
     valuable entry; it's how the conscience learns to fire better).
   - **The must-nots carry over:** no scoring the founder, no "you should have listened." This is the
     conscience being honest about *its own* hit rate, not grading the person.
   - If the conscience stayed silent all session (nothing fired), write nothing here — an empty
     relationship log is the honest state, not a gap to fill.
   - **Stamp it:** `boss brain record --kind relationship --headline "<flagged X → they did Y>"`. The
     conscience reads this next session (bounded) to *calibrate* — it won't re-nag a point you've
     already answered, and it can build on a nudge that landed. View it: `boss brain --relationship`.

3c. **The learning pulse** — ask **one** question, once:

   > *"What did this stretch teach you that a conversation — not a commit — taught you?"*

   The thesis cares about one ratio — build vs. learn — and nothing else in BOSS makes it visible. A
   cadence *hook* would be the over-fire trap the conscience has correctly refused (Red-Light,
   distribution, presence); the honest form is this one question on a surface the founder already runs.

   - **If they have an answer** — offer to capture it: an `EVID-NNN` (via `/evidence`) if it's a real
     signal about a user or the market, or a one-line brain note otherwise. Ten seconds; their call.
   - **If the answer is "nothing"** — that's an acceptable answer, recorded **plainly** in the
     standing-summary revision above, without comment: *"built all week, learned from no one"* is a
     fact, not a judgment. The conscience's existing drift moment already reads the brain — give it one
     more honest fact to see. No new hook, no counter, no threshold.
   - **Ask it once per close, never re-ask in-session, never block.** The pulse observes; it never grades.

4. **Check the working tree.** If there are uncommitted changes the user wants to keep but isn't
   committing now, mention them in RESUME's *State* so next-you isn't surprised. Don't auto-commit.

5. **Report what you wrote.** One line: "RESUME updated · devlog entry added · brain read appended ·
   N uncommitted change(s) noted." Then stop — don't summarize the session further; the artifacts are
   the summary.

## The RESUME template (used when none exists yet)

```markdown
---
id: RESUME
type: resume
owner: pm
status: active
updated: {{today}}
---

# RESUME — {{PROJECT_NAME}}

**Read this first each session.** State + next tasks + open decisions.

## What this project is
_One paragraph. The current articulation — sharpen as the project sharpens._

## State (current)
- _What's real right now: shipped FEATs, the smoke command, the stack._
- _Anything uncommitted worth knowing about._

## Next tasks (in order)
1. _Concrete. Single-session-shaped if possible._
2. …

## Open decisions
- _Question — tentative lean — what would close it._

## Prompt for the next session
> _**Keep this evergreen** — a pointer + procedure, never a status report._
>
> Continue {{PROJECT_NAME}}. Read `docs/RESUME.md` (this file — *State* + *Next tasks* +
> *Open decisions*), `CLAUDE.md`, then `VERSION` + `CHANGELOG`. Cross-check `git log -3`
> against what RESUME claims — if they disagree, RESUME is stale; re-establish ground truth
> first. Then pick up *Next tasks* top down.

## Working reminders
- _Commands, env vars, things easy to forget._
```

## Rules

- RESUME is rewritten, devlog is appended. The devlog is history; RESUME is the current pointer.
- Keep RESUME short — under a page. If it grows past that, you're putting reference material in the
  wrong file; move it to its own doc and link.
- Don't run `/close` if the session was a one-line conversation; reserve it for sessions that moved the project.
- If there's *real* unfinished work (a half-applied refactor), call it out in **State** in plain language.
  Surprises in the next session are the failure mode this skill exists to prevent.
