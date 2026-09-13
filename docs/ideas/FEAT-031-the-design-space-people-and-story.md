---
id: FEAT-031
type: feature
owner: designer
status: building
gist: `boss design` gains the UX half — People (every persona as a full card with its ledger), The journey (the stages from JOURNEY.md with their source labels, the gaps named) and Research (the evidence cut by rung and by method, with the holes for what has never been tried) — so the page opens with who it is for before it shows a colour.
for: the same founder as FEAT-030, and the designer who needs the person before the palette
created: 2026-09-13
building_since: 2026-09-13
from: IDEA-107
program: design-system
relates: FEAT-030, FEAT-027, IDEA-106
---

# The design space, slice 2 — the people and the story

> Slice 2 of the plan in [FEAT-030](FEAT-030-the-design-space-render.md). Closes when the three
> chapters render from the files that exist and hole honestly when they don't. The playbook's
> Customers chapter shows the snippet and links here (FEAT-027 / FEAT-028, the peer lane).

## Goal
Open `boss design` and meet the person before the palette: the personas in full, the journey with
every stage labelled observed / said / assumed and the gaps between flows named, and the research
ledger cut two ways — by rung (observed · stated · inferred) and by method — with a dashed slot for
every method never used.

## Assumptions (the plan-time record)
- **Assumed:** the persona record is what `/persona` writes — `who`, `context`, `jobs`, `pains`, `values`, *what we DON'T know yet*, the ledger line — read tolerantly (a field line, or a label followed by bullets); a field that isn't there is a hole on the card, never a guess → _confirmed / corrected to: …_
- **Assumed:** the journey is `docs/product/JOURNEY.md`'s table as `/spec` writes it (Stage · trying to do · meets · serving flow · where they leave · Source) plus `## The gaps`; a stage with no source label renders *unlabelled* in amber — the failure mode the template warns about, made visible → _confirmed / corrected to: …_
- **Assumed:** "by method" reads the EVID `method:` field (`interview | observation | pretotype | metric | commitment-test`) and the presence of `docs/competition/README.md` (desk) and `docs/design/ux-check-*.md` (heuristic review); methods with no record render as holes with the verb → _confirmed / corrected to: …_
- **Assumed:** rung is the EVID `grade:` (stated-pain → *stated*, observed-behavior → *observed*, commitment → *observed*) and *inferred* is the persona's synthetic share — nothing else is graded → _confirmed / corrected to: …_
- **Assumed:** the evening-by-moments story (prototype v3) is NOT rendered — it was hand-written; no record holds a moment-by-moment day. The persona's `context` line renders as the day, and that is honest → _confirmed / corrected to: …_
- **Assumed:** evidence quotes are never rendered — grades, dates, methods and the assumption phrase only (the FEAT-026 rule for a shareable copy applies from the start here) → _confirmed / corrected to: …_

**Still unknown (didn't guess):**
- Whether `/persona` ever writes `role: primary` — the playbook reader checks `role|kind|primary`; the first file in date order is primary otherwise.

## Acceptance criteria
- [x] People renders every `docs/personas/*.md` as a card: name, `who`, `context` as the day, `jobs` / `pains` / `values` as lists, *what we don't know yet*, the `synthetic N% · real N%` chip; a missing field is a hole on the card.
- [x] No personas → one hole with the verb; the playbook's snippet target ids (`#persona-<slug>`) are stable.
- [x] The journey renders `JOURNEY.md`'s stages with the Source column as a chip (`observed` · `said` · `assumed` · *unlabelled* in amber) and `## The gaps` as its own block; no file → a hole with the verb.
- [x] Research renders the EVID ledger by rung (counts and newest date; grades and dates only, never quotes) and by method (the five `method:` values plus desk and heuristic review, each *used N* or a hole with its verb).
- [x] The rail gains *People* and *The journey* under *Why it looks like this* and *Research* under *Kept honest*; the ledger counts nine slots.
- [x] Tests cover: a persona with list fields, one with a missing field, the ledger chip; a journey with an unlabelled row; evidence by method; all three holes.

## What "wrong" looks like
- A persona field invented from another field (a `who` line pressed into service as `context`).
- A quote from an EVID on the page.
- An `assumed` stage rendered without its label — the journey pretending to be research.
- A method counted because a file exists whose name merely contains the word.

## Paths that must not break
- **Destructive path:** still exactly one file under `.boss/`; a test asserts nothing under `docs/` changes.

## Smoke check
- `node --test test/design.test.js`; by hand: the `/tmp` scaffold with two personas, a journey with one unlabelled row, three EVIDs of two methods.

## Validated learning
- **Learning hypothesis:** a founder who sees *0 observed · 3 stated* beside their own personas goes and watches one person before they draw another screen.
- **What result would change the plan:** the Research chapter is the one nobody scrolls to. Then it moves up, or the chips on the blocks are enough.

## Log
- 2026-09-13 — specced from FEAT-030's slice table. `method:` already exists on the EVID record — by-method is a read, not a field.
- 2026-09-13 — **landed** (under Unreleased). Fourteen design tests. Surprise: the persona parser first took `- who does the rota when she is away?` as a `who` label — a label needs a separator, not the word; the test that caught it is the one with two bullets under *what we don't know yet*.
