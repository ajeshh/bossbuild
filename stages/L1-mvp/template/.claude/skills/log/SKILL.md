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
   owner: product-lead
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
5. If a FEAT closed (all criteria ticked + smoke green), close it out in the FEAT doc — **three
   lines, not one**:
   - `status: shipped`
   - **stamp `shipped_on: {{today}}`** — the board's Shipped column folds anything older than ~30
     days into "shipped earlier", and that window only works on a real date. With no stamp it
     falls back to a count cap, so a ship from March keeps sitting in the recent column.
   - **drop `building_since:`** — it anchors the *time-in-build* aging flag, and a shipped record
     that still carries one is the record saying two things at once.

   > This step used to read *"flip its status to `shipped` — that one field is the whole update"*,
   > while `/spec` (which a founder reads once, months earlier) carried the other two. `/log` is
   > the skill that actually runs at ship time, so the two it didn't mention are the two that
   > didn't get written: BOSS's own repo ended up with `shipped_on:` on 10 records out of 58.
   > **A rule that lives only in the skill nobody re-reads is a rule with no mechanism.**

   **If criteria are still unticked, ask which of two things is true — this is the one moment BOSS
   can see scope growth.** Either the feature genuinely isn't done (leave it in Building, that's the
   normal answer), *or* the untouched criteria arrived **after** the spec did — which means the
   scope grew and this FEAT can no longer finish. Don't guess between them; the founder knows in one
   sentence. When it's the second, say the specific version of:

   > *"Four of these you've done. The other three weren't in the original spec — they arrived while
   > you were building. Ship the four and spin the three to their own id, or keep this one open?"*

   Shipping the done half **closes** something, which is the point: a FEAT whose criteria list grows
   faster than it gets ticked is the feature that is perpetually 90% done, and nothing else on the
   board can tell you it is happening. Route the remainder per `docs/IDS.md` — a new FEAT if it is
   already clear, a new IDEA if shipping the first half changed what you know, or nothing at all if
   you've decided against it. Then stamp `spun_to:` on this record and `spun_from:` on the new one,
   both ways, so whoever reads the closed FEAT can see where the rest went. **Offer, never insist** —
   one under-specced feature is not scope creep, and the founder may simply want to finish it.

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
