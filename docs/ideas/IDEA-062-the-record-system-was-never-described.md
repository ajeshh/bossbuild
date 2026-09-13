---
id: IDEA-062
type: idea
owner: product-lead
status: shipped (v0.181.0 — page + the three template fixes)
program: the-record-system
proof: site/keeping-track.html
created: 2026-08-20
source: Ajesh, 2026-08-20 — "documentation for the app on the website, how we organize and capture,
  so that we can refer back… ahead of the curve… especially from a product management perspective…
  helps with managing the hot mess of ideas, projects, features and such and helps keep track of it
  to ensure we are building the right thing." Then, on placement — "i meant for oyeboss.build we
  dont surface it much there, like under the product aspect."
---

# IDEA-062 — The record system was BOSS's most distinctive thing and its least described

## The gap, measured

`IDEA-`, `FEAT-`, `DEC-`, `frontmatter`, `docs/ideas/` — **zero occurrences across the entire site**
before this. `/triage`, `/spec`, `/decide` appeared only as rows in command tables. A reader saw a
verb and never learned a durable, addressable file came out of it.

The spine was *"BOSS staffs your project"* and all four pages under **The product** were about the
team and the surface. **The team is who shows up; the records are what survives the session.** For a
founder with twelve half-ideas, the second half is the more immediately felt one, and the site did
not claim it.

## The altitude correction (Ajesh's, and it mattered)

First proposal put the page under **How it works**, beside Design and The conscience — which would
have made it a philosophy page read by engineers who like the reasoning. Ajesh: *"under the product
aspect."* Under **The product** it is a capability read by someone deciding whether this solves their
problem: benefit first, mechanism second, real artifacts on screen, prior-art honesty as a closing
paragraph rather than the spine. Same content, different page. See [[confirm-the-altitude-first]].

## What the build caught (the part worth keeping)

Deriving the ID table from the *shipped* `docs/IDS.md` rather than retyping it exposed **three wrong
rows in the founder's own file**, immediately and unmissably:

- `DEC-NNN` filed under **V1** — `/decide` ships at **Quickstart** and writes `docs/decisions/DEC-NNN`.
  The listed format (`DEC-YYYY-MM-DD-NNN`) is one no skill writes.
- `EVID-NNN` **absent** — `/evidence`, `/interview`, `/research` all ship at L0 and write it.
- `PRAC-NNN` **absent** — `/practice` ships at MVP.
- `FIX-NNN` / `BUG-NNN` **exist nowhere but that table.** No skill, no manifest, no reference.
  Removed. A record type nobody writes is exactly the ceremony BOSS exists to prevent.

🔴 **The generalisable rule: a page that restates a claim can be wrong quietly; a page that derives
it cannot.** This is the same rule `check:site` already enforces for counts, applied one level down —
to the *content* of a shipped template, not just its numbers. Same shape as [[IDEA-060]]'s
*derive the claims, never restate them*.

## Sorted UP (PRINCIPLE #1)

BOSS was running a **seven-word closed status vocabulary** and a *file-is-truth, index-is-a-view*
rule in its own `docs/IDS.md` while shipping **six words and no rule**. Both now ship, including
`deferred` (deliberately not building this, **with a written re-open trigger** — a decision, not a
backlog item). The shipped `INDEX.md` stopped restating the vocabulary and points at `IDS.md`: a
second copy of a vocabulary is a second thing to keep in sync, which is the failure the page is about.

## The honest limit, named on the page

**Two claims here are rules, not mechanisms — and one of them broke the same week.**

Correction (Ajesh, mid-build): an early draft said allocating the number "is a human reading the
folder." **False.** `/triage` allocates it — `triage/SKILL.md:16` ⚠️ *(link removed 2026-09-08: no `triage` skill exists at that path, or anywhere in the tree or its history — the path was wrong when written. Surfaced when `check-refs` was taught to ignore code spans and stopped mis-matching this line.)*
says *create a new `IDEA-NNN` (next free number)*. Nothing in `src/` allocates IDs; there is no code
path at all. So the actor is the agent, not the founder.

🔴 **The real distinction is sharper than the one I first wrote: it is an instruction to a model, not
a computation.** A sentence telling an agent to count is indistinguishable from code that counts —
right up until it miscounts and nothing checks the result. Two files claimed `IDEA-059` here on the
same day and every `[[IDEA-059]]` reference (including one in `RESUME.md`) was ambiguous until a
person noticed.

The **closed status vocabulary has the same shape**: closed by rule, and nothing in a founder's
project rejects an off-vocabulary word.

⚡ **Resolved mid-build, by a concurrent session: `check:backlog` now EXISTS** (v0.181.0) and gates
both — duplicate IDs *and* off-vocabulary statuses, in `npm test` and the release gate. It found 21
of 64 records in conflict, 18 of them finished work filed as unfinished. But it is **BOSS-repo only**
— nothing in `stages/` or `library/` references it, so a founder gets the rules and not the checker.
🔴 **That is Principle #1 mid-flight: proven upstream, not yet sorted DOWN.** The page says exactly
this rather than claiming enforcement a founder doesn't have.

## Refusals decided up front

- **No claim of invention.** ADRs are Nygard 2011; render-from-frontmatter is what note tools do;
  discovery-over-documentation is Cagan. All registered in `sources.json` and named on the page. The
  narrow claim is the composition: *ceremony rationed by mode*, and *some docs execute*.
- **No new skills.** [[EVID-001]] — compose and subtract. This shipped one page and removed a record
  type; it added no verb.
- **No `check:backlog`.** ⬜ See open item below — the mechanism is claimed but does not exist, and
  writing it was out of scope for a website ask.

## Open

- ✅ **`check:backlog` exists** — shipped v0.181.0 by a concurrent session while this page was being
  built, closing what was filed here as the doc-describes-a-mechanism-it-doesn't-provide rot.
- ⬜ **Sort `check:backlog` DOWN into the scaffold.** It is BOSS-repo only. A founder inherits the
  closed vocabulary and the never-reuse rule as *prose*, with nothing checking either — which is the
  precise gap the page now discloses. Cheapest shape: a rule an agent runs at `/close`, not a script
  a founder has to wire. Refuse the version that requires a build step.
- ⬜ **2 new key sources carry no URL** (Nygard, Cagan) — citation debt is 18 of 20. [[IDEA-058]].
