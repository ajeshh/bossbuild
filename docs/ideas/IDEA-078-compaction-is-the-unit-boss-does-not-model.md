---
id: IDEA-078
type: idea
owner: product-lead
status: deferred
proof: >
  [VERIFIED] mechanically, both halves. (1) The shipped founder surface has ZERO mentions of
  compaction: `grep -rln -iE 'compact|/clear|context window' stages/` returns two design-token
  template files and nothing else — no skill, no rule file, no CLAUDE.md line. (2) The host has
  `PreCompact` (`trigger: "manual"|"auto"`, `custom_instructions: string|null`) and `PostCompact`
  (`trigger`, `compact_summary` — "The conversation summary produced by compaction"), read out of
  2.1.132's zod schemas. Neither string appears anywhere in this repository. `SessionStart` also
  carries `source: "compact"`, so the host tells you a compaction just happened three different ways.
  FOUNDER DEMAND is [n=0] — nobody has reported this. It is a host-curve finding, not a demand one.
proof_note: >
  `library/practices/context-discipline.md` DOES cover compaction (lines 53-54, 313-319) and covers
  it well — "intentional compaction over accretion", "restart from the compacted state". That is
  advice to a founder. The gap is not that BOSS is ignorant of compaction; it is that BOSS's
  MECHANISM for working state assumes the session is the unit of forgetting, and on this host it
  is not.
gist: >
  BOSS's two-memory model draws a good line — durable facts to auto-memory, working state to
  `.claude/rules/feature-context.md` — and then hands the founder a working-state file that nothing
  ever writes to. The file says "prune it by hand when a feature lands." Meanwhile the actual
  eviction event on this host is auto-compact, which fires mid-session, without warning, at exactly
  the moment a three-hour vibe-coding run has accumulated the most unwritten context. The founder
  BOSS targets does not know compaction is happening. `/close` cannot help — the session has not
  ended, and it will not end for another two hours.
created: 2026-09-08
resolved: 2026-09-08 — the vocabulary half SHIPPED (v0.245.0); the PreCompact mechanism DEFERRED with the trigger below.
source: >
  Ajesh, 2026-09-08 — the memory/resume/chat-management sweep. Surfaced by asking what the shipped
  surface says about the founder's actual chat-management reality (compact, /clear, /resume) rather
  than about BOSS's own session ritual.
---

# Compaction is the unit BOSS does not model

## The line BOSS draws, and where it breaks

`library/memory-seed/README.md` states the cut, and it is a good cut:

| | Durable facts | Working state |
|---|---|---|
| Changes | rarely | fast, within a build |
| Home | auto-memory | `.claude/rules/*.md` with `paths:` |
| Lifecycle | persists; compounds | created → **cleared on `/close`** → promoted via `/extract` |

"Cleared on `/close`" is the assumption. It says the working set dies when the *session* dies.

On Claude Code the working set dies when the *context window* fills — which happens inside a
session, repeatedly, and is invisible to a founder who has never heard the word compaction. The
shipped `feature-context.md` is a hand-maintained file in a world where the thing it protects
against is automatic.

## What the host offers

- **`PreCompact`** — `trigger: "manual" | "auto"`, plus the user's `custom_instructions`. Fires
  *before* the window is squeezed. This is the only moment at which "write down what you'd lose"
  is both possible and cheap.
- **`PostCompact`** — carries `compact_summary`, the summary the host actually produced.
- **`SessionStart` with `source: "compact"`** — the third notification of the same event.

## The two honest cures, and why one is a trap

**The trap:** a `PreCompact` hook that auto-writes working state to `feature-context.md`. It writes
to disk on a schedule the founder does not control, in a file they are told to prune by hand, and it
would accrete — which is the exact accretion `context-discipline` line 313 warns against. It also
puts a write in the path of a latency-sensitive host operation.

**The plausible one:** `PreCompact` is a *cue*, not a writer — the same shape `memory-cue.js`
already ships with and defends in its own header (*"choosing the right wording needs reasoning, so
the cue hands that judgment back to the model"*). One line to the model: *the window is about to
compact; if anything in this feature's working set is not in `feature-context.md` or the devlog,
now is the moment.* Zero cost when there is nothing to say.

## The smaller, cheaper half — say the words

`/resume`, `--continue`, `/clear`, `/teleport` and `/context` are the founder's real chat-management
vocabulary on this host, and **BOSS's shipped surface names none of them.** `context-discipline`
names `/context` and `/memory`, but that practice reaches a founder only if they run `boss craft`.

A specific collision worth naming: a founder who has been told "read `docs/RESUME.md`" and types
`/resume` gets the host's conversation picker, not BOSS's file. For the first-product and
non-tech-founder cohorts that is a genuinely confusing minute, and it costs one sentence to fix.

## ✅ Resolved 2026-09-08 — one half shipped, one half declined on purpose

**SHIPPED (v0.245.0) — the vocabulary, which was the cheap half and the one that was plainly wrong.**
The founder-facing surface named none of `/resume`, `--continue`, `/clear`, `/compact`. A new
*Sessions vs. chats* line in the shipped `CLAUDE.md` names them, resolves the `/resume` ↔
`docs/RESUME.md` collision explicitly, and says the one operational thing that follows: `/clear` and
`/compact` drop working context, so put anything you'd hate to re-derive somewhere durable first.
`context-discipline` gained the whole session lifecycle — it had been silent about it while being
the document BOSS points founders at for exactly this.

🔴 **DEFERRED — the `PreCompact` cue, and the reason is not "no time".** It would be BOSS's *second*
registered hook in a day (the re-entry runner was the first), against **n=0** demand, on the same
week its own mandate is compose-and-subtract. The draft below already named the trap: a hook that
writes on a schedule the founder does not control is the accretion `context-discipline` warns
against, and the cue version is only better, not obviously right.

- **Re-open trigger, testable:** a founder reports losing work to auto-compaction, OR a real project
  has a `.claude/rules/feature-context.md` with content someone actually wrote. **Check the second
  one first** — nothing has ever written to that file, and if it is empty in every real project then
  the working-state half of BOSS's memory model has a bigger problem than compaction.

## Open questions as originally filed

1. Is the cue worth a sixth dormant hook, given EVID-001's bloat fear? A hook nobody turns on
   is the same as no hook — see the `boss hooks` catalog, which shipped precisely because five
   dormant hooks were undiscoverable.
2. Does `feature-context.md` survive contact with reality at all? Nothing has ever written to it.
   Before adding a writer, check whether any real project has a non-template copy.
3. **Demand is n=0.** This is `curve: host` movement, which is `/practice-refresh`'s trigger, not
   a founder request. It should be filed and held unless [[IDEA-081]] makes it load-bearing.

## Related

- [[IDEA-077]] — the boundary half of the same hook family.
- [[IDEA-081]] — Remote Control; a worktree-spawned session starts with a cold context every time.
- `library/practices/context-discipline.md` — `curve: host`, `last_reviewed: 2026-08-22`,
  `review_by: 2026-11-20`. **Not due, and the ground under it moved.**
