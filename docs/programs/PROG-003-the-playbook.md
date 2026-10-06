---
id: PROG-003
type: program
owner: product-lead
status: active
created: 2026-10-05
graduated_from: business-profile
gist: The founder's records, drawn as pages they can read, present and share — the playbook, its deck, the intake doors that fill it, the Kettlewick showcase and the one home that lists them. Never a document the founder sits down and writes.
---

# PROG-003 — The playbook

**Graduated 2026-10-05** from the slug `business-profile`, by IDEA-145's rules E3 and E1: the rule every
chapter keeps lived in a dated RESUME bullet about one shipped FEAT, and RESUME is a briefing that gets
trimmed, not a home for rules.

**Members:** every record with `program: PROG-003` — `boss board PROG-003` shows them by column.
FEAT-025 (the profile's rungs) → FEAT-026…029 (page, Pitch, Proof, deck) → FEAT-035 (intake doors) →
FEAT-036 (Company) → FEAT-039 (Kettlewick) → IDEA-144 (the home) · open: IDEA-134 (content, chapter by
chapter), IDEA-140 (export one slide, or a hand-picked set).

## Rules every playbook change keeps

- **A new chapter or record type adds its demo record in the same commit.** Kettlewick
  (`demo/kettlewick/`) is rendered by the real renderers; `npm run check:demo` goes red on a hole.
  (Was RESUME's *Showcase* bullet, 2026-09-13 — moved here 2026-10-05.)
- **A page is a read of the files.** Output to `.boss/<page>.html`; re-run the command to refresh;
  nothing to maintain. A CLI render, not a skill — it composes nothing.
- **Never invent.** A missing record is a hole on the page and a question `boss playbook --questions`
  prints with the verb that fills it. Notice passively, write explicitly (FEAT-035).
- **Brand from `docs/BRAND.md`**, per-field neutral fallback; one shell for every space
  (`src/page-shell.js`), one home that lists them (`.boss/index.html`, IDEA-144).

## Tasks — too small to ship alone

- [ ] **T1** · The competition matrix over decided features — trigger: three FEATs and two rivals with
  `## How they do it` (was in `.claude/rules/feature-context.md`).
- [ ] **T2** · `docs/product/JOURNEY.md` — `/spec` creates it on the first flow; write it when a second
  flow lands or `/onboard` runs (same source).
- [ ] **T3** · The Evidence ladder strip reads 100% for every 1-of-1 — revisit when a project has 20+
  records (a count axis, not a share) (same source).

## Log

- **2026-10-05** — graduated from `business-profile`; the demo rule moved here from RESUME; IDEA-134 joined
  (it had no umbrella); three found tasks moved from the ephemeral feature-context file.
