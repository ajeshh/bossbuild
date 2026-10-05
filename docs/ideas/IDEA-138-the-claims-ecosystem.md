---
id: IDEA-138
type: idea
kind: capability
owner: mentor-architect
program: ecosystem-of-ecosystems
status: captured (step 1 inventory and step 2 parts written 2026-10-04; step 3 proposed, not built)
gist: Claims — what a project says about itself to someone who can't check it — gets its own ecosystem, centred on the landing page. Every line on the page is no stronger than what backs it. Extracted from how BOSS already checks its own front door, which has been doing this for 150 releases and never sorted it down.
created: 2026-10-04
---

# The claims ecosystem — every line no stronger than what backs it

## Current shape
_The best articulation so far. Rewrite this as the idea sharpens._

- **Purpose:** claims is what a project says about itself to someone who can't check it: the
  landing page, the README, the share card, the pitch. It keeps each line no stronger than what backs
  it. **What the project is worse at without it:** being believed, and not fooling itself. The page is
  the first place the founder reads their own promise in the voice of a fact. A headline that runs
  ahead of the evidence persuades the stranger, and then it persuades the founder too.
- **Centre:** the landing page. It gets planted with its neighbours around that page: **evidence**
  (the grades), **brand** (the provenance marks on each line), **design** (tokens and library),
  **canvas** (the promise), **trust** (the email field).
- **Boundary:** a line the page states as true about the product, its users or the world. **In:**
  counts, testimonials, capability claims, *"why this is believable"*, logos. **Out:** the promise
  itself. A headline is a promise, and a promise is fine at any grade as long as it reads as a
  promise. Visual design and the dark-pattern catalog's UI rows are also out. (The catalog's eight
  `claims-*` rows sit on the seam.)
- **Order:** first of the next three (IDEA-137 · B4). It goes first because BOSS's own checks are the
  richest instance to extract from, the harm reaches strangers, and B1 had already named the missing
  flow: EVID → headline, unchecked.
- **The finding that shapes all of it: the parts already exist and are not connected.** The brand doc
  marks every line `— EVID-NNN` / `— belief`. The onepager frame renders an honest evidence ledger.
  `src/playbook.js` computes a top grade for every canvas cell. `/landing` treats a `— belief` line as
  copy, not proof. And `/landing` writes the headline from the Promises cell **without reading any of
  it**. So this is composition. **No claims register:** the brand doc's provenance marks already are
  one, and the brand doc is the seam's steward.
- **Mandate:** compose and subtract, never add a skill. A new gate needs a bug that reached a user.

## Step 1 — inventory (read-only, 2026-10-04)

### How BOSS checks its own claims

| What | Receipt | Kind |
|---|---|---|
| **Derive, never restate.** Every count on the site is generated (`COUNT_AGENTS`, `COUNT_SKILLS`, `COUNT_PRACTICES`, `COUNT_VERDICTS`…) | `scripts/gen-site.js:520-522, 789-790, 850-855, 913-918`; `release.js:173-176` (*"Typing '15 agents' into a page by hand is precisely how CHEATSHEET.md drifted for 56 releases"*) | rule, enforced by construction |
| **Broken claim = hard, stale prose = soft** | `scripts/check-site.js:12-13`, `:120-122` | rule, enforced |
| Site names a skill or agent that doesn't ship → hard fail; mocks in `<pre>` too | `check-site.js:37-95` (§1) | check, at release |
| Install line names the right package and repo | `check-site.js:135-204` (§2a) | check |
| Practice exists but no page mentions it; skills in the table but in no sentence (note) | `check-site.js:96-133` (§2) | check (note) |
| Page past its `review_by:` or trailing its `covers:` source | `check-site.js:262-314`, `:351-360` (§2c, §3); `release.js:226-232` | drift reader |
| Citation debt, with the denominator kept honest (*"a metric that improves when you forget something is worse than no metric"*) | `check-site.js:227-261` (§2b) | check (note) |
| A number next to a roster noun in hand-typed prose (README) | `scripts/check-roster-claims.js:2-44` | check, `--strict` in `npm run check` |
| Verification claims: unit-test counts (tracked) | `check-roster-claims.js:21-36` | check |
| Eval-count claims in README, PATTERNS, `registry/dogfood.json` against the run suite | `scripts/release.js:297-340` | check, at release only |
| The public surfaces themselves: npm, the tap, the live site vs the repo | `scripts/check-published.js:2-14`; `check-deployed.js:2-14` | check, `check:external` |
| *Does BOSS run what it ships* | `scripts/check-dogfood.js:2-13` | check |
| Help prose: no `covers:` → fails | `scripts/check-help.js` header | check |
| **The falsifier.** *"A decision without a falsifier is a preference"*; outcomes stated as missing | `web/thinking.html:28-36`, `:151-158` | rule, written; `/decide` makes it a field |
| *"The claims on this page are checkable"*: points at the DECs, the eval suite, and generated counts | `web/index.html:611-622` | a claim about claims |
| The CHANGELOG never shows research | `CLAUDE.md` rule 5 (Ajesh, 2026-10-04) | rule, **written only** |
| No vendor names in shipped text; outside sources never named in tracked text | memory note `no-vendor-names-in-shipped-text` | rule, **written only** |
| Attribution before grade | memory `vet-verify-attribution` (n=14); `/vet` → `docs/research/verdicts/` | rule + a skill (outside claims coming **in**) |

**Found while reading (task, 3b): two hand-typed counts on the site have drifted.**
`web/index.html:614` says the decision records are *"16 of them"*. `web/thinking.html:156` says
*"Twenty-one decisions were recorded"*. There are **23** (`ls docs/decisions | grep -c ^DEC-`). It is
the class `check-roster-claims.js` exists for, but `decisions` is not one of its nouns, so the gate is
green on both. This is a correctness fix under the site freeze. Derive it (a `COUNT_DECISIONS` block),
don't retype it. That makes it the smallest thing in step 3.

### What a founder gets today

| What | Receipt | Reads evidence? |
|---|---|---|
| `/landing` headline = the value prop, from the canvas **Promises** cell | `landing/SKILL.md:69-70`, `:100` | **no** |
| `/landing` subhead does *"how it works + why the claim is believable"* | `:101` | **no**: nothing says what may back it |
| Proof in the eye-path: real testimonials and counts only, the brand doc's ★ rows as written, permission asked | `:103-105`; `:61-65` | indirectly, through BRAND.md |
| Brand-doc lines: `— EVID-NNN` / `— DEC-NNN` can be a claim; `— belief` or no pointer is copy | `landing/SKILL.md:64-65`; `canvas/templates/brand-doc.md:85-87` | **yes, by provenance mark** |
| `/evidence` offers the words that landed to BRAND.md as a learned row ending `— EVID-NNN` | `evidence/SKILL.md:133-139`, `:176` | it is the giver |
| The 3-grade ladder: stated-pain → observed-behavior → commitment, fixed | `evidence/SKILL.md:42-56` | — |
| Canvas **onepager**: an evidence ledger of records, grades and ages; **never "N of M claims backed"**; never invent; holes render as holes; gated on ≥1 EVID | `canvas/SKILL.md:80-140` | **yes**, and its rules are the claims rules |
| Canvas riskiest assumption cites EVID ids | `canvas/SKILL.md:211-214` | yes |
| `src/playbook.js` computes per-cell evidence count and top grade (Promises included) | `src/playbook.js:136-156`, `:715-755` | yes, but only the playbook reads it |
| `/comp-eval`: every factual cell has a source URL and `checked` date, or says `unverified` | `comp-eval/SKILL.md:3`, `:127` | — (rivals' claims) |
| `/red-team --humane` on the copy; a crossing recorded as a DEC | `landing/SKILL.md:127-138` | — |
| Catalog `social-proof-and-claims`: 8 rows (fake reviews, AI washing, capability misrepresentation, unearned badges…) | `library/deceptive-patterns.json:186-188`, `:707-790` | — |
| Conscience **deception** moment: countdown, pre-ticked box, confirmshaming, read at the write | `hooks/lib/moment-frames.js:242-243` | — (UI patterns, not unbacked claims) |
| Conscience **harvest** moment: new EVID landed, persona or canvas didn't catch up | `moment-frames.js:261` | yes, but not the page |
| `/landing --demand` reads the threshold `/pretotype` set | `landing/SKILL.md:88-92`; `registry/flows.json` (pretotype → landing) | — |

**The missing flow (IDEA-137 · B1), confirmed:** `/landing` reads Promises, BRAND.md, tokens, the
library and competition. It never reads `docs/evidence/`. The headline's backing is checked only if it
happens to arrive by way of a brand-doc row.

**Also confirmed not shipped:** IDEA-060 named *"derive the claims, never restate them"* and *"broken
claim = hard, stale prose = soft"* as the two portable rules from `check:site` (*"two rules, not a
tool"*). Neither appears in `library/practices/landing-page.md` or any stage file. Principle 1's DOWN
never happened.

## Step 2 — the eight parts

Filled from the inventory. A part with nothing behind it is left empty.

| # | Part | BOSS's own (B) | What ships to a founder (A) |
|---|---|---|---|
| 1 | **Principles → guidelines → rules** | *derive, never restate* · *broken claim hard, stale prose soft* · *a decision without a falsifier is a preference* · *never a manufactured ratio* · attribution before grade · the CHANGELOG never shows research (written only) | *never invent* (onepager) · *a line with no pointer reads as a belief* (brand doc) · *real proof only, with permission* (`/landing`) · *a URL and a checked date, or `unverified`* (`/comp-eval`). **No principle for the page's own lines:** nothing says a subhead's *"believable"* half must point at something |
| 2 | **A seed that scales** | the generator: counts are blocks, never typed (`gen-site.js`) | the brand doc's provenance marks, and the 3-grade ladder. Both ship at Quickstart |
| 3 | **A map of what exists** | the `COUNT_*` blocks (derived) and the claims regex list (`release.js:330-335`, typed) | BRAND.md (*Current shape* with marks, ★ rows in *What we've learned*) + `docs/evidence/`. **This is the register.** Nothing maps what the *page* claims |
| 4 | **A planting moment** | **empty**, it grew | `/landing` Step 0b: reads the brief, seeds BRAND.md if missing. IDEA-060's suggested moment (*Promises cell filled*) was never built |
| 5 | **Checks at the write** | **empty**: at release (`check-site`, `check-roster-claims`, `release.js`), not at the write | the deception moment, for UI patterns only. **Empty for unbacked claims** |
| 6 | **A drift reader** | `check:site` (review dates, trailing `covers:`), `check:roster`, the eval-count regexes, `check:published`/`check:deployed` | **empty**: `/red-team --humane` and `/design-review after` run once. Nothing re-reads the page when its evidence moves. Harvest stops at the persona and the canvas |
| 7 | **Retirement** | `registry/supersedes.json`; DEC falsifier dates and `revisit-due` | BRAND.md is append-only, a changed shape is logged; a superseded EVID drops the onepager's count (`canvas/SKILL.md:125`). **The page:** none. A claim doesn't leave when its EVID is superseded |
| 8 | **Amendment** | `/decide`; Ajesh decides (the 2026-10-04 CHANGELOG rule is the latest) | a crossing recorded as a `DEC-NNN`, never a block (`landing/SKILL.md:131-132`) |

**Where claims disagrees with the draft guide** (for IDEA-137 · C7): parts 4–6 are where founders get
nothing, and B is richest at 6. Design is the reverse: rich at the write, thin at drift. A discipline
whose failure shows up *later* (evidence superseded, a count drifts) grows a drift reader first. One
whose failure happens *at* the write (a hardcoded hex) grows a guard first. That would mean the
anatomy holds, and each ecosystem's weight sits where its failure happens.

## Trigger and yield

- **Trigger:** the first public page (`/landing`, or `/pretotype`'s door). Before that there are no
  claims, only a promise in a canvas.
- **Yield on first use:** a page whose lines say what backs them, with the beliefs written as
  beliefs. On a demand page, **a result**, which is the return below.

## Connections

| | What | With | Path | Declared in `flows.json`? |
|---|---|---|---|---|
| **takes** | the promise | canvas | `docs/ideas/IDEA-*-canvas.md` | no |
| **takes** | provenance marks, ★ rows, `story:` | brand (steward) | `docs/BRAND.md` | seeded by landing itself |
| **takes** | grades and dates | evidence | `docs/evidence/EVID-*.md` | **no — the missing flow** |
| **takes** | tokens, library | design | `docs/design/…` | — |
| **takes** | the Bad Alternative, in rivals' words | competition | `docs/competition/README.md` | — |
| **takes** | the threshold | pretotype | `docs/ideas/IDEA-*.md` | yes (C4) |
| **takes** | a privacy policy beside the email field | trust | a route, not a file (B1.7) | — |
| **gives** | the page and share card | ship | stack-bound | exempt (`ladder_stack_bound.landing`) |
| **returns** | a demand page's result → an EVID (`method: pretotype`) | evidence | `docs/evidence/EVID-*.md` | **absent (IDEA-137 B1: pretotype result → EVID)** |
| **returns** | a crossing → a DEC | decisions | `docs/decisions/DEC-*.md` | prose |
| **store** | brand-doc rows the page hasn't used | — | — | — |
| **steward** | the brand doc, for evidence ↔ claims (as the component index is for design ↔ engineering) | | | |
| **not planted** | no evidence, no brand: `/landing` already writes *"a plainer page and name what's missing"* (`:79-80`) | | | |

**Stands alone?** Yes. With no evidence ecosystem, the page still gets written, and every line on it
reads as a belief. With no brand doc, `/landing` seeds one. The ecosystem doesn't break when a
neighbour is missing. It says less.

**How its rules change, and who changes them:** the founder, by crossing and recording it (a DEC).
Three crossings of the same rule mean the rule is wrong (ECOSYSTEMS principle 4). **How it leaves:**
when the project has a site generator, the counts move from typed to derived. That is BOSS's own
`gen-site` path, and `/landing`'s text should name it as the successor.

## Step 3 — what a founder gets (proposed 2026-10-04, smallest first; not built, shown to Ajesh)

0. **BOSS's own, a correctness fix (site freeze allows it):** derive the decision count with a
   `COUNT_DECISIONS` block in `gen-site.js` and use it on `index.html:614` and `thinking.html:156`.
   It has already drifted: 16 and 21 on the page, 23 in the repo. *Derive, don't gate.*
1. **`/landing` reads the evidence before it writes a line** (text only, `landing/SKILL.md` Step 0b
   + Step 2, and one `flows.json` take: landing ← evidence, which class 7 then holds). It reads grades
   and dates only, the way the playbook does, and applies the brand doc's own test to the page:
   - the **headline** is the promise, written as a promise, at any grade;
   - the **subhead's *"why believable"* half**, any count, any capability claim must point at a
     record. With nothing behind them, the page says less. It doesn't say it louder;
   - at stated-pain only, a demand page leads with the promise and claims nothing about users. It's a
     test, and that's honest.
   - Reuse the onepager's rules by reference (no ratio, never invent, say how old it is). Don't
     restate them.
2. **The two rules go DOWN** into `library/practices/landing-page.md`: *derive, never restate* (a count
   on the page comes from where it's true, or it isn't on the page) and *a broken claim is worth fixing
   now, stale prose can wait*. One paragraph. This closes IDEA-060's unsorted pattern.
3. **The return path:** the demand page's result becomes an EVID (`method: pretotype`), so the
   threshold `/landing` sets gets read. One line in `/landing --demand` and one take. It needs a
   ruling first on which grade a signup is (Q1).

**Not now:** a claims register (the brand doc is one) · a check at the write for unbacked claims
(no bug has reached a user) · harvest reading the page when a backing EVID is superseded (the drift
reader for part 6; wait for a founder whose page outlived its evidence).

## Open questions

- **Q1** · What grade is a demand-page signup? `/landing` says *"a signup measures curiosity, not
  intent"*. The ladder has `observed-behavior` (*watched them… bounce*) and `commitment` (*gave up
  something real*). An email address is a small reputation cost. Lean: `observed-behavior`, with the
  curiosity caveat in the record. That's the ladder's owner's call, not this ecosystem's.
- **Q2** · Is a headline ever a claim? Lean no: a promise stays a promise. But *"the fastest way to X"*
  is a comparative claim dressed as one. The catalog's *capability misrepresentation* row may already
  cover it.
- **Q3** · Does the README belong to claims or to outward docs (IDEA-089, parked)? For BOSS,
  `check-roster-claims` says claims.

## Capture log

- **2026-10-04** — planted from IDEA-137 · B4 (order: claims → AI behaviour → data & trust). Step 1
  inventory and step 2 parts written read-only from the repo. Found the decision-count drift on the
  site, and that IDEA-060's two portable rules never shipped. Step 3 proposed to Ajesh before
  building.
