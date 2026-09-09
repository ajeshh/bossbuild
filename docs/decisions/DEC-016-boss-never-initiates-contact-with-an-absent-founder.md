---
id: DEC-016
type: decision
owner: "@ajeshh"
decided_by: founder
status: decided
created: 2026-09-08
confirmed: 2026-09-08 — Ajesh, "lets do it accordingly and execute"
reversibility: one-way
revisit_by: 2027-03-08
---

# DEC-016 — BOSS never initiates contact with an absent founder

> **✅ CONFIRMED 2026-09-08 (v0.243.0).** Written *before* there is a reason to build the thing it
> forbids, which is the only time a constraint like this can be argued on its merits rather than
> against a specific disappointment.

## Context

Every restraint in BOSS's conscience currently rests on a **capability** claim, not a value claim.
`src/orientation.js` states it as inherited law:

> *a CLI can only ever run while the founder is HERE. It can never observe an absence in real time.
> So the re-entry read does not fire AT someone who is away — it fires when they COME BACK, which is
> both the only observable moment and the only kind one.*

The `sustaining` moment's frame says the same thing harder: *"You are not observing an absence — you
cannot; nothing runs while they are gone."*

**That is now false.** With Claude Code's Remote Control connected, the `PushNotification` tool
*"sends a desktop notification in the user's terminal. If Remote Control is connected, it also pushes
to their phone."* A session can also subscribe to a PR and be woken by CI failures and review
comments. BOSS could reach a founder who has closed the laptop.

The constraint was load-bearing and was never a decision. It was a description of a limit, and the
limit has been removed.

## Decision

**BOSS never initiates a notification to a founder who is not present. No push, no phone, no
"while you were away".**

Specifically:

1. **No BOSS surface calls `PushNotification`, or any successor, on its own judgment.** Not the
   conscience, not a loop, not a skill, not a hook.
2. **If the founder explicitly asked for a long-running task and it finished, the host's own
   completion notification is the host's business.** BOSS neither suppresses it nor adds to it.
   The founder asked; the host answers. BOSS is not in that path.
3. **The re-entry read stays a re-entry read.** It fires when they come back. It never states elapsed
   time, never remarks on the absence, and never arrives as a summons to return — every one of those
   rules already exists in `moment-frames.js` and they all assumed the founder was already here.
4. **This binds even when the notification would be genuinely useful.** A red build, a failed deploy,
   a PR comment. Those are the cases that will make someone want to reverse this, and they are
   exactly the cases the decision is about.

## Why

- **The catalog already contains the answer.** `library/deceptive-patterns.json` carries
  `engage-streaks-variable-rewards` and its relatives. A tool that pings you when you stop using it
  is not a variant of that pattern; it is the pattern. BOSS cannot ship a dark-pattern catalog and a
  re-engagement push in the same release.
- **The humane lens is BOSS's stated differentiator**, and `mentor-humane` holds override authority
  precisely for calls like this one. A conscience that reaches you on holiday is the thing BOSS warns
  founders not to build.
- **The existing restraint is already written and already good.** `moment-frames.js` forbids
  *"welcome back"*, forbids stating elapsed days (*"a number is a streak wearing a coat, and it is
  what makes someone feel counted while they were away"*), and forbids sympathising with an absence
  whose cause it cannot know. Every one of those rules is *stronger*, not weaker, once absence
  becomes reachable.
- **Reversibility is asymmetric.** Not shipping a push costs a founder some latency on bad news they
  will see when they return. Shipping one and withdrawing it costs the trust that made BOSS's
  restraint credible in the first place — which is why this is filed `one-way` even though the code
  change would be trivial in both directions.

## Rejected alternatives

- **Opt-in push.** The honest version of "opt-in" here is a setting a founder enables in a good mood
  and experiences in a bad one. BOSS already ships five opt-in hooks and defends that pattern well —
  but those change what BOSS *checks*, not whether BOSS can *interrupt a person's evening*. The
  asymmetry is not comparable, and "they consented" is the standard justification in every pattern
  in the catalog.
- **Push only for genuine emergencies (prod down, secret leaked).** Attractive, and the failure mode
  is that the emergency list grows. It also presumes BOSS knows what is an emergency *for this
  person*, which is precisely the judgment `moment-frames.js` says it cannot make about an absence.
  If a founder wants to be paged, a pager is a solved product and BOSS should say so.
- **Stay silent and decide later.** That is the status quo, and it is how a constraint becomes an
  obstacle: the first person to want a push will have a good reason, and there will be nothing
  written down for them to argue against.

## Falsifier — what would prove this wrong, and by when?

By revisit (2027-03-08): if a real founder, unprompted, asks BOSS to tell them something while they
are away — and the thing they want is not already served by the host's own notifications or by a
pager — then the constraint is costing them something real and the decision should be superseded with
a **narrow, named** exception rather than relaxed in general.

Note the bar: *unprompted, real, and not otherwise served*. A founder saying "that'd be cool" when
shown the capability is EVID-001's Mom-Test fluff, not a signal.

## Consequences

- 🔴 **"Nothing to build" was the weakness, and it got fixed.** A decision that nothing enforces is
  the exact pattern this repo keeps catching. **`test/person-state.test.js` now asserts that no
  shipped `.js` under `src/` or `stages/` contains a notification call site or shell-out**
  (`osascript`, `notify-send`, `terminal-notifier`, `node-notifier`, a `PushNotification(` call).
  Verified to fail when one is planted. It is trivially true today, which is precisely why it was
  cheap to lock in — the assertion costs nothing until the day someone has a good reason.
- ⚠️ **The honest limit, stated in the test itself: it reads CODE, not PROSE.** The other way BOSS
  could ask for a push is by *instructing* it — a hook printing a request, a skill telling the model
  to notify. Nothing mechanically checks that, and pretending otherwise would be the
  [[checkers-state-intents-they-dont-enforce]] failure in a decision *about* restraint. That half is
  held by this record and by review.
- **Comments strip before matching**, because `src/orientation.js` now cites this decision by name
  and the first version of the check flagged it. Prose discussing a thing is not a call site.
- **Two comments need updating, not weakening.** `src/orientation.js` and `moment-frames.js` both
  justify their restraint with *"it cannot observe an absence."* That is now a false premise
  supporting a true conclusion — the most dangerous shape a comment can have, and exactly the
  [[checkers-state-intents-they-dont-enforce]] failure where a rule outlives its stated reason. Both
  should cite this decision instead of the capability.
- **`/red-team --humane` gains a check it can actually run:** does any BOSS surface call a
  notification API? Today the answer is trivially no, which is the right time to add the assertion.

## Related

- IDEA-081 — the Remote Control survey that found the removed limit.
- `library/practices/deceptive-patterns.md`, `library/deceptive-patterns.json` — the catalog this
  decision refuses to contradict.
