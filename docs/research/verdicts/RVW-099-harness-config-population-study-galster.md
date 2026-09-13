---
id: RVW-099
type: verdict
owner: pm
status: recorded
created: 2026-09-12
verdict: NOT-YET
route: n/a
---

# RVW-099 — "almost nobody adopts Skills/Subagents, and the Skills that exist are prose" (Galster et al., 2,853 repos)

## The claim
- **Source:** Galster, Mohsenimofidi, Lulla, Abubakar, Treude, Baltes — *Harness Engineering for Agentic AI
  Coding Tools: An Exploratory Study*, arXiv 2602.14690 (2026-02-16, final 2026-06-30).
  https://arxiv.org/abs/2602.14690 — fetched (abstract), panel-verified 4/4 findings.
- **Core assertion:** across 2,853 public GitHub repos and five tools, context files dominate and are often
  the sole mechanism; AGENTS.md is emerging as the interoperable standard; few repos adopt Skills or
  Subagents; Skills predominantly carry static instructions rather than executable scripts. The
  load-bearing half for BOSS: **a founder arriving from a normal repo has seen a CLAUDE.md and nothing
  else, and BOSS hands them 45 skills.**
- **Inbox file:** `docs/research/inbox/harness-config-empirical-galster-2026.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. If anything it is the *premise* of #2 (JIT support) — most people under-configure. |
| 2 | Evidence grade | **Pattern-with-data**, population-scale, multi-tool; arXiv, final version June 2026, venue not confirmed. Sample = public GitHub, which under-counts solo/private work (the population BOSS serves). Measures *adoption*, not *efficacy* — nothing here says skills fail, only that few have them. **Not** the first such study (2511.09268 mined 328 CLAUDE.md files in Nov 2025) — the inbox file's "first" was killed by the panel. |
| 3 | Duplicate or sharpen? | **Neither, yet.** BOSS already ships `AGENTS.md` (finding 1 confirms a choice made). Finding (3) was measured locally: **48 shipped skills, 0 executable scripts** — the extras are markdown/HTML templates; BOSS's executable half is its hooks. That is a *fact about BOSS*, consistent with the population, and it does not by itself say the ratio is wrong. |
| 4 | Who serves / harms? | The uncomfortable reading serves `first-product` and `vibe-coder-newbie` (they are the "seen only a CLAUDE.md" arrivals). The self-serving reading ("early looks like this") serves BOSS. Neither reading harms a cohort; adopting the comfortable one *unexamined* harms BOSS's honesty about itself. |
| 5 | Cost / ceremony | Nothing to adopt has been named — a verdict here would be adopting a *mood*. The one action the paper licenses is a measurement BOSS already holds the instrument for. |

## Verdict: NOT-YET
The data is real and verified; what it changes about BOSS is not yet a practice, it is a number nobody has
produced. Same re-open condition as the parked tool-surface item, on purpose — one measurement answers
both. Recording the local count (48 / 0 executable) so the next reader starts from a fact.

## If REJECT / NOT-YET
- **Why not:** an adoption survey of public repos cannot, on its own, tell BOSS whether its surface is too
  large or merely early; and "the comfortable reading" must not enter without the number.
- **Re-open condition:** `/skill-doctor` run in a scaffolded MVP project (Ajesh's run) — *what is loaded
  and unused, at what context cost.* If the loaded set is small and disclosure works, this and the
  tool-surface item both close REJECT with the number written down. If it is large, both become one
  practice question about a *measured* gap. Second trigger: a real founder's session showing skills unused
  (observed-behaviour grade, not stated).

## Re-open condition met 2026-09-12 — the number exists; the verdict holds
`/skill-doctor` in a fresh MVP scaffold: all 45 descriptions resident (~4.7k tokens/turn); on this machine,
ever, 10 of 45 invoked. Filed under [[RVW-102]]. The loaded set is large, so this stays **NOT-YET on its
own claim** — an adoption survey still cannot say whether BOSS's surface is too big or merely early — and
the practice question it pointed at is answered in RVW-102, not here. Second trigger (a real founder's
session showing skills unused) is still the one that would move this.

## Attribution
**Verified** (title, authors, repo count, five tools, all four findings — panel 3-0). One overclaim in the
inbox framing killed ("first population-level measurement").

## Notes
- Prior related verdicts: none direct; `SESSION-2026-09-08-harness-and-host-since-august.md` C5/C6.
- Companion parked item: `docs/research/inbox/tool-surface-economy-has-no-practice.md` (deliberately
  unvetted — RESUME.md).
- BOSS version when recorded: 0.314.0
