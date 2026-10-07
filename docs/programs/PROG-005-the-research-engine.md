---
id: PROG-005
type: program
owner: product-lead
status: active
created: 2026-10-06
graduated_from: research-engine
gist: Every way BOSS finds out what is true outside its own head — deep research, vetting, refreshes, competitive and market research, intake — rebuilt as one engine: a shared method founders and BOSS both read, per-domain front ends, and sources ranked by what has held up.
---

# PROG-005 — The research engine

**Graduated 2026-10-06**, the same day as its first member. Ajesh: *"this deep research engine can also
apply to competitive eval, market research as well… apply cross functional items but then have
customization where needed. Eventually this can be a program of 'Research Engine'"* — then: *"in a way
we are rethinking everything on how we do research externally… that means also renaming existing
skills and reengineering them. think of it as a major refactor."* The reasoning no single member holds
is the architecture below: what is shared, what each domain keeps, and where it lives.

**Members:** every record with `program: PROG-005` — `boss board PROG-005`. [[IDEA-155]] (the
inventory, ~40 improvements A–H, and the measurement that set the order). Related, not moved:
IDEA-016 (`/vet`), IDEA-042 (humane refresh), IDEA-054 (founder research toolkit), IDEA-066 (market
research — the founder-side trigger still holds), IDEA-086 (the three user-research doors).

## Why a refactor, not a polish

Five surfaces research today, built in five sessions for five reasons — three for BOSS curating itself,
two for a founder — and none was designed as part of a system ([[IDEA-155]] § baseline). The result,
measured 2026-10-06: the same method written five ways, eleven grading scales with no crosswalk,
sources ranked by fame with no date, and a track record that cannot be computed because claims are
not tied to sources in any readable way. Polishing each surface keeps the five copies. The refactor
writes the method **once**.

## The architecture

```
             library/practices/research.md      ← THE ENGINE (tracked, ships, `boss craft research`)
             the loop · the claim row · four axes · standing · page-is-data · what it refuses
                 │                                  library/practices/outside-claims.md ← the judge
     ┌───────────┼──────────────┬───────────────┐   (already shipped, v0.237.0 split of /vet)
  BOSS's own     │           founder-facing     │
  finder ─ judge ─ refresh   rivals · market · intake
  (internal skills,           (shipped skills — thin front ends that cite the engine
   thin front ends)            for the shared steps and keep only their domain's own)
```

**Rules every change carries**

- **The method lives in one tracked file.** A skill restates nothing the engine says; it cites the
  step and adds what is genuinely its domain's. A second copy of "fetch the primary" is a bug.
- **BOSS reads what it ships.** BOSS's own research follows `library/practices/research.md` exactly as
  a founder's would — dogfood, and the reason the engine is not in the gitignored workspace. (The
  internal skills are single-copy and untracked; refactoring them in place is the shape of both
  recorded losses. The method moves to git first; the skills shrink after.)
- **Four axes, never blended:** what kind of source · was it read · did the claim survive · does it fit
  you. A fifth thing — what a *person* did — keeps its own ladder (EVID). No single score.
- **Standing is earned by verification, not fame**, counted forward from claim rows; rank decides where
  to look first, never what to believe.
- **Compose and subtract.** A rename that merges two verbs is the goal; a new verb needs a founder who
  hit the wall (EVID-001). Renames ship with a `registry/supersedes.json` row, so `boss sync` says why.
- **Find ≠ judge ≠ route.** The finder never argues adoption; the judge defaults to NO; routing is
  `/extract`'s. The refactor keeps those seams even where it merges files.

## The skill map — today → proposed

| Today | Kind | Proposed | Why |
|---|---|---|---|
| `/deep-research` | internal finder | **renamed** (name: open Q1) | thin: domain + since + the engine's loop |
| `/vet` | internal judge | `/vet` (kept) | the name works; skeleton gets the claim rows + `sources:` |
| `/practice-refresh` · `/humane-refresh` · `/recalibrate` | internal refresh ×3 | **one `/refresh <domain>`** (open Q2) | the same loop three ways, with different buckets |
| `/comp-eval` | shipped, MVP | **renamed and widened** (open Q3) | rivals is one view of the market; sizing / why-now / pricing join it behind IDEA-066's trigger |
| `/import` | shipped, L0 | `/import` (kept) | intake, not research; cites the engine for source rules |
| `outside-claims` | shipped practice | kept, linked as the judge | already the founder half of `/vet` |
| `/persona` enrich · `/canvas` sharpen | shipped | cite the engine | web research gets a URL and a date (F2) |

## Phases

- [x] **P0 · Inventory and measure** — [[IDEA-155]]: two read passes, ~40 improvements, the
  track-record measurement (not computable; the claim row comes first). Hygiene G1–G2 done.
- [x] **P1 · The engine, written once** (2026-10-06) — `library/practices/research.md`: the loop, the claim row
  (A3), the four axes + crosswalk (A2), standing (B1–B4), page-is-data (A5). Ships as
  `boss craft research`.
- [ ] **P2 · BOSS's own surfaces on the engine** — rename the finder, merge the three refreshes, `/vet`'s
  skeleton (G3–G5 land here), session template = claim rows; source list gains dates and standing
  (B5); a generated research index (C1); ids not paths (C2).
- [ ] **P3 · The founder surfaces on the engine** — rename and widen `/comp-eval`, `/persona` and
  `/canvas` cite it, mentors cite with dates (F1–F3). Supersedes rows for every rename.
- [ ] **P4 · Review the four** — `/deep-research`, `/vet`, `/comp-eval`, `/import` against the built
  engine (IDEA-155 § H), and which market-research items it makes cheap.

## Open questions

- **Q1 · The finder's name.** `/research` is taken in the supersedes ledger (retired into `/evidence`,
  v0.324.0) — reusing it would tell a syncing founder two different things.
- **Q2 · One `/refresh <domain>`, or keep three?** One file with domain sections vs three thin skills
  over the engine.
- **Q3 · `/comp-eval`'s new name and scope** — widen to the market now (rivals as the first view) or
  rename only, and widen when IDEA-066's trigger fires?
- **Q4 · Tracking the internal skills.** `/.claude/` is gitignored wholesale. With the method in
  `library/`, what is left in each skill is thin — track it (`!/.claude/skills/<name>/`, passes the
  *"fine public forever?"* test) or keep it local?
