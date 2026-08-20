---
name: log
description: Append a dated entry to docs/devlog.md — what landed this session, what's next, what surprised you. Lighter than commit messages, denser than CHANGELOG. The thing future-you reads before starting work. Usage - /log <one-line summary or detailed entry>
---

# /log — the devlog

The devlog is the project's working memory between commits and RESUME. Commits answer *what
changed in the code*; the devlog answers *what happened in the session* — including the decisions
that didn't show up in a diff: a path tried and abandoned, an assumption updated, a person you
talked to, a number you saw.

If you only read one thing when picking the project back up, read the last devlog entry.

## How to run it

1. Open (or create) `docs/devlog.md`. If creating, seed with:

   ```markdown
   ---
   id: DEVLOG
   type: devlog
   owner: pm
   status: active
   ---

   # Devlog — {{PROJECT_NAME}}

   Append-only. Newest at the top. Each entry: date, FEAT (if any), what landed, what's next.
   ```

2. Append a **new entry at the top** (under the header), dated today:

   ```markdown
   ## {{today}}
   - **FEAT:** FEAT-NNN <name>  _(or "no FEAT — exploration/ops")_
   - **Landed:** <one or two lines — what's now real that wasn't before>
   - **Next:** <the very next thing — concrete, one or two lines>
   - **Surprises / decisions:** <only if there was one — what changed in your model of the problem>
   ```

3. If the user gave you a one-liner, that's enough — fill it into **Landed**, leave **Next** empty
   only if they didn't say. Don't fabricate. Blanks are honest.
4. **Tick what landed, and append the feature's own story (v0.172.0+).** If a FEAT is active:
   - **Tick the acceptance criteria** that are now true (`- [ ]` → `- [x]`) in the FEAT doc. They
     ship as checkboxes and nothing used to check them, so a half-built feature and an untouched one
     looked identical. Ticking is what lets `boss board` show *how far*, not just *in flight*.
   - **Append one dated line to the FEAT's `## Build log`** — but only if there's a decision or a
     surprise in it. The devlog entry you just wrote is per *session*; this is the same day's work
     filed under the *feature*, so its arc stays whole across releases. **Don't mirror the devlog
     line into it** — if the only thing you'd write is a restatement, write nothing.
5. If a FEAT closed (all criteria ticked + smoke green), flip its status in the FEAT doc to
   `shipped`. That one field is the whole update — the board reads it directly.
   **If — and only if — that FEAT is one someone else will later rely on the spec for**, offer to set
   a `next_review:` date so `/revalidate` can re-read it against the code later. Offer once, take
   their answer, don't ask again. Most FEATs never need it.

## What belongs in a devlog entry

- The path you tried that didn't work and what you'd do instead.
- The number you saw — a latency, a user count, a sign-up rate.
- A conversation that changed the plan.
- A decision the diff doesn't capture ("we picked X over Y because…").

## What doesn't

- A list of every file you edited. The diff already says that.
- Commit messages copied in verbatim.
- Plans for next week. Those go in `docs/RESUME.md` via `/close`.

## Rules

- Newest at the top, append-only — never edit old entries. (Wrong? Add a correction at today's entry.)
- One entry per session, usually. Multiple short entries are fine if the day shifted gears.
- Short is better than complete. A devlog you'll actually write beats one you won't.
