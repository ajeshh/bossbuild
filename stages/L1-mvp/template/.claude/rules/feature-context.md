---
paths:
  - "src/**"
---

<!-- MVP working-context. Loads when Claude opens a matching file. Rescope `paths:` to where the
     feature's code actually lives.

     v0.293.0 (IDEA-094): this file used to say "/close will compress this to a one-line outcome"
     and /close had never read it — the file had ZERO writers anywhere in BOSS. It has them now:
     /spec stamps the active FEAT, /close compresses the Found-while-building list at session end,
     and the conscience's task-hygiene moment notices when this file has fallen behind the task
     list in the chat. Prune it by hand any time; nothing here is precious. -->

# Working context — current feature

_What the model needs **while** building the live FEAT. Ephemeral by design — prune when it ships._

- **Active FEAT:** (e.g. FEAT-003 — checkout flow)
- **Local decisions:** (the choices that bind this feature's code, with a one-line why)
- **Gotchas / don't-redo:** (the traps you already hit, so the model doesn't re-walk them)

## Found while building

> **The list that goes missing.** A FEAT's acceptance criteria are the *planned* work, written when
> you knew least. These are the things you discover at hour three — and until they are on this line
> they exist only in the chat, which means a compaction or a closed window loses them. The recovery
> is re-reading everything you built, and **that tells you what you did; it can never tell you what
> you meant to do next.**
>
> **Sort each one as you write it. Three kinds, three destinations, and only the first stays here:**
>
> | Kind | Example | Where it goes |
> |---|---|---|
> | **task** | "the migration needs a rollback too" | stays on this list |
> | **new scope** | "this should also handle teams" | `spun_to:` — a new id, never a criterion added to a FEAT in flight |
> | **open question** | "do we even want this behind a flag?" | the Open questions block below |
>
> The middle row is the one that matters. `spun_to:` exists to stop a FEAT growing while it is being
> built, and it is right to — but *"this also needs X"* is usually a **task**, not scope, and
> pushing it out through the only door BOSS had is how it ended up with no door at all.

- [ ] (task — what, in the words you'd use to pick it up cold)
- [ ] …

## Open questions

_Things you decided not to decide yet. Writing one down is what stops it being re-litigated at
2am, and what lets you hand this feature to someone else — including a future session._

- (the question · why it is still open · what would settle it)

<!-- Ticking is a claim, so it holds the same bar as everything else BOSS writes: tick when it is
     done, not when the turn ended optimistically — and UN-tick freely. A list that can only go up
     is a comfort device, which is a pattern BOSS ships a catalog against. -->
