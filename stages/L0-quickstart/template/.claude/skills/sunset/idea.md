# Idea-level sunset — decide against an idea, and keep the reasoning

When invoked with an idea (`/sunset IDEA-012` or a named idea), this closes **one captured idea** you
have decided not to pursue. The lightest of the three: an unbuilt idea has no users, no code and no
maintenance cost. What it has is a **reason**, and that is the only thing worth saving.

The failure mode it treats: `docs/ideas/` fills with things sitting at `seedling` and `exploring` that
were quietly decided against and never marked, so the backlog reads as work when most of it is
archaeology. **The status vocabulary already promises the fix** — `dropped` means *"decided against,
kept for the reasoning"* — and nothing ever kept the reasoning. A status you flip by hand keeps
whatever you happened to type that day.

## The question that comes first

**"Did you decide against this, or did you just never get to it?"** Those are different, and only the
first is a sunset.

- **Decided against** → continue below.
- **Never got to it** → that isn't a decision, and `dropped` would be a lie about your own backlog.
  Leave it: *"this is still just an idea you wrote down — nothing has been decided, and that's a fine
  place for it to sit."* **Do not talk someone into closing an idea to tidy the list.** A tidy backlog is not the
  goal; an honest one is.

## Three questions, then stop

Same frame as the other two scopes — *an experiment that returned an answer* — except here the
experiment was thinking, not building. Once they've said *decided against*, ask all three in **one
message, numbered**, in words that fit this idea, so they can answer by number.

1. **What was the bet?** What did you believe was true when you captured it?
2. **What did you learn deciding against it?** Often the sharpest of the three. An idea dropped for a
   reason you *discovered* teaches more than one that was never good — *"turns out three people already
   do this well"* is a real finding about your market. *"I lost interest"* is also a real answer; say
   it plainly rather than dressing it up as strategy.
3. **Is this a *no*, or a *not yet*?** ⭐ **This one is a router, and it decides the status.** The
   vocabulary already has both words and they are not synonyms:
   - **You can name a condition that would bring it back** → this is **`deferred`**, not dropped.
     *"Deliberately NOT being built, with a written re-open trigger. A decision, not a backlog item."*
     Write the trigger and use that word. **Say so plainly** — most "no"s turn out to be "not yets,"
     and `deferred` is the more honest one.
   - **Nothing would bring it back; you've decided against it on the merits** → **`dropped`**.
     *"Decided against. Kept for the reasoning."* The reasoning is what stops future-you re-litigating
     it in six months, which is the only thing that makes this status worth having.

   **Do not ask both.** A `dropped` idea carrying a re-open trigger is a `deferred` idea wearing the
   wrong word, and a status vocabulary that blurs is the failure `docs/IDS.md` was written to end.

## Then write it down, and stop

- Append a short **`## Why this was dropped`** (or **`## Why this was deferred`**) section to the idea
  file: the answers, dated. Three or four sentences. Not a document.
- Set the status — `dropped` or `deferred` per question 3 — in the frontmatter **and in
  `docs/ideas/INDEX.md`**. Both, or they drift, which is the exact failure the backlog checker exists
  to catch, and the file is truth while the index is a view of it.
- **Nothing else happens.** No `boss retire` (this isn't a project). No deprecation notice (it has no
  users). No file deleted — `dropped` keeps the record, which is the whole point of the status.

## Idea-level guardrails

- **Do NOT offer `/extract`.** The other two scopes harvest because something was *built* and a
  pattern was *proven*. An unbuilt idea has proven nothing, and routing it UP is how a practice shelf
  fills with things that merely sounded good. **The harvest is the one movement that doesn't shrink to
  this scale — it disappears.**
- **More reversible than the others.** Both statuses are a word in a file, not a deletion; reopening is
  two lines. `deferred` tells you *when* to reopen; `dropped` tells you *why you shouldn't*.
- **Never suggest this unprompted, and never in a batch.** *"You have eleven open ideas — want to close
  some?"* is backlog hygiene wearing a conscience's coat, and it is not what this is for.
