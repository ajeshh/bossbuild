---
id: RVW-098
type: verdict
owner: pm
status: recorded
created: 2026-09-12
verdict: ADOPT
route: DOWN stages/L0-quickstart/template/.claude/hooks/lib/task-hygiene.js (+ the root copy) · UP library/practices/harness-engineering.md ("name the seam" gains a detection half)
---

# RVW-098 — a hook that reads a host primitive must be able to tell when the host stops offering it

## The claim
- **Source:** Claude Code CHANGELOG, 2.1.268 (fetched, panel-verified 3-0):
  https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md — *"Changed the task-tracking
  tools (TaskCreate/Get/Update/List, TodoWrite) to be offered only on Claude 3.x, Opus 4.0–4.7, Sonnet
  4.0–4.6, Haiku 4.5; set `CLAUDE_CODE_ENABLE_TODO_TOOLS=1` elsewhere."* Confirmed in the finding session's
  own toolbelt (Opus 5: no `TodoWrite`).
- **Core assertion:** BOSS's `task-hygiene` conscience moment (v0.293.0) reads only `TodoWrite` tool_use
  blocks from the transcript; on every current default model there are none, so the moment is permanently
  silent — and BOSS's practice for host primitives has a *design* test ("if this vanished tomorrow, what
  breaks?") and no *detection* rule, so nothing could notice.
- **Inbox file:** `docs/research/inbox/task-hygiene-reads-a-withdrawn-host-primitive.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. It *enforces* #3 (nothing valuable locked into code — here, locked into a host primitive) and the JIT-support line of #2. |
| 2 | Evidence grade | **Ground truth, not a claim** — host CHANGELOG fetched verbatim; local file read (`task-hygiene.js:99-113`, single input, no fallback; no `check:*` script inspects it; root copy identical). The strongest grade this rubric has. |
| 3 | Duplicate or sharpen? | **Sharpens.** `harness-engineering.md:119-138` already says *sit on a host primitive at a seam you could close by hand* and cites Ultraplan's removal as proof. It stops at design time. The missing half: **declare the primitive, and give something the means to see it gone.** The hook's own `HOST-VERSION-DEPENDENT, CHECKED 2026-09-10` block is the right shape and listed the wrong facts. |
| 4 | Who serves / harms? | Serves every cohort on v0.293.0+ — today they hold a promised mechanism (CHANGELOG, CLAUDE.md rule 3b) that cannot fire, which is [[dev-workspace-described-as-shipped]] in a new coat. Harms nobody; the moment fails open. **`first-product` is the one who would never notice** — they cannot tell a quiet keeper from an absent one. |
| 5 | Cost / ceremony | Net neutral. A `reads:` line in the hook header plus a sentence in the practice. The heavy version — a `check:host-primitives` gate that diffs declared primitives against the fetched CHANGELOG — is exactly the checker-for-a-moving-target BOSS keeps logging; **do not build that.** |

## Verdict: ADOPT
The claim is a verified fact about BOSS's own machine, not a stranger's advice, and it lands squarely on
a practice BOSS already holds and did not finish. The seam rule was right; a seam still needs a tripwire.
The decision *between* the three concrete responses is not this verdict's — two of them touch a founder's
host config.

## If ADOPT / ADAPT
- **What to do** → hand to `/boss-learn`:
  - **DOWN, the hook (both copies):** add the withdrawn-primitive fact to the dated header block, and make
    the moment say the true thing on a transcript with *zero* `TodoWrite` across a long session — which is
    "I can't see the list on this model," not silence. **Three ways to then close it, Ajesh's call:**
    (a) **retire** the TodoWrite read and keep only the file-mtime half (the durable-write side still
    works); (b) **opt back in** by writing `CLAUDE_CODE_ENABLE_TODO_TOOLS=1` into the template's settings
    `env` — a host key BOSS then owns and sweeps (the v0.218.0 cost, stated); (c) **wait** — leave it
    silent, note it in the CHANGELOG as known-vacuous on current models. (c) is the honest floor if nothing
    else ships today.
  - **UP, `harness-engineering.md` §"Don't author what the host ships":** one paragraph — *a hook that reads
    a host primitive names it in a dated header and states what it does when the primitive is absent; the
    design test ("what breaks?") is answered "nothing" for a fail-open moment, and that is precisely when
    it needs the tripwire, because nothing breaking is what going vacuous looks like.* Cite 2.1.268 as the
    second instance after Ultraplan.
  - **CHANGELOG line** for whichever ships; VERSION bump per rule 5.

## Attribution
**Verified.** Primary fetched and quoted verbatim by two skeptics. One correction to this session's own
phrasing: the entry names Opus 4.8 / Sonnet 4.7; the Claude 5 exclusion is by exhaustive list plus in-session
observation, not by name.

## Notes
- Prior related verdicts: [[RVW-044]] (host-native mechanisms), the Ultraplan removal cited in
  `harness-engineering.md`. Pattern: [[checkers-state-intents-they-dont-enforce]] — quietest flavour, a
  reader whose input source was removed upstream.
- Panel: 3-0 on the fact; the "Fable 5" wording downgraded (K5 in the session record).
- BOSS version when recorded: 0.314.0
