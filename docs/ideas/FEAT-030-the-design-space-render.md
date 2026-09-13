---
id: FEAT-030
type: feature
owner: designer
status: building
gist: `boss design` renders a founder's design system — the tokens, the principles, the brand, then the people, patterns, components and research — into one self-contained, on-brand HTML page under `.boss/`, a sibling of the playbook, where every value copies and every hole stays a hole.
for: a founder at MVP with a tokens file and a style guide they cannot look at, and the designer or engineer they hand the URL to (no persona in `docs/personas/` here — BOSS's own users are described in `docs/evidence/`, n=3 stated-pain)
created: 2026-09-13
building_since: 2026-09-13
from: IDEA-107
program: design-system
relates: FEAT-026, IDEA-108, IDEA-091, IDEA-092, RVW-082
---

# The design space render — a founder's design system, drawn as a page

> Slices, in order. **This FEAT closes at slice 1 + the frame.** Later slices are named so the first
> one is built as a chapter renderer over a shared shell and not as a tokens page; each lands as
> its own commit and CHANGELOG bullet. New scope — a `principle:` field, `breakpoint.*` tokens, an
> `about:` on evidence, the Logo slot — is the *Kicks up* rows in [IDEA-107](IDEA-107-the-design-playbook.md),
> not a criterion here.

| Slice | Renders | Reads | Lands as |
|---|---|---|---|
| **1 · the language, and the frame** | Start here (brand: current shape, the anchor DEC) · Principles (each with the four slot parts the style guide holds; *asserted* when ungrounded) · Colour (semantic swatches, the *chosen — DEC-NNN* line, **contrast computed per declared pair**) · Type · Space & shape · Layout (the slot, as a hole with its six sub-slots) — plus the **shared shell**: tokens, topbar with the family bar, rail, block, Link · Copy, **every value copies** with the copy sheet | `docs/design/tokens.json` (DTCG) · `DESIGN_TOKENS.md` (fallback) · `STYLE_GUIDE.md` · `docs/BRAND.md` · `docs/decisions/DEC-*` | **this FEAT** |
| 2 · the people and the story | People (personas, full cards — the playbook keeps the snippet) · The journey (`JOURNEY.md` stages with source labels; the evening from the persona's day) · Research (evidence by rung and by method) | `docs/personas/*.md` · `docs/product/JOURNEY.md` · `docs/evidence/` · `docs/competition/` · `ux-check-*.md` | FEAT-031 |
| 3 · the parts | Components (`COMPONENTS.md` at MVP, `library/manifest.json` at V1; the definition-of-done row; **Code** and **SVG** on the card) · Patterns (Ours first, do/don't from the rows) · Flows · Content · Accessibility (the computed pairs; *not checked*, once) | `COMPONENTS.md` · `manifest.json` · `PATTERNS.md` · `FLOWS.md` · `STYLE_GUIDE.md` | FEAT-032 |
| 4 · the rest | Icons & logo (from `docs/design/icons/*.svg` and the brand's logo path; lockups; the sprite) · Resources (the DTCG file, kit coverage from `design:` links) · Exceptions (grouped by rule, counted) | `docs/design/icons/` · `BRAND.md` · `STYLE_GUIDE.md` Exceptions | FEAT-033 |

Prototype v4 is the rendered mockup for all four (https://claude.ai/code/artifact/d907896e-c1c7-4b5d-a4f3-d5bb861a435c):
**a sketch, not on-system** — it carries Tidewell's CSS because a founder's page is in *their* brand.
Implement the *behaviour* from it, never copy its hexes. Its section order is the decided IA.

## Goal
A founder runs `boss design` and gets `.boss/design.html` — their tokens as swatches with the
contrast computed, their principles as prose with the grounding marked, their brand, in their own
accent — and can open it, link to a block, copy any value in the form an editor wants, and hand the
URL to a designer.

## Assumptions (the plan-time record)
- **Assumed:** the output is `.boss/design.html`, gitignored, beside `playbook.html` and `board.html`; cross-links between the three are relative paths (IDEA-107, agreed with the FEAT-026 lane) → _confirmed / corrected to: …_
- **Assumed:** CLI verb `boss design [--open]`, not a skill — it composes nothing (the same reasoning as FEAT-026) → _confirmed / corrected to: …_
- **Assumed:** the shell (tokens CSS, topbar, family bar, rail, block, Link · Copy, the copy sheet) is **extracted from `src/playbook.js` into `src/page-shell.js`** and imported by both renderers — one renderer, three spaces, no second copy of the chrome → _confirmed / corrected to: …_
- **Assumed:** with no `tokens.json` the page still renders — Start here and Principles from what exists, and the language chapters as holes with the verb (`/design-tokens-init`) — because an absent chapter is the most honest thing on the site → _confirmed / corrected to: …_
- **Assumed:** contrast is computed only over pairs the tokens declare as text-on-surface (semantic names containing `text` / `on-` against `surface` / the accent), never over every pair of colours → _confirmed / corrected to: …_
- **Assumed:** "every value copies" ships in slice 1 as plain-text forms (hex · token · `var(--…)`) with the copy sheet; rich-HTML block copy stays exactly as FEAT-026 shipped it → _confirmed / corrected to: …_
- **Assumed:** BOSS's own tree renders a near-empty design space (no `tokens.json`, a `docs/design/BRAND.md` that is BOSS's) — fine; the throwaway in `/tmp` is where it is judged → _confirmed / corrected to: …_

**Still unknown (didn't guess):**
- Where a principle's *grounding* lives when the style guide predates the `Grounded in:` line — read `Why:` as the grounding, or render *asserted*? (Slice 1 renders *asserted* when no EVID/persona/journey reference appears in the principle's text.)
- Whether `--open` should open the design space or the family (playbook + design) — one page for now.

## Acceptance criteria
- [x] `boss design` in a project with `docs/design/tokens.json` writes `.boss/design.html` and prints the path; `--open` opens it.
- [x] Every semantic colour token renders as a swatch with its name, value, and — where a DEC names it — the *chosen — DEC-NNN* line; a token with `$deprecated` renders struck, naming its successor.
- [x] Contrast is computed (WCAG 2.x relative luminance) for every declared text-on-surface pair and rendered with the ratio and *AA · AA-large · fails*; the page says once that it checks declared pairs, not what renders.
- [x] Principles render from `STYLE_GUIDE.md`'s slot — statement/name, Why, Guideline, Rules, Wrong if — and a principle with no grounding reference renders *asserted*.
- [x] Start here renders `docs/BRAND.md`'s current shape; a missing field renders as its own hole, never invented; the anchor DEC renders when present.
- [x] Layout renders as a hole with the six sub-slots and the verb when no layout section exists.
- [x] Every value (swatch, name, hex, type role, spacing step, radius) copies on click in the forms that apply; every copy opens the sheet showing the payload and the form it reached the clipboard in.
- [x] The family bar links to `playbook.html` and `board.html` by relative path, dimmed when the sibling file does not exist.
- [ ] `src/page-shell.js` is the one source of the chrome; `boss playbook` adopts it — **the FEAT-026 lane's first FEAT-028 commit** (agreed 2026-09-13), with the snapshot; the shell is ready and exports `NEUTRAL`, `shellPage`, `familyBar`.
- [x] Brand: the accent from `docs/BRAND.md`, neutral default otherwise; no colour invented for a field marked unknown.
- [x] Zero dependencies; opens from `file://`; light and dark.

## What "wrong" looks like
- A swatch whose hex differs from `tokens.json` — the page and the file disagree, which is the trap the whole thing exists to refuse.
- A contrast ratio that is wrong by rounding or by reading the wrong pair; a pair computed that nobody declared.
- A principle rendered as *grounded* because it contains the word "evidence".
- A `var(--…)` copy form that names a variable the derived CSS doesn't define.
- The playbook's chrome and the design space's chrome drifting — two topbars, two block styles.
- A page that flatters: a hole rendered as a sentence, a nascent brand rendered as a chosen one.

## Paths that must not break
- **Destructive path:** `boss design` overwrites `.boss/design.html` only — never a file under `docs/`; a test asserts the write set is exactly that one path.
- **Negative path:** the page is local and single-user; nothing to gate. (A shareable copy is FEAT-031+, where evidence quotes stay off the page — the FEAT-026 rule.)

## Flow

Indexed in `docs/design/FLOWS.md`.

| # | Step | Asks the user for | Why it's needed *now* |
|---|---|---|---|
| 1 | `boss design` | nothing | the read is the act |
| 2 | the page opens at Start here | nothing | the story before the values |
| 3 | click a value → the copy sheet | which form (when more than one applies) | the editor wants one form, and it differs by reader |

**Cut** — tried to cut and every step held; three steps is the floor for *run → look → take*.

- **First-run path** — no `tokens.json`, no style guide: Start here from `BRAND.md` (or its hole), every language chapter a hole with `/design-tokens-init` as the verb, the ledger reads *0 of 6 slots filled*.
- **Failure path** — `tokens.json` unparseable: the chapter renders the error as a block, the rest of the page renders; nothing is written to `docs/`.

## Smoke check
- `node --test test/design.test.js` (fixture project with a DTCG file, a style guide, a brand; asserts the write set, the swatch values, three computed ratios, the *asserted* principle, the holes).
- By hand: `boss design --open` in a `/tmp` scaffold with the Tidewell fixture — click a swatch, read the sheet.

## Validated learning
- **Learning hypothesis:** a founder (or Ajesh on a real project) who can *look at* their tokens and principles finds a wrong value or an ungrounded principle within the first minute — the render is a check, not a gallery.
- **What result would change the plan:** nobody opens it twice. Then the site is a demo, the manifest is the product, and slices 2–4 stop.

## What I will verify before calling it done
- The three contrast ratios in the test match the prototype's computed values for the same hexes (16.50, 3.63, 2.54).
- `boss playbook` renders byte-identically before and after the shell extraction (a snapshot in the test), except the family bar.

## Out of the agent's authority
- Adding any dependency (there are none; there will be none).
- Writing anything under `docs/` from `boss design`.
- Changing FEAT-026's output path or chrome beyond the extraction.

## Log
- 2026-09-13 — specced from IDEA-107 after four prototype rounds (v0 → v4). Slice 1 is the language + the frame; the shell extraction is the one structural move and is claimed as a lane with the FEAT-026 session.
- 2026-09-13 — **slice 1 landed** (`c2c63ea`, under Unreleased). Nine tests. In a `/tmp` scaffold seeded with the Tidewell fixture: 7 pairs computed, 4 findings (muted and placeholder inks on both surfaces — the prototype's own finding, reproduced by the arithmetic), the DEC on the swatch, deprecated struck, the family bar live once the playbook exists. Surprise: nothing exported the neutral palette — board.js and playbook.js each restate it — so the shell became the exported source (`NEUTRAL`). The one open criterion is the playbook's adoption of the shell, handed to the FEAT-026 lane.
