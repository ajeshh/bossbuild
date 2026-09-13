---
id: RVW-103
type: verdict
owner: pm
status: recorded
created: 2026-09-13
verdict: ADAPT
route: DOWN stages/L0-quickstart/template/.claude/skills/persona/SKILL.md (two lines on the record) · render half already shipped (FEAT-036)
sources:
  - https://www.nngroup.com/articles/persona/ — "Personas Make Users Memorable", Taylor Dykes, NN/g, 2025-10-03 (verified at source)
  - https://cleverx.com/blog/persona-planning-how-to-design-actionable-personas-for-2026-and-beyond/ — CleverX Team, 2026-01-07 (vendor blog; research-services seller; statistics unsourced)
  - https://figr.design/blog/user-persona — no author, Figr, 2026-08-23 (vendor blog; AI design-tool seller; cites NN/g and others without links)
---

# RVW-103 — BOSS's six-field persona is thin against the craft: add the classic card's fields

## The claim
- **Source:** three pages Ajesh handed over 2026-09-13 plus one example image (photo · name ·
  About with age/income/home/tech · needs · motivation · four slider bars · a quote · a stat tile ·
  pains). Inbox: `docs/research/inbox/persona-record-is-thin-against-the-craft.md`.
- **Core assertion:** a persona should carry a name and a face, quotes, demographics, goals,
  behaviours and channels, a scenario, and be measurably *in use* — and `/persona`'s six fields
  (`who · context · jobs · pains · values · what we don't know`) plus a ledger are missing most of
  that.

## Attribution
- **NN/g — verified.** Taylor Dykes, 2025-10-03. The page lists *"Name, age, gender, and a photo"*,
  a tag line, experience level, context, goals and concerns, and *"Quotes to sum up the persona's
  attitude"*, and says of name and photo: *"their function is to aid memorability, which is the
  primary job of a persona."* It calls personas living documents to validate over time.
- **CleverX — a vendor blog, read as such.** No individual author. Eight components (demographics
  through *information sources and trust signals*); *"2–3 direct quotes"*; stock photos dismissed;
  demographics *"table stakes: necessary but not sufficient."* Its three statistics (10–30% funnel
  lift, 20% faster sales cycles, 15% marketing efficiency) carry **no source** — discarded.
- **Figr — a vendor blog, read as such.** No author. Five fields (name and role · context and goals ·
  frustrations · key quotes *"real language from research, used sparingly"* · decision style);
  *"Cut the decorative fields"*; demographics only *"if they affect the workflow or decision"*;
  **rejects proto-personas** built on assumption (*"the persona will mirror whoever spoke most
  confidently in the room"*). Cites NN/g and others without links; ranges, not findings.

So one primary practitioner source and two vendor pages that disagree with each other on
demographics and agree on quotes-from-research and against stock photos.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | Per field. A generated face or a quote nobody said fails #6 (the humane lens) and DEC-008 — a fabricated `EVID` wearing a card. A real photo by the person's choice and a quote **from an EVID** contradict nothing. |
| 2 | Evidence grade | NN/g: a respected practitioner, verified. CleverX/Figr: vendor pages, n=0 data, unsourced numbers. The load-bearing point (name + face aid memorability) is NN/g's; the *evidence-first* point is where all three agree. |
| 3 | Duplicate or sharpen? | Mostly duplicate: `who` carries situational demographics (Figr's rule, on purpose — *"the situation, not demographics"*); `context` is the scenario; `jobs · pains · values` cover NN/g's goals-and-concerns; `what we don't know` **is** the interview guide; the ledger answers Figr's proto-persona objection better than Figr does (RVW-093: BOSS is ahead of the 2026 wave). Sharpens on two fields only: a **photo** (a real file, by choice) and a **quote** (only from an EVID). |
| 4 | Who serves / harms? | A face and a quote serve `non-tech-founder` and `first-product` (a persona they *remember*); a generated face or an invented quote harms the same cohorts most — a synthetic persona that looks finished lies better. Sliders and stat tiles with no measure behind them harm everyone (decoration read as data). |
| 5 | Cost / ceremony | Two optional lines on the record: net neutral. Eight CleverX components: heavier, and pre-evidence they would all be guesses. |

## Verdict: ADAPT
Adopt the one thing NN/g is right about and BOSS lacked — a persona is *remembered* by a name and a
face — in the only honest form: a **`photo:` line that points at a real file or stays `unknown`**,
never a generated face (the render half shipped in FEAT-036: no file, no face). Adopt a **`quote:`
line gated on evidence** — the words of a real person from an `EVID`, cited by id, written by
`/persona enrich`, never at `derive` (at 100% synthetic there is nobody to quote). Reject the rest:
demographics stay in `who` (Figr and BOSS agree; NN/g's *age, gender, occupation* enter through
`who` when they matter), goals/scenario/actionability are already the six fields, and bars, tiles
and *motivation* sliders have no measure to draw from before `/interview` has run.

## If ADOPT / ADAPT
- **What to do:** two lines on `/persona`'s record shape — `photo: unknown` (a file beside the
  persona, the founder's choice; never generated) and `quote:` (only via `enrich`, only from an
  EVID, with the id). Route DOWN into the persona skill. The Design space's persona card and the
  playbook snippet already render `photo:` (FEAT-036); the card renders `quote:` when present.
- **Modified from the claim:** no demographics block, no sliders, no stat tiles, no quote at
  derive-time; the photo is real or absent.
- **`/extract` not invoked** — the destination is the record's own skill and the ask is the
  founder's (2026-09-13); recorded here so the routing check is visible rather than skipped silently.

## If REJECT / NOT-YET (the other fields)
- **Demographics field — REJECT:** duplicate of `who`; the sharper vendor page agrees.
- **Goals · scenario · actionability — REJECT:** duplicates of `jobs`/`context`/`consult` and the
  *what we don't know* block.
- **Behaviours and channels · decision style — NOT-YET:** honest only from evidence or `/measure`;
  re-open when a project's persona ledger reads real ≥ 50% and `/measure` has events.
- **Sliders and stat tiles — REJECT:** a measure with no source is decoration; the prototype's bars
  were rank, not data, and still read as data.

## Notes
- Prior related verdicts: RVW-093 (synthetic users — BOSS's ledger framing is ahead of the wave);
  RVW-015 (AI-moderated interviews).
- Ajesh's ruling stands: Priya is a proto-persona and stays; the ledger says so on the page.
- BOSS version when recorded: 0.325.0 (under `## Unreleased`).
