---
id: IDEA-057
type: idea
owner: product-lead
status: shipped (identity + `gen-site.js` + the site, serving at oyeboss.build)
program: public-surface
proof: docs/design/BRAND.md
proof_note: The site is built (`site/`); what is missing is a bought domain to serve it from. Not a build task.
created: 2026-08-18
source: Ajesh, 2026-08-18 — "create a landing page for what is boss, what does it do and a quick
  start guide for how to install, use boss for a fresh idea or bring it into an idea. we dont really
  have a visual style guide for it. so first we may need to come up with a visual aesthetic and then
  based on that create it."
---

# IDEA-057 — BOSS's own visual identity + the site

## The seed

BOSS has shipped 163 releases with a **complete verbal identity and no visual one**.
[`BRAND.md`](../design/BRAND.md) locks the name, the slogan, the bad-boss-flipped story and the
distribution surfaces — and says nothing about color, type, or layout. Meanwhile BOSS ships
[`design-system.md`](../../library/practices/design-system.md) (whose load-bearing line is
*intentionality, not intensity — what fails is the absence of a decision*) and
[`landing-page.md`](../../library/practices/landing-page.md) (whose step 0 is *refuse to generate
from blank; the page is born from the brand and the tokens*) to founders.

**BOSS could not run its own `/landing` skill.** Step 0 reads `BRAND.md` (present), the canvas
Promises cell (present), and *the design tokens* — which did not exist. The skill's own honest
fallback is "generate a plainer page and name what's missing." That gap is the idea.

## The one-line finding

**The absence of a decision was itself the failure BOSS names** — and the fix isn't a website, it's
the decoupled layer underneath it (Principle 3: extract style into tokens + a style guide the moment
there's UI, so prototypes consume the same system the app does).

## Prior art already in the repo (this is not a blank page)

- [`pretotype/index.html`](../../pretotype/index.html) shipped a de-facto palette in July —
  paper `#F4F1EA`, ink `#1C1A17`, rust `#B5482E`. Never named, never extracted, never reusable.
  Exactly the "locked into code" failure Principle 3 exists to prevent.
- [`IDEA-055`](IDEA-055-cli-usability-and-visual-encoding.md) found the *other* renderer: the CLI is
  monochrome-plus-gray, with `dim` defined byte-identically three times and a warning that looks
  exactly like a success.

## The decision that makes it one system, not two

**BOSS has two renderers — a browser and a terminal.** A palette chosen only for the web would be
re-invented (differently) the day IDEA-055 is built, which is the 47-blues failure at the
brand level. So the token layer names each color **once** and carries **both bindings**: a CSS
custom property and an ANSI truecolor/256 pair.

Direction chosen by Ajesh, 2026-08-18: **paper + live terminal.** Warm paper ground for prose,
an inset real terminal as the hero — the practice's own "hero shows the product working," and for a
CLI that *is* a terminal. Calm where it talks, literal where it proves. Rejected: all-paper (nothing
on screen says "this is a tool"), terminal-true dark/mono (the 2026 AI-dev-tool default — its own
sameness, and it fights calm-company), signage/editorial (loud is the register BOSS spent 160
releases avoiding).

## Scope on this pass

- **Built:** the token layer, the style guide, the landing page.
- **Mapped, not wired:** the ANSI column is documented per token; `src/` is untouched. No behavior
  change, no founder-surface addition — [[EVID-001]]'s compose-and-subtract mandate holds, and
  building IDEA-055 off n=1 stated-pain is exactly what that entry says not to do.

## Honest-conversion constraints (this page must pass BOSS's own bar)

BOSS has **one** external user's reaction ([[EVID-001]]) and zero paying customers. So: no
testimonials, no user counts, no "join N founders," no waitlist, no email capture, no urgency. The
proof on the page is the *real terminal output* and the fact that the source is readable. If BOSS's
own landing page manufactured social proof, the conscience would be a marketing claim.

## 🔴 The finding this build produced (routes to `/practice-refresh`, not to a build)

The first draft of the visual system was **warm cream + serif display + terracotta accent +
broadsheet hairlines + a decorative `01 / 02 / 03` rail** — which is, precisely, a *named 2026
AI-default cluster*. BOSS walked straight into the failure its own practice exists to prevent.

**The load-bearing part isn't this page. It's that
[`design-system.md`](../../library/practices/design-system.md) is going stale in the exact way it
warns about.** Its anti-slop section still names the **2025** tell — "Inter or Roboto, a purple
gradient, a centered card on a gray background" — and the RVW-052 `indigo-500` story. The default
has moved on. **A practice that names last year's default is worse than no practice: it certifies
the current default as safe**, and `boss sync` pushes that certification into every connected
project.

- `design-system.md` is `curve: craft-ai`, `last_reviewed: 2026-08-11`, `review_by: 2027-02-07` —
  so **freshness reporting says it's fine**, and it isn't. This is the same shape as the
  **`mcp.md` was wrong at 7 days old** finding in v0.135.0: the doc rotted because the *ground*
  moved, not because time passed, and the cadence couldn't see it.
- Candidate for the next `/practice-refresh` on `design-system.md`: refresh the AI-default catalog
  to the current cluster, and — the more durable fix — **stop enumerating specific tells and give
  the founder the *test* instead** ("what would a model produce unprompted for this brief? don't
  ship that"), since any enumerated list starts rotting the day it's written.
- **Not built on this pass.** Finding ≠ build. Routed, dated, and left for the discipline that owns it.

The resolution on this page is the transferable lesson: **you can't escape a cluster by swapping the
palette — you break it by deriving the choices from the subject.** The ground and accent stayed
(Ajesh chose them; they already shipped). The display face became the *mono stack*, because BOSS is
a terminal and its headlines should come from the same world as its proof.

## The site (2026-08-19) — and the positioning fix it forced

Ajesh: *"i may need a full on website… part of this is to help teach how to use boss, and the value
add but also… the governance of key concepts like from how the agents are designed, best practices
embedded, from who… a charter showing the humane… also i think the value add for boss seems a bit
all over the place. its not just about validation."*

**The muddiness was real and diagnosable: the copy sold the conscience, the product is a staffed
build system.** 15 agents / 46 skills, of which four are validation. **New spine: BOSS staffs your
project** — builders make the thing, mentors coach the founder, hired JIT as the project earns them
(3 → 8 → 15). This also fixes "scaffolding": it's not ceremony that scales, it's **the team** that
does. Governance depth: **method, not verdicts** (Ajesh's call) — publish the pipeline and the rules,
not the individual REJECT write-ups.

**The durable piece is `scripts/gen-site.js`**, not the pages: the roster, ladder, reference and every
count derive from `stages/*/manifest.json` via `src/modes.js` and are release-gated. **No number on
the site is ever typed by hand** — which is the only reason a 7-page site is maintainable by one
person alongside the tool.

**Still open on the site:** `/team` and `/reference` are generated and safe; the four prose pages
(`/start`, `/guide`, `/charter`, `/governance`) are hand-written and therefore *can* rot — they need
the same `curve:`/`review_by:` frontmatter treatment the practices got, so `check:freshness` can see
them. Not done on this pass.

## Open

- **`boss.build` is still unregistered** — the page has no home until it is (BRAND.md's one
  outstanding item, ~$15 of anti-sniping insurance). Until then the page is in-repo and previewable.
- Whether the CLI's ANSI layer gets wired (IDEA-055) is unchanged by this — still waiting on a
  second signal.

## Re-grade 2026-09-09 — both "Open" items dissolve on inspection, and one contradicts this record's own proof

**Shipped.** `docs/design/BRAND.md` exists, `scripts/gen-site.js` derives every roster/ladder/count
from `stages/*/manifest.json` and is release-gated, and the site is **live and serving** —
`check:deployed` reaches `https://oyeboss.build/` right now. That is the identity and the front door.

🔴 **"`boss.build` is still unregistered — BRAND.md's one outstanding item" is FALSE, and BRAND.md is
this record's own `proof:`.** BRAND.md line 14: *"**Domain changed 2026-08-20 → `oyeboss.build`**
… **REGISTERED 2026-08-20**"*, and line 16 records that `boss.build` was **never available** — it had
been held since 2026-01-16, five months before BOSS was named. DEC-002's written falsifier
(*"boss.build unavailable"*) fired, the name survived it, and this record kept the pre-decision
sentence. **A record's Open section outranked by its own proof artifact is the cheapest kind of
staleness to catch and the easiest to keep believing** — it reads as a live task forever.

⚠️ **The second item is a gap that is not one.** *"The four prose pages need the same
`curve:`/`review_by:` frontmatter treatment so `check:freshness` can see them"* — **a review
mechanism already exists**, one checker over: `check-site.js` reads a `reviewed:` date from each
page's fragment header and reports against it (*"13 page(s) document something that changed after
they were last reviewed … 0 broken · 0 in flight · 13 trailing · 0 overdue"*). Adding a second one
under `check:freshness` would be **two implementations of one job**, which this repo refuses on
sight. The gap was vocabulary, not coverage — the v0.262.0 lesson, again.

**What is genuinely outstanding is maintenance, not build:** 13 site pages are trailing their
`reviewed:` date, and the live copy carries no generator stamp (it predates the release that added
one), so it is roughly forty releases behind. **Both are Ajesh's** — the website is under a standing
do-not-touch, and the re-deploy waits on an explicit yes. Neither is a reason to hold a card in
Building.
