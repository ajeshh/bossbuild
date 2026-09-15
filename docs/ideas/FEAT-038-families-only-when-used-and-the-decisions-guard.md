---
id: FEAT-038
type: feature
owner: designer
status: shipped
proof: stages/L1-mvp/template/.claude/hooks/design-decisions-guard.js
gist: Rows 1–3 of IDEA-113 — a family renders only when the product uses it; `/design-review` seeds a family the first time a screen has it, keyed off shape; `design-decisions-guard` hands the agent the product's own decisions at the write and logs the fire so divergence can be counted.
for: the founder scaling one taste across a team and agents; the agent about to write a screen; the designer who wants their decisions to hold without a meeting
created: 2026-09-13
building_since: 2026-09-13
shipped_on: 2026-09-13
from: IDEA-113
program: design-system
relates: FEAT-037, IDEA-112
---

# Families only when used, and the decisions guard

## Goal
Nothing BOSS seeds ever reads as the product's decision; a family is an option until the product
uses it; and the product's own decisions reach the agent at the moment of the write.

## Assumptions (the plan-time record)
- **Assumed:** *in use* is a name match — index rows, tree files and usage pages against each family's name list (overlays: Modal · Dialog · Popover · Tooltip · Toast · Drawer · Sheet; selection: Checkbox · Radio · Toggle · Switch · Select · Dropdown; navigation: Nav · Tabs · Breadcrumb · Pagination · Menu · Sidebar; feedback: Banner · Alert · Notification · Badge · Progress; forms: Form · Fieldset; layout: Card · Stack · Page · Container; inputs: Input · Field · TextField · Textarea; data display: Table · List · DataTable · Grid; icons: Icon; waiting: Skeleton · Spinner · Loading). A file's contents are not read for this → _confirmed / corrected to: …_
- **Assumed:** a decided row belongs to a family by its *Family* column when the Ours table has one, else by the same name list over its pattern and situation → _confirmed / corrected to: …_
- **Assumed:** a family renders when it has a decided row or is in use; seeded rows under it render as *prompts — seeded, not decided*; *Always* / *If AI-mediated* seeds render as one collapsed line; families neither decided nor in use are one line naming them as options → _confirmed / corrected to: …_
- **Assumed:** the guard fires on component-shaped writes only (the reuse guard's file test), matches an Ours row when two or more of its situation/pattern words (≥5 letters) appear in the added text, a Do/Don't pair when two or more words of its *Don't* appear, an exception when its *Where* is a substring of the path; at most three lines; once per file per decision via `.boss/decisions-guard.json`; a JSON line appended to `.boss/trace.jsonl` per fire; fail-open everywhere → _confirmed / corrected to: …_

## Acceptance criteria
- [x] With a CLI-shaped fixture (no overlay names anywhere) the page shows no overlay family even when `PATTERNS.md` carries seeded overlay rows; with a `Modal.tsx` in the tree and no decision it shows *overlays — in use, nothing decided*.
- [x] Ours rows render under their family; seeded rows render as prompts; the ledger's patterns slot counts Ours only.
- [x] The pattern-set template and `/design-review` say: seed a family the first time a screen has it, keyed off `shape`.
- [x] `design-decisions-guard` ships opt-in at MVP with its header block; tests: a write that touches a PAT situation gets the rule and the anti-pattern; a second write to the same file is silent; an exception at the path is named; no `PATTERNS.md` → silent.
- [x] Each fire appends `{ kind: 'design-decision', file, ids }` to `.boss/trace.jsonl`.

## What "wrong" looks like
- A seeded row rendered as if the product decided it.
- The guard quoting BOSS's seed.
- A family shown for a product that has nothing in it.

## Paths that must not break
- **Destructive path:** the page still writes one file under `.boss/`; the guard writes only `.boss/decisions-guard.json` and appends to `.boss/trace.jsonl`.

## Smoke check
- `node --test test/design.test.js test/design-decisions-guard.test.js`; `/tmp` scaffold: CLI shape vs. one `Modal.tsx`; `boss hooks enable design-decisions-guard` and a write.

## Log
- 2026-09-13 — specced from IDEA-113 rows 1–3.
- 2026-09-13 — **landed** (under Unreleased). 33 design tests + 4 guard tests. In the fixture, a deprecated `Card` put *layout primitives* in use — right: retired parts were used; the family's decisions still apply to what replaced them. The Ours row that names no family renders under Ours only, which is the honest read of a row whose words name nothing.
