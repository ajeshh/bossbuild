---
id: RVW-095
type: verdict
owner: pm
status: recorded
created: 2026-09-08
verdict: ADAPT
route: DOWN stages/L1-mvp/template/.claude/agents/mentor-architect.md (trigger phrases)
---

# RVW-095 — "when to rearchitect": BOSS has the answer and the founder's word doesn't reach it

## The claim
- **Source:** EVID-001, 2026-07-23 — a real founder, using BOSS, unprompted:
  *"help me keep focus + **when to rearchitect**."*
- **Core assertion (as filed):** `rearchitect` appears zero times in the repo, so BOSS has **no
  surface** for the moment a founder asks about.
- **Inbox file:** `docs/research/inbox/rearchitect-has-no-surface.md`

## 🔴 The claim as filed is FALSE, and that is the finding

The zero-occurrence grep was real; the conclusion drawn from it was not. **The judgment ships, twice,
and it is good:**

- **`stages/L1-mvp/template/.claude/agents/mentor-architect.md:62`** — *"a **breakpoint, not a
  calendar**: a shipped FEAT, a mode transition, the third repeat… ⚠️ **check the register first:** for
  a founder with no users, 'go tidy' is the pseudo-app trap wearing an engineering hat. **Debt is only
  worth naming once the code is what's slowing them down.**"*
- **`library/practices/scalable-architecture.md`** — *"Modular-monolith-first, **extract when
  forced**"*, with an explicit trigger list: *"a real constraint — a scaling wall, a team that needs
  independent deploys, a compliance boundary — **not an aesthetic preference or a blog post**."*
  Sourced (Fowler MonolithFirst; Shopify's 2.8M-line modular monolith).

That is a **complete, well-evidenced, correctly-hedged answer** to "when should I rearchitect" —
including the refusal case the inbox file worried BOSS was missing. It was already there.

**So the gap is not coverage. It is vocabulary.** `mentor-architect`'s shipped trigger phrases are
*"what stack" · "where does AI fit" · "is this the right boundary" · "should we use an agent here" ·
"what about evals" · "should we split this" · "where does this data live" · "is this premature".*
**Not one of them is a word the founder actually used.** `rearchitect` / `re-architect` / "technical
debt": **zero occurrences across every shipped agent and skill.**

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No — it **serves** #2 (just-in-time support at the moment of need). A founder asking the question *is* the JIT trigger; BOSS held the answer and did not recognise the cue. |
| 2 | Evidence grade | **First-party `stated-pain`, n=1** — a real founder, real product, unprompted. The best grade BOSS holds for anything. Still not observed behaviour. **The claim's own factual premise is disproven** (above); the *corrected* claim is verified by direct inspection of the shipped files. |
| 3 | Duplicate or sharpen? | **The claim as filed would have DUPLICATED shipped content** — the exact REJECT case in this rubric. The corrected version **sharpens routing** to an answer that already exists. |
| 4 | Who serves / harms? | Serves the cohorts who will never phrase it as *"should we split this"* — `non-tech-founder`, `vibe-coder-newbie`, `first-product` — who *would* say "do I need to rebuild this" or "is my code a mess". **Harms nobody**; nothing is added to anyone's surface. |
| 5 | Cost / ceremony | **Net zero.** Words inside an existing agent's `description:` frontmatter. No new skill, no new file, no new prompt. This is what compose-and-subtract looks like when it works. |

## Verdict: ADAPT

Adopt the **corrected** claim, not the filed one. BOSS does not need a `/rearchitect` skill, a new
practice, or a new mentor — EVID-001's own mandate forbids all three and was right to. What it
needs is for the founder's own words to reach the answer BOSS already wrote.

This lands on the same axis as everything else in the EVID ledger: **BOSS emits and never mirrors.**
Here it is mechanical rather than tonal — the agent that holds the answer does not list the question.

## What to do
Add the founder's vocabulary to `mentor-architect`'s trigger phrases — *"when should I rearchitect",
"do I need to rebuild this", "is this technical debt", "is my architecture holding me back"* — so the
existing judgment fires on the words a founder actually uses. **Hand to `/boss-learn`** to route
(DOWN, `stages/L1-mvp/template/.claude/agents/mentor-architect.md`).

⚠️ **Two things the implementation must not do.** (1) **Do not write new architecture guidance** —
the answer exists and adding a second one creates the drift this repo keeps logging. (2) **Do not
promote it above MVP.** The judgment's own first move is *"check the register: for a founder with no
users, 'go tidy' is the pseudo-app trap"* — surfacing it at Quickstart would invert its meaning.

## Attribution
**Verified — first-party.** EVID-001 is BOSS's own evidence ledger, quoted verbatim. No external
attribution is load-bearing here, and none was imported: [[RVW-094]]'s dead numbers (the misattributed
2.74x, the methodology-free 8,000) are **deliberately not used** to support this claim, which stands on
the founder's sentence alone.

## Notes
- 🔴 **Method failure, recorded because it is the second in one session.** This claim reached the inbox
  asserting an absence derived from **grepping a single word**. The concept shipped under *"extract when
  forced"* and *"debt is only worth naming once the code is what's slowing them down."* Earlier the same
  session, a research note asserted the build-craft watchlist listed no academic venue; `arXiv cs.SE` was
  in domain 11. **Twice: one grep, one conclusion, no synonym pass.** The rule this repo already knows —
  *grep for the field before writing the code that reads it* — has a twin: **grep for the CONCEPT before
  declaring the gap.** A word count is not a coverage measure.
- Prior related verdicts: [[RVW-094]] (the VC rebuild trend — REJECT; this claim was split out of it and
  explicitly does not inherit that verdict).
- Sibling still open: the **focus/disorientation** half of EVID-001 — a reach question, not a practice
  claim, likely already discharged by v0.231.0's `boss status` re-entry read.
- Verdict reached in-session rather than delegated to a Fable subagent (unavailable); recorded so the
  method is not overstated.
- BOSS version when recorded: 0.260.0
