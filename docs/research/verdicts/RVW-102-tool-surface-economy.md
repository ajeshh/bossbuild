---
id: RVW-102
type: verdict
owner: pm
status: recorded
created: 2026-09-12
verdict: ADAPT
route: UP library/practices/context-discipline.md (a "context-as-tool-surface" move; no new file) · DOWN scripts/check-manifests.js (the ` #` gate, shipped v0.318.0)
---

# RVW-102 — BOSS has no practice for the size of the surface it ships, and the surface is fully resident

## The claim
- **Source:** BOSS's own shelf measured against a fetched primary (Anthropic, *Effective context engineering
  for AI agents*, 2025-09-29 — *"the smallest set of high-signal tokens"*, avoid *"bloated tool sets"*),
  then against the host's instrument. **Deliberately unvetted since 2026-09-08** until `/skill-doctor`
  had been run; run 2026-09-12 in a fresh `boss new` + `boss unlock mvp` scaffold. Output filed:
  `docs/research/sessions/SKILL-DOCTOR-2026-09-12-mvp-scaffold.txt`.
- **Core assertion:** `context-discipline.md` is thorough about context-as-tokens and silent about
  context-as-tool-surface; BOSS ships 45 skills at MVP and has no discipline for reasoning about that.
- **Inbox file:** `docs/research/inbox/tool-surface-economy-has-no-practice.md`

## The number (what the verdict was waiting for)
- **All 45 descriptions are resident on every turn.** The host's own count: ~70–130 tokens each,
  **~4.7k tokens per turn** at MVP. Bodies (~118k tokens) load only on invoke. So the inbox file's
  counter-argument — *"the 45 are never simultaneously resident, so the doctrine may not apply"* —
  is **half-true**: bodies disclose progressively; the tool *list* does not. The doctrine applies to
  the list.
- **Usage, this machine, all history: 10 of 45 ever invoked; 35 never.** `close` 59× · `smoke` 59× ·
  `log` 18× · `ux-check` 9× · `boss-learn` 4× · `boss` 2× · `canvas`, `welcome`, `boss-sync`,
  `comp-eval` 1× each. ⚠️ n=1 machine, and the project on it is **BOSS building BOSS** — a meta-project
  with no customers, so `/money`, `/onboard`, `/landing`, `/trust`, `/health` structurally cannot fire
  here. "Never invoked on this machine" is not "useless"; it is the first usage data BOSS has ever had.
- **A defect the instrument found that reading did not:** `/extract` listed at `< 20` tokens — its
  description said `PRINCIPLE #1`, and ` #` opens a YAML comment, so the host had been truncating it
  at "PRINCIPLE" for as long as the line existed. `/health` carried `the #1 way startups die` the same
  way until the v0.316.0 rewrite removed it by accident. → gate added to `check:manifests` (DOWN).

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. It is #2 (JIT support) pointed at the one surface BOSS never measured. |
| 2 | Evidence grade | Primary doctrine fetched + **the host's own measurement of BOSS's own scaffold.** Usage half is n=1 and self-referential; the residency half is a fact about the host. |
| 3 | Duplicate or sharpen? | **Sharpens.** `context-discipline.md` move #1 already budgets CLAUDE.md by the same logic (*every line is read on every turn*); the skill listing is the same bill and was never on it. The cap (`DESCRIPTION_CAP`, v0.258.0 → 420 B v0.316.0) is the *mechanism*; the practice never said why. |
| 4 | Who serves / harms? | Serves every founder — 4.7k tokens a turn is their budget. The harm is on the *other* side: a "cut what's unused" rule fed by n=1 dogfood data would remove the post-launch verbs first, which is exactly backwards for the founder who reaches launch. |
| 5 | Cost / ceremony | One section in an existing practice; the gate is three lines. No new file, no new skill, no new count to game. |

## Verdict: ADAPT
Adopt the *discipline*, refuse the *mandate*. The practice gains a move — **the tool list is always-on
context; budget each line, measure the list with the host's instrument, and judge the count by
distinguishability and observed use, never by the count itself.** It does **not** say "45 is too many"
and it does **not** license cutting the 35: the only usage data is BOSS building BOSS, and the mandate
BOSS already holds (compose and subtract) needs a founder's session, not this one, to point at a verb.

## If ADOPT / ADAPT
- **UP:** `context-discipline.md` gains "3. Budget the tool list, not just the prose" — resident vs
  on-invoke; the cap and where it lives; `/skill-doctor` as the instrument; the two questions that
  decide a cut (can the model tell it from its neighbour? has anyone ever reached for it?) and the one
  that must not (is the count large?). Clock not moved.
- **DOWN:** the ` #` gate in `check:manifests` + its test twin (shipped v0.318.0). `/extract`'s
  description fixed.
- **What's modified from the inbox claim:** the claim ended *"BOSS's largest shipped artifact is the one
  thing its context practice cannot score."* It can now — and scoring it is not the same as cutting it.

## Attribution
**Verified** — doctrine fetched 2026-09-08; instrument run 2026-09-12, output filed verbatim.

## Notes
- Closes the re-open condition of [[RVW-099]] (Galster) the same way: "the loaded set is large" —
  RVW-099 stays NOT-YET on its *own* claim (adoption ≠ efficacy) but its number now exists.
- Related decision waiting: IDEA-101's `/boss-learn` → `/extract` — the number supports it
  (`boss-learn` 4× on the only machine where UP works; `extract` 0×).
- BOSS version when recorded: 0.317.0
