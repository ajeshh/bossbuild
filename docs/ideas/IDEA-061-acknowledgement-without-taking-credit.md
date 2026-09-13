---
id: IDEA-061
type: idea
owner: product-lead
status: shipped
proof: src/credit.js
created: 2026-08-20
source: Ajesh, 2026-08-20 — "im wondering if we should add in somewhere how folks should give credit
  to boss, or add a 'Made with Boss'… something unique enough that we can suss out via a deep search
  on github or landing pages for an easter egg?"
---

# IDEA-059 — Acknowledgement, without taking credit

## The tension, stated first

`BRAND.md`'s central story is **"it never puts its name on your work — you ship it, your name's on
it."** That sentence is doing real work: it is what makes a tool called BOSS not read as ego. A
"Made with BOSS" line written into a founder's repo by default would contradict the single promise
the brand rests on — and it would do it in the founder's own files, which is the worst possible place.

So the request could not be built as asked. It could be built once it was **split**.

## Two asks wearing one coat

| | What it really wants | Answer |
|---|---|---|
| *"suss out via a deep search"* | **Measurement** — is anyone actually using this? | Already possible. Disclose it. |
| *"how folks should give credit"* | **Attribution** — a way to say so | Build it, opt-in, never automatic. |

**The counting capability already existed and nobody had said so.** `src/scaffold.js` writes a
`<!-- boss:… -->` marked block into `CLAUDE.md`/`AGENTS.md`, and `boss remove` depends on it. That
string is distinctive, and public code search finds it today — no new code, no imposition. What was
missing was honesty about it.

> **Counting people who never agreed to be counted is surveillance, however public the data.**
> The marker is load-bearing, so it stays. `/welcome` now names it in one sentence — what it is, why
> it's there, that it's findable, and that `boss remove` takes it out. A founder hears it from BOSS
> rather than discovering it.

## The distinction that made it buildable

**The promise is about *taking* credit, not about refusing to let anyone *give* it.** Offering a
founder a way to say so costs the brand nothing; adding it for them costs the brand everything.

So `boss credit`:
- **previews by default** (same posture as `boss remove` — show, then hand the decision back),
- `--apply` adds **one line to the README**, `--remove` restores it exactly,
- is **never automatic, never offered unprompted, never in the founder's product UI**,
- and `/welcome` is explicitly *forbidden from pitching it*. It exists for someone who asks.

The line is a wink rather than a badge — `<!-- Builds, Or Stays Silent. ✦ -->`, one of BRAND.md's
alternate full forms, above the visible credit. The phrase is distinctive enough that a code search
for it has a near-zero false-positive rate, which is the only reason any of this is findable.

## Worth watching

- **The pitch pressure will come back.** The moment BOSS wants users, `/welcome` mentioning `boss
  credit` "just once" will look harmless. It isn't — that's the version that breaks the promise, and
  the skill says so in writing so the next person has to argue with it deliberately.
- **A landing-page badge was NOT built.** `/landing` generates a founder's page; putting BOSS's name
  in it would be the same violation one surface further out. If it's ever wanted, it must be the
  founder pasting it, never `/landing` emitting it.
- **The measurement is still crude** — a code search over public repos, missing every private one.
  That is fine and honest for the question it answers ("is anyone out there?"). It is *not* a
  retention metric, and it must never be dressed up as one.
