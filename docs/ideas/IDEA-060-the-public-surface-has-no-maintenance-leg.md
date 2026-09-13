---
id: IDEA-060
type: idea
owner: product-lead
status: shipped (build order 1-5 done; 6 superseded v0.182.0; 7 gated on a real demand page)
program: public-surface
proof: scripts/check-site.js
proof_note: Items 1-5 shipped, item 6 superseded by `check:site` itself, item 7 trigger-gated. `og:image` closed in v0.194.0 once the domain was registered. What is left is the stage-boundary decision — the demand test still sits behind the build unlock.
findings: docs/dossier/website-refactor-pass-001.md (2026-08-22) — audit ahead of the site refactor: the 62/38 self-description ratio, the freshness gauge amber at 10/15 permanently, one broken counted claim (charter.html "37-pattern" vs 89) that no generated placeholder covers, and team.html carrying pre-v0.216.0 --humane copy.
created: 2026-08-20
source: |
  Ajesh, 2026-08-20 — "i do have an open question around landing pages or the website the app may
  build. im wondering if we should find ways to harness it so that the design library extends to it
  or managing it, but also how we can further enhance how we do landing pages? or the first website
  for the app? similar to how boss runs to update if there is a key feature or anything any
  publishes to build. im wondering for help, guides, how tos, websites we improve how its being
  updated? … Also in general if there are best practices for creating a landing page that we should
  in corp that we havent already. Maybe any agentic best practices for creating and maintaining the
  app's website?"
  Follow-up, same session — "also we should add a prompt after a end user creates their first app,
  wanna build a landing page for your app?"
co_owners: [designer, mentor-gtm]
---

# IDEA-060 — BOSS maintains its own front door and ships the founder a page that nobody ever checks again

> **The read in one line.** At v0.164 BOSS built itself a full site-maintenance loop — derived
> claims, a build/source split, and a release gate that hard-fails on a broken claim — and **never
> sorted it down.** The founder gets `/landing`, which generates once and is never looked at again.
> That is Principle #1 failing on BOSS's most recent work, in the one surface where being wrong is
> public.

## Where we actually are

| Surface | BOSS's own front door | What the founder gets |
|---|---|---|
| Generate | `npm run gen:site` — *"NO NUMBER ON THE WEBSITE IS EVER TYPED BY HAND"*, every roster and count derived from the stage manifests | `/landing` (L1) — one page, from a brief, once |
| Source/build split | `web/` is source, `site/` is pure build output, so *"upload the site folder"* can't publish a fragment | none |
| Drift check | `npm run check:site` — **hard fail** on a page naming a skill that doesn't exist, soft note on stale prose | none |
| Wired to the release | [`release.js:163`](../../scripts/release.js#L163) — *"website claims hold"* runs on every version bump | none |
| Design-system reach | n/a | **`/design-library` cannot see the landing page** |

None of it ships: `package.json` `files` is `bin/ src/ stages/ library/` plus three files. `scripts/`
and `web/` are BOSS-only by construction.

## The five findings

### 1. The design library can't see the surface that matters most

[`/design-library`](../../stages/L2-v1/template/.claude/skills/design-library/SKILL.md) is scoped to
the component tree — grep it for *landing* or *marketing* and you get nothing. But the landing page is
generated at **L1**, before the token layer is even offered, and it usually lives outside
`src/components/` as a standalone page. So **the one surface a stranger actually sees is the surface
most likely to be off-token, and it is structurally invisible to the drift check.**

`design-system.md` already names the hazard in a different costume: an off-system mockup *"injects the
47 blues at spec time … with the authority of something you can see."* The landing page is that
hazard, shipped to the public instead of to the implementer.

### 2. Zero coverage of the share layer — while BOSS's own site ships it

[`landing-page.md`](../../library/practices/landing-page.md) scores **zero** hits for `og:`, meta,
preview card, schema. BOSS's own [`web/_shell.html`](../../web/_shell.html) ships `og:title`,
`og:description`, `twitter:card` and `canonical`.

The link preview **is** the first impression for most traffic — a page shared into Slack, iMessage or
a group chat is a card before it is a page. The practice teaches the hero and not the card. Classic
un-sorted pattern: BOSS does it, the practice doesn't teach it.

⚠️ And the dogfood was thin on its own terms: `og:image` appeared **0 times** in the shell, so BOSS's
own card was text-only. **Closed in v0.194.0** — see build-order item 3.

### 3. The threshold is set and never read

`/landing --demand` builds `/pretotype`'s fake door and requires a Savoia/YODA threshold **set before
it ships**. Nothing counts. [`analytics-for-ai-products.md:91`](../../library/practices/analytics-for-ai-products.md#L91)
punts conversion to `mentor-gtm` *"for later."*

So the demand page's entire purpose — a number that decides build/don't-build — has no mechanism.
Refusing to become a CRO shop is correct and should not cost you the one number the method requires.
**A threshold nobody can read is a ritual, not an experiment.**

### 4. 🔴 The outward-docs half just got a practice and still ships nothing — and the doc now contradicts itself

Corrected mid-session: `documentation.md` gained **§7 "The docs your users read"** on 2026-08-20 —
help-doc-should-not-exist-first, the two-readers cut (*"an assistant answering how do I do X for a
person who never opened your site"*), publish clean markdown, `llms.txt` with the honest
no-provider-has-committed caveat, and corpus subtraction over retrieval infrastructure. It is good and
it lands the judgment.

Two problems, both cheap:

- **The same file still excludes it.** *"What's left out (deliberately) — Model-facing site
  conventions (`llms.txt` and kin) … Different problem."* §7 says ship it; the exclusion list says
  it's deliberately out. The line simply didn't get removed when §7 landed. **One file, two
  answers.**
- **Nothing delivers it.** No skill writes a user-facing docs surface, no loop notices one going
  stale, no check verifies one. That is the exact rot `design-system.md` has now been caught in three
  times — *a doc describing a mechanism it doesn't provide* — appearing in a fresh section on day one.
  Naming it now is cheaper than finding it in a sweep next February.

### 5. 🆕 The first-app prompt exposes that `/landing --demand` is mis-staged

The ask: *"add a prompt after an end user creates their first app — wanna build a landing page for
your app?"*

The moment is right and **the stage placement is wrong.** `boss new` lands a founder at **L0
Quickstart**; `/landing` lives at **L1 MVP**. So the prompt as literally specified points at a skill
the founder does not have.

Worse, `/landing` **step 0 refuses to generate from blank** — it needs `BRAND.md`, tokens, or the
canvas Promises cell — and a just-scaffolded project has none of them. Fire it at `boss new` and you
get either a dead pointer or the slop the skill exists to prevent.

But the ask is pointing at something real: **the demand page is the no-product shape.** A founder with
an idea and no app is *exactly* the `--demand` case, and `/landing`'s own words are *"test whether
anyone wants it before you build."* That job belongs at L0, and it is sitting at L1 behind an unlock.

Three candidate moments, in order of how much brief exists:

| Moment | Predicate | Trade |
|---|---|---|
| Right after `boss new` | trivial | earliest, **zero brief** — the anti-slop mechanism has no inputs |
| **Canvas Promises cell filled** | checkable, same shape as every other loop | the first moment the page can be *born from* something. **Recommended.** |
| First `/ship` | already exists | overlaps the distribution voicing already shipped into `/ship` per [[IDEA-041]] |

Voicing constraints are already written: `conscience-voicing` — once, briefly, offer the path not the
cliff, self-regarding therefore **fully muteable**. This is an offer, never a nag.

## What's portable from `gen:site` / `check:site` (and what isn't)

Most of `gen-site.js` is BOSS-shaped and should not travel. **Two rules should:**

1. **Derive the claims, never restate them.** Feature lists, plan limits, counts, what's-new — read
   from the product, not typed into the page. This is `documentation.md`'s *one home per fact* pointed
   at a public surface.
2. **A broken claim is a hard fail; stale prose is a soft note.** That severity split is the
   actually-portable insight, and it's what keeps a freshness check from becoming a nag.

The **source/build split** is the third candidate and the cheapest of the three.

## ⚠️ Correction (same session): item 1 was a category error

The first draft said *"`/landing` registers its page in `docs/design/PROTOTYPES.md`."* Wrong. That
registry holds **prototypes** — mockups exploring an open question, with a status vocabulary of
`sketch`/`exploring`/`adopted`/`discarded`. **A landing page is production.** Filing a shipped surface
in the mockup registry would have put a permanent row in a file whose second job is *subtraction*, and
taught both founder and agent that the front door is a sketch.

The mechanism was already sitting there: `/design-library` renders **from code**, and the landing page
*is* code. So the fix is scope, not registration — extend what the library scans, and have `/landing`
compose from the library once it exists. Prevention on one side, detection on the other.

## Build order

1. ✅ **`/design-library` scans the public surface**, not just the component tree — landing page and
   marketing routes get a **surfaces** row with the same badges. Plus a *"So does the landing page"*
   section naming why this surface outranks a prototype drifting: it's the only one judged by someone
   who has never seen the product, and **it can drift on *claims*, not just style** — a false feature,
   a stale price, a removed integration. **A token check will never catch a false claim.**
2. ✅ **`/landing` composes from `docs/design/library/` when it exists, and generates three variants,
   not one.** `design-system.md` already establishes *compare in parallel, don't refine in series* —
   serial *"make it better"* re-averages toward the mean on every pass, which is the exact slop the
   skill exists to escape. Vary one dimension across the three; stop when the next change isn't
   visible to someone who isn't you.
3. ✅ **The share layer sorted UP into `landing-page.md`** — a new section, *the page most people see
   first is the card, not the page*, plus the share-card bullet in the minimum-that-converts list.
   ✅ **`og:image` fixed in v0.194.0** — both blockers cleared (the domain was registered
   2026-08-20; the card is now a real asset, `web/og.png`, rendered from `scripts/og-card.html`
   so it can be re-rendered rather than re-invented). The shell ships `og:image`, dimensions, alt
   text and `summary_large_image`. **Guarded in both directions**: `check:site` now hard-fails a page
   that declares no card AND one pointing at an asset the deploy does not carry — a broken card is
   worse than none, because it reads as a site that does not work.
4. ✅ **Finding 4's contradiction resolved** — the exclusion is superseded in place rather than
   deleted, so the reversal stays visible: the repo/website distinction it drew was true, the
   conclusion wasn't, because a project ships both.
5. ✅ **The first-app offer, at the Promises-cell moment** — Ajesh chose this moment over
   `boss new`. It did **not** become a loop or a new conscience moment. `pretotype-loop` set the
   precedent: it is *structural by default*, declares no `drift_moment`, and is **invited by
   `/canvas`'s graduation** rather than nagged by the conscience. A new moment would also have needed
   an authored voicing frame — `check-manifests` probes the real function for one. So the offer went
   where the precedent said it belonged: the Done beat of `/canvas`.

   **What actually changed is framing, not surface.** The graduation sold the unlock as *"the build
   tools and the next mentors."* It now says what the unlock is **for**: a sharp Promises cell is the
   first moment the idea can be shown to a stranger. Naming only the build tools quietly taught that
   unlock means *start building* — the one inversion the skill exists to prevent.
6. ⛔️ **SUPERSEDED (v0.182.0) — do not build.** The proposal was a `site-drift-loop` with the
   predicate *"the page hasn't been touched since N `FEAT`s closed."* **`check:site` already does it,
   and better.** Each page fragment declares `covers:`, and the check compares the **actual change
   time of those sources** (the later of last-commit and working-tree mtime) against the page's
   `reviewed:` date — so it reports *which* source moved and when, rather than counting unrelated
   events as a proxy. It also separates severity the way this IDEA's own §"what's portable" section
   asked for: a broken claim is a hard fail, stale prose is a soft note.
   Building the loop would have added a **second, blinder watcher over one surface** — the exact
   addition [[EVID-001]] rules out (*compose and subtract, never add*). Note the irony worth keeping:
   the warning attached to this item was *"a loop that overstates its reach is worse than one
   admitting a gap"* — and the honest answer to that warning turned out to be that the loop had no
   reach left to claim.
7. **The demand-page count** — the smallest thing that lets a founder read their own threshold. Gated
   on someone actually running a demand page.

## 🔴 The two findings item 5 turned up, both bigger than the prompt

### At Quickstart, BOSS cannot put anything in front of anyone

L0 has real validation tooling — `/interview` (Mom Test), `/persona`, `/evidence`, `/research`,
`/canvas` — and `/prototype`, which builds something runnable **locally**. What it has no way to do is
**show a stranger a page**. Every page-shaped demand test is behind the MVP unlock: `/pretotype` (L1),
`/landing` (L1), `/ship` (L1).

So the sequence a Quickstart founder is actually walked through is:

> canvas says *"done enough to build"* → `boss unlock mvp` → **the build tools** → and only now, the
> tools for testing whether anyone wanted it.

**The demand test is gated behind the build unlock**, which inverts the thesis `/pretotype` opens
with — *"pretotype first; build only what demand justified."* The sharpest form: `/pretotype`'s
Artifact path needs **no host, no account and no deploy** — it is the cheapest thing in the entire
system, and it sits on the far side of the gate that exists to slow building down.

Item 5 fixed the *framing* (the graduation now names what the unlock is for). It did **not** move any
skill between stages, because that is a real stage-boundary decision with an EVID-001 cost — adding to
Quickstart is adding surface to the mode most protected from it. **Open, and the more important half.**

### Two fake doors, and only one of them knew the other existed

`/pretotype` publishes the fake door as an **Artifact** — composed from canvas People/Problem/Promises
plus `BRAND.md`, a real shareable URL in one turn, capture pointed at an external form because the page
stores nothing and says so. `/landing --demand` builds the same door **in-repo**, on tokens, shipped
via `/ship`.

`/landing` already said *"the demand page **is** `/pretotype`'s fake door."* `/pretotype` had never
heard of `/landing`. **One-way awareness between two implementations of one job** — the founder's route
depended entirely on which skill they happened to open.

Reconciled with a choose-by-**lifespan** table, not a which-is-better one: publish the Artifact when
you expect to throw it away (the default — *a demand test that waits on a deploy is the delay Savoia's
argument is about*), reach for `/landing` when the page will outlive the test.

## Refusals, decided up front

- **No new skills.** [[EVID-001]]'s mandate is compose-and-subtract; the surface is already 47 skills,
  15 agents and 15 loops. Every item above is a composition or a practice edit.
- **No CRO, no A/B infrastructure, no funnels, no heatmaps.** `landing-page.md` draws this line and it
  holds — useless at n≈0 anyway.
- **No website builder, no CMS, no hosting surface.** `design-system.md`: *"Don't build a sync engine
  or a hosting surface — that's the host's job, and building a second one is how this discipline
  becomes the thing it exists to prevent."*
- **`llms.txt` and kin go through `/vet` before anything ships**, even though §7 already reads well on
  it. *"You must add an llms.txt"* is precisely the stranger's must-do claim the NO-biased rubric
  exists for, and §7's own caveat — no provider has publicly committed to reading it — is the kind of
  claim that expires fast. Re-check on refresh.

## Related

[[IDEA-057]] (BOSS's own visual identity + the landing page — the parent; this is its maintenance
half) · [[IDEA-041]] (distribution as a conscience leg — owns the `/ship` moment this must not
duplicate) · [[IDEA-058]] (citation URLs — same *shipped-for-BOSS-never-sorted-down* shape) ·
[[IDEA-059]] (the detect-post-ship gap — a site going stale is the same missing leg, pointed at the
public surface instead of the test suite)

## Re-grade 2026-09-09 — the status line was two items behind its own build order

**It read `items 1-4 done, unreleased; 5-7 open`. The build order in this file says otherwise:**
1 ✅ (`/design-library` scans the public surface) · 2 ✅ (`/landing` composes from the design library,
three variants) · 3 ✅ (the share layer sorted UP into `landing-page.md`) · 4 ✅ (finding 4's
contradiction superseded in place) · 5 ✅ (the first-app offer at the Promises-cell moment) ·
6 ⛔️ **SUPERSEDED v0.182.0 — do not build** · 7 gated on someone actually running a demand page.

Nothing in it is unreleased. **`shipped`**, with item 7's gate intact — it re-opens on a real demand
page, which is a trigger, not a task.

**The half this record found and did not fix has now been fixed elsewhere.** Its sharpest finding —
*"At Quickstart, BOSS cannot put anything in front of anyone"*, flagged **"Open, and the more
important half"** — was closed in **v0.271.0**: `/pretotype` and `pretotype-loop` moved L1 → L0, so
the demand test no longer sits behind the build unlock. `/landing` and `/ship` stay at MVP by
decision, which this record already argued for: they make a page meant to outlive the test.
