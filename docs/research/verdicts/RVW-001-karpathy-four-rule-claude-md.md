---
id: RVW-001
type: verdict
owner: product-lead
status: recorded
created: 2026-06-02
verdict: REJECT
route: n/a
---

# RVW-001 — the four-rule CLAUDE.md ("Karpathy's CLAUDE.md" / forrest chang's file)

## The claim
- **Source:** Reddit post + comments, via Ajesh (forrest chang's ~70-line CLAUDE.md, ~220k combined
  GitHub stars).
- **Core assertion:** *You should put these four rules in your CLAUDE.md — (1) Ask, don't assume;
  (2) Simplest solution first / no unrequested abstractions; (3) Don't touch unrelated code; (4) Flag
  uncertainty explicitly — because Claude Code starts every session cold, makes wrong assumptions, and
  barrels ahead over-refactoring things that weren't broken.*
- **Inbox file:** `docs/research/inbox/karpathy-claude-md-four-rules.md`

> One claim per run. The load-bearing claim is **adopting the four-rule file**. Two other claims in
> the thread (slaorta's modular-docs / 3-recent-updates pattern; the Almanac plug) are deferred to
> their own runs — see Notes.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **No** — the opposite. Rule 2 *is* PRINCIPLE #2 (JIT, no premature ceremony) applied to code; rule 3 *is* CLAUDE.md working-rule #7 (small reversible steps, one concern); rules 1 & 4 *are* the conscience + the honest-verdict discipline (`/extract`, `/drift-deep`, `/vet` all say "verdict is honest, not kind"). |
| 2 | Evidence grade | **Popular anecdote, actively disputed by experienced practitioners.** 220k stars measures *resonance/virality*, not *outcomes*. Karpathy named the failure modes; he didn't bless the 70-line file. The thread's own comments (johann, Hyperion, StokeJar) dispute it for non-beginners. Not pattern-with-data; not a practitioner endorsement of *the file*. |
| 3 | Duplicate or sharpen? | **Duplicate** — BOSS already encodes all four, more deeply: as *principles + the cohort-aware conscience*, not a static block. Nothing here sharpens BOSS-the-product. |
| 4 | Who serves / harms? | **Cohort-split, and the thread proves it.** Serves `first-product` / `vibe-coder-newbie` / `non-tech-founder` (Hyperion: "good when you're starting out"). Annoys `eng-builder` / `vibe-virtuoso` / `returning-founder` (johann: "would slow me way down… asks questions it knows the answer to… I want the *best* solution, not the simplest"). A *blanket* static file helps one half of BOSS's cohorts and degrades the other half. |
| 5 | Cost / ceremony | **Net heavier over time — frozen ceremony.** StokeJar names it exactly: hardcoded behavior overrides rot as models/harness change, then *fight* a better model (4.8 already asks, pushes back, flags uncertainty natively — so rules 1 & 4 are redundant-to-harmful on it). That's R&H #1 (BOSS imposes stale ceremony) **and** the exact thesis of IDEA-014. |

## Verdict: REJECT

BOSS already does all four — as *principles and behaviors* (PRINCIPLE #2, working-rule #7, the
cohort-aware conscience, the honest-verdict rules), not as a static rules block. Adopting the file
for BOSS would be a duplicate that **regresses** toward the frozen-rules brittleness the thread's own
sharpest critique (StokeJar) names — and that BOSS has deliberately bet *against* (IDEA-014: model
recalibration as a standing discipline). The four rules are the *non-cohort-aware, non-recalibrated*
version of things BOSS built on purpose. A skim says "four sensible rules, add them"; the honest read
is "we already do this, better, and freezing it would undo two of our deliberate bets."

## If REJECT / NOT-YET
- **Why not:** duplicate of existing BOSS principles + the cohort-aware conscience (rubric #3), and a
  static-rules-file adoption fights both cohort-awareness (#4) and the model-recalibration discipline
  (#5 / IDEA-014). Popularity ≠ evidence (#2).

## Two findings worth keeping (the value that *wasn't* the headline claim)

1. **Independent third-party confirmation of IDEA-014.** StokeJar — a stranger with zero knowledge of
   BOSS — arrived at BOSS's own thesis: hardcoded model-behavior overrides are brittle *because the
   model/harness curve moves* ("Opus 4.6 didn't ask enough; 4.8 asks too many"), and the right move is
   to *recalibrate per model*, not freeze rules. This is **evidence for a bet BOSS already placed** —
   it strengthens IDEA-014's riskiest assumption ("is recalibration valuable enough to deserve
   standing machinery?"). A 220k-star thread whose top skeptical comment is *exactly* the recalibration
   argument is real demand signal. **Recommend: cite this thread as external evidence in IDEA-014.**
   (This is the rare case where vetting a REJECT surfaced confirmation of an existing bet.)

2. **A deferred founder-facing ADAPT candidate.** When BOSS ships the founder-facing version (the
   deferred UP candidate, IDEA-016 / the cohort-aware-conscience precedent), the *scaffolded project's*
   CLAUDE.md template could offer a **cohort-aware** version of these four rules — the full set for
   `first-product`/`vibe-coder-newbie`, trimmed-or-off for `eng-builder`/`vibe-virtuoso`. That's the
   cohort-aware pattern applied to the founder's own CLAUDE.md. **NOT-YET** — gated on the
   founder-facing build; logged here so it resurfaces when that lands.

## Notes
- Prior related verdicts: none (this is RVW-001).
- Deferred separate-run claims from the same source: slaorta's **modular-docs / "3 most recent
  updates, archive the rest"** pattern — *mildly* interesting for BOSS's own growing `CLAUDE.md` and
  `RESUME.md`; worth its own `/vet` if Ajesh wants. The Almanac self-updating-wiki plug — ignore
  (vendor plug, n=0).
- BOSS version when recorded: 0.40.0
