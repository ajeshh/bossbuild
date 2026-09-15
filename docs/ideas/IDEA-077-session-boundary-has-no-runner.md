---
id: IDEA-077
type: idea
owner: product-lead
status: shipped
proof: stages/L0-quickstart/template/.claude/hooks/reentry.js
shipped_on: 2026-09-08
evidence: >
  ⚠️ Two claims, two grades. (1) The DEFECT is [VERIFIED] mechanically against both trees:
  Claude Code 2.1.132 exposes 29 hook events including `SessionStart` (`source:
  startup|resume|clear|compact`) and `SessionEnd` (`reason: clear|resume|logout|
  prompt_input_exit|other|bypass_permissions_disabled`) — read out of the shipped binary's own
  zod schemas, not the docs. BOSS registers exactly ONE hook by default (`conscience.js` on
  `UserPromptSubmit`, `stages/L0-quickstart/template/.claude/settings.json`) and ships six
  dormant ones across `UserPromptSubmit`/`PreToolUse`/`PostToolUse`/`SubagentStop`. The strings
  `SessionStart` and `SessionEnd` appear NOWHERE in this repository — not in a skill, a practice,
  an idea, a verdict, or the CHANGELOG. (2) FOUNDER DEMAND is [stated-pain] — EVID-001's
  "I forget what feature I'm building / get adhd" and EVID-003's "jumped straight into
  building". Nobody has been observed losing a session to this.
proof_note: >
  The absence was checked, not assumed. `grep -rn "SessionStart\|SessionEnd\|PreCompact\|
  PostCompact"` over the whole tree returns nothing, so this is a blind spot and not a recorded
  decision — there is no verdict to read lineage against ([[checkers-state-intents-they-dont-enforce]]
  n=18's rule: never infer a decision from adjacency or from silence).
gist: >
  BOSS wrote the rule itself. `src/brain.js` records Ajesh's own words — *"people can forget
  close ... a rule that depends on someone remembering is not a mechanism"* — and then applies it
  only to the brain's CONTENTS (`derivedFacts` is the floor under a skipped `/close`). The two
  rituals that produce everything BOSS knows about a session — open by reading `docs/RESUME.md`,
  close with `/close` — are still rules that depend on remembering. `src/orientation.js` already
  computes the entire re-entry answer and already gates it at three days away; it fires only if
  the founder remembers to type `boss status` in a terminal, inside a product that lives in
  Claude Code where they just start typing. The host has had the boundary events the whole time.
created: 2026-09-08
source: >
  Ajesh, 2026-09-08 — "anything around project memory, prompt storage, closing a chat, prompt
  governance, resume, logging, chat management that could use a refresh or update in boss",
  scoped by him to the FOUNDER-facing surface. Found by reading the shipped templates against
  the host binary rather than the host docs.
---

# The session boundary has no runner

## What is actually true today

BOSS's session model is two rituals and one CLI command:

| Surface | Who invokes it | What happens if they don't |
|---|---|---|
| "read `docs/RESUME.md` first thing" (`claude-append.md` rule 0) | the founder, from memory | the twenty minutes `/close` exists to prevent |
| `/close` (session-end ritual) | the founder, from memory | RESUME, devlog and `.boss/brain/read.md` all go unwritten |
| `boss status` re-entry read (`src/orientation.js`) | the founder, in a terminal | the answer is computed and never read |

All three are correct, and all three are conventions. `src/orientation.js`'s own header says the
re-entry read *"fires when they COME BACK, which is both the only observable moment and the only
kind one"* — and then binds that moment to a command the founder has to think of.

## The mechanism that exists

Verified against `/opt/homebrew/Caskroom/claude-code/2.1.132/claude` (the shipped binary, zod
schemas read directly — not the docs, per `context-discipline`'s host-verification rule):

- **`SessionStart`** — `source: "startup" | "resume" | "clear" | "compact"`. Fires once, at the
  moment the founder arrives, and knows *how* they arrived.
- **`SessionEnd`** — `reason: "clear" | "resume" | "logout" | "prompt_input_exit" | "other" |
  "bypass_permissions_disabled"`.

Both fire once per boundary. That is materially cheaper than the one hook BOSS *does* register
(`conscience.js`, a process on every prompt), so the cost argument that made the other five hooks
opt-in does not transfer here.

## Why this is a composition, not an addition

EVID-001's mandate is *compose and SUBTRACT, never add another skill*. This adds:

- no skill (48 before, 48 after)
- no loop (19 before, 19 after)
- no new output — `renderReentry` already exists and is already tuned (`REENTRY_DAYS = 3`,
  every rung printed including its zeros, no streak, no percentage)

It moves an existing answer to the moment its question is asked. That is the same shape as
v0.214.0 and v0.231.0, the two prior discharges of the mandate.

## ✅ Shipped at v0.244.0 — and what was deliberately left out

> **Record hygiene, 2026-09-10.** This record carried a frontmatter `shipped:` key —
> *"2026-09-08 — v0.244.0. SessionStart only; SessionEnd deliberately NOT built"* — which **nothing
> reads**, sitting beside the `shipped_on:` that `boss board` and `boss records` do read. Two fields
> holding the same date can only drift apart, and the unread one drifts silently. `shipped:` is
> retired; the date lives in `shipped_on:` once, and the qualifier is this paragraph. It was not
> moved to a `shipped_note:` because nothing reads that either — a `*_note` with no reader is the
> same defect one name over. Prose belongs in the body, where it needs no reader.

The three open questions below were answered by building, and one of them was answered "no":

1. **Context cost** — the gate holds. Silent under 3 days, silent with no devlog (so silent by
   construction at Quickstart), silent on `clear`/`compact`, and silent the second time for the
   same devlog date. Silence is the requirement, not the fallback.
2. 🔴 **`SessionEnd` was NOT built, and that is the finding, not an omission.** A hook cannot run
   `/close` — `/close` needs a model to form the brain read. What is left is a nag arriving at the
   moment someone is leaving, which is the worst moment to ask for anything, and `reason:
   prompt_input_exit` means interrupting a Ctrl-C. The cost it would catch is **already absorbed
   twice over**: `derivedFacts` (src/brain.js) is the floor under a skipped `/close`, and the
   re-entry read pays the bill when they come back. This record's own draft guessed *"possibly the
   right answer here is nothing"* — it was right.
3. **Registered, not dormant** — argued rather than assumed: `conscience.js` already ships ON and
   fires on every prompt; this fires once per session start, so it is strictly cheaper than what
   was already registered. A dormant orientation hook cannot orient anyone.

**Found while building:** `readStdin`'s 1000ms fallback timer was never `.unref()`d, in all three
copies, so every fire of `memory-cue` cost a full second *after* its work was done. 25ms now.

## The open questions as originally filed

1. **Does `SessionStart` output cost context every session?** It does — that is the entire
   mechanism. The re-entry gate (≥3 days away) must hold, or this becomes the always-loaded
   bloat `context-discipline` exists to prevent. **Silence on day 1 is the requirement, not the
   fallback.**
2. **Is `SessionEnd` a nudge or a write?** A hook cannot run `/close` — `/close` needs a model to
   form the brain read. The honest ceiling is *"you have uncommitted work and no devlog entry
   today"*, and even that is a notification at the moment the founder is leaving, which is the
   worst moment to ask for anything. **Possibly the right answer here is nothing.**
3. **Registered or dormant?** All five optional hooks ship OFF on a stated principle. Registering
   this one by default would be the first exception, and it needs a reason better than "it's cheap."

## Related

- [[IDEA-078]] — the same hook family, the mid-session half (compaction).
- [[IDEA-081]] — Remote Control makes this urgent: on a phone the founder *cannot* run
  `boss status`, so a hook is the only channel that survives.
- [[IDEA-076]] — position within the rung. Same founder complaint, different surface.
