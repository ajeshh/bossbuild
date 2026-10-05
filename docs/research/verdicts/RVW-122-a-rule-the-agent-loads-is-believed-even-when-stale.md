---
id: RVW-122
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: ADAPT
route: DOWN stages/L1-mvp design-tokens-init (the CLAUDE.md block it writes) — subtraction
sources:
  - a design lead's governance essay on a design-system vendor's blog, 2026-09 (docs/research/sessions/SESSION-2026-10-05-design-system-reading.md, gitignored)
---

# RVW-122 — governance moved into the instruction file, and the agent believes it even when it's stale

> **Revised the same day.** First recorded as REJECT ("BOSS reads the rule from the source at the
> write"). That holds for the guards. Reading the CLAUDE.md block `/design-tokens-init` writes, for
> RVW-124, turned up **two copied rules in it that nothing keeps true**. The essay's failure is in
> BOSS's own shipped text.

## The claim
- **Source:** a design lead with a long systems background.
- **Core assertion:** governance used to be advisory, and a human reviewer routed around stale
  rules. An agent has only what's in its context. An unwritten rule doesn't exist for it, and **a
  stale rule is followed with total confidence**. Example: the token file deprecates and aliases a
  token, but the instruction file still names the old one, so the agent uses it. Give the file an
  owner and a review date, write the reason beside each rule, and split it by concern.
- **Inbox file:** `~/Projects/inbox/bossbuild/Wrong, but never in doubt…pdf`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | Practitioner argument with one illustrative case. The side claim about which agent hosts read a cross-tool instruction file natively was **not verified** and is not used. **The finding below was verified in BOSS's tree**, which counts for more than the essay. |
| 3 | Duplicate or sharpen? | **The guards duplicate it; the CLAUDE.md block doesn't.** The guards read at the write: `design-tokens-guard` reads `## Deprecated` and `$deprecated` and names the successor (v0.310.0), which is the essay's example with no copy. **But `/design-tokens-init` step 1 writes a block into the project's CLAUDE.md that copies:** (a) a **semantic → primitive value map** (*"the AI reads this without opening another file"*), and nothing in `src/` or `stages/` ever rewrites it (grep 2026-10-05: zero writers besides the init), so the first retheme makes it lie; (b) *"Search `src/components/` for similar patterns first"*, which is **the very instruction `design-system.md` says the component index replaced** (*"the prompt convention 'search components/ for similar' is the filter this replaces"*), while line 5 of the same block says to open `COMPONENTS.md`; (c) *"three-layer design tokens"* (RVW-117). |
| 4 | Who serves / harms? | It harms every UI-building founder after their first retheme or rename. The agent reads the copy before the source. |
| 5 | Cost / ceremony | **Lighter.** The fix deletes text. |

## Verdict: ADAPT
The diagnosis is right, and BOSS's guards are the better cure. But BOSS ships a copy of its own rules
into an instruction file with nothing to keep it true, which is the exact pattern the essay warns
about. The cure is the one BOSS already chose for the guards: **point at the source, don't copy
it.** Leave out the essay's owner, review date and rule-by-rule rationale for the instruction file:
a founder project's CLAUDE.md is not a governed document, and the reasons already live in the style
guide.

## If ADOPT / ADAPT
- **What to do (DOWN, `/design-tokens-init` step 1):**
  1. **Drop the value column** from the semantic → primitive map. Keep the semantic names (they
     change by DEC, rarely) and say *"values live in `docs/design/tokens.json`; read them there."*
  2. **Replace** *"Search `src/components/` for similar patterns first"* with the line already
     below it: *open `docs/design/COMPONENTS.md` before creating a component*. One instruction, not two.
  3. *"Three-layer"* → RVW-117's wording.
  → The CHANGELOG bullet a founder would feel: *the design block BOSS writes into CLAUDE.md no
  longer copies values that go stale on a retheme.* **Open question:** existing projects won't get
  this automatically. `/boss-sync` rewrites only the text between the `<!-- boss:<mode> -->`
  markers, and the init writes this block outside them. Decide whether `/boss-sync` names the
  stale block in one line, or new projects simply start right.

## Attribution
The essay's argument is the author's own. The second-hand anecdote it cites and the host claim
were not verified and are not used.

## Notes
- Prior related verdicts: RVW-078 (retrieval beats instruction), RVW-117, RVW-124.
- Outcome (2026-10-05): landed DOWN. The CLAUDE.md block lists semantic names with what each is for, not values, and says the values live in `tokens.json`. The "search src/components/" line is replaced by the index. The open question about existing projects stands.
- Open question closed (2026-10-05, Ajesh: "following whatever recommendation"): `/boss-sync` names the old block, it doesn't rewrite it. `boss sync` already flags *you already have a design token system* when the skill changes. The CHANGELOG bullet tells `/boss-sync` the CLAUDE.md block is part of that artifact and to offer the swap as one edit, and the ladder entry's `alsoLookFor` says the same at `/design-tokens-init`'s step 0. Founder text outside BOSS's markers is still never rewritten unasked.
- BOSS version when recorded: 0.329.0
