---
id: DEC-011
type: decision
owner: "@ajeshh"
decided_by: founder
status: decided
created: 2026-08-21
reversibility: reversible
revisit_by: 2026-11-21
supersedes: DEC-009 §5 (positioning held fixed)
---

# DEC-011 — BOSS names a second destination, and stops deciding enclosure for the founder

> Ajesh, 2026-08-21, hours after [[DEC-009]]: *"boss still seems to be capitalistic. more socialist
> where its about creating free, open source, be able to break the capitalistic foothold and creating
> tools for empowering individuals against bad governance… we need to do more good that cares for each
> other, our world and environment. not be siloed into government or capitalistic regulation that
> throttles social good."* And: *"it should be able to inspire co-ops, empower positive revolution that
> brings balance to using tech for good rather than an egoistic drive that eventually hurts.. but
> brings togetherness."*

## Context

[[DEC-009]], the same day, fixed a **defect**: a founder who would never charge had to fabricate a
revenue line or stall at a gate. It fixed that completely and then held the line — **§5: *"The
positioning does not change. BOSS still says incubator, still says fundable/hireable venture."***

**This is the charter question DEC-009 declined, asked again and answered differently.** The founder
has changed the positioning. That is his to change, and §5 is the only part of DEC-009 it touches.

### What the audit found — five places, not a mood

1. **Every project BOSS creates is born closed.** [`src/cli.js:92-93`](../../src/cli.js#L92) and
   [`:231`](../../src/cli.js#L231): `visibility: 'private'`, `license: 'proprietary'`.
2. **The `/boss` skill argues one side of it** — *"default is **proprietary / All Rights Reserved** so
   you keep both paid and open-source options open… Say 'open source' if you'd rather."* The commons
   is the thing you speak up to escape.
3. **Its Rules section states the default as a prohibition** — *"Never publish a permissive license by
   default."*
4. **The proprietary LICENSE template argues for itself**, in the legal file, with a paragraph on
   preserving the option *"to commercialize it."*
5. **The telos, in one line each:** [`CLAUDE.md:19`](../../CLAUDE.md#L19) and
   [`docs/MENTORS.md:24`](../MENTORS.md#L24) — *"from idea to **fundable/hireable** venture."*
   Fundable is investor-legible; hireable is staffed-up. The top rung of the ladder is named **Scale**.

### What was already true, and is not being re-litigated

BOSS is MIT. State is local; `shareUp: false` means it sends nothing anywhere on its own. Principle 6
gives the humane lens override authority over viability. The canvas's Metrics cell already asks *"what
does success look like — **for people and planet**?"* and weights regenerative answers equally —
*"growth that renews, not just extracts."* The canvas refuses, by name, to talk a founder into
monetizing. **The values layer was largely there. The defaults and the destination were not.**

## Decision

### What changes now — mechanism

1. **The telos gains a second destination.** *"…mentors the founder from idea to fundable/hireable
   venture"* → **a thing that stands on its own: a company, a co-op, or a commons — whichever the
   founder is actually building.** `CLAUDE.md` and `docs/MENTORS.md`.

2. **Principle 5 stops carrying the answer.** *"Optionality by default"* keeps its real content —
   decide late, on evidence — and loses the pre-loaded *"private repos, proprietary license."* The
   asymmetry gets named in both directions instead of one.

3. **The licence stops being decided for the founder.** `license` scaffolds as **`null` — undecided**,
   and `/boss` asks a genuinely two-sided question at the moment a repo is created: a permissive grant
   cannot be revoked, **and** a project that was never opened quietly stays closed. Both are real
   failure modes; BOSS names both and picks neither. The Rules line becomes *"Never decide the licence
   for them."* The LICENSE template stops arguing its own case — that argument belongs in the ask,
   next to its counterpart.

4. **Visibility keeps `private` as the starting state, and stops being an assumption.** A repo minutes
   old, before anyone has looked for a key in it, is not a thing to publish by reflex. But `/boss` now
   offers public as a peer option rather than as the exception.

### What is deliberately NOT built

5. **No co-op mentor, no commons mode, no `intent` axis.** IDEA-067 rungs 2 and 3 stay `deferred`
   with their existing re-open triggers. **n=0 is still n=0** — a body of cooperative-structure and
   steward-ownership counsel built for a founder who has not appeared is the same charter-widening
   DEC-009 refused, wearing a better hat.

6. **The website is still untouched.** Mechanism first, claim second. BOSS does not get to say
   *"co-ops, commons, tech for good"* on a landing page in the same release it changes four defaults.

## Why

- **The reversibility argument was correct, and it is exactly why the default does not flip to MIT.**
  You cannot revoke a permissive grant. Defaulting a founder into an irrevocable public grant they
  never chose is *the same defect pointed the other way* — and it breaks Principle 2 (never premature)
  and the whole decide-late discipline. The argument was doing two jobs: **an argument for asking**,
  and **an answer**. It keeps the first and loses the second.
- **The default was load-bearing in a way the copy admitted.** *"Say 'open source' if you'd rather"*
  is a real thumb on the scale — enclosure as the path of no resistance, in a tool whose author wants
  the commons to be the easy road. Making the question neutral is the smallest change that removes it.
- **`fundable/hireable` is one line, and the entire ladder points at it.** Changing it costs nothing
  and is the only sentence in the repo that states what BOSS is *for*.
- **Claiming co-op support without building it is [[dev-workspace-described-as-shipped]] at a new
  surface** — the failure this repo keeps catching. A second destination *named* is honest; a second
  destination *advertised as served* is not.
- **EVID-001's mandate is compose and subtract.** Four of the six moves here are deletions.

## Falsifier

*What would prove this wrong, and by when?*

1. **The neutral ask changes nothing.** If founders asked a two-sided question pick proprietary at the
   same rate, the default was not what was doing the work and this is theatre — the real barrier is
   elsewhere (probably that nobody has told them what the choice costs).
2. **🔴 The harm the old default prevented, caused.** If **n ≥ 1** founder open-sources through the new
   prompt, later needs to earn from the work, and cannot — BOSS pushed someone into an irrevocable
   grant. **This is the one to watch, and one occurrence is enough to revisit.**
3. **The words outrun the mechanism.** If a co-op or commons founder arrives *because* of the new
   telos and hits DEC-009 falsifier #1's second wall (`/comp-eval`, `mentor-capital`, the post-launch
   arc), then naming the destination without rungs 2–3 was the overclaim it was trying not to be.

**Check at `revisit_by` 2026-11-21, or on the first occurrence of #2, whichever is first.**

## Consequences

- **[[DEC-009]] stays `decided`.** Only §5 is superseded; the canvas's second sustainability branch
  and `/money`'s stop-don't-route branch are untouched and still right.
- **Existing projects are unaffected.** `boss adopt` and `boss sync` never clobber a written
  `.boss/config.json`; a founder who already has `license: "proprietary"` keeps it.
- **The pressure on the `intent` axis goes UP, not down.** BOSS now names three destinations and has
  no way for a founder to declare which one they are on. That tension is deliberate and recorded —
  it is the thing IDEA-067 rung 2 exists for, and it is still waiting on a real user.
- **BOSS's own canvas now understates its charter.** The People/Problem/Promises cells describe a
  founder building a venture. That is a `/canvas` re-aim conversation, not a sweep — and the canvas
  is already ~154 releases stale and says so.
- **The website gap is a knowingly-taken acquisition cost, for the second time.** A commons-minded
  founder evaluating BOSS still has no way to know it won't push them toward a business model.
