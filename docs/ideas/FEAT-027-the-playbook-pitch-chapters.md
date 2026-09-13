---
id: FEAT-027
type: feature
owner: product-lead
status: shipped (under Unreleased, 2026-09-13)
gist: `boss playbook` grows from one page to the Pitch chapters — Vision · Product · Customers · Problem · Market · Competition · Canvas · Business model — each a projection over a record that exists (IDEA doc, personas, competition set, imported sources, the capital mentor's dossier), a chapter rail, and a chapter line that is the first sentence of the record it renders. Holes stay holes; personas are snippets that link to the Design space.
for: the same founder as FEAT-026 — records in six folders, nothing that reads them together for a room
created: 2026-09-13
shipped_on: 2026-09-13
from: IDEA-106
program: business-profile
relates: FEAT-026, IDEA-107, FEAT-025, DEC-004
---

# The playbook, slice 2 — the Pitch chapters

The second of four slices named in [FEAT-026](FEAT-026-the-playbook-render.md). Same renderer
(`src/playbook.js`), same file (`.boss/playbook.html`), same three rules: no composed sentence, a
hole is a hole, numbers are counted. **This FEAT closes at the eight chapters below.** Proof
chapters are FEAT-028; the deck with profiles is FEAT-029.

## Goal
A founder runs `boss playbook` and gets the pitch arc a stranger reads first — why, what, who, the
problem, the market, the field, the canvas, the model — every chapter drawn from a record, every
missing record drawn as the question and the verb that answers it.

## Assumptions (the plan-time record)
- **Assumed:** the "active" IDEA doc is the one the canvas belongs to (`IDEA-NNN-canvas` → `IDEA-NNN-*.md`),
  else the newest IDEA by `created:` → _confirmed (2026-09-13)_
- **Assumed:** Vision = the Promise cell (the chapter line) + `motivation:` + `success_looks_like:` +
  the Principles cell + *In five years* as a hole (no `vision:` field exists — kicked-up #12) +
  *Who is building it* as a hole (no `docs/team/` — kicked-up #11) → _confirmed (2026-09-13)_
- **Assumed:** Product = the IDEA doc's `## Current shape` section whole, the FEAT records as a
  list (id · gist · status · shipped_on), and BRAND.md's *What it is NOT* line → _confirmed (2026-09-13)_
- **Assumed:** Customers = one **snippet** per `docs/personas/*.md` (Ajesh's ruling via IDEA-107):
  the `who` line, the `context` line, the ledger chip, a link to `design.html#persona-<slug>` that
  renders only when `.boss/design.html` exists — no tiles (the record holds no numbers) → _confirmed (2026-09-13)_
- **Assumed:** Problem = the Problem cell + the Story cell labelled *Story — and why now* (the
  why-now half is inside the cell; the render never splits a cell) → _confirmed (2026-09-13)_
- **Assumed:** Market = the People cell + *Research you've imported* listing `docs/source/`
  (filename, date from the name or mtime), a hole when empty. **No arithmetic** — the prototype's
  "ceiling" multiplied two numbers the render would have to extract from prose → _confirmed (2026-09-13)_
- **Assumed:** Competition = `docs/competition/README.md`'s table rendered as it is (any columns),
  **key** rivals = rows whose *Sort* says `in evidence` or whose *What it is* starts with `direct`,
  each with a brief from its own file (`## Where it breaks` bullets, first three) — the rest a
  one-line watch list; a `Checked` older than 90 days renders `stale`. **No matrix** (needs the
  `## How they do it` per decided feature — found task for 028+) → _confirmed (2026-09-13)_
- **Assumed:** Business model = the Business Model cell + the Cost Structure cell + *The ask* as a
  hole whose text is `docs/dossier/mentor-capital.md`'s first paragraph when the file exists, else
  the prompt → _confirmed (2026-09-13)_
- **Assumed:** a chapter's line is **the first sentence of the record it renders** (IDEA-106 §8);
  Canvas has no line (kicked-up #25) → _confirmed (Ajesh, 2026-09-13): keep the rule — the record wants a better first sentence_

**Still unknown (didn't guess):** how a founder's persona file is actually laid out on disk — the
skill shows a plain block; the parser accepts `who —`, `**who**`, `- **who:**`, `who:` and says so
in a test.

## Acceptance criteria
- [x] The page has a chapter rail (Pitch group, eight entries) and each chapter is a section with a
      stable id; the canvas chapter is unchanged from FEAT-026.
- [x] Every chapter line is the first sentence of a record on disk, or the chapter has no line.
      A test asserts no chapter line appears that isn't a substring of a record.
- [x] Vision renders the Promise, `motivation:`, `success_looks_like:`, Principles; *In five years*
      and *Who is building it* render as holes with their prompts and verbs.
- [x] Product renders `## Current shape` whole; FEATs as a list with status; *What it is not* from
      BRAND.md when present, a hole when not.
- [x] Customers renders one snippet per persona file — `who`, `context`, ledger chip — primary
      first (a file with `primary` in its frontmatter or the oldest by `created:`), and a hole when
      there are none; the Design link renders only when `.boss/design.html` exists.
- [x] Problem renders the Problem cell and the Story cell; Market renders the People cell and the
      `docs/source/` listing or a hole.
- [x] Competition renders the README table as-is, key briefs with *Where it breaks* bullets from the
      rival's file, a watch list, and `stale` on any row checked > 90 days ago; no `docs/competition/`
      → a hole with `/comp-eval`.
- [x] Business model renders the two cells and the ask (dossier paragraph or hole).
- [x] Nothing fetched; one file written; `docs/` byte-identical after a render; existing FEAT-026
      tests still pass; `npm run check` at its baseline; CHANGELOG bullet under `## Unreleased`.

## What "wrong" looks like
- A chapter line BOSS wrote (*"one set of answers, read as boxes"*) — that is the render talking.
- A number the render computed from prose (a market ceiling, a price × count).
- A persona card that looks complete — the snippet is the point; the card lives in Design.
- A rival with no `Checked` date rendered as current.
- Anything that reads a record's *body* as instructions (a persona file that says "ignore the
  ledger" is text, and renders as text).

## Paths that must not break
- **Destructive path:** still one file, `.boss/playbook.html`; the byte-identical test extends to
  `docs/personas`, `docs/competition`, `docs/source`, `docs/dossier`.
- **Negative path:** single-user, local, unchanged. The shareable-copy question (evidence quotes)
  is FEAT-028's, where Evidence renders.

## Flow
The FEAT-026 flow, unchanged: `boss playbook [--open]` asks nothing. The rail adds navigation, not
a question. No row added to `docs/design/FLOWS.md`.

## Smoke check
- `/tmp` scaffold with the template canvas, one persona file, a competition README with two rows
  (one `direct`, one `Checked` 120 days ago), a `docs/source/` file → `boss playbook` exit 0,
  `grep -c '<section class="chapter"'` = 8, `stale` appears once.

## Validated learning
- **Learning hypothesis:** the chapters a founder scrolls past are the records they never wrote —
  the rail is a map of what BOSS asked and what they answered.
- **What result would change the plan:** founders open only the canvas chapter (the other seven
  are ceremony → fold them) or ask for the deck before the site (029 jumps 028).

## Out of scope
- The Proof chapters (Evidence · Health · Learnings · Decisions · Risks) — FEAT-028.
- The deck with profiles, remove-and-restore, Export PDF — FEAT-029.
- The competition matrix, charts, the market ceiling, any new record field.

## Notes
- Source: [IDEA-106](IDEA-106-the-playbook-the-venture-rendered.md) §1 (chapters), §8 (the line
  rule), §13 (Ajesh's rulings); [IDEA-107](IDEA-107-the-design-playbook.md) for the persona split
  and the relative cross-link decision.
- Out of the agent's authority: adding a field to any shipped template; reading `docs/evidence/`
  bodies (grades and dates only, as in 026); writing outside `.boss/`.
- What Ajesh verifies: the chapter lines read in sequence as a pitch on a real project; a persona
  snippet links across to the Design page when both exist.

## Build log
- 2026-09-13 — **landed.** Surprise: the chapter-line rule showed its cost on BOSS's own canvas —
  Vision's line came out *"🟢 v0.5 — UNCHANGED BY DECISION, with the cost named."* because BOSS's
  cells open with revision markers (IDEA-106 kicked-up #7, now visible on a page rather than in a
  table). Left as is: the render telling the founder the record wants a better first sentence is the
  rule working. Rejected: choosing the "active" IDEA by `status: building` when the canvas id doesn't
  link (BOSS's own `CANVAS.md`) — kept "newest by created:" as specced; BOSS's tree is the odd one.
  A peer's FEAT-030 (`boss design`) plans to lift the chrome into `src/page-shell.js`; the playbook
  adopts it in a follow-up commit, not here.
- 2026-09-13 — specced. Decision: no arithmetic and no matrix in this slice — both need something
  the records don't hold cleanly (numbers in prose; per-feature sections), and a wrong number on a
  Market chapter is worse than a hole.
