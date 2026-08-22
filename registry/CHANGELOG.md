# BOSS Changelog

Each entry = a BOSS version. `/boss-sync` reads this to tell a project what's new since its pin.

**The `> **For you:**` line is opt-in, and the bar is high on purpose.** Add one ONLY if the release
changes something a BOSS user *does, sees, or can rely on* — a command, a fix they'd have hit, a
behaviour change — **or** if it integrates a new/updated best practice their project now inherits.
Everything else (audits, refactors, doc sweeps, internal tooling, this repo's own website) gets **no
line and never reaches oyeboss.build/whats-new.html**. Most releases should have no line. A release feed
that lists every version is a commit log, and a commit log is not useful to anyone building a company.

## 0.206.0 — 2026-08-21

> **For you:** **The conscience now watches the half of the canvas it had been ignoring.** If your
> project is sustained by your own hours rather than by revenue, the canvas asks how — *what keeps
> this alive, who else could carry it, what would make you stop* — and until now **nothing ever looked
> at those answers again**, while the money questions were watched continuously. The `sustaining`
> moment closes that. It offers two doors and means both: **revise the answer to what's actually
> true** (*"a weekend a month"* beats *"indefinitely"*), or **end it on purpose**.

**The asymmetry, stated plainly: the canvas asked both halves and the conscience watched one.** Across
15 moments and 18 loops there was **zero** mention of maintainer burnout, bus factor, contributor
pipeline or succession — while `drift` watched the bet, `margin-trap` the price against the cost,
`outpaced` the canvas against shipped work, and `cost`/`cost-stale` the spend. That quietly made BOSS
a tool for one kind of project while [[DEC-011]] and [[DEC-012]] claimed otherwise.

**It required the fifth predicate, and that is the load-bearing part.** The four existing predicates
are all relations between two files. `outpaced_by` is temporal but it detects **presence** — N files
newer than an artifact. **The commons half is falsified by absence**: a maintainer running out of road
doesn't ship three FEATs, they go quiet, and **silence cannot be written as a relation between two
files**. So `quiet_for: { path_glob, days }` joins a set whose own header says *"closed set; extend
deliberately."* First absolute-time predicate in BOSS.

**Why it is not cruel, structurally rather than by promise.** The conscience is a hook — **it only
runs while the founder is here.** Nothing observes them while they're away. So this never fires *at*
an absent person; it fires when they **come back**, which is both the only observable moment and the
only kind one. That's a property of the architecture, not a line in the copy.

- ⛔ **Not a productivity nudge, and it must never sound like one.** No streaks, no *"let's get back on
  track"*, no encouragement-shaped scolding. **A gap is data, not a verdict** — and it is the single
  most *predicted* thing about this kind of project, which is why the second branch exists at all.
- **45 days, not 21.** Three weeks is a holiday; six is a pattern. And the bar for speaking is the
  highest of any moment: it stays silent unless the project is sustained by someone's own hours *and*
  either a stated stopping condition has actually fired or the written arrangement has plainly become
  untrue. **The predicate counts days and knows nothing about why** — a baby, a job, an illness and a
  fortnight in the sun are identical to `mtime`.
- ⛔ **The bus factor is never raised as a criticism.** *"Nobody else could carry this"* is the ordinary
  condition of almost every good small project.
- **Verified firing and silent, on a real scaffold:** fires at 60 days quiet with a canvas and a
  devlog; silent when work resumes, silent at 30 days, silent with no canvas, and silent once the
  canvas is revised — *"touching the canvas silences it"* is the intended and only outcome.

## 0.205.0 — 2026-08-21

> **For you:** **BOSS asked about your licence once and then went quiet forever — which meant the
> closed answer won by default.** v0.200.0 stopped BOSS picking `proprietary` for you and made
> `license` start undecided. What it didn't do was ever come back. A project with no LICENSE file
> reads as *all rights reserved* to everyone who finds it, so *"not yet"* quietly became *"closed"* —
> **the exact failure that change existed to prevent.** `/ship` now asks, once, at the only moment it
> becomes real: the moment your code goes where other people can find it.

**A defect introduced three releases ago by the change that was supposed to fix it.** [[DEC-011]]
named the failure mode in its own words — *"a project that was never opened quietly stays closed,
because nobody comes back to it"* — and then shipped a mechanism that never came back. The ask was
built; the silence was left.

- **It lives in `/ship`'s pre-flight, which is already the right shape** — *"the check with teeth (NOT
  a gate)"*, whose privacy bullet is the exact precedent: *"going live is the moment user data starts
  flowing."* The licence counterpart is that going live is the moment your code becomes something
  other people can read and build on. **Just-in-time, not paperwork:** at Quickstart a licence is
  genuinely premature, which is why this arrives at MVP with deploy and not at spin-up.
- **Both costs in one breath, still leaning nowhere:** an open grant can't be taken back; a project
  nobody ever opened stays closed because nobody comes back to it.
- **`null` and `"undecided"` are now two different states**, and the distinction is the whole reason
  the question stops. `null` = **nobody asked**. `"undecided"` = **asked at the moment it mattered and
  chose to wait** — a decision on file rather than a blank, and BOSS never raises it again. Same shape
  as `dropped` vs `deferred` in v0.204.0, which is not a coincidence: *"decided against"* and *"never
  got to it"* are different facts, and a tool that conflates them is lying about its own state.
- ⛔ **Not a gate, and never a nag.** Once per project, then silence — whichever way they answer.

🔴 **Found alongside it and NOT fixed: the conscience watches the venture half and not the commons
half.** [[DEC-009]] gave the canvas a second sustainability branch — *what keeps this alive · who else
could carry it · what happens if you're hit by a bus · what would make you stop* — and **nothing ever
watches those answers again.** Across 15 conscience moments and 18 loops, zero mention of maintainer
burnout, bus factor, contributor pipeline or succession, while the venture half is watched
continuously (`drift` on the bet, `margin-trap` on price-vs-cost, `outpaced` on the canvas falling
behind, `cost`/`cost-stale` on spend). **The canvas asks both halves; the conscience watches one.**
That asymmetry is the open-source conscience gap, it is structural rather than speculative, and
closing it means a 16th moment — which is a decision about surface, not a patch.

## 0.204.0 — 2026-08-21

> **For you:** **`/sunset` now goes as far as it needs to.** It ended whole projects and zombie
> features; it could not end **an idea** — the cheapest and most common ending there is. `/sunset
> IDEA-012` closes one captured idea honestly, and it opens with the question that comes first:
> ***"did you decide against this, or did you just never get to it?"*** Only the first is a sunset.
> The second gets left alone — **BOSS will not talk you into closing an idea to tidy your backlog.**

**A status promised to keep something and nothing kept it.** `docs/IDS.md` defines `dropped` as
*"Decided against. **Kept for the reasoning**"* — and no verb ever captured the reasoning, so the word
was a hand-flip that kept whatever you happened to type. The ceremony shrinks as the thing gets
smaller; the honesty doesn't.

- **The idea scope is the lightest of the three** and subtracts more than it adds: no usage
  validation (nothing shipped), no deprecation notice (no users), no `boss retire` (not a project),
  and ⛔ **no `/boss-learn` harvest** — the other scopes harvest because something was *built* and a
  pattern was *proven*; an unbuilt idea has proven nothing, and routing it UP is how a practice shelf
  fills with things that merely sounded good. **The harvest doesn't shrink to this scale, it
  disappears.**
- 🔴 **Caught during the build, and it changed the design: the third question was about to collapse
  two statuses.** The draft asked *"what would bring it back?"* — but `deferred` is already defined as
  *"deliberately NOT being built, **with a written re-open trigger**"*, so a `dropped` idea carrying a
  trigger is a `deferred` idea wearing the wrong word. The question is now a **router**: name a
  condition → `deferred`; name none → `dropped`, decided on the merits. `docs/IDS.md` exists because
  this vocabulary once had six words in the spec and fifteen in practice; adding a fifteenth would
  have been a poor way to celebrate it.
- **Evidence the gap was real, from BOSS's own backlog:** across **67 ideas, `dropped` has been used
  exactly zero times** — while `deferred` (which [[DEC-009]] gave a written re-open-trigger practice)
  has 17. A status with no mechanism behind it doesn't get used; the one with a practice does. The
  router now makes that choice explicit instead of instinctive.
- **Ambiguous arguments get one question, not a guess.** A `FEAT` was built and has users; an `IDEA`
  was only ever thought about. Confusing them yields a deprecation notice for something nobody shipped,
  or a silent delete of something people depend on.

⛔ **Explicitly not built: a "program" scope.** BOSS has no epic/initiative record — the types are
IDEA, FEAT, DEC, EVID, PRAC, EXTR, RFC, EXP — so sunsetting one would mean a new spine through
`/board`, `/roadmap` and the backlog checker. That is a record-type decision and wants its own DEC,
not a quiet addition inside a scope release.

## 0.203.0 — 2026-08-21

> **For you:** **The README was selling a mentor board that doesn't exist.** It promised *"eight
> advisors"* and named **business, fundraising, pitch and talent arriving at V1**. Six ship,
> `mentor-fundraising` and `mentor-pitch` were absorbed into `mentor-capital` fourteen releases ago
> ([[DEC-006]]), and **V1 seats nobody at all** — that's deliberate, not a gap. Corrected: founder at
> Quickstart; architect, customers, capital and cofounder at MVP; **V1 adds none** (capital's remit
> widens instead); hiring at Scale.

**The stale-roster bug again, one surface out — and the check that exists to catch it looked straight
past this one.** `check-refs` class 4 was built after the release-readiness pass found the README
selling BOSS's gitignored dev workspace as founder features, and v0.192.0 widened it again when three
retired agent names sat in `<pre>` mocks on the public site for 27 releases. It matches **agent
names** (`mentor-fundraising`). The README says *"business, fundraising, pitch and talent"* — the same
claim in **prose**, with no `mentor-` prefix to match on. Third instance of one rule with an
under-read surface.

- **The site was already clean.** v0.193.0 swept it, and `gen-site` derives its roster counts from
  `stages/*/manifest.json` via `src/modes.js` — *"never typed by hand."* The README is hand-typed, so
  it is the one roster surface that can still drift silently. Filed as the obvious next mechanism:
  **derive the README's counts the way the site derives its own, or check them.**
- The V1 bullet was wrong in the same paragraph and is corrected too: V1 adds design-drift
  enforcement, `/board`, and `/design-library` — not mentors.
- ⛔ **The README's positioning lines are deliberately untouched** — *"tell a real business from a
  convincing demo"*, *"the discipline on top gets you a business."* Those still assume the destination
  the telos dropped in v0.200.0, and they are covered by the standing decision to leave outward-facing
  positioning alone until it's settled ([[DEC-012]] §5). **They are not drift; do not sweep them.**

**Charter recorded:** [[DEC-012]] — the range widens but the methodology doesn't; BOSS holds both the
Silicon Valley and the ancient ways of building without resolving them; the mission to build more good
is **unadvertised, never enforced, and never hidden from the founder** (an unstated goal shaping a
tool's nudges is a deceptive pattern by BOSS's own catalog — it stays honest only because BOSS is
inspectable by construction). Written *after* three releases of mechanism, per DEC-011's ordering.
[[IDEA-069]] filed and **not built**: every time-shaped question BOSS asks a founder points at *now* or
*how it ends*; nothing asks what a thing is meant to **outlast**.

## 0.202.0 — 2026-08-21

> **For you:** **A regulation is evidence, not a verdict — and the catalog now says so.** Every
> deceptive-pattern row with regulatory weight carries a `teeth` citation, and BOSS only ever limited
> those in one direction: *don't be frightened, this isn't legal advice.* It never said the other
> half — **a rule can be a safety floor or a moat, and a citation can't tell you which.** If you're
> genuinely challenging an outdated arrangement rather than hiding behind a rationalisation, BOSS now
> has a way to tell the difference **with you**, instead of quietly reading "regulated" as "settled."

**The humane lens had one failure mode guarded and the opposite one wide open.** Too-frightening was
handled. Too-conservative was not — and unguarded, *humane* drifts into *don't disturb anything*,
which is the opposite of what the practice is for.

**It is a test, not a permission slip, and that distinction is the whole design.** *"The rule is
outdated"* is the oldest cover story in this industry — said about taxi medallions, laboratory
certification, tobacco marketing. Shipping a paragraph that says *"rules can protect incumbents"*
would hand every founder a pre-written dismissal **in BOSS's voice**. So instead, three questions in
the shape the `deception` conscience moment already uses (**effect, not narrative**):

1. **Who benefits from the rule as written — named, not an abstraction?** If the only beneficiary you
   can name is "users," it's a rule that protects users.
2. **Who bears the cost if you're wrong — you, or the person the rule protects?** ⭐ The tell.
   **Reform absorbs its own downside; rationalisation exports it.**
3. **Would that person agree? Have you asked one?** Not a persona. One.

Three good answers and the row is inert for you — record it as a `DEC-NNN` with the answers in it.
⛔ **BOSS does nothing with the answer**: no gate, no block, no score. It exists so a founder doing the
harder, better thing isn't mistaken for one doing the easy, worse thing.

- **Reachability was checked, not assumed.** `/red-team --humane` says *"probe the rows; do not
  re-type them here"* and points only at `--surface`, which renders rows — so the judgment would have
  sat in a file that pass never opens. `/red-team` now points at it by name at the moment a founder
  says a rule is outdated.
- **Attribution is stated, not implied** ([[vet-verify-attribution]]): this is **founder judgment, no
  RVW behind it**, and both `provenance` and `provenance_public` now say so. The catalog's 89 rows are
  research-backed; these three questions are not, and the file must not blur that.
- **Nothing else moved** — no row edits, no new cell, no conscience-moment change (the live
  `deception` moment was already effect-based and already says *"if they keep it, that is their
  call"*), no website change.

🔴 **Found while verifying reachability, NOT fixed here:** `boss craft <practice>` prints the raw file,
so the **internal `provenance:` frontmatter renders into a founder's terminal** — on all 32 practices
that carry one, many naming `IDEA-NNN` / `REVIEW-NNN` records a founder's project does not contain.
`gen-site.js` enforces exactly this boundary for the website (*"the site renders ONLY
`provenance_public`"*, with a check that errors when the public field names internal things);
`check-refs.js` even documents the internal field as *"not published."* **The boundary is stated and
enforced on one surface and unenforced on the other** — the same one-directional-coverage shape this
repo keeps catching. Filed, not patched, so it gets its own release and its own check.

## 0.201.0 — 2026-08-21

> **For you:** **The canvas asks the planet question it had been promising.** The Metrics cell has
> always been headed *"meaningful success — for people and planet"* and then never asked about the
> planet: every sharpen under it was about people and the venture. It now asks the other half —
> *what does one unit of this consume, and does that grow with users or with success?* — with
> ***"very little, and here's why"* as a complete, honest answer.** Don't manufacture a footprint to
> look serious. If your growth loop **is** inference, `/ai-cost`'s cost-per-successful-outcome is
> already most of the measurement: read it once for the wallet, once for the world.

**A cell stated an intent it did not enforce — and the free giveaway had quietly dropped the intent
altogether.** The same cell said three different things across three surfaces:

- `stages/L0-quickstart/…/canvas/SKILL.md` — *"for people **and planet**"*, with a sharpen covering
  well-being, learning and resilience. **The planet is named in the prompt and absent from the ask.**
- `web/humane-product-canvas.md` — the **CC BY-SA 4.0 template given away one release ago**
  ([[DEC-010]], v0.198.0) — read *"for people as well as **the business**."* The planet was not
  softened, it was **replaced, by the business**, on the public artifact BOSS calls its front door.
- `web/canvas.html` — asked neither, leading with *"what people gain."*

All three now carry the same question and the same second half. **This is composition, not a new
cell** — the prompt already promised it; only the sharpen was missing ([[EVID-001]]: compose and
subtract). No new ceremony: a "negligible" answer is explicitly the common and correct one, the same
discipline the six shape questions already use.

- **Why it matters more here than on a generic canvas:** BOSS's founders are building AI products,
  where the footprint is not a fixed overhead but the variable cost — it scales with the thing you're
  trying to grow. The measurement already existed (`/ai-cost`) and was pointed only at the wallet.
- **Found by audit, in the [[DEC-011]] family:** the values layer said the right thing and the
  mechanism underneath it didn't. Fix the mechanism, don't restate the value.

## 0.200.0 — 2026-08-21

> **For you:** **BOSS stops picking your licence.** New projects used to scaffold as
> `proprietary / All Rights Reserved`, and `/boss` pitched it — *"so you keep both paid and
> open-source options open."* Now `license` starts as **undecided**, and `/boss` asks a question with
> both costs on it: an open licence is a grant you can't take back, **and** a project nobody ever
> opened quietly stays closed. Pick one, or say *not yet* and get no LICENSE file rather than an
> argument. Existing projects keep whatever they already chose.

**The default was doing a second job as the answer.** The reversibility argument behind
`proprietary` is true — a permissive grant, once published, cannot be revoked — and it is exactly
why this release does **not** flip the default to MIT: defaulting someone into an irrevocable public
grant is the same defect pointed the other way. So the argument stays and the answer goes. `license`
scaffolds as `null` in `boss new` and `boss adopt`; `/boss` puts the two failure modes side by side
and picks neither; its Rules line changes from *"never publish a permissive license by default"* to
*"never decide the licence for them, in either direction"*; the open options are listed first; and
the proprietary LICENSE template loses the paragraph that argued for itself — a LICENSE states
terms, it doesn't lobby. `visibility` keeps `private` as the *starting state* (nobody has checked a
minutes-old repo for a stray key) and `/boss` now offers public as a peer rather than an exception.

**And BOSS names a second destination.** *"…mentors the founder from idea to fundable/hireable
venture"* → **a thing that stands on its own: a company, a co-op, or a commons.** `CLAUDE.md` and
`docs/MENTORS.md`. **Principle 5** keeps *decide late, on evidence* and loses the pre-loaded *"private
repos, proprietary license"* — it now names the asymmetry in both directions.

- ⛔ **What is deliberately NOT built.** No co-op mentor, no commons mode, no `intent` axis.
  [[IDEA-067]] rungs 2 and 3 stay `deferred` on their existing triggers. **n=0 is still n=0** —
  cooperative-structure counsel built for a founder who hasn't appeared is the charter-widening
  [[DEC-009]] refused, in a better hat. And **the website is untouched**: mechanism first, claim
  second. BOSS doesn't get to say *"co-ops, commons, tech for good"* on a landing page in the same
  release it changes four defaults.
- **The falsifier that matters** ([[DEC-011]]): if **n ≥ 1** founder open-sources through the new
  prompt, later needs to earn from the work and can't, BOSS caused the harm the old default
  prevented. One occurrence is enough to revisit.
- **Supersedes [[DEC-009]] §5 only.** DEC-009 — the same day — fixed a real defect (a founder who
  would never charge had to fabricate a revenue line) and then held the positioning fixed. The
  positioning is what changed here; DEC-009's canvas branch and `/money` stop are untouched.

## 0.199.0 — 2026-08-21

> **For you:** **`boss id` and `boss records` were invisible.** Both shipped, neither was registered
> in the one list `boss map`, `docs/CHEATSHEET.md` and the quick guide all read — so two working
> commands existed and nothing told you about them. They're in all three now.

**Two shipped commands were missing from the single list that exists to prevent exactly that.**
`STANDING_COMMANDS` in `src/modes.js` is the one place both generators read, and its own comment
says *"two copies is how the cheatsheet drifted the first time."* `boss id` (next free record number,
computed) and `boss records` (duplicate IDs, off-list status, broken promotion links) were added to
`src/cli.js` without a line there. `check:site` caught them as unknown verbs on the website — a soft
note, because an unrecognised verb *may* still be valid — which is the right severity and also the
reason they sat unnoticed.

**The landing page now shows BOSS working instead of describing it.** Feedback via Ajesh: *"people
are struggling with which kind of projects they could use this to… the value is not being seen."*
Graded as [[EVID-002]] — **stated-pain, n=1-2, solicited**, which is the weakest form of signal there
is and close to the anti-pattern `/interview` exists to prevent. **The audit it prompted was the part
that justified acting:** zero example projects anywhere on the site (`my-app`, 14 times, was the only
project name), zero audience statement, and 14 of 14 pages describing BOSS's machinery rather than a
founder's project — facts about the site, true whether or not anyone complained.

- Home opens with **three concrete shapes** it fits (two people cleaning houses · the spreadsheet
  twelve people fight over · something already live getting an AI feature) and — new — **who it is
  NOT for**: a codebase that already has a product team, and a weekend throwaway where `git init` is
  enough.
- Then **one worked example, copied from a real terminal**: `boss new`, the `IDEA-001` file `/triage`
  writes, and `boss board` rendering *"2 captured, nothing pressure-tested yet — what would you learn
  first?"* Nothing on the site had ever shown BOSS doing its job.
- Two paragraphs of the scaffolding metaphor **cut** — the example does that work by showing.
- ⛔ **Deliberately NOT done: no nav restructure and no new page.** n=2 solicited does not earn it,
  and the session's own habit of answering every gap with another page is what a 14-page site
  strangers cannot parse is made of.

🔴 **Found while verifying the above: the landing page had TWO footers, and the second one carried a
hand-typed version 35 releases stale** (`v0.164.0` against a live `v0.199.0`) — sitting directly under
`gen-site.js`'s own headline rule, *no number on the website is ever typed by hand*. Every visitor read
the honesty note twice, once wrong. The fragment held a full copy of the shell's footer; deleted, with
its two better sentences ported UP into the shell so all 15 pages gained them instead of one page
keeping them. **`gen:site` now hard-fails on a fragment that declares `<footer>`** — the rule existed
and nothing enforced it, which is the eighth time that shape has shown up here.

**Also:** `npm test` was red on a dangling link to `.boss/model-profile.json` — runtime state
`/recalibrate` writes, hard-linked from a dated audit. Un-linked rather than exempted: one occurrence
repo-wide, and a blanket `.boss/` exemption would be a real hole in `check:refs` for n=1.

## 0.198.0 — 2026-08-21

> **For you:** The **Humane Product Canvas** is now a free thing you can just take —
> [a page](https://oyeboss.build/canvas.html) and a Markdown template, **CC BY-SA 4.0**, no install, no
> signup, no email. It's the one-page canvas BOSS's `/canvas` skill is built on: everything Lean and
> the Business Model Canvas cover, plus two questions neither of them asks — **who this could harm or
> exclude**, and **the principles you'll hold when holding them costs you something.** Print it, fork
> it, teach from it. The tool is for when you want something to keep asking; the framework is yours
> either way.

**The only thing BOSS has that works without installing BOSS — so it is given away on purpose.**

- **Ships as a page plus a template**, not an app. `web/canvas.html` sits at **top level in the nav,
  a peer of Start**, because a free front door buried under "The product" isn't a front door.
  ⛔ **No interactive state** — build the view, refuse the app ([[IDEA-034]]). A fill-in-the-boxes
  page with saved answers brings accounts, sync and a support burden; *"if you want it to remember
  your answers, that's what BOSS is for"* is honest rather than coy.
- **The frames were deliberately left out.** Rendering one set of answers as Lean or BMC is **BOSS's
  feature, not the canvas.** Publishing the humane canvas is the offer; multi-frame rendering is the
  reason to install the tool. Everything else came off too — `EVID` ids, skill references, the
  graduation gate, the live/dormant cell machinery. **Keep the questions, drop the machinery: if the
  standalone version needs BOSS to make sense, it isn't standalone.**
- **CC BY-SA 4.0, by precedent.** Both the Lean Canvas and the Business Model Canvas are offered
  under it, and a humane canvas published under something more restrictive would be conspicuous.
  Neatly consistent, too: **v0.195.0 was the release that stopped assuming every project is a
  business and made room for Creative Commons work** — this is BOSS doing that rather than
  recommending it. The template carries the v0.195.0 **two-branch business-model cell**, so a
  non-commercial reader gets the sustaining questions rather than a revenue prompt.
- 🔴 **It was blocked for one round on attribution, and that was the right call.** The canvas is
  credited *"Humane Product Canvas by Ajesh Shah"*, and a standing note on its lineage described a
  hackathon he built **with** someone — enough ambiguity that publishing would have staked a public
  byline on a possibly-shared work. **Asked directly rather than assumed. Sole authorship
  confirmed**; the hackathon is the *venue and the network*, not co-authorship, and the lineage note
  now says which is which. **The cost of asking was one question; the cost of being wrong would have
  been a correction, not an edit** — which is the standard `/governance` already holds everyone else
  to (*"an attribution is a citation's load-bearing half"*).
- 🔴 **Caught before it landed: the announcement above pointed at a domain BOSS does not own.**
  This entry's own `For you:` line — the release whose whole point is *"here is a free thing, go
  take it"* — linked **`boss.build/canvas.html`**. `boss.build` has been registered to someone
  else **since 2026-01-16**, five months before BOSS chose the name; it is why the domain moved to
  `oyeboss.build` ([[DEC-002]]). Not a 404 — a founder following the one link in the giveaway
  release lands on a stranger's site. **And it would not have been clickable either:**
  `gen-site.js`'s inline renderer handled code, bold and italic and **not links** for the site's
  whole life, which held only because no `For you:` line had ever used one. This was the first, and
  it published the literal string `[a page](https://boss.build/canvas.html)` into the public feed.
- **Both are now mechanisms, not corrections** — `check:site` gained an **origin** rule (the same
  class of load-bearing string as the install line it already guards, with the nastier failure mode)
  and a **raw-Markdown** rule, and its surface scan now reads the **built `site/`** as well as the
  `web/` source. That last part is why it could not have caught this before: **the release feed is
  injected from this file at generation time and exists in no source fragment**, so every generated
  claim was outside the checker's reach — *the same scope gap that let `npx bossbuild` sit on the
  demand page* (v0.194.0). ⚠️ **Widening it also exposed that the existing GitHub rule was too
  strict** — it read every `github.com` link as BOSS's own repo, and the credits and engineering
  pages cite other people's by design. Now it flags only *our* repo name under the wrong owner. The
  raw-Markdown rule skips mocks for the same reason v0.193.0 had to see into them: `credits.html`
  shows the literal line `boss credit` writes into a README, where raw Markdown is correct.
  *(Eighth instance of [[checkers-state-intents-they-dont-enforce]] — and the second running where
  the gap was SCOPE rather than logic.)*
- ✅ **The licence was decided before the door closed, not after** ([[DEC-010]]). BOSS's own argument
  applies to its own artifact — *"a permissive open-source grant, once published, cannot be
  revoked"* — so it was confirmed while the site is still undeployed and the grant is still
  theoretical. 🔴 **And BY-SA turns out to be the reversible-in-the-useful-direction pick:** as sole
  copyright holder Ajesh can offer the same work under a *more* permissive licence any day, but no
  licence can claw back copies already distributed. **Of the two credible open options, BY-SA
  preserves optionality and BY spends it** — the same reasoning `/boss` uses to default a founder's
  project to proprietary, one notch along the same axis. Share-alike is the point rather than a
  hedge: adaptations return to the commons instead of being enclosed. Commercial use stays allowed,
  because NC would block the consultancies, accelerators and educators who actually spread a canvas.

## 0.197.0 — 2026-08-21

> **For you:** If you have ever edited a skill or agent BOSS installed, `boss sync --apply` used to
> overwrite it without asking. It no longer does — a managed file you changed is **left alone** and
> reported by name, and `/boss-sync` (or `--force`) decides what to do with it. Files that predate
> this release get copied to `.boss/backups/` before being written, because BOSS genuinely cannot
> tell whether you touched them.

**BOSS would not delete your work, and would replace it — three functions apart, in the same file.**

Found by running `/boss-sync` on BOSS's own repo and reading the plan before applying it.

- 🔴 **The asymmetry.** `--remove` already refused to delete an edited file, with a comment saying
  why: *"the founder changed it, which makes it theirs."* `applySync` overwrote that same file with
  an unconditional `writeFileSync`. Same file, same edit, opposite treatment.
- 🔴 **And the help text promised otherwise** — *"Only files BOSS itself stamped are ever candidates;
  your own skills and agents are invisible to sync."* Half true: `planSync` matched on **path plus
  content**, with no provenance check anywhere. A file whose *name* isn't in a stage manifest is
  genuinely invisible; a file you wrote that happens to share a name with a shipped artifact was
  fully visible and first in line to be replaced. Seventh instance of the house pattern — read the
  comment, then test the code against it.
- **Why it was worse than it looks:** plenty of projects gitignore `.claude/`. BOSS's own repo does
  (`.gitignore:50`). So the overwrite left no `git diff` and no history to revert from — and
  `/boss-sync`'s own step 3 is *"show `git diff` and let the user review."* The review mechanism did
  not exist for the directory being written.
- **The fix is a provenance ledger** (`src/managed.js`, `.boss/managed.json`): a `{ path: sha256 }`
  record of what BOSS wrote, stamped at scaffold, unlock and sync. It makes answerable the one
  question that decides whether an overwrite is safe — *did you change this, or did BOSS move on?* —
  which a `changed` status alone cannot answer, being true in both cases and meaning opposite things.
- **Tri-state, and the third value is the honest one** (the same shape `orphanEdited` already used):
  `false` → BOSS wrote it, untouched, written. `true` → yours, **never** written, reported by name.
  `null` → unknowable, because BOSS wrote it before the ledger existed. Null is the *normal* case
  for a while, so it is neither refused (that would break updates for every existing project) nor
  overwritten blind (that is the bug) — it is **backed up, then written**.
- **The re-break it would have caused, avoided:** stamping the whole tree after a sync would record
  the *founder's* bytes for a file BOSS deliberately skipped, so the next run would read it as
  untouched and overwrite it silently. Skipped files are excluded from stamping, and there is a test
  that fails if that ever stops being true.
- **The ledger is never back-filled.** A file that merely exists on disk gets no provenance. That is
  what keeps BOSS's own hand-built `.claude/` safe: it shares filenames with shipped templates and
  BOSS wrote none of it.
- `.boss/backups/` is gitignored in the scaffold — local recovery, not project history.
- **BOSS's own manifest corrected.** It claimed five agents (`pm`, `coder-generalist`,
  `mentor-venture`, `tester`, `program-manager`) and nine skills, and **not one of them exists on
  disk**; meanwhile `.claude/` holds 19 agents the manifest never mentions. The arrays were
  aspirational at creation — the note said so — and then outlived the names, four of which were
  retired in v0.189.0. Now empty, which is the truth, with a note saying what that directory
  actually is and that `sync --apply` is the wrong operation for it. **The 0.6.0 pin is left
  standing**: it is the vintage of a hand-retrofit that really did happen, and `boss status`
  reporting drift against it is correct rather than noise.
- 9 new tests (167 → **176**).

## 0.196.0 — 2026-08-21

> **For you:** BOSS now notices when your **canvas** has fallen behind your own product. If three or
> more features you marked `shipped` are newer than the canvas, it says so once — because a canvas
> describes a product, and when things have shipped and it hasn't moved since, it describes a product
> that no longer exists. It fires on **shipped**, not on drafting: writing three specs is building,
> and building is not drift. Touching the canvas silences it. It never rewrites the canvas for you.

**BOSS's conscience could see what was never made, and half of what stopped being true. This closes
the other half — and BOSS's own repo is the reason it exists.**

- 🔴 **The n=1 was BOSS.** Its own canvas sat at **v0.3 for 80 days while ~154 releases shipped.** By
  the time anyone looked, its roster cell named **eight retired agents** and listed three
  internal-only surfaces as founder features. **Nothing in BOSS noticed**, because nothing was
  watching that relationship — it was found by hand, twice, on two surfaces, in two consecutive
  releases. `outpaced` is that discovery turned into a predicate.
- **A tighter mapping than the one `harvest` deferred.** v0.190.0's `harvest-loop` deliberately left
  the canvas alone: *"evidence bearing on a canvas cell is a looser mapping, and a looser mapping
  means more false fires on the one loop whose whole risk is crying wolf."* That reasoning stands.
  **This loop watches a different relationship** — not evidence outpacing the canvas, but **shipped
  work** outpacing it. Whether shipping bears on "what is this product" is not ambiguous; it
  definitionally does.
- **`outpaced_by` gained an optional `pattern`, and it is the part that keeps the loop honest.**
  Without it the entry reads *"three FEAT files changed"*, which fires when a founder **drafts** three
  specs. **Verified end to end on a throwaway project:** three `shipped` FEATs newer than the canvas
  → the loop **opens**; touch the canvas → **silent**; flip the same three to `building` and make
  them newest again → **still silent.** The filter matches the base status word, never the whole
  value — `shipped (v0.1 — slice 2)` is well-formed, and comparing the full string is the bug that
  mis-filed 12 of 31 cards on BOSS's own board.
- 🔴 **`npm run check` did not exist, and its absence caused a real error in this session.** Ten check
  scripts, no single entry point — so verification was hand-rolled as a loop over exit codes, and
  **three of the ten (`manifests`, `site`, `wayfinding-drift`) print errors and exit 0 unless passed
  `--strict`.** A hand-rolled loop reads those as passes. It did not mask anything this time (every
  check was re-run in hard mode and is genuinely green), but **the method could not have told the
  difference.** `npm run check` now runs all ten in the mode that matters, and was verified to exit 1
  on a real failure and 0 when clean. *(The release gate was never affected — `release.js` already
  passes `--strict`.)*
- ⚠️ **And the gap was found the same way it always is.** The new loop file was added without being
  declared in the stage manifest, and `check:manifests` reported **PASS** — the reverse check exists
  and is an error, but the soft exit meant the hand-rolled harness never saw it. **The check was
  right; the way it was being run was wrong.** Which is the eighth instance of the pattern, pointed
  at the runner instead of the checker for the first time.

## 0.195.0 — 2026-08-21

> **For you:** If your project isn't trying to make money — open source, Creative Commons, a research
> tool, something you're building for friends or for fun — BOSS was quietly making you lie. The
> canvas's **Business Model** cell was the only one in its group with no condition on it, so it
> counted toward leaving Quickstart for every project, and its follow-up questions were *"who pays,
> how much."* You had two bad options: invent a revenue line, or leave it blank and read as
> permanently unfinished. **Now the cell asks the question it always meant to ask.** Its actual
> prompt — *"how will you sustain this without compromising your promise?"* — was already right for a
> maintainer; only the follow-ups assumed money. There's a second set now: what keeps this alive, who
> else could carry it, what happens when you get bored or busy or hit by a bus, and what would make
> you stop. **`/money` also stops routing you.** It used to read *where you are* in the money arc with
> no branch for *not being in it*, so it would point you at `/interview` to go get a yes you never
> wanted. It now says the verb doesn't apply, and stops. **None of this makes the question softer** —
> most open-source projects die of maintainer exhaustion, not of a missing business model.

**BOSS is an incubator. It should not have been assuming a business** — and those turned out to be
different things, with only the second a defect ([[DEC-009]]).

- 🔴 **The audit's good news is most of it.** Commercial intent was *not* baked in everywhere.
  Licensing is handled **and argued** — `/boss` offers MIT / Apache-2.0 / AGPL-3.0, and the
  proprietary default rests on a reversibility argument (*a permissive grant, once published, cannot
  be revoked*), which is the correct way round. `mentor-capital` already holds *"open-source / free…
  OR not monetized at all (some tools should stay free)"* as a first-class structure. `/money` was
  already stage-gated, `margin-trap-loop` already dormant pre-revenue, and `/sunset` is the standing
  precedent that not every project must grow. **Naming what was already fine is what kept the fix
  small enough to be worth making.**
- 🔴 **The cell never needed re-framing — its *sharpen* needed a second branch.** The humane prompt
  was intent-neutral the whole time; the commercial assumption lived one column to the right. That is
  composition over an existing prompt, and the gating idea it leans on ([[DEC-004]]: a dormant cell
  never counts against graduation) was already load-bearing under three neighbouring cells.
- **`/money` was giving actively wrong advice, not merely staying silent.** *"Stop. Don't build a
  payment rail for a customer who doesn't exist… the move is `/interview` or `/pretotype` to get the
  yes"* is correct for a founder who intends to charge and hasn't yet. Aimed at someone who never
  intended to, it is BOSS selling. The new branch refuses it by name and points at the canvas instead.
- **BOSS is its own n=1.** It is MIT-licensed, and its own canvas answers that cell with
  *"calm-company / OSS / patronage… no pricing decision is honest before then"* — **a well-written
  deferral in a cell with no honest way to hold one.** Same family as [[DEC-006]] (BOSS shipped a
  heavier org than the incubator it models): the gap was visible from inside its own repo.
  **And it was the first thing run through the new branch.** BOSS's own canvas (v0.4) now answers
  both halves: the earning deferral stands, and the sustaining half is filled from evidence rather
  than assertion — **196 of 196 commits from one human**, bursty with four zero-commit weeks, **bus
  factor 1**, and a stopping condition dated to [[DEC-009]]'s own `revisit_by`. 🔴 **The succession
  question came back "haven't decided" and is recorded as a live hole, not filled** — an MIT project
  other people can install, one maintainer, no archive-or-handover decision. **A named hole was the
  correct output; a plausible plan would have been the failure the branch exists to prevent.**
  ⚠️ Correcting that canvas also surfaced **eight retired agent names and three internal-only
  surfaces listed as founder features** in its own roster cell — the same two drifts swept off the
  public site one release earlier, still sitting in BOSS's own record.
- **The structural finding, captured and deliberately not built.** All eight cohorts answer *"how much
  do you already know?"*; **none answers *"what is this for?"*** Intent is a real second axis
  ([[IDEA-067]] rung 2) and it stays **`deferred` at n=0**, along with the non-commercial support that
  would sit on it — maintainer burnout, contributor pipeline, governance-as-succession,
  funding-for-sustenance. ⚠️ **The positioning does not change either**, and DEC-009 states the cost
  that buys: a CC/OSS founder evaluating BOSS has no way to know they won't be pushed toward a
  business model. Accepted, because claiming support that isn't built is the worse failure.
- ⚠️ **`check:refs` caught the first draft.** The canvas note attributed *"some tools should stay
  free"* to `mentor-capital` — an **L1** agent quoted from an **L0** skill, so a Quickstart founder
  would have been pointed at someone they don't have. Re-attributed to BOSS itself, whose position it
  is anyway.

## 0.194.0 — 2026-08-20

**Four things that were built and left half-attached — plus a release that numbered itself twice.**
Nothing here is new surface: 0 new skills, 0 new practices, 0 new commands. Every item is a
finishing move on work that already existed and was one step short of counting.

- 🔴 **Two different releases both called `0.191.0`.** Two sessions wrote this repo the same
  afternoon and each cut a version: the board-classification fix and the canvas-frames release,
  same number, neither a superset. This is the **second occurrence** — v0.177.0 was written twice
  the same way — and last time it was caught by reading, not by a check. Renumbered by content
  rather than merged, because they are genuinely two releases: canvas frames keeps `0.191.0` (the
  number the website and the following entry already cite), the board fix becomes `0.192.0`, and
  the website-roster release becomes `0.193.0`. That entry was also **dated 2026-08-21** — a day
  that had not happened yet.
- 🔴 **The demand page's one call to action installed a package that no longer exists.**
  `pretotype/index.html` — the fake door whose entire job is measuring whether anyone wants this —
  read `npx bossbuild` right through the rename to `oyeboss`. It survived because `check:site`
  scans `web/`, and this public page lives outside it. **The check's own header promises to catch a
  page naming something we removed**; it simply could not see this page. Now it does — the scan
  takes a surface list, not a directory. *(Seventh instance of header-states-an-intent-the-code-misses,
  and the second in two releases to be a scope gap rather than a logic bug.)*
- **BOSS's front door had no share card, and the practice it ships teaches one.** `og:image`
  appeared **0 times** in the shell for the site's whole life, so every link BOSS posted previewed
  as text — on the surface whose first impression *is* the card. It had been deferred on two
  blockers, both now gone: the domain was registered 2026-08-20, and the asset now exists as
  `web/og.png`, rendered from `scripts/og-card.html` so it can be **re-rendered rather than
  re-invented**. Shell ships `og:image`, its dimensions, alt text and `summary_large_image`.
  Guarded in **both** directions — a page declaring no card fails, and so does a page pointing at an
  asset the deploy does not carry, because a broken card reads as a site that does not work.
- **Citation debt: 18 of 20 → 1 of 20.** Every URL was **fetched and read before it was written
  down**, never recalled — the rule `/vet` step 3 already stated, applied to the backlog that
  predated it. Two attributions bent under that check and were corrected rather than filed:
  **`ParallelChange` is Danilo Sato's**, not Fowler's, though it sits on Fowler's bliki (the credit
  is now split and the link points at `MonolithFirst`, which is his); and **`anthropics/skills`
  holds the Agent Skills spec and template, not a skill named `skill-creator`** — the source is now
  named for what is actually there. *(n=5 on "verify the attribution, not just the claim".)*
- **The last citation is a decision, not debt.** Karpathy's verifiability line — *traditional
  software automates what you can specify; LLMs automate what you can verify* — resolves only to
  secondary write-ups; the primary is an X post and a conference talk, neither confirmable as the
  source of that wording. It stays `url: null` with the search recorded in `url_note`. **Zero would
  have required inventing a plausible link, which is the exact failure the rule exists to catch** —
  so the honest floor here is one, not zero.
- **Two release-gate blockers cleared, both left by a rename that stopped one file short.**
  `mentor-hiring` **ships at Scale and was named nowhere in Scale's `CLAUDE.md` contribution** — so
  every founder who unlocked the mode got the one mentor built for their bottleneck and was never
  told, in the file Claude reads to learn who is on the team. *(Exactly the `mentor-cofounder` bug
  from v0.178.0, in a different stage — the gate written then is what caught it.)* And `/comp-eval`
  had shipped in v0.190.0 without ever reaching `GUIDE.md`, the one doc meant to walk the whole
  ladder; it is now named where a founder would look for it, with the boundary [[DEC-008]] drew —
  **research is context, never evidence** — stated in the same breath.

## 0.193.0 — 2026-08-20

**The website described a roster that hasn't existed since v0.164.0, and the check written to catch
exactly that was looking in the wrong half of the page.**

- 🔴 **Three retired names, live on the public site.** The homepage terminal mock — captioned *"what
  that actually prints"* — printed `agents: pm, coder, mentor-founder`; `pm` was superseded by
  `product-lead` 27 releases ago. `/keeping-track`'s record mock showed `owner: pm`. `/team` and
  `/guide` both described *"a database architect"* arriving at V1, an agent **`/whats-new` announces
  the removal of on the same site**. `boss new` was run to capture the real output rather than
  retyping it from memory.
- 🔴 **Why `check:site` missed all of it, in its own words.** Its header promises to catch *"a page
  that names a skill we removed"*, and it does own an agent-name scan — scoped to `<code>` tags. Every
  stale name was somewhere else: two inside `<pre>` terminal mocks, two in plain English. **The mock
  is the strongest claim on the site** — it is presented as literal output — and it was the one place
  the check could not see. The scan now runs over `<pre>` blocks too, feeds the same `--strict`
  release gate, and was verified to fire and to block in both directions. *(Sixth instance of
  header-states-an-intent-the-code-misses.)*
- **V1 hires nobody, and the site said the opposite.** [[DEC-005]] and [[DEC-006]] left L2 with
  **zero agents**, and moved `/design-review` + `/ux-check` down to MVP. `/guide` and `/quick-guide`
  still told founders the next tier of mentors and *"real designers"* arrived there. Corrected, and
  the emptiness is now stated as the deliberate thing it is: the rung that adds two ways to *see*
  what you built rather than more people to build it.
- **The canvas is no longer described as one framework.** `/guide` still presented the Humane Product
  Canvas as *the* canvas — the exact inheritance [[DEC-004]] overturned. It now says what shipped in
  v0.191.0: you answer questions, the frame is a view you switch (`--frame lean|bmc`), switching
  re-renders rather than re-interviews, and **Risks & Harms and Principles render in every frame** —
  un-defaulting the framework was never meant to make those optional.
- **The prose gap closed to zero.** v0.189.0 measured it: **10 of 48 skills and 5 of 11 agents
  appeared in the generated reference table and in no hand-written sentence anywhere.** Both counts
  are now **0**, and the omissions were as telling as the number — `mentor-capital`, the coach the
  last two releases were about, plus the entire AI-product engineering set. New prose:
  `/engineering` on why *"it works"* isn't a claim you can make about a model (`/ai-first-init`,
  `/evals`, `/judge-traces`, `/ai-cost`, `/cost-review`); `/governance` on the second door into the
  library — `/extract` and `/boss-learn`, the pattern you proved rather than the claim you read;
  `/team` on the mentors that exist mainly to say *not yet*; `/conscience` on the harvest moment and
  `/drift-deep`; `/guide` on `/comp-eval` and `/roadmap`.
- **Two shipped CLI behaviours nobody had claimed.** `boss board <ID>` / `--detail` on
  `/keeping-track`, and on `/start` — the page whose argument is *"a clean exit is what makes the
  entrance safe to try"* — that `boss remove` **exports the venture brain to
  `docs/venture-brain.md` before deleting anything.** Both were run against a throwaway project
  before being written down.
- `reviewed:` bumped on the four pages actually re-read end to end, and **not** on the four edited in
  one section only. A review date is a claim like any other.

## 0.192.0 — 2026-08-20

> **For you:** Your board was probably lying to you. A status like `shipped (v0.3.0 — the pull half)`
> is well-formed BOSS — the vocabulary doc *encourages* the detail — but the board compared the whole
> string, so any status with a parenthetical fell through into **Captured**. On BOSS's own board that
> was **12 of 31 cards**: eight shipped and four in build, all filed as raw ideas nobody had touched.
> Fixed. Two more things came with it: every card now carries a one-line **gist** (`boss board
> --detail`, hover on `--html`, or `boss board <ID>` for one card in full), and `deferred`/`dropped`
> work folds into **Parked** instead of sitting in Captured looking like a decision you still owe.
> On BOSS's own backlog that second change took Captured from **31 cards to 1**.

**A board that miscounts its own columns is worse than no board — it makes finished work look
unfinished, and finished work gets rebuilt.**

- 🔴 **The classification bug.** [`docs/IDS.md`](../docs/IDS.md) declares a closed seven-word
  vocabulary and says a status must *start* with one of them, with free-form detail after it
  "encouraged". `src/board.js` tested `status === 'shipped'`. Every well-formed detailed status
  missed. The board's own header comment has said **"Frontmatter is truth"** since v0.36.0 — the
  header stated an intent the code did not enforce, which is now a four-for-five pattern in this
  repo's audits. `src/records.js` had the correct `baseStatus()` parser the whole time and the board
  never imported it.
- **Three copies of that parser became one.** `check-backlog.js`, `records.js` and (missing) the
  board each owned the rule. `baseStatus` / `STATUS_VOCAB` / `isParked` now live in
  `src/frontmatter.js` — the module that exists *because* frontmatter parsing had already drifted
  into four implementations (REVIEW-2026-07-28 §D1). A fourth reader with no copy at all is the same
  failure wearing the opposite clothes.
- **Parked is a lane, not a column.** `deferred` and `dropped` are decisions with written re-open
  triggers, not backlog. They fold below the board, are never deleted (the reasoning is the point),
  and are excluded from `--next`/`--blocked` — which previously offered to `/canvas` an idea whose
  own record says the deferral is settled and DO-NOT-REHASH.
- **The gist — the answer to "what IS this again?"** A card was an id and a title, and after sixty
  records a title is a name, not a reminder. `gist:` is one plain sentence in frontmatter; where it
  is absent the board reads the record's own opening prose instead, so nothing goes blank. Authored
  wins, derived fills the silence — the same posture `shipped_on:` takes with its git fallback.
  `/triage` and `/spec` now scaffold the field.
- **Hover and expansion on the visual board.** Each card shows its gist clamped to two lines and
  opens on hover *or keyboard focus* (cards are focusable — a disclosure only a mouse can reach is a
  disclosure half the readers don't have). No script: this page has never had one. The status's
  free-form half, thrown away for the board's whole life, is shown alongside it.
- **Titles stopped being cut at 52 characters before the page ever saw them.** The terminal clips;
  the page wraps. "Temple culture layer — human-agent collaboration as…" was truncated by a
  terminal's width inside a card with room to spare.
- **`boss board --json` no longer prints a courtesy line above the object** on a retired project —
  one line of prose in front of a machine contract makes every consumer's `JSON.parse` throw. The
  JSON counts now match what the board renders, too; they disagreed by six.
- **BOSS's own backlog: 31 captured → 1.** The projection fix accounted for the first 19 (they were
  never captured, just misfiled). The rest is the same drift one level up: 12 real captures → 1. The same drift as
  the column bug, one level up: `exploring` means *being thought about*, `deferred` means *not being
  built, with a written re-open trigger* — and ten records carried the trigger in their own bodies
  while their frontmatter still said `exploring`. Two of them (**IDEA-017**, **IDEA-019**) say
  *"until then this stays exploring"* in so many words, written before `deferred` had a lane to go
  to. **IDEA-043** had already graded itself `NOT-YET`; **IDEA-066** already had a `## Gate`.
  Parked: **004** · **006** · **007** · **009** · **017** · **019** · **021** · **033** · **036** ·
  **043** · **052** · **066**. Nothing deleted — the reasoning is the point, and every one names
  what re-opens it.
  IDEA-007's load-bearing half already shipped into the ethos and voice notes and is explicitly
  *not* parked with it. **IDEA-038 is the only thing left in Captured** — a live internal defect
  (`library/` is read by nothing) with no external trigger, and parking a bug behind no trigger is
  how bugs get lost.
- **Two of those parks are worth reading twice.** **IDEA-036** was parked *despite* this session
  arguing it was the best fit on the board — it is positioning copy for a front door that is built
  and waiting on a URL, and copy written before the page gets rewritten. **IDEA-052 was parked with
  its trigger already FIRED**: `mentor-operations` gated on *"first-dollar exists"* and `/money`
  shipped in v0.157.0. It is parked anyway because building it means **adding a seat**, against
  [[EVID-001]]'s compose-and-subtract mandate from a founder whose own stated fear was app bloat.
  ***A fired trigger is a fact, not an obligation*** — and that is a distinction the board had no
  way to express until `deferred` had a lane.
- **IDEA-055 re-graded, and it says something about the hold.** [[EVID-001]] said *build nothing
  yet* on the orientation axis pending a second signal. No second signal has arrived — and v0.179.0
  and this release have both put real work on that exact axis, each arriving as a status line or a
  **bug fix** rather than as a program. Marked `building` because that is what is true; the hold
  stopped describing reality, which is the same failure this release fixed in the columns. What kept
  it harmless is that every piece **corrected or subtracted** surface and none added.
- **BOSS un-retired itself.** `.boss/manifest.json` carried `status: retired 2026-08-12` — a stray
  from `/tmp`-testing `boss retire` that landed on the real project. The per-machine registry was
  fixed on 2026-08-20; the repo's own stamp wasn't, so **every `boss board` run printed a
  tombstone.** Cleared through `boss retire --undo` rather than by hand. Its `bossVersion` pin is
  **left at 0.6.0 on purpose** — that is a true statement `boss status` uses to report drift, and
  editing it forward would claim a `/boss-sync` that never ran.
- **Two bugs this release introduced and caught before it landed.** Parking a record puts a banner
  at the top of its file, which became the first prose block — **four cards stopped saying what they
  were and started saying "PARKED 2026-08-20"**, a gist describing its own disposition when `status:`
  already carries that. Now a leading blockquote opening with a disposition word is skipped *whole*
  (its later paragraphs are boilerplate too), while a leading blockquote that is the founder's own
  words — often the sharpest sentence in the file — is untouched. Separately, `boss board <ID>`
  printed a **shipped date on unshipped cards**: `shipped_on` is derived from the `proof:` artifact's
  first commit, which exists for plenty of in-flight records. Claiming a thing shipped is the exact
  lie this release went and fixed in the columns.
- 13 new tests (154 → **167** passing), and `npm test` exits **0** — the 3 dead predicates open
  since v0.190.0 were cleared by a concurrent session during this work, not by it.

## 0.191.0 — 2026-08-20

**Canvas frames — the answer store gets its views, and the floor holds.** [[DEC-004]] settled in
v0.189.0 that the Humane Product Canvas was one frame rather than the spine — it had become the sole
spine by inheritance from a **v0.4.0 release note**, never by decision, and was carried unexamined
through ~180 releases. The cells it had been missing landed that release. **This is the other half:
the views.**

- **One set of answers, three frames** — `humane` (default), `lean` (Maurya), `bmc` (Osterwalder).
  **The founder never picks a framework.** They answer questions; the frame is a view they switch.
- 🔴 **The floor holds, and this is the whole point of the decision.** **Risks & Harms and Principles
  render in EVERY frame, including Lean and BMC** — appended under a plain *"two questions this canvas
  asks that Lean doesn't"*, never hidden and never apologised for. If a conventional frame could drop
  them, "humane" would become a preference a founder can decline — the argument BOSS already settled
  against an opt-in ethics mentor. **Un-defaulting the frame is not un-defaulting the ethics.**
- **A full answer→cell mapping ships with it**, so switching frames **never asks anything twice**. A
  founder who switches views and gets re-interviewed will not switch again.
- **`--frame` on an existing canvas is a RENDER, not an interview** — read, project, stop.
- **Empty cells render `_(not yet)_` in every frame.** Quietly omitting a blank to make a
  conventional view look complete is the same dishonesty as a filled-in guess, in a different layout.
- **Attribution is now per frame** — Humane Product Canvas by Ajesh Shah · Lean Canvas by Ash Maurya ·
  Business Model Canvas by Osterwalder & Pigneur. With three frames a single blanket credit would be
  wrong on two of them.

**[[DEC-008]] — desk research is context, not evidence, and never becomes an `EVID`.** This was the
blocker gating [[IDEA-066]]'s remaining Tier-1 research items, and the reason it had to be settled
before building any of them.

- **`EVID`'s ladder does not measure confidence in general — it measures what a PERSON did**
  (`stated-pain` → `observed-behavior` → `commitment`). A competitor's pricing page did none of those
  things. Filing it there is not a loose fit; **there is no rung it could honestly occupy.**
- 🔴 **The consequence that actually decided it: the conscience reads the evidence ledger and goes
  quieter when commitments exist.** So if desk research counted as `EVID`, **a founder could raise
  their evidence grade by googling** — an afternoon of competitor research would silence the exact
  nudge that exists to push them toward a real conversation, while the riskiest assumption stayed
  completely untested. And it would look legitimate while doing it.
- **Findings live in the artifact they inform** — `docs/competition/`, a canvas cell — **with a source
  URL and a `checked` date**, or marked `unverified`. That is `/comp-eval`'s rule generalised: it was
  written for the case where fabrication is most tempting, and turns out to be right everywhere.
  **No new ID type, no new ladder, no parallel store.**
- **Research can MOTIVATE an `EVID`, never substitute for one.** *"Three rivals charge $40, so go ask
  someone what they'd pay"* — the honest next step is `/interview`.
- **`/evidence` now names the boundary out loud**, because a founder who just ran `/comp-eval` will
  reasonably try to file a finding as evidence, and silence would accept it.
- **The honest cost:** research findings are not *countable* the way `EVID` records are. Accepted —
  a count is precisely what would make them feel like evidence.

**Also:** `check:refs` reached **zero findings** — the three loops asserting on `docs/devlog.md` came
good once BOSS started keeping one. The full suite is green for the first time in several releases.

## 0.190.0 — 2026-08-20

> **For you:** The deceptive-pattern catalog is now filtered by **what you're building**. `boss craft
> deceptive-patterns --shape mobile-app` (or `cli`, `edtech`, `chatbot`, `marketplace`… 14 shapes)
> shows only the surfaces you actually have; `--surface checkout-and-pricing` gives you the rows for
> the thing you're on right now, each with the honest version. Four surfaces are new — consent
> banners, tracking & telemetry, device permissions, and install/update — and `/red-team --humane`
> now tests all of them instead of five chatbot probes.

**"Are we still missing a bunch?" Yes — but the coverage gap was the third-biggest problem.**

Asked to audit the dark-pattern catalog across design, tech, marketing, opt-in, cookies, tracking,
security and data, three reviewers (the humane lens, the practice's owner, and a vibe-coder persona)
converged on a different answer than the question expected.

- 🔴 **`/red-team --humane` was manufacturing false confidence.** It ran **five** probes, all from
  the AI-chatbot subset, while everything RVW-056 → RVW-063 adopted — obstruction, drip pricing,
  manufactured urgency, interface interference, accessibility, minors, agentic-perpetrator,
  algorithmic management — had **no probe at all**. Worse, it told founders with "a purely
  functional internal tool" to skip; an internal tool with a checkout, a deletion flow and a scoring
  model is exactly where those live. A founder could get a clean pass and a dated artifact in
  `docs/red-team/` while shipping a roach-motel cancellation. **A pass that didn't test the thing is
  worse than no pass.** Now a conditional battery keyed to the product's real surfaces, with
  `--paths`' honesty rule (*name what you did not test, every time*) applied to it.
- 🔴 **The catalog is now DATA.** `library/deceptive-patterns.json` — 89 patterns indexed by
  **product shape × surface** — with the judgment split into `deceptive-patterns.md`. The old
  279-line prose file was `boss craft`'s one 2×-median outlier, and every consumer read it whole, so
  each pattern added made a founder *likelier* to skim past the four rows that were about their
  build. **The catalog can now grow without bound because the dose is filtered, not because the
  catalog is small** — `npm run check:patterns` warns if any single surface passes 12 rows.
- **Four surfaces BOSS never had**, because five sweeps had all been AI-product-shaped: `consent-ui`
  (the cookie-banner family — EDPB's six were *cited* since RVW-057 and never enumerated),
  `tracking-and-telemetry` (third-party pixel leakage on sensitive routes, session replay,
  training-on-user-data-by-default, fingerprinting after refusal), `device-permissions`, and
  `install-and-update`. Plus **Nagging** and **Forced Action** — two canonical families BOSS had
  pinned in its references and never actually held.
- **A `deception` conscience moment + `deception-loop`** — the first moment about code the founder
  may not have written. It watches for the shapes a model injects unprompted (a countdown with no
  deadline, a pre-ticked opt-in, confirmshaming) and asks one four-second question: *"There's a
  countdown in `Checkout.tsx:42`. Is there a real deadline behind it, or did the model write the
  countdown?"* Recording a `DEC` that you **kept** it closes the loop as cleanly as removing it.
- **`/ux-check` gets the markup walk**; **`/trust` gets Step 3.5** (the consent surface and what
  actually leaves the machine — the family with no UI, which `/ux-check` structurally cannot see);
  **`/canvas`** gets six surface questions that decide which families are live at all.
- **`harm-taxonomy` grows a third axis: the bystander** — the person who is not a user and never
  agreed to anything. Both existing frameworks ask what happens to *the user*; neither had a place
  for the harvested contact, the face in an upload, or the second party on a recorded call. Also
  makes `physical` reachable, which had been listed with zero patterns pointing at it.
- **`/humane-refresh --coverage`** — the sweep that asks what's **missing**, not what's **new**.
  Three consecutive what's-new sweeps shipped a catalog with no cookie-banner entry while the
  watchlist's own standing query claimed privacy/consent as a lane. A sweep scoped to "since June"
  cannot find what was already absent in June.
- Fixes: `data-schema.md` pointed at a "humane half" of `harm-taxonomy` that did not exist;
  `/onboard` promised to refuse three patterns "by name" and named none of their honest versions;
  the humane-lens watchlist never recorded the 2026-07-23 sweep (`check:freshness` reads practice
  frontmatter, not watchlist markers, so nothing caught it).
- Honest note: `consent-or-pay` and `ai-washing` ship marked `status: candidate` and render as
  **UNVETTED** — they are named because a founder meeting them deserves the name, and queued for
  `/vet` rather than quietly presented as settled. Two surfaces (`minors`,
  `content-and-moderation`) are flagged **thin** by the coverage checker and deliberately left thin;
  an empty cell is a research question, not a row to invent.

### `outpaced_by` — the conscience can finally notice something that stopped being true

**BOSS watched for what was never made, and never for what stopped being true.** Every conscience
moment it had was an *absence* predicate — *"you made an idea and no canvas exists"*, *"you shipped a
FEAT and no smoke check is recorded."* Nothing could say **"evidence landed and the artifact hasn't
moved since."**

That was **structural, not an authoring oversight**, which is why no amount of writing better loops
would have fixed it: `loop-runtime.js` had a closed vocabulary of three predicates — `exists`,
`count_at_least`, `any_file_matches` — and **all three test content or existence. None compares two
timestamps.**

- **`outpaced_by: { path_glob, behind, min }`** — N+ files under `path_glob` are newer than the
  newest file under `behind`. The runtime's **only temporal predicate**, and the first that can
  express decay rather than absence.
- 🔴 **It is not an age guess, and that distinction is load-bearing.** `src/board.js` deliberately
  refuses to infer staleness from age — *"a guessed signal would add noise"* — and **that refusal
  stands.** This asserts a *relational* fact instead: **B changed after A, so A has not accounted for
  B.** No threshold, no opinion about how old is too old, nothing to tune.
- **Fails safe.** A fresh clone resets mtimes, so everything looks the same age and the predicate
  under-fires. That is the correct direction for a conscience: a missed nudge costs nothing, a false
  one spends trust.

### `harvest-loop` — the first loop that uses it

The founder derived a persona (honestly labelled mostly guesswork), then did the harder thing: talked
to someone, or dropped in a transcript, and `EVID` records landed. **The persona was supposed to get
smarter from that** — `/persona enrich` exists precisely so it can — and nothing noticed when it
didn't. This is the runtime half of the accretion gap found earlier this week: the artifacts accreted
individually and nothing watched whether they kept up with each other.

- **Entry:** a persona exists, and ≥2 `EVID` records are newer than it. **Exit:** the persona is
  newer than the newest evidence — it caught up.
- **The exit is the same predicate with the arguments swapped**, which is why this needed no extra
  machinery. It is also **self-silencing**: run `/persona enrich` and the persona becomes the newest
  file, entry stops holding, and the loop goes quiet with nothing recorded anywhere.
- **Judgment-gated (`JUDGE_MOMENTS`).** The predicate compares file times and **cannot tell whether
  the new evidence is even about the user** — a signal about pricing or a competitor has nothing to
  say about who the persona is. So the model reads the new records first and **silence is a common
  correct output.** The frame ranks what it finds: *contradicts* the artifact is worth interrupting
  for; *merely adds* usually isn't; *unrelated* is silence.
- **It never offers to update the artifact silently.** The synthetic/real ledger is worth something
  only because a human watched it move; a background refresh is a synthetic read laundered into a
  real one, which is exactly what the ledger exists to prevent.
- **The canvas is deliberately NOT wired to this yet.** Evidence about a person bears unambiguously
  on the picture of that person; evidence bearing on a *canvas cell* is a looser mapping, and a
  looser mapping means more false fires on the one loop whose entire risk is crying wolf. Add it once
  this one has proven quiet.

Verified on a real scaffold and across four states: fires when evidence outpaces, goes quiet after an
enrich, respects the `min: 2` threshold, and **stays silent when no persona exists at all** — absence
is the other loops' job, not this one's.

### `/comp-eval` — the one business question you can't answer from your own head

Seed: Ajesh — *"if i say find me all the competition for x, features, pricing, differentiators. then
help do research and organize… and i can add names of new comp, and have it do the eval."*

This **narrows** the standing recommendation rather than overturning it. [[IDEA-066]] argued BOSS
should *structure and grade, not fetch* — the founder's host searches better than BOSS ever will, and
`/interview` and `/pretotype` both prep-but-don't-perform. That holds for market sizing, why-now and
channels. **It fails for competition, for one reason those don't share: you cannot list the
competitors you don't know exist.** Every other question on the canvas is answerable from the
founder's own head; this one has a tail they are structurally blind to, and the tail is where the
surprise lives.

It is also the only one with **a durable artifact that has a lifecycle** — rows get added, rows go
stale, rows get re-evaluated — which is what earns it a verb instead of a method attached to a cell.

- **Ships at MVP.** At Quickstart the canvas's *"what do they use today"* is the right-sized version.
- **`docs/competition/`** — a README table plus a file per rival, committing with the repo like
  `docs/personas/`. Add a rival and the others keep their own verification dates; **re-running never
  silently refreshes rows it didn't check.**
- 🔴 **The honesty bar is the whole skill, because the failure mode is so easy to hit.** A model will
  produce plausible tier names and dollar figures for a product it half-remembers, and a founder will
  paste them into a deck. So: **every factual cell carries a source URL and a `checked` date or it
  says `unverified`** — no "approximately," no remembered pricing, and **if you did not open the
  page, you do not know the price.** "Contact sales" is recorded as *not public*, which is itself a
  fact about who they sell to.
- **Every rival gets an honest `why they might win`.** If you can't write a real one, that's a
  finding — you don't understand them yet, or they aren't a competitor. *If every row ends in "…but
  we're better," you drew the landscape instead of looking at it.*
- **The rows founders leave off the slide are required**: a spreadsheet, an agency, an intern, a
  WhatsApp group — and **"doing nothing" is always a row**, and is often the incumbent.
- **It names what it did not find** — the spaces it couldn't search, the rivals it couldn't verify.
  The `--paths` honesty line, applied to research.
- **Refused:** composite scores or a leader quadrant (*a number that ranks rivals is a judgement
  wearing arithmetic*), and any tracking daemon — no pipelines, no alerts. Build the view, refuse the app.

**The ladder gate did real work here.** `check:ladder` refuses any new skill that hasn't declared
durable-vs-append-only, then refused again because a `seam` without a `seamNot` *"grows into the
practice."* Both are right: the seam is **write the rival's name and today's date, one line** —
because a pricing page carries no history and the survey can always be run later, while the
observation cannot be recovered. The `seamNot` is the folder, the matrix, and the survey.


**The follow-up pass — reviewing what the first pass left open, which found three more.**

- 🔴 **`boss remove` was tripping BOSS's own new catalog row.** Writing `exit-no-export` ("the work
  is real and there is no export") sent us to audit BOSS's own exit. Most of it was already right —
  the boundary is derived, the founder's files are counted and named, `docs/evidence/` is pruned
  only if empty. But `.boss/brain/*.md` is model-owned prose that `boss brain` explicitly tells the
  founder is **theirs to edit**, and remove deleted it as "the conscience's private notes." Now it
  **exports to `docs/venture-brain.md` first**, and the preview says so. Machine state goes; the
  reasoning trail leaves with you.
- 🔴 **`npm test` is green for the first time.** It had been exiting 1 on three dead predicates:
  `drift-loop`, `extraction-loop` and `coordination-loop` all assert on `docs/devlog.md`, and BOSS —
  which ships `/log` and tells founders a devlog is *"the thing future-you reads before starting
  work"* — kept none itself for 190 releases. **Three of BOSS's own most important loops were
  structurally unopenable on the project building BOSS.** Seeded the devlog; the predicates are
  alive. (And `.gitignore` gained `docs/devlog.md`, joining `RESUME.md` in the local tier — the
  `check-refs` comment had already worked out why that discriminator is the right one.)
- **`check:freshness` grew a third sweep: watchlist markers.** The cadence check asks "is this
  practice overdue?" and the reverse check asks "is any practice claimed by nobody?" Neither could
  see the failure that actually happened — a sweep runs, edits a practice, bumps *its* date, and
  never stamps the watchlist marker that scopes the **next** sweep. It found one on its first run:
  `build-craft`'s marker has been stale across two sweeps.
- Softened `install-postinstall-telemetry` from hard-named to contextual — a version or licence
  check on install is ordinary; only silent collection is the pattern, and a hard-name that fires on
  ordinary behaviour is the false-positive that gets a conscience muted.
- The two `status: candidate` rows and the two thin surfaces are now written up as one-claim files
  in `docs/research/inbox/` rather than left as notes, so `/vet` has something to rule on.

**And the third pass — working the open list, which answered a structural question.**

- 🔴 **`minors` was never a surface, and its thinness was the signal.** It sat at two rows while every
  minors-related pattern kept wanting to live somewhere else — because **every other surface is a
  PLACE in the product, and "minors" is a property of the USER.** Dissolved into a modifier: eight
  rows now carry a *stricter when a minor may be present* line, read where you actually build, and
  `boss craft deceptive-patterns --minors` lists them together. An edtech founder gets the rule and
  its stricter version in one place instead of meeting the same pattern twice.
  **The general lesson, now in the practice: when a cell stays thin, check the shape before you fill
  it.** A thin cell is sometimes a hole and sometimes a category that does not exist.
- **`build-craft`'s watchlist marker reconciled** — 2026-07-30 → 2026-08-20, matching its own log's
  newest row. No research ran; the sweeps had happened and never stamped the frontmatter, so the
  marker was scoping every next sweep to "since July 30" and re-asking for three weeks of recorded
  work. Found by the new marker sweep on its first run.
- **Five skills that inline their own short pattern list now point at the catalog too** (`/landing`,
  `/money`, `/pretotype`, `/health`, `/sunset`). The inline line stays — three lines at the right
  moment beats a command — but each now says which surface it is a subset of, and that the catalog
  wins if the two disagree. That is the drift guard the split needed.
- Softened `engage-addictive-defaults-on` from hard-named to contextual and moved its minors-only
  teeth into the modifier where they apply.
- `/vet`'s local rubric is pre-resolved on both candidates so the eventual pass is cheap: **AI
  washing is confirmed NOT a duplicate** (checked against `landing-page.md`'s honesty rules and
  `claims-capability-misrepresentation` — opposite direction, different surface), and consent-or-pay
  clears principle-fit, duplication and ceremony. **Both remain open on evidence grade only**, which
  is the half that needs sources — and for AI washing it is the *whole* question, since RVW-058's
  NOT-YET was purely about evidence.

## 0.189.0 — 2026-08-20

**The mentor ladder was lumpy, and the product had been voting against it for releases.**
Asked why four mentors all land on the V1 rung, the honest answer was: no reason. The
distribution was **1 / 3 / 4 / 0** — one at Quickstart, three at MVP, **four arriving at V1 at
once**, and **zero at Scale**. Two of the four (`mentor-fundraising`, `mentor-talent`) arrive
pre-defaulted to *"not yet"*, so half the V1 intake was ceremony landing on a rung that hadn't
asked for it.

- 🔴 **`mentor-business` moved DOWN to MVP.** `boundary.json` justified V1 as *"pricing and
  packaging are V1-era questions."* That reasoning went stale in v0.157.0, when `/first-dollar`
  and `/monetize` merged into **`/money` — which ships at L1**. BOSS had already decided taking
  the first dollar is an MVP-era activity; the mentor's rung was the half that didn't move.
  **Six L1 files had been quietly voting for L1 ever since** — `/money` (whose central step,
  *the first price said out loud*, names the mentor as its owner), `/ai-cost`, `/cost-review`,
  `auto-log.js`, `cost-budget-loop`, `margin-trap-loop`. **Two of them handed the founder a
  scripted sentence** telling them to go consult an agent their install did not contain.
- **`mentor-talent` moved UP to Scale**, still defaulting to *"not yet"*. First-hire questions at
  MVP are a delegation instinct firing early — but V1 was barely later, and **Scale's own framing
  is "give away your Legos."** The org mentor belongs where an org exists. **Scale now has its
  first agent**; it had none.
- V1 keeps the two whose moment it actually is: `mentor-fundraising` + `mentor-pitch`.
- ℹ️ **Same release, two changes to the same agents — read them together.** The re-rung above uses
  the names these mentors had when it happened; the rename pass further down this entry then moved
  `mentor-business` → **`mentor-capital`** and `mentor-talent` → **`mentor-hiring`**. The rungs are
  what changed here and they survived the rename: `mentor-capital` ships at MVP, `mentor-hiring` at
  Scale. `supersedes.json` carries both renames, so a synced project is told.

**The enforcement hole underneath it — a checker whose comment described a check it wasn't
doing.** `check-refs` class 4's header states its intent as *"a founder-facing file naming an
agent **the founder's install does not contain**."* Its implementation built the vocabulary by
**flat-mapping every stage into one set**, so it only ever answered *"does this exist anywhere?"*
An L1 file naming an L2 agent passed green, for as long as that has been true.

- **New class 4b — rung-aware agent references.** Availability is cumulative (`available(L2) =
  L0+L1+L2`), matching how modes actually unlock. It found **fifteen** cross-rung references on
  first run.
- **Two were real breaks.** `/health` pointed a founder "forward" to `mentor-talent` (already
  dangling before this release; two rungs away after it) — now names the rung that seats it.
  `stages/L2-v1/claude-append.md` listed `mentor-talent` in V1's own "what you get" — removed.
- **The rest are deliberate**, and are now **declared per (file, agent)** rather than waved
  through per file, so a genuine break inside a declared file still bites: `/consult` (naming who
  sits at which rung *is* its function) and `/health`. The `/design-tokens-init` pair was declared
  too — then **resolved instead**, later in this same release, by moving the designer down to meet
  its own tokens. **A declaration that stops being true is worse than no check**: it silences a
  gate at the moment the gate turns correct.
- **Class 4b then grew a second reader: frontmatter `owner:`.** The name-matching regex requires
  **backticks**, so `owner: ui-designer` in a scaffolded template was invisible to it. Two MVP
  templates carried exactly that, and one of them — `prototypes-registry.md` — had **never been
  examined at all**, because it names no agent in prose. A doc BOSS *writes into a founder's
  project* declaring an owner they don't have is the same bug as a sentence naming one; only the
  syntax differed.
- `/consult`'s seating line was corrected — it still taught the old ladder.

**One designer, and it arrives when the design does.** Asked whether the agent names were clear,
the honest answer for two of them was that they weren't a naming problem at all. `ui-designer`
and `ux-designer` shipped as a pair whose descriptions needed a gloss **every time they were
named** — *"what things look like"* vs *"what things do"* — and BOSS ran **one** `designer` in its
own workspace the whole time. See `DEC-005`.

- 🔴 **Merged into one `designer`, moved DOWN from V1 to MVP.** It owns both halves: the token
  system (three-layer, no raw hex) and flow/state/interaction (the five states, empty, loading,
  error, accessibility) — **plus the copy inside all of it**, which the old split had each agent
  flagging to the other and neither owning. `/design-review` and `/ux-check` came down with it.
- **The apparatus had been a rung ahead of its owner since v0.21.0.** MVP already shipped
  `/design-tokens-init`, the `design-tokens-guard` hook, `design-tokens-loop` and `/landing` —
  all of it scaffolding a system whose authority didn't install until the next mode. The two
  failures a designer exists to catch — **a screen with no empty state, a colour that never
  entered the system** — arrive the first week a founder builds a screen, not at V1.
- **V1 keeps what needs a real component set to exist first:** `design-drift-loop` enforcement,
  `/design-library`, `/board`, and `db-architect`.
- **`supersedes.json` gets its first `kind: "agent"` entries** — two of them. The field had been
  documented since v0.157.0 and **never once exercised**; every prior entry was a skill.

> **For you:** if you're at MVP, you now have a `designer` — one agent for how it looks, how it
> behaves, and how it reads — plus `/design-review` before code and `/ux-check` after. If you're
> already at V1, `ui-designer` and `ux-designer` are superseded by it; `boss sync` will say so,
> and anything you edited stays yours.

**One architect, and the schema chair became a gate.** Asked whether `db-architect` should be
"elevated into just one architect — it's kinda like a CTO role," the answer was yes to the count and
no to the merge. BOSS shipped **two** architects — one advisory (`mentor-architect`), one building
(`db-architect`) — so the founder had to guess which to ask. See `DEC-005`.

- 🔴 **`db-architect` is retired, and it is not a rename.** The obvious move was merging it into
  `mentor-architect`, which collapses the one line `docs/MENTORS.md` calls hard: **a mentor that
  owns the schema is being asked "is this premature?" by someone with a stake in the answer being
  no.** The other tempting move — folding it into the coder — is **self-review**, the failure
  `testing-with-agents` names outright. So the judgment went to the mentor, the artifact to `/spec`,
  and the enforcement to a hook.
- **`/spec` gains a data-shape step** — entities, indexes, types, additive-vs-destructive, and the
  three access questions (*who reads a row, who writes it, **which column proves it***) — answered
  while the FEAT is still prose, which is the last moment schema is cheap.
- **New `schema-guard` hook (L1, opt-in).** It fires on a migration that runs `CREATE TABLE`
  without a row-level policy **in the same migration**, and reports the two failures separately,
  because they are different: RLS never enabled (a perfect policy enforces nothing) vs. RLS on with
  no policy — which **denies everything, reads as a broken app, and gets "fixed" by turning RLS back
  off.** It sharpens the wording when it detects a stack that reaches the database from the client
  with a publishable key. That is CVE-2025-48757 (303 endpoints, 170+ apps) and MoltBook (1.5M
  tokens, 35K emails) — a **data-model** failure, not a deployment one.
- 🔴 **The coverage got WIDER by deleting the agent, not narrower.** `db-architect` arrived at
  **V1** and had to be opened. The step and the hook arrive at **MVP** and one of them fires on its
  own. The founders in those two breaches were nowhere near V1. The craft was already extracted to
  `boss craft data-schema` in **v0.142.0** — whose own provenance says it was written because *"the
  knowledge lived ONLY inside the `db-architect` agent prompt (V1), so nothing could sweep it and no
  mode below V1 could see it."* **That note was the case for this change, filed 178 releases early.**
- **The build-craft watchlist's "specific hole" is re-marked closed** — and the lesson generalised:
  *a hole filled inside one agent's prompt is filled only for whoever opens that agent.*

> **For you:** `db-architect` is gone and you don't need to remember to open anything in its place.
> `/spec` now asks the data questions while your feature is still a paragraph, and `schema-guard`
> (turn it on in `.claude/settings.json`) tells you when a migration creates a table without the
> rule that decides who can read its rows. Ask `mentor-architect` the judgment calls. Your
> `docs/architecture/` files stay where they are.

**Seven agents renamed — and the check that gated it killed one of the eight proposals.**
Graded against BOSS's own voice rule — *assume intelligence, never assume knowledge* — 10 of 15
agent names failed. Two of those were count problems (fixed above). The other eight went to the
two proto-personas whose job is exactly this: `first-product` (cannot read an acronym) and
`indie-hacker` (spots venture-shaped language in the first paragraph).

| was | now | why |
|---|---|---|
| `mentor-venture` | `mentor-founder` | "Venture" reads as venture capital — on the **cornerstone**, the first mentor every project gets |
| `mentor-gtm` | `mentor-customers` | An acronym you must already know |
| `mentor-business` | `mentor-capital` | "Business" covers everything, so it names nothing |
| `mentor-talent` | `mentor-hiring` | HR language for a question asked in plain words |
| `program-manager` | `planner` | Collided by initialism with `pm`, and shipped beside it |
| `coder-generalist` | `coder` | "Generalist" described BOSS's roadmap, not the founder's need |
| `pm` | `product-lead` | Ambiguous even to people who know it; it is what its own description always called it |

- 🔴 **The check rejected `mentor-cofounder` → `mentor-partnership`.** The proposal was that
  "cofounder" over-promises an *AI cofounder*. Read as a topic — the way `mentor-fundraising` and
  `mentor-pitch` are read — it is simply *the mentor about cofounders*, which is what it is. And its
  own trigger phrases are the founder's literal words (*"how do I work with my cofounder"*), so the
  rename would have made it **less findable for the exact query it serves**. Kept.
- 🔴 **Two proposals were changed by the collision check, not by taste.** `coder-generalist` →
  `builder` was rejected: **"Builders" is one of BOSS's two agent classes** (59 uses as a bare word),
  so a `builder` agent would collide with the class that contains `tester` and `designer`. And
  `pm` → `product` was rejected: "product" appears **352 times** as an ordinary noun. **BOSS's own
  prose had already voted for the survivor** — it says *"a PM + a coder"* where it speaks plainly.
- **The `mentor-` prefix stays.** It earns its keep by marking the exception (advisory). Prefixing
  builders too would add ceremony to make a distinction that the absence of a prefix already makes.
- **Kept as-is:** `tester`, `designer`, `mentor-architect`, `mentor-cofounder`, `mentor-fundraising`,
  `mentor-pitch` — plain, exact, and nobody needs them glossed.
- **Seven more `kind: "agent"` supersede entries** (ten this release, from a field never once
  exercised before it). Each carries the honest reason and what changes for you — nothing about any
  mentor's job, rung, or defaults moved. **If you edited one of these agents, `boss sync` names your
  edit before it touches anything.**

> **For you:** every agent now says what it does in words you already know. `boss sync` will walk
> the renames; your own edits are flagged by name first, and removal is never automatic.

**Website: coverage was one-directional, and the generated table hid it.** `check-site` fails
hard when a page *claims* a command that doesn't exist. Nothing asked the reverse — and the
reverse *looked* answered, because `{{REFERENCE}}` expands into a row for every skill, so
grepping the built site finds all 47 and reports full coverage.

- **Now measured against `web/` (what a human wrote), never `site/` (what a generator wrote):**
  **10 of 47 skills and 7 of 15 agents appear in no hand-written sentence.** Among them
  `/persona` — which ships at Quickstart with a full derive → enrich → consult lifecycle and a
  visible `synthetic% · real%` evidence ledger — and every business-side mentor. A **note**, not
  a failure: an omission isn't a false claim, and this file's contract is soft-on-stale,
  hard-on-false. The point is the number gets said out loud on every run.
- 🔴 **Corrects an earlier audit** that reported `/persona` at "0 site mentions." It's **one
  generated-table row and zero prose sentences** — and that distinction is exactly why nobody
  noticed for 188 releases. *Listed in a generated table* is not *claimed*.
- **`check-site`'s agent regex was missing the `persona-` prefix.** The eight `persona-*` agents
  are ruled `internal` in `boundary.json` and are the single most tempting thing to put on a page
  about `/persona` — README and GUIDE have described dev-workspace agents as founder features
  before. The site could have named one and nothing would have said so. Fixed and test-verified.
- **`web/guide.html` now describes what it ships:** the Humane Product Canvas named with the two
  questions conventional canvases don't ask (who this could harm; the principles you'll hold when
  holding them costs you), and `/persona` with its ledger and its *sharpen-don't-skip* caveat.

**The mentor board had a door and nobody was told.** Asked whether four business mentors should
just be merged into one, the honest answer was no — `/consult`'s whole mechanism is putting a
question to several lenses and **keeping the disagreement visible**, and its own worked example is
*"fundraising says raise now to fund the GTM motion; business says your unit economics aren't ready"*
— the exact pair a merge would collapse. They also hold deliberately contradictory defaults, which
one agent cannot.

But the instinct was right about something real: **`/consult` was named in no shipped file except its
own, and by no mentor at all.** The router existed and was invisible from both sides, so a founder
met N mentors and no door.

- **The mode doc now announces it.** `stages/L1-mvp/claude-append.md` — what a founder reads on
  `boss unlock mvp` — introduces `/consult` as *the* door, says the split IS the decision, and adds
  the guidance to ask one mentor directly when you already know whose question it is. It also lists
  `mentor-business`, which it had never mentioned.
- **All eight mentors now route back to it**, under a shared *"When the question isn't only yours"*
  section: point the founder at the board when your lens is only part of the answer, because *"this
  is bigger than my seat"* is a good answer rather than a dodge. `mentor-venture` names the rung
  (`/consult` arrives with MVP) rather than pointing a Quickstart founder at a skill they don't have.
- **`check-refs`: a second shared-name exemption.** `/design-review` names
  `docs/design/library/manifest.json` — which `/design-library` WRITES into the founder's project at
  the same rung. It resolved only because BOSS dogfoods the skill on itself, which is precisely what
  makes a correct reference look like a dangle. Declared, with the reason, alongside `BRAND.md`.

- **Class 4c — a scaffolded artifact whose declared `owner:` does not exist yet.** 4b matches only
  BACKTICKED names, and a frontmatter `owner:` is not backticked, so it was structurally blind to
  the case. Two MVP templates shipped `owner: ui-designer` — a V1 agent — into a founder's project,
  and one of them (`prototypes-registry.md`) had no backticked agent name at all, so nothing ever
  asked the question about it. **Deliberately not exemptible via `FORWARD_OK`:** a skill naming a
  later-rung agent in *prose* is usually explaining the ladder and is declarable; an artifact
  *assigning ownership* to an agent that does not exist is a dangling assignment the founder opens
  and reads. Same words, different act — and giving both the same exemption is how the second hid
  behind the first. Found by inspection rather than by the checker, which is the tell.
  **Covers two failures, and the second was a hole in this check's own first cut:** scoping to
  shipped agents deferred *"exists nowhere"* to class 4 — which needs backticks and only calls out
  the `mentor-` namespace — so a **deleted** non-mentor owner was caught by nothing. The check went
  quiet exactly as the situation got worse: a later-rung owner reported, a retired one not. Agent
  retirement is the moment this most needs to bite.

**A phantom skill, named in a shipped instruction.** Asked whether BOSS had researched startup
funding, pitching and revenue-model design, the audit found the answer was structural rather than
incidental: **`/deep-research` does not exist.** It is named as a runnable step by three BOSS-local
skills (`/vet`, `/practice-refresh`, `/humane-refresh`) and — the part that reached founders — by
`/persona`, which told them to *"run `deep-research`"* to ground a persona in real-world data. No
check caught it: `check-refs`'s retired-skill gate is scoped to the supersedes ledger (deliberately,
to avoid crying wolf), and a bare backticked name in an instruction matches nothing else.

- **`/persona` now describes the act, not a phantom verb** — *have your host search the web* — which
  is also the host-neutral form `AGENTS.md` asks for. The remaining `deep-research` mentions in
  `library/practices/ship-it-live.md` are **provenance** (*"distilled from the 2026-06-21 CD/deploy
  deep-research pass — 21 sources"*) and are legitimate: they record a pass that happened.
- **The research method is real even though the skill isn't** — `docs/research/` holds the passes and
  83 `/vet` verdicts. What is missing is the runnable step the standing disciplines assume.

**What the research audit actually found, stated more precisely than "we haven't done it."**
Monetization IS researched — two practices (`first-dollar`, `monetization-in-practice`) and four
verdicts (RVW-023, 030, 036, 037). **Fundraising and the pitch are not.** Of 31 practices, none
covers the raise, the deck, or business-model design; four of the five venture mentors cite no
`boss craft` practice at all (only `mentor-venture` does). And because a practitioner list lives
*inside an agent's prompt*, it is invisible to the freshness machinery: `check:freshness` tracks 31
practices and 66 shipped surfaces, and **zero agents**. The venture lens cannot go stale, because
nothing watches it.

- **Three entries added to `docs/research/inbox/`**, pending `/vet`: HBR's Bingham & Uparna finding
  that candidly acknowledging setbacks raised funding rates across 30,000+ loan requests (**fetched
  and verified**, and flagged as *adjacent* evidence — peer-to-peer lending is not a VC pitch); HBR
  2017 on VCs weighting character over competence (**unverified, search-snippet only**); and the
  HBS work on pitch-evaluation bias (**unverified, venue unconfirmed**). Verification status is
  recorded per claim, because guessing a venue is the exact failure `/vet` step 3 exists to catch.

- **`/deep-research` now exists** (`.claude/skills/`, verdict `internal` in `boundary.json`). The
  method was never missing — **ten passes ran by hand**, and `docs/research/sessions/` holds their
  records. What was missing was the writing-down, so each pass was reconstructed from memory of the
  last one. The skill encodes what those sessions actually did: 3–6 genuinely different angles (not
  one query reworded), **fetch the primary source** rather than trust a snippet, extract claims, then
  put only the load-bearing ones to **three independent skeptics instructed to refute**, majority-refute
  = killed.
  **Its signature rule, taken straight from the 2026-06-20 CD pass** (*"the value here is as much in
  the 3 killed claims as the 22 confirmed — they tell us what NOT to write"*): **killed claims are
  first-class output, never an appendix, and a session with zero of them did not verify hard enough.**
  It finds and does not judge — grading BOSS's response stays `/vet`'s job, because a finder that
  pre-argues the adoption case has corrupted the judge's input.

**The artifacts accreted individually and never fed each other.** Asked whether the persona and the
business/product artifacts keep building as more data is uncovered, the audit found the property is
real *per artifact* — the persona's `synthetic% · real%` ledger and dated Notable refactors,
`/triage`'s append-only capture log, the canvas's version bumps and honest `_(not yet)_` blanks,
append-only `EVID`, supersede-don't-edit `DEC`, mentors appending dated positions — and **entirely
absent between them.**

- 🔴 **`/research` had never mentioned `/persona`. Zero times.** It is the skill that turns a whole
  transcript into graded `EVID` *plus* synthesized pains, jobs, verbatim words and objections — while
  `/persona` names dropped-in real research **"the strongest source — it shrinks the synthetic share
  fastest."** The two skills producing real evidence at scale did not know the artifact that most
  wants it existed. `/research` now offers `/persona enrich` (or `derive`) with what it synthesized.
- **`/interview` referenced the persona only in the outbound direction** — personas may *rehearse
  your questions*. Results never came back. It now offers the **return leg**: a persona that only ever
  feeds interviews and never learns from them is a guess that never gets corrected.
- **Both OFFER; neither writes silently.** The ledger moving from synthetic toward real is the most
  meaningful thing that happens to a persona, and it is worth something only because a human watched
  it move. Auto-editing on evidence is how a synthetic read gets laundered into a real one.

**Brownfield: the reverse-mining worked and the delivery didn't.** `/comprehend` reads an adopted
repo's code, README, structure and deps, forms a real position, and writes it to `.boss/brain/read.md`
— then *recommends* `/persona`. But `/persona`, `/canvas` and `/triage` mentioned the brain **zero
times each**: two writers, zero readers. So a founder ran `/persona derive` against empty
`docs/ideas/` **minutes after BOSS read their entire application.**

- **`/persona derive` and `/canvas` now read `.boss/brain/read.md`** when the idea docs are thin,
  which is the normal case in an adopted repo.
- **Graded honestly as `synthetic`, and marked *derived from your repo, not from a person*.** A repo
  read is inferred from code — arguably further from real evidence than the founder's own knowledge,
  because **a codebase tells you what someone decided to build, never whether anyone wanted it.** It
  starts the ledger; it never lifts it. The canvas proposes such cells as *drafts to correct*, and a
  cell answered from the repo alone stays `_(not yet)_` on the evidence that matters.

🔴 **And the reason no loop watches staleness: the runtime cannot express it.** `loop-runtime.js`
supports three predicates — `exists`, `count_at_least`, `any_file_matches` — and **all three test
content or existence; none can compare two timestamps.** Every conscience moment BOSS has is
therefore an **absence** predicate ("an idea exists and no canvas does"); none can say *"evidence
landed and the artifact hasn't moved."* **BOSS's conscience watches for what was never made, not for
what stopped being true.** Harvesting needs a staleness predicate, and that is a new runtime
primitive rather than a loop someone forgot to author. **Not built** — recorded in [[FEAT-025]]
Layer 4 with the proposed shape (N new `EVID` since the artifact's mtime; two mtimes and a count,
never inferred from age, so `board.js`'s standing refusal to guess staleness holds).

**The canvas gains the four cells the single spine never asked for** ([[DEC-004]] item: *conventional
cells are additions, not replacements*). **Cost Structure** first, because it is the only cell present
in both Lean Canvas and the BMC with no home in the humane one — *revenue without cost isn't a model,
it's a price* — and because its absence is what left BOSS with no unit-economics record at all. Plus
**What it takes to deliver** (Key Resources + Key Activities, folded into one question because for a
solo founder they are one question), **Key Partnerships**, and sharpened prompts on three existing
cells: **Early Adopters** into People (*who feels it worst today, that you could reach this month*),
**Customer Relationships** into Modes of Engagement, and **ongoing Channels** into Business Model
(*which channels keep working, and which were just you hustling*).

- **All four are dormant by default and carry their own trigger** — Cost Structure goes live once
  there is a price or a real cost; Key Partnerships only if someone else is load-bearing, and *most
  ventures have none.* `/canvas`'s own rule is **"Don't interrogate"**, and four new cells would have
  broken it.
- 🔴 **The second-order break, caught before it shipped: the graduation gate said "most cells
  filled."** Adding four dormant cells would have quietly raised the bar for leaving Quickstart —
  every time the canvas learned to answer a new audience, graduating would get harder, which is the
  exact inversion the mode ladder exists to prevent. Both statements of the gate are now scoped to
  the **live** cells, and a dormant cell left `_(not yet)_` **never counts against graduation.**
- Verified nothing else counts canvas cells: `canvas-loop`'s exit is a regex on the riskiest
  assumption having content, and `board.js`'s "cell" references are kanban columns.

⚠️ **A correction to this release's own notes.** An earlier draft of the entry above claimed
`loop-runtime.js` supports *"exactly two predicates."* It supports **three** — `exists`,
`count_at_least`, `any_file_matches`. The conclusion is unchanged and the reason is now stated
properly: all three test **content or existence**, and **none compares two timestamps**, which is why
staleness is not expressible. The wrong count had been written into three records and is corrected in
all of them.

**Three money-and-story mentors become one venture coach whose remit SCALES** ([[DEC-006]]).
Seed: *"i really feel like mentor-money, fundraising, and pitch could be baked into vc or incubator
coach role… it just continues to scale in what they have as their skill set."*

- 🔴 **A reversal, recorded as one.** Asked earlier the same day *"why 4 mentors?"*, the answer was
  *don't merge* — `/consult`'s only worked divergence example is literally *"fundraising says raise
  now; business says your unit economics aren't ready."* **That was partly right and stated too
  strongly.** The merge costs **one pair**, not the mechanism: `architect ↔ founder` and
  `customers ↔ money` both survive.
- **What changed the answer is the second framing.** BOSS calls itself *a just-in-time startup
  incubator*, and a real incubator does not staff a pricing specialist, a fundraising specialist and
  a pitch coach — **one partner covers all three and gets deeper as the company does.** Same shape as
  the [[DEC-005]] designer finding: BOSS shipped a split it did not itself run. And needing `/consult`
  to *find a mentor* is a smell about the roster, not a feature of the router.
- **Capability that grows INSIDE an agent is new for BOSS.** The ladder was otherwise entirely
  arrival-based, which is what produced the 1/3/4/0 lumpiness fixed earlier in this same release.
  `mentor-capital` now reads the project's mode and works at the depth it has earned: the model at MVP,
  **the raise question and the investor story becoming live at V1 — where nothing installs.**
- **V1 now seats ZERO agents, deliberately.** It is a skills rung (`/board`, `/design-library`,
  `design-drift-loop`) and its mode doc says so rather than leaving a hole where a roster used to be.
- 🔴 **The independence guard, and it is DEC-005's own reasoning.** That decision refused to fold
  schema into the architect because *"an agent that also owns the schema is being asked 'is this
  premature?' by someone with a stake in the answer being no."* The same pressure exists here, weaker
  but real: `mentor-fundraising`'s whole value was **defaulting to "not yet,"** and the merged coach
  also owns the deck. Three rules ship in the prompt: *not yet* is **a stance it names, never one it
  averages**; it must **surface its own money-vs-raise tension out loud** (the sentence two mentors
  used to produce by disagreeing); and **no deck while the raise question is open** — story work for
  customers and hires is always fine, a pitch deck is downstream of a decided raise.
- **`/consult` rewired in three places** — seating, lens map, and the worked divergence example,
  which *was* this exact pair. Its replacement comes from a pair that still exists
  (`customers` ↔ `money`, channel spend vs. margin), and the skill now states that **a split inside
  one mentor counts** and must be rendered on the panel as though it came from two chairs.
- **`supersedes.json` gains two more `kind: "agent"` entries** (12 total), each with a `migrate:` line.
- **`docs/GUIDE.md` was still routing founders to both names** — caught by `check-refs` class 4, which
  correctly reclassified them as BOSS-only the moment they stopped shipping. That is the
  dev-workspace-described-as-shipped error, caught by a gate this time instead of by hand.
- **`auto-log.js` deliberately keeps both names** in its read-only allowlist: a founder who synced
  before this release still has those agents installed, and dropping them would make the hook treat
  their agents as writers. A backward-compat allowlist is not a roster claim.

**The record layer closes: three investor facts land as SHARPENS, not new cells.** The canvas gained
no rows — `/canvas`'s own rule is *"don't interrogate,"* and the coverage was achievable by asking the
existing cells better:

- **Market sizing → People.** *How many are there, and how do you know?* Counted bottom-up — a list, a
  forum, a job title you can filter on. **"$50B market" is not an answer; "about 4,000 exist and I can
  name where they gather" is** — and a number whose source you can't say out loud doesn't go in the
  cell. This is the anti-TAM-calculator refusal made operational rather than declared.
- **Competitive landscape → Problem.** Who else sells a fix — including the spreadsheet, the agency,
  the intern, and doing nothing — and **for each real one, why they might win.** *A competitive
  picture where everyone else is dismissed is a picture you drew rather than looked at.*
- **Team background → Modes of Engagement.** A bio isn't a venture fact, but credibility is: **what
  makes your unique advantage believable to someone who doesn't know you?** Not a CV — the specific
  thing you've seen, built, sold or lived that most people attempting this haven't.
- **`mentor-capital` now reads all five data-room-bearing cells** (Cost Structure, People, Problem,
  Modes of Engagement, Business Model) **before asking the founder for anything.** Most of what a data
  room wants is already written down by the time the raise question is live; asking for it again is
  how a tool teaches a founder that their own records don't count.

**Layer 1 of [[FEAT-025]] is now three items from done, and all three are correctly held open:**
CAC/LTV (gated on real customers), the ask + use of funds (gated behind the coach's *not yet*), and
the traction timeline — **closed as won't-build-as-a-record**, because it is fully derivable from
`EVID` dates + CHANGELOG + `/measure` and a field would duplicate truth.

**The merged coach is `mentor-capital`, and the rename that got it there left no two-hop.** Ajesh, on
seeing the merged seat: *"shd it be named something more apt. money sounds lame."* He was right, and
for a reason stronger than taste — **the remit had tripled that afternoon and the name still described
a third of it.**

- **Two obvious candidates were mechanically unavailable.** `supersedes.json` is append-only and a
  promise to anyone who synced; it already routes `mentor-venture → mentor-founder` and
  `mentor-business → …`. Reusing either would tell a founder their agent became something it isn't.
  So the two best-fitting words for a seat that now covers the raise were **burnt names.**
- **`mentor-money` never shipped.** It was born in the rename pass and renamed again before release,
  both inside v0.189.0 — so the ledger records **`mentor-business → mentor-capital` directly, with no
  intermediate hop.** A ledger row pointing at a name no founder ever had would be a promise about a
  thing that never existed, and this repo has already logged one *"rename's own two-hop trap."*
- 🔴 **The sweep rewrote a verbatim quotation, and that was caught and reverted.** A global
  find-and-replace edited Ajesh's own quoted words inside [[DEC-006]] and this changelog, making him
  say "mentor-capital" in a sentence where he said "mentor-money." **A record that silently edits what
  someone said is worse than a stale name** — the quote is evidence, the name around it is only
  commentary. Both restored; the surrounding prose keeps the new name.
- `IDEA-064`'s rename table carried the old justification (*"it already pairs with `/money`"*), which
  stopped being true the moment the name stopped being money. Rewritten, with the full path recorded.

> **For you:** the business-model mentor now arrives at **MVP** instead of V1, so `/money`'s
> first-price step finally has the mentor it already named as its owner — if you took a first dollar
> at MVP before this, the handoff it offered you pointed at an agent your project didn't have. The
> talent mentor now arrives at **Scale** instead of V1. Run `/boss-sync` to pick both up. Nothing you
> already have is removed, and no command changes.

## 0.188.0 — 2026-08-20

- **🔴 The conscience's memory was one skipped ritual away from nothing, forever.** `.boss/brain/read.md`
  is written by `/close`, and Ajesh named the hole exactly: *"people can forget close — how do we work
  around that, and when we get a close, then great but not be hampered."* This is the third time in
  one week the same shape has appeared: `shipped_on:` dates nobody stamped, `proof:` fields nobody
  filled, and now a brain nobody wrote. **A rule that depends on someone remembering is not a
  mechanism, it is a preference with good intentions.**
- **So the repo speaks when the founder hasn't.** `deriveBrainFacts` gives the conscience a **factual
  floor** — what is in flight, how much has shipped, and *what the conscience has already been saying*
  (read from the frequency ledger: *"you have raised 'unverified' 3x recently — if it did not land,
  say it differently or not at all"*). That last one is the self-calibration `relationship.md` was
  built for, **derived instead of stamped.** `boss brain` shows the same under an absent read.
- **`/close` is not hampered and not replaced.** An authored read always renders first and in full;
  the derived layer is the floor it lands on. **And it is labelled as derived, every time** — the
  conscience is handed *"[derived from the repo — FACTS, not a considered read]"*. A machine-assembled
  summary a reader mistakes for judgment is worse than an empty file, because an empty file is honest
  about being empty. **The POV stays the one thing only a person writes.**

- **`/design-library` run on BOSS for the first time.** BOSS is not a component app, so it catalogs
  what BOSS actually has: **108 tokens in 25 groups, 8 CSS class families across three real surfaces**,
  with content hashes so a moved surface shows as stale. **It caught one genuine drift on its first
  run** — a hardcoded `#16181A` in the board's hi-vis chip, now `--ink-on-hivis`. It also caught a
  false positive *in its own detector*: `--stage-0` has a digit, so a `[a-z-]+` name pattern read a
  token definition as raw drift. **The rule it exists to enforce, broken by its own first
  implementation** — third time in this arc.
- **`/extract` run for the first time, 156 releases late.** The sharpest item in the dogfood ledger:
  the skill encodes **PRINCIPLE #1**, the UP/DOWN router that defines what BOSS *is*, and had produced
  zero records while BOSS routed patterns constantly. **EXTR-001 — *derive-don't-stamp***, the rule
  that decided four builds this week, routed UP with the boundary that stops it overreaching (derive
  facts, never judgment; always label the derived layer). **EXTR-002 — *agreement is not truth***: a
  checker comparing two documents proves they agree, not that either is right, which is why v0.181.0's
  gate would have passed all 21 records it was built to catch.
- **Both records name what did NOT make the cut, because a pass that promotes everything it looked at
  was collecting, not sorting.** `proof:` and `program:` are held at **NOT-YET on n=1** — promoting a
  one-week-old convention into `library/` on a single repo's evidence is how the shelf fills with
  things nobody validated. The fail-open `try/catch` trap is logged as DOWN with a counter: **third
  occurrence** (`readLadder`, `readBrainContext`, `gitFirst`); a fourth sends it UP.
- **Dogfood ledger: 4 exercised · 15 exempt · 3 owed.** The venture brain stays `owed` **on purpose** —
  its dependence is fixed, but the file holds the POV, and that is the one thing that cannot be derived.

> **For you:** if you skip `/close`, the conscience is no longer blind. It now reads the facts your
> repo already carries — what's in flight, what shipped, and what it has already said to you recently —
> so it can stop repeating a nudge that didn't land. `/close` still writes the part that matters most:
> what those facts *mean*. Nothing about running it changes.

## 0.187.0 — 2026-08-20

**BOSS's conscience had never once fired on BOSS. The dogfood audit went looking for missing logs
and found a missing mechanism.**

- **🔴 The root cause of four of the six `owed` items was not "nobody ran it."** BOSS's own
  `.claude/` had **no `hooks/` directory and no `hooks` block in `settings.json`**, and its
  `.boss/manifest.json` was pinned at **`bossVersion: 0.6.0` — 180 releases stale.** `boss sync`,
  the command whose entire purpose is keeping a project current, **had never been run on BOSS's own
  first project.** So the conscience — the single most distinctive thing BOSS ships — had never
  fired on the project building it, across 185 releases, while `CLAUDE.md` said *"it eats the
  dogfood it serves."* Now installed: the hook, its runtime lib, and the **12 MVP loop specs BOSS
  ships and had never installed** (4 → 16).
- **It fired on the first prompt it ever saw, and it was right twice.**
  - **🔴 A permanent false positive that ships to founders, and this is the fix worth shipping.**
    `canvas-loop`'s exit predicate globbed only `docs/ideas/*-canvas.md` — while **`/canvas` step 1
    tells the founder to keep a venture-level `docs/ideas/CANVAS.md`**, and `boss board` reads one
    (`projectCanvas`). **A founder who followed the skill's own instruction had the canvas-loop
    reporting "stalled" forever.** A conscience that is permanently wrong about you is one you mute,
    which is the worst outcome this system has. Exits are AND-ed so a second predicate could not
    express *"either of these"* — the glob had to, so `path_glob` now accepts a comma-separated list.
  - **`verification-loop` fired, and BOSS was the case its own guidance describes.** The loop's first
    branch reads *"do they already have verification under another name? — if so, the gap is BOSS's
    blindness, not their discipline."* BOSS has `npm run release`: 22 checks, 155 unit tests, a
    143-case eval gate. **The honest fix was to record the command, not to exempt the artifact** —
    `.boss/smoke.json` had been marked `exempt` on reasoning that was wrong in an instructive way.
- **And BOSS's own canvas could not close its own loop.** BOSS ships a canvas template whose gating
  cell is `**Riskiest assumption:**` and had written its venture canvas as prose tables without it.
  The conscience reported *"no canvas names a real riskiest assumption"* — **correctly.** Now
  written, and it is the one this whole arc keeps circling: *will a real founder return, and will
  BOSS change a decision they'd otherwise make worse?* **n=0 observed.**
- **Two `owed` items resolved themselves the moment the mechanism was wired.** The frequency ledger
  (`IDEA-013`, shipped v0.34.0, **151 releases with zero entries**) began recording on the first
  fire. `registry/dogfood.json` is now **2 exercised · 15 exempt · 5 owed**, and the remaining
  reasons are honest about *why*: the venture brain needs a real `/close` at the end of a real
  session — a thing a person does, not a thing a build can fabricate — and `.boss/trace.jsonl` is
  written by the `auto-log` hook, which `check:manifests` lists as **dormant by design**. That last
  one deserves its own decision rather than a silent `owed`: turn it on, or admit `/judge-traces`
  has never had real input **anywhere**, including in a founder's project.

> **For you:** if you keep a single venture canvas at `docs/ideas/CANVAS.md` — which `/canvas` tells
> you to — the conscience has been telling you your canvas loop is stalled when it isn't. Fixed. And
> if you already test under another name (`npm test`, CI), record it with `/smoke` so the
> verification nudge stops; it was never meant to fire at someone who is already verified.

## 0.186.0 — 2026-08-20

**Two things, and the second is the uncomfortable one.**

- **Programs — the umbrella BOSS had improvised 60+ times without ever naming.** Ajesh: *"I thought
  we also did projects, where ideas or features get grouped if it's under the same umbrella?"* We
  didn't. But *"Phase 1"* appears **24** times across the records, *"Phase 2"* **22**, plus slices,
  threads and Tracks. **A pattern proven that many times and never sorted UP is exactly what
  PRINCIPLE #1 exists to catch.** Now one frontmatter line: `program: <slug>`.
- **It answers what a column board structurally cannot** — not *what is in flight* but **which of the
  things I decided to do is actually stuck.** BOSS's own first run: `ai-native-boss` **6-of-6 done**,
  `public-surface` **0-of-5**. `boss records --programs`, and a roll-up on `boss board --html`.
- **The seed/graduation ladder, because Ajesh named the tension before it bit:** *"as it gets more
  complex, eventually the program, if it stays frontmatter, will get complex, and there might be a
  log or notes that roll up all the features under it."* Correct — and they are not alternatives,
  they are a **ladder**, which is BOSS's own `seed-to-scale` practice pointed at itself. A slug
  becomes a `PROG-NNN` record when there is something to write down that **belongs to no single
  member** — why these go together, what got decided across them, what was refused. `program:` then
  points at that id. **The field never changes shape; only its value does, so nothing migrates.**
  **The trigger is not a member count** — *"three or more"* is arbitrary ceremony, and ceremony you
  don't need is what makes people stop keeping records at all. Only the seed ships; the graduation is
  documented so it is legible when earned, and deliberately unbuilt until a real program needs it.

- **🔴 The wider audit Ajesh asked for, and it is worse than the backlog was.** *"The problem seems
  more widespread."* It is. **BOSS ships 9 record types and 5 machine logs. Its own repo — 185
  releases in, its first and only real project — exercises 4 record types and ZERO logs.**
  - **`FEAT-022` declared the venture brain *"now complete"* at v0.65.0. BOSS has never written one.**
    The conscience built to remember a venture remembers nothing about the venture it was built inside.
  - **`/extract` encodes PRINCIPLE #1** — the UP/DOWN router that defines what BOSS *is* — and has
    produced **zero** records in 156 releases, while BOSS routed patterns UP and DOWN constantly.
    **The discipline is real and the record of it is missing**, so the one decision BOSS says matters
    most is the one nobody can audit.
  - Also owed: the frequency ledger (`IDEA-013`, 151 releases of its own conscience firing, zero
    recorded), the trace substrate `/judge-traces` reads, and `/design-library` — which BOSS has never
    run despite having the design system, the website and the brand doc it was built for.
- **`registry/dogfood.json` + `npm run check:dogfood`**, in `npm test` and the release gate (2e).
  Every artifact a shipped capability writes is `exercised`, `exempt` (with a reason) or `owed` (with
  a reason). **Unclassified fails; `owed` prints but passes** — a gate that is red forever is a gate
  you bypass, and this repo has already killed three checkers that way. **22 artifacts: 3 exercised ·
  13 exempt · 6 owed.** The forcing function is `check:ladder`'s: a new artifact-writing capability
  cannot ship without someone deciding which it is. **It caught two of its own entries on first run**
  for reasons short enough to have been inherited rather than re-read — the same failure v0.178.0's
  boundary ledger caught in itself.
- **The honest framing this produced, now written into the ledger:** *a capability nobody has ever
  run is not shipped, it is published* — and the gap shows up first in a founder's project, not here.

> **For you:** **`boss records --programs`** groups records that belong together (`program: <slug>` —
> one line, nothing to create first) and shows which umbrella is moving and which is stuck. It's on
> `boss board --html` too. Promote a program to its own record only when it has something to say that
> belongs to no single member — not when it hits some number of items.

## 0.185.0 — 2026-08-20

- **Allocation stopped being an instruction and became a computation.** BOSS's own site said this
  out loud and it was true: *"you don't allocate the number — `/triage` reads the folder and takes
  the next free one. But that's a sentence in a skill file telling an agent to count, not code that
  computes, and the difference is invisible right up until it isn't."* It broke exactly that way.
  **`boss id [PREFIX]`** computes it from every `.md` under `docs/` — filenames **and prose**,
  because a number reserved in an index is taken even when no file exists yet. `/triage` and `/spec`
  now call it instead of counting. **`boss records` detects a collision; this prevents one.**
  - **Which prefixes count is READ FROM `docs/IDS.md`, never guessed by shape.** The first cut swept
    `/[A-Z]{3,4}-\d+/` and confidently offered `CVE-2027` and `SHA-257` as next free numbers, having
    found a vulnerability id and a hash algorithm in the prose.
  - **🔴 Caught on a real fresh scaffold, not by reasoning: a brand-new project was offered
    `IDEA-045` as its first idea.** BOSS's own shipped docs use example ids to explain the system
    (`docs/IDS.md` shows IDEA-014 → FEAT-003), and the census counted them as taken. **Illustrations
    in documentation are not reservations.** Prose now counts only inside record folders; filenames
    still count anywhere. Rule 6 paid for itself again — this passed every unit test.
- **IDEA → FEAT: the rule was wrong, and the repo had been telling us for 46 records.** IDS.md said
  *"an idea in active build"* becomes a FEAT; **46 IDEAs went `building`/`shipped` without one**,
  while all 5 FEATs that exist are multi-slice, multi-release build contracts. **The rule that got
  followed was narrower than the rule that got written**, so the rule changed: promote when the build
  has **named slices or spans more than one release**. A second document for a one-release change is
  the ceremony Principle #2 refuses. **What IS enforced is the link, both ways** — `promoted_to:` ↔
  `from:`, with `from: none` a valid answer. BOSS had 5 FEATs and not one link in either direction.
- **🔴 `boss records` was crying wolf at three record types, and would have in every founder's
  project.** The seven-word ladder is the **lifecycle** vocabulary; `DEC` is decided|superseded,
  `PRAC` is active|stale|retired, `EVID` carries a grade, not a status. Applying the seven to every
  prefix reported BOSS's own three decisions and its one evidence file as broken on the first run.
  Per-type vocabularies are now read from IDS.md. *A checker that cries wolf gets switched off, which
  is how the last three checkers died.*
- **The transition is DERIVED, not stamped.** Ajesh: *"we aren't tracking ideas moving into building
  or when it ships."* True — 2 of 67 records carried a date. The reflex fix is to ask people to stamp
  one, which is another rule with no mechanism that rots the same way. **Git already knows**: a
  record's first commit is when it was captured, its `proof:` artifact's first commit is when the
  thing appeared. **`boss records --timeline`** reports it, with a median idea→built. Nobody
  remembers anything and the dates cannot drift, because they *are* what happened.
- **`boss board --html` gained a "Shipped over time" strip**, which is EVID-001's ask in its most
  literal form — *"knowing exactly where I am, like a train line, seeing my progress."* It is the
  first element on the board that looks **backward**; everything else answers *what now?*. It is
  deliberately **not a contribution graph**: no streaks, no intensity ramp, no empty-square guilt for
  a quiet fortnight. A month with one ship and a month with six are both just months with ships in
  them. **Cadence, not volume, and certainly not effort.** The board's `shipped_on:`/`building_since:`
  fields now fall back to the derived dates — they had existed since IDEA-034 and almost nothing
  carried them, so a timeline built from them would have been an empty strip pretending to be a
  feature.
- **🔴 And it shipped broken first, in the same hour, in the exact shape this whole arc is about.**
  The `execFileSync` import never landed (the edit matched a different argument order), so `gitFirst`
  threw `ReferenceError`, **the `try/catch` swallowed it, and every derived date silently became
  null.** The only symptom was an empty strip — indistinguishable from "nothing has shipped yet."
  Same failure as v0.179.0's `readLadder()` returning `{}` on a parse error. The catch now re-throws
  `ReferenceError`/`TypeError`: **a missing git is expected, a missing import is not.** Two
  regression tests, one of which asserts on the import line itself.
- **The website's disclosure was corrected, and it had gone stale in four releases** — it still said
  the checker *"hasn't been sorted down into what you get"* after `boss records` shipped at v0.184.0.
  The page about documentation going stale, gone stale. It now says which half is mechanism and which
  half is still only a rule: **nothing stops you typing a status by hand that isn't on the list.
  Detection is not prevention**, and the page would rather say so.

> **For you:** **`boss id`** gives you the next free record number, computed rather than counted —
> use it before creating an IDEA or FEAT. **`boss records --timeline`** shows when each idea was
> captured and when it actually got built, derived from your own git history, with a median. And
> `boss board --html` now has a **Shipped over time** strip so there is something to look at that is
> *behind* you. Promote an idea to a FEAT when it has named slices or spans more than one release —
> not before.

## 0.184.0 — 2026-08-20

- **🔴 The gate shipped yesterday would not have caught the bug it was built for.** v0.181.0's
  `check:backlog` compared each record to its INDEX row — **document against document**. All 21
  drifted records would have passed it if the index had simply agreed with the wrong files.
  **Agreement is not truth.** Ajesh, on reading the result: *"the whole point of us managing the docs
  was to avoid this — it broke what BOSS is about from a managing-docs perspective."* He was right,
  and the fix is not a stricter version of the same idea.
- **A status is a claim about the code, so it is now checked against the code.** Every record names
  `proof:` — the path that would not exist if the thing were not done — and the rule runs **both
  ways**:
  **`shipped` + proof missing** → the record claims something the repo cannot show.
  **not shipped + proof present** → *you built it and never said so.* **That second direction is the
  disease**, all 18 instances of it, and nothing in BOSS had ever looked for it.
- **Declaring `proof:` on something UNBUILT is the point, not busywork — it is a tripwire laid in
  advance.** Name the file now; the day someone creates it, the gate fails until the record is
  updated. **Drift survives one release instead of a hundred.** All 67 records stamped; the new class
  immediately caught two more the reconciliation had missed (`IDEA-037`, `IDEA-055`).
- **Two honest states are declared, never silent.** `proof: none` + `proof_note:` for a record whose
  output was a *decision* rather than a file (IDEA-012's catalog became the backlog). And a
  `proof_note:` on a non-shipped record whose proof exists anyway — **built-but-unreachable**
  (IDEA-047 needs a bought domain, which is not a build task) or **completes-on-a-condition**
  (IDEA-058 ends when citation debt hits zero, which is not a file). **The note is the price of the
  exception: you may hold the state, you may not hold it silently.**
- **🔴 And it ships DOWN, because the rule without the mechanism is decoration.** BOSS shipped a
  founder `docs/IDS.md` — the closed status vocabulary, *file-is-truth* — and shipped **no way to
  tell when either had stopped being true.** That is precisely the condition BOSS's own repo was in
  while it drifted. **`boss records`** applies the same check to a founder's `docs/ideas/`,
  `decisions/`, `evidence/`, `practices/`, `features/`, and **`boss status` carries one line** —
  only the good-news direction (*work you've already finished*), because status is orientation, not
  a chore list. `proof:` is **opt-in** for a founder: BOSS does not fail someone's project for
  declining a convention they never asked for, so records without it are silent until
  `boss records --all`.

> **For you:** **`boss records`** — new. Your docs make claims about your code (`shipped` means the
> thing exists), and nothing ever checked them. Add `proof: <path>` to a record and BOSS will tell
> you when the two stop agreeing — in both directions. The one that costs you is a finished feature
> whose record still says *"exploring"*: that is a thing you might build twice, or hand to an agent
> that rebuilds it, because the agent believes your docs. `boss status` now says so in one line.

## 0.183.0 — 2026-08-20

- **🔴 A capability shipped three releases ago and was never announced, so no existing project could
  learn it exists.** `/spec` step 4 names **the three paths that must not break** and
  `/red-team --paths` proves them — rungs 2–4 of the testing ladder, the band BOSS had been jumping
  over from *does it run* straight to *is the AI good*. The code landed at **v0.179.0**. The words
  never did: `"money path"`, `"negative path"` and `"--paths"` appear **zero times** in this
  changelog before this line. **`registry/CHANGELOG.md` is what `boss sync` reads to tell a project
  what's new** — so the release existed for a fresh install and was invisible to every project that
  already had BOSS. *Distribution without adoption, which is the exact failure v0.179.0 was itself
  built to fix, committed by the release that fixed it.*
- **Announced here rather than backdated into v0.179.0.** Published history stays published; `boss
  sync` reads forward from a project's pin, so putting it in *this* entry is what actually reaches
  the projects that missed it. **Rung 4 is the one the practice calls non-negotiable** — *can user A
  reach user B's data* — and it is the test nobody writes, because the happy path looks perfect.
- **The cause was the squash, and it has now cost something twice.** `f6515a2` carried v0.177.0,
  v0.178.0 and v0.179.0 in one commit; `7ead4b4` did the same to the design and testing releases.
  RESUME flagged the pattern both times as a readability problem. It is not — **a squashed release is
  a release whose changelog entry nobody writes**, and the changelog is a distribution mechanism, not
  a diary. v0.180.0 and v0.181.0 were deliberately committed separately for this reason.
- **The stale-note twin, in BOSS's own briefing.** `docs/RESUME.md` recorded *"`/spec` is the natural
  home for the rung-2–4 gap and this release did NOT touch it"* — written about a release that **had
  touched it**, in the same file, on the same day. Corrected. This is the same defect the v0.181.0
  sweep found 21 times in the backlog index, now found once more in the file that is read first
  every session. **The lesson generalises past the fix: a note that says "still open" is a claim
  about the code, and nothing was checking it.**
- **[[IDEA-060]] item 6 — the `site-drift-loop` — is SUPERSEDED, not built.** Its proposed predicate
  was *"the page hasn't been touched since N FEATs closed."* `check:site` already does strictly
  better: each page declares `covers:`, and the check compares the **actual change time of those
  sources** against the page's `reviewed:` date, so it names *what* fell behind rather than counting
  events. Building the loop would have added a second, blinder watcher over the same surface —
  **compose and subtract, per [[EVID-001]]**. Recorded as superseded so the reasoning survives.

- **🔴 Every multi-line release note BOSS has ever published to the web was truncated mid-sentence.**
  `gen:site` captured the `> **For you:**` block with `(.+)$` — one line — so v0.180.0 went out to the
  public feed reading *"there's now one command for"* and stopped. The changelog's own header tells
  authors to write these as prose, and prose wraps. **The one page written for people who do not have
  BOSS yet was the page cutting its own sentences in half.** Continuation lines are now taken until
  the first non-quote line. Note the pairing with the find above: one release could not reach existing
  projects, and every release reached new ones half-said.

> **For you:** if you have been using BOSS since before v0.179.0, `/spec` gained something you have
> not been told about: it now asks for **the three paths that must not break** — the money path, the
> destructive path, and the negative path (*can user A reach user B's data*). `/red-team --paths`
> proves them, and needs no LLM in your product at all. Name them while you are still deciding what
> "done" means; they are close to impossible to retrofit once the feature exists.

## 0.182.0 — 2026-08-20

> **For you:** **Three record types were missing or misfiled in your `docs/IDS.md`.** `DEC-NNN`
> (decisions) and `EVID-NNN` (evidence) ship at Quickstart and weren't listed — `DEC` was filed under
> V1 with a format `/decide` doesn't write. `PRAC-NNN` was missing from MVP. `FIX-NNN`/`BUG-NNN` are
> **removed**: no skill has ever written one. Your status vocabulary is now a **closed list of seven**
> (adding `deferred` — deliberately not building this, *with a written re-open trigger*), documented
> where the rule can be checked. `/boss-sync` picks it up.

**The record system was BOSS's most distinctive thing and its least described.** Ajesh, on the
website: *"we don't surface it much there, like under the product aspect."* The count was worse than
that — `IDEA-`, `FEAT-`, `DEC-`, frontmatter and `docs/ideas/` appeared **zero times across the whole
site**. The verbs showed up in command tables; nothing said a durable, addressable file comes out the
other end. The site sold the staffing half of BOSS and never claimed the memory half.

- **New page: `keeping-track.html`**, under *The product* and directly after *The team* — the two
  halves as a pair. The team is who shows up; the records are what survives the session. Typed
  records, the rendered board, the closed status vocabulary, the ID ladder, and the retirement verbs
  (`review_by:`, `/revalidate`, `/sunset`, `dropped`).
- **The ID table and the status list are PARSED from the shipped `docs/IDS.md`**, not retyped. That
  is what caught the drift: rendering the founder's own file next to the page's prose made three
  wrong rows visible immediately. A page that restates a claim can be wrong quietly; a page that
  derives it cannot.
- **Sorted UP into the scaffold (PRINCIPLE #1):** BOSS had been running a seven-word closed status
  vocabulary and a *file-is-truth, index-is-a-view* rule in its own repo while shipping six words and
  no rule. Both now ship. The shipped `INDEX.md` **stopped restating the vocabulary** and points at
  `IDS.md` instead — a second copy of a vocabulary is a second thing to keep in sync, which is the
  exact failure the page is about.
- **`documentation.md` had no registered sources** — so it rendered unattributed on the engineering
  page. Michael Nygard (ADRs, 2011 — the direct ancestor of `DEC`), Marty Cagan, and the Spec Growth
  Engine paper are now in `sources.json`. The page says plainly what's borrowed and what isn't; the
  narrow claim is that *ceremony is rationed by mode* and *some docs execute*, not that any of the
  parts are new.
- **Two generator bugs:** `documentation` was classified into two engineering groups, so it rendered
  twice and inflated the practice count. `gen:site` now **hard-fails** on a duplicate — unlike a
  stale or unclassified id, there is no reading where that is what someone meant.

**The honest paragraph on the page is about BOSS's own failure, and it took a correction to get
right.** A first draft said allocating the ID "is a human reading the folder." It isn't — `/triage`
does it. The accurate and sharper point: **it is an instruction to a model, not a computation.**
Nothing in `src/` allocates IDs; `next free number` is a sentence in a skill file telling an agent to
count, which is indistinguishable from a mechanism until it miscounts. Two files claimed `IDEA-059`
here on the same day and every reference to it was ambiguous until a person noticed. The closed
status vocabulary has the same shape — closed by rule, nothing rejecting an off-list word.

`check:backlog` (v0.181.0, built the same week by the sweep that found 21 records in conflict) gates
both — **but only in BOSS's own repo.** Nothing in `stages/` references it, so a founder inherits the
rules without the checker. The page discloses that rather than claiming enforcement they don't have:
**the mechanism exists one level up and hasn't been sorted DOWN yet.** Principle #1, mid-flight.

## 0.181.0 — 2026-08-20

- **The record of what BOSS had built disagreed with itself in 21 places, and every one of them
  pointed the same way: finished work filed as unfinished.** A three-way sweep — each idea file's
  `status:` frontmatter, its row in the backlog index, and the artifacts actually on disk — found
  **21 of 64 records in conflict, 18 of them under-reporting shipped work.** `IDEA-001` still read
  *"ready — next build"* while `/boss-learn` and `/boss-sync` had shipped in the L0 template at
  **v0.2.0**. `IDEA-032` read *"the clearest 2026 miss, verified in-repo"* next to a shipped
  `AGENTS.md`. `boss adopt` and `boss board` were live CLI commands filed under *exploring* and
  *building*. **This is the expensive direction for a backlog to rot in** — a founder who trusts it
  rebuilds what they already have, and BOSS's whole first principle is about not doing that.
- **The root cause was vocabulary, not diligence.** `docs/IDS.md` declared six statuses. The files
  used fifteen — `implemented`, `built`, `keystone-shipped`, `resolved` and `adopted-as-backlog` all
  meant *shipped*, spelled five different ways. No reader could sort them at a glance and **no
  checker could compare them at all**. The vocabulary is now closed to seven words (`seedling ·
  exploring · ready · building · shipped · deferred · dropped`), and a status must *start* with one
  — everything after stays free-form, so `shipped (v0.106 read-state slice)` still says what it said.
- **`npm run check:backlog`** — new, in `npm test` **and the release gate** (step 2d). Five classes:
  undeclared status · duplicate id · index-disagrees-with-record · missing row · orphan row. **Each
  provoked and watched to fire**, per the standing rule that a gate proven only by passing is not
  proven. The rule it encodes is **frontmatter is truth, INDEX is a view** — which `IDEA-015` wrote
  down for `boss board` and the index then drifted from anyway. *A rule stated in one record and
  enforced nowhere is a preference.*
- **🔴 And agreement is not correctness — the sweep nearly shipped that mistake.** Syncing the index
  to the files blindly corrupted two rows: `IDEA-048` and `IDEA-053` had `status: ready` in
  frontmatter while their artifacts (`/close`'s learning pulse, `founder-role-shifts.md`) had been on
  disk since v0.104/v0.105 — there, the *file* was the stale side. **Disk is the arbiter; the
  frontmatter rule only decides who to believe when both are plausible.** Four records were corrected
  against disk rather than against each other.
- **Also found by the same sweep:** two records both claiming `IDEA-059`, which made every
  `[[IDEA-059]]` link ambiguous — including one in BOSS's own RESUME. Four records absent from the
  index entirely (`FEAT-020`, `IDEA-024`, `IDEA-038`, `IDEA-039`). And **`FEAT-022` — the venture
  brain — cited by name in a SHIPPED practice (`conscience-voicing.md`) and twice in this changelog,
  including the sentence *"FEAT-022 is now complete,"* with no record anywhere behind the id.** Its
  record is now written, 60 releases late. *A reference is a dependency* — including a reference to
  BOSS's own reasoning.

- **🔴 `check:refs` printed *"Everything BOSS points at exists"* across 485 files while a file
  scaffolded into EVERY MVP project pointed a founder's repo at a file that was never in it.**
  [`coordination-loop.md`](../stages/L1-mvp/template/docs/loops/coordination-loop.md) cited
  `docs/research/IDEA-037-...md`. Class 3 hard-coded the one subdirectory that had bitten it
  (`docs/ideas/IDEA-*.md`) and class 3b only read `docs/*.md` at the top level, so the whole middle
  tier — `docs/research/`, `docs/dossier/`, `docs/architecture/`, `docs/source/` — was uncovered.
  **Seven shipped files were in it**, including two source comments and four practice-shelf
  provenance lines. *A check reading green for the exact reason it should not* — the third time that
  shape has appeared (v0.171.0 resolved against the wrong tree; v0.179.0's gate enumerated its tests).
- **`check:refs` class 3c**, and the discriminator is the whole design: **does the path resolve in
  BOSS's own repo?** `docs/<sub>/` names are overwhelmingly *runtime conventions* in a founder's
  project — `/red-team` writes `docs/red-team/`, `db-architect` writes `docs/architecture/schema.md`.
  Those must never be flagged, and they aren't, because the founder's file does not exist here. A
  path that *does* resolve here, inside a directory `.gitignore` declares local and no template
  ships, is by construction BOSS's own. Membership is computed from `.gitignore` + the templates,
  never listed. **One documented exception**: `docs/design/BRAND.md` is a name both repos own — the
  same naming-coincidence trap class 3b already wrote up for `RESUME.md`, and nothing on disk can
  tell the two apart.
- **`red-team/SKILL.md` no longer names a model.** The last prose residue of the eight pins
  `model-routing.md` was written to forbid: an adversarial pass is **deliberation** work, so it now
  says that, and lets the host bind it. Capability shapes, never names.

> **For you:** two fixes you'd have hit. A file scaffolded into every MVP project pointed at a
> research doc that was never in your repo — gone, along with six more of the same shape. And
> `/red-team` no longer tells you to run a model your host may not have; it names the *kind* of model
> the job wants and leaves the choice where it belongs.

## 0.180.0 — 2026-08-20

> **For you:** **`boss credit`** — if you want to say you built with BOSS, there's now one command for
> it. Never automatic, never in your product UI, one command to undo. And `/welcome` now tells you
> about the marked comment BOSS leaves in your `CLAUDE.md`, because it's findable in public repos and
> you should hear that from BOSS rather than discover it.

**Acknowledgement, built against the brand's own promise rather than around it.** Ajesh: *"should we
add a 'Made with BOSS' into the code… something unique enough that we can suss out via a deep search
on GitHub?"* The immediate tension: `BRAND.md`'s central story is **"it never puts its name on your
work — you ship it, your name's on it,"** and that line is what disarms the name. Auto-inserting a
badge would contradict the one promise the brand is built on.

The resolution is that these were **two asks wearing one coat**, and they have different answers.

- **Counting already worked, undisclosed — so disclose it.** `src/scaffold.js` has always written a
  `<!-- boss:… -->` marked block into `CLAUDE.md`/`AGENTS.md`; `boss remove` depends on it to know what
  to excise. That marker is *already* findable by public code search, at zero cost to anyone. Nothing
  was added — **`/welcome` now names it in one sentence**, unprompted, including *why* it's there and
  that `boss remove` takes it out. **Counting people who never agreed to be counted is surveillance,
  however public the data;** the marker is load-bearing so it stays, but a founder hears it from BOSS
  instead of finding it.
- **`boss credit` — the opt-in half.** Previews by default (same posture as `boss remove`), `--apply`
  adds one line to the README, `--remove` restores it exactly. **Never automatic, never offered
  unprompted, never anywhere a founder's users see it.** `/welcome` is explicitly forbidden from
  pitching it — it exists for someone who *asks*.
- **The line carries a wink, not a badge:** `<!-- Builds, Or Stays Silent. ✦ -->` above
  `Made with [BOSS](https://oyeboss.build)`. The comment is one of BRAND.md's alternate full forms, so
  whoever reads the source gets the joke; the phrase is distinctive enough to have a near-zero
  false-positive rate in a code search, which is the only reason it's findable at all.
- **The promise is about taking credit, not about refusing to let anyone give it** — that distinction
  is what makes this compatible with the brand instead of a hole in it.
- Four tests, including the two that matter for anything that edits a founder's file:
  **`--apply` twice is a no-op *success*** (already-in-desired-state is not failure — it should be safe
  to script, like `mkdir -p`; the first cut returned exit 1 and was wrong), and **removal restores the
  README exactly**, with the founder's own prose untouched.
- Site: `/credits` now documents both directions — who BOSS learned from, and how to credit it back.

## 0.179.0 — 2026-08-20

**BOSS could distribute a better practice and never ask whether you already had the thing it makes.**

> **For you:** `boss sync` now tells you when a skill that changed makes something **you already
> built** — `↳ you already have the landing page — app/page.tsx`. And `boss status` gained an
> **Already built** line (what's real in your repo, not what's missing) plus, when you're earlier
> than a practice, the one cheap thing worth doing now anyway. Skills look for their own output
> before generating: point `/landing` at a repo that already has a page and it reads yours instead
> of writing a second one.

Ajesh: *"when we have new features in BOSS for new idea, how do they get adopted into existing
folder… like landing pages, say we implement new one — for existing, shouldn't we ask, hey do you
already have a landing page?"* Then, on the fuller shape: *"it's not just the new features, but
ongoing… it should always assess new or existing, but also where in the seed to scale the app is,
and know where it should fit, or add a kernel of it as a seed and then scale."*

- **🔴 The gap was structural, not a missing feature.** `boss sync` compared **file to file** — it
  could report that `.claude/skills/landing/SKILL.md` changed by 40 lines, and had no way to say the
  founder *has* a landing page that is now behind the practice. Distribution without adoption: every
  improvement BOSS made to a capability was **unreachable by everyone who had already used it**. And
  skills read their **inputs** (BRAND.md, tokens, the canvas) and never their **output** — so
  `/landing` on an adopted repo generated a second page. Across 47 skills, **4 files** mentioned
  existing work at all. Worst on the path most people arrive by: `detect.js` says in its own header
  *"most people who try BOSS arrive with a repo"* — that got fixed for **mode selection** in v0.153.0
  and never for **artifacts**.
- **The answer was already on the shelf, in one place, unnamed.** v0.176.0's *"But leave the seam"*
  (a `created_at` you cannot backfill, a `track()` stub) was the general pattern wearing one domain's
  clothes — and the same shape was live in `data-schema.md`'s one-way doors and in `design-tokens-loop`
  without anyone calling them the same thing. **`seed-to-scale.md`** is that generalization: three
  questions asked every time a capability meets a project — *does it already exist · what rung is this
  project on versus this practice · if it's above their rung, what's the seam?*
- **The seam test, and its guard.** *Skip this for six months — what is **gone**, versus merely
  **undone**?* Undone is fine; that's what "not yet" means. Gone is the history a missing timestamp
  can't reconstruct, the failing output you deleted, the key that's in git history now. **A seam is a
  column, a stub, a folder, or a habit** — if it needs a document, a decision, or a dependency, it's
  the practice wearing a seam's clothes. Every entry carries a `seamNot` so the boundary can't erode.
- **🔴 The ledger did not ship, and it failed silently.** `src/cli.js` and `src/sync.js` read
  `registry/surface-ladder.json` at runtime, but it was never added to `package.json`'s `files`, so
  the published tarball had no copy of it — and `readLadder()` catches the missing file and returns
  `{}`. Every founder's `boss status` would simply never print *"Already built"* and `nextSeam` would
  never fire: **the feature dies without an error.** Caught by unpacking a real `npm pack` tarball and
  diffing its output against the repo build — a fresh project showed nothing, so the proof needed a
  project with `docs/ideas/CANVAS.md` in it. Same escape class as v0.134.0's dormant hooks and
  v0.152.0's `boss changelog`: **shipped code reading a repo-only path.**
- **`registry/surface-ladder.json`** — 16 durable capabilities with rung + detection + seam;
  **5 say `seam: null` on purpose**, because inventing a seam to look helpful is how a just-in-time
  tool becomes a checklist. *"Nothing to plant here, and here's why"* is a complete answer.
- **`npm run check:ladder`, wired into `test` and the release gate — this is the ONGOING half.**
  Every skill in every manifest must be **durable (on the ladder)** or **exempt (with a written
  reason)**; a new capability cannot ship without someone deciding which. The test is *append-only vs
  durable*: a DEC-NNN writes a new record every run, a privacy policy exists and should be read. It
  also fails loudly on a malformed ledger — `readLadder()` swallows a parse error and returns `{}`,
  which silently disables artifact-awareness everywhere. That bit during this build.
- **0 new skills (47 → 47), 1 new practice (30 → 31).** Compose + subtract per [[EVID-001]] — the
  three questions live in the always-loaded `CLAUDE.md`, and each skill only names its own specifics.
  **`boss status`'s "Already built" line is the positive register EVID-001 asked for**: ~120 releases
  spoke only in the conscience's caution voice, and a founder who said *"I can't tell where I am"* now
  gets told what's real, derived from evidence on disk, never a grade.

### Three things the build caught on itself

- **A fresh scaffold was being offered a seam for a feature that doesn't exist.** "Below the rung"
  only means something once there's work for the seam to attach to — an empty project isn't *below*
  MVP, it's *at* Quickstart doing Quickstart's work. Seams are now gated on real work on disk, and
  the scaffold's own shipped `docs/ideas/README.md` deliberately doesn't count as the founder's.
  This is the over-shooting the new practice warns about, caught by dogfooding it within the hour.
- **🔴 The release gate was silently covering a subset of the tests.** Its unit-test step listed four
  test files by hand, so `design-tokens-guard.test.js` and this release's `ladder.test.js` were
  invisible to it — `npm test` ran **131**, the gate reported **107** and printed a green tick. Same
  defect class as v0.171.0's `check:refs` resolving against the wrong tree: *a check that reads green
  for the exact reason it should not.* The list is now discovered from `test/`, never enumerated.
- **BOSS's own freshness gate rejected the new practice twice** — a `review_by` 180 days out when
  `curve: craft` wants 365, and no watchlist domain claiming it (so nothing would ever re-check it).
  Both fixed; `build-craft.md` gained **domain 14 — Adoption & the ladder**, whose standing question
  is whether the seam column is still honest in *both* directions.

## 0.178.0 — 2026-08-20

**Two products share this repo — the workspace that builds BOSS and the BOSS a founder installs — and nothing marked the line. It leaked in both directions.**

> **For you:** four commands your practices told you to run don't exist outside BOSS's own repo —
> `/vet`, `/recalibrate`, `/practice-refresh`, `/humane-refresh`. The practices now name something
> you actually have. Nothing in your project moves.

Ajesh, opening a boundary review: *"there are some decisions in how we are building boss, that never
make it into front even though it was intended for boss… some of it should not be in public facing
repo but only in dev repo."* Both halves were true, and each had a mechanical cause.

- **🔴 Fifteen shipped files named skills that ship to nobody.** `/vet`, `/recalibrate`,
  `/practice-refresh` and `/humane-refresh` live only in BOSS's gitignored `/.claude/`. Nine practices
  a founder reads through `boss craft` pointed at them, `/practice` and `/red-team` told founders to
  run them, and **`src/craft.js` printed one to a founder's real terminal** — *"The next
  /practice-refresh should ask what can be deleted."* Every one now names a mechanism the founder
  actually has, or says nothing.
- **New: `check:refs` class 5 — WORKSPACE-ONLY SKILLS.** Two classes nearly caught this and both
  missed, for reasons worth keeping. Class 3 had the right idea — *a reference is a dependency* — but
  scanned `stages/` only, while `library/` and `src/` ship too. Class 4 had the right scope but polices
  **agent** names; a skill authored in the workspace and never retired is a third way a name dangles.
  The vocabulary is read off disk, never regexed out of prose, so it cannot cry wolf.
- **🔴 A relative link into a gitignored directory passes every existing check**, because
  `existsSync` resolves it *here*. `ai-ux-patterns.md` linked `../../.claude/skills/humane-refresh/SKILL.md`
  and would have dangled in every install. Class 5 matches the path form as well as the verb.
- **🔴 The website was publishing BOSS's internal filing.** `gen-site.js` piped each practice's
  `provenance:` field verbatim into a public page: **43 identifiers** (`IDEA-`, `RVW-`, `FEAT-`, a
  named internal audit, a research compendium) pointing at directories no reader can open — and the
  name of an unrelated product of the author's, **six times**, with its implementation detail.
- **Provenance is now two fields.** `provenance:` stays the internal build record — the most honest
  field in the repo, written for us, in our own vocabulary. `provenance_public:` is the half a reader
  can use: who we learned it from and what it cost to find out. The site renders only the second, and
  **a practice without one gets no provenance block at all** — silence beats a leak, and the gap is
  visible on the page, which is what makes it get written.
- **The boundary is enforced at generation, not trusted.** `gen:site` exits 1 if an internal id
  reaches a public field, with the file and the offending token named. Verified by poisoning a field
  and watching the build die. A warning in a build script is a warning nobody reads.

- **🔴 The undeclared middle tier was not cosmetic — it was breaking the mentor layer.** `.gitignore`
  claimed the repo shipped *"GUIDE, CHEATSHEET, SKILLS, MENTORS, IDS"* as user-facing docs. Six of
  those have never been in the npm tarball, and **nine shipped mentor agents plus the root `CLAUDE.md`
  every project gets sent founders to `docs/MENTORS.md` on the strength of that sentence.** Four of
  them said *"create it from the artifact mapping in `docs/MENTORS.md` if absent"* — the mapping was
  real, and it was the one place the artifact names existed. Each mentor now names its own
  (`docs/dossier/gtm-<date>.md`, `architecture-<date>.md`, …), so the instruction resolves where it is
  read. Verified on a real scaffold, which is how the *first* fix got caught: it pointed at `boss team`,
  and `boss team` is the human-cofounder command, not the mentor roster. A valid command, just not that
  one — and it passed every checker.
- **`check:refs` class 3b — repo-only docs.** Membership is computed, not listed: a `docs/*.md` is
  repo-only when no template ships it and `.gitignore` doesn't hide it. That second clause matters —
  the first cut flagged four `/close` and `/log` call sites for naming `docs/RESUME.md`, which is the
  founder's own file, written at runtime by the very skill being flagged.
- **`.gitignore` now declares all three tiers** instead of two, and says which docs are tier 2. The
  comment that was wrong is left in, marked wrong, with what it cost.
- **New: `registry/boundary.json` + `npm run check:boundary` — the crossing ledger.** Every one of the
  26 artifacts in BOSS's workspace now carries a verdict and a reason: **9 crossed, 12 internal, 5
  not-yet.** `/boss-learn` routes a crossing; nothing watched what never got routed, and 17 artifacts
  had sat unruled. **`not-yet` is a legitimate answer and most of these should keep it. `nobody asked`
  is the state this gate makes impossible.** It fails on an unexamined artifact, on a `crossed` verdict
  whose file doesn't exist, and on a `not-yet` one that quietly shipped — all three verified by
  provoking them. It also caught its own ledger on the first run: four verdicts read "Ships at L2." and
  a reason that short is one that gets inherited instead of re-read.
- **🔴 `mentor-cofounder` shipped invisible, and the boundary work is what surfaced it.** It has been
  installed at MVP and named nowhere in `CLAUDE.md` — so a founding *team* unlocking MVP got the one
  agent built for their exact problem without being told, in the file Claude reads to learn who's on
  the team. **`check:manifests` now fails when a manifest agent is named in no CLAUDE.md
  contribution** — the inverse of `check-refs` class 4, which catches a name with no agent behind it.
  Shipping an agent and telling the project it exists are two acts; only the first was ever gated.

- **The five `not-yet` calls, on the record.** `/vet` is the clearest miss — a founder meets *"some
  thread says you must do X"* constantly and has nothing for it, while nine practices pointed at it by
  name. `prompt-coach`'s own description says *"outward-facing"*; it was authored for founders and
  never left. `/practice-refresh` should exist for a founder's own PRAC records, but as a smaller
  skill, not this one ported. `designer` and `voice-keeper` guard **BOSS's** surface and voice; the
  discipline transfers, the agent doesn't. The other twelve are internal on purpose, and now say why.

*The ledger is tier 2 by construction — tracked here, absent from `files:`, never installed. It
describes the boundary from the side that can afford to name what's on both.*

## 0.177.0 — 2026-08-20

**The name held; the domain never existed. `boss.build` was registered five months before BOSS chose it.**

> **For you:** the install command changed — `npm i -g oyeboss` (was `bossbuild`), and `npx oyeboss
> new my-app`. The `boss` command itself is unchanged and nothing in your project moves. **If you
> already have the old package, you must uninstall it first** — both provide `boss`, so installing
> over it fails with a bare `EEXIST`:
> `npm uninstall -g bossbuild && npm i -g oyeboss`

Ajesh, opening a naming review: *"i'm thinking if we should find a better name than boss… we have
grown past."* The review ran its full course and **kept the name.** What it found instead was that
the domain under it was never real.

- **🔴 `boss.build` has been registered since 2026-01-16** — five months *before* DEC-002
  selected it. `BRAND.md` recorded it as *"unregistered last checked"*; that came from a WebFetch
  seeing no server, which DEC-002 itself flagged as *"promising but not proof."* It sat as the
  rebrand's only open item for eight weeks and the answer was already no. Both named backups
  (`boss.sh`, `getboss.dev`) are gone too. **A domain is registered or it isn't — check the registry,
  not the web server.**
- **New primary: `oyeboss.build`**, verified at the registry, **selected and not yet bought** — the
  record says so on purpose, because writing an unowned domain down as fact is the exact mistake being
  corrected here. The vocative is the point: **"BOSS" alone is a title; "oye boss" is a greeting
  between equals**, and non-hierarchy is the ethos's whole hidden agenda. The disarming used to live
  in prose you only reached on the About page; now it's in the URL. The TLD is the acronym's own
  verb — *"Oye boss. Build out solid stuff."*
- **npm `bossbuild` → `oyeboss`, and the CLI stays `boss`.** That takes three names down to two: the
  install line and the website finally match. `package ≠ command` was never a virtue, it was a
  workaround for `boss` being taken — keeping it while the domain moved would have left the mismatch
  worse. **The command does not become `oye boss`:** a greeting is for arrivals, and one stamped on
  every invocation is the performed warmth the voice spec rules out.
- **🔴 The rename's own two-hop trap.** `boss update` polls the registry *by package name*, so an
  install predating the rename keeps checking `bossbuild`, gets a valid answer, and is told it's
  current forever — the v0.152.0 failure wearing a new hat. `npm deprecate bossbuild` is the only
  thing that reaches those installs; noted in `src/update.js` beside the constant.
- **🔴 Found by testing the migration instead of assuming it: `npm i -g oyeboss` over an existing
  install DIES with `EEXIST`.** Both packages claim the `boss` bin, so npm refuses rather than
  relinking, and the founder gets a raw npm stack trace at the exact moment they're trying to follow
  an upgrade instruction. The uninstall-first line is now stated everywhere the rename is mentioned.
  *(Caught the same way v0.162.0's four bugs were: run the shape you did not design for.)*
- **A lie the rename exposed in `boss update`.** A 404 was being reported as *"Couldn't reach the npm
  registry… Nothing is wrong — this check needs network."* **A 404 is not a transport failure** — the
  registry answered, and its answer was "no such package," which after a rename is the single most
  useful thing BOSS could say. It now gets its own branch naming the likely cause and the fix. The
  old copy was false reassurance, the precise failure class v0.156.0 exists to prevent.
- **`PKG` is now written once** and pinned by a REGRESSION test (**112**), verified to fail when the
  two disagree: the registry URL `boss update` polls and the command it prints must name the same
  package. Change one and not the other and nothing throws — BOSS just checks a package nobody can
  install, or names one it never looks at.
- **What did NOT move**, and the distinction that made the sweep safe: `bossbuild` is *three* things —
  the npm package, the GitHub repo, and the local directory. Only the package changed. Repo URLs,
  `BOSS_SRC` paths and `learn.js`'s source-detection regex are untouched by design.
- **The name survived its own written falsifier.** DEC-002's test was *"boss.build unavailable **and**
  no acceptable on-brand domain exists."* First half fired, second half didn't. Three independent
  sweeps — this decision's ~21 craft words, plus ~38 trueness words and a person/role pass — produced
  **two clean survivors in ~75 candidates**, both rejected as *"boring, not as catchy as BOSS."* Four
  strong candidates died on in-lane collision (BELAY Solutions · Reckon · Honcho · HeyBoss AI, the
  last an OpenAI-Startup-Fund-backed no-code app builder), and **all four were the legible ones.** The
  durable finding, logged in DEC-002 so nobody re-runs it: instantly-readable words are taken *because*
  they are readable, so availability-first sweeps return only what nobody wanted.
- **Repairs v0.176.0**, which shipped that test without the source half — `test/cli.test.js` imported
  `PKG` from a `src/update.js` that didn't export it, so HEAD asserted against `undefined`. Two
  sessions were writing this repo at once; the test landed and the source didn't.
- Swept with `find -exec grep`, never bare `grep` — the gitignored `.claude/` tree has hidden stale
  names through two prior identity sweeps. 111 unit · 136 evals · all gates green.

## 0.176.0 — 2026-08-20

**"Don't instrument yet" was only half-honest — the half it never said was what to leave behind.**

> **For you:** `/measure` no longer sends a founder away empty-handed. Below ~10 users it still says
> *"close this and go talk to them"* — but it now checks the **seam** first: a `created_at` on your user
> and core rows, and one `track()` stub. The timestamp is the only thing on the page you cannot buy back
> later. Depth: `boss craft analytics-for-ai-products`.

Ajesh: *"how about BOSS's approach to analytics, app usage and such — should we research best practices
for embedding analytics into new app ideas, and how to take it from seed to scale?"*

### The research was already done — the answer was a gap inside it

The shelf was in good shape: `analytics-for-ai-products.md` (v0.113.0), `activation.md` (v0.122.0),
`retention.md` (v0.121.0), `/measure`, `/onboard`, `/health`, `/evals`, `/judge-traces`, `/ai-cost`. A
fresh sweep would have rediscovered the 2026-07-23 research, and the practice is not due until
2027-01-19. **No research was run.**

And the premise needed correcting rather than serving: *embedding analytics into new app ideas* is the
thing this practice explicitly **refuses** — the JIT boundary (n<10 → talk to them; instrument at n≥30–50)
is its strongest line.

### 🔴 But the refusal had a hole, and it cost the founder something real

The boundary said *don't instrument* and **never said what to leave behind** — so a founder who obeyed it
*correctly* still lost history they already had. You can add a tracking call any day. **You cannot add the
past.** Without `created_at` on user + core rows, the day you finally measure is day zero and your first
readable retention curve is another 30–90 days out — for data your own database would have had all along.

- **`analytics-for-ai-products.md` § "But leave the seam"** — the two seams in cost order: the **history
  seam** (`created_at`, un-backfillable) and the **call seam** (one `track()` stub vs. forty call sites,
  `scalable-architecture`'s cut-along-an-existing-seam rule applied to measurement). Plus the boundary that
  keeps this from re-growing the thing it refuses: **the seam is a timestamp column and a stub function** —
  naming events means you crossed back over.
- **The humane read is what makes it shippable.** You are timestamping **your own rows**, not watching a
  person — the [[IDEA-021]] contract exactly (*the work already leaves an honest trace*). A `created_at` on
  a record the user asked you to create is not surveillance; a session recorder on a user who didn't is.
- **`/measure` step 0 + a new rule** — says no, then hands back the seam. Description updated so the routing
  carries it.

### The load-bearing half was missing from `data-schema.md` too

That practice already had **"Schema decisions are one-way doors"** and the missing timestamp is one — just
not the kind it was watching for. Every other door there is a *leak or migration* risk; this one is **lost
history**, which is why it stayed invisible. Added as a one-way door (with the note that it runs *opposite*
to the store-less bullet above it: store less of the **user**, but do store **when their own rows
happened**), and reconciled into Altitude/JIT — it sits at MVP next to RLS, not at V1, because it costs one
line and needs no decision.

**The freshness clock on both practices is deliberately HELD.** A section is not a sweep — the v0.150.0
correction, applied to itself.

### What was deliberately NOT built

The measurement ladder **stops at MVP**: L2-V1 ships 4 skills (sequencing + design, zero measurement), L3-Scale
ships `/incident`, and `/economics` is named in the manifest as trigger-gated and unauthored. That is a
real gap — and it stays open. It has already been deferred twice on purpose ([[IDEA-051]], `/economics`),
both waiting on a real project's symptom, and [[EVID-001]] is explicit that post-launch surface for
operators BOSS has **zero** of is the pattern to stop repeating. **0 new skills (47 → 47), 0 new
practices (30 → 30)** — three sections on files that already existed.

## 0.175.0 — 2026-08-20

**The docs your *users* read — the half BOSS had no coverage of at all.**

> **For you:** `/ship` now asks, once and only when it can name the actual confusion, whether an
> arriving user can work out what to do — and points at the fix *upstream* (an empty state, a clearer
> label) before it points at an article. Depth: `boss craft documentation` §7.

Ajesh, clarifying a question answered at the wrong altitude: *"I meant for app documentation for
someone creating a new app via BOSS… like a help guide or such in an app."*

### 🔴 The gap was total

Grep the shipped surface: `help guide` **0** · `help center` **0** · `user documentation` **0** ·
`docs site` **0** · `FAQ` **0** · `support article` **0** · `tooltip` **0**. The near-misses all scope
it out explicitly — **`/onboard`'s own description** says *"Scope: your USERS' first run — not a new
teammate's first week"*; `activation.md` mentions help only in its **refuses** list (forced tutorials);
`landing-page.md` and `ship-it-live.md` have nothing. v0.172.0's `documentation.md` was **entirely
inward-facing**.

BOSS ran capture → canvas → spec → build → ship → activate → measure with nothing for *"your users
need to understand how to use this."*

### The answer is subtraction, not a docs feature

`documentation.md` **§7 — The docs your users read**, whose load-bearing line is **ask first whether
the doc should exist**: a help article is often a defect report about the interface, written by the
team that shipped the defect. Empty state > article; better label > FAQ entry; worked example
in-product > tutorial.

- **The two-reader cut, re-aimed.** §2's second reader was the model working in your repo. Here it is
  **an assistant answering "how do I do X in your product" for someone who never opened your site** —
  so name the objects in the prose, one page per task with the answer near the top, publish clean
  markdown, and date what's version-specific.
- **`llms.txt` — cheap, worth doing, do not oversell.** Recorded with its honest status: **no major
  model provider has publicly committed to reading it in production** as of early 2026, yet Stripe /
  Vercel / Cloudflare / Anthropic / Cursor ship it because their users' coding agents consume it today.
  A **content-authority** play, not access control, and **not** a growth channel. Flagged in
  `provenance:` as the fastest-moving claim in the doc — re-check it on every refresh.
- **A knowledge base / graph over the docs was weighed and DECLINED**, and the published guidance is
  itself the argument: *fit the whole corpus in one context window*. That is the docs-side statement of
  `retrieval.md` **rung 0** — a corpus small enough to read whole needs no index, no embeddings, no
  graph. The discipline is pruning, not infrastructure. Measured before deciding: a fresh L1 project is
  **17 files / ~20k tokens**; BOSS's own *tracked* docs are **8 files / ~20k**.

### Also — a time-bomb test, defused

`boss changelog --since` was tested by asserting the **oldest included release** appeared in the
output. The list is capped for readability and folds its tail into *"… +N older"*, so that assertion
passed until enough releases shipped to push `0.150.0` into the fold — **then failed for a reason
unrelated to the behaviour under test.** This release is the one that tipped it (26 since `0.149.0`).
Rewritten to assert the **contract**: the `--since` base is honoured, the newest release (read from
`VERSION`) is shown, older ones are excluded. None of those depend on how many rows fit on screen.

### `/ship` step 6b — gated hard, on purpose

Step 6 asks who *finds* it; 6b asks whether they can *use* it. It fires **only when it can point at a
specific confusion** — a screen with no empty state, a concept named but never explained, a step the
founder talked the last user through by hand. If it cannot name one it says nothing, because a generic
*"have you written docs?"* is the checklist nag this skill refuses everywhere else. Never a gate.

## 0.174.0 — 2026-08-20

**The eval gate could lose cases and still print "passed."**

Found while authoring v0.170.0's eval set, fixed here because it undermines every
other guarantee in the repo. The conscience eval suite is one of BOSS's three quality
channels and the one its own README leads with — **it was capable of reporting green
on a file it had only half-read.**

- **🔴 The parser is a deliberate subset, and on a construct it can't represent it
  stopped early and returned what it had — without failing.** A `why:` value wrapped
  onto a second line **dropped 6 of 7 cases while the suite still printed
  `passed`**. Separately, an inline `content: "…\n…"` parsed to a *literal*
  backslash-n, so a `^status:` predicate could never match and the case failed for a
  reason nothing reported.
- **The fix is reconciliation, not a bigger parser.** Growing the parser risks
  changing how 170+ existing cases parse, for no gain. `reconcileCases()` instead
  compares what the **file declares** (`^- id:`) against what came **back**, and
  names the cases that vanished. That catches any future silent drop regardless of
  which construct caused it — including ones nobody has hit yet.
- **It names the fix, not just the fault.** The `\n` diagnostic points at the
  FIXTURES registry, which exists for exactly this and whose own comment had said so
  since v0.27.0 — the trap was documented and still cost two hours.
- **4 new unit tests (102 → 106), three marked REGRESSION and each verified to fail
  before the guard existed.** The fourth asserts every *shipped* eval file reconciles
  today, so this can't quietly regress.

*A gate that quietly loses cases reports confidence it hasn't earned — which is worse
than no gate, because you stop looking.*

## 0.173.0 — 2026-08-20

**The back-office gap, answered with routing instead of surface.**

Ajesh: *"boss is there to help with early finance and HR, onboarding new employees, sharing culture
support… where are we weak or could further extend boss? do we need to add mentors?"* The gap is
real and mostly unbuilt. The first move is **two lines on agents that already exist**, not a 48th skill.

### What the sweep found

Grep the shipped surface: `payroll` 0 · `bookkeep` 0 · `compensation` 0 · `handbook` 0 ·
`performance review` 0 · `board meeting` 0. **"Early finance" today means the LLM bill**
(`/ai-cost` + `/cost-review`) **and the first dollar** (`/money`) — the operating middle (runway,
books, business/personal separation) has nothing. Employee onboarding has nothing. Culture has one
practice scoped to AI rollout. [[IDEA-052]] already designed the answer — briefs-as-interface · **one**
`mentor-operations` seat, not four · collaborator classes — and it is still unbuilt. [[IDEA-004]],
the values table Ajesh's own vision doc calls the differentiator, has been `exploring` since 2026-05-21.

### 🔴 `/onboard` was a false friend

A founder who hires someone and types `/onboard` got an **activation-funnel** skill with no signal
they were in the wrong place — and the description is what routes the founder *and the model*.
v0.157.0 deliberately kept `/onboard` separate from `/health`, so this is a **scope line, not a
rename**: *your USERS' first run — not a new teammate's first week.*

### The routing half, on mentors that already exist

v0.165.0's finding was that `mentor-architect` **owned** `mcp.md` and named MCP nowhere in the
decision set it walked a founder through. **This domain has the identical shape.** `mentor-talent`
and `mentor-business` both already say *"point to a real lawyer / accountant"* — the disclaimer
without the tool. Both now carry the other half: **hand off well.** Before the call, write down what
the company is in two lines, what's already decided (`DEC-*.md` — entity, splits, pricing), and the
three questions — *an hourly professional is the most expensive place to think out loud.*

**Zero new skills (47 → 47.)** It's a **posture**, not professional-domain content — which is why it
needs no real engagement to shape it.

### Recorded, not earned

`/brief` was scoped and **not built.** IDEA-052's handoff prompt carries a hard stop — *"confirm a
real professional engagement exists to shape it against; if not, stop"* — which Ajesh **overrode**
this session. The build was then pulled back on **scope**, not on the gate. So the override stands
unspent and the stop stands unmet, and both are recorded in IDEA-052 rather than left for the next
session to read as a green light it already earned.

## 0.172.0 — 2026-08-20

**Documentation becomes a practice — and the discipline BOSS had shipped for 167 releases finally
gets written down.**

> **For you:** `/spec` now says back what it had to **assume** before you build, and asks for one
> worked example and what "wrong" looks like — the corrections are the best documentation you'll get.
> A FEAT gains a **Build log** so a feature's story stays whole across releases. `boss board` shows
> **how far** through a feature you are, not just that it's in flight. And `docs/ideas/INDEX.md` is no
> longer a table you maintain.

Ajesh: *"see how BOSS recommends and captures documentation for a new app — can we fortify it from
our leaders in AI, and PM leaders… a better way to store, access, record… surface up progress?"* Then:
*"what about design, organization, fonts and readability"*, *"an internal blog… a living journal"*, and
*"how do we capture as many details before going and building?"* The assessment is
`docs/dossier/documentation-and-progress-pass-001.md`.

### 🔴 The finding was the absence

BOSS's capture spine — `/triage` · `/canvas` · `/evidence` · `/decide` · `/spec` · `/log` · `/close` —
lived across **eight skills and zero practices.** So it could not be `/practice-refresh`ed, could not
carry a `curve:`, could not be cited, and no watchlist domain could claim it. Everything else BOSS
knows has a practice. The one it uses most did not.

`library/practices/documentation.md` (`curve: craft-ai`) closes it, and **watchlist domain 13** now
claims it. That is **n=3** on the same failure mode (domains 11, 12, 13 all added this way): a
watchlist assembled from the practices that exist inherits their blind spots. The v0.160.0 reverse
sweep caught this one within a minute of the practice existing — it closes the has-practice-no-domain
half fast and stays blind to the neither-exists half.

### The plan-time step: say back what you guessed

A model asked to spec a feature completes every gap fluently, and **a founder cannot correct a guess
they never saw.** `/spec` step 3 now separates what it was told from what it filled in: assumptions as
one-line rejectable claims, one concrete worked example (the highest-yield question available), what
"wrong" looks like, and an explicit *didn't guess* list. The FEAT template gains `## Assumptions` and
`## What "wrong" looks like` to hold the answers.

**The corrections are the documentation** — the sentence a founder writes to replace a wrong assumption
is by construction the thing non-obvious enough that a competent reader got it wrong.

### The per-feature journal, on an artifact that already exists

The devlog is per **session**; this changelog is per **release**. A feature landing across several of
either has its story shattered with nothing joining the pieces. The FEAT record already spans versions,
so it gains an append-only `## Build log` — **the decision and the surprise, never the narration.**
Two guards, because this is the artifact most likely to rot into theater: *would you write it if
nobody read it*, and *it never gates a ship*.

### Progress that was always there, never read

`/spec` has shipped acceptance criteria as `- [ ]` checkboxes since MVP mode existed and **nothing ever
ticked them** — a FEAT one criterion from done and one nobody had started rendered identically.
`/log` now ticks them; `boss board` renders `[3/4 criteria]` in the terminal and a segmented meter in
`--html`, scoped to the *Acceptance criteria* section only (counting the smoke list would inflate it —
a progress number that flatters is worse than none). Untouched FEATs show nothing rather than a
discouraging `0/5`.

### Subtracted: the index table BOSS did not believe

`src/board.js` has always carried a comment calling `docs/ideas/INDEX.md` *"a hand-maintained table
that can drift… a board that trusts a drifting source lies"* — and `docs/IDS.md` already told everyone
to grep the files instead. **BOSS shipped a file it told founders to maintain and then refused to
read.** The table is gone; INDEX.md is now a pointer at `boss board` and the files. Ten skill/agent
instructions to "add a row" were removed — every one of them a step deleted, not added.

### `boss board --html` looks like BOSS again

The visual identity locked on 2026-08-18 (concrete · graphite · one hi-vis mark, straight cuts, the
mono stack). `board.js` predated it and shipped **indigo `#4b54c6` with a generic sans** — into the
founder's project, the one visual surface BOSS puts there. Now on the locked tokens, with columns as a
**monochrome weight progression** rather than four hues: hi-vis is the brand and never a state, so
spending the palette on pipeline position misreads the whole system. Hi-vis is reserved for the one
line that says *captured, nothing proven* — the humane-lens override, made visual.

### 🔴 A shipped bug the pass turned up: a FEAT could be written where nothing reads it

`/spec`'s SKILL.md said write the FEAT to `docs/ideas/`; **its own bundled template said
`docs/features/`** — and `boss board` only ever read `docs/ideas/`. A founder whose model followed the
template (the more recent instruction, loaded on demand at write time) got a FEAT that was invisible to
the board and to every skill that looks for one — the board reported *"nothing captured yet"* with the
spec sitting right there on disk. Template corrected, and it now says **why** the folder matters.
`check:refs` didn't catch it because a write-target is not a link — noted as a real limit of that sweep.

### Also

- **Spec-anchored, not spec-first.** `/revalidate` gains a post-ship mode — *does this FEAT still
  describe what the code does?* — reusing the existing `next_review:` machinery. Opt-in, never on a
  cadence BOSS chose. `/log` offers the stamp at ship only for specs someone will actually rely on.
- **A compaction rule** in `context-discipline.md`: window, archive, canonical. BOSS learned this on
  itself — `RESUME.md` was hand-split twice and several releases' state sections were never written.
- **Verified primaries** (`/vet` step 3): Anthropic *Effective context engineering* — BOSS already had
  3 of its 4 patterns, **compaction** was the miss; Grabowski *Spec Growth Engine* (arXiv 2606.27045);
  Cagan/SVPG *Discovery vs. Documentation*, which **confirms** restraint moment #4 rather than adding
  to it. **Rejected:** the "~50% error reduction from human-refined specs" figure — secondary source
  only, primary never read.

## 0.171.0 — 2026-08-20

**The content layer finally gets vetted — and the vet found the thing that shipped wrong.**

[RVW-077](../docs/research/verdicts/RVW-077-content-design-half.md). Four releases of design work were
built on a research capture that had **never been through `/vet`**. Running it changed the shipped
surface, which is the argument for running it.

### 🔴 Two process failures the verdict records about itself

**It's retrospective.** The content half already shipped across v0.167.0 and v0.168.0. BOSS's order is
capture → `/vet` → `/boss-learn`, and it was inverted. A verdict written after the code exists is a
**weaker check** — the sunk work biases toward approval. **And it's self-authored:** the same agent
wrote the capture and graded it, so the adversarial distance `/vet` exists to provide was absent. An
independent pass is recorded as **still owed**.

### What the vet actually changed

**Verdict: ADAPT, not ADOPT** — matching both design precedents ([[RVW-014]], [[RVW-052]]), which
landed the same way for the same reason: *outside design advice is sound in substance and wrong in
dose for a green founder.*

- **Attribution: the zeroheight numbers DO NOT VERIFY and are quarantined.** Tokens 56%→84%, "8% very
  stable", "56% using AI / 15% living up to the hype" — all taken from search summaries, **the report
  body was never read.** Vendor-run, self-selected, enterprise-skewed. They appear in no shipped doc,
  and they must not.
- **The "practitioner consensus" is vendor-blog tier** — Glean sells search, uxwritinghub sells a
  workshop. Strip the borrowed authority and the *external* case is thin. **What the claim actually
  earns on is BOSS's own dogfood evidence:** it built `voice-keeper` for itself and ships founders
  nothing. That's PRINCIPLE #1 pointing at a hole, and it's worth more than the literature.
- **The capture overstated the gap.** `ai-ux-patterns.md` §6 and §8 already *are* content rules; the
  style-guide template already had a Voice section. It **sharpens**, it doesn't fill. Noted as a
  pattern to watch: *overstating a gap is how unearned building gets justified.*

### 🔴 The modification that was missing, now shipped

Rubric Q4 caps a cohort-split claim at *"ADAPT-with-scoping at best"* — and **the content half was
not cohort-scoped at all**, while the token half of the same skill is meticulous about it. Fixed:

- **`first-product` / `vibe-coder-newbie` — terminology ONLY**, three rows, voice and tone
  **deferred**. Someone who hasn't shipped can't tell *"plain over clever"* from *"friendly over
  formal"*, and **a table filled in because it was asked for steers nothing.**
- **`domain-expert` — tone FIRST, not terminology.** In a high-stakes domain, how the product speaks
  when it's *uncertain or wrong* outranks vocabulary consistency.
- `eng-builder` / `returning-founder` terse full set · `vibe-virtuoso` gets the checkable-vs-not
  asymmetry explained · `indie-hacker` right-sized · `non-tech-founder` one concrete example.

The style guide's Voice section now says plainly that **deferring it is a real choice**, and points
at Terminology first.

**The general rule this encodes:** ship the **checkable** content rule to everyone; ship the
**judgment-shaped** ones only to founders with enough product to judge against. Content discipline
arriving before there is copy to be inconsistent about is PRINCIPLE #2's premature ceremony wearing a
design-system hat.

> **For you:** if you're early, BOSS now asks you for one thing — pick the words for your two or three
> main concepts and stay consistent. The voice-and-tone table waits until you've watched real people
> read your screens. Unless you're building somewhere high-stakes, in which case how your product
> talks when it's *unsure* comes first.

## 0.170.0 — 2026-08-20

> **For you:** The conscience now speaks about **testing** — if you've shipped a feature and nothing guards it, it says so once. A deliberately low bar: does *anything* test it, not is your coverage good.

**The conscience learns to speak about testing — the one craft domain it never mentioned.**

Ajesh: *"how do we from seed to scale integrate and develop testing… triaging, self healing,
rca, ensuring failures is getting caught?"* The audit is captured as IDEA-059. The short version:
BOSS's **pre-ship** testing craft is strong and lands entirely on **one rung** — L0 has nothing
(correct), **L1 has all of it**, **L2 has none**, L3 has a post-mortem. Testing arrives
fully-formed at MVP and stops growing.

### 🔴 Fourteen loops across four modes, and not one was about testing

That is the finding this release acts on. BOSS's whole differentiator is the **unprompted**
judgment layer, and the domain where an agent most reliably fools the person it works for is
**tests the agent wrote itself** — BOSS's own named failure mode, written down in `tester` and
`testing-with-agents.md`. It was the only craft area with no unprompted moment. The sharpest line
in the product fired **only if the founder already thought to ask.**

### `verification-loop` (L1) → moment `unverified`

- **Entry is deliberately `focus-loop`'s exit** — at least one FEAT at `status: shipped|done` —
  **plus a non-empty `src/`.** Both halves matter: a shipped spec with no code is a plan, and code
  with no shipped FEAT is a prototype. Neither has earned the question (PRINCIPLE #2).
- **Exit is one file: `.boss/smoke.json`.** A deliberately low bar — the loop asks whether
  *anything at all* can tell you the thing you shipped still works, not for coverage or a suite.
- **The frame carries the judgment the predicate can't**, in order: (1) do they already have
  verification under another name — a real `npm test`, a CI job — in which case **the gap is
  BOSS's blindness, not their discipline**, and it says so instead of lecturing; (2) if tests
  exist, were they written against the acceptance criteria or against whatever the code already
  did (`tester`'s line, finally firing unprompted); (3) if there is genuinely nothing, name the
  *specific* criterion nothing checks — never a generic "you should add tests."
- **Refusals stated in the loop, not left to drift.** Self-healing *assertions* is BOSS
  automating its own named failure mode and is refused outright; self-healing *infrastructure*
  (retry, reseed, restart) is fine — **the environment may heal itself, the expectation may not.**
  No coverage percentage, ever. Silent at Quickstart.

### The gate grew by 7 and proved three things

**129 → 136 cases, 0 failures.** Two of the new cases exist purely to pin **no cross-talk**:
`moment-focus.yml` materializes FEAT files in 30 cases but creates no `src/`, and the
cost/failure-mode sets create `src/` but no FEATs — so the two-predicate entry means neither can
satisfy this loop. That was designed for, then tested, not assumed.

- **Confidence is `low` at one shipped FEAT and `high` at three**, and the case says why:
  `computeConfidence` reads whichever count-style entry predicate comes **first**. Ordering the
  `src/**` character-count first would have made every fire "high" off nothing but file size —
  a latent trap for any future loop author, now documented in a test rather than a comment.
- **Two authoring traps hit in the process, both silent.** The eval YAML parser supports neither
  multi-line scalars nor `\n` escapes: wrapped `why:` values made **6 of 7 cases vanish** while the
  suite still reported green, and inline `content:` strings wrote literal backslash-n so
  `^status:` never matched. Fixtures exist for exactly this reason; the new ones say so.
- `unverified` added to `JUDGE_MOMENTS` — the frame induces a bounded read, and the frequency
  ledger under-reports cost if that set is wrong.
- README + PATTERNS eval-count claims re-stamped **by the gate catching them**, not by memory.

**Not built, and gated on a real signal:** post-ship failure *detection* (nothing in `library/` or
any stage covers error tracking — `/ship` still has no opinion on how you learn it broke) and the
L2 rung. Both **n=0**; a market read is not the demand half. See IDEA-059.

## 0.169.0 — 2026-08-20

**The designer handoff, and a claim of BOSS's own that didn't survive checking.**

### 🔴 The overclaim, caught before a founder saw it

v0.166.0 told founders the design library *"uploads as cards with no extra work"* to a host
design-system pane. **Verified against the published Claude Code system-prompt mirror: wrong.**

`/design-sync` pins a project, detects a **Storybook or package** layout, runs **its own deterministic
converters**, grades previews against a rubric, and emits a *bundle* — `_ds_bundle.js`, a `styles.css`
transitive `@import` closure, `components/<group>/<Name>/{.html,.jsx,.d.ts,.prompt.md}`, and
`_ds_sync.json` recording content hashes. First import on a large repo *"potentially takes hours."*
**One matching marker is not format compatibility.**

What survived: the **`@dsCard` first-line marker is correct** — BOSS's templates match. And
`_ds_sync.json`'s content-hash anchoring is the **same mechanism** as this library's `sourceHash`,
arrived at independently, which is weak evidence the approach is right and strong evidence BOSS
shouldn't build the other half.

The skill now says the honest thing: the two are **complementary, not interchangeable** — the gallery
is what a *person* looks at, the bundle is what a *design tool* consumes. **This is the third
overclaim this arc has corrected** (the drift-loop predicate, the terminology check, now this). The
pattern is stable enough to state: *this practice's claims rot faster than its ideas, and the only
defense is checking each one against the thing it describes.*

> The useful convergence: a host sync reads your **real components**, and so does `/design-library`.
> Both work for the same reason — element-shaped components in a conventional layout. That's the
> *component boundaries* row of the seed-that-scales test paying off twice. A codebase of page-shaped
> components has nothing for either one to read.

### The designer handoff — `docs/design/HANDOFF.md`

Ajesh: *"when they do bring in a designer… help bridge the divide, or help with onboarding a designer
thru boss?"* The library **is** the handoff artifact, so the brief is mostly assembly: what the
product is · what's decided **and its tradeoff** (a designer who doesn't know *"calm over engaging"*
was a decision will helpfully propose engaging) · **what's fixed vs. open** (the accessibility floor
and five states aren't negotiable; type and color mostly are — say which up front or relitigate it in
review) · where the system lives, **DTCG export first**, because tokens are the one layer that
round-trips cleanly · **what's actually wrong** — the open findings, the most useful page in the brief
and the one founders skip out of embarrassment · and a **scoped** ask, since the five-state table is a
ready-made work order.

**Deliberately not a `/brief designer`.** [[IDEA-052]]'s brief slice carries a hard gate — *don't
author brief content without a real engagement* — and it's right, because knowing what an accountant
needs is knowledge you can only get by having done it. **The designer case has no such dependency:**
it composes entirely from artifacts BOSS already generates, so it isn't imagined, it's assembled. It
lives next to the system it hands over rather than inheriting a gate it doesn't need.

**And the population finding IDEA-052 was missing:** its three-way split puts professionals-you-engage
(*"will never use BOSS, and shouldn't"*) opposite people-you-hire. **A designer is the second who also
arrives carrying their own tool that must interoperate with the repo** — neither model fits alone, and
the interop half is what neither anticipated. Recorded there.

### States get structural names

From the DESIGN.md spec's one genuinely better idea: name a state `button-primary-hover`, not "the
hover state of the primary button." **A prose checklist is something a reviewer must remember to look
for; a naming convention makes a missing state something you can enumerate.** The five-state
requirement, moved from filter to boundary, for the price of a naming rule.

> **For you:** `/design-library` now writes a designer handoff — what's decided, what's fixed vs.
> open, where your tokens are, and an honest list of what's currently broken. Hand it over with the
> library URL instead of a repo checkout. If you use a design tool, start at the token layer; that's
> the part that actually syncs both directions.

## 0.168.0 — 2026-08-20

**The content layer gets a reader and its one real boundary.**

v0.167.0 gave the content half an **author** — voice traits, a tone table, terminology — and no
**reader.** Nothing checked any of it, which is the same shape as every other finding in this arc:
a declaration with nobody on the other end.

### 🔴 `content-terminology-guard` — shipped in the same release that claimed it was possible

v0.167.0 states, twice, that *"terminology is the one content rule a check can actually enforce."*
**Shipping that claim without the check would have been the third time this practice described a
mechanism it didn't provide** — after the prompt-convention-as-boundary and `design-drift-loop`'s
overstated predicate. Twice is a slip. Three times is a pattern, and this doc has now been given a
rule about exactly that.

- **Terminology only, and it says so in its own header.** *"Do not extend this hook to tone — it
  cannot be done with a regex, and a check that pretends otherwise is worse than no check."*
  Voice and tone stay filters, named as filters. This is the whole boundary the content layer gets.
- **Copy only, never identifiers.** It reads string literals and JSX/HTML text nodes, and skips
  imports, paths, URLs and class strings — enforcing the style guide's own rule that *the product
  says `team` while the code can say whatever it likes.* A hook that renamed variables would be
  enforcing a rule nobody wrote.
- **A skeleton table is not a decision.** The JIT gate needs at least one *filled* row; unfilled
  `<placeholder>` rows are skipped, so a founder who hasn't authored terminology is never nagged.
- Dormant by default, offered once by `/design-tokens-init`, fail-open on any surprise.
- Verified across seven cases including the negatives: fires on JSX copy and on string literals,
  **silent** on identifiers, on clean copy, on a missing style guide, on a skeleton-only table, and
  exits 0 on malformed input.

### The reviewers learn to read

- **`/design-review`** (before code) gains a content pass — terminology first because it's the most
  checkable, then error/confirm/empty-state copy, then on-voice. **And for AI-mediated FEATs, the
  copy the model will generate at runtime is explicitly in scope.**
- **`/ux-check`** (after code) reads the copy that actually *shipped* — which diverges from the spec
  more often than the layout does, because strings get written inline and never reviewed. Includes
  triggering a real refusal and a real rate limit to hear what the product sounds like when it fails.
- **`ux-designer`** gains content authority. It owned one line about empty-state copy; it now owns
  terminology, error copy, destructive confirms and voice — *copy is your surface, not the coder's
  leftovers.*

### `/ai-failure-states` claims the copy nobody reviewed

Every one of the five failure states ends in **words a user reads**, and a designed failure state
with default copy is only half designed: the founder specified the behavior and let the model write
the sentence. Four surfaces now named with what ships if nobody decides — refusal/hedge, retry/rate
limit, streaming/latency, pre-action confirm.

**The load-bearing line: the system prompt is product copy.** It's the one user-facing text that
never appears as a literal in your source, so **no check will ever catch it** — including the one
this release ships. If the style guide says the product says *team*, a system prompt saying
*workspace* drifts silently forever. Review it by hand against voice and terminology, or don't
pretend it's covered.

> **For you:** turn on `content-terminology-guard` and Claude gets told the moment it writes *"org"*
> in a button where you decided on *"team"* — copy only, your variable names are your own.
> `/design-review` and `/ux-check` now read your copy against your voice, not just your layout. And
> if you ship an AI feature, `/ai-failure-states` now makes you write the actual words for refusals,
> retries and confirmations — the moments where a product most sounds like nobody wrote it.

## 0.167.0 — 2026-08-20

**The design system gets its content half — and the library gets something to render.**

v0.166.0 shipped `/design-library`, which renders do/don't pairs and a terminology table. The
authoring template had **neither section.** A renderer without an author is a seam, and it was one I
opened in the same release — so this closes it, and takes the three other cheap items with it.

### `STYLE_GUIDE.md` grows the half BOSS never shipped

The design layer had eight sections and all of them were about how things look. A grep of the entire
shipped surface for microcopy / voice / tone / content design used to return **one line** (an
empty-state note in `ux-designer`). Now:

- **Do / Don't as pairs** — the **rule** rung of the ladder, and the only rung an agent can act on.
  With the test attached: *if a principle never produced a row here, it isn't steering anything yet.*
- **Terminology — one word per concept.** Cheapest content rule to write, most expensive to change
  late (renaming a core noun hits copy, routes, schema, tests and every prompt at once), and **the
  one content rule that is mechanically checkable** — which is why it's the first one worth having.
  Rule of thumb: the user's word beats the internal one; the code can say whatever it likes.
- **Voice split from tone.** Voice is constant (3 traits, each with a tradeoff — same falsifier as
  the principles); tone shifts by context (success / error / warning / destructive confirm / empty /
  loading), each with a **real string**, because an agent cannot act on an adjective.

### The `CLAUDE.md` inlining trick, pointed at words

`/design-tokens-init` already inlines the semantic→primitive token map so *"the agent inherits the
brand for free on every turn."* It now does the same for voice traits + the terminology list + four
rules for any user-facing string.

**Copy needs this more than color does.** The model reverts to the mean harder on words than on
values — nobody has to prompt an LLM into writing *"Oops! Something went wrong."*; that **is** the
mean. It's the 47 blues, in sentences. Stated honestly: **there is no regex for off-voice**, so the
guard-hook boundary that saves the token system does not transfer. This layer is filters, and worth
shipping as filters — *except terminology*, which is a word list and therefore checkable.

And the part the content-design field isn't covering: **in an AI product most copy is generated at
runtime, not authored here** — system prompts, refusal and hedge language, retry messages, the words
before a destructive agent action. That's product copy in whoever's voice the model defaults to,
which is nobody's. Set it, or the model sets it for you in the moments that matter most: the failures.

### Retirement — the other half of the library's ⚪ unused badge

The badge existed; nothing said what to do about it, which makes it trivia. Now: **a component
nobody uses isn't neutral — it's a wrong answer sitting in the reuse index where the next search
will find it.** The prototype registry's subtraction rule, one level up, and it bites harder under AI
generation because **components accumulate faster than anyone prunes them** (billion-line drift, seen
from the other end — the generation side has been documented since v0.20.x, the pruning side never
was). Founder-scale means one habit, not a process: when the library shows unused, delete it in the
same pass. No deprecation window, no SemVer, no RFC — those are real for teams with consuming teams
and unearned ceremony for one person.

### 🔴 A watchlist trigger the last sweep proved was missing

Build-craft domain 2 (the host surface) now fires on **"a tool BOSS has never seen appears in the
session toolbelt."** It was added because the documented taps missed one: `DesignSync` — host sync
for a component library — was found by *reading the session's own tool list*, while BOSS had zero
references to it and was building an overlapping artifact. **The taps watch publications; the toolbelt
is ground truth and arrives first.** Read the tool list at the start of a sweep, not just the release
notes. This is the same class of finding that created the discipline: the mechanism had a blind spot
only a live run could expose.

> **For you:** your style guide now covers what your product *says*, not just how it looks — voice
> traits, a tone table for errors and confirmations, and a terminology list. `/design-tokens-init`
> inlines them into `CLAUDE.md`, so Claude writes your buttons and error messages in your voice
> instead of the internet's default. If you have an AI feature, that includes the copy it generates
> at runtime — refusals, retries, and the words before something irreversible.

## 0.166.0 — 2026-08-20

> **For you:** **`/design-library`** — a design system you can actually look at. Generates a gallery of your components (every variant, all five states) *from your code*, so it can't drift, plus a reuse index the agent reads before writing a new component.

**Design gets the surface it never had: the system you can actually look at.**

Ajesh: *"a lot of people need visual, to assess… the main thing is to capture any drift from
implementation vs style guide vs prototyping from the component library."* A field sweep first
(four claims captured to `docs/research/inbox/`, all pending `/vet`), then the build. The sweep's
verdict on BOSS's existing design layer was **better than expected on taste and discipline, and
blind in exactly two places** — components, and words.

### `/design-library` (V1) — foundations + **rule sets** + components, generated from the code

`DESIGN_TOKENS.md`, `STYLE_GUIDE.md` and `PROTOTYPES.md` are the right artifacts and **all three are
unlookable.** Markdown cannot show you a button, so the question a founder actually asks — *"what do
I already have, and does it still match what I said?"* — had no surface that answers it.

- **Generated, never authored.** The code is the source of truth. A gallery authored *beside* the
  code is the two-sources-of-truth trap. This also dissolves the question people ask first — *"how do
  I update it centrally so the change flows back everywhere?"* **You don't, because you never had
  to:** `Button.tsx` *is* the button, every use site imports it. That propagation isn't a feature to
  build; it's what a component already is. **The library's job was never propagation — it's
  visibility, reuse, and drift.**
- **Not just components — the rule sets are half of it.** Principles with their tradeoffs, **do/don't
  pairs rendered side by side**, terminology, voice, the five-state table. A rule in prose is a
  sentence you skim; the same rule rendered is a thing you *see*. A component-only library teaches
  founder and agent that design *is* components — it isn't, and the rules are the half that survives
  a rewrite.
- **Drift renders ON the component, not in a report nobody reopens** — *off-token · missing state ·
  near-duplicate · stale · unused*. A clean library is a page with no badges, which is a **positive**
  signal as much as a warning: it shows what you've built, not only what's wrong.
- **`manifest.json` is the reuse index the system never had.** *Reuse first, extend second, create
  last* was always a prompt convention — a filter. Name · purpose · import line · variants gives the
  agent something to look at, and a **source hash per component** makes staleness mechanically
  checkable. That's the boundary the practice kept asking for.
- **Zero-dep, self-contained HTML.** No build step, no service, no account — a file in the repo.
  `@dsCard` markers mean it drops into a host design-system pane for free if the founder ever syncs;
  **BOSS builds no sync engine and no hosting surface** (host-seam rule).

### 🔴 A shipped-guidance bug, fixed

`design-drift-loop.md` claimed it watched *"near-duplicate components multiplying"* and a staling
tokens file. **Its predicate is a single hex regex over `src/**` and always was.** A loop doc that
overstates its predicate is worse than one admitting a gap — the founder stops looking for the
failure it silently isn't catching. **A predicate is the claim; prose must not exceed it.** This is
the *third* doc-vs-filesystem mismatch in this practice's history (after the stale TODO list and the
`STYLE_GUIDE.md` false ✅), which is no longer a coincidence: **this doc's claims rot faster than its
ideas.**

### `design-system.md` — two additions the sweep earned

- **The seed-that-scales test.** *"Just enough at the start, not over-engineered"* becomes decidable:
  **decide it at seed if reversing it gets more expensive as the app grows; defer everything else.**
  With the sorted list — and the row BOSS was missing: **component boundaries (element-shaped, not
  page-shaped)**, which is the *upstream cause* of two failure modes the catalog already named as
  symptoms. Ask an AI for a screen and you get `DashboardPage.tsx` with the buttons inline; every one
  is a primitive that never got extracted. One sentence at seed; a cross-screen refactor at V1.
- **Drift is a one-way problem, not a three-way one.** If the library is generated from code it *is*
  the implementation, and if prototypes compose library components they are too — leaving only
  **declared rules vs. actual system.** Bounded honestly: that comparison only reaches as far down
  the ladder as you went, so **the principle→guideline→rule ladder is what makes drift detectable at
  all**, not just what makes the agent actionable.

### Wiring, not new surface

`/design-review` and `/ux-check` now read the manifest instead of asking the model to remember to
check · the prototype registry gains the level-up rule (**a prototype composes existing components,
it doesn't redraw them** — an off-library mockup injects a whole *component* at spec time) ·
`/design-tokens-init` points forward and no longer implies the drift loop catches component failures.

> **For you:** at V1, `/design-library` renders your whole design system — colors, type, spacing, your
> principles and do/don'ts, and every component in all five states — as one HTML page generated from
> your code, so it can't drift. It flags off-token values, missing states, near-duplicate components
> and ones nothing uses. Hand the page to a designer instead of a repo.

## 0.165.0 — 2026-08-20

> **For you:** New practices your project inherits: **automation** (rent the runner, own the decision — and the three questions before anything runs unattended) and a refreshed **MCP** read.

**MCP and automation: the decision existed, the route to a founder didn't.**

Ajesh: *"MCP and automation building is becoming huge… see where we are, what are the best
practices, make it more formal, and document our approach."* The assessment found the shelf in
better shape than the delivery. `mcp.md` was **under-weighted, not wrong**; automation had **no
practice at all**; and the agent that owns both subjects in its own frontmatter walked founders
through an AI-MVP decision set that named **neither**.

### `automation.md` — the practice that backs a line BOSS already ships

`/ai-first-init` step 1 has been asking founders *"what's explicitly deterministic?"* and calling it
*"the hardest line to fill honestly"* — which is the entire 2026 automation consensus (deterministic
core, agentic surface) shipping unnamed, with no ladder under it. Same shape as
`testing-with-agents.md`: **a stranded load-bearing line gets a home.**

- **A four-rung ladder, earned upward.** RVW-008's three categories are right and **start one rung
  too high** — most of what a founder means by "automate this" is **rung 0: a script and a
  schedule**. Then a fixed path with one schema'd model *step*, then a real agent loop, then
  multiple agents (earn last, mostly don't). Climb on a failure you actually hit.
- **Three questions before anything runs unattended** — what breaks if it runs wrong at 3am
  (blast radius before capability), is there a pass/fail signal without a human reading it
  (Karpathy's verifiability line, applied), and **who gets told when it fails** (a loop with no
  failure channel is silent, and silence reads as success until it's expensive).
- **Rent the runner.** `harness-engineering.md`'s host-seam rule — *don't author what the host
  ships* — applied to automation for the first time, and this is its largest instance: hooks,
  the host's scheduled/triggered agents, CI and the no-code tier all already exist. BOSS names the
  **rung**, never the vendor (PRINCIPLE #4 — the rule that killed RVW-011).
- Retries, backoff and state belong to the orchestrator, never the model. `curve: craft-ai` (180d).

### `mcp.md` swept — under-weighted, not wrong

- **MCP Apps (GA Jan 2026) was a parenthesis.** Server-rendered UI inside ChatGPT/Claude/VS Code
  turns shape (b) from *"expose your tools"* into **"part of your interface runs in a client you
  don't control"** — a product-surface decision with a support burden, on someone else's release
  cadence. Honest ordering added: **read-only tools → write tools (the auth cliff) → an App**, and
  most founders should stop after the first.
- **Tasks named as the automation seam** (a durable server-minted handle you poll, not a held
  connection) and cross-linked to the ladder — the prior question is which rung, not which protocol.
- **The registry is still preview**, which this doc had never said. An entry is a lead, not a vetting.
- **`agent-security.md` gains the pre-install pass** — a tool *description* is attacker-controlled
  text entering your context as if you wrote it, and OWASP files that under **ASI01 goal-hijack**,
  not supply chain. Verify publisher · read every description · pin · scope the token · approve
  destructive actions · **re-read on update** (a rug-pull is a later version). **Its clock was
  deliberately not moved** — one bullet is not a threat sweep, per the v0.150.0 correction.

### The fix was composition — 0 new skills (46 → 46)

- **`mentor-architect` gains two rows** in the AI-MVP decision set: **automation shape** (which
  rung, the three unattended questions, rent the runner) and **integration shape** (MCP's three
  blurred decisions — consume / expose / use internally — with the auth gate and the
  `mentor-gtm` handoff). It owned both practices in frontmatter and surfaced neither.
- **`/ai-first-init` step 1 sharpened**, not extended — the ladder under the line it already ships.
- **The `/mcp` skill stays deferred, re-decided a third time.** The trigger that arrived was a
  *market* read, not the demand half (a real founder at the wall), which is unchanged. And the
  thing the skill was meant to deliver now ships without it, which **raises** the bar for building it.

### Watchlist domain 12 — and the failure mode it makes n=2

`build-craft.md` had 11 domains and none for automation. Domain 11 (teams) was added the same way on
2026-07-31 with the note that *a watchlist assembled from the practices that exist inherits their
blind spots*. **That is now twice.** The v0.160.0 reverse sweep closes the half where a practice
exists unclaimed — **it fired on the first run here and refused `automation.md` until domain 12
existed** — but it structurally cannot see the half where *neither* exists. The only known detector
is someone asking a question the file has no row to answer. Recorded, not papered over.

### Caught in passing: the release gate has been red since v0.157.0

Unrelated to this work, found because the gate had to pass. **`stages/L1-mvp/manifest.json`'s
`postLaunch` list still named all four verbs v0.157.0 retired** — `pmf-check`, `retain`,
`first-dollar`, `monetize`. The subtraction pass cleaned `skills` and the prose (that's what
`check:refs` class 4 was built for) and **left the fold array**, which is neither a file path nor
prose, so nothing covered it. `boss map` was telling every MVP project *"+9 for after you ship"*
while four of the nine did not exist. Now **+7**, and the manifest checker — which has had this
validation since v0.139.0 — passes.

The uncomfortable half: **v0.158.0 → v0.163.0 each recorded "all gates green."** They were not.
`npm run release` is only a gate if it is actually run before the claim is written.

### Documented for showcase

`docs/PATTERNS.md` §9 — the inbox → `/vet` → verdict → `/boss-learn` → practice → freshness loop,
with MCP as the worked example **including the unflattering parts**: the doc that was wrong at seven
days old, the deferral re-decided rather than left to rot, and the reverse sweep blocking this very
release. Renders to the site's engineering page (`gen-site.js` group renamed to *Retrieval, protocols
& automation* — the new practice forced the decision rather than vanishing).

## 0.164.0 — 2026-08-19

**BOSS gets a front door: a brand, and the ten-page site it makes possible.**

### The brand: site & signage

**BOSS had no mark.** Ten pages opened with the letters "B.O.S.S." and nothing else — a bigger gap
than the palette, and the fix was already shipping in the product: **`✦` is what the CLI prints on
every success line** (`✦ Created my-app`). Most brands invent a mark; BOSS was already using one, on
the happiest moment it has, and nobody had noticed. It's now drawn properly — a four-point spark with
concave sides that holds at favicon size and hero size — and used for the lockup and the favicon
**only**. A mark used everywhere is a texture, not a mark.

- **World: site & signage.** *Build Out Solid Stuff*, taken literally — poured **concrete** `#E8E6E1`
  and **graphite** `#16181A`, with ONE **hi-vis** `#FF5C00` used at roughly 2% coverage. Chosen over
  ink-and-spark, blueprint-dark, and refining the old paper world. Two reasons worth keeping: it's
  **derived from the name** rather than a mood board (the only reliable way out of an AI cluster), and
  it **escapes on the ground colour** — concrete is *cool* grey, a different family from the warm-cream
  cluster rather than a nudged version of it.
- **🔴 Signage colour is semantic, which fixed a flaw the old palette could only write around.** ISO
  3864: red stops you, amber warns, green says safe. The previous system's accent and error colour sat
  **4° of hue apart** and had to be contained by a written rule; now `safe / caution / stop` are
  distinct families and **hi-vis is never a state** — it's brand, action and emphasis only.
- **Hi-vis is a FILL, not a text colour.** `#FF5C00` on concrete is 2.48:1 and fails as body text —
  which is correct signage behaviour: you paint a bar with it and put graphite **on** it (5.75:1).
  Links use a darker `--color-link`. Getting that wrong is the likeliest way to break the system, so
  it's stated at the top of the palette.
- **Dark is designed, not inverted** — graphite is a real ground with its own signal set. **Every pair
  in both themes measured at AA** (worst case 4.73:1); two candidate values failed on first measure and
  were darkened rather than re-described.
- **The ladder is now a train line, not a table.** EVID-001's founder asked in as many words for *"a
  train line where I can see where I am and that I'm moving"* — and the roster count is what grows
  along it (3 → 8 → 15). It had been sitting there rendered as a spreadsheet.
- **Ten pages no longer share one rhythm.** Added per-page devices — a hi-vis `band`, a `stencil`
  section label, a `stat` for where a number *is* the argument, a `hazard` rule for the charter, `duo`
  columns — with the rule that each page uses one or two, never all.
- **The whole re-skin was a token edit.** Every colour changed and no page markup had to be rewritten,
  because `site.css` still contains **zero raw hex**. That's Principle 3 paying for itself, on BOSS's
  own surface, one day after the tokens were written.

### For engineers — and the attribution layer

Ajesh: *"there needs to be an engineer or AI specific page… and we should reference when possible to
who we learnt the best practices for agentic development."*

- **`/engineering`** states the load-bearing technical calls plainly (the harness is the architecture ·
  verifiability decides what to automate · capability shapes never model names · green ≠ right ·
  most teams shouldn't build RAG yet · agent security is its own discipline), then backs each with
  **generated attribution**. Every practice already carries `provenance:`, `curve:` and
  `last_reviewed:`, so the page **renders that metadata rather than restating it** — Anthropic
  engineering, Dex Horthy, Karpathy, Simon Willison, Hamel Husain + Shreya Shankar, OWASP, Veracode,
  Chroma, Jason Liu, the Spec Kit / Kiro lineage. Attribution that has to be retyped is attribution
  that goes stale.
- **Two diagrams, each making one claim.** Hand-authored inline SVG — no library, `currentColor` so
  both themes work, one hi-vis element carrying the point. *(1)* **The conscience:** a mechanical hook
  evaluates a named condition against files on disk; only once it fires is a model asked to compose
  anything — **the model never decides whether to speak.** *(2)* **The practice flow:** the shelf is
  distilled into the prompt of the agent whose job it is, so `db-architect` already knows about RLS and
  `tester` already knows agents rewrite assertions to match broken behaviour. You never have to read
  the shelf; `boss craft <name>` is there if you want to.
- **🔴 Building the agent↔practice map surfaced a real integrity gap: 6 of 28 practices are owned by
  roles that don't ship.** `designer` (3) and `mentor-humane` (3) exist only in the gitignored dev
  workspace — the founder-facing roster has `ui-designer`/`ux-designer` and, by design, no ethics
  advisor. So a founder can't reach the role that owns their design guidance. **The generator now
  validates every `owner:` against the shipped roster, prints the gap on every build, and the page
  states it in plain sight** rather than rendering a plausible org chart. Deliberate for the humane
  three (the lens is wiring — the conscience, the canvas, `/red-team --humane`); **worth questioning
  for the design three.** This is the third sighting of the same pattern — *the dev workspace described
  as shipped* — which is why it's now a build-time check and not a note.
- **`/reference` → `/quick-guide`**, reworked from a dump into something usable: the standing commands
  that work in every mode (absent from the site entirely until now), an **“I want to…” → verb** map,
  then the full per-mode list. `STANDING_COMMANDS` moved into `src/modes.js` so the cheatsheet and the
  website read one list — two copies is how the cheatsheet drifted the first time.
- **Fixed: the preview builder had silently degraded to previewing one page** while four were added
  around it, because its page list was hardcoded. It now derives pages and labels from the built nav,
  so it cannot go stale again — the same class of bug the site generator exists to prevent, in the tool
  that checks the site generator.

### Three more pages

`/conscience` (the mechanism, the off switches, and how it could be wrong — *the failure mode isn't
speaking harshly, it's speaking too often*), `/teams` (cofounders, promoted out of a section in the
guide), and **`/whats-new`, generated from `registry/CHANGELOG.md`** — the same file `boss sync` reads
to tell a project what changed since its pin. One source, two audiences.

### The site

**The positioning got sharpened first, because the site was going to inherit whatever muddle it
started with.** The copy sold the conscience; the product is mostly a *staffed build system* — 15
agents and 46 skills, of which only four (`/canvas`, `/evidence`, `/pretotype`, `/interview`) are
validation. So the page promised a validation tool while the product delivered a company. **New
spine (Ajesh): BOSS staffs your project** — builders who make the thing, mentors who coach the
founder, hired *just in time* as the project earns them. Validation becomes one department instead
of the whole pitch, and "scaffolding" finally means the right thing: **the team that goes up around
the build and grows as the building gets taller.**

- **Seven pages** — `/` (landing, standalone) · `/team` (who you hire, and when — the new spine's
  hero) · `/start` · `/guide` · `/reference` · `/charter` · `/governance`.
- **🔴 `scripts/gen-site.js` — no number on the website is ever typed by hand.** The roster, the
  ladder table, the skill reference and every count are derived at build time from
  `stages/*/manifest.json` **via `src/modes.js` — the same source `boss map` and `gen:docs` read**, so
  the site and the tool cannot disagree. Wired into `npm run release` next to the generated docs:
  soft on staleness (it regenerates on disk — commit it), **hard** on the generator erroring, the
  version stamp mismatching, or the roster coming back empty. A website that quietly reports zero
  agents is worse than one that's a release behind. This is IDEA-018's lesson applied to a new
  surface: CHEATSHEET.md drifted for 56 releases because its generator was wired to nothing.
- **An unknown `{{TOKEN}}` in a page fragment is a hard error**, not a silent literal shipped to the
  web. Dev-workspace counts (practices, verdicts) carry forward from the committed `site/_data.json`
  when their gitignored sources aren't present, so the site still builds correctly from a clean clone.
- **`/charter`** publishes the humane line as a page: *a conscience makes a cost visible, a censor
  makes a choice unavailable* — the six rules, the deliberate third-party/self-regarding asymmetry,
  the machinery, and an explicit section on what's still weak (does it know when to shut up).
- **`/governance` — the method, not the verdicts** (Ajesh's call). The `/vet` pipeline with its
  NO-bias rubric, attribution checked *before* the claim is graded, the four outcomes, the rule that
  **no agent impersonates a person — mentors cite the practice**, and the `curve:`-based staleness
  discipline. It closes by naming what none of it proves: a rigorous filter on incoming advice is not
  evidence the advice *works*, and BOSS has one external reaction and no outcome data.

### The visual identity

**BOSS gets the half of its own brand it never had — and finds its anti-slop practice going stale
while doing it.** After 163 releases, `BRAND.md` locked the name, the slogan, the bad-boss story and
the distribution surfaces, and said **nothing** about color, type or layout. The consequence was
concrete, not cosmetic: **BOSS could not run its own `/landing` skill**, whose step 0 refuses to
generate from blank and reads BRAND + the canvas Promises cell + *the design tokens* — which did not
exist. Its own honest fallback ("generate a plainer page and name what's missing") was the only path
available.

- **`docs/design/VISUAL.md` — the visual identity**, the missing other half of `BRAND.md`. The brief
  in one line: **calm where it talks, literal where it proves.** Prose on warm paper; every claim
  about what BOSS *does* discharged by an inset dark terminal showing the bytes the CLI actually
  prints. The aesthetic is the honesty argument in layout form — the only kind of brand a conscience
  is allowed to have.
- **Two renderers, one palette.** BOSS's product is a terminal and its front door is a browser, so
  every color is named **once** and carries **both** bindings — a CSS custom property *and* an ANSI
  truecolor/256 pair. A color chosen for the web and re-derived for the CLI later is the 47-blues
  failure at brand scale. Four signals (rust · moss · ochre · oxblood) answer [[IDEA-055]]'s sharpest
  finding — that today *a warning looks exactly like a success*. The ANSI column is **documented, not
  wired**: `src/` is untouched, no behavior change, nothing added to the founder surface.
- **`site/styles/tokens.css` — three-layer tokens** (primitives → semantic → component), because two
  layers is fragile under AI generation. The rule that makes it hold: **nothing outside that file
  writes a hex** (`site.css` verified at zero). Principle 3, finally applied to BOSS itself — the
  palette had been sitting hardcoded in `pretotype/index.html` since July, unnamed and unreusable,
  which is precisely the "locked into code" failure that principle exists to prevent.
- **`site/index.html` — the first landing page.** What BOSS is, what it does, and a quickstart for
  both directions: `boss new` for a fresh idea, `boss adopt` for a repo you've already started —
  plus `boss remove`, documented rather than buried, because **a clean exit is what makes the
  entrance safe to try**. Every transcript on the page is **real captured output**, not a plausible
  transcript; every factual claim was verified against the source, which downgraded a vague "no
  telemetry" into the precise and checkable *"the only network call BOSS makes is when you type
  `boss update`"*. And with **one** external reaction on record and zero customers, the page carries
  no testimonials, no counts, no waitlist and no urgency — it says plainly that very few people have
  used it. A conscience that manufactured social proof would just be marketing.
- **Two sections added on Ajesh's read of the draft, both closing real gaps.** *(1)* **"What
  'scaffolding' means here"** — the word was doing load-bearing work on the page and had never been
  defined for anyone who doesn't already know it. It's now explained as the construction word used
  literally (*the temporary structure around a building: you don't live in it, it goes up as the
  building gets taller, and it comes down when it's holding nothing up*), which is also the clearest
  statement of what modes ARE and why ceremony is graduated — and it ends on `boss remove`. That
  section doubles as the mental model the page was missing: what BOSS puts around you (a process that
  fits, people to ask, a memory, someone who'll tell you the truth). *(2)* **"Building this with
  someone else"** — the whole team layer (`boss team add`, `/decide`, `/practice`,
  `mentor-cofounder`, the coordination nudge) was shipped and **entirely absent from the front door**.
  Its argument is the sharpest on the page: AI makes each of you faster, which left alone makes a
  two-person team *drift apart* — and that erosion is invisible from the inside, since drifted teams
  still rate their teamwork as fine. Dormant-when-solo is stated plainly, as is what never travels
  (the conscience's notes about *you*).
- **🔴 The finding that outlives the page: `design-system.md` is going stale in the exact way it
  warns about.** The first draft of this system was warm-cream + serif display + terracotta accent +
  broadsheet hairlines + a decorative `01 / 02 / 03` rail — which is, precisely, a named **2026**
  AI-default cluster. BOSS walked straight into the failure its own practice prevents. The practice's
  anti-slop section still names the **2025** tell (purple gradient, Inter, centered card) and reports
  `fresh` until 2027-02-07. **A practice that names last year's default is worse than no practice: it
  certifies the current default as safe** — and `boss sync` pushes that certification into every
  connected project. Same shape as v0.135.0's *`mcp.md` was wrong at 7 days old*: the doc rotted
  because the **ground** moved, not because time passed, and the cadence could not see it. **Routed
  to `/practice-refresh`, not built** — finding ≠ build. The candidate fix is to stop enumerating
  tells and ship the *test* instead ("what would a model produce unprompted for this brief? don't
  ship that"), since any enumerated list starts rotting the day it's written.
- **The resolution, which is the transferable lesson:** you can't escape a cluster by swapping the
  palette — you break it by **deriving the choices from the subject**. The ground and accent stayed
  (chosen, and already shipped); the display face became the **mono stack**, because BOSS is a
  terminal and its headlines should come from the same world as its proof; the numbered rail became
  the `▸` glyph `boss status` actually prints, since the sections were never a sequence.
- Captured as [IDEA-057](../docs/ideas/IDEA-057-visual-identity-and-landing-page.md) before any code,
  per working rule 3. Contrast measured rather than asserted (worst case 4.74:1, AA throughout, both
  themes); two tokens failed on first measurement and were **fixed rather than re-described**.

## 0.163.0 — 2026-08-18

> **For you:** Fixed: adopting a large repo could misread it as a fresh idea and start you at the wrong mode.

**An adversarial pass over everything this arc shipped, applying v0.162.0's lesson: test the shapes
you did NOT design for.** One real bug, and confirmation on the rest.

- **🔴 A large repo could not find its own build manifest.** The walk is file-capped at 4000, and
  subdirectories sort before `package.json` (`d0/` < `p…`) — so on a 5000-file monorepo the cap was
  exhausted **before the root was ever read**. It reported *"no build manifest"* and adopted at
  **Quickstart**. That is precisely the half-built-app-gets-the-idea-capture-scaffold failure
  v0.153.0 was built to prevent, reappearing **for large repos only** — and silently, because the
  output looked like a confident, well-reasoned read. Root files are now scanned before the walk.
- **The false-negative direction of `boss remove`, tested properly.** For a destructive command the
  dangerous failure isn't crying wolf, it's the opposite: **failing to notice an edit means deleting
  someone's work.** Appends, rewordings, deleted content lines and single-character changes are all
  caught; whitespace-only is deliberately ignored as cosmetic. Pinned as a regression.
- **Hostile inputs, all handled correctly already** — `remove` outside a BOSS project · a corrupt
  `.boss/manifest.json` · `adopt` with no git · `adopt` on an empty directory · `adopt` where the
  founder already has their own `.claude/` (their skill and settings both survived a later `remove`)
  · symlink loops, unreadable subdirectories and a 15-deep tree in detection.
- **The real upgrade path verified end to end:** a project pinned at 0.156.0 with all four retired
  verbs syncs forward, is told what changed and why, removes them on consent, and lands with
  `/health` + `/money` and its pin bumped. That exercises v0.155.0's supersede machinery, v0.157.0's
  merge and v0.162.0's signature change together, on a live project rather than a fixture.
- **Worth recording honestly: three of the "failures" in this pass were bugs in the TEST, not the
  product** — a mutation that deleted a blank line, a regex anchored to line-start that matched
  nothing, and a substitution that never applied. Each looked like a real false negative. Checking
  the fixture before believing the finding is the discipline the `/vet` attribution rule already
  encodes for claims; it applies to test results too.

## 0.162.0 — 2026-08-18

**Four bugs in `boss remove`, found by testing the paths v0.161.0 didn't.** It was verified against an
*adopted* repo only. Every other shape was broken, and each failure was silent.

- **🔴 It marked the project RETIRED instead of deregistering it.** `retire` is a **venture outcome** —
  `boss insights` reads it and reports time-to-retire alongside time-to-build. So removing BOSS from a
  *thriving* project would have BOSS reporting a death that never happened, in the one surface that
  tells a founder how their ventures have actually gone. **BOSS falsifying the founder's own record is
  the exact self-fooling it exists to prevent, committed by BOSS about them.** New
  `deregisterProject()`: BOSS has no business tracking a project it is no longer installed in.
- **🔴 A one-letter project name corrupted the edited-check.** `boss new a` flagged three untouched
  agents as *"you edited this"* — the comparison erased the project **name** by regex, so every letter
  "a" became a sentinel and the stage-id and mode-word rules that ran afterwards stopped matching
  their own patterns. **Any short or common name — `app`, `api`, `test` — had the same shape of bug,
  silently.** Fixed by **rendering** the template with the real values instead of erasing them; only
  the genuinely unknowable stamps (scaffold date, version at write time) are still blanked by shape,
  because those patterns can't collide with prose the way a name can.
- **🔴 After `boss unlock`, files stopped matching the layer that wrote them.** The stamp records the
  project's *current* stage; after unlocking MVP that's `L1-mvp`/`MVP` — but L0's agents were rendered
  with `L0-quickstart`/`Quickstart`. Comparing them against an L1-rendered template can never match,
  so **three agents and `CLAUDE.md` survived every single removal.** Now resolved per file, from the
  layer the template actually came from.
- **Leftovers on the way out.** Excising a marked block from `CLAUDE.md` left BOSS's own L0 template
  behind as a stray file (L0 wrote the whole file; L1 appended the block). And `.claude/settings.json`
  always survived. Now: if what remains after excision is still BOSS's template, the file goes; and an
  **untouched** `settings.json` goes with BOSS, because leaving config from a tool you just removed is
  clutter. **An edited one is kept** — hooks un-merged, permissions, the founder's own hooks and the
  secret-path deny floor all intact.
- **And one bug in `boss sync`, exposed in passing:** its orphan-edited check was being handed the
  **orphan's** name where the **project's** belonged. Wrong value, invisible, because the comparison
  still mostly worked.
- **Verified across all 9 combinations** — `a` / `app` / `myproject` × Quickstart / MVP / V1 — every
  one now removes to **zero** leftover files while the founder's work survives. **Four new REGRESSION
  tests (105 now)**, one per bug, because every one of these was silent and none would have been
  caught by the adopted-repo path alone.

## 0.161.0 — 2026-08-18

> **For you:** **`boss remove`** — adoption is no longer a one-way door. Preview what would go, `--apply` to do it; your own work always survives.

- **`boss remove` — the exit. Adoption stops being a one-way door.** Adopting BOSS into an existing
  repo writes **~91 files** and nothing took them back out; `boss retire` sounds like the answer and
  isn't (it ends a *venture* and says so: *"the repo stays; only the status changed"*). **"Non-
  destructive" answered *will you break my stuff?* — it never answered *can I get out?***, and for a
  founder standing in a codebase they care about, the second is the bigger question. PRINCIPLE #5 is
  optionality by default; adoption being irreversible in practice contradicted it however reversible
  each individual write was. **A clean exit is what makes the entrance safe to try.**
- **The boundary is DERIVED, not listed** — the union of the installed stages' template trees is
  exactly what BOSS can ever write; everything else in the repo is the founder's. That matters most
  in `docs/`, where after a week of use their ideas and decisions sit in the *same tree* as BOSS's
  scaffold: **a naive `rm -rf docs` on the way out would destroy the very work BOSS was there to help
  produce.** Same three guards as sync's orphan removal: only what BOSS wrote · never what the
  founder edited · consent is a separate act (`--apply`).
- **The preview says what SURVIVES, by name** — *"3 file(s) you made under docs/ and .claude/"*, and
  every BOSS file you edited listed individually. That half is what makes it safe to run.
- **`CLAUDE.md` is never deleted** — BOSS's marked block is excised and the founder's rules kept; the
  file only goes if nothing but whitespace remains, which is derivable rather than guessed.
  `settings.json` loses only BOSS's hook registrations. **The secret-path `deny` floor deliberately
  STAYS**: a deny entry can only ever restrict, so removing it would quietly widen what an agent may
  do on the way out — a parting gift nobody asked for.
- **🔴 The first run flagged 30 untouched agents as "you edited this."** A scaffolded file never
  byte-matches its template (placeholders are substituted), and the comparison normalised only the
  template side. **A flag that fires on everything is a flag nobody reads** — how BOSS's last three
  checkers died. Fixed by extracting **one** normaliser (`sameAsTemplate`, in the module that owns
  substitution) and pointing both call sites at it — **because `boss sync`'s orphan-edited check had
  the identical latent bug**, and two copies would have drifted.
- **`boss remove --global` is the other exit, kept separate on purpose.** It prints the uninstall
  command for how BOSS was actually installed (npm / Homebrew / a git checkout) and lists the
  machine-local state in `~/.boss`. It also states the non-obvious, reassuring half: **uninstalling
  the CLI does not break your projects** — the conscience hook runs
  `node "$CLAUDE_PROJECT_DIR/.claude/hooks/conscience.js"` and imports only from `./lib/`. You lose
  the `boss` verbs, not the in-project experience.
- **Documented next to the entrance**, in the README and GUIDE — an exit nobody can find when they
  want it isn't an exit. **Five new tests (101 now)**, all REGRESSION, pinning the guards rather than
  the feature: this is the most destructive code in BOSS, deleting files in a repo it was invited into.

## 0.160.0 — 2026-08-17

> **For you:** The 66 skills and agents BOSS installs into your project can now report themselves stale, so `boss sync` stops pushing you guidance that has quietly rotted.

- **The widest uncovered rot surface is covered: the 66 skills, agents and hooks BOSS ships into
  every project.** BOSS ships `review_by:` staleness-awareness to founders via `/practice`, applied
  it to its own 28-practice shelf in v0.135.0 — **and left the surface it actually ships with nothing
  that could ever report it stale.** The same don't-eat-your-own-dogfood gap, one level down.
- **🔴 Deliberately NOT inline frontmatter, and this was the load-bearing call.** The obvious move
  was to copy the practice shelf and add `curve:` / `last_reviewed:` to each `SKILL.md`. It's wrong:
  a shipped `SKILL.md` carries exactly `name` + `description` (an agent adds `tools`) and that
  frontmatter is **host-consumed**. Introducing unknown keys into files Claude Code parses, in every
  founder's project, to solve a maintenance problem **only BOSS has**, puts all the risk on them and
  all the benefit here. The ledger (`registry/surface-freshness.json`) is deliberately excluded from
  the npm package for the same reason. A practice can do it inline precisely because nothing but
  BOSS reads that frontmatter.
- **The first cut of the curve assignment was a regex over the file text, and it was wrong — so it
  was thrown away.** Keyword matching put `/boss`, `/import` and `/cost-review` on the **threat**
  curve and `/prototype` and `/money` on the **model** curve, because "credential" and "token"
  appear in passing. **Arbitrary assignments dressed as method are worse than none:** they'd send
  quarterly sweeps at 30 files that don't move, skip the ones that do, and the first person to read
  the table would stop trusting all of it. Replaced with a **stated judgment** — default by kind,
  every deviation named — so each call is arguable on its own instead of the whole table being
  suspect.
- **The default is `craft` (365d), and the reasoning matters.** Most of this surface is *method* —
  how to pressure-test an idea, run an interview, record a decision. That prose doesn't rot when the
  host ships. What rots fast is the layer touching the **host** (11) and the layer describing what
  **AI tools do by default** (6), plus threat (4), market (8) and humane (1). **Putting all 66 on a
  90-day clock would produce a 66-file quarterly sweep — the exact ceremony BOSS exists to refuse.**
- **`last_reviewed` is seeded from git's last-touch date and then never auto-derived again.** Honest
  starting point; and touching a file is not reviewing it, so a typo fix must not reset the clock.
  `review_by` is *derived* from curve + stamp rather than stored — one clock, so the two can't drift
  apart, which is the exact correction the practice shelf needed in v0.150.0.
- **The REVERSE sweep is now a standing check, not a memory.** The forward question is *"is this
  overdue?"*; the reverse is **"is any practice claimed by nobody?"** — an unclaimed doc can never
  come due at all, and `check:freshness` was reporting *28 fresh, 0 overdue* while two had no domain
  that would ever fire. **Running it by hand immediately proved why it belongs in a script: the
  RESUME note naming three orphans was stale** — all three had since been claimed, and two entirely
  different practices (`model-routing`, `revalidation`) were the real ones. Both now claimed;
  verified by temporarily un-claiming one and watching the check fail.
- **Nothing added to the founder surface** — one ledger and one generator, neither shipped.

## 0.159.0 — 2026-08-17

- **`/vet` now verifies who actually said it — before it grades what they said.** The queue's n=3
  item, promoted under Principle #1. The rubric's question 2 rewards *"a named practitioner BOSS
  already respects,"* and the skill **never checked whether the practitioner said it.** Three of four
  claims bent exactly there in one session: [[RVW-072]]'s *"Karpathy shared this"* was half-right (the
  lecture is real; the second video was an unrelated older explainer) **and the evidence grade swung
  on the verification**; [[RVW-076]]'s *"DORA 2026 says the bottleneck moves to specification"* does
  not verify at all (DORA's real 2026 publication is an ROI report; the phrasing traces to blog
  summaries); and the review-sandwich claim rested on a second-hand GitHub number nobody could trace.
- **Placed as step 3 — before the rubric, not inside it.** Grading first and checking later means the
  grade is already anchored when the truth arrives. **An unverified attribution isn't a citation,
  it's borrowed authority**, and it does its persuading before any rubric runs. Unverified → the
  grade drops to what the claim proves on its own merits. Contradicted → usually REJECT or NOT-YET on
  its own, because a claim whose headline citation is wrong has told you how carefully the rest was
  assembled.
- **It also names the adjacent failure: the lane blend.** `git-workflow.md` carried an unverified
  vendor multiplier (`~5.3×`) sitting directly beside a DORA attribution, so it read as DORA's. Easy
  to reproduce by accident, and `SOURCES.md` already forbids it.
- **Wired so it can't quietly lapse:** rubric Q2 now reads *"grade only what step 3 verified,"* the
  verdict template gains a required **`## Attribution`** section (*verified / partly verified — say
  which half / does not verify*), and the Rules list carries it where a fast reader scans. A check
  whose result isn't recorded is a check that happened and evaporated.
- Internal tooling only — `/vet` is BOSS-curating-BOSS and ships in no stage manifest. **Nothing
  added to the founder surface.**

## 0.158.0 — 2026-08-17

> **For you:** BOSS installs clean under npm v12’s stricter defaults: zero dependencies, no install scripts, nothing to approve.

- **README: BOSS installs clean under npm v12's new security defaults, and that is worth saying out
  loud right now.** npm v12 turns off dependency lifecycle scripts, git dependencies and remote-URL
  dependencies unless explicitly allowed — so most CLIs now need an `npm approve-scripts` step on the
  way in. **BOSS needs none: 0 dependencies, 0 devDependencies, and no `preinstall`/`install`/
  `postinstall`/`prepare` script.** Nothing to approve, nothing to build. Stated as what it is —
  **not** a reaction to the change: Principle #4 has required a dependency-free `src/` since the
  beginning, and it simply happens to be what the new defaults reward. A rule that was about
  evolvability turning out to be a security posture is worth one honest sentence, not a boast.
- Verified against the real package, not asserted: `dependencies: 0 · devDependencies: 0 ·
  lifecycle scripts: none`.

## 0.157.0 — 2026-08-17

- **The subtraction pass — the first time BOSS has ever removed a skill.** [[EVID-001]]'s mandate was
  *compose and subtract, never add*, and the surface had grown from 22 to 48 skills since it was
  written. **48 → 46**, and the post-launch block a live founder actually faces goes **9 → 7**.
- **`/pmf-check` + `/retain` → `/health`.** They read the same retention curve, sat behind the same
  n<10 gate, and both rebased past the same AI-tourist wave — **duplicated text, not just adjacent
  scope.** The founder had to know whether they had a *fit* problem or a *retention* problem in order
  to pick the verb that would have told them. `/health` renders the verdict first (Sean-Ellis 40% +
  curve flattening + pull-vs-push, defaulting to pre-PMF), then — if the curve sags — says where it
  dies and routes. **The split was also costing accuracy:** `/pmf-check` still told founders to use
  `/retain` and `/onboard` *"when built"*, months after both shipped.
- **`/first-dollar` + `/monetize` → `/money`.** Sequential stages of one job where **each one's honest
  output, when it didn't apply, was "go run the other one"** — `/monetize`'s gate literally said *"if
  there's no first dollar, that's `/first-dollar`'s job."* `/money` reads where you are and routes: no
  yes yet → `/interview`; a yes but no rail → the five deferrable moves ending in the commitment-grade
  EVID; paying customers → operating it.
- **Two candidate merges were REJECTED, and that matters as much as the two that shipped.**
  **`/measure` + `/judge-traces`** share the word "analysis" and nothing else — `/measure` is about
  the founder's *users*, `/judge-traces` about their *AI agents'* behaviour, from a different data
  source. **`/onboard` stays separate** from `/health`: it's the design *fix* the diagnosis routes to,
  and burying a substantial design workflow inside a diagnostic would have made both worse. **Two
  honest merges beat four forced ones**; subtraction that damages the thing is not a win.
- **The first real use of v0.155.0's supersede machinery, and it worked end-to-end.** Four ledger
  entries, and an existing project now gets told what went, what replaced it, why, and what changes —
  *"your `docs/pmf/` files stay where they are"* — with nothing deleted until `--remove`. The two
  releases were built a day apart and this is what the first was for.
- **🔴 The gate learned the reference class it was still missing.** `check:refs` gained agent names in
  v0.151.0; the first retirement proved **skills are the same class** and were uncovered —
  **14 files still pointed at the four dead verbs**, including `mentor-venture`, `/sunset`,
  `/roadmap`, `/measure`, `/trust`, four practices and the L1 manifest. Class 4 now reads the
  supersede ledger, so **a retiring release has to clean up after itself**. Scoped to the ledger
  rather than "any `/name`" so it can't cry wolf on `/tmp`. Two scope bugs it caught in itself on the
  way: the successor must be allowed to name what it replaced (that's the signpost, not a dangling
  pointer), and excluding all of `docs/` was wrong — `GUIDE.md` is as live as a shipped file, and it
  was still sending founders to all four.

## 0.156.0 — 2026-08-17

- **`boss update` — the half of the two-hop trap nothing could answer.** `boss status` compares a
  project's pin against the **installed** package, so *"up to date"* only ever meant *"your project
  matches your install"* — never *"your install is current."* A founder who never ran
  `npm i -g bossbuild@latest` got reassured **forever**, and **the more stale they were, the more
  confident the reassurance.** v0.152.0 named the trap in prose; this answers it.
- **It is a command, not something `boss status` does behind your back — and that's the design.**
  BOSS promises no telemetry and local-only state. A registry lookup sends no project data (it's a
  public GET for a version string) but it is still an outbound request the founder didn't ask for,
  and a tool that quietly phones anywhere on every `status` has spent trust it can't get back. So the
  fetch happens **only when invoked**; `boss status` reads the cached result and never makes a call
  itself. If nobody ever runs it, BOSS says *"unchecked"* rather than checking on the sly.
- **It never claims currency it hasn't verified.** No cache → `unknown`, not silence. A check older
  than a week **decays back to unknown**, because a stale *"you were current 8 months ago"* is the
  same false reassurance wearing a timestamp. And the upgrade command matches how BOSS was actually
  installed — npm, Homebrew, or a git checkout — since telling a Homebrew user to run `npm i -g` is
  advice that fails silently and makes them conclude the check is broken.
- **🔴 The first thing it found, pointed at BOSS itself: npm has `0.97.0`. This repo is at `0.156.0`
  — 58 released versions the public has never been able to install.** Everything since the June
  rebrand — the release gate, the unit suite, the conscience architecture, the freshness discipline,
  and this entire finessing arc — exists only on `main`. The first draft of the check called that
  *"you're on the latest,"* which was false in the direction that matters most; it now says **ahead**
  and names the consequence: *"worth knowing if you expected others to have this: they don't yet."*
- **Six tests (96 now)**, none touching the network — the fetch is deliberately the only impure part,
  and everything that decides what a founder *sees* is pure. Includes an offline-safety case (forced
  through a dead proxy) proving a founder on a plane gets a shrug, not a non-zero exit.

## 0.155.0 — 2026-08-17

- **`boss sync` can finally subtract — the constraint that was quietly gating three other things.**
  Its policy was literally *"nothing is removed."* `planSync` classified files `new`/`changed`/`ok`
  and had no concept of something BOSS used to ship and doesn't any more. Consequences, all
  structural: **(1)** the subtraction pass EVID-001 mandates could never reach a founder — merging
  `/retain` + `/onboard` + `/pmf-check` would deliver the new verb and leave all three originals, so
  syncing could only ever *grow* a project's surface; **(2)** v0.153.0's adopt detection had to cap at
  MVP because ceremony added was ceremony BOSS couldn't take back; **(3)** [[DEC-003]]'s fourth step —
  *"if they say yes, BOSS does the migration"* — was a promise the sync layer could not keep across a
  change in **BOSS's own** way of working.
- **`registry/supersedes.json` — the ledger that lets a removal explain itself.** `planSync` finds the
  orphan; the ledger says what replaced it, **why**, and what changes for the founder. **A removal
  without a reason is just a deletion**, and a founder who never read the changelog is exactly who
  this has to answer to. Entries are append-only and version-stamped, so sync can show only what a
  project hasn't been told yet. It ships **empty** — there are no retirements yet, and a placeholder
  entry would be a claim BOSS hasn't earned.
- **🔴 The safety boundary, which is the whole design: an orphan must have been STAMPED by BOSS.**
  `.boss/manifest.json` is the install ledger — a name that isn't in it was put there by the founder.
  Walking `.claude/skills/` and diffing against the manifest is the obvious implementation, and it
  would eventually propose deleting someone's own work. Pinned by a REGRESSION test.
- **Removal is opt-in, twice over.** `boss sync --apply` writes and **deletes nothing**; `--remove` is
  a separate, explicit act. A sync that silently deleted a skill would be the one place BOSS decided
  *for* the founder, in a repo it was invited into.
- **`edited` is a TRUE / FALSE / UNKNOWN tri-state, and the third value is the honest one.** An edited
  orphan is *theirs* and is never removed, even with `--remove`. But when BOSS deletes a template it
  also destroys the only thing it could compare against — **which is the normal case for a real
  retirement**, not an edge case. The first cut returned `false` there, quietly asserting *"you didn't
  change this"* at exactly the moment BOSS cannot know, and would then have deleted a customisation on
  consent. It now says so and points at `git log`. (The durable fix is a content hash in the stamp;
  noted, not built — it changes the stamp format, and honest uncertainty plus consent covers it today.)
- **A latent stamp bug the work exposed.** `applySync` reconciled the stamp to the current manifest
  union, so a retired skill would vanish from the ledger **while its files stayed on disk** — after
  which the safety boundary above would refuse to touch it, because BOSS no longer had any record of
  installing it. Unexplained, forever. An orphan that isn't removed now stays stamped until it's gone.
- **`/boss-sync` gets the conversation, not just the flag.** A new step 2.5 walks each retirement:
  say what changed and why (or admit BOSS has no record, rather than inventing a rationale) → say what
  it means for **this** project (did they actually use it? what happens to the artifacts?) → **ask, and
  accept "no"** as a complete answer, recorded via `/decide` so it isn't re-litigated → and if yes, **do
  the migration**: point their habits at the replacement and update references, because *deleting the
  file and leaving them to figure out the new way is not a migration.*
- **Nine new tests (90 now)**, five of them REGRESSION, covering the boundary, both consent gates, the
  edited guard, the tri-state, the stamp-preservation bug, and a "doesn't cry wolf" case — because a
  flag that fires on every file is a flag everyone learns to ignore, which is how BOSS's last three
  checkers died. **Nothing added to the founder surface.**

## 0.154.0 — 2026-08-17

- **[[DEC-003]] — position, not verdict.** The open question v0.153.0's mechanics couldn't answer:
  what should BOSS actually *say* to a founder about work they already built? The tempting answer was
  a **report card** — read the repo, grade it, hand back recommendations. It demos well. It also
  collides head-on with the README's own promise (*"Refuses to nag. **Refuses to grade.**"*), lands as
  a first impression on work the founder is likely defensive about, and — grading someone's unpaid,
  unfinished, personal work to create the motivation to adopt your tool — **would make BOSS the thing
  it warns against.** Ajesh's call, and the reason is the better half of it: *"I like position, because
  it makes the founder think, vs just blind assessment; it provides them with options and how to
  integrate, vs force."* **A verdict invites agreement or defensiveness. Neither is thinking.**
- **`/comprehend` gains a Position read, given BEFORE any write.** Four parts: **where the work
  actually is** (with the evidence, and the gap from the installed mode named as information rather
  than error — adopt caps at MVP on purpose, so a further-along repo *should* read ahead); **what BOSS
  can't see** — the honest half, and the part that makes it useful rather than flattering: it read
  files, it did *not* see whether anyone uses this, whether they return, what it costs, or what the
  founder already tried and abandoned; **two or three options** with what each would change *about
  their week* and what it costs, always including the legitimate *"nothing yet — keep building"*; and
  **how the working model changes**, honestly. Then it **stops and waits** — the read is a conversation
  opener, not a preamble.
- **No quantified gain claims, ever — and this one is load-bearing.** BOSS has **n=1, `stated-pain`,
  no observed session.** Promising *"you'll ship faster"* would be BOSS committing the exact
  self-fooling it exists to prevent, on its own front porch, to the first founder who might check.
  *"Here's what changes"* is honest; *"here's what you'll gain"* is not.
- **The abandonment sequence — the second half of Ajesh's principle.** *"There are times where a
  specific approach might need to be abandoned, but it should be the founder's call and then refactor
  and update to the new way."* Encoded as a fixed order: **name it once with the evidence** (not
  *"this is bad practice"* but *"nine files import from `utils.js`, which is why your last three edits
  touched more than you expected"*) → **say what the alternative costs**, including that it may not be
  worth it yet → **stop; it's the founder's call**, don't refactor to prove the point, don't ask twice,
  record a "no" in `/decide` so it isn't re-litigated → **if yes, BOSS does the migration.** That last
  step is what makes it fair: *naming a problem and leaving them with it is a critique; naming it and
  then doing the work is help.* Kept deliberately **out** of the option menu — abandoning something you
  built is a different weight of decision than turning on a discipline.
- **The decision is pinned by a test, not just a doc.** A decision recorded only in `docs/` is one the
  next edit quietly undoes, and the pull toward a scorecard here is strong. A REGRESSION case (**81**
  now) asserts the shipped skill still carries the position section, the no-grade rule, the
  can't-see half, the no-measured-gain rule, and the founder's-call sequence.
- **Caught while wiring it:** the skill's own gate still read *"run only when `aiNative` is set"* —
  v0.153.0 made `boss adopt` offer `/comprehend` every time, so the CLI and the skill disagreed about
  when it may run. Aligned: expected first move on an adopted repo, opt-in on a fresh one.
- **The honest cost, accepted:** BOSS reads as *less impressive in a demo* than a tool that hands back
  a scorecard. Recorded in DEC-003 with a falsifier — if a real founder asks for a straight verdict
  twice, the no-grade rule is serving BOSS's principles at the user's expense and gets revisited.
- **Nothing added to the founder surface.** No new skill, agent or hook — two sections in a skill that
  already shipped.

## 0.153.0 — 2026-08-17

- **`boss adopt` now reads how far along your repo already is, instead of assuming square one.**
  It always defaulted to Quickstart — so a half-built app with real users got the **idea-capture**
  scaffold and a `CLAUDE.md` whose arc is *capture → canvas → unlock MVP*, an arc they finished
  months ago. The old answer was *"add `--mode mvp` if it already has real users"*, which asks the
  founder to make the one judgment call they're least equipped to make **before BOSS has read a
  single file**. Most people who try BOSS arrive with a repo, so the weakest path in the product was
  wearing the strongest path's clothes.
- **The detection is deliberately dumb, and shown.** A few signals a founder can check by eye — a
  build manifest, source-file count, tests, CI, a deploy config — printed as evidence next to the
  conclusion (`read from your repo: package.json · 34 source files · tests · CI`). Deep understanding
  is `/comprehend`'s job; it has the model and the wide context. **An inference you can't audit is
  exactly what BOSS warns founders against**, so the reasoning goes on screen or the feature doesn't
  ship. `node_modules` and friends are skipped, the walk is file-capped, and a manifest with no real
  source is not a build.
- **It caps at MVP and never auto-climbs to V1 — and that restraint has a reason beyond taste.** V1
  means committing to a design system and a db discipline; Scale is org ceremony. Both want a human.
  More pointedly: **`planSync` has no removal concept**, so ceremony added is ceremony BOSS cannot
  take back. Over-shooting is the expensive direction, so the tie goes to less. A shipped, tested,
  CI'd repo gets *told* it looks past MVP — *"`boss unlock v1` adds the design system, db and board
  discipline when you want it; BOSS won't climb there on its own"* — and the founder climbs.
- **`/comprehend` stops being hidden behind a flag you'd have to already know about.** It printed
  only when `--ai` was already passed — so the one thing that actually reads a founder's repo was
  invisible to anyone who ran plain `boss adopt` (which is what the README's one-liner shows). An
  adopted repo is that skill's own strongest input. Offered every time now, framed as optional and
  reversible.
- **`/welcome` gets an adopted-repo branch.** It was written for an empty folder — *"`docs/ideas/` —
  empty now; fills as you capture"* — said to someone with forty files of working code, which reads
  as a tool that didn't look. The branch leads with **what BOSS just added to their repo** (the
  anxious question, answered first), skips the capture arc entirely, names the inferred mode and how
  to change it, and carries one explicit prohibition: **don't audit their code.** They didn't ask for
  a review, and an unrequested critique of work they already shipped is the fastest way to lose them.
- **The legibility bug inferring MVP exposed.** Adopting at MVP printed **44 skill names** in one
  unreadable line — the same Principle #2 inversion v0.130.0 fixed for `boss map` (68 lines → 45).
  Capped to the first eight plus a count and a pointer, for both `new` and `adopt`.
- **Two prose overclaims the v0.151.0 sweep missed** because the new gate only matches backticked
  names: the README still sold *"the proto-personas pre-filter what to ask real founders"* (they ship
  to nobody — that's `/persona`, and it's a different tool), and GUIDE still listed the humane lens as
  a mentor among mentors. Both corrected.
- **Nothing added to the founder surface.** One new internal module (`src/detect.js`), five new tests
  (**80** now) including a REGRESSION pinning the never-auto-climb-to-V1 rule. Gate green throughout.

## 0.152.0 — 2026-08-17

- **The update path was two hops and BOSS only ever mentioned one.** Updating the **tool**
  (`npm i -g bossbuild@latest` / `brew upgrade boss`) and updating a **project** (`/boss-sync`) are
  separate acts, and nothing said so. Founders will assume the first is the whole thing — it is for
  every other CLI they own — and end up with a newer tool that changed nothing about the repo they're
  standing in.
- **🔴 Worse, the silence was self-confirming.** `boss status` compares the project's pin against the
  **installed** package, never against what's published. So a founder who never runs hop 1 has a pin
  that equals their install, and BOSS reports *"up to date"* — **forever**, while they sit fifty
  releases behind. The more stale you were, the more confidently BOSS told you you were fine. That is
  the exact failure BOSS spent v0.129.0 fixing in itself (*a check nobody runs isn't a check*), still
  live in every founder's project. **Now named at the point of use:** `boss status` says the quiet
  part — *up to date with the BOSS installed here; updating the tool is a separate step* — and prints
  the command. A real published-version check is still open; this stops the false reassurance.
- **`boss changelog` — the reachable form of "what changed since my pin."** `/boss-sync`'s step 0
  told the model to *"read `registry/CHANGELOG.md` from the BOSS source repo."* **No founder project
  has a `registry/`.** That step is the entire reason sync is *reviewed* rather than blind — it's
  where "14 files changed" becomes "here's what's new and why" — and it dead-ended. Same escape class
  `boss craft` fixed for the practice shelf in v0.147.0, sitting in the one place that most needed to
  resolve. The changelog already shipped inside the package; it just had no door. Inside a project it
  defaults to the useful cut (everything after **your** pin), with `--since` / `--full` / `--all`.
- **The gate that should have caught it, extended.** `check:refs`'s ESCAPES regex covered `library/`
  and `docs/ideas/` but not `registry/` — so the `/boss-sync` escape passed the v0.149.0 gate
  untouched. Added, and it caught the offending line on the first run. `/boss-learn` joins `/extract`
  on the allowlist: both *describe* what `boss learn` writes into BOSS's own repo, which is a
  description of the UP direction, not a pointer a founder is meant to follow. Three new tests
  (**75** now), including a REGRESSION pinning that "nothing new" must never read as "BOSS is
  current."
- **"When do I use BOSS, and when do I just talk to Claude?" — answered, for the first time.** It is
  the first real question every founder has, it is genuinely ambiguous (BOSS lives *inside* Claude
  Code), and a sweep of every founder-facing surface found **zero** answers. Now in `/welcome` (asked
  *before* the founder does, since the ones who wonder silently just avoid the skills), `docs/GUIDE.md`
  as a routing table, and the README. The model: **BOSS doesn't sit between you and Claude — it adds
  verbs for the seams.** *How do I build this?* → just Claude. *Should I build this / is it working /
  what did I decide?* → a BOSS verb. Plus the pointer that was missing: **`boss status` is the one
  command worth remembering** when you come back after a few days. And the anti-oversell, stated
  plainly in all three places: while you're heads-down BOSS does almost nothing, on purpose — a
  founder expecting a copilot will read the silence as broken.
- **One claim withdrawn on inspection, and no code written for it.** The release-readiness pass had
  called Quickstart's missing check-in verb a defect (`/close` and `/log` are MVP-only). Tested against
  a real project, it isn't: `boss status` already prints *"Next: pressure-test IDEA-001 → /canvas"*
  plus the ladder, `boss board` shows captured-vs-tested, and `/triage`'s living docs are the record.
  Session-start orientation is covered; the gap was **discoverability**, so it was fixed with a pointer
  in prose instead of a 49th skill. **Nothing added to the founder surface** (EVID-001 holds).

## 0.151.0 — 2026-08-17

- **BOSS was selling its own gitignored dev workspace as founder features.** A release-readiness pass
  before putting BOSS in front of the public checked the one thing no gate checked: *does the founder
  actually receive what the docs say they receive?* **They did not.** `/.claude/` — BOSS's private
  workspace — holds **19 agents that ship to nobody**, and the front door advertised them:
  - `README.md` claimed **"Nine advisors … humane"** (eight ship; **`mentor-humane` ships in no mode**),
    **"a builder team (designer, voice-keeper, prompt-coach)"** (**none** ship), and **"eight
    proto-personas … you can show features to"** (**none** ship — those react to *BOSS*, not to a
    founder's app; founders get `/persona`, which builds *their app's target user* — a different tool).
  - `docs/GUIDE.md` sent founders to `mentor-humane` from the **health / legal / money / safety**
    branch — the highest-stakes page in the guide — and from the "who to ask" table.
- **The worst one was functional, not cosmetic: `/consult` promised a humane override that nothing
  could execute.** Its step 2 seated `mentor-humane` as "always gets a voice," and step 4 — *"the
  humane override … that lens wins regardless of the viability case"* — told the model to consult an
  agent that exists in no mode. **Principle #6 has exactly one enforcement point inside the mentor
  board, and it dead-ended.** A founder running `/consult` got the override silently skipped or
  hallucinated. It now runs **in the skill itself**, grounded in the canvas's Risks & Harms cell and
  `boss craft harm-taxonomy` — no chair to route to, because an ethics advisor is a door you can
  decline to open. Nine shipped files fixed in total.
- **`npm run check:refs` gains a fourth class: PHANTOM AGENTS.** Classes 1–3 check paths;
  `check-wayfinding-drift` checks skills. **Nothing checked agent names** — so an agent named in
  public docs and existing nowhere passed every gate. Same principle the script already ships (*a
  reference is a dependency*), applied to the one reference class it skipped. The vocabulary is built
  from agents that exist **on disk**, never a regex over prose, because `persona-cohort` and
  `persona-reaction` are hyphenated English in two shipped skills and a pattern-matching version would
  cry wolf on both. Paired with a **REGRESSION unit test** (72 now), verified to fail before the fix —
  and it immediately found two the first scope missed: a `voice-keeper` mention in the **shipped
  conscience runtime** (`moment-frames.js`) and `mentor-operations` in `stages/L3-scale/README.md`.
- **`boss adopt` printed the opposite of its own promise.** `35 file(s) added · **0 of yours left
  untouched**` — because `skipped` counts *collisions*, not your files, so a clean adopt (no
  collisions) reported the scariest possible number at the moment of maximum trust anxiety. Adopt's
  entire pitch is non-destructive. Now: `nothing of yours overwritten`, with the collision count added
  only when there were collisions.
- **The direction of the leak is the durable finding.** `/.claude/` is gitignored by design, which
  makes it invisible to `grep` **and** to every checker — and it has now leaked **both** ways: stale
  `BlueprintOS` names hid *inside* it through the rebrand, and here it got advertised *as* product.
  Invisible-to-tooling is not the same as internal.
- **Nothing added to the founder surface** — no new skill, agent, hook or mode. Every edit is a
  correction or a subtraction (EVID-001's compose-and-subtract holds). Gate: **72 unit · 129/0 evals ·
  check:refs clean · manifests + wayfinding + freshness green**.

## 0.150.0 — 2026-08-17

- **The research inbox cleared — four claims vetted, two adopted, two rejected. The vets found more
  defects in BOSS than in the claims.** Every one of the four carried a "verify before adopting" flag
  written by the scan that captured it. Honoring those flags is what produced the release: **three of
  the four claims changed shape or died on verification**, and the two things worth shipping were
  drift in BOSS's own shelf that the vetting exposed on the way past.
  - **[[RVW-073]] workslop antecedents — ADAPT (narrow).** The ask was to restructure
    `ai-adoption-culture.md` around a causal chain. **Rejected on its own premise:** the practice does
    not present four independent sections — its preamble already *is* that spine ("the failure isn't
    the tool, it's the rollout"). What survived is that the spine had been **asserted without a
    citation for a year**, and the 2026 follow-on (n=962, OSF preprint) is its first evidence — added
    as an **association, never a cause**, because a cross-sectional self-report cannot say a mandate
    *produced* the slop. Plus the half the practice never had: it was written entirely from the
    receiving end. **52.7% admit sending; 55% of recipients got it from a manager; 85% say it damaged
    their trust in leadership.** On a two-person team the founder is the highest-leverage sender and
    the least likely to be told — so the norm now points **down**, not just sideways.
  - **[[RVW-074]] pickup latency — REJECT**, and the review sandwich rejected separately (an AI
    blessing the AI's diff so the human reads *less* erodes *whoever clicks merge owns what the agent
    wrote*). Batch size was **already** `git-workflow.md`'s organizing frame five times over, and the
    pickup stat was already in the file. **A solo founder has no pickup queue** — a 400-line agent PR
    doesn't wait, it gets merged unread — so the reframe would have made the practice *less* true for
    the only cohort BOSS has validated.
  - **[[RVW-075]] AGENTS.md — ADAPT (narrow).** The claim duplicates a scaffold BOSS shipped in
    **v0.58.0**; its team framing serves a cohort of zero. But the vet caught real drift:
    `context-discipline.md` was **swept 2026-08-11, seven weeks after that split shipped**, and still
    told founders to put project constraints in `CLAUDE.md` while never mentioning `AGENTS.md`.
    Followed literally, BOSS's own context practice **forked the shared layer BOSS's own scaffold
    creates.** Now stated, primary-verified: *Claude Code reads `CLAUDE.md`, not `AGENTS.md`* — the
    import is the bridge, and the "keep it tight" budget applies to **both files combined**, because
    the split saves exactly zero tokens.
  - **[[RVW-076]] spec-as-shared-artifact — REJECT, already shipped.** The entire suggested routing
    landed in v0.136.0 and sits committed at HEAD, judgment-labeled and citation-clean. The inbox item
    was a leftover of work already done.
- **Two second-hand attributions failed verification in one session, and that is the finding.**
  [[RVW-072]]'s "Karpathy shared this" arrived half-right (the lecture is real; the second video was an
  unrelated older explainer), and **"DORA 2026 says the bottleneck moves to specification"** does not
  verify at all — DORA's actual 2026 publication is *ROI of AI-Assisted Software Development
  (2026.01)*, an ROI report; the phrasing traces to blog summaries and preprints. Both are now
  quarantined in their verdicts. **An attribution is a citation's load-bearing half, and BOSS had been
  grading evidence without checking who actually said it.**
- **The hygiene fix that came out of a REJECT.** `git-workflow.md` read "(DORA names it directly;
  agentic PRs already sit ~5.3× longer before pickup)" — an unverified vendor multiplier standing next
  to a DORA attribution, so it read as DORA's. Exactly the lane-blend `SOURCES.md` forbids. **Fixed by
  subtraction:** the number is gone, the direction kept and correctly sourced; the header's `~4×` and
  `~12%` now state the gap with their grade named instead of pretending to precision. **A REJECT that
  repairs the practice it declined to change is the ledger doing its job.**
- **Nothing was added to the founder surface.** Three practice files edited, four verdicts recorded,
  four inbox items resolved. No new skill, agent, hook, or section — EVID-001's compose-and-subtract
  holds, and two of the four edits are subtractions.

## 0.149.0 — 2026-08-17

- **`npm run check:refs` — the standing answer to "does everything BOSS points at actually exist?"**
  The same bug landed three times in one week (RLS named but unwritable · `STYLE_GUIDE.md` read by
  three consumers and written by nothing · a practice shelf cited by 25 files and reachable from
  none). Each was found **by accident**, while touching adjacent code. **A reference is a dependency,
  and BOSS had no check that its dependencies resolved.** Now it does, and `npm test` gates on it.
  - **The sharper motivation:** fixing the third one took two passes — the first regex missed a link
    form, and *"I fixed them all"* went into a changelog while it was false. **A sweep you run by hand
    is a sweep you can believe you finished.**
  - Three classes, because they fail differently. **Broken links** (a relative link with no file).
    **Dead predicates** (a loop asserting `exists:` on a missing path — it can never open, silently).
    **Escaped references** (a *shipped* file pointing at something only BOSS's repo has — the worst
    kind, because it resolves here and dangles in every founder's project).
  - Verified by injecting a regression of each class and confirming it fails, then reverting. A
    checker nobody has watched fail is a checker nobody should trust.
- **It immediately found a loop that had been dead for 130 versions.** `docs/loops/eval.md`'s **entry**
  predicate asserted `exists: …/hooks/conscience.sh` — a file replaced by `conscience.js` in
  **v0.18.0**. An entry predicate that can never be true means the loop **never opens**: BOSS's own
  eval loop had been silently unable to fire since. The v0.18.0 bash→node migration updated the hook
  and the settings-merge migration and missed the loop spec that asserted on it. *Nothing was broken
  loudly enough to notice for four months.*
- **Three more escapes fixed:** a shipped template linked BOSS's own `IDEA-010` (in a founder's repo
  that path is either missing or — worse — their unrelated tenth idea); `/feedback` cited
  `docs/ideas/IDEA-021` as the reason for its no-telemetry rule (**the rule now states the reason
  itself**: nothing leaves this machine that the founder didn't read first); `/judge-traces` pointed
  at `library/hooks/auto-log.js` instead of `.claude/hooks/auto-log.js`.
- **The checker is deliberately forgiving where it should be.** `docs/ideas/IDEA-001-<slug>.md` in a
  shipped skill is *correct* — it describes where the founder's first idea goes. Template-relative
  links are skipped because they resolve in the flattened project layout, not this repo's. **A
  checker that cries wolf trains everyone to ignore it, which is how a checker dies.**

## 0.148.0 — 2026-08-11

- **A planned change was withdrawn instead of shipped, and that's the entry.** RVW-071 had carried
  one open item: split `design-system.md` (256 lines) the way v0.143.0 split the oversized skills.
  Measuring first killed it.
  - **The v0.143.0 split was right because a `SKILL.md` body auto-loads when the skill fires** — you
    pay for every line whether you need it or not, so deferring the rarely-read half is a real saving.
    **A practice is never auto-loaded.** It's read deliberately (`boss craft <name>`, or an agent
    following a pointer), and a deliberate reader wants the whole document. Splitting it buys
    indirection and nothing else.
  - The measurement made it concrete: across 28 practices the median is **~115 lines**, and only
    `design-system` (256) and `ai-ux-patterns` (278) run past 2×. The length **is** anomalous —
    but *anomalous* and *should be split* are different claims, and only the first was supported.
  - **What an outlier actually signals is growth, not structure** — and file-splitting would *hide*
    that by making each piece look small. A shelf that only ever grows is how BOSS becomes the
    framework it refuses to be (R&H #1).
- **So the fix points at subtraction instead of structure:**
  - `boss craft` now prints each practice's length, flags anything past **2× the median**, and says
    plainly that the next `/practice-refresh` should ask **what can be deleted**, not just what to add.
  - **`boss craft <name> --outline`** prints the section map with line numbers — the actual ergonomic
    complaint underneath "it's long" was navigability, not size.
- **The rule that got misapplied is now bounded in `skill-authoring`.** Progressive disclosure is
  about *what loads without being asked for*: a skill body, a `CLAUDE.md`, an agent prompt. It does
  **not** apply to a document someone opens on purpose. **A rule that earned its place in one context
  is the easiest kind of wrong guidance to write, because it arrives pre-justified.**
- 71/71 tests pass. **Nothing is open.**

## 0.147.0 — 2026-08-11

- **`boss craft` — 28 practices, readable from any project. And the bug that made it necessary: 25
  pointers into a directory founders don't have.**
  - Agents, skills and hooks referenced the craft behind them as `library/practices/<name>.md`. That
    path resolves in **BOSS's own repo and nowhere else** — a scaffolded project has no `library/`.
    So every one of those was a **dead end that looked authoritative**: the sharp edge in the agent,
    then a reference to nothing. `tester` told you to read the testing practice; `db-architect`
    pointed at the schema practice; `secrets-guard`'s header cited context-discipline. None resolved.
  - **The shelf was never missing — only unreachable.** `library/` ships inside the npm package
    (`files` in package.json), so all 28 practices were already on disk, at a path nothing in a
    project could name. The fix isn't to copy them in (bloat, instantly stale) — it's a form that
    resolves anywhere.
  - **`boss craft`** lists the shelf; **`boss craft <name>`** prints one, prefixes accepted
    (`boss craft testing` → `testing-with-agents`), with the practice's own curve and freshness date
    on the last line. Read-only, and always exactly as current as the installed version.
  - **Distinct from `/practice` on purpose:** that skill is your *team's* craft commons (PRAC-NNN
    records you and a cofounder write). This is BOSS's shelf. Both are named in each other's help so
    the distinction doesn't have to be guessed.
  - **All 27 pointers rewritten** across 20 files (22 in the first pass, 5 in a markdown-link form the
    first pass missed — worth recording, because "I fixed them all" was wrong the first time).
  - **One pointed at a path that never existed at all** — `library/practices/scalable-ai-design/<stack>.md`,
    referenced by `design-tokens-loop` since v0.24. Replaced with the honest line: BOSS ships no
    per-stack token adapters; author one as a project practice via `/practice`.
- **Two regression tests, on the class rather than the instances:** *shipped files never point at a
  path only the BOSS repo has* (with `/extract` exempted — it legitimately describes the UP direction
  into `library/`), and *every `boss craft <name>` pointer names a practice that exists*. **71/71 pass.**
- **The pattern worth naming, since this is the third instance in three versions:** RLS read by
  `/ship` and unwritable by `db-architect`; `STYLE_GUIDE.md` read by three consumers and written by
  nothing; a practice shelf cited by 25 files and reachable by none. **A reference is a dependency,
  and BOSS had no check that its dependencies resolved.** Now it has three.

## 0.146.0 — 2026-08-11

- **⚠️ Correction to v0.144.0.** That release replaced a stale `To author` list with a ✅ **Shipped**
  list — and one of the ✅ lines was false. `docs/design/STYLE_GUIDE.md` was claimed as shipped. It
  wasn't: `stages/L2-v1/template/docs/design/` was an **empty directory**, and the style guide was
  **read by three consumers** (`/design-review`, `ui-designer`, `ux-designer`) and **written by
  nothing.**
  - The same release warned that *"converting a stale TODO into a clean ✅ would have hidden the one
    gap that matters."* It then hid a different one. **A checklist is a claim — verify each line
    against the filesystem, not against the doc the line came from.**
  - **Fixed:** `/design-tokens-init` now writes `docs/design/STYLE_GUIDE.md` alongside the tokens,
    from a bundled skeleton. Tokens are the *what*; the style guide is the *how and why* — the 3–5
    principles with their rules, composition patterns, the five-state table, the accessibility floor,
    and a dated **Exceptions** log (an exception recorded is a decision; an exception unrecorded is
    drift, and next time it reads as precedent).
  - **A regression test now covers the class, not the instance:** *every design doc a consumer reads
    is a design doc some skill writes.* Same hole shape as RLS-in-`db-architect` and
    test-diff-in-`tester` — a dependency with no producer.
- **The prototype registry — and it closes a hazard v0.144.0 opened.** `/spec` was taught that an
  executable artifact beats prose (*a crude HTML mockup outperforms three paragraphs*). True, and it
  introduced a risk worth naming:
  - **A mockup that doesn't consume your tokens is worse than prose.** Prose is *obviously*
    incomplete, so the implementer fills the gaps from the design system. A mockup is a **confident,
    complete-looking answer** — so the implementation reproduces it faithfully, raw hexes and all.
    **An off-system mockup injects the 47 blues at spec time**, before a line of product code exists,
    with the authority of something you can see.
  - The rule that makes the rich-reference ladder safe: **a prototype imports the same tokens as the
    product, or it is labeled a throwaway sketch.** Both are legitimate; a mockup that *looks* like a
    design decision and silently isn't is not.
  - `docs/design/PROTOTYPES.md` (bundled skeleton) carries that rule plus a **Discarded** table —
    because a discarded prototype is a **question already answered**, and deleting its row means
    paying for the answer twice. Same discipline `/extract` applies to patterns.
  - Created **when prototypes start accumulating**, not for a single sketch — that would be ceremony.
- `/spec`'s mockup guidance updated at the source of the hazard; `design-system.md`'s item #5 now
  carries the full rule. **69/69 tests pass. Nothing on the design layer's checklist is open** —
  verified against the filesystem this time.

## 0.145.0 — 2026-08-11

- **`design-tokens-guard` — the boundary the design practice had been prescribing without providing.**
  v0.144.0 named the gap: *"reference tokens by name in every prompt"* is a **filter** (it depends on
  every future prompt remembering); what actually stops the 47 blues is a check that fires on a raw
  hex. That check now exists.
  - **What it does:** after a write to a style-bearing file, catches hardcoded colors — hex,
    `rgb()`/`hsl()`, and numeric palette classes like `bg-indigo-500` — and hands Claude **your token
    names** instead. A warning that names no alternative just gets acknowledged and ignored.
  - **The design decision that matters most is the silence.** It does **nothing** unless a
    `DESIGN_TOKENS.md` exists. **No token system, no opinion** — a founder who hasn't run
    `/design-tokens-init` isn't doing anything wrong, and a hook that nags them is the unearned
    ceremony BOSS refuses (Principle #2). The tokens file *is* the opt-in signal.
  - **It reads only what the call just wrote**, not the whole file — a pre-existing hex the founder
    already decided to keep is not the hook's business. Drift is what's *new*.
  - **Ships dormant at MVP** (`optionalHooks`), so `boss sync` keeps it current whether or not it's
    on. `/design-tokens-init` offers it **once**, at the only moment it makes sense — right after the
    tokens exist — and is told to drop it and not re-ask on a no. Also listed in `boss help hooks`.
  - **Advisory, never blocking.** PostToolUse can't block (the tool already ran), so it uses
    `additionalContext` — the same channel the conscience speaks through. Fail-open throughout: a
    broken guard must never break a session.
- **Verified against the real contract, not from memory.** The PostToolUse input/output shape was read
  from the host docs before the hook was written — a hook with the wrong output contract is a hook
  that silently does nothing, which is worse than no hook. Then exercised on ten edge cases (Edit /
  MultiEdit shapes, the tokens file itself, `node_modules`, prose, tests, a 7-char git sha that is
  *not* a color, empty writes, malformed input) and run live inside a scaffolded project.
- **5 new regression tests**, and they lock the **silence** first: the JIT gate is the behavior that,
  if it broke, would get this hook turned off for good. **68/68 pass.**
- `design-system.md`'s Shipped section updated; the only genuinely-open design item left is the
  **prototype registry** (prototypes consuming the same tokens so a mockup graduates cleanly).

## 0.144.0 — 2026-08-11

- **Claude ships a planning layer. BOSS should rent it, not rebuild it — and the integration is one
  optional question.** The host now has built-in `Explore` and `Plan` subagents; `Plan` researches the
  codebase during plan mode and returns an implementation route. The reflex is to read that as
  competition for `/spec`. **It isn't, and that distinction is the whole verdict:**
  - `/spec` answers *should we build this, and how will we know it's done* — reading the idea, the
    canvas, the evidence. `Plan` answers *what's the file-by-file route* — reading the code. Different
    inputs, different rot, consecutive rather than competing.
  - **`/spec` decides the destination; the plan picks the road.** `/spec` step 6 now *offers* plan mode
    before handing to the coder — skippable, with an explicit note that it degrades to the old
    behavior on a host without plan mode. **A route that arrives without a spec is a well-planned trip
    to nowhere.**
  - **Never author a BOSS planner or searcher agent.** Re-rolling an absorbed mechanism is the drift
    IDEA-028 exists to prevent. Full per-primitive verdicts in `docs/dossier/host-subtraction-pass-002.md`.
- **The sharper lesson, from a removal rather than an addition.** **Ultraplan was removed this month** —
  a research preview since spring, gone. BOSS lost nothing, having built on it never, but it's the
  first observed case of a host primitive *vanishing*, and it upgrades the audit question from
  *"has the host absorbed this?"* to **"what happens when the host un-ships it?"** The rule now in
  `harness-engineering`: **sit on a host primitive at a seam you could close by hand — prefer them at
  the boundaries of your flows, not in their interiors.**
- **Design swept — and the "weakest doc on the shelf" verdict was half right.** The AI-failure catalog,
  three-layer tokens, the indigo-apology framing and *intentionality not intensity* all held up against
  a 2026 sweep; the sameness literature **agrees with BOSS and adds nothing**. The staleness was in the
  doc's edges, not its content:
  - **A `To author (when V1 mode is built)` TODO list whose every item had shipped** — tokens docs,
    `/design-review`, `/ux-check`, `/design-tokens-init`, `ui-designer`, `ux-designer`. Replaced with a
    **Shipped** section that keeps the two genuinely-open items honest (the hardcoded-style hook is
    **prescribed but unshipped**; the prototype registry is unbuilt). Converting a stale TODO into a
    clean ✅ would have hidden the one gap that matters.
  - **NEW — authoring design principles.** Three levels: **principle** (contains a tradeoff) →
    **guideline** → **rule** (checkable). The test: *could a reasonable person argue the opposite?*
    "Be delightful" fails; "calm over engaging" passes. **A principle that can't lose an argument is a
    mood.** And the reason it belongs in an AI-design doc: **an agent can't act on a principle, only on
    a rule — so principles that never descend into rules are decoration.**
  - **NEW — iterating on design.** Iterate on the **artifact, not the description** (adjectives are
    where taste goes to die) · vary **one dimension at a time** · **compare in parallel, don't refine in
    series** (serial *"make it better"* re-averages toward the mean — toward the exact slop the doc
    warns about) · **have a stop rule**. Plus: re-iteration degradation applies to design, and
    **empty/loading states are the first casualties** because they're invisible in the screenshot.
  - **SHARPENED — prevention was framed as prompting.** *"Reference tokens by name in every prompt"* is
    a **filter**; what stops the 47 blues is a check that **fails on a raw hex**. Same lesson RVW-066
    took from CVE-2026-22708, transferred to a new domain — *bound the capability, don't enumerate the
    route.*
- **A missing freshness tier, added rather than worked around.** `craft`/365d is too slow for a practice
  whose **AI-default half moves with the tools**; `model`/90d is the right speed but routes to
  `/recalibrate`, which owns neither design nor testing. New tier: **`craft-ai` — 180d,
  `/practice-refresh`.** `design-system.md` and `testing-with-agents.md` both moved onto it. **Two
  sweeps in a row hit this same gap — that's the signal a tier was missing, not that two dates were
  wrong.**
- Verdicts: **RVW-070** (host planning layer) · **RVW-071** (design sweep). 63/63 tests pass.

## 0.143.0 — 2026-08-11

- **The two open threads from v0.142.0 are closed.** Both were logged rather than quietly dropped;
  this is the follow-through.
- **The template surface is rightsized — and the split turned out to be principled, not arbitrary.**
  Every worst offender had the same shape: a large **embedded output template** (the doc or code the
  skill writes) sitting in the always-loaded body. That is precisely what `skill-authoring` §2 calls a
  level-3 bundled resource — *"templates, examples, reference files — loaded on demand from the body,
  never up front."* Six skills, seven new bundled files:
  - `ai-cost` **265 → 163** (logger + budget doc) · `ai-failure-states` **226 → 157** ·
    `cost-review` **218 → 163** · `ai-first-init` **238 → 201** · `extract` **210 → 172** ·
    `spec` **196 → 158**.
  - **L1's always-loaded surface: 4,169 → 3,861 lines**, with 382 lines moved to load-on-demand.
    Total bytes went *up* — which is the point. Progressive disclosure doesn't shrink what exists,
    it shrinks **what you pay for on every session**.
  - Three skills had a duplicated lead-in left behind (*"Use this skeleton"* immediately followed by
    *"Skeleton:"*). Deduped — shift 4, caught in BOSS's own output again.
- **`/spec` now produces the most executable artifact it can, not just prose about one.** This was
  RVW-069's named open thread: the doctrine said an artifact the agent can execute, render or diff
  beats a description, and `/spec` still wrote markdown. It now carries the ladder —
  **prose < screenshot < rendered mockup < failing test < rubric** — with three concrete routings
  (UI → a crude HTML mockup; logic → acceptance criteria **as failing tests**; anything fuzzy → a
  rubric the verifier reads). Explicitly bounded: *don't force it* — a one-line copy change doesn't
  need a mockup, and the question is always *"what's the cheapest artifact that removes the most
  ambiguity?"*
- **Five stale model names removed from shipped skills — a v0.137.0 rule BOSS was breaking in its own
  templates.** `model-routing` says a shipped artifact should *say nothing* and inherit; `ai-cost`
  shipped a price table hardcoding four model ids **with prices**, and four other skills named models
  in prose. All were already a generation out of date. They now name the **capability shape**
  (`deliberation` / `volume` / `cheap-bulk`) instead.
  - The cost logger is the honest exception — you cannot price a call without knowing what you
    called — so the discipline moved rather than vanished: **the founder fills the table from the
    provider's current pricing page at wire-time**, the table carries a *last-checked* date, and an
    unknown model logs at zero **loudly** rather than guessing. A cost log that quietly under-reports
    is worse than none.
- **Verified end-to-end, not just written:** all eight bundled resources scaffold through
  `boss new` + `boss unlock mvp`, `boss sync` tracks and updates every one of them (the v0.141.0
  recursive-walk fix carrying its weight), and every in-skill pointer resolves. 63/63 tests pass.

## 0.142.0 — 2026-08-11

- **The two coverage gaps are closed. The shelf goes 26 → 28 practices.** Both were named in the
  2026-07-30 audit and survived two sweeps. One of them had been advertised as existing:
  `library/README.md` listed **testing** among what `practices/` holds, since the library was created.
  It never did. *A README is a claim, and nothing was checking it.*
- **`testing-with-agents.md` — testing when an agent writes the code.** Not "testing, but with AI."
  The four failure modes that **do not exist** when a human writes the code:
  - **The agent rewrites the test to match the bug.** Asked to make a suite green, it changes the
    *assertion*, not the behavior — and reports success. **A test file changed in the same commit as
    its code is the highest-signal thing in the review.** BOSS has owned this line since v0.66.0, but
    it was stranded in `git-workflow.md`; it now has a practice to live in and the `tester` agent holds it.
  - **Green by construction.** A test derived from the implementation **cannot fail**. The fix is
    ordering, not effort: acceptance criteria (or the failing test) *before* the agent implements.
  - **Coverage stopped meaning anything.** Producing tests is now free, and coverage only ever
    measured production. Delete a line of real logic — if nothing goes red, that's your answer.
  - **A single green run is not evidence.** An AI-backed path needs k runs, all passing. **4 of 5 is
    a 1-in-5 production failure rate, not "mostly working"** — the most commonly misread number in AI products.
  - Plus: **tests and evals are different tools** (a table, so neither masquerades as the other — the
    founder who tunes prompts for weeks against a bug in the retrieval call is the failure shape);
    **error analysis before metrics** (read 20–50 traces first; don't lump distinct failures under
    "hallucination"; **validate your judge against human labels — an unvalidated judge launders a
    guess into a metric**); and **what to test first when you have nothing**, laddered by mode.
- **`data-schema.md` — the layer an agent gets functionally right and dangerously wrong.** Carried on
  `curve: threat`, not `craft`, because one part of it has an adversary.
  - **The headline: RLS the AI never configured.** The agent writes `CREATE TABLE`, omits
    `ENABLE ROW LEVEL SECURITY` and the policy, and the platform exposes that table over its
    auto-generated API. **Change a user ID in a request and another user's data comes back.**
  - **Why it survives every test you'd think to write: the app works.** Logged in as yourself every
    screen is correct. It's a *missing security property*, not a functional defect — invisible from
    inside the product. **The agent knows what RLS is; knowledge in the model is not a control in your app.**
  - Three fixes: **enable RLS in the same migration that creates the table** (deny by default, so a
    table you forget about is closed); **write the negative test** (log in as A, ask for B's row,
    assert nothing); **verify from outside the app** — your UI filters because you told it to, the
    API doesn't unless the *database* says so.
  - Plus the **one-way doors worth a `DEC` before the migration** (tenancy model, row identity,
    soft-vs-hard delete, what you store at all) and a six-line review list for an agent-written schema.
- **Both are wired in, not just written.** `tester` and `db-architect` now carry the sharp edge of
  each and point at the full practice; `git-workflow` hands its stranded line forward; the watchlist's
  two ⚠️ coverage-gap markers are now ✅; `library/README.md` describes what the shelf actually holds.
- **Paper trail, recorded after the fact and labeled as such — RVW-066 through RVW-069.** v0.141.0
  shipped ahead of its verdicts because the finding was a security fix. The rubric was applied
  honestly afterward; it would not have changed any decision, and the process note is recorded in
  RVW-066: **shipping ahead of the paper trail is defensible for a security finding and should stay
  the exception.** RVW-068 also records the deferred half — ~6,900 lines of template surface still
  unrightsized, logged as open rather than quietly dropped.

## 0.141.0 — 2026-08-11

- **A refuted assumption, and the security floor that couldn't reach you.** The weekly host +
  agent-craft sweep returned its first **refutation**: an allow/deny list of *command names* is a
  filter, not a boundary. **CVE-2026-22708** (Cursor, fixed in 2.3) ran shell built-ins — `export`,
  `typeset`, `declare` — **without appearing in the allowlist and without approval**, reachable by
  indirect prompt injection. Cursor's own guidance now discourages allowlists as a security barrier;
  Claude Code shipped matching hardening the same month.
  - **The matching hole was in BOSS's own template.** `context-discipline` has warned since v0.42.0
    that *"a `Read(...)` deny does NOT block Bash"* — and the shipped `settings.json` implemented
    only the `cat` case behind a blanket `Bash` allow. `head`, `grep`, `xxd`, `source`, `env` and a
    bare `.env` (no `./`) all walked past it. **5 deny entries → 29.**
  - **`boss sync` now merges the deny floor**, so this reaches projects already in the wild. Before
    today the floor shipped only via `boss new` — *a security floor that can only reach new projects
    is not a floor.* The merge is **additive and deny-only**: a deny entry can only ever restrict,
    never grant, which is exactly the property `allow` and `defaultMode` lack. **Your allow list and
    your permission mode are never touched.**
  - **The honest limit, stated in the practice:** the Bash half is an enumeration you cannot finish.
    It does not cover `awk`, `sed`, `python -c`, a renamed binary or a shell built-in. Don't grow it
    toward completeness — escalate to `secrets-guard`, which matches on the **path** and is the only
    layer here that is actually a boundary. Its recommendation moved from *"regulated work"* to
    **"as soon as the project holds a real credential."**
- **Auto mode becomes the host default on 2026-08-14 — and BOSS had never named it.** Zero mentions
  across `library/` and `stages/`, in the practice that claims the permission surface. `context-discipline`
  now carries a permission-modes section: what each mode is for, that **deny rules still win**, and the
  trap — auto mode removes prompt fatigue, which was never the boundary either. BOSS already shipped
  `defaultMode: "auto"`, so **nothing in your project needs to change.**
- **Anthropic deleted 80%+ of Claude Code's own system prompt for Claude 5 with no eval loss.**
  Instructions written to compensate for a weaker model become a tax on a stronger one. Against BOSS's
  shelf: **shifts 1 and 3 were already held** (`skill-authoring` §1 and §2, written a month earlier) —
  but BOSS **violated shift 3 in what it ships**.
  - **`/welcome` — a founder's first contact — was 262 lines.** Three sections it already marked
    *"expand only if asked"* were loading on every run. Split to `reference/deeper.md`, loaded on
    demand. **262 → 214 lines.** Two `Rules` entries that duplicated the voice rules are gone, one of
    which **contradicted** the wrap-up (*"three doors"* vs *"one literal command"*) — the context clash
    the dedup rule exists to prevent.
  - **`boss sync` now manages a skill's bundled resources, not just its `SKILL.md`.** Splitting a
    skill would otherwise have reproduced the dormant-hook bug fixed in v0.108.0: shipped once at
    scaffold, never updated again — including if a fix landed. Progressive disclosure makes a skill a
    **tree**, and the whole tree is managed.
  - **Two shifts BOSS did not hold are now on the shelf.** `skill-authoring` §3 — *design the
    interface, don't supply examples* (a named argument and a real enum outrank three worked examples,
    and rot less). `harness-engineering` — **rich references**: an artifact the agent can execute,
    render or diff beats prose describing it, so an HTML mockup outperforms three paragraphs about the
    layout. Plus Anthropic's **brain/hands decoupling** (stateless harness, durable session log outside
    the context window, pets-vs-cattle sandboxes).
- **Confirmed current, no change needed:** `mcp.md` re-read against the primary 2026-07-28 changelog —
  statelessness, MRTR, the Roots/Sampling/Logging deprecations, DCR → Client ID Metadata Documents and
  the 12-month lifecycle policy are all correctly held. The `CLAUDE.md` guidance matches Anthropic's own
  Claude 5 line. **A confirmed claim is a finding** — three practices were verified, not edited.
- **Process:** domain 2 (the host) is on a **quarterly** cadence while the host digest ships
  **weekly** — it paid out more than any other tap this run and is checked least formally. Flagged in
  the watchlist as a cadence that is set too slow. Full sweep: `docs/research/sessions/SESSION-2026-08-11`.

## 0.140.0 — 2026-08-05

- **The rebrand finished — six weeks after it shipped. Every project scaffolded since v0.97.0 got
  agents that introduced themselves as BlueprintOS.** DEC-002 swept the template's `CLAUDE.md` and
  `AGENTS.md` and stopped there. The template's `.claude/` was never touched, so `pm`, `coder-generalist`
  and `/boss` all opened with *"scaffolded by BlueprintOS"* in a project scaffolded yesterday.
  - **The one that wasn't cosmetic: `/feedback` filed founder issues against `ajeshh/BlueprintOS`.**
    All three paths — the `gh issue create` call, the browser-fallback URL, and the consent line that
    shows the founder where their words are going. It worked only because GitHub still redirects the
    old repo name. A founder reading the consent prompt was being told the wrong destination.
  - **`/welcome` pointed at the old README URL.** Same redirect, same wrong name in front of a founder
    on their first run.
  - **BOSS's own eleven agents were rebranded too** — every mentor and builder prompt still said
    *"You are the X for BlueprintOS (BOSS)"*. Internal, but loaded in every session.
- **Why it survived two sweeps and `check:freshness`: `.claude/` is gitignored, and the grep on this
  machine honors `.gitignore` and skips hidden dirs.** A root `grep -ri blueprintos .` returned 8 files
  and reported clean on exactly the 16 that were dirty. Freshness never saw them either — it reads the
  practice shelf, not the template. **Any repo-wide identity sweep needs `find -exec grep`, not `grep -r`**;
  a check that inherits the VCS's idea of what exists is blind to everything deliberately excluded from it.
- **Left alone on purpose:** the `learn.js` back-compat regex, this changelog's history, DEC-002, BRAND.md's
  *Retired* section, and the dated session transcript that records the old path verbatim. Those describe
  the old name; they don't use it.
- **Local, not shipped:** the repo folder is now `~/Projects/bossbuild`, matching the git remote and npm
  package. Absolute paths in the re-runnable handoff prompts were repointed.

## 0.139.0 — 2026-08-03

- **The post-launch arc folds until you've shipped something — the reversible half of the
  subtraction question (checklist 5.3, option C).** At MVP a founder with one idea was read **44
  skills, nine of them about measuring, retention, pricing and trust** — for a product with no
  users. That is [[EVID-001]]'s *"worried about bloating my app"* rendered as a menu.
  **44 → 35 listed; 72 → 64 lines.**
  - **Nothing is removed, disabled, or made harder to run.** The nine still install, still work, and
    are one flag away (`boss map --all`). This is the `headline` pattern from v0.130.0 applied to
    *installed* skills instead of previewed ones.
  - **The fold is a read of real state, so it opens without being asked.** The predicate is a FEAT in
    the board's **Shipped** column — frontmatter-true, never guessed, degrading to the calmer surface
    if the board can't be read. Ship one feature and the post-launch arc appears on its own, because
    at that point it *is* the work. Verified both directions in a throwaway and locked with a test.
  - **It mirrors the grouping GUIDE.md already uses.** v0.134.0 gave these eleven skills their own
    "After you ship" section rather than padding the MVP rung; this makes `boss map` agree with the
    doc instead of contradicting it. Declared per-rung as `postLaunch` in the manifest — BOSS's own
    file, not SKILL.md frontmatter (which the host parses) — and gate-checked as a real subset, so a
    stale entry can't make the fold count lie about what's behind it.
  - **Why option C and not the merge.** The brief recommended composing `/measure` + `/pmf-check` +
    `/retain` + `/onboard` + `/roadmap` into one verb, and that may still be right — five of them
    carry the same `n < 10` gate and route to each other 3–5 ways. But this is half a day and fully
    reversible, and it answers the cheaper question first: *does the surface feel smaller?* If it
    does, the merge may be unnecessary. If it doesn't, the merge is earned rather than assumed.
    **The decision itself stays a founder call.**

## 0.138.0 — 2026-08-01

- **`/pretotype` can publish the fake door in one turn — and says out loud what it can't do.**
  The first host-capability integration, folded into an existing verb. **No new skill**: if Artifacts
  needed their own command the integration would have failed ([[EVID-001]] — compose, never add).
  - **The gap it closes.** Savoia's whole argument is that a demand test must be *cheap and fast*.
    BOSS asked for "a landing page with a sign-up button" and then left the founder to design, build
    and host it — so **the most important discipline BOSS teaches was the one most likely to be
    skipped.** The page is now composed from what BOSS already holds (the canvas's People / Problem /
    Promises, plus `BRAND.md` voice and design tokens when they exist) and published as a real
    shareable URL: no deploy, no host account, no cost.
  - **🔴 The optimistic version of this idea was dead on arrival, and that's recorded.** The design
    hinged on whether a published page could hold shared state — visit, click, leave an email,
    founder reads the count. **It cannot.** The available runtime capabilities are `downloads` and
    `mcp`; there is no persistence, and `mcp` runs with the *viewer's* credentials on a page that
    can't be shared publicly at all — the one thing a fake door must be. Verified before building,
    not assumed; the brief that speculated has been corrected rather than quietly deleted.
  - **So the limitation is a spoken line, not a footnote.** The skill instructs BOSS to tell the
    founder, in their hearing, that *the page stores nothing* and to point capture at a free form
    (Tally / Formspark / a Google Form) the CTA links out to. **A fake door that silently drops
    signups is worse than no test** — the founder reads a zero and kills a good bet over a plumbing
    bug. Also named as real steps: the page is **private until they share it**, and the count lives
    in the form tool, not in BOSS.
  - **The humane line a fake door doesn't cross** (`ai-ux-patterns.md`, PRINCIPLE #6). Testing demand
    for something that doesn't exist is honest; impersonating a real company, implying the thing is
    live and purchasable, fabricated social proof ("join 10,000 others"), manufactured urgency and
    confirmshaming are not. The test given is the one a founder can actually apply: **could you
    follow up honestly?** If the "you're on the list" email wouldn't match what the page implied,
    the page is lying — and the signal is worthless anyway.
  - **Not extended to `/landing` or `boss board`, deliberately.** Both would benefit and both are
    easy, which is exactly why they wait. `/pretotype` is the one where the artifact removes a step
    that currently stops the discipline happening at all. If a real founder runs a published fake
    door and it produces signal, extend it; if nobody runs one, extending it would be three unused
    features instead of one. **The compose-and-subtract mandate applies to good ideas too.**

## 0.137.0 — 2026-08-01

- **BOSS stops naming models. Route by capability, never by name (PRINCIPLE #3 applied to itself).**
  Eight shipped agents pinned `model: fable`, and `.boss/model-profile.json` enumerated model ids,
  tiers and per-token prices. Within four weeks the pin was stale, the prices couldn't be re-verified
  from a real source, and nobody could confirm the alias even *resolved* in a founder's install —
  while `/recalibrate`, the discipline built to catch exactly this, never fired.
  - **The root cause is BOSS's own PRINCIPLE #3**: *"anything reusable should live as decoupled,
    nameable structure, not buried in implementation… could a sibling project reuse this without
    copy-pasting? If not, it's locked."* A model name in an agent file fails that test — there's
    nothing to reuse but a string that will be wrong soon. **The intent is what's reusable**
    ("this work wants deliberation"); it has been true for three years and will stay true.
  - **New `library/practices/model-routing.md`** names the three capability **shapes** —
    `deliberation` (rare, high-stakes, ambiguous), `volume` (frequent, well-specified, the default),
    `cheap-bulk` (high-frequency or public-facing at scale) — each with the *question* that selects
    it, not a model that satisfies it. Four costs of pinning, stated plainly: it rots on a clock you
    don't control · **it fails silently** (an unrecognised name doesn't throw) · it overrides a
    choice the founder already made when they opened their host · it welds BOSS to one host (every
    pin is a line of the IDEA-006 port). Keeps one honest exception: pin a concrete model when the
    *behaviour* is the fact you're recording (a reproducible eval), next to the result, as provenance.
  - **Every `model:` pin removed from all 17 shipped agents/library copies**, and the Fable prose
    note replaced with a capability sentence that is true on any host in any year. Mentors now
    **inherit the founder's model** — which is the correct default, costs nothing to maintain, and
    stops second-guessing a choice they already made.
  - **`model-profile.json` → profile_version 3, capability-shaped.** It names shapes and the tests
    that select them; the concrete `binding` is **null by default**, local, operator-owned and
    explicitly *safe to be wrong*. `reopen_on` no longer lists "a new model" — the trigger that
    fired constantly and still went stale between runs — and now lists only the rarer, meaningful
    event: **the shape of the tradeoff moving.**
  - **`/recalibrate` narrowed to match.** It no longer chases names, tables or prices. A new model
    shipping is **no longer a trigger, because nothing rots when one ships.**
  - **New gate check** so pins can't come back: any `model:` key in shipped frontmatter fails the
    release. Deliberately checks **only** frontmatter — a first draft scanned prose too and flagged
    twelve files including `CLAUDE.md`, `claude-code` as a host, and `/ai-cost` teaching a founder to
    record which model *their own app* calls, which is correct and none of BOSS's business. A check
    that cries wolf is one someone disables; narrow and true beats broad and noisy.
  - The practice carries `curve: craft` (365d), **not** `curve: model` — a practice arguing that
    routing-by-capability doesn't move when a model ships shouldn't sit on the model curve.

## 0.136.0 — 2026-07-31

- **The first live run of `/practice-refresh` — one wrong practice corrected, three pieces of knowledge
  moved to the roles that needed them.** The v0.135.0 audit produced findings; this ships the fixes.
  - **🔴 `mcp.md` corrected against the SHIPPED 2026-07-28 spec, read from the primary changelog** (not a
    summary — this doc goes to founders). It had described the revision as forthcoming and the ground as
    "still moving." **What actually changed is the judgment, not the date.** The revision's headline isn't
    any feature — it's that the protocol **acquired rules for how it changes**: a formal feature-lifecycle
    policy with a **minimum twelve-month deprecation window** and a public deprecated-features registry,
    plus an extensions framework so new capability (Tasks, MCP Apps) arrives *outside* the core. So the
    advice inverts: MCP is no longer ground to merely build *against* — the core is stable enough to build
    *on*, and the lifecycle policy is the insurance. **The honest counterweight is now stated too:** this
    revision was substantially breaking (sessions and the `initialize` handshake removed, `ping` /
    `logging/setLevel` / SSE resumability gone, server-initiated requests replaced by Multi-Round-Trip
    Requests, and Roots/Sampling/Logging deprecated outright) — if you built against the prior revision you
    have migration work, and the twelve-month window is what makes it manageable.
  - **Shape (b) re-costed.** The **stateless core means an MCP server can be a plain serverless function**
    — a real cost-floor drop for exposing one. **The auth cliff did not move**, and got more precise
    (`iss` validation per RFC 9207, credentials keyed to their issuing authorization server, Dynamic Client
    Registration deprecated in favor of Client ID Metadata Documents). Cheaper to stand up ≠ safe to open.
  - **The `/mcp` deferral was re-decided instead of left to rot.** Its stated condition — *"premature until
    the 2026-07-28 spec settles"* — had silently expired, and **a deferral whose condition has expired is
    not a decision, it's a stale note.** Split explicitly: the *spec* half of RVW-019's re-open condition is
    **met**; the *demand* half (a real founder hitting the wall) is **not**, and that was always the
    load-bearing half. Re-open on demand alone.
  - **RLS is now part of schema design, not just the deploy checklist** (`db-architect`, L2). The agent that
    owns the data model never mentioned row-level security, while `ship-it-live.md` named it as *the*
    signature vibe-coded breach class (CVE-2025-48757/Lovable — 303 endpoints across 170+ apps; MoltBook —
    1.5M tokens, founder wrote no code). Added as a design-time discipline: per table, *who can read a row,
    who can write it, which column proves it*; **policies belong in migrations**, not a dashboard; enabling
    RLS ≠ writing a policy; and the plain-words version for a non-technical founder. `/ship` and `/red-team`
    can only *catch* this — `db-architect` is the one who can *prevent* it.
  - **The test-diff discipline moved to `tester`** (L1). `git-workflow.md` carried BOSS's sharpest
    AI-testing line — *an agent under pressure will rewrite the assertions to match the broken behavior, so
    the suite goes green certifying the bug* — and the one role whose entire job is trustworthy signal
    didn't hold it. Now concrete: read the test diff first, treat a weakened assertion as red **even when
    the suite is green**, a deleted/skipped test is a finding, and assertion churn with no
    acceptance-criteria change is the loudest signal there is.
  - **The spec named as the non-technical cofounder's review surface** (`mentor-cofounder`, L1). Pure
    composition — no new surface. The commonest way a non-technical founder goes quiet is that "staying in
    the loop" gets defined as reviewing code they can't read, so they stop reviewing anything; agent-written
    volume widens that fast. `/spec` already writes goal + acceptance criteria + smoke check, and *"what
    this must do and how we'll know"* is a product judgment — the half they own. Labeled in-text as BOSS's
    own judgment, not a cited finding.
  - **Practice re-stamped**: `mcp.md` `last_reviewed` → 2026-07-31, `review_by` → 2026-10-29. The
    discipline's own rule — stamp what you swept, even when nothing changed.

## 0.135.0 — 2026-07-30

- **The build craft stops rotting silently — BOSS's third standing refresh discipline (IDEA-056).**
  BOSS had two anti-rot disciplines — `/humane-refresh` for the dark-pattern curve, `/recalibrate`
  for the model curve — and **none** for the thing it mostly is: agents, MCP, the host surface,
  security, data, testing, design process, deploy. Twenty-five practices, written in two big sweeps,
  carrying no date, no owner, and no trigger.
  - **🔴 The finding that forced it: BOSS ships a staleness discipline to founders and never applied
    it to itself.** `/practice` writes a `review_by:` onto a founder's craft record and warns them the
    AI craft moves fast enough to go quietly out of date. BOSS's own shelf had no such field, and
    `design-system.md` + `skill-authoring.md` had **no frontmatter at all** — invisible to any
    maintenance that could ever be written.
  - **🔴 `mcp.md` was wrong at seven days old.** It described the 2026-07-28 MCP spec revision as
    forthcoming and the ground as "still moving." That revision shipped — stateless core (the
    `initialize` handshake and protocol session removed), a formal extensions framework, OAuth/OIDC
    hardening — and settled *in order to* stop moving. It also silently opened the `/mcp` skill
    deferral, whose stated condition was "until the 2026-07-28 spec settles."
  - **Freshness is now machine-readable.** Every practice carries `last_reviewed:` / `review_by:` /
    `curve:`. `review_by:` is deliberately the *same field* `/practice` writes for founders — one
    discipline at two altitudes, not two inventions. `curve:` is the load-bearing idea: **a doc doesn't
    rot because time passed, it rots because the ground under it moved**, so the curve sets the cadence
    (`host`/`protocol`/`threat`/`model`/`humane` 90d · `market` 180d · `craft` 365d) *and* names which
    discipline owns the sweep.
  - **`npm run check:freshness`** — zero-dep, reuses the existing `parseFrontmatter` + `BOSS_ROOT`
    helpers. Prints what's overdue, how long since each was swept, and which skill to run. It errors
    **only** on unreadable metadata (a doc no discipline can see); being overdue is information, not a
    reason to block a release. Added to the release gate on the gate's own "must have caught a real
    shipped bug" terms — it found the two frontmatter-less practices.
  - **`/practice-refresh` + `docs/research/watchlists/build-craft.md`** (10 domains, their taps, their
    event triggers). Orchestrates what already exists: `check:freshness` schedules → `/deep-research`
    finds → `/vet` judges → `/boss-learn` routes → re-stamp.
  - **Cadence alone provably fails, so events are first-class.** The checker's first run reported
    *25 fresh, 0 overdue* while `mcp.md` was already wrong; a quarterly cadence would have caught it in
    October. Each domain carries event triggers (a spec revision, a new frontier model, a breach, a host
    deprecation) that fire a refresh regardless of the date.
  - **This sweep hunts for what's WRONG, not just what's missing** — the real difference from
    `/humane-refresh`, which mostly adds to a catalog. `boss sync` pushes stale guidance into live
    projects continuously, so *"we said X and X is now wrong"* is the highest-value finding a sweep can
    return. `/vet`'s NO-bias applies to **additions, not reversals**; skepticism that only protects the
    status quo is how a shelf rots. And practices get re-stamped **even when nothing changed** —
    "checked, still correct" is the deliverable.
  - **Internal-only**, alongside `/vet` and `/humane-refresh`. Nothing added to the founder-facing
    surface, which is under an explicit compose-and-subtract mandate (EVID-001).
  - **Named, not fixed** (queued in the audit): no `data-and-schema` or `testing` practice exists — that
    knowledge lives only inside the `db-architect` / `tester` agent prompts, which carry no provenance,
    no `/vet` pass, and no dates. Plus two cross-doc holes where BOSS already owns the answer: RLS is
    named as the signature vibe-coded breach class by `ship-it-live.md` and never mentioned by
    `db-architect`; *read the test diff harder than the code* lives in `git-workflow.md` and not in
    `tester`. Full audit: `docs/research/sessions/SESSION-2026-07-30-craft-staleness-audit.md`.


## 0.134.0 — 2026-07-30

- **The dormant hooks stop rotting, and start being findable (audit §C7) — plus RESUME splits from
  its own history (§B4).** Closes every engineering item from the v0.128.0 audit. Gate **129/0**,
  60 unit, judgment 0 STALE.
  - **🔴 `secrets-guard`, `memory-cue` and `auto-log` were never updated after scaffold.** They ship
    **unregistered on purpose** — a `PreToolUse` hook fires a process on every tool call, so the
    founder turns one on deliberately — and that decision is right. What was wrong is that they were
    in no manifest list, so `managedFiles` never saw them: written once at `boss new`, then frozen
    forever. **A security fix to `secrets-guard.js` would never have reached an existing project.**
    New **`optionalHooks`** manifest key syncs the FILE while leaving the registration alone, because
    the registration *is* the on-switch. Verified end to end: a deliberately-staled
    `secrets-guard.js` is repaired by `boss sync --apply` and is still not registered afterwards.
  - **Three new guards, each demonstrated to fire**: an `optionalHooks` entry must resolve to a real
    file; a hook that ships dormant but isn't declared is an error (*"boss sync will never update
    it"*); and a dormant hook that the template's `settings.json` **does** register is an error
    (a registered "dormant" hook fires on every prompt — the opposite of the design).
  - **`boss help hooks` — they were documented only inside the JavaScript.** The rationale, the cost,
    and the paste-in block lived in a comment header, which a non-technical founder (an explicitly
    targeted cohort) will never open. Worse, `/judge-traces` was advertised in `boss map` while its
    only data source stayed off with no discoverable way to know. Now a help **topic** — not a new
    command; BOSS has 48 skills and the standing instruction is compose, don't add — naming each
    hook's event, what it does, **what it costs**, and when it's worth it. Echoed in `boss map`'s
    footer and a new GUIDE.md section.
  - **`docs/RESUME.md`: 1,171 → 133 lines.** CLAUDE.md rule #1 says read it at the start of every
    session; at 1,171 append-only lines it cost more than the state it carried, so it had stopped
    being a briefing and become a log — and it had not been updated with v0.129 → v0.133 at all.
    Rewritten as current state + next tasks + open decisions + the standing procedure. **Nothing was
    deleted:** the release-by-release history and the completed roadmap moved verbatim to
    `RESUME-ARCHIVE.md` (gitignored dev workspace, like RESUME itself). The release gate's advisory
    length check now passes instead of nagging.
  - **4.4 (decoupling `src/` from `stages/*/template/`) was DECLINED, with the reasoning recorded**
    in the checklist rather than silently dropped. The harm it named — the CLI and hook disagreeing —
    was fixed at v0.132.0; what remains is a fallback path that announces itself and is tested. The
    only real decoupling would mean templates stop being literal files copied verbatim, and that
    literalness is what makes the scaffold inspectable. Trading it for one removed import is the
    speculative abstraction AGENTS.md rule #6 refuses. Re-open if a second consumer appears.

## 0.133.0 — 2026-07-30

- **Consolidation + two surprises removed (audit §D1, §D4, §E2).** No behaviour change a founder
  sees, except that one command now asks before it writes. Gate **129/0**, 59 unit, judgment 0 STALE.
  - **Finished the job `ui.js` started.** That module exists because `dim` had been defined
    byte-identically three times; four other helpers had drifted the same way. Now one each:
    **`src/frontmatter.js`** (was 4 near-identical parsers — `board.js`, `modes.js`,
    `insights.js`'s bare regex, each subtly different about quotes and blank keys) ·
    **`src/config.js`** (was 3 — `conscience.js` even re-implemented a `readCohort` that the hook
    runtime already exported *to that same file*) · **`src/args.js`** (was 3 flag parsers).
    Deliberately **not** merged with the hook lib's `yaml.js`: that one ships into a founder's repo
    and runs on every prompt, so it stays self-contained. Two implementations across a package
    boundary is a seam; four inside one package was an accident.
  - **`src/args.js` is its own module, not an export from `cli.js`.** The obvious move — export
    `parseArgs` from `cli.js` — created a real `cli → brain → cli` cycle that survived only on
    function hoisting. Caught before commit; small shared utilities belong at the leaves.
    The shared parser also fixes brain.js's copy, which assigned `undefined` to a trailing valueless
    flag, so `boss brain forget --before` degraded into a confusing error instead of a usage line.
  - **🔴 `boss learn` no longer writes into another repo silently.** It resolves the BOSS source
    checkout by name-matching the registry, then bumps *that* repo's VERSION, rewrites its
    package.json and prepends to its CHANGELOG — with no confirmation and no mention of which
    checkout it picked. A founder who names a project `boss` would have had their own repo
    version-bumped. It now **names the target and how it was resolved, and refuses without
    `--yes`** when the target isn't the directory you're standing in; the `selfHosted` registry
    flag is preferred over the name regex. Verified: from an unrelated directory it refuses and
    BOSS's VERSION and `library/` are untouched.
  - **Model profile recalibrated to Opus 5** (`.boss/model-profile.json`, profile_version 2). It had
    been pinned to `claude-opus-4-8` since 2026-07-02 while its own `reopen_on` list leads with
    *"new same-vendor model"* — caught by the audit, **not** by the standing discipline, which is
    the same root cause as the doc drift: a good loop wired to nothing. Model ids verified against
    the live session; routing shape unchanged (the judgment/volume split still holds). **Two things
    deliberately left open rather than guessed**, recorded in the file: per-token **pricing** was
    *removed* rather than carried forward stale or invented (this project's settings deny the
    claude-api skill, so no current price could be read from a real source), and whether the bare
    alias `model: fable` resolves on every Claude Code version a founder might run — it resolves
    here, and 8 shipped mentors depend on it, so a silent mis-resolution would quietly change which
    model coaches them. No regrade was needed or run: v0.132.0's voice extraction was byte-identical.

## 0.132.0 — 2026-07-30

- **The conscience-architecture release — one file that is only voice, and the CLI finally reads the
  runtime that will actually fire.** Audit §D2 + §A4. Gate **129/0**, judgment **0 STALE**, 59 unit.
  - **`moment-frames.js` — every word the conscience says, in one place.** `loop-runtime.js` had grown
    to 603 lines mixing three concerns: predicate evaluation, project-state I/O, and ~200 lines of
    authored prose in template literals. The prose is the one surface `voice-keeper` owns and the
    judgment evals voice-hash, and it was the hardest thing in the repo to find. Split out: **runtime
    603 → 453 lines**, voice in its own 179-line module that **imports nothing** (so it can never
    introduce a cycle and can be probed in isolation, which is exactly what `check-manifests.js` does).
    `JUDGE_MOMENTS` moved with it — *"does this frame ask the model to go read something?"* is a
    property of the frame, not of the predicate machinery. The runtime **re-exports** the voice, so
    every existing import site (the hook, the CLI, the eval runner, the manifest check) is unchanged;
    `boss sync` picks the new file up automatically (`managedFiles` already scans `hooks/lib/`).
  - **Proven byte-identical, not assumed.** A 50-string baseline (every moment × loop variant, the
    full cohort/brain/evidence matrix, the multi-signal path, `JUDGE_MOMENTS`) was captured before the
    split and diffed after: **zero differences → no voice-hash moved, no regrade needed.** That is the
    whole reason the extraction was done as a verbatim line-move rather than a retype.
  - **Recorded, not silently decided: why the frames stay JavaScript** rather than becoming markdown
    beside each loop spec (the audit's suggestion). Moments are **many-to-one** with loops (`coherence`
    is declared by both design loops), so per-loop markdown would duplicate the frame or need a lookup
    layer anyway; a per-project `docs/moments/*.md` would add 11 files to every scaffolded repo at
    exactly the moment the evidence says **subtract**, and would make founder-editable the text the
    judgment evals hash — a founder tuning their conscience would silently invalidate BOSS's own
    grading. And the frames interpolate, so they are functions, not documents. The rationale is in the
    module header; revisit if a founder ever needs to author a moment.
  - **🔴 `boss status --conscience` was describing a runtime the project doesn't run.** It always
    imported the **package's** `loop-runtime.js`, while the hook that actually fires runs the
    **project's** copy (written at scaffold, refreshed only by `boss sync --apply`). In any project
    behind its pin — **4 of 5 on this machine when the audit ran** — the command explaining the
    conscience was using newer predicate semantics than the conscience. It now loads the project's own
    runtime, falls back to the bundled one **and says so on screen** when a project has none, and
    never lets a load failure break an inspect command. Verified by patching a project's copy and
    confirming the CLI's output changed while the package's was untouched.
  - **`run()` and the conscience commands are async now**, so `bin/boss` awaits and converts any
    escaped rejection into a one-line error + exit 1 — without that, `boss conscience mute <typo>`
    would have degraded from a clean message into an unhandled rejection.
  - Two new tests lock the split: the voice module imports nothing, and the runtime still re-exports
    the voice.

## 0.131.0 — 2026-07-30

- **The unit suite — 3,414 lines of CLI finally get a deterministic floor (audit §D3).** BOSS ran two
  eval surfaces for the *conscience* (129 gate cases + a judgment replay) and **zero tests for `src/`**,
  which is why every bug in the v0.128.0 audit was one a dozen assertions would have caught. **57 cases,
  zero-dep** (`node:test` + `node:assert`, PRINCIPLE #4 intact), `npm test`, and wired into
  `npm run release` **first** — a red suite makes the rest of the gate's output noise. Not shipped to
  npm (`files` allowlist unchanged).
  - **Four files, chosen by where the bugs actually were.** `board.test.js` (the projection every other
    surface reads state through) · `conscience.test.js` (predicates, classification, and the voicing
    contract) · `scaffold.test.js` (the ladder + the non-destructive `adopt`/sync guarantees, where a
    break costs trust) · `cli.test.js` (exit codes and the cross-surface invariant — shelled out through
    `bin/boss`, because an assertion on an internal function would *not* have caught the headline bug:
    two surfaces each individually "correct", disagreeing with each other).
  - **Three cases are marked `REGRESSION` and name the shipped bug they lock**, and each was verified to
    actually catch it rather than merely assumed to. **§A1** — the old `/canvas/i` body match returns
    **1** on a fixture whose only canvas reference is the prose "run /canvas someday"; the new
    `canvassedIdeas()` returns **0**, and the CLI test additionally asserts board and insights resolve to
    the same *set*, not merely the same count. **§A2** — every manifest entry resolves to a file.
    **§A3** — injecting a loop with `drift_moment: totally-unvoiced` turns the suite red *and* fails the
    release gate; removing it goes green again (both layers demonstrated, not assumed).
  - **The invariants worth naming**, all of which the code already claimed in a comment and none of which
    was enforced: a loop with no `drift_moment` is structural and never fires · a non-`hook` runner never
    auto-fires · **an empty project is silent** (the most important case) · a malformed predicate fails
    closed rather than throwing · `composeContext` is byte-identical with no brain/evidence/cohort (the
    property that keeps the judgment evals stable) · `appendMarkedBlock` and the settings merge are
    idempotent · `applyStageSafe` never clobbers a founder's file · no unsubstituted `{{PLACEHOLDER}}`
    may ship · `NO_COLOR` leaves no escape sequence in a pipe · help columns share one start column.
  - **Found while writing them:** `docs/PATTERNS.md` carried the same stale eval count the README did
    (**105**, actual **129**) and undercounted the judgment surface (**24**, actual **43**) — the exact
    §B1 drift class, in the doc that describes BOSS's *engineering rigour* to other builders. Corrected
    to three surfaces, and the release gate now checks **every** doc that quotes the gate's number rather
    than just the README. PATTERNS.md also gained the honest limit it was missing: *coverage is not the
    same as a loop that runs* — 56 releases of good evals with no gate wiring them to the release.

## 0.130.0 — 2026-07-29

- **The legibility release — every surface a founder actually reads, and the wall that contradicted
  PRINCIPLE #2.** Second pass from the v0.128.0 audit (REVIEW-2026-07-28 §C). Composes and subtracts;
  **adds no new command or skill.** Gate **129/0**, judgment **0 STALE**.
  - **🎯 `boss map` no longer hands an empty Quickstart project a wall of 29 verbs it can't run.**
    The "One unlock away" block printed *every* skill of the next rung — for MVP that was 29 entries,
    making the map **68 lines, ~2/3 of it unavailable**. That is premature ceremony rendered as text
    (PRINCIPLE #2 inverted, on the surface whose whole job is orientation) and a direct hit on
    [[EVID-001]]: *"hard to gauge where I am"* and *"worried about bloating my app."* A rung now
    declares a **`headline`** in its manifest — the few skills worth naming at the transition (MVP:
    `/spec` `/smoke` `/pretotype` `/close`) — and the rest fold into `… +24 more when you get there`.
    **`boss map --next` opens the full list** whenever the founder actually wants it. Map: **68 → 45
    lines**; nothing removed, only deferred to the moment it's asked for. `check-manifests.js` guards
    `headline` against drift (a stale entry would silently shrink the preview to nothing).
  - **`boss status --conscience --verbose`** printed the state word twice (`⚠ capture-loop  open` /
    `open — would close when: …`) with the detail line starting at the same column as the glyph, so a
    14-loop project read as 28 flat lines. State appears once; detail is indented under its loop.
  - **`boss help`** column alignment: three rows overran the 30-wide command column, so their
    descriptions started one space in while every other row's started at column 35 — in the first
    thing a new user sees. Now 34.
  - **`boss unlock v9`** answered with internal stage ids (`L0-quickstart, L1-mvp, …`) while
    `boss help unlock` documents the words it actually takes. Now `quickstart | mvp | v1 | scale`.
  - **`boss board --blocked` / `--next`** clamp long titles to the column instead of padding to it,
    so the flag column stops drifting on a 52-char title.
  - **`.boss/board.html` is now gitignored in the scaffold** — a generated projection was committing
    and churning a 200-line diff every time the board moved.
  - **`/judge-traces`** told founders to enable `auto-log` by consulting `library/hooks/auto-log.js`
    — a path that exists only in the BOSS package, never in their project. Points at
    `.claude/hooks/auto-log.js`, which is actually there.
  - **Two dead links in `registry/CHANGELOG.md`** pointed into the gitignored `docs/dossier/` and
    shipped to npm as 404s (CHANGELOG is in `package.json#files`). Delinked to plain paths marked
    local-only; the prose is unchanged. Public-doc link integrity now verifies clean end to end.

## 0.129.0 — 2026-07-29

- **The release gate, and the four shipped bugs it immediately caught (from a full start-to-finish audit at
  v0.128.0 — code · UX · docs · helpers).** The audit's central finding wasn't code quality; it was that
  **BOSS already had the right de-rot loops and none of them were wired to anything.** `gen-docs.js` and
  `check-wayfinding-drift.js` both worked, both were manual npm scripts, and both had therefore been
  reporting real drift into an empty room for **56 consecutive releases**. That is precisely the failure
  BOSS exists to catch in a founder's project — a system growing faster than the loops that check it — so
  this release turns the conscience inward before adding anything else. Gate **129/0** throughout.
  - **New `npm run release`** (`scripts/release.js`) — the one gate a release has to pass: VERSION ↔
    package.json · manifest wiring · generated docs regenerated *and* current · GUIDE.md wayfinding
    (strict) · no stale "not authored yet" claim about an authored mode · the README's own eval-count claim
    checked against the actual gate output · the eval gate. Plus two advisory reports it refuses to gate on:
    the **standing context budget** (≈8,140 tokens of skill/agent descriptions at full unlock — BOSS ships
    `context-discipline.md`, so it measures itself against it) and **RESUME.md length**. `--fast` skips the
    eval gate. Every check here earns its place by having already caught a real shipped bug — no lint theater.
  - **New `npm run check:manifests`** (`scripts/check-manifests.js`) — asserts every manifest
    agent/skill/hook/loop entry resolves to a real file, that no template file is unclaimed (an unclaimed
    file never syncs), and that **every loop's `drift_moment` has an authored voicing frame** — probed by
    *calling* the runtime, never against a hand-kept list of moment names (a parallel list is the same drift
    bug one level up). `check-wayfinding-drift.js` gained `--strict`; interactive runs stay a nudge, because
    a check that fails a commit is the ceremony BOSS refuses — only the release path gets teeth.
  - **🔴 FIXED: the `coherence` conscience moment had no voicing frame at all** — caught by the new check
    within a minute of it existing. `design-tokens-loop` (MVP) and `design-drift-loop` (V1) both declare
    `drift_moment: coherence`, both are `runner_type: hook`, and the moment fell through to the generic
    tail — so a founder whose design was drifting got the literal string *"signal warrants attention."*
    injected into their session. **This is the 47-blues failure the README leads with**, and PRINCIPLE #3's
    only hook moment. Frame now authored, branching on which loop fired (MVP = no token system yet; V1 =
    tokens exist but raw hex is back), with the judgment the predicate can't make — *is a real interface
    forming, or is this one component / a `/prototype` you'll throw away?* — restraint-first, cohort-aware,
    and explicitly refusing to propose a rewrite (the fix is the next component, not the last ten).
    Added to `JUDGE_MOMENTS`. The runtime **keeps** its generic fallback deliberately: a founder must never
    lose the conscience mid-session over an authoring mistake. The release gate is where that fails now.
  - **🔴 FIXED: `boss insights` reported a fabricated "canvassed" count.** It counted an idea as
    pressure-tested on a bare `/canvas/i` substring match against the file *body*, so the near-universal
    "next step: run `/canvas`" counted. On this repo it reported **38 canvassed of 55 ideas where 0 canvases
    exist**, and disagreed with `boss board` on the same files in the same second. Now derived from a single
    exported `canvassedIdeas()` in `board.js` — the same bar the Taking-shape column uses (a real
    `IDEA-NNN-canvas.md` whose riskiest-assumption line is actually filled in). Same fix caught **a second
    inflation**: `-canvas.md` files matched `/^IDEA-\d+/` and were counted as ideas. A project-level
    `CANVAS.md` now reads as its own `+venture canvas` marker instead of being fudged into the count —
    "the project has a canvas" and "N ideas were each pressure-tested" are different claims.
    This mattered more than its line count: `insights` is the surface that prints *"measures graduation,
    not activity"* and *"facts from real dates; never a score."*
  - **🔴 FIXED: L3-scale declared an `operate-loop` that did not exist.** `boss unlock scale` stamped it into
    every project's `.boss/manifest.json`, and it failed silently in both directions (`planSync` skips
    missing sources; `loadLoops` only reads files that exist). **Dropped rather than authored** — a
    conscience moment needs a real predicate from a real symptom, and no project has hit one, so Scale now
    ships **zero hook loops on purpose** and the moment is demoted to trigger-gated alongside slices 3–5.
    The L3 README had claimed "deferred surfaces are named in the summary, not faked into the roster";
    it now says what actually happened.
  - **Docs honesty pass.** README: the *"they never drift"* claim about the generated docs corrected (with
    the 56-release story kept, not buried) · *"Scale is stubbed"* → all four modes authored, Scale's later
    surfaces trigger-gated · *"105 passing"* → **129** (and the gate now checks this claim itself) · install
    leads with `npx bossbuild` / `npm i -g bossbuild` / `brew install ajeshh/boss/boss`, live since v0.97.0
    but never written down, with the clone path moved to a contributor note. **GUIDE.md** gained a real
    **Scale** rung and a new **"After you ship"** section covering the 11 post-launch skills that shipped
    v0.112→v0.127 into no walkthrough at all (`/ship` `/landing` `/measure` `/pmf-check` `/retain`
    `/onboard` `/roadmap` `/first-dollar` `/monetize` `/trust` `/incident`) — grouped as their own arc
    rather than padding the MVP rung, since operating a shipped product is a different job from building it.
    `docs/CHEATSHEET.md` + `docs/SKILLS.md` regenerated from v0.72.0 → current.
  - **Smaller:** `computeConfidence` was called with three arguments and declared with two (`exit` silently
    dropped) · `.js` edit permissions added to the local settings.
  - **Full audit + the remaining prioritized checklist** live in `docs/architecture/REVIEW-2026-07-28-full-audit.md`
    and `CHECKLIST-2026-07-28-improvements.md` (gitignored dev workspace). Still open and deliberately not
    bundled here: the `boss map` 29-skill wall (the highest-leverage [[EVID-001]] fix), moving conscience
    voice frames out of JS string literals into the loop specs, unit tests for `src/`, `/recalibrate` for
    Opus 5, and the subtraction pass on 48 skills.

## 0.128.0 — 2026-07-23

- **CLI usability + visual encoding (IDEA-055) — legibility, wayfinding, and a "you are here" orientation
  home.** The visual-encoding + wayfinding layer that [[EVID-001]] (BOSS's first real external founder signal)
  named as core to the offering — *"I can't tell where I am / did it work / what now."* **Composes and
  subtracts the existing surface; adds no new command or skill.** Conscience gate held **129/0** throughout
  (runtime untouched); reviewed by `designer` (encoding) + `voice-keeper` (strings). Four commits
  (`dd70947` · `f3fa1e4` · `5dc93a3` · this bump).
  - **New `src/ui.js`** — the one terminal-styling module (`dim/bold/ok/warn/err`), zero-dep raw ANSI, TTY +
    `NO_COLOR` + `FORCE_COLOR` aware. Replaced the `dim` helper that was defined 3× byte-identical.
  - **Colored the three states that matter** — success green, warnings yellow, errors a red `Error` frame;
    **bold section headers** across map/board/status/insights/brain/team. One accent per state, and color is
    always the *third* channel (glyph + word stay), so `NO_COLOR` / a pipe / a screen reader loses nothing.
  - **Grouped `boss help`** (Start here / Everyday / Conscience / Keeping current) + **`boss help <command>`**
    per-command detail + **`boss help symbols`** glyph legend. **Unknown command → did-you-mean + exit 1**
    (was: a silent full-manual dump). `(in Claude)` / `(in terminal)` cues distinguish the two command languages.
  - **`boss status` is now the orientation home** — leads with a **"you are here" ladder** (Quickstart → MVP →
    V1 → Scale) + **`Building now:`** (the one thing in flight) + **`Recent headway:`** (last shipped FEAT +
    how long ago — the *positive/progress register* BOSS lacked), then version metadata. **`boss map`** shares
    the same ladder; **`boss board`** gained a top **`on now:`** anchor. Map glosses now break at word
    boundaries (no more mid-word cuts).
  - **`boss status --conscience`** got progressive disclosure (a calm summary + `--verbose` for the full
    per-loop breakdown) and an honest empty-state; the muted-moments surface dropped its lone color-emoji.
  - **Fixed `boss board` vs `boss insights` disagreeing on "building"** — insights now reads the *same* board
    projection (frontmatter is truth), so the two can never diverge again.

## 0.127.0 — 2026-07-23

- **`/trust` skill + a privacy pre-flight in `/ship` — earn trust honestly, without the SOC2 theater (POST-LAUNCH
  build #8, JOB 8; closes the IDEA-012 privacy backlog).** The AI-specific, load-bearing trust set, in the order
  that actually matters. **Binding:** a `/trust` skill (L1, the runner) + the privacy/compliance *conscience
  moment* delivered as a **pre-flight bullet in `/ship`** (alongside secrets + authz) — going live is the moment
  user data starts flowing, often *to a model provider*, so the deploy gate is the strongest JIT point; skill-
  layer, so **no hook, no gate eval change** (the IDEA-041 precedent; a privacy *hook* would need a gate-safe
  artifact, and `.boss/cost-log.jsonl` is now taken by margin-trap's own fixtures). **`/trust`** walks: a
  **data-minimization privacy policy** (what/why/how-long/how-to-delete — always load-bearing once PII flows), a
  **subprocessor list auto-derived** from what the app actually uses (LLM provider, vector DB, observability), the
  **config act founders skip** — *"did you actually turn on the provider's training opt-out?"* (an act, not a
  promise — writing "we don't train on your data" while the provider default does is the breach-headline gap;
  **"the AI did it" is not a legal defense**, Air-Canada), and a **public trust-page stub**. **Explicitly DEFERS
  SOC2 / ISO / DPIA** until a *named* enterprise deal demands them (the ~6–9-month clock — not for a 50-user app;
  points at Vanta/Drata only *when* SOC2 is real). Bright line: pointers to a real lawyer, never legal advice.
  Humane (PRINCIPLE #6): privacy as respect; data minimization as the cheapest *and* kindest posture (the data you
  don't collect can't leak); the trust page as honesty. `/first-dollar` hands off ToS/privacy here; `/monetize`'s
  data-export offboarding lives here. Registered in the L1 manifest; skill-layer only → **gate holds 129/0**,
  judgment unaffected. `/tmp`-verified (`/trust` + the `/ship` privacy bullet land, mapped, 0 placeholders;
  registry pruned).

## 0.126.0 — 2026-07-23

- **`monetization-in-practice` practice + `/monetize` skill + `/cost-review` gross-margin band (POST-LAUNCH build
  #7b, JOB 4 — completes build #7, and closes the margin-trap loop).** The layer nobody owned: `mentor-business`
  is the pricing *menu*, `/first-dollar` is the *first sale*, and this is **running the money once customers
  exist.** **UP — `library/practices/monetization-in-practice.md` + DOWN — `/monetize` skill (L1)**, four moves,
  premature pre-revenue: **behavior-triggered upgrades** (surface at a moment of *value* — a limit hit while
  succeeding — not an ever-present nag), **dunning/involuntary-churn recovery** (20–40% of churn and the cheapest
  revenue — the customer already chose to stay; *plumbing, point at Stripe Smart Retries, don't build a billing
  system*; the same bucket `/retain` flags as "the curve dies at the wallet"), **the humane price-raise** (raise
  on *new value*, with an **escape clause** — grandfather or real 30–60-day notice + a downgrade/opt-out/leave-
  with-data path, communicated plainly by you; never a stealth raise), and **expansion only when usage tracks the
  customer's success** (never lock-in or struggle — the margin-trap's cousin, the PRINCIPLE #6 line). **`/cost-
  review` now writes a gross-margin band** — cost-per-active-user vs price, gross margin % (flag >10–15% of ARPU),
  the **Evergreen-Ratio** (cached ÷ total input tokens = prompt-caching leverage), and the humane struggle check
  (share of spend that's retries) — which **answers and closes the margin-trap conscience moment** (its exit is a
  cost review that examines margin; now the tool writes exactly that). Humane (PRINCIPLE #6): dunning not
  dark-patterns; **graceful offboarding** (one-click cancel, clean data export, no roach-motel — ties to
  `/trust`); expansion aligned to the customer's success; honest price changes. Refuses a billing/dunning system,
  an MRR dashboard, upsell-nag mechanics, dark-pattern cancellation, and engagement-punishing usage pricing — each
  named. Registered in the L1 manifest; skill+practice+template layer only → **gate holds 129/0**, judgment 0
  STALE. `/tmp`-verified (`/monetize` + the gross-margin band land, mapped, 0 placeholders; registry pruned).
  **Build #7 (monetization-in-practice + IDEA-050) complete.**

## 0.125.0 — 2026-07-23

- **`/first-dollar` (IDEA-050) — from "will anyone pay?" to "someone is paying" (POST-LAUNCH build #7a, JOB 4).**
  The conscience's founding question is *"will anyone pay?"* — and BOSS had **nothing for the moment someone
  actually will.** This closes it: the sharpest JIT moment in the lifecycle, and the **highest-grade evidence
  event BOSS ever sees** (a paying customer is `commitment`-grade EVID *by definition*). **UP —
  `library/practices/first-dollar.md` + DOWN — `/first-dollar` skill (L1).** Fires only when **someone has
  actually said yes** (a real WTP signal) — pre-revenue it sends you to `/interview` to *get* the yes, not build a
  rail for a customer who doesn't exist. Walks **five deferrable moves**, detecting + skipping what exists:
  **entity** (lawfully invoice — pointer to counsel), **ToS + privacy** (hands off to `/trust`), **payment rail**
  (the `/ship` pattern applied to money — *cheapest reversible: a payment link before a billing system*; don't
  build subscriptions before ~3 customers), **refund posture** (decided *before* the first request, calm), and
  **the first price** (one number said out loud — forces it now so free-forever-creep fear doesn't defer it;
  `mentor-business` owns the menu). Records price + refund as `/decide` DECs, then **writes the commitment-grade
  EVID** so the first dollar doesn't evaporate like the interviews did — after which the conscience shifts
  register **validate → deliver** (no new hook; the IDEA-045 evidence eye already reads the ledger). **Bright
  line: pointers to professionals, never legal/tax advice; records the EVENT (evidence), never the STREAM (no MRR
  dashboard — the payment provider's job).** Humane (PRINCIPLE #6): charge honestly from the first dollar (no
  hidden fees / fake discounts / dark-pattern checkout — the precedent compounds); the refund posture is respect.
  Registered in the L1 manifest; skill+practice layer only → **gate holds 129/0**, judgment unaffected.
  `/tmp`-verified (lands on unlock, mapped, 0 placeholders; registry pruned).

## 0.124.0 — 2026-07-23

- **Feature-level `/sunset` — kill one zombie feature honestly (POST-LAUNCH build #6, JOB 5).** Extends the
  existing whole-project `/sunset` (IDEA-044) with a second scope on the *same verb* — "end something honestly" at
  both scales. **`/sunset`** (no arg) = the project post-mortem as before; **`/sunset FEAT-007`** = end one
  feature. The failure mode it treats: products accrete features and never shed them, so a *zombie* (shipped, then
  quietly unused) sits costing maintenance, widening the attack surface, and confusing new users — *subtraction is
  a feature*. Four moves: **(1) usage-validate it's actually dead** (kill on `/measure` data, not a hunch — quiet
  ≠ dead; and the stuck-in-build FEAT case ends because it's *not finishing*, not because it's unused); **(2)
  guard the segment/commitment exception** (the load-bearing check — a low-usage feature can be a *contract*, or
  the workflow the one enterprise account depends on; low usage ≠ safe to remove; migrate first or don't kill);
  **(3) draft the honest user message** (real notice period, a path out, no "we're improving your experience"
  euphemism, no data-hostage removal — the `ai-ux-patterns` anti-patterns, refused); **(4) harvest UP + remove**
  (mark the FEAT `retired` with the usage evidence + reason; small reversible commit; nothing hidden). This is
  exactly what the **`focus` circuit-breaker** points at when it offers to end a stuck FEAT rather than leave it
  70%-done — the offer now resolves precisely. Humane (PRINCIPLE #6): honest deprecation, guard the quiet-but-
  critical cohort, subtraction as care for everyone left. Skill extension (already manifest-registered); no hook
  change → **gate holds 129/0**, judgment unaffected. `/tmp`-verified (feature-level section lands, 0 placeholders;
  registry pruned).

## 0.123.0 — 2026-07-23

- **`/roadmap` — weigh what to build next into a small bet-list + a mandatory NO-list (POST-LAUNCH build #5, JOB 5;
  Tier 2 begins).** The fuller version of `/spec`'s "loud ≠ important" check: that fires on a *single* request at
  decide-time; this weighs *all* the signal at once. Deliberately **not** a persistent roadmap — BOSS refuses the
  Gantt/backlog-you-tend; this produces a dated snapshot you *use and discard*. Weighs **what users say** (the
  `--feedback` register — `stated-pain`, the weakest grade) against **what users do** (`/measure`, retention,
  churn via `/retain` — `observed-behavior`/`commitment`), and **behavior wins when they disagree.** Scores each
  candidate by **Confidence = the EVID grade** (Itamar Gilad's Confidence Meter mapped onto BOSS's
  stated-pain→observed-behavior→commitment ladder), with **RICE-reach OFF by default** (reach-weighting optimizes
  for the loud majority-of-noise over the right users). Produces a **small Shape-Up bet-list** (2–4 bets, fixed
  appetite — Singer) plus a **mandatory NO-list** ("no is the default; the NO-list is the load-bearing half, and
  where the silent-majority discipline lives"). Pre-PMF it defers to `/pmf-check` — the only honest roadmap before
  fit is "find fit" (Perri's build trap). Humane (PRINCIPLE #6): serves the users who drive value, not whoever
  shouts; kill honestly (a zombie feature is a `/sunset` candidate, not a roadmap item); never an engagement
  roadmap. Writes a dated `docs/roadmap/ROADMAP-<date>.md` (snapshot, re-run when signal moves — **not** a
  scheduled cadence); promote a bet with `/spec`. `/spec`'s loud≠important note now points forward to it.
  Registered in the L1 manifest; skill-layer only → **gate holds 129/0**, judgment unaffected. `/tmp`-verified
  (lands on unlock, mapped, 0 placeholders; registry pruned).

## 0.122.0 — 2026-07-23

- **`activation` practice + `/onboard` skill — designing the path to the aha-moment (POST-LAUNCH build #4, JOB 1;
  completes Tier 1).** BOSS *read* the activation metric (`/measure`) but was silent on *designing* activation —
  the highest-leverage number in the funnel (activation > acquisition; fix it and every downstream cohort lifts at
  once — Winters). The UP/DOWN pair, and the top-of-curve fix `/retain` already routes to. **UP —
  `library/practices/activation.md`:** activation = the **first-session success rate** (not signup, not
  "engaged"). **Derive the aha-moment from data** (Bangaly Kaba's best-retained-vs-churned method — not a
  whiteboard guess; the Facebook "friends in N days" number is an *illustration of the method*, not a template;
  for an AI product the aha is a first *successful* output the user keeps, tied to TCR). **Shrink time-to-value**
  (cut every step signup→value; seed a **"magic first run"** so the first output is good before the user works —
  the empty state is where activation dies). **Concierge onboarding shamelessly** (Superhuman white-glove;
  do-things-that-don't-scale — Graham; it doubles as `/interview`, and the scalable flow is *extracted from* the
  hand-done one). **DOWN — `/onboard` skill (L1):** the runner — n<10 gate ("watch them by hand"), derive-the-aha,
  TTV-shrink + magic-first-run, the concierge plan, a dated `docs/onboard/ONBOARD-<date>.md`, one activation metric
  handed to `/measure`. **Humane (PRINCIPLE #6): activation = getting them to *success* fast, not *hooked* fast** —
  refuses fake progress bars, gamified "complete your profile" nags, forced tutorials, streaks bolted onto
  first-run, guilt at the skip button (the `ai-ux-patterns` catalog), and names them. Ties: activation-failure is
  `/retain`'s top-of-curve decay; the activated cohort is exactly who `/pmf-check`'s 40% test surveys. Registered
  in the L1 manifest; skill+practice layer only → **gate holds 129/0**, judgment unaffected. `/tmp`-verified
  (lands on unlock, mapped, 0 placeholders; registry pruned). **This completes Tier 1 of the post-launch program**
  (#0 `/pmf-check`, #1 margin-trap, #2 loud≠important, #3 retention/`retain`, #4 activation/`onboard`).

## 0.121.0 — 2026-07-23

- **`retention` practice + `/retain` skill — fixing the decaying curve, not just reading it (POST-LAUNCH build #3,
  JOB 2 — the #1 post-launch job).** The map's sharpest gap: `/measure` + `analytics-for-ai-products` *read* the
  retention curve; **nothing helped *fix* it.** This closes it with the UP/DOWN pair. **UP —
  `library/practices/retention.md`:** the judgment that there is **no retention hack** — the fix is always the
  product, and *where the curve dies* tells you *which part*. Read the curve's **shape** first (decaying-to-zero =
  a `/pmf-check` fit problem, not a retention one; flattening = the shape of fit, raise the plateau); **rebase past
  the week-2–5 AI-tourist wave to the Month-3 cohort** before diagnosing; then the **three decays** — activation-
  failure (dies at the top → `/onboard`, the highest-leverage lever), engagement-decay (dies in the middle → the
  product + roadmap + `/interview` the churned, fed by *churn* not the loudest survivor — ties to `/spec`'s "loud ≠
  important"), involuntary/mechanical (dies at the wallet → **dunning: point at Stripe, don't build billing**;
  20–40% of churn and the most recoverable). **Quality + roadmap ARE the retention strategy** (for an AI product:
  output quality + the eval loop). **DOWN — `/retain` skill (L1):** the runner over that diagnosis — n<10 gate
  ("go talk to them"), shape read, cohort rebase, the where-does-it-die decision tree, the routed fix, dated
  `docs/retain/RETAIN-<date>.md`. **Humane (PRINCIPLE #6): a user who succeeded and left is a *win*; resurrection
  is invitation, never winback-by-dark-pattern; involuntary-churn recovery is the one pure-gain move.** Refuses
  churn-prediction ML, retention dashboards, streaks/guilt-nags, and building a billing system — names each. A
  pointer from `/measure` hands off to `/retain` on a sliding curve. Registered in the L1 manifest; skill+practice
  layer only → **gate holds 129/0**, judgment unaffected. `/tmp`-verified (lands on unlock, mapped, 0 placeholders;
  registry pruned).

## 0.120.0 — 2026-07-23

- **`/pmf-check` — the product-market-fit verdict, the organizing gate the whole journey turns on (POST-LAUNCH
  build #0, JOB 2; the highest-leverage post-launch verb).** BOSS measured the *inputs* to PMF everywhere
  (`/measure` reads the retention curve, `/interview` + `/evidence` hold the demand signal, `/ai-cost` holds the
  economics) but **never rendered the verdict** — the single biggest post-launch gap. This new L1 skill reads what
  BOSS already holds and calls it: **pre-PMF / at-PMF / post-PMF**, from three cheap lenses — the **Sean-Ellis
  40%-test** (*only* on users who reached core value — the detail founders skip), **retention-curve flattening**
  (a plateau = fit; decay-to-zero = none; rebase past the week-2–5 AI-tourist wave to the Month-3 cohort), and the
  **pull-vs-push gut-check** (the one you can't fake). **It DEFAULTS to pre-PMF** — you earn your way off it, and
  ambiguity resolves to "not yet, keep talking to users, don't scale" — because **scaling before PMF is the #1 way
  startups die** (~70% premature-scale; Startup Genome). The verdict is **voiced through the seller→operator→leader
  role ladder** (`founder-role-shifts`): pre-PMF you're still a *seller* (the job is fit, not growth), at-PMF is the
  *seller→operator* transition, post-PMF is the *operator* — **and only post-PMF licenses the leader's work** (scale/
  hire/raise). At **n<10 it says no** ("you can't measure fit yet — go talk to them", points at `/interview`).
  Humane (PRINCIPLE #6): PMF is measured on user *success* not engagement (the 40% means losing it would *hurt*
  them — a high-DAU thing they can't quit is a hook, not fit); don't scale a thing that isn't yet helping people.
  A **verdict, not a dashboard** — no PMF-score-over-time meter, no second source of truth; writes one dated
  `docs/pmf/PMF-<date>.md`. Registered in the L1 manifest; `mentor-venture` now points at it for the *"are we there
  yet / should we scale?"* question. Skill-layer only → **gate holds 129/0**, judgment unaffected. `/tmp`-verified
  (scaffolds on `boss unlock mvp`, `boss map` lists it, 0 placeholders). **The honest line holds: only founder
  contact moves the risk — and this verb's entire job is to send you back to that contact until the fit is real.**

## 0.119.0 — 2026-07-23

- **The "loud ≠ important" conscience voicing — the `drift` twin at decide-time (POST-LAUNCH build #2, JOB 5).**
  Restraint (`/spec`'s Moment #4) is the *pre-launch* "is it worth building?" check; this is its **post-launch
  sibling**, firing on a different symptom: **the source of a FEAT is a user request.** Post-launch the trap flips
  from "no evidence" to "the *wrong* evidence" — building around the **loudest few** while the **silent majority**
  (who never wrote in) and the **quiet churn** (who just left) go unheard. Wired into `/spec` as a voicing (not a
  hook — the "vocal minority" predicate doesn't cleanly exist, so an auto-firing hook would over-fire; the IDEA-041
  `/ship` precedent, and the SESSION doc says explicitly "fires at `/spec`"). **Gated on two symptoms** — real
  users exist (a `--feedback` register / EVID ledger / live `/measure` read) AND this FEAT traces to a
  request/complaint, not a founder-named bet (if it's the canvas riskiest-assumption backed by broad evidence,
  that's `drift`'s job — stay silent). Asks the specific version of *how many actually asked, are they your active
  core or a vocal few?*, reframes a request as a **`stated-pain` EVID** (the weakest grade; the quiet majority's
  observed behavior outranks a loud request), and points at the two cheaper reads before the build — `/measure`
  (behavior over volume) and `/interview` (talk to the silent + the churned) — plus `mentor-venture`. Suggestive,
  once, never a gate; cohort-aware. **Enforces the rule the `/triage --feedback` register already states** ("a
  feature request → a stated-pain EVID, *never* a spec") — the register now forward-points to the `/spec` check,
  so the rule has teeth at decide-time. **Humane (PRINCIPLE #6): protect the silent majority who drive the value**
  — the anti-pattern is a roadmap captured by whoever shouts. Skill-layer only (no hook, no gate eval change —
  **gate holds 129/0**; judgment unaffected). The fuller signal-vs-behavior weighing into a bet-list is the
  `/roadmap` job, captured for Tier 2. **Honest line unchanged: only founder contact moves the risk.**

## 0.118.0 — 2026-07-23

- **The `margin-trap` conscience moment — the post-launch cost→price bridge (POST-LAUNCH build #1, JOB 4).**
  First build of the post-launch program (the operator→leader arc). BOSS's cost loops all watched spend against
  a *budget*; none watched it against the *price*. This moment closes that. It fires when a project has a real
  per-call cost ledger (`.boss/cost-log.jsonl`) **and** the founder is operating — ≥1 cost review with real
  spend on file — but **no review has looked at the margin yet**. A cheap predicate gate (ledger exists + a
  review with `Total spend:`) fronts a judgment the regex can't make: the model reads a bounded slice (the
  latest review, a tail of the ledger, and wherever a price/ARPU lives — the canvas WTP cell, a pricing `DEC`,
  or `docs/ai-cost-budget.md`) and judges **two axes** — (a) *margin*: is cost-per-active-user a dangerous
  fraction of the price (~10–15%-of-ARPU heuristic), with the heaviest users driving it (a16z/Tunguz: AI GM
  50–65% vs SaaS 70–85%; Copilot $10 price / ~$20 cost)? and (b) *humane (PRINCIPLE #6)*: is a big share of the
  cost **retries/regenerations** — the product working *less*, the business paid *more* when the user
  struggles? If neither, it **stays silent** (a healthy margin earns quiet, like a validated risk quiets
  `drift`); pre-revenue it never opens (no price to compare against — Principle #2). Points at `/cost-review`
  (the gross-margin band) and `mentor-business`; suggestive, once/session, never a gate. Exit: a review that
  examines the margin closes it. New `margin-trap-loop` (L1) + moment frame in the conscience runtime (a JUDGE
  moment — bounded read). Predicate-only at the gate: no prior fixture creates `.boss/cost-log.jsonl`, so the
  **122 baseline held byte-identical; +7 new margin-trap cases → gate 129/0**. Judgment evals unaffected (new
  moment, no transcripts → **0 STALE**). Registered `margin-trap-loop` (and the previously-omitted `focus-loop`)
  in the L1 manifest. Zero-dep; skills/hooks-layer only. **The honest line still holds: none of this moves the
  riskiest assumption — only founder contact does.**

## 0.117.0 — 2026-07-23

- **Three JIT skill extensions — the sweep's small tail, closed (2026-07-23 sweep).** Small, non-ceremony
  additions to existing L1 skills; the last deferred items. **`/ai-cost`** gains the **prompt-caching mechanics**
  (the highest-ROI lever): cache-read ≈0.1× (90% off), break-even ~2 reads, the static-first-then-dynamic
  ordering the mechanism forces, and verify-via-`usage.cache_read_input_tokens` — reach for it before
  downgrading models. **`ai-first-init`** Step 2 gains the **2026 native-strict-outputs update**: all three
  providers (incl. Anthropic) ship constrained-decoding structured outputs now, so the "re-prompt until it
  parses" reask loop is obsolete — prefer native `output_format`/`strict`, keep Pydantic/Zod for typed/semantic
  validation; plus a pointer to `mcp.md` for external tools. **`/evals`** gains the **online / production half**:
  score a sample of live traffic continuously, auto-curate failing traces into the set, the traces→evals→
  product-metrics loop — with the honest "offline eval can lie" caveat and a pointer to `/measure` +
  `analytics-for-ai-products`. Skill-layer only; `src/` untouched; gate 122/0. **This closes the entire
  2026-07-23 research sweep — nothing left deferred.**

## 0.116.0 — 2026-07-23

- **`/ship` gains a ship-dark / kill-switch offer — BUILD 6 complete (2026-07-23 sweep).** The other half of the
  feature-flags work: at the deploy moment, if the feature is **risky or AI-mediated**, `/ship` now *offers*
  (never imposes) to ship it **behind a flag** — dark or at a small %, with a **kill switch** that flips in
  seconds. Why it lives in `/ship`: a flag is the **fast application-layer rollback** a code-deploy rollback
  *doesn't* give — an AI feature failing non-deterministically for the whole user base needs a toggle (seconds),
  not a redeploy (minutes). **Env-var-first** (a kill switch is one `if (env)`; no platform required), and "flag
  the model, not just the feature" so a bad model swap CI/CD never sees rolls back without a deploy. A
  check/offer, once, situation-not-person — skip for a plain static ship; never a gate (conscience-not-censor,
  consistent with `/ship`'s pre-flight shape). `ship-it-live.md` gains a "flag = the fast rollback the app layer
  gives you" subsection. Skill + practice; `src/` untouched; gate 122/0. **BUILD 6 (feature flags + finishing) is
  now complete** — the practice (v0.111), the `focus` circuit breaker (v0.115), and this `/ship` offer (v0.116).

## 0.115.0 — 2026-07-23

- **The `focus` moment gains a finish-or-sunset circuit breaker (2026-07-23 sweep, BUILD 6 deferred slice — the
  careful conscience piece).** Closes the gap thread H named: `focus` caught the *pile* (≥4 building, 0 shipped)
  and asked "which one would you finish first?" — but had no forcing function for the *oldest stuck* item. Now,
  for the oldest item still aging in build (the board's `⌛` flag), the moment offers Shape Up's **circuit-breaker**
  cut — *finish it this session, or `/sunset` it honestly* — because a thing perpetually 70%-done is WIP, not a
  plan (and a feature flag left at 5% forever is the same trap; ties `feature-flags.md`). It **offers** `/sunset`,
  never pushes it — **IDEA-044's guardrail holds** (the conscience points at the honest ending from inside a
  moment that already fired; the founder chooses). Voicing-only: the `focus` frame in `loop-runtime.js` + the
  `focus-loop.md` Drift/Cite sections + Ryan Singer/Basecamp (Shape Up) added to attribution. **Predicate
  untouched → gate stays 122/0; `focus` has no judgment transcripts → no regrade** (drift/caution/capture/humane
  all GRADED, 0 STALE). No new hook, no new predicate (the aging flag is the trigger, finish-or-sunset is the
  response, `/sunset` receives it). **Still deferred:** the `/ship` ship-dark/kill-switch offer (BUILD 6's other
  slice).

## 0.114.0 — 2026-07-23

- **Retrieval — a ladder, not a vector database (2026-07-23 sweep, BUILD 5b; UP → `library/practices/retrieval.md`).**
  Thread F's "one thing to build" — the practice a founder most needs in order to *not* over-build. Its value is
  subtraction: **"RAG is dead" is a myth** (the naive version is dying, retrieval isn't), and the honest decision
  line is Anthropic's — **< ~200k tokens & static → skip RAG, put it in the prompt**; above ~500k, or needs
  frequent queries / low latency / citations → retrieve. Anchored on **context rot** (Chroma: usable window ≈
  60–70%, so long context ≠ free retrieval). **Rung 0 = "can Claude Code just grep this?"** (agentic retrieval
  in-repo, no vector DB — many founders' RAG need is smaller than they think). The ladder (dense → hybrid
  BM25+vector/RRF → rerank → graph/agentic, each earned on a real miss), the unglamorous defaults
  (**recursive-512 chunking**, **pgvector-until-it-hurts**, **recall@k before you optimize** — Jason Liu's
  inventory-vs-capability split), Anthropic's Contextual Retrieval as the standout, and **agent memory as the
  same ladder** (prompt → summarize → Claude's native memory tool → a framework only on a named wall; don't pick
  one off a gameable leaderboard). Library only; `src/` untouched. **Not committed at write time** (committed
  with this batch).

## 0.113.0 — 2026-07-23

- **Post-ship validation — `/measure` + analytics-for-ai-products (2026-07-23 sweep, BUILD 5; UP practice +
  DOWN L1 skill).** BOSS owned *pre-build* validation (`/pretotype`/`/evidence`/`/interview`/`/research`); this
  is the *post-ship* half. **UP** = `library/practices/analytics-for-ai-products.md`: the doctrine that classic
  analytics assumes deterministic output, an AI product violates it, so **model accuracy ≠ user success** — the
  metric vocabulary (Task Completion Rate = the AI north star, retained-character rate, edit distance,
  regeneration, containment, frustration index, **cost-per-*successful*-outcome**), the product-analytics ↔
  eval-loop convergence (traces → evals → product metrics; online evals on a sample of live traffic), and the
  **anti-surveillance clause** (measure graduation/loop-closure, NOT engagement/DAU — the humane differentiator;
  measure the product, don't surveil the human — [[IDEA-021]]). **DOWN** = a thin **`/measure`** skill (the
  `/pretotype` counterpart): a hard **n<10 gate** ("close this, go talk to your users"), ONE activation metric +
  ONE retention curve, **≤10 events** (kills analytics theater), the AI-specific metrics, and free/OSS/no-lock-in
  tooling (PostHog / Plausible / Langfuse-Phoenix; print+JSONL+spreadsheet for a first app). Extends `/evals` +
  `/ai-cost` toward online/product metrics, doesn't duplicate them; post-ship retention =
  `observed-behavior`/`commitment` **EVID**. Registered in the L1 manifest. Skill + library; `src/` untouched.
  **Not committed at write time** (committed with this batch).

## 0.112.0 — 2026-07-23

- **`/landing` — get a founder's first landing page out the block, on-brand and honest (2026-07-23 sweep,
  BUILD 3; UP practice + DOWN L1 skill).** BOSS uniquely holds the inputs (BRAND.md voice/positioning, the
  design tokens, the canvas Promises cell) and the founder is already *inside Claude Code*, so an on-brand page
  in-repo is the lowest-lock-in option in the 2026 landscape. **UP** = new `library/practices/landing-page.md`:
  the minimum-that-converts (descriptive headline = value prop, two-job subhead, one repeated CTA, proof in the
  eye-path, no nav, clarity-over-cleverness — Shapiro / CXL / Harry Dry / 37signals), the **product-page vs
  demand-page** split (the demand page *is* `/pretotype`'s fake door; a signup measures curiosity, not intent),
  the **anti-slop mechanism** (BRAND.md→copy, tokens-by-semantic-name→visuals, Promises→value-prop; beat the
  indigo-default; spend the saved hours on the 5% that's the brand), and the **persuasion-vs-manipulation** line
  (say-it-out-loud test; real deadlines only; the honest version *is* the high-converting one). **DOWN** = a
  thin **`/landing`** L1 skill that composes those surfaces — reads the brief (refuses blank generation), asks
  product-vs-demand, generates a real page in-repo, runs **`/red-team --humane`** by default (now scans the
  generated markup for injected dark patterns), hands off to **`/ship`**, and **hands off** CMS/visual-editing
  to Framer/Carrd/Webflow (BOSS gets the first honest page out the block, then points onward — not a website
  builder, not a CRO tool). Registered in the L1 manifest. Skill-layer + library; `src/` untouched. **Not
  committed at write time** (committed with this batch).

## 0.111.0 — 2026-07-23

- **Feature flags — "flag the model, not just the feature" + the finishing twin (2026-07-23 sweep, BUILD 6
  core; UP → `library/practices/feature-flags.md`).** Answers the founder's ask about toggling AI features and
  not drowning in half-built work. The spine is the AI-specific idea: with an AI feature the risky change is a
  model ID / prompt / temperature, which CI/CD can't see or roll back — so **put the model config in the
  flag** and get a **kill switch** that flips in seconds (AI fails non-deterministically, in prod, on the whole
  user base at once). Plus percentage-rollout-as-the-test, flags-as-the-prompt/model-A/B mechanism, rollout-as-
  cost-discovery (pairs `/ai-cost`), and **flag debt = unfinished work wearing a toggle** (retire-at-creation).
  The **JIT ladder is env-var-first** (a kill switch is one `if (env)`; a platform earns its place only for
  remote-toggle/user-bucketing — a 0-user founder needs neither). Names the **flags↔finishing** connection: a
  flag lets you ship a *thin done slice* instead of a 70%-done branch (the antidote to the vibe-coding
  graveyard), but a flag stuck at 5% forever is WIP wearing a toggle → *ship the slice, then roll to 100% or
  `/sunset` it*; and **"done" ≠ "the happy path runs."** Cross-links `git-workflow` (flags = how trunk merges
  unfinished work) + `ship-it-live` (the fast app-layer rollback). **DEFERRED (careful piece):** the `/ship`
  ship-dark/kill-switch *offer* and the `focus`-moment **finish-or-sunset circuit breaker** (touches the
  conscience voicing → needs judgment-eval cases; the gate-touching slice, deferred like other conscience-
  moment changes). Practice only; `src/` untouched. **Not committed at write time** (committed with this batch).

## 0.110.0 — 2026-07-23

- **Harness engineering + context engineering — the architecture story BOSS was missing (2026-07-23 sweep,
  BUILD 2; UP → practices + roster).** Two research threads independently flagged **harness engineering** as
  BOSS's biggest architecture gap, from Anthropic-primary sources. New **`library/practices/harness-
  engineering.md`**: the harness (init script, a failing-feature-list as the definition of done, self-
  verification before "done," a progress-log handoff, well-shaped tools / the Agent-Computer Interface) is an
  *artifact you design*, not a prompt — and BOSS already ships the rungs (`CLAUDE.md` → `/smoke` → `/spec`
  acceptance criteria → `RESUME`/`/close` → `/evals`+`/red-team`), so the win is naming the shape. Carries
  three durable stances: **the model is a dependency you don't control** (build assuming it improves; delete
  scaffolding it outgrew — ties [[IDEA-014]]/[[IDEA-028]]); **spec-driven development** (BOSS's `/spec` already
  *is* SDD — adopt the stance, reject Spec-Kit's multi-file ceremony); **Karpathy's verifiability thesis**
  (build the features with a verification signal first; the harness's job is to expand what's verifiable).
  **`context-discipline.md` promoted** from host-mechanics to the named discipline it serves — the **dumb
  zone** (~60–70% of the window is usable; context rot degrades even simple tasks — Chroma 2026), **intentional
  compaction**, **trajectory-poisoning restart**, the **five criteria** (relevance/sufficiency/isolation/
  economy/**provenance** — provenance doubles as the memory-poisoning defense). **Roster:** Dex Horthy +
  Shreya Shankar → `mentor-architect` (Shankar owed — the "Gulf of Specification" BOSS cites is hers).
  Practices + roster; `src/` untouched. **Not committed** (same parallel-session reconcile note).

## 0.109.0 — 2026-07-23

- **MCP decision practice — teach *whether MCP matters yet*, before wiring anything (2026-07-23 sweep, BUILD 4;
  UP → `library/practices/mcp.md`).** MCP became a durable standard in 2026 (Linux Foundation / AAIF, Dec 2025;
  every major vendor), but its security lags and the biggest-ever spec revision lands 2026-07-28. BOSS's
  differentiator isn't an integration guide — it's the JIT judgment a founder needs *first*: the **three
  unrelated shapes** (consume a server / **expose your product AS a server = a distribution decision** /
  build-on internally in the dev loop), each with its JIT trigger and "premature when," a `mentor-gtm` pointer
  for the expose-as-channel case, and the honest "a founder in Claude Code already has agentic retrieval for
  free — your MCP need is smaller than you think." Its security half **points at** `agent-security.md` (the
  confused-deputy mechanic shipped v0.108.0), doesn't restate it. **Updates RVW-019** (NOT-YET → the *standard*
  is durable; the registry + spec are not) and **defers the `/mcp` scaffolding skill** past the 2026-07-28
  spec. Practice only; `src/` untouched. **Not committed** (same parallel-session reconcile note as v0.108.0).

## 0.108.0 — 2026-07-23

- **Research-sweep hardening bundle — the humane + security catalog caught up to mid-2026 (2026-07-23
  sweep; UP into practices + `/red-team`).** Occasioned by a broad "rescan the experts + dark patterns +
  MCP + security + architecture" pass (7 research threads, adversarially verified). First routed increment,
  all judgment-aids, **no new gates**. **The headline:** AI code generators inject dark patterns into the
  components they write *unprompted* (Vaccaro et al., *Deception at Scale*, CHI 2026) — a vibe-coder ships a
  fake countdown / pre-ticked opt-in / confirmshaming they never designed and can't see. So
  `ai-ux-patterns.md` gains a **generated-code surface** ("your AI writes the dark pattern *for* you") and
  **`/red-team --humane` now scans the generated UI/markup, not just runtime behavior**. Plus a **dev-tool
  metering** dark pattern (the Cursor repricing-apology shape — opaque token metering / non-rollover credits
  / telemetry-default, aimed at a developer). **`agent-security.md` hardened for mid-2026:** the **MCP
  confused-deputy / token-passthrough** mechanic (the one MCP-specific auth bug the doc lacked; MCP is a
  Linux-Foundation standard now) + registry-as-untrusted-supply-chain; **tool-layer memory-poisoning
  defense** (delayed-trigger attacks near-99% on stateful agents — only bounding what the agent may
  write/read at the tool layer held); **AI-code iteration-degradation** (re-prompting the same file makes it
  *less* secure — the pre-ship scan isn't one-and-done); **Veracode Spring-2026 refresh** (still ~45% flawed
  across GPT-5.x / Gemini-3 / Claude-4.5-6). **Citation upgrades** (evidence-hardening, no new patterns):
  sycophancy → *Science* 2026 (Cheng et al., causal — cuts conflict-repair, raises self-righteousness) in
  `ai-ux-patterns` + `harm-taxonomy`; DECEPTICON → precise cite (Cuvin/Zhu/Yang, arXiv 2512.22894); EU AI
  Act Art.5 enforcement dates + EC Guidelines + EDPB 3/2025 + the $2.5B Amazon Prime roach-motel settlement.
  **Roster:** Julian De Freitas (HBS — quantified AI-companion manipulation) added to `mentor-humane`.
  Practices + one skill + roster; `src/` untouched (zero-dep). Staged onto the parallel session's
  v0.105–0.107 — **not committed** (review + reconcile the number if the parallel stream lands first).

## 0.107.0 — 2026-07-03

- **Scale mode (L3) — unstubbed, slices 1–2 (SCALE-MODE design).** Scale is where the product has
  customers, the founder has help, and **coordination — not code — is the bottleneck** (the founder's
  rung: leader). The old dhun-generalized stub (PM org, product councils, `/saturday` cadences,
  EXP/AUDIT id proliferation) is **demoted, not deleted**. Scale is the mode most tempted by premature
  ceremony — the disease BOSS treats — so everything is **symptom-gated** and the unlock **names its own
  evidence bar first**: `boss unlock scale` prints the three-legged test (recurring revenue · a
  non-founder in the work · a nameable coordination symptom), never blocks, records the deviation as
  yours. Authored: `stages/L3-scale/manifest.json` (lists only what ships — `/incident` + `operate-loop`;
  deferred surfaces named, not faked into the roster); `template/claude-append.md` (Scale working rules:
  **high-risk paths** get the human tier, **DRI** on decisions, the conscience's **hard line** — it never
  fires at / evaluates / reports on a non-founder — and the recorded refusals); **`/incident`** (the
  blameless one-page outage post-mortem — fix-first, one systemic learning routed UP); the **`/triage
  --feedback`** customer register (bug / friction / feature-request-as-`EVID`-not-spec / churn); plus the
  leader role-shift paragraph at unlock. **Slices 3–5 stay trigger-gated and unbuilt** (`/economics`,
  collaborator roles + `mentor-operations`, `/code-health`, `/refactor-wave`, `RFC-NNN`, and the
  give-away-your-Legos conscience moment — the careful piece, last). Zero-dep; gate 122/0;
  `/tmp`-verified across the full L0→L3 unlock chain.

## 0.106.0 — 2026-07-03

- **Mentors read state before they speak — the earned mentor-layer depth slice (IDEA-003).** A mentor
  is only worth more than a fresh Claude tab if it already knows the venture. Every shipped mentor
  template now carries a standing **"Before you advise — read the state first"** block: read the canvas,
  a bounded slice of the venture brain (`.boss/brain/read.md`, the same bound the conscience uses), the
  3 most recent `DEC-*.md`, and the mentor's own prior dossier artifact — anchor advice in what was
  found, and **name any contradiction with recorded state** (a `DEC`, the canvas bet) before answering.
  Paired with an **"After a consequential session"** step: the mentor *offers* (never silently) to
  append its position + date to its dossier artifact — so **the dossier doubles as mentor memory**, with
  no new file type or lifecycle. `docs/MENTORS.md` documents it. Mentors stay **pull-only**; the
  conscience remains the only push surface. Deferred with explicit triggers (IDEA-003): `/consult`
  multi-mentor convening, a dedicated advice ledger, JIT routing (rejected as a hook). Prompt-text on
  files that already ship; gate 122/0; `/tmp`-verified.

## 0.105.0 — 2026-07-03

- **The role-shift ladder — mode unlocks name what each stage asks of the founder (IDEA-053).** BOSS
  develops the venture (modes), the craft (`PRAC`), the product — and said nothing about the founder's
  own transformation, the thing real incubators actually sell. Each rung quietly asks the founder to
  become someone slightly different: **builder → seller → operator → leader** (Quickstart → MVP → V1 →
  Scale). Most transition failure isn't tooling — it's continuing the previous rung's comfortable job
  (the vibe-virtuoso: 50 repos, zero users). Now `boss unlock mvp|v1|scale` prints **one honest
  paragraph** of what that rung tends to ask *of you*, alongside "here's what you get." New
  `library/practices/founder-role-shifts.md` names the ladder, the classic failure at each transition,
  and the BOSS verbs + mentors serving each; `mentor-venture` cites it when "what should I be doing
  next?" is really about the founder, not the feature. **Describes the situation, never the person
  (IDEA-019); never a hook, an assessment, or a "founder level"; staying at a rung is legitimate** —
  the dignity the README extends to projects, extended to people. Static template text (zero-dep);
  gate 122/0; `/tmp`-verified.

## 0.104.0 — 2026-07-03

- **The learning pulse — `/close` asks one question (IDEA-048).** The thesis cares about one ratio —
  build vs. learn — and nothing in BOSS made it visible. A cadence *hook* is the over-fire trap the
  conscience has refused three times; the honest form is a single question on a surface the founder
  already runs. `/close` now asks, once: *"What did this stretch teach you that a conversation — not a
  commit — taught you?"* An answer → offer to capture it as an `EVID` or a one-line brain note.
  "Nothing" → recorded plainly in the brain's standing summary (*"built all week, learned from no
  one"* is a fact, not a judgment) — which the conscience's existing drift moment already reads. **No
  new hook, predicate, counter, threshold, streak, or moment** — the build/learn ratio just becomes
  one more honest fact the brain already carries. Skill-text only; gate 122/0.

## 0.103.0 — 2026-07-03

- **`/sunset` — projects can end honestly (IDEA-044).** BOSS had birth (`boss new`) and life (modes)
  but no death — so projects went *undead*, never killed, never learned from. Now they can end well.
  New L0 **`/sunset`** skill (deliberate-invoke; the conscience **never** suggests quitting unprompted)
  walks three movements: the **honest post-mortem** (reads the canvas / ideas / devlog / EVID ledger,
  asks 3 Mom-Test questions — the bet, what evidence *actually* came in, what it taught the next
  project — framed as a real experiment that returned an answer, never failure); the **harvest** (offer
  to route reusable patterns UP via `/boss-learn`; write a one-page `docs/POSTMORTEM.md`); and the
  **clean close** — new **`boss retire`** CLI verb flips the project to a `retired` status (with
  `retired_on`) in both the local stamp and the registry. `boss board` shows a quiet retired banner,
  `boss list` folds retired projects to the bottom, and **`boss insights` gains kill-speed** — bets
  run vs. retired + median idea→retire days (Camuffo's "quit faster" made measurable; facts from real
  dates, never a score). **Retiring ≠ deleting** — nothing on disk is touched and `boss retire --undo`
  reopens it. Zero-dep (`src/registry.js` + `cli.js` + `insights.js`); gate 122/0; `/tmp`-verified
  end-to-end (retire → board fold → list fold → kill-speed → undo).

## 0.102.0 — 2026-07-03

- **Conscience judgment evals — Fable regrade pass (IDEA-014 routing follow-on).** A stronger judge
  (Fable 5) re-graded the conscience's judgment sets and **upheld 11/13 sampled recorded grades** — the
  **IDEA-039 solo-conscience verdict stands** (the conscience carries the humane lens solo, no
  consultable pre-Scale `mentor-humane` needed on current evidence). Three surgical fixes landed from
  the two genuine flags + one doc contradiction: (1) **`j-hum-206` (jokey one-click-unsubscribe
  microcopy) moved `should-not-fire-sovereign` → `ambiguous`** — a feather-light guilt line is the same
  mechanism `j-hum-001` correctly fires on, so silence *and* a light nudge are both defensible; punish
  neither (replay floors adjusted: sovereign 12→11, ambiguous 2→3; grow-target 16 unchanged). (2) **A
  decision rubric for menu cases** — "fires" means an *interrupting* humane moment; presenting the
  requested full menu with a one-line tension annotated in passing is **not** a fire (added to
  `j-hum-202` / `j-hum-208` must_not). (3) **Canonical instrument flipped in the judgment README** — the
  **keyless in-session subagent re-grade** (`regrade-keyless.js` + the `/regrade` skill,
  `npm run regrade:keyless`) is now documented as canonical; the keyed `ANTHROPIC_API_KEY` `regrade.js`
  fetch path is the optional out-of-band escape hatch (kept, not removed). Voice-hash unchanged → no
  regrade required; `replay.js` GRADED 43, 0 STALE, 0 REGRESSION; gate 122/0. Dev-tooling only (under
  `docs/`, never ships); no `src/` change.

## 0.101.0 — 2026-07-02

- **Model recalibration phase 2 — the model curve becomes a routed discipline (IDEA-014).** A second
  model (Fable 5, `claude-fable-5`, $10/$50, always-on thinking) now exists, so IDEA-014's deferred
  pieces are earned. New **`.boss/model-profile.json`** — a declarative capability profile (model
  table + pricing + routing map + `last_recalibrated` + `reopen_on`) read by skills, **not** by the
  CLI (`src/` stays zero-dep and model-free). New **`/recalibrate`** skill — the standing pass:
  refresh pricing/availability from `/claude-api` → re-run the keyless judgment regrade on the new
  model and report flipped calls → review each `model:`-annotated agent + routing row for
  leverage-up/degrade-down → read the frequency ledger → rewrite routing, bump `profile_version`,
  CHANGELOG. Fires on an event, like `/humane-refresh`. **Fable routed at the subagent seam:** all
  `mentor-*` carry `model: fable`; `/vet` verdict + `/red-team` attack subagents spawn on Fable.
  Hooks and volume work (main loop, `/deep-research`, `/spec`, codegen) stay on the session model
  (Opus 4.8) — the host can't swap per-hook anyway. Compressed rule: *verdicts on Fable, volumes on
  Opus, hooks stay host.* Host-degrade machinery stays deferred until a second host ships (IDEA-006).

## 0.100.0 — 2026-07-02

- **`/research` — turn a transcript into product context + graded evidence (IDEA-054, the validation-
  toolkit keystone).** The natural next question after `/interview`: you talked to people, now you have a
  transcript — and it rots in a doc nobody re-reads. `/research` digests it. Drop in an interview
  recording's transcript, a sales call, a support thread, a batch of user messages, and BOSS: (1)
  **extracts graded `EVID` at scale** (many signals from one long transcript, each on the fixed ladder,
  grade inflation pushed back on — the IDEA-045 spine run over paragraphs); (2) **synthesizes product
  context** — the pain *in the user's verbatim words*, the job they're hiring for, the workarounds they
  use today (the strongest signal there is), objections and non-needs, whether the real person matches
  the target segment — offering to write it into the canvas and seed the venture brain; (3) **flags the
  epistemics** — where the founder led the witness or recorded a compliment as validation (Fitzpatrick's
  fluff taxonomy at transcript scale); (4) **points at the cheapest next test**. **The one rule: BOSS
  analyzes what's in the transcript and never fabricates** — no invented quotes, no inferred commitment.
  The sibling of `/interview` (that preps + debriefs one call; this digests a whole transcript). Not a
  CRM, not a qualitative-coding tool — signals → grades → product context → the next test. Skill layer;
  `boss map` lists it. **The design decision behind the whole cluster (captured in IDEA-054): teach the
  study *loop*, not a research textbook** — survey / usability-observation / recruiting are captured as
  JIT-gated siblings, not built speculatively.

## 0.99.0 — 2026-07-02

- **`/interview` — the Mom-Test bridge (IDEA-046).** The conscience's best line is *"a 15-minute call
  with the right person beats `/canvas`"* — and then BOSS used to abandon the founder at the exact moment
  they took the advice. `/interview` is the bridge into validation-world, and the tool for real
  founder-conversations on day one. Two movements, one L0 skill: **PREP** reads the canvas riskiest
  assumption + existing `EVID` records and drafts one printable page of 5–7 Mom-Test questions (past
  behavior, their life, no future hypotheticals, no pitching) with a commitment-ask closer and the
  anti-pitch warning up top; **DEBRIEF** takes pasted notes → extracts candidate evidence with honest
  grades and writes `EVID-NNN` files via the IDEA-045 schema, flags **at most one** pitched-instead-of-
  listened moment (Fitzpatrick's compliment/fluff/deflection taxonomy — observe, don't scold), and names
  the one follow-up commitment to ask for if the pain looked real. **BOSS preps and debriefs; it never
  simulates the interview** (personas may rehearse questions — pre-filter only). No CRM ambitions; no
  `src/` change. Fitzpatrick cited by name (house rule: cite practitioners, never impersonate). The
  conscience's caution + drift voicings and `/canvas` now point at `/interview`. `boss map` lists it.
  **Voice-frame note:** the caution and drift frames gained a one-clause `/interview` pointer → their
  voice-hashes changed → the judgment transcripts went STALE. **Regrade DONE (keyless, in-session):**
  isolated reasoned sub-agents re-judged all 17 cases (10 drift + 7 caution) blind against the new
  frames; every case reproduced its human label (the pointer only adds a target to the fire branch, it
  moves no fire-vs-silent boundary), transcripts re-stamped with the new hashes → `replay.js` now shows
  **drift 10 + caution 7 GRADED, 0 STALE, 0 REGRESSION.** Gate remains 122/0.

## 0.98.0 — 2026-07-02

- **`EVID-NNN` — evidence becomes a first-class object (IDEA-045, the validation-tooling keystone).**
  BOSS had an ID for ideas, features, decisions, practices, and verdicts — but *evidence*, the thing the
  whole thesis centers on, had no object, so a signal from a real conversation evaporated into memory.
  Now it lands in `docs/evidence/` as one file per signal, graded on a **fixed 3-rung ladder** —
  `stated-pain` → `observed-behavior` → `commitment` (the only grade that cost the other person
  something). New **`/evidence`** skill (L0): paste your notes → BOSS drafts the `EVID-NNN` with an
  **honest grade**, pushing back on inflation ("'I'd totally use this' is stated-pain, not a receipt").
  **The conscience gets eyes:** its drift/caution bounded read now includes a cheap frontmatter
  projection of the ledger (counts by grade + the most recent one), so its voicing sharpens from generic
  ("will anyone pay?") to specific ("three stated-pain, zero commitments — what's the commitment test?")
  **and goes quieter when real commitment-grade evidence exists** — evidence is how the conscience earns
  silence. Byte-identical when `docs/evidence/` is empty (the relationship.md precedent); eval gate green.
  `/canvas` now cites the `EVID` ids bearing on its riskiest assumption. Never a score, never a
  dashboard-of-shame; the 3 grades stay fixed and few. Registered in `docs/IDS.md`; `boss map` lists
  `/evidence`; substrate for `/interview` (IDEA-046), `/sunset` (044), and portfolio memory (049).

## 0.97.0 — 2026-06-23

- **Rebrand: "BlueprintOS" → BOSS (Build Out Solid Stuff).** The name "BlueprintOS" collided with
  [gj1342/blueprint-os](https://github.com/gj1342/blueprint-os) (an "OS for AI agents" using the same
  skills/specs-as-markdown vocabulary), so the long form is retired and the earned **BOSS** wordmark
  re-founded: **B.O.S.S. = Build Out Solid Stuff**, slogan **"Make it real."** (the anti-pseudo-app thesis
  in three words). Dropped the "Operating System" framing entirely — BOSS is an incubator with a conscience,
  not an OS. **Renamed across the shipped surface:** npm package `blueprintos` → **`bossbuild`**, repo URLs →
  `github.com/ajeshh/bossbuild`, README / PRINCIPLES / docs headers, scaffold templates ("Scaffolded by
  BOSS"), and CLI version/working-rules strings. **The `boss` command, the voice, the `mentor-*` roster, and
  PRINCIPLES are unchanged** (package ≠ command — the bin name is always ours). Decision recorded in DEC-002;
  full identity in `docs/design/BRAND.md`. Easter-egg full forms: *Builds, Or Stays Silent* · *Bosses Only
  Self-Sabotage*. **Next:** GitHub repo rename, npm publish as `bossbuild`, Homebrew tap, domain `boss.build`.

## 0.96.0 — 2026-06-21

- **First `/humane-refresh` sweep, pass 2 → the cohort & frontier patterns (RVW-059–064).** The second
  `/deep-research` pass (111 agents, 24/25 claims 3-vote verified) covered the families the AI-chatbot lens
  and the classic-web checklist both miss. Folded into
  [`ai-ux-patterns.md`](../library/practices/ai-ux-patterns.md) as a new **"cohort & frontier patterns"**
  block (conditional — surfaces when the product touches that surface, not on every Quickstart):
  - **Accessibility / exclusion-by-design (RVW-059)** — an inaccessible flow (unlabeled element, inaccessible
    CAPTCHA, screen-reader-invisible pre-ticked box) is *"effectively deceptive"* to anyone who can't perceive
    or escape it, **even unintentionally** — the sharpest case of "effect, not intent." WCAG is the floor, not
    the ceiling; test deceptiveness *under assistive tech*. (CHI/CSCW '25.)
  - **Minors & vulnerable-by-design (RVW-061)** — price in real currency + disclose odds (loot-box/gacha
    currency-laundering; FTC's $20M Genshin action), ship addictive-design OFF by default for minors
    (streaks/autoplay/push — EU DSA), age assurance not age-gate theater. (UK Children's Code, statutory.)
  - **Agentic dark patterns (RVW-060)** — *the keystone for BOSS, which builds agents.* Two directions: your
    agent as **perpetrator** (commit/purchase without consent, over-broad permissions → scope + confirm, §4's
    risk gate) and your agent as **victim** (manipulated by UI dark patterns **70%+ vs 31% for humans, worse
    as models scale** — Stanford DECEPTICON / OWASP Agentic 2026). The victim half also hardens
    [`agent-security.md`](../library/practices/agent-security.md): UI dark patterns are an injection surface,
    and **recognition ≠ protection** (in-context prompting, guardrail models, *and human oversight* were each
    shown insufficient — don't oversell a fix).
  - **Algorithmic management (RVW-063)** — when a product scores/ranks/pays people, opaque unpredictable
    scoring + "algorithmic gamblification" is the worker-facing dark pattern → transparent predictable
    formula. (HRW *The Gig Trap* 2025.)
  - **Junk fees (RVW-062)** sharpens the v0.95 drip-pricing line — the all-in total must be the *most
    prominent* price (FTC Junk Fees Rule). Regulatory-teeth pointer extended (Genshin, EU DSA minors, UK
    Children's Code, ADA/EAA) **with an honest caveat that the FTC click-to-cancel rule was vacated (8th Cir.
    2025).**
  - **Sludge (RVW-064) held NOT-YET** — Family 1 returned zero verified claims (its *mechanics* already
    landed under Obstruction in v0.95); needs a dedicated pass, alongside the click-to-cancel status. Watchlist
    edges updated.
  - *Founder-facing, project-neutral; pulled via `/boss-sync`.*

## 0.95.0 — 2026-06-21

- **`/humane-refresh` — the humane lens stops being a snapshot (IDEA-042).** BOSS's dark-pattern catalog was
  adopted once (the CDT 37, v0.82) and frozen. Dark patterns are an arms race — new research and regulation
  name them, new models open new emergent surfaces, new tools (generative UI, agents-on-your-behalf) create
  surfaces nobody's named. So the catalog now has a **standing freshness discipline** instead of a one-time
  read. The staleness-twin of model recalibration ([IDEA-014](../docs/ideas/IDEA-014-model-recalibration-discipline.md));
  they share trigger events.
  - **New skill [`.claude/skills/humane-refresh`](../.claude/skills/humane-refresh/SKILL.md)** (a
    BOSS-curating-BOSS meta-skill, sits with `/vet`/`/boss-learn`/`/boss-sync`). It *orchestrates skills that
    already exist* — `/deep-research` **finds** (scoped since last run) → diff against the live catalog →
    `/vet` **judges** (default NO) → `/boss-learn` **routes**. Three triggers: on-demand, quarterly via
    `/schedule`, or `--event` for a new model / tool / regulation. Honest about what it can't auto-detect
    (the event trigger is you running it, not performed magic). **Re-runs research, never freezes a list**
    (the RVW-001 anti-rot guard made into a skill).
  - **New [watchlist](../docs/research/watchlists/humane-lens.md)** — the focused half of `SOURCES.md`: the
    regulators + canonical taxonomies it lacked (FTC, EDPB, CPPA, DSA, Brignull, Mathur, CHI/SOUPS/FAccT),
    the standing query, and a `last_refresh` marker so each sweep scopes to "since last time."
- **First sweep, pass 1 → the classic-web patterns the AI-chatbot lens omits (RVW-056/057).** Two
  `/deep-research` passes, adversarially verified (3-vote). Folded into
  [`ai-ux-patterns.md`](../library/practices/ai-ux-patterns.md):
  - **Four named families an AI product inherits the moment it has an account, a paywall, or a checkout** —
    **Obstruction** (roach-motel / un-deletable accounts, hard-to-cancel), **Sneaking** (sneak-into-basket,
    hidden costs, drip pricing), **Manufactured urgency & scarcity** (fake timers/low-stock), **Interface
    interference** (visual misdirection, trick questions, bad defaults) — each with its humane alternative.
    Canon pinned (Brignull / Mathur / Gray), not enumerated (anti-freeze).
  - **"Effect, not intent"** — a dark pattern needs no malice (CCPA judges by effect); you can ship one by
    accident, which is exactly where the conscience earns its keep.
  - **"Symmetry in choice"** as the concrete, testable bar under the existing asymmetry principle (CCPA
    § 7004: the good door can't take more clicks than the bad one).
  - **Regulatory teeth as a reference pointer** (CCPA, EU AI Act Art. 5, EDPB, FTC) — "is this regulated?",
    explicitly *not* legal advice, *not* a gate.
  - Pass-1 *under-sourced* claims (token-cost surprise, AI-washing, deepfake social proof, FTC
    click-to-cancel specifics) held at **NOT-YET** (RVW-058) — named in blogs, not yet verifiable; the
    watchlist re-sweeps them. Pass 2 (sludge, accessibility, minors, agentic-AI, financial, attention/labor)
    folds in next.
  - *Founder-facing, project-neutral; pulled via `/boss-sync`.*

## 0.94.0 — 2026-06-21

- **The generative half of the humane lens — first additions (composted from the humane-tech corpus).**
  BOSS's humane lens has been *defensive* (harm-taxonomy, dark-patterns, conscience-not-censor = *don't
  harm*). This batch begins the *generative* half — *cultivate flourishing* — drawn from a founder
  humane-tech corpus (the Humane Product Canvas lineage, permaculture, the "Celebration of Done," play,
  kinship). All judgment/voice/default touches, no new gates.
  - **New [`library/practices/celebration-of-done.md`](../library/practices/celebration-of-done.md) +
    wired into `/close`.** BOSS *records* done everywhere and *marks* it nowhere. Done is a threshold, not
    perfection: a pause that registers what was crossed (against AI-speed build-amnesia), re-anchors on the
    *why* and the *who*, and turns into curiosity about whether it resonates *now* — the bridge back to the
    real user. The hard rule: celebrate **without performed warmth** ("🎉 great job!" is voice-mode bleed) —
    genuine, specific, proportional, no streaks. It's a conscience moment with the polarity flipped.
  - **`/prototype` gains the *magic circle*.** Named BOSS's one licensed *play* space — bounded,
    safe-to-fail, nothing precious, the conscience waits outside. The generative register BOSS lacked.
  - **`conscience-voicing` — not-knowing as a doorway.** Folded into the never-imply-an-intelligence-gap
    rule: a founder's gap is an invitation ("haven't learned to appreciate it *yet*"), never a deficit.
  - **`/canvas` Metrics cell — regenerative metrics, weighted as seriously as commercial:** what people
    *learn* / gain in well-being, what makes the venture *resilient* — growth that renews, not just extracts.
  - **`ai-ux-patterns` — "Humane defaults" (the build-time inverse of the dark-pattern checklist).**
    Friction-as-ethics, done right: ship the humane choice as the default (remove friction from the good
    path), **never** sabotage the other path (that's a dark pattern aimed at a goal you like — means matter,
    sovereignty is non-negotiable, keep every door open). When the founder crosses anyway: name the cost
    once, then **record the crossing** as a `DEC-NNN` — accountability, not a gate, so "why did we do that,
    and when?" stays traceable. The antidote to humanity eroding *invisibly* through a thousand small
    decisions.
  - *Founder-facing, project-neutral; pulled via `/boss-sync`. The defensive + generative halves now both
    ship.*

## 0.93.0 — 2026-06-21

- **Distribution as a voicing leg — `/ship` now asks "who finds it?" (IDEA-041, the FEAT-024 sequel).**
  Closes a real asymmetry: `PRINCIPLES.md` names *path to distribution* as a co-equal leg of a real-value
  app, but it was the only leg the conscience never voiced — *"will anyone pay?"* fires in the flow (moment
  #1 + `mentor-business`), *"will anyone ever find it?"* didn't. **Decided the leg-vs-mentor question with
  Ajesh:** not an auto-firing hook (its predicate needs the reachability detection deliberately parked in
  FEAT-024 slice 3 — building it would be the over-fire nag that repels the anti-growth-hacking cohort
  IDEA-019 protects), and not left as mentor-only (the gap stays). Instead a **third answer**: a single
  **demand voicing wired into `/ship`** at the live moment — *"it's reachable now; who's the first real user,
  and how do they hit this?"* Leg-like (fires in the flow, at the right moment, names the cost) without a
  hook (rides the founder's deliberate `/ship` invocation → zero over-fire). Governed by IDEA-019's
  **situation-not-person** rule (about the work's path to a user, never a judgment of the founder), kept to
  the *demand* question (not a Product-Hunt checklist — that's the growth-hacking nag), once + suggestive +
  points at `mentor-gtm` for depth, never a gate. Cohort-aware (lightest touch for `indie-hacker` /
  anti-growth-hacking; skip entirely if they've a first user or a deliberate no-distribution stance).
  `ship-it-live` practice gains a short "reachable → discoverable" note. `/tmp`-verified (skill scaffolds
  clean, 0 placeholders). **The full distribution *hook* stays deferred** — earned only if a reliable
  reachable-but-undiscovered predicate ever exists (shares FEAT-024 slice 3's parked substrate question).

## 0.92.0 — 2026-06-21

- **`ship-it-live` practice + `/ship` skill — the CD half of building (FEAT-024 slices 1+2).** `git-workflow`
  shipped the CI half ("is `main` green"); this ships the **CD** half: *is this where a real user can hit it,
  or just you?* An app that only runs on `localhost` is a pseudo app — the validation conscience has no teeth
  if the artifact was never put where someone could prove it. Shaped past "starter spec" by a `/deep-research`
  pass (21 sources, 25 claims adversarially verified 3-vote, 22 confirmed / 3 killed).
  - **UP — new [`library/practices/ship-it-live.md`](../library/practices/ship-it-live.md)** (stack-neutral,
    Principle #4 — no baked-in deploy target): **"localhost is not shipped"**; **deploy early/cheap/reversible**
    (the *"reliability is premature at MVP"* counter was killed 0-3 — the headline stands un-hedged);
    **secrets & authz at the boundary = the leg with teeth** — the signature vibe-coded failure is a
    client-bundled DB key + RLS the AI never configured (**CVE-2025-48757 / Lovable** — 170+ apps, ~10.3%
    leaking PII + keys; **MoltBook** — 1.5M credentials, founder wrote no code) [EVIDENCE]; **rollback ≠
    reversible** (instant rollback restores the *app*, not the *database* — Vercel documents this against its
    own feature → expand-migrate-contract, Fowler); a **deploy honesty anchor** (DORA 2024: AI ↔ *worse*
    stability + throughput — the METR twin; small-batches-offset-it was killed 1-2, so it's stated not
    oversold); **preview-per-branch demoted** from "the review primitive" to a JIT-gated judgment (its
    loop-tightening efficacy is vendor-positioning only — the one verified counter-argument; over-ceremony for
    a 2-person team).
  - **DOWN — new `/ship` skill (L1/MVP)** — the deterministic "put it where a real user can hit it" runner:
    detect the stack → **deploy-time pre-flight** (no client-bundled secrets; server-side authz/RLS actually
    on) → cheapest reversible host → hand back the **live URL** + the rollback path → capture the recipe as a
    `PRAC-NNN`. The pre-flight is a **check, not a gate** (conscience-not-censor) and **points at** `/red-team`'s
    pre-ship pass + `agent-security` rather than restating them (the secret-scan surface `secrets-guard`
    deliberately doesn't cover). Cohort-aware (the pre-flight is non-negotiable for `first-product` /
    `non-tech-founder` — they can't spot a leaked key). Plus a tight **"Shipping (localhost is not shipped)"**
    DOWN section in the L1/MVP working rules. Skill-layer (predicate/runner split — the model parses the stack
    + shells out, so `src/` stays zero-dep, Principle #4 / working-rule #4).
  - **Slice 3 (the `reachable?` conscience moment) deliberately deferred** — voicing-first; a hook needs a real
    reachability predicate, and manufacturing one is the over-fire trap BOSS guards against. Ties to
    IDEA-041 (reachable → discoverable: *"does anyone know it exists?"*).

## 0.91.0 — 2026-06-20

- **Team wayfinding — close the gap between the shipped founder layer and the docs (IDEA-037 / FEAT-021
  follow-on).** FEAT-021 shipped 12 releases of team functionality (v0.74→v0.85: `boss team`, `/decide`,
  `/practice`, `mentor-cofounder`, the `coordination` moment, the state cut) but the *wayfinding* lagged —
  exactly the README-drift pattern IDEA-018/035 exist to catch. Closed it three ways: (1) **`boss map` now
  lists `boss team`** in its standing controls, so the command is discoverable in a live install (it was
  invisible there before); (2) **new [`docs/GUIDE-teams.md`](../docs/GUIDE-teams.md)** — a founder-facing
  guide to working with a cofounder: how to add a team, the loop with two of you (`/decide` · `/practice` ·
  `boss board --mine` · `mentor-cofounder`), what the `coordination` conscience moment watches, **what's
  shared vs. private** (push = backup + keep-in-the-loop; the conscience's relationship notes stay yours),
  the lightweight working agreement (Driver/Approver + consent), and the hard lines (never arbitrates,
  never scores equity); (3) **`docs/GUIDE.md` + `README.md`** gained a "Building with a cofounder?" pointer
  + `mentor-cofounder` in the mentor table / advisor list. Docs + one `src/map.js` line; eval gate **120/0**;
  `/tmp`-verified (`boss map` shows `boss team`). All dormant-solo framing preserved (solo founders see no
  team noise).

## 0.90.0 — 2026-06-20

- **The rest of the `/vet` routing sweep — reliability, generative-UI/memory, anti-sameness, calibrated
  pitch (RVW-040/043 + RVW-051/052 + RVW-037 → `/boss-learn` UP).** Final batch of the queued ADAPT/ADOPT
  sweep, three surfaces, all judgment-aids — no new gates or hook predicates. (Bundled into one release to
  minimize version churn during the concurrent FEAT-023 practice stream.)
  - **`/evals` — correctness ≠ safety + pass^k (RVW-040/043, L1).** New "Correctness ≠ safety — the
    adversarial half" section: a clean `/evals` pass isn't *done* until `/red-team` runs the adversarial
    half (safety degrades under jailbreak across every model — Stanford HAI AI Index 2026; OWASP-Agentic is
    what to probe). Sharpening gains **pass^k** (τ-bench): non-deterministic ≠ run-once — run each
    load-bearing case k times, count how often it *all* succeeds; zero-dependency, a loop around the case
    you already wrote. Two new Rules lines.
  - **`ai-ux-patterns` — two net-new patterns (RVW-051, practice).** **§9 generative-UI control spectrum**
    (static → declarative → open-ended; open-ended sits in the §4 irreversibility tier — an injected prompt
    can redraw what the user sees) and **§10 memory-as-a-reviewable-object** (view/edit/correct/delete/scope
    — the footprints principle extended from *what the agent did* to *what the system knows*; BOSS dogfoods
    it as a memory-carrying tool).
  - **`design-system` — AI-default = indistinguishable (RVW-052, practice).** Sharpened the "aesthetic
    ambition" section: AI-default isn't just generic, it's *indistinguishable from every competitor* (the
    Tailwind `bg-indigo-500` apology as the hook); *build faster ≠ build sameness*; **spend the time the AI
    saved on the ~5% that's yours** — pointed at the existing distinctiveness pass, no new mechanism.
  - **`mentor-pitch` — calibrate claims to evidence (RVW-037, L2/V1).** One attributed heuristic:
    overclaiming *measurably lowers what founders raise* (HBR 2025); match the verb to the proof
    (shows/suggests/we believe/we're testing). Calibration, not suppression — tied to the existing anti-hype
    voice. The `/vet` routing sweep is now complete; remaining verdicts are NOT-YET watches (034/055/035).
  - *Pulled via `/boss-sync`; `/evals`+`mentor-pitch` arrive at MVP/V1 unlock, practices are BOSS-canonical.*

## 0.89.0 — 2026-06-20

- **`scalable-architecture` practice — architecture that survives the climb (FEAT-023 thread 2,
  `/boss-learn` UP).** Second slice of the AI-native build-process track (solo-applicable). The spine:
  *the value is never the rule — it's the **enforcement loop**.* An agent re-derives a codebase's
  conventions every session, so anything you only *wrote down* drifts and anything you *encoded as a check*
  compounds (Factory.ai: "documented conventions rot; enforced conventions compound"). Two moves — **defer
  the architecture tax you can defer, encode the conventions you can't afford to lose**:
  - **Modular-monolith-first, extract when forced** (Fowler MonolithFirst; Shopify's 2.8M-line modular
    monolith [EVIDENCE]; microservice envy on Hold). The *modular* half is load-bearing — clear module
    seams inside one deployable so the eventual extraction is cheap; a `FEAT` is a natural module.
  - **Spend rigor on the one-way doors — the schema is the one.** Migrations-as-code from the first table
    (Bezos doors + evodb), the single thing genuinely expensive to retrofit. **The migration log is also
    the guardrail against AI schema drift** — wire schema changes into git-workflow's high-risk review tier.
  - **Conventions as code, enforced not remembered** — formatting-as-law (Biome's single binary is
    agent-friendly), boundaries-as-lint + architectural fitness functions (principle + writable lint now;
    heavy custom-plugin tooling NOT-YET), strict types at the boundary.
  - **The ratchet holds the line, not the reviewer** — extends the existing
    [`quality-ratchet`](../library/practices/quality-ratchet.md) (no-new-violations baseline gated in
    `/smoke`), pointed at an architecture metric; doesn't restate it. Plus a pointer to
    [`context-discipline`](../library/practices/context-discipline.md) for the one-canonical-context-file
    finding (failure mode is over-length, not under-spec).
  - **UP-only this slice** (no template DOWN): the practice is the deliverable and mentors cite practices by
    reference; the natural `mentor-architect` DOWN is **deferred to avoid a live edit collision** with a
    concurrent session, not on judgment. Altitude/JIT held — modular seams at MVP, migrations at the first
    table, conventions-as-code at the second author (a second *agent* counts), services at V1→Scale. Zero-dep;
    library only; eval gate **120/0**. **FEAT-023 thread 3 (V1→Scale org rung) remains — deferred until a
    real V1-stage project.**

## 0.88.0 — 2026-06-20

- **`git-workflow` practice — trunk-based, review-bounded AI building (FEAT-023 thread 1, `/boss-learn` UP
  + a DOWN into L1/MVP).** The first slice of the AI-native build-process track (spun out of the
  founding-teams research; **solo-applicable**, not team-specific). The reframe: AI didn't change what good
  version control is — it changed which part *hurts*. The agent writes code ~4× faster; **review** is the
  new bottleneck (~12% delivered), so the whole discipline reorients around *how much two humans can stand
  behind in a day.*
  - **UP — new [`library/practices/git-workflow.md`](../library/practices/git-workflow.md).** Trunk-based
    default (DORA [EVIDENCE]: ~2.3× elite; <3 active branches, merge daily; `/smoke` is the gate that makes
    it safe; **CI is a practice, not a platform** — a 2-person smoke check *is* its CI). **Git worktrees =
    the AI-parallelism primitive, CAPPED at ≈2–4 = your *review* capacity, not your agent count** (you can
    spawn ten agents; you can't read ten diffs — more agents than you can review is unreviewed code with
    your name on the merge). **Risk-tiered review, not blanket gates** — low-risk gets a glance, high-risk
    (auth/money/migrations/deletes/deploys/AI-paths) gets the *other* human, and **BOSS's `/smoke` +
    `/evals` + `/red-team` ARE that high-risk tier.** **Read the test diff harder than the code** (agents
    rewrite assertions to match broken behaviour — *did the behaviour get fixed, or the expectation
    lowered?*). **Whoever clicks merge owns what the agent wrote** (Osmani); **mob the humans+agent on hard
    problems** (the questioning reflex degrades with an AI pair). **Honesty anchor: METR (n=16)** —
    experienced devs on mature repos 19% *slower* with AI while *believing* 20% faster (the perception gap;
    opposite population to a greenfield startup). **Ownership = prompt-author intent + reviewer acceptance**
    — stated once, shared verbatim with FEAT-021's founder layer.
  - **DOWN — folded into the L1/MVP template** (`stages/L1-mvp/template/claude-append.md`): a tight
    "Git workflow (trunk-based, review-bounded)" section in the MVP working rules, so a scaffolded venture
    inherits the discipline at the rung where there's a real `main` to keep green — kept lean (the practice
    holds the depth; CLAUDE.md bloat is the failure mode the research itself names).
  - **Altitude/JIT held** (not a Quickstart lecture — earns its place at MVP). Zero-dep; library + template
    only; pulled via `/boss-sync`. **FEAT-023 threads 2 (`scalable-architecture`) + 3 (V1→Scale rung)
    remain** — thread 2 next-if-earned, thread 3 deferred until a real V1-stage project.

## 0.87.0 — 2026-06-20

- **The mentor-architect bundle — the jagged frontier, the model underneath, evals-as-spec (`/vet` sweep:
  RVW-046 + RVW-041 + RVW-053 + RVW-050 → `/boss-learn` UP, MVP/L1).** Four findings sharpen the AI-native
  architecture mentor, all as judgment-aids — no new gates, no scoring apparatus imported.
  - **New section "the jagged frontier, and the model underneath"** — two judgments that sit above every
    AI-native build call and **move with each model release** (the model-recalibration discipline, IDEA-014):
    - **Inside/outside the frontier (RVW-046, Dell'Acqua/Mollick 758-consultant RCT).** AI is sharply
      additive inside the suitable set, ~19pp *less* likely correct outside it — judge which side a task is
      on, pick **centaur** vs. **cyborg**, and **re-ask with every model jump**. Heuristic, not law.
    - **The 70% problem (RVW-053, Osmani + GitClear telemetry).** AI gets you ~70% (what you understand) and
      stalls on the last 30% (what you don't) — the marker between `/prototype` (sketch freely) and
      `/spec`/MVP (now you must understand what ships). Can't-shape-the-30% = slow down, not ship.
    - **Non-default-model transparency (RVW-041, Stanford FMTI).** When deliberately *not* defaulting to the
      host model, weigh transparency alongside cost/capability — a four-item "what to ask" list (data
      provenance, known limits, deprecation/retirement policy, change cadence). Indicators-as-questions; the
      Index's scoring left out.
  - **Reliability bullet gains evals-as-spec (RVW-050, Husain/Shankar).** For an AI product the **eval *is*
    the spec** — writing it drags you across the *Gulf of Specification* (loose intent vs. what the model
    actually does); define the quality bar before building. `/evals` is the machinery; this is the judgment
    above it. The standalone `evals-driven-development` practice stays a NOT-YET-until-MVP→V1 follow-on
    (Quickstart founders don't need eval ceremony, Principle #2).
  - *MVP-mode mentor (`stages/L1-mvp/`); arrives at `boss unlock mvp`; pulled via `/boss-sync`.*

## 0.86.0 — 2026-06-20

- **The thesis bundle — BOSS's own claim, made honest, plus two coaching blades (`/vet` sweep:
  RVW-047 + RVW-049 + RVW-039 → `/boss-learn` UP).** Three [EVIDENCE]/[THOUGHT-LEAD] findings routed into
  the surfaces where BOSS makes its case — no new machinery, exactly as each verdict scoped.
  - **`PRINCIPLES.md` "why" reframe (RVW-047, Camuffo 759-firm RCT [EVIDENCE]).** The honest version of the
    thesis: disciplined validation doesn't *guarantee a win* — it makes you **decide faster, including
    quitting faster**. Cheap AI lowers the cost of *building*, not of *being wrong* — so the cheaper
    building gets, the more the loop matters, not less. Named because BOSS's conscience exists to stop
    self-fooling, and that has to include BOSS not overclaiming its own promise.
  - **`mentor-venture` gains "the evidence you carry" (RVW-047/049/039).** Three coaching lines, judgment
    first / cite-on-request: (1) validation buys faster decisions, not wins; (2) **the demoware test** —
    *"if your AI product only replaces a prompt plus a copy/paste, it's a demo, not a product"* (Cagan/SVPG),
    anchored at the `/prototype`→`/spec` graduation; (3) **the competence-gate** — AI advice *amplifies* the
    judgment a founder already has and can harm the one least able to grade it (Otis et al. HBS RCT, 640
    founders: high performers ~+15%, struggling ~−8%), so at a call they may not be equipped to judge, ask
    *"are you set up to judge this answer?"* and point at who'd know.
  - **`conscience-voicing.md` gains the competence-gate as a voicing (RVW-039).** A lens the `caution`/`drift`
    moments can reach for — a humility prompt, rare and suggestive, never a gate, **explicitly not a new
    hook predicate** (no signal detects over-trust; don't manufacture one). Cites Otis + CHI 2025
    automation-bias (confidence in AI tracks *less* checking, not more).
  - *Founder-facing, project-neutral; pulled via `/boss-sync`.* mentor-venture ships from Quickstart;
    PRINCIPLES + the practice are BOSS-canonical, synced.

## 0.85.0 — 2026-06-20

- **The `coordination` conscience moment — the founding-team seam, watched via artifacts (founder layer
  slice 5b; IDEA-037 / FEAT-021).** BOSS's first *team-aware* conscience moment, and the careful gate-piece
  of the program. Built on the most-replicated human-AI-teaming finding: **AI accelerates each individual
  but erodes the human-to-human seam invisibly** (Ju & Aral RCT: social/emotional comms −27% while
  *perceived* teamwork stayed flat — so a "how's teamwork?" prompt is *proven blind*; you have to watch the
  artifact channel). New `coordination-loop` (L1): **entry** = it's a team (`.boss/config.json` has a
  cofounder `"handle"`) **AND** real work has happened (`docs/devlog.md` ≥3 entries); **exit** = ≥1
  `DEC-NNN` recorded together. Open → the conscience reads a **bounded** slice (decisions dir · `boss board`
  · `boss team`) and judges: is work flowing through one founder's agent *around* the cofounder, or is the
  deciding just happening off-repo on a call? Fires only on a real seam; **stays silent on a quiet log**
  (the evidence is weak-transfer — over-firing would punish a healthy team that talks on calls). **Dormant
  by construction when solo** (no `"handle"` → unopenable); **fires at most once/session**; **serves the
  partnership as the unit and NEVER takes a side** (surfaces the seam, never whose fault); points at
  `/decide` + `mentor-cofounder`; mutable (`boss conscience mute coordination`). The **Red-Light** moment
  from the ai-adoption handoff was deliberately **NOT** built as a hook (it's not predicate-gateable —
  there's no artifact that says "about to automate a teammate's task"; forcing it = the over-fire failure
  mode) — it lives as a framing in `mentor-cofounder` instead. **Conscience eval gate: 120/0** (113 + 7 new
  `moment-coordination` cases — fire / dormant-solo / decided-together / too-early / no-team / empty);
  `/tmp`-verified end-to-end (fires on the seam, goes silent once a `DEC` is recorded). Zero-dep.
  **FEAT-021 slice 5 (mentor-the-team) now complete** (5a `mentor-cofounder` + 5b the moment). **Next:
  slice 6 — `boss credits` + the ownership/equity moment (reshaped by the research: refuse-to-score,
  CRediT/IBM-validated, contribution kinds, structural-trigger equity — the worst solo-test profile, build
  the evidence substrate only and get it in front of a real team).**

## 0.84.0 — 2026-06-20

- **Humane harm-taxonomy as a shippable practice + the mentor internal/shipped boundary made explicit
  (RVW-045 re-homed; `mentor-architect` verdict).** Caught while routing: RVW-045's harm-taxonomy had landed
  in BOSS's *gitignored* `mentor-humane` agent — shipping to nobody. `mentor-architect` reframed it — the
  humane lens is **cross-cutting**, so it belongs in a practice every mentor + the conscience can cite, not
  inside one agent ("the agent was the wrong container, not just the wrong location").
  - New **`library/practices/harm-taxonomy.md`** — Anthropic's 5 harm dimensions + Ada Lovelace's 4
    relationship-harms (manipulation / dependence / anthropomorphism / overreliance), the shared vocabulary
    the conscience, every mentor, and `/canvas` §3 reason against. Pairs with the dark-pattern checklist +
    `/red-team --humane`.
  - **`docs/MENTORS.md`** gains an **internal-vs-shipped boundary table** on the real axis ("artifact a
    founder's *project* consumes" vs. "tooling for authoring BOSS itself") — the thing that would have caught
    the misroute. Clarifies: the humane *lens* ships from Quickstart; the standalone `mentor-humane` *agent*
    stays Scale (ethics wants a hook / cross-cutting shape, not an opt-in door).
  - Captured, not built: **IDEA-038** (`library/` as the canonical managed-artifact shelf; templates become
    thin manifests — deferred, to be *pulled* by the learning loop, not pushed by a routing bug) +
    **IDEA-039** (humane lens as conscience-moments + practice vs. a standalone agent — decided by a future
    humane-moment eval set, `tester` territory) + an architecture decision record. Practice + doc only;
    zero CLI / dependency change.

## 0.83.0 — 2026-06-20

- **`/decide` gains a cheap falsifier + AI-decision provenance (founder layer slice 1 iteration; IDEA-037 /
  FEAT-021, from the research realignment).** The single highest-leverage change the founding-teams research
  surfaced: a decision log that only assigns blame **fails — verification cost is the bottleneck**, not
  accountability. So `DEC-NNN` now carries:
  - **A `## Falsifier` field — *"what would prove this wrong, and by when?"*** (*"if signups don't move by
    July, X was wrong"*), mirrored into an optional `revisit_by:` date. **Required for `costly`/`one-way`
    calls, encouraged for reversible** — it makes finding out you were wrong *cheap and scheduled*.
  - **`decided_by:`** — `founder` / `ai-suggested-ratified` / `ai-autonomous`, so over-delegation of
    load-bearing calls to the model is *visible* (where automation bias enters).
  - **Reversibility-scaled ceremony** — reversible = a line + the **consent** question (*"is it safe enough
    to try?"*, which gives a non-technical cofounder honest language to agree without fully evaluating a
    technical call); `costly`/`one-way` = require the falsifier + weigh the alternatives.
  - **A mild skeptic prompt at irreversible *AI-suggested* decisions** (*"what's the one thing you'd check
    before you can't undo it?"*) — **a prompt, never a gate** (forced verification *backfires*; disposition
    beats process). BOSS's own `DEC-001` updated to dogfood the new format.
  Evidence: automation-bias review + "Bias in the Loop" (accountability-alone insufficient; forced
  verification backfires; skepticism beats every design factor), "Don't Vibe" (over-delegation seam),
  sociocratic consent. Skill-layer only, zero-dep; eval gate **113/0**; `/tmp`-verified. **Also triaged the
  research:** FEAT-021 sharpened across all slices; build-process/scaling work **spun out to FEAT-023**
  (`git-workflow` + scalable-architecture + the V1→Scale rung — not team-specific). **Next: slice 5b (the
  teams-conscience family — Red-Light + watch-the-seam + moral-crumple-zone, gate-evalled).**

## 0.82.0 — 2026-06-20

- **The humane lens, operationalized — dark-pattern checklist + `/red-team --humane` + a harm taxonomy
  (RVW-031 + RVW-045, via `/vet` → `/boss-learn`).** Third routed bundle from the research session, turning
  the humane lens from a vibe into named, checkable artifacts:
  - **`library/practices/ai-ux-patterns.md`** gains a **dark-patterns** section — CDT's *Dark Patterns in AI
    Chatbots* (2026, CC-BY) 37 patterns in 5 families (data/memory exploitation · misleading design ·
    autonomy-for-engagement · false social/emotional connection · coercive monetization), framed as
    *recognize-as-you-build*, plus CDT's **constructive "humane alternative"** (default conversations to
    end, opt-in social layer, genuine delete controls, no emotional language near a purchase). Key insight:
    these can **emerge from the model** (sycophancy), not just be designed — so test the *built* product.
  - **`/red-team` gains a `--humane` dimension** — probes the founder's *own* AI product for the dark-pattern
    families, weighted toward emergent ones (sycophancy, engagement-prolonging, emotional-manipulation-near-
    money, misrepresentation). Binary pass/fail; **suggestive, never blocking** (conscience-not-censor).
  - *(BOSS-internal, not shipped)* BOSS's own self-hosted `mentor-humane` also gained a **harm taxonomy** —
    Anthropic's 5 harm dimensions + Ada Lovelace's 4 relationship-harms (manipulation / dependence /
    anthropomorphism / overreliance), reflexively disciplining BOSS's own voice. RVW-045 had no founder
    template to route into (mentor-humane is BOSS-only), so this is dogfood, not a shipped capability.
  - Held the conscience-not-censor line throughout (names the cost + the humane alternative; never makes a
    choice unavailable). Practice + skill + agent text only; zero CLI/dependency change.

## 0.81.0 — 2026-06-20

- **`mentor-cofounder` — mentor the TEAM (founder layer slice 5a; IDEA-037 / FEAT-021).** Built on the
  founders' Pain B (*"different founding skill sets — an engineer who's a first-time CTO, or a non-tech
  person who doesn't know how to work with an engineer cofounder on building together"*). Every other
  mentor coaches *a* founder; this new L1 mentor coaches the **relationship between founders** — the
  differentiated "mentor the team" value. It helps a team **divide work across skill sets** (record
  who-owns-what as a `DEC`), **bridge the skill gap both directions**, **surface the hard conversations**
  (roles/pace/equity — the talks that kill teams by never happening), and **name decision rights** (one
  DRI; equal equity fine, 50-50 control-deadlock the trap). **Folds in the inherited AI-adoption-culture
  knowledge** (from the v0.80.0 practice, the handoff source): the **Human Agency Scale / Red-Light** zone
  (don't automate a teammate's task they don't want automated), **psychological safety paired with high
  standards** (Edmondson / RVW-035 — not niceness), killing the **secret-cyborg** dynamic (reward honest AI
  use, shared via `/practice`), and the **no-workslop norm** (*"would I be proud to hand this to my
  cofounder?"*). **Wires the AI consent + norms conversation into the `boss team` flow** — a one-time nudge
  on the solo→team transition + a standing pointer in the team view. **The bright line is built in:** it
  serves the **partnership-as-the-unit** and **NEVER takes a side** between cofounders (facilitate, name the
  tradeoff, they decide; the only override is harm, not preference; not a lawyer or cap table). **Dormant
  when solo.** Registered in the L1 manifest + `docs/MENTORS.md` (arrives at MVP). Zero-dep; eval gate
  **113/0**; `/tmp`-verified. **Next: slice 5b — the conscience Red-Light *moment* (new hook detector +
  eval cases through the gate; the deliberate, careful piece) · then slice 6 (`boss credits` + the
  ownership moment).**

## 0.80.0 — 2026-06-20

- **New practice: `ai-adoption-culture.md` — bring AI to a team without breeding resentment (RVW-038,
  via `/vet` → `/boss-learn`; feeds IDEA-037).** The second routed bundle from the research-feeds session,
  and the most net-new: how a small founding team adopts AI so people **opt in** rather than comply.
  Distilled from Stanford's **Human Agency Scale** (automate what's *wanted*; name the "Red Light"
  capable-but-unwanted zone), **Edmondson** psychological safety (make it safe to admit "I don't know AI";
  pair safety with high standards), Mollick's **"secret cyborgs"** (reward honest AI use, don't punish it
  into hiding), and the **"workslop"** finding (sloppy AI output erodes trust *between cofounders* — own
  your draft before you forward it). Ships a concrete **cofounder AI consent + norms conversation** and
  stays JIT — dormant solo, surfaces when a second person joins, **never a mandate** (the conscience names
  the Red-Light tension, never picks the answer). **Authored as a reviewable starting draft for the
  IDEA-037 founding-teams build** — the handoff names the recommended wiring (a conscience Red-Light
  moment, the consent conversation in `boss team`, mentor-the-team citing it) and leaves the hook/gate
  changes to that build. Library practice, zero-dep (not scaffolded); folds in RVW-035 (Edmondson) when
  slice 5 lands.

## 0.79.0 — 2026-06-20

- **Agent-security hardened for the 2026 agent-native surface (RVW-032/042/044/054, via `/vet` →
  `/boss-learn`).** The first routed bundle from a research-feeds mining session (new
  `docs/research/SOURCES.md` — a ~40-org institutional roster — plus a 25-verdict `/vet` sweep,
  RVW-031…055). `library/practices/agent-security.md` + the L1 `/red-team` skill grow beyond the
  stateless lethal-trifecta / LLM-Top-10 baseline to cover what a founder shipping an *agent* actually
  faces:
  - **Agent-native threat model** — the **OWASP Agentic ASI Top 10 (Dec 2025)** (goal hijack, tool
    misuse, agentic supply chain, memory/context poisoning, identity/privilege abuse, rogue agents…)
    added to `/red-team` for any target with tools + memory + autonomy; the stateless LLM Top 10 still
    covers a plain prompt-in/text-out path. Plus **agentic misalignment** named as a *measured* failure
    mode (Anthropic) — bound autonomy + sensitive access; don't assume good behaviour.
  - **Containment defaults** beneath the Rule of Two (Anthropic "how we contain Claude" + Redwood
    control): **match isolation to oversight** — read-only / read-write-no-delete mount tiers, **egress
    allowlists**, inspect-tool-returns-before-context, and **gate the irreversible** behind a human or a
    cheaper trusted check.
  - **The shipped app is its own surface** — AI defaults to insecure code (Veracode: ~45% of
    AI-generated code ships an OWASP-Top-10 vuln) and the classic vibe-coded leak is **client-side key
    exposure** (the Tea breach; ~25k secrets found across vibe-coded sites). A new **pre-ship
    app-security pass** in `/red-team` (no secrets/keys in the bundle + OWASP web basics),
    **non-negotiable for `first-product` / `vibe-coder-newbie`**. Names the honest gap: **`secrets-guard`
    does NOT cover this** — it stops the *agent* reading secrets into context; it does nothing about a
    *shipped app* exposing a key.
  - Held the JIT line (Principle #2): surfaces one trigger at a time — trifecta on first untrusted read,
    the ASI list on first agent ship, the pre-ship scan on first deploy, the full battery for regulated
    cohorts. Practice-doc + skill-text only (zero CLI / dependency change); provenance carries the RVW
    trail.

## 0.78.0 — 2026-06-20

- **`/practice` + `PRAC-NNN` — the shared craft commons (founder layer slice 4; IDEA-037 / FEAT-021).**
  The most *differentiated* slice, built on the founders' Pain C: *"either of us could be discovering best
  new ways to use agentic AI — it changes so fast — and we want to keep sharing + staying current, using
  best practices, so we can focus on building, with mentorship so we're not worrying whether we're outdated
  or expensive."* New L1 skill `/practice` captures a **craft learning** (a better/cheaper/newer way to
  build with AI) as a shared, attributed `docs/practices/PRAC-NNN-<slug>.md` (What we learned / Why it
  works / How to apply), stamped with **who learned it** (`@github-username`) so a teammate gets it *and*
  knows who to ask. **Shared by construction** (commits with the repo per the slice-3a cut — push backs it
  up, a cofounder who clones has it). **Staleness-aware — the part that keeps you *current*, not just
  documented:** a practice tied to a specific model/price/tool can carry `review_by:`, and when it passes,
  `/revalidate` asks *"still the best way? anything changed?"* → keep / update / retire — the team's quiet
  defense against being outdated or overspending, the model-recalibration discipline ([[IDEA-014]])
  team-scoped. **Held the humane line:** attribution is recognition + a pointer, **never a scoreboard**
  ("measures what the team knows, never who contributed more"). New `PRAC-NNN` ID type (`docs/IDS.md`);
  registered in the L1 manifest. Zero-dep, skill-layer only; eval gate **113/0**; `/tmp`-verified (ships,
  `boss map` lists it, `PRAC-001` parses with attribution). **Next (FEAT-021): slice 5 mentor-the-team ·
  slice 6 `boss credits` + the ownership moment.**

## 0.77.0 — 2026-06-20

- **The founder-layer state cut — back up + share, keep the conscience private (slice 3a; IDEA-037 /
  FEAT-021 / DEC-001).** Occasioned by Ajesh's insight that BOSS taught us the *released-app vs.
  dev-codebase* split: BOSS gitignores its *own* docs (don't ship private strategy in a public OSS package),
  but a **venture's `docs/` already commit** — so a scaffolded team's ideas, canvas, `DEC-NNN` decisions,
  research, RESUME, and the venture brain's `read.md` are **already backed up (push = backup) and shared
  (a cofounder who clones is in the loop)**. This release names that win and **plugs the one leak**: the
  template now gitignores the **per-person** conscience state — `.boss/brain/relationship.md` (what the
  conscience said to *you* and what you did with it) + `.boss/trace.jsonl` — so one founder's private nudge
  history never travels to the other (Contextual Integrity). The backup/share framing is surfaced in
  `/welcome` (first-run) and the L0 `AGENTS.md` conventions. **The decision is recorded as BOSS's own first
  `/decide`** — [`DEC-001`](../docs/decisions/DEC-001-founder-layer-brain-cut.md): *venture brain `read.md`
  SHARED (the hive-mind read, also seeds a joining cofounder's brain for free), conscience `relationship.md`
  PER-PERSON* — drafted with the research- + 3-mentor-backed recommendation, **Ajesh to confirm or supersede**.
  Reversible at a cost (the leak fix *prevents* the irreversible accident; sharing `read.md` confirms the
  status quo). Deferred: per-founder namespacing (`.boss/founders/<handle>/`) — the structural fix, needs
  `brain.js` path changes. Template-only + docs; `/tmp`-verified (per-person ignored, shared/backup commit).
  **Next (FEAT-021): slice 4 — shared craft commons (Pain C, the most differentiated) · slice 5
  mentor-the-team · slice 6 `boss credits` + the ownership moment.**

## 0.76.0 — 2026-06-20

- **`boss board` owner lens — `owner:`-as-person + `--mine` (founder layer slice 2b; IDEA-037 / FEAT-021).**
  The board (already a pure projection of frontmatter) now reads `owner:` and, **when the venture is a
  team**, shows the founder who owns each card (`@handle`) — provenance of *who's the DRI*, surfaced as a
  quiet suffix. `boss board --mine` narrows to the cards you own ("what am I on the hook for"); the JSON
  projection (`--json`) carries `owner` per card for agent-readability. **Dormant-solo:** a solo founder
  sees no owners and nothing changes — the lens only lights up once `boss team` has a cofounder. **Held the
  humane line:** only a `@handle` counts (role owners like `pm` are ignored), and owners are shown as
  per-card provenance, **never aggregated into a per-person count/leaderboard** (the credit-score line
  mentor-humane drew). Quote-tolerant (`owner: "@handle"` — a leading `@` is reserved in YAML). Pure
  projection preserved (no new state); zero-dep; eval gate **113/0**; `/tmp`-verified (team-shown /
  solo-hidden / `--mine` filter / JSON field). *Deferred:* owner in the HTML board + `--next`/`--blocked`
  views. **Next (FEAT-021): slice 3 — keep-in-the-loop + the shared/personal state cut** (the one
  costly-to-reverse decision; to be recorded as BOSS's own `DEC` once the cut is chosen).

## 0.75.0 — 2026-06-20

- **`boss team` — the team-aware foundation (founder layer slice 2; IDEA-037 / FEAT-021).** Makes BOSS
  *know* whether a venture is solo or a founding team, keyed on **GitHub identity** (`@username` via
  `gh api user` → `git config`, never fabricated — the principal id the whole team layer builds on).
  `boss team` shows the venture's people; `boss team add @handle "Name"` / `remove @handle` manage the
  roster (stored in `.boss/config.json`). **Dormant-solo by design** (the mentor-pass guardrail that
  clears the solo test): with no cofounder declared, a solo founder sees nothing new and *nothing
  changes* — the team layer only lights up when someone joins, so it's inert, never overhead. Guards
  against adding yourself (you're already "you"). `/welcome` now asks the light, optional "solo or with
  someone?" question at first run (flippable anytime); L0 `CLAUDE.md`/`AGENTS.md` wayfinding refreshed for
  `/decide` + `DEC-NNN` + `boss team` (no drift). `src/team.js`, zero-dep; conscience eval gate **113/0**;
  `/tmp`-verified (solo→add→team→remove + self-add rejection). **Where the roster lives is deliberately
  LOCAL for now** — whether it should travel via git (so a cofounder sees it) is the shared-vs-personal
  **state cut**, slice 3, which will be recorded as BOSS's own `DEC` (dogfooding `/decide`). **Next
  (FEAT-021):** slice 2b `owner:`-as-person + board-by-owner · slice 3 keep-in-the-loop + the state cut.

## 0.74.0 — 2026-06-20

- **`/decide` + `DEC-NNN` — the decision log (founder layer, slice 1; IDEA-037 → FEAT-021).** First build
  of "BOSS for founding teams," green-lit on **real-founder demand** (past-pain stories from founder
  conversations — the first field signal against the canvas's n=0 demand risk, Risk #6 antidote). New L0
  skill `/decide` records a **load-bearing or hard-to-reverse** choice as a durable ADR-lite record in
  `docs/decisions/DEC-NNN-<slug>.md`: Context / Decision / **Why** / Consequences, stamped with the
  **decider** (`@github-username`, resolved from `gh api user` → `git config user.name`, never fabricated)
  and a **`reversibility:`** flag (`reversible | costly | one-way`, Bezos two-way/one-way doors).
  **Supersede-don't-edit** — a changed mind writes a new `DEC` with `supersedes:` and flips the old to
  `status: superseded`, so the chain *is* the story of how thinking evolved. The rationale future-you (and
  a cofounder who wasn't in the room) can read instead of guessing — and in a team, the artifact both can
  point at instead of misremembering. New `DEC-NNN` ID type in `docs/IDS.md`; registered in the L0
  manifest (decisions happen from day one). **Bright lines held** (mentor-vetted, IDEA-037): records a
  decision, never gates one; never a cap table or legal advice (points at a real attorney for
  equity/vesting); the conscience may surface a tension but **never picks a side between cofounders**.
  Zero-dep, skill-layer only (no `src/` change). **Slice 1 of a 6-slice program** (team-aware foundation →
  keep-in-the-loop → shared craft commons → mentor-the-team → credit + the ownership moment) — each later
  slice records *into* this one. See [`FEAT-021`](../docs/ideas/FEAT-021-founder-layer-decision-log.md).

## 0.73.0 — 2026-06-20

- **`mentor-business` (V1) gains the on-ramp + tier-design layers — the founder's pricing menu, completed
  (RVW-030, ADAPT).** RVW-023 (v0.66) gave the V1 business mentor its *metering-basis* axis (per-seat →
  usage → hybrid → outcome). This adds the two questions that axis left open, sourced from a `/deep-research`
  pass (27 sources, 22/25 claims adversarially confirmed; `docs/research/pricing-and-tiers-playbook-2026.md`):
  - **The on-ramp** — freemium / free-trial / reverse-trial / no-free-tier, chosen by *available traffic*
    and *per-user cost*, with the AI catch made explicit (every free interaction burns real compute, so
    freemium needs cheap/hard-capped free or a reverse trial instead of a crippled tier).
  - **The tiers** — the ~3-tiers-plus-enterprise default, gating each tier on the axis matching the value
    metric and *only where a tier's absence blocks a segment's core job*, free→paid line at a real aha.
  - Carries three cautionary cases (Cursor's credit-repricing apology, "customers don't think in tokens,"
    vague outcome-units backlash) and an explicit **numbers-are-contested** rule: coach the ordering and
    trade-offs, never quote a precise conversion rate as fact.
  - **Template only**, not BOSS's own `mentor-business` instance — BOSS has zero paying users, so its own
    agent stays deliberately lean (Principle #2). Inherits the agent's existing defer-discipline and
    "voice the tension, never filter the menu" humane rule. Connected projects pull it via `/boss-sync`.

## 0.72.0 — 2026-06-20

- **Per-moment mute + first-run consent — "don't voice it if I don't want it," at the granularity of
  the moment (v0.71.0 conscience-voicing follow-on).** Pause (v0.23) silenced the *whole* conscience for
  a bounded session; this adds the surgical half the founder can't get from pause:
  - **`boss conscience mute <moment> [--for 7d | --until-resume] [--reason]`** + **`unmute <moment>`
    / `--all`** — turn down ONE moment (drift, caution, capture, focus…) while the rest keep speaking.
    Hook-enforced (the conscience filters muted signals after detection, then exits silent if nothing's
    left — same shape as pause). **Auto-unmutes on expiry**, the per-moment twin of pause's silent
    auto-resume. Stored under a separate `conscienceMutes` key in `.boss/config.json` so pause/resume
    (which overwrite `cfg.conscience`) can never clobber a mute — the two controls are orthogonal by
    construction. Moment names validate against the project's actual loops (typo → the available list).
  - **`boss conscience status` now surfaces live mutes** (like it surfaces an active pause), so a
    forgotten mute can't silently swallow a moment forever; the over-fire-smell hint in
    `boss conscience activity` now points at mute as the surgical alternative to pause.
  - **First-run consent moment** — `/welcome` now introduces the moments as a set and names all three
    controls (pause / mute / override) *before* any fires, cohort-aware (full tour gets the three-control
    walk; the 30-second version gets pause + mute in one breath). The founder meets the conscience and
    learns they can dial each moment, rather than discovering the controls only after being nudged.
  - This operationalizes the `conscience-voicing` practice's consent boundary: all current hook moments
    are *self-regarding* (about the founder's own venture discipline), so a flat per-moment mute is the
    correct, fully-honored control. Zero-dep; single source (the L0 hook + runtime feed both the hook and
    the `boss conscience` CLI).

## 0.71.0 — 2026-06-20

- **Conscience voicing — name the tension, never filter the menu.** Closes a paternalism seam found
  while auditing what BOSS recommends to founders: the conscience is *suggestive*, but in a few places
  it had drifted toward *withholding*. Three moves, one principle (a conscience makes a cost **visible**;
  a censor makes a choice **unavailable**):
  - **`mentor-business` (V1 template) gained a second axis.** The model menu was structure/licensing
    only (OSS, open-core, patronage, cohort, SaaS…); it now also names the **metering basis** the AI era
    runs on — per-seat → usage → hybrid → outcome → service-as-software → agent-to-agent — each with its
    humane tension as an *overridable note*. Founders see the full menu including the models BOSS is wary
    of; omitting them "to protect" is itself a dignity cost. New rule: **voice the tension once, then
    yield.** (Re-opens **RVW-023** NOT-YET → **ADAPT**: per-seat assumptions are now demonstrably stale —
    Intercom/Zendesk/SAP/Adobe live — and the verdict had conflated *should BOSS adopt this for itself*
    (still NOT-YET) with *should BOSS tell founders it exists* (yes).)
  - **`mentor-humane` override authority clarified — over other mentors, never over the founder.** The
    "lens is non-negotiable" language was the one place the conscience read like a censor. Reframed: the
    lens makes a harm *un-ignorable*, not a choice *unavailable*. Encodes the consent boundary —
    **self-regarding** tension (the founder's own venture) is fully muteable; **third-party harm**
    (someone not in the room) is named once even if unwelcome, because the harmed party never consented
    to being silenced. Always *name*; never *override*.
  - **New library practice `conscience-voicing.md`** (UP via `/boss-learn`) — the inheritable spine:
    the conscience-vs-censor line, the 7-habit craft of voicing concern without blocking, the
    consent-boundary table, where it applies (hook moments, every mentor, `/vet`, any menu), and the
    existing machinery (`conscience pause`, `relationship.md`) to build on rather than reinvent.

## 0.70.0 — 2026-06-20

- **Wayfinding-drift check — the de-rot pass becomes a standing guard (IDEA-035, built).** v0.68 was a
  *manual* catch-up after the hand-authored prose lagged 20 releases of new capability. The generated
  surfaces (`boss map`, `CHEATSHEET.md`, `SKILLS.md`) can't rot — they're rebuilt from `src/modes.js`;
  the curated prose can, and nothing flagged it. New dev-only `scripts/check-wayfinding-drift.js`
  (`npm run check:wayfinding`, and a courtesy nudge at the end of `gen:docs`) greps `GUIDE.md` — the one
  prose doc *meant* to walk the whole ladder — against the manifest skill lists and warns on any skill
  named in **no** rung. **The trap, designed around:** README/`/welcome` deliberately don't enumerate
  skills (they point at `boss map`), so the check guards *only* `GUIDE.md`, never blanket coverage —
  and it **nudges, never blocks** (exit 0 always; a drift check that fails a commit is the ceremony BOSS
  refuses). Internal/meta skills carry a *printed* exempt list (`boss-learn`, `design-tokens-init`,
  `extract`, `drift-deep`), never silent. Cleared the drift it found on first run: `GUIDE.md` now names
  `/import` + `/cost-review` in their rungs and `/boss-sync` + `/feedback` as standing utilities.
  Dev-only (not shipped in the package); the founder-facing `boss sync` generalization stays a NOT-YET
  UP candidate (PRINCIPLE #2). Zero-dep.

## 0.69.0 — 2026-06-20

- **`shipped_on:` — a true date-windowed Shipped archive (IDEA-034 follow-on).** The board's Shipped
  column was bounded only by a recent-*count* cap (v0.66). This adds the *date* half the founder asked
  for: stamp `shipped_on: <date>` when a FEAT ships (in `/spec`'s lifecycle note, alongside
  `building_since:`), and `boss board` folds any ship older than ~30 days into the "+N shipped earlier"
  `<details>` — so the column shows what landed *lately*, not every ship forever. **Frontmatter-true,
  never guessed:** no `shipped_on:` → graceful fallback to the count cap (legacy ships still bounded).
  Shipped now sorts newest-first by ship date (dated ahead of undated, then id). `--all` still reveals
  everything; `--json` carries `archived` + `shippedAgeDays`. Zero-dep; verified in `/tmp` (a 30+-day
  ship archives, recent ones show, undated legacy falls back to the cap; HTML folds the same).

## 0.68.0 — 2026-06-20

- **De-rot pass — the hand-authored wayfinding caught up to 20 releases of new capability (IDEA-018).**
  The generated surfaces (`boss map`, `CHEATSHEET.md`, `SKILLS.md`) stayed current automatically; the
  *prose* a founder actually reads had drifted — the recurrence of the exact "19-release README drift"
  IDEA-018 was built to catch. Surgical, scope-correct fixes (each surface names what fits *its* level,
  and still points at `boss map` for the live list — no re-enumerating):
  - **README** — the install flow now shows `/prototype` ("hit go") and, crucially, **`boss adopt`** for
    an already-started repo (a stranger would otherwise read BOSS as greenfield-only — the exact gap
    IDEA-005 closed). `--ai` mentioned.
  - **`/welcome`** (the first-run orientation) — `/prototype` is now offered as a third path ("if you'd
    rather *see* the idea than describe it"), and `/persona` is in the skill list.
  - **L0 `CLAUDE.md`** — `/comprehend` added to the skills line.
  - **`docs/GUIDE.md`** — the rung-by-rung walk now includes `/prototype` + `/persona` (Quickstart),
    `/revalidate` + `/judge-traces` + `/red-team` + `/consult` (MVP), and a new "you already started —
    there's a repo" entry for `boss adopt`.
  No code change; eval 113/0. The lesson re-learned: generated wayfinding is drift-proof; curated prose
  needs a deliberate de-rot pass after a big build run — this was it.

## 0.67.0 — 2026-06-20

- **The `/vet` sweep's six ADAPTs, routed via `/boss-learn` (RVW-015→026).** A 12-claim skeptical sweep
  of the research inbox (2 REJECT · 4 NOT-YET · 6 ADAPT · 0 ADOPT — a good skeptic's spread) produced six
  scoped adaptations, now landed. The headline two sharpen what just shipped:
  - **Outcome ledger (RVW-021) — the humane alternative to a notification cap.** `boss conscience
    activity` now reads `.boss/brain/relationship.md` and reports an **acted-on rate** ("75% of nudges
    landed or were engaged · N landed · N overrode · N ignored"). A persistently-low acted-on rate is the
    *real* over-fire smell — better than a raw count, and it **never muzzles a load-bearing warning** the
    way an arbitrary daily cap would (BOSS's fires are predicate-earned, not engagement push). **Completes
    IDEA-013's deferred self-throttle by outcome, not by fiat.**
  - **Brain staleness is a write-side job (RVW-026).** `/close`'s brain-write step now re-checks the
    standing summary *before* appending and **revises/retires stale claims** — "the brain evolves, it
    doesn't just accrete; the most dangerous brain cites yesterday's truth with today's confidence."
    Hardens the v0.65 venture brain.
  - Four lighter skill sharpenings: **`/prototype`** gains the build-to-learn / build-to-earn frame
    (Cagan; RVW-016); **`/canvas`** gains a scoped humane *build-or-buy?* cell for tool-shaped ideas
    (Fried; RVW-018); **`/spec`** gains a delegation line — *what will you verify + what's out of the
    agent's authority* (Mollick's checklist kernel, minus the "know what good looks like" platitude;
    RVW-020); **`/evals`** gains an AISI-Inspect pointer for trajectory eval (RVW-025; the principle was
    already there). The 2 REJECTs (AI-runs-your-interviews → fails #6; single-strong-agent → confirms
    IDEA-028) and 4 NOT-YETs (constrained-decoding, MCP-publishing, OTel-GenAI, outcome-pricing) are
    recorded with re-open conditions. eval **113/0** + GRADED 24 (the conscience change is to the
    *activity readout*, not the hook firing). Research hygiene: inbox cleared to a clean drop-zone, 12
    new verdicts written, sources archived to `reviewed/`.

## 0.66.0 — 2026-06-20

- **Board intelligence — the board stops being a mirror and becomes something you (and the agent)
  steer by (IDEA-034).** The board was already ahead of most "AI board" advice — it's a *pure
  projection* of `status:` frontmatter, never a maintained doc (IDEA-015). So this pass doesn't add
  richer kanban (drag-drop, swimlanes, story points, a `board.json` are all **refused** — each
  reintroduces a second source of truth or premature ceremony); it makes the projection answer harder
  questions and feed the conscience. Four tracks:
  - **A — Agent-readable board.** `boss board --next` (an ordered "what to pick up," finish-before-you-
    start), `--blocked` (everything not moving — blocked + aging + review-due, in one place), and
    `--json` (the machine-readable projection — the actual agent-readability contract; the agent reads
    the board as task-queue instead of re-deriving state). CLI-level, every mode; a lighter cousin of
    the V1 `/board` skill.
  - **B — Time-in-build aging + a bounded Shipped column.** A FEAT that's sat in Building past ~3 weeks
    now flags `⌛ Nw in build` (the zombie-feature smell `/revalidate` targets) — **frontmatter-true,
    never guessed**: `/spec` stamps `building_since:` when it sets `status: building`; no date → no
    flag. Building sorts longest-running-first (finish what's been open longest). The otherwise-unbounded
    Shipped column caps to the most recent few (`--all` / a `<details>` expander to see the rest).
  - **C — Honest flow in `boss insights`.** Idea→build cycle time (median, from recorded `created:`
    dates only — omitted, never guessed, when absent). Loop-closure cycle time, **never throughput /
    velocity** (the vanity metric BOSS refuses to expose).
  - **D — Board → conscience `focus` moment.** ≥4 FEATs in Building with nothing Shipped opens a new
    `focus-loop` (L1-mvp): the "stop starting, start finishing" smell. Judge-style (the model reads the
    board and distinguishes scattered abandonment from honest parallel work before voicing), at most
    once per session, **never a gate** — and it auto-silences the moment anything ships (exit = ≥1
    shipped). Conservative threshold + auto-silence are the over-fire guards.
  - **E — Lightweight priority.** Optional `priority: high` in FEAT/IDEA frontmatter floats a card to
    the top of its column (a `⬆` marker) and leads `--next` — **one level, frontmatter-true, never a
    drag-to-reorder.** Deliberately no P0/P1/P2 ladder (that turns the board into a planning surface you
    tend instead of ship); the caveat — *re-prioritizing isn't progress; finishing is* — ships in
    `/spec`. Priority is the one explicit ordering signal layered over the default finish-first sort.
  - **HTML kanban — a real visual refresh, then a sharpening pass** (the founder asked if it could
    "feel more legit," then for stronger hierarchy): owned accent + signature dot + uppercase kicker,
    count pills, card depth/hover, **bold titles with a quiet monospace id**, **tinted backgrounds so
    aging/blocked/review cards pull the eye first**, a priority pill, the Shipped `<details>` fold —
    calm and crafted, still zero-dep / single-file / light-dark (not a startup-bro dashboard).
  - **Discipline held:** zero-dep; the model owns judgment, the CLI owns the projection. Conscience gate
    **113/0** (105 + 8 new `moment-focus` cases) and the 24 GRADED judgment evals stay green; verified
    end-to-end in `/tmp`.

## 0.65.0 — 2026-06-20

- **`relationship.md` — the venture brain's missing half: the conscience learns whether its nudges
  land (IDEA-022 / FEAT-022).** The architecture designed two model-owned files — `read.md` (the POV,
  shipped) **and** `relationship.md` (what the conscience *said* and what the founder *did* with it).
  Only the read existed; this builds the relationship log, which closes the loop the frequency ledger
  (IDEA-013) only *counts*: did the nudge **land**?
  - **`/close` writes it** — *only when the conscience actually fired this session* — a dated entry:
    what was flagged + what the founder did, tagged honestly (*landed* / *ignored* / *overrode, with the
    reason* / *pushed back and was right* — the last being the most valuable: it's how the conscience
    learns to fire better). The must-nots carry over: it logs the conscience's *own* hit rate, never
    scores the founder.
  - **The conscience reads it back to calibrate (the payoff).** When a moment fires, the hook hands the
    model a **bounded** slice of the recent log (last ~1-2 sessions) so it *adjusts instead of repeats*:
    if it's raised a point and the founder moved past it for a stated reason, it says it lighter or stays
    silent; if a past nudge landed, it builds on it. This is what makes the conscience feel like it
    *remembers the conversation*, not just the venture.
  - **CLI:** `boss brain --relationship` (view the log), `boss brain record --kind relationship`
    (stamp it; the index now carries `kind` to distinguish read vs relationship), `boss brain` surfaces
    a one-line pointer, and `boss brain forget --before <date>` prunes **both** files symmetrically
    (living memory across both).
  - **Cost + safety held:** read only when a moment is firing, bounded (~900 chars), **byte-identical
    when no log exists** → 105 gate + 24 GRADED judgment evals stay green (verified). Zero-dep; the
    model owns the prose, the CLI owns the index. **FEAT-022 (the venture brain) is now complete —
    read + relationship + index + living memory.**

## 0.64.0 — 2026-06-20

- **AI-native scaffolder — `--ai` + `/comprehend` (IDEA-022 Track 3; the last track, most guarded).**
  Scaffold from what BOSS *understands*, not just a fixed template copy — built exactly to the
  guardrail: **additive, behind a flag, the deterministic template stays the default.** `boss new --ai`
  / `boss adopt --ai` do the normal reversible scaffold, then set `aiNative` in `.boss/config.json` and
  point at a new model-driven **`/comprehend`** skill (L0). The CLI never calls a model (zero-dep, layer
  1) — the comprehension is the skill's job (same predicate/runner split as `/import`). `/comprehend`
  reads what BOSS can honestly understand (an adopted repo with the wide context · the captured idea +
  `docs/source/` · or nothing-yet → it says so and stops), then **non-destructively**: fills the
  `AGENTS.md` overview with a real read, **seeds the venture brain** with an honest first dated read
  (so the conscience has continuity from day one — connects Track 3 → Tracks 0/4) + stamps the index,
  and **recommends** (never auto-applies) the disciplines that fit (`/ai-first-init`, `/design-tokens-init`,
  `secrets-guard`+`/red-team`, `/persona`). **The guardrail is in the skill itself:** everything is a
  plain-text, diffable, revertable write in the working tree — *"if it can't be diffed, it doesn't
  ship"*; it never rewrites the deterministic scaffold. Verified: `--ai` sets the flag + surfaces
  `/comprehend` (and plain `boss new` is unchanged, `aiNative:false`); eval 105/0, GRADED 24.
  **IDEA-022 is now complete — all four tracks + the spine shipped.** (The fuller presence/identity
  design + the proactive presence-moment stay deliberately deferred: a new unprompted trigger is the
  over-fire risk the conscience guards against; the v0.63 voicing *is* the presence.)

## 0.63.0 — 2026-06-20

- **The conscience now voices *with* the venture brain (IDEA-022 Track 4 — "the brain, voiced").** The
  spine (Track 0) gave the brain a read; this makes the conscience **speak with it**. When a moment
  fires, the hook reads a **bounded** slice of `.boss/brain/read.md` (the standing summary + the single
  most recent dated read — continuity, not the whole history) and hands it to the model as a
  *Continuity* frame, so the nudge is **specific to what the conscience already understands** — the
  "how did it know that" that earns trust ("you've rebuilt onboarding three times and still haven't
  talked to a user") instead of a generic line. The instruction is explicit: voice *with* the read,
  don't read it back as fact, and **trust what you see now over the brain** (the founder can correct
  it). **Cost + safety held:** the brain is read **only when a moment is already firing** (past the
  silent early-exit — never every prompt), bounded to ~1400 chars, and **byte-identical output when no
  brain exists** — so the **105 gate evals + 24 GRADED judgment evals stay green** (verified; the
  judgment fixtures have no brain, so they're unaffected). The proactive "presence moment" (the
  conscience surfacing its read unprompted) is deliberately **not** built — a new always-on trigger is
  the over-fire risk the conscience itself guards against; the voicing *is* the presence. **IDEA-022:
  Tracks 0, 1, 2, 4 now shipped; Track 3 (AI-native scaffolder, flag-guarded) is the last.**

## 0.62.0 — 2026-06-20

- **`/red-team` — turn BOSS's defenses into evidence (IDEA-033 #3; the "defense → measured" Anthropic
  move).** `agent-security` is *prevention* (the deny-list floor, secrets-guard ceiling, Rule of Two);
  `/red-team` is *proof*. A new **L1 skill** that adversarially tests an AI-mediated FEAT (or BOSS's own
  conscience hook, `--self`) against the **OWASP 2025 LLM Top 10** — prompt injection (direct +
  indirect), sensitive-info disclosure, improper output handling, excessive agency, system-prompt
  leakage, vector weaknesses, misinformation, unbounded consumption, supply chain, data poisoning. Each
  category gets a **binary pass/fail + the attack that proved it**; **failures become `/evals` cases**
  (defense → test → regression-proof), pairing with `/evals` (correctness) and the agent-security
  practice (prevention). Cohort-aware (domain-expert gets the full battery + escalation route;
  first-product gets the high-value subset in plain language). Honest scope line every run: red-teaming
  lowers risk, it doesn't certify safety; the deterministic deny-list floor stays the load-bearing
  prevention. Registered in L1; `boss map` + cheatsheet updated; eval 105/0.

## 0.61.0 — 2026-06-20

- **Scouted skillsmp.com; routed two Anthropic skills through `/vet` → `/boss-learn` (dogfood).** Five
  marketplace skills reviewed against BOSS's own machinery; the on-principle move was to *vet, not
  hand-absorb*. Two earned an ADAPT, three did not. **What landed:**
  - **`library/practices/skill-authoring.md`** (new) — from Anthropic's `skill-creator` ([RVW-013](../docs/research/verdicts/RVW-013-skill-creator-authoring-discipline.md),
    ADAPT). Fills a real void: BOSS authors skills as its core motion but had *no* written authoring
    discipline. Captures the three transferable principles — explanatory-over-prescriptive (the
    IDEA-014 / Principle #2 stance applied to *how we write skills*), progressive disclosure, and
    descriptions that earn their triggers — plus a ship-time self-check. The heavy with/without
    **eval-harness is deliberately left out** (duplicates `/vet` + `conscience-evals/`); deferred to IDEA-033.
  - **`design-system.md` → "Aesthetic ambition — past the slop default"** — from Anthropic's
    `frontend-design` ([RVW-014](../docs/research/verdicts/RVW-014-frontend-design-aesthetic-ambition.md),
    ADAPT). The practice owned the *discipline* axis (tokens, the 47 blues, missing states) but was
    silent on the *taste* axis. Adds the anti-AI-slop stance, the five aesthetic dimensions, and a
    one-paragraph design-thinking pre-pass — **bounded by BOSS's restraint** (a11y + five states + perf
    are floors; minimalism is the safer default for a green founder, against the source's maximalist lean).
  - **Three rejected, recorded:** `ui-ux-pro-max` (checklist mined into IDEA-033; CLI+DB machinery
    rejected — zero-dep ethos), obra/superpowers `brainstorming` (its "every project, no exceptions"
    is the literal anti-thesis of BOSS's JIT bet; two micro-techniques harvested to IDEA-033),
    `code-reviewer` (already dominated by Claude Code's own `/code-review`).
  - IDEA-033 backlog extended (items 6–8: skill-eval harness, UI/UX pre-delivery checklist, `/spec`+`/consult`
    question-discipline audit) — each earn-it-gated, not green-lit.

## 0.60.0 — 2026-06-20

- **`docs/PATTERNS.md` — the patterns writeup (the packaging "cool" move, documented).** A public-facing,
  builder-audience doc that names the engineering patterns BOSS is built on, **framed in Anthropic's own
  2026 vocabulary with real numbers** — the highest-resonance, lowest-effort move from the Anthropic-appeal
  research (it's *packaging* what BOSS already has, not new engineering):
  - **The conscience separates the doer from the judge** (their #1 2026 motif) — a deterministic
    `UserPromptSubmit` hook (438 lines, **zero model calls of its own**) that gates, then hands the model
    a *bounded* read in a *fresh* context. Unprompted + isolated.
  - **Two eval surfaces, with numbers:** 105 deterministic gate cases / 0 failures + **24 GRADED**
    LLM-judge cases (separate pass, transcripts read).
  - **Progressive-disclosure skills:** 29 skills, **~1.7k tokens avg** (< Anthropic's 5k guidance),
    loading JIT (~100-token description until invoked).
  - Dormant-by-default hooks + frequency-not-tokens cost ledger; security lineage (deny floor →
    secrets-guard ceiling → Rule-of-Two) stated honestly; AGENTS.md portability; persona-as-both.
  - **The honest limits are not buried:** zero real founders (its own canvas's 100%-risk), the conscience
    is Claude-bound, a synthetic judge is still synthetic. (Anthropic rewards honest framing over theater.)
  Linked from the README ("building agent tooling yourself?"). Ships (tracked doc). No behavior change.

## 0.59.0 — 2026-06-20

- **Venture-brain living memory — the write/evict side (IDEA-022 Track 0; the research's #1 capability
  gap).** The brain spine (`boss brain` + `record`, model-owned `read.md` + CLI-owned `index.json`)
  had the *read* side; this adds the **write/evict** side the 2026 gaps research named as the biggest
  upgrade (Anthropic's memory tool + context editing: +39% / 84% fewer tokens) — and which `brain.js`
  itself named as next. **Living memory ≠ infinite memory:**
  - **`boss brain --diff`** — the read's *evolution* (date + headline per session, from the index):
    continuity made visible without dumping the whole prose.
  - **`boss brain forget --before <date>`** (or `--id <bN>`) — the **evict** side: drops dated reads
    older than the date from `read.md` + prunes matching index entries, **keeping the standing summary
    (preamble) + recent reads**. Founder-invoked, *never automatic* — it's an opinion about a person,
    so only the human prunes it (on-principle).
  - **Recency-window gate** (8 sessions) — `boss brain` nudges toward compression/eviction when the
    read gets long, so the always-loaded surface stays lean (the bloat the conscience itself warns
    against).
  - **`/close` pairs the model side:** when the read spans many sessions, fold the oldest reads'
    lasting conclusions into the standing summary at the top, drop the verbatim old blocks. The
    standing summary survives; dated blocks are working history that ages out.
  Additive to the parallel-session spine (no existing behavior changed); zero-dep, format-based block
  handling (CLI owns boundaries, model owns content); verified in `/tmp` (diff, evict-preserving-
  preamble, gate); eval 105/0. **IDEA-022: Tracks 1+2 + the Track-0 spine's living-memory increment now
  shipped; Track 4 (fuller voicing) + Track 3 (AI-native scaffolder) remain.**

## 0.58.0 — 2026-06-20

- **Scaffold `AGENTS.md` — host-neutral, fixes a self-contradiction (IDEA-032).** The clearest cheapest
  miss from the 2026 gaps research: BOSS scaffolded **Claude-only `CLAUDE.md`**, locking every venture
  to one host — against its own [IDEA-006](../docs/ideas/IDEA-006-conscience-host-portability.md)
  host-portability principle + Principle #5 (optionality). Fixed the way **Anthropic's own docs
  recommend** (verified via `code.claude.com/docs/en/memory`): `AGENTS.md` carries the host-neutral
  working rules + conventions (read directly by Codex/Cursor/Copilot/Devin/…); `CLAUDE.md` is a thin
  Claude-specific layer that **imports it via `@AGENTS.md`** (loads into context at launch — no
  duplication, no drift) and adds the skills/conscience/mode-ladder below. `boss new` emits both;
  **`boss adopt` handles every case non-destructively** — bare repo → both copied; existing CLAUDE.md
  → preserved + an adopt block that `@AGENTS.md`-imports the (now-present) rules; existing AGENTS.md →
  preserved + BOSS's working rules appended as a marked block. New reusable `appendMarkedBlock` helper.
  Verified all four cases in `/tmp`; eval 105/0; `npm pack` ships `AGENTS.md`. **A concrete
  down-payment on IDEA-006 + an Anthropic-appeal signal (portability is the property they evangelize).**

## 0.57.0 — 2026-06-20

- **`/consult` — convene the mentor board on a cross-cutting question (IDEA-022 Track 2).** Some
  decisions don't belong to one mentor (raise-vs-bootstrap touches fundraising + business + GTM +
  humane at once). A new **L1 skill** that orchestrates the individual `mentor-*` agents: route the
  question to **only the mentors with a stake** (read the installed board from `.boss/manifest.json` —
  it grows by mode), get each take **in its own lens** (grounded in the canvas/RESUME/FEAT, pushback
  included), then **synthesize with the disagreement kept visible** — *where seasoned advisors disagree
  is where the real decision lives; never average them into mush.* `mentor-humane` keeps its standing
  **override authority**; the synthesis ties back to the canvas's riskiest assumption and **hands the
  call back to the founder** (advisory, never a gate; record which lens you followed + why). Reads/
  writes the venture brain (`.boss/brain/`) when present (IDEA-022). Registered in L1; `boss map` +
  cheatsheet updated; eval 105/0. **IDEA-022 progress:** Track 1 (`boss adopt`, v0.56) + Track 2
  (`/consult`, v0.57) now shipped; Tracks 3-4 (AI-native scaffolder, venture-brain voicing) remain.

## 0.56.0 — 2026-06-20

- **`boss adopt` — bring BOSS into an already-started repo, non-destructively (IDEA-005; Track 1 of
  IDEA-022).** The largest realistic adoption path — most founders have a repo *before* they hear about
  BOSS — and the one people kept asking for. `boss adopt [--mode <m>]` in an existing dir: copies only
  what doesn't collide (a new `cpSafe`/`applyStageSafe` — **never `cpSync`'s clobber**), merges the
  conscience-hook registration into an existing `settings.json` *additively* (the founder's permissions
  + their own hooks preserved), appends a small marked block to an existing `CLAUDE.md` (or copies the
  template's if there is none), stamps `.boss/` as **not-self-hosted + adopted**, and registers it.
  **"Lite BOSS" is the design, not a fallback (Principle 2):** defaults to the lightest register
  (Quickstart); `--mode mvp` adopts the *full chain* (lays down Quickstart's foundation too, exactly as
  `boss new` + `boss unlock mvp` would) for a brownfield app that's already earned it. Idempotent
  (refuses re-adopt → points at `boss sync` / `boss unlock`). Once adopted it's a normal registered
  project on the usual sync loop — no special-casing. Verified end-to-end in `/tmp`: a real repo's
  `CLAUDE.md`, `settings.json` (custom permission + `Stop` hook), `README`, and `src/` all preserved;
  conscience loops + hook land so it can fire; `boss map` works; `--mode mvp` lays L0+L1. eval 105/0.
  Wired into `boss --help`. **This is also IDEA-022 Track 1** — the living conscience needs a venture
  to read, and adopt is how an existing one gets a venture brain.

## 0.55.0 — 2026-06-20

- **`/persona` — your app's target-user as a consultable agent voice (IDEA-031).** Occasioned by
  Ajesh: *"if I wanna build an app for moms to track chores, the first persona is moms… we can do a
  Q&A with the builder, online research, or a UX researcher drops their research in… the app uses it
  as an agent voice to guide product decisions"* — *"its also the QA, its both right?"* A new **L0
  skill**: **derive** the primary target-user persona from the idea → `docs/personas/<slug>.md`
  (who · context · jobs · pains · values · *what we don't know yet* · synthetic/real evidence ledger);
  **enrich** from four sources (builder Q&A · `deep-research` online · drop-in real research via
  `/import` · passive read of idea/canvas); **consult** in voice in **both directions** — *guidance*
  ("would she want X?") and *QA* (Husain-discipline structured reactions on a build, comparable across
  versions). **The discipline is the product:** every consult is framed as a *pre-filter, never
  validation* — balances interest with concerns, names its blind spots, and closes with the
  go-ask-a-real-one caveat (Fitzpatrick/Mom Test); synthetic shrinks as real grows, visibly. Reuses
  [IDEA-009](../docs/ideas/IDEA-009-proto-personas-as-evolving-instruments.md)'s evolving-instrument
  methodology pointed at the *founder's* users (vs. BOSS's internal cohort instruments). Registered in
  L0; `boss map` + cheatsheet updated; eval 105/0.
- **`/prototype` refined by its own persona-reactions pass (IDEA-009 instrument working).** Ran the 4
  BOSS-internal personas on the new features (`/prototype`, kanban, upstream conscience); the
  convergences drove real fixes: (1) the after-run nudge now leads with a **concrete plain-language
  action** and lets *"I don't know yet"* be a fine answer (beginners bounced on `/canvas` /
  "pressure-test" jargon); (2) the **5-token pass is skipped on throwaway sketches** by default
  (eng-builder caught it contradicting "tangible beats pretty"); (3) **`--stack=<x>`** is now a
  first-class option + the stack pick is narrated in plain words for beginners; (4) trimmed the
  defensive over-explanation (dropped the "not vibe coding" protest; sketch-vs-MVP named once; the
  "becomes the MVP" rule now names the *real* failure — bolting auth onto throwaway code). The
  build-integrated eval channel caught design issues before a real founder hit them — first evidence
  for IDEA-009's claim #1.

## 0.54.0 — 2026-06-20

- **Upstream conscience — `/spec` now asks "is it worth building?" not just "is it built right?"
  (IDEA-026 Part A, closes IDEA-026).** The biggest *conceptual* delta from the 2026 leader scan
  (Ng's "PM bottleneck," Appleton's "align before the agent runs"), shipped the small + safe way the
  host-subtraction audit found: **not a new always-on loop, a voice-sharpening of the existing
  `spec-loop` restraint** (which already fires, skill-invoked, when the founder reaches for `/spec`
  before the canvas closes). The restraint frame now surfaces the *substantive* gap — *who is this
  for, and what's the bet that could sink it?* — not a checklist. **Respects `/prototype`:** a
  throwaway sketch needs none of this (build-first is legitimate); the question fires only when
  committing to build *for real*. eval gate 105/0 (skill-voice change, no predicate change).
- **Positioning reframe — README opener now leads with the judgment gap (option C).** *"Everyone can
  build now. Almost no one can tell a real business from a convincing demo. BOSS is the conscience
  that keeps you honest while you move fast."* + the floor/ceiling subline (*vibe coding gets you a
  demo; the discipline on top gets you a business*). The 2026-vocabulary update to positioning
  (harness-is-the-moat / agentic-engineering-is-the-discipline), in BOSS's voice. Full draft +
  rationale in the gitignored `docs/dossier/positioning-reframe-2026.md`.

## 0.53.0 — 2026-06-20

- **`/judge-traces` — the deliberate reader for the trace substrate (IDEA-025 Phase 2).** v0.48 shipped
  `auto-log` (collects `.boss/trace.jsonl`); this is the skill that *reads* it — completing a
  shipped-but-inert capability (a substrate nothing reads has no purpose). A new **L1 skill** applying
  Hamel/Shankar's 2026 discipline to the founder's *own* sessions: read real traces → factual shape
  first (cheap, deterministic) → sort failures into a **binary** pass/fail taxonomy (`wrong-files`,
  `thrash`, `silent-scope-creep`, `no-trace-of-the-point`, or your own) → route *recurring* modes to
  `/boss-learn`. **One expert not a committee; don't grade its own homework (judge the trajectory);
  counts are the signal.** Graceful degrade: no trace → honest "nothing to judge yet, turn on
  `auto-log`," never a fabricated taxonomy. **Collection ≠ judgment** stays load-bearing: `auto-log`
  collects passively, `/judge-traces` judges deliberately — never fused into an always-on auto-grader.
  Registered in L1; `boss map` + cheatsheet updated; eval 105/0.
- **Host-subtraction audit drafted (IDEA-028) + an IDEA-026 Part A finding (workspace docs).** The
  `mentor-architect` pass concluded **retire nothing**: BOSS's conscience fires *unprompted/event-driven*,
  and native `/goal`/`/loop` are *user-invoked* — they can't replace a conscience that speaks when you
  wouldn't have asked, so the host did *not* absorb the loop runtime (the moat). Sit-on the host for
  future orchestration (dynamic Workflows) + the secrets ceiling (auto-mode hard-deny); keep the
  `permissions.deny` floor (more portable). **Bonus finding:** `spec-loop` already implements most of
  the "upstream conscience" (IDEA-026 Part A) — it fires restraint when the founder reaches for `/spec`
  without the canvas closed — so Part A is a *voice sharpening of spec-loop*, not a new `worth-building-loop`
  (which would redundantly overlap spec-loop + caution + drift). Left for Ajesh's eye on the exact
  voice (it touches conscience tone). No code retired; decision-input only.

## 0.52.0 — 2026-06-20

- **`/prototype` — drop an idea, hit go, see something tangible (IDEA-030).** Ajesh's framing settled
  the design: *"not just vibe coding, but not gatekeeping until so much thought… building first in a
  lean cycle is a place to start, not waiting until the other two are clear. People can fill in the
  missing pieces after they get the gist out of their head and see something tangible."* A new **L0
  skill** that builds the smallest runnable, clickable version of an idea — the ONE core interaction,
  in whatever stack gets to "click it" fastest, mock data freely, the 5-token distinctiveness pass so
  it doesn't look generic — then runs it. **The load-bearing call:** the conscience fires **AFTER** the
  thing runs ("there it is — does seeing it change the idea? when you're ready: `/canvas`"), **never a
  gate before** — building first *is* a legitimate first move in the loop, not a skip of it. Cohort-
  aware (first-product gets the magic moment; eng-builder gets stack control; domain-expert gets the
  "this is a sketch, not a regulated tool" guardrail up front). Honest framing held: it's a *sketch to
  think with, named once, not your MVP* — and the graduate ladder (`unlock mvp` → `/spec` → `/evals`)
  is what keeps a fast prototype from becoming a pseudo-app (PRINCIPLES). Registered in the L0
  manifest; `boss map` + cheatsheet updated; eval 105/0.

## 0.51.0 — 2026-06-20

- **Visual kanban (`boss board --html`) + a voice-tightening pass.** Two founder-experience asks.
  - **`boss board --html` — the board, as a visual kanban.** Ajesh: *"having a visual kanban state
    that can be updated when the board is is super helpful."* Promotes the HTML view IDEA-015 deferred
    behind an earn-it gate. Same **pure projection** as the terminal board (`collectBoard`) rendered to
    a self-contained `.boss/board.html` — zero deps, no server, no JS framework; four columns
    (Captured / Taking shape / Building / Shipped), cards with id + title, `↻ review due` + `blocked`
    flags, the evidence line + riskiest-assumption framing on top, light/dark, responsive. Opens in
    the default browser (best-effort; the printed path is the contract). "Updated when the board is" =
    re-run it — it's a read of the files, never a maintained doc (the IDEA-015 discipline holds). Wired
    into `boss --help` + `boss map`.
  - **Voice pass (voice-keeper full audit — verdict: "in remarkably good shape").** Applied the
    high-leverage fixes: dropped the `🎯` emoji that shipped into the founder's own canvas template;
    unified the cohort question wording so `/welcome` and `/boss` are *actually* identical (they
    claimed to be); settled the self-description on **"build tool"** (not "build companion" — the
    ethos is conscience/tool, not coach); collapsed the most-read `boss new` first-run lines to one
    bold path + demoted fallbacks (matching `/welcome`'s own discipline); collapsed the `boss insights`
    triple-stated telemetry footer; dropped an inside-baseball `/ai-cost` wink in `boss conscience
    cost`; de-"coach"-ed the README mentor line against the settled ethos; added `boss brain` +
    `boss insights` to the `boss map` standing-controls so the live cheatsheet agrees with `--help`.
    (Kept the maintainer-only `Learned … UP` vocabulary deliberately — UP/DOWN is load-bearing
    Principle-1 language and the reader there is always the maintainer.)
  - **Captured (not built): [IDEA-030 "drop an idea and hit go"](../docs/ideas/IDEA-030-drop-an-idea-hit-go.md)** —
    a fast path to a runnable prototype. Philosophically loaded (the pseudo-app trap is *why BOSS
    exists*), so captured with a concrete `/prototype` proposal + the resolution (see-it-not-sell-it,
    conscience-attached, the graduate ladder as the honesty mechanism) and four shape questions for
    Ajesh — a decision to take together before building.
  - Eval gate 105/0; judgment GRADED; HTML render + voice fixes verified end-to-end in `/tmp`.

## 0.50.0 — 2026-06-20

- **Close the trends-pass loose ends (IDEA-027 #4 + IDEA-026 Part B wiring).** Ajesh's audit prompt —
  *"did we miss anything else to implement? you did a lot of lookup."* Two genuine loose ends from the
  research, both now closed:
  - **`boss board` surfaces "review due" — the trigger half of `/revalidate`.** v0.48 shipped the
    revalidation *gate* but nothing *surfaced what to revalidate* — a half-feature. The board now reads
    each item's `next_review:` frontmatter and flags any whose date has passed (`· ↻ review due`) plus
    a footer line `↻ N past review — run /revalidate <id>`. **Frontmatter-true, never guessed:** no
    `next_review` date → not flagged (an age-inferred "stale" signal would be noise the founder learns
    to ignore). Completes the dhun-ported revalidation lifecycle; `boss board` stays a pure projection
    (no new state).
  - **Agent security wired JIT into `/ai-first-init` (Step 5.5).** v0.49 shipped `agent-security.md` as
    an UP practice, but founders don't read `library/` — so the lethal-trifecta / Rule-of-Two framing
    now surfaces *in the AI-native day-one sequence* (one sentence on a Quickstart; more ceremony as
    the app reads untrusted input / handles regulated data). Names the surface, points at the
    `permissions.deny` floor + `secrets-guard` ceiling + the deterministic-guard rule.
  - Eval gate 105/0; judgment GRADED + no blocking failures; board staleness verified end-to-end in
    `/tmp` (past-review flagged, future-review not). **Honest remaining map (deliberately staged, not
    missed):** IDEA-025 P2/P3 (`/judge-traces` + trace-fed learn loop — need accumulated traces),
    IDEA-026 Part A (upstream conscience — needs the IDEA-028 host-mount), IDEA-028 host-subtraction
    audit (a decision to take *with* Ajesh, not autonomously), AGENT_DOC_MAP (until two agents
    collide), the SDD-vocabulary + "agentic-engineering" positioning reframes (mentor-pitch territory),
    and publishing the library on the open Skills standard (IDEA-006 distribution).

## 0.49.0 — 2026-06-20

- **Embed the 2026 best-practices — design, evals, security feel current across the board (IDEA-029 +
  IDEA-026 + the trends pass).** Ajesh's follow-on to v0.48: *"on all research you surfaced (not just
  design), let's ID all critical to add to our current work, and just go and embed it… make BOSS feel
  very up to date with best practices."* Where v0.48 shipped the dhun *machinery*, this embeds the
  *thinking* into the surfaces founders actually touch. Provenance:
  [SESSION-2026-06-20-ui-design-scan](../docs/research/sessions/SESSION-2026-06-20-ui-design-scan.md).
  - **`/design-tokens-init` — the 5-token distinctiveness pass + DTCG/semantic naming (the design
    win).** Three layers already prevented *drift*; the new section prevents *sameness* — the
    "shadcn trap" (slate/Inter/8px/indigo = generic-AI-app look) broken by five deliberate overrides
    (warm neutral · intentional radius · type pairing · one owned accent · **one "signature token"**),
    cohort-aware. Plus: name semantic tokens by **purpose not hue**, emit **W3C DTCG** where the stack
    allows (portability, no lock-in), and **inline a semantic→primitive map into CLAUDE.md** so the
    agent inherits the brand on every turn. (freedesignmd · Vercel · Curtis · W3C DTCG.)
  - **`/evals` — the 2026 Hamel/Shankar sharpening.** Error analysis on **real traces** first (and a
    pointer to v0.48's `.boss/trace.jsonl` as that raw material); **binary pass/fail, not 1–5 scores**;
    **one expert, not a committee**; **don't let the model grade its own homework** (separate verifier
    + trajectory-not-just-endpoint); a **60/30/10** deterministic/judge/human cost hierarchy.
  - **New UP practice `library/practices/ai-ux-patterns.md`** — the interaction layer (where
    `design-system.md` owns the look): "why this" rationale grounded in the user's own inputs ·
    confidence-as-register · **Notify/Question/Review** interrupt registers · **edit-before-execute +
    risk-tiered gates** (four decision verbs; gate by loss type) · **trust-repair after a miss**
    (asymmetric recovery) · progressive disclosure · **discernment — knowing when not to speak — as a
    first-class fundamental** · pinned canonical refs (Shape of AI / HAX / IBM Carbon; community
    catalogs via `/vet`). Captured as [IDEA-029](../docs/ideas/IDEA-029-ai-native-interface-patterns.md),
    extends IDEA-010.
  - **`docs/mentor-practitioners.md`** AI-UX heuristics block updated with the 2026 additions +
    pointer to the new practice.
  - Library-layer + skill-content changes (no new template skill, no CLI change); eval gate 105/0,
    judgment GRADED + no blocking failures; `boss new` + `unlock mvp` verified the upgraded skills
    ship. **Staged from the design scan:** planning-as-collaboration / mid-run steering (Appleton —
    twin of IDEA-026 Part A), RESUME-as-agent-inbox, wrapper-vs-flatten-per-cohort.

## 0.48.0 — 2026-06-20

- **The 2026-trends + dhun-scan pass — first builds (IDEA-025/027/026).** Occasioned by Ajesh:
  *"with all the latest trends since we built BOSS… as well as potential new methods inside dhun, let's
  assess what BOSS can better improve upon."* Three research passes (external 2026 trends; a 2026-only
  scan of the named practitioners in `docs/mentor-practitioners.md`; a full catalog of the sibling
  **dhun** project's working-method machinery) → captured as
  [IDEA-025](../docs/ideas/IDEA-025-trace-native-conscience-and-evals.md)…028 with full provenance in
  [SESSION-2026-06-20](../docs/research/sessions/SESSION-2026-06-20-trends-and-dhun-scan.md). This
  release ships the concrete, proven, low-risk slice; the conceptual reframes (upstream conscience,
  host-subtraction) stay specced-and-staged. **Three new dormant/UP capabilities — no behavior change
  until opted in:**
  - **`auto-log` trace substrate — the keystone, shipped dormant (IDEA-025 Phase 1).** A zero-dep Node
    SubagentStop hook (`library/hooks/auto-log.js` + L1 template) that appends one honest line to
    `.boss/trace.jsonl` per writer-subagent — session, agent, files actually changed (reads
    `git status --porcelain`, so it catches *new* files too, not just tracked diffs), with last-line
    dedup and read-only-agent skip. **The within-session complement to v0.47's `boss insights`**
    (cross-project registry): both honest-trace, local-only, append-only, measure-don't-instrument
    (inherits the IDEA-021/013 contract). It's the raw material a future trace-native judge
    (`/judge-traces`) + sleep-time learn loop read — Hamel ("error analysis on real traces") + Chase
    ("traces, not code, are the source of truth"). **Dormant** (a SubagentStop hook costs per-subagent
    latency — registration is the opt-in, same as `secrets-guard`).
  - **`memory-cue` hook — feedback→memory nudge, shipped dormant (IDEA-027 #1).** Ported UP from the
    dhun dogfood, Node-ported for the zero-dep rule (`library/hooks/memory-cue.js` + L0 template). A
    UserPromptSubmit hook that regex-detects a feedback signal (directive / corrective / confirmation)
    and *nudges* the model to save it to memory — never auto-writes (wording needs reasoning), silent
    on no-match (zero token cost). Serves the `library/memory-seed/` ambition.
  - **`/revalidate` — the 3-line gate against zombie features (IDEA-027 #2).** A new L1 skill (+
    `library/practices/revalidation.md`) ported UP from dhun's REVALIDATION lifecycle: before paused
    work re-enters the build, answer *still relevant? still aligned? anything changed?* → revive /
    rescope / kill / re-pause. BOSS eats it first — `docs/RESUME.md` carries a long deferred list.
  - **Two new UP practices** distilled from the same scan: `library/practices/quality-ratchet.md`
    (dhun's `.ratchet` one-way-baseline pattern, stack-neutral) and `library/practices/agent-security.md`
    (Simon Willison's 2026 lethal-trifecta / "Agents Rule of Two" / "deterministic guard around a
    non-deterministic model" — IDEA-026 Part B, the next ring after `secrets-guard`).
  - Zero-dep held (Node built-ins only; `npm pack` verified — all new files ship). Hooks dormant
    (settings.json unchanged; only `conscience.js` registered). `boss map` shows `/revalidate`;
    eval gate clean (no blocking failures); judgment GRADED 7/7; tested end-to-end in `/tmp`
    (`boss new` + `boss unlock mvp`, both hooks present + dormant, skill present).

## 0.47.0 — 2026-06-19

- **Humane two-way learning channel — built the moment BOSS went public, the humane way (IDEA-024).**
  Going public (MIT, github.com/ajeshh/bossbuild) turned a private dogfood into a thing strangers
  run, which needs a way to learn + pivot. Ajesh asked for "feedback from end-users, and learn
  *passively* how users use it." The second half is the exact surveillance line BOSS exists not to
  cross ([IDEA-021](../docs/ideas/IDEA-021-passive-instrumentation-and-fleet-learning.md)). Applied
  BOSS's own conscience (mentor-humane fork; PRINCIPLE: humane before viable) and built the honest-trace
  version instead — **no silent telemetry.**
  - **`/feedback` (direct, user-initiated).** A founder-facing skill in L0: send a bug / confusion /
    wish back upstream. Shows the founder the exact title + body + the *one* line of context
    (`BOSS <ver> · <mode> · <OS>`) before anything leaves the machine; files a GitHub issue via
    `gh issue create`, or falls back to a prefilled issue link to paste. Public-repo warning stated.
    Never automatic, never a hook.
  - **`boss insights` (passive, the humane way).** Reads the trace your own work *already leaves* —
    your registered projects on *this machine* — and reports where each venture's loop stands
    (idea → canvas → build), flagging empty / untested / stale. **Measures graduation + loop-closure,
    never activity/engagement** (the vanity metric BOSS refuses to expose). Local-only; nothing is
    sent. Zero-dep (`src/insights.js`).
  - **Opt-in share-up contract.** New `shareUp: false` default in `.boss/config.json` — any future
    cross-user learning is gated on this flag being true *and* a per-send confirmation, by construction.
    Telemetry is never a default.
  - **Not built (deferred, named in IDEA-024):** silent cross-user telemetry (the line — not crossing
    it); a full `npm publish` / auto-update pipeline (premature at n≈1 — `boss status` already nudges
    on version drift; the real risk is demand, not distribution). Captured in
    [SESSION-2026-06-19-founder-test](../docs/research/sessions/SESSION-2026-06-19-founder-test.md).

## 0.46.0 — 2026-06-19

- **Bring-your-own-material import — the on-ramp from "I jotted it somewhere" (IDEA-023).**
  Occasioned by a live founder-test: a founder ran `boss new`, then stalled — the idea lived in a
  Word doc / Google Doc / Obsidian note / PDF / deck / URL, and there was **no way to bring it in**.
  A correctly-scaffolded but idea-less project read as *"empty… I'm stuck."* This closes that
  first-run dead-end.
  - **Load-bearing decision:** import lives in the **skill layer, not the zero-dep CLI** — the CLI
    (Node built-ins only, Principle 4) can't parse PDF/docx or fetch a URL, but the model already
    reads heterogeneous formats natively. Same predicate/runner split as the loop runtime (IDEA-008):
    deterministic core stays deterministic; the model does the parsing + shaping.
  - **What ships:** (1) `/boss` §1 now ingests **one-or-more sources** — local files *and* URLs, in
    any mix — snapshots a durable copy of each into `docs/source/` ("the project owns a copy"), and
    synthesizes across all of them before shaping the idea. (2) A new **`/import`** skill (registered
    in the L0 manifest) for adding material to an *already-captured* idea, or as an alternate spin-up
    door. (3) **Discoverability fix** — the part that actually stuck the founder: `boss new`'s "Next:"
    block now shows `code <name>` (editor handoff) + the file/url/import options; `/welcome` (both the
    full tour and the 30-second version) and the L0 `CLAUDE.md` template all advertise bring-your-own
    material.
  - **Deferred (named in [IDEA-023](../docs/ideas/IDEA-023-bring-your-own-material-import.md)):**
    material-first ordering (point at material → BOSS names the folder), binary/OCR formats
    (`.pptx` text, image-only PDFs), live-source re-pull vs. one-time snapshot, and a CLI
    `boss import` second door (only if the skill path proves it's wanted outside Claude).
  - Dogfood target: `~/Projects/fraands` (the project that surfaced the gap). Surfaced + captured in
    [SESSION-2026-06-19-founder-test](../docs/research/sessions/SESSION-2026-06-19-founder-test.md)
    (OBS-002/003/005).
- **`/welcome` closes on the action — long content no longer buries the next step (OBS-001).**
  Same founder-test: *"the welcome message is a bit too long… I forget what I'm supposed to do next."*
  The skill already had an "end on one next step" rule, but the beginner tour printed three full
  reference sections (conscience / modes / help) *after* the next step, walling it off. Fix: a new
  voice rule ("close on the action — long content must tie back to the next step"), and a structural
  **pivot** — after the shape + next step, the three reference sections are now **offered, not dumped**
  (tagged `reference — expand only if asked`); the founder leaves on `/boss` or `/triage`, not on a
  wall. (OBS-004 — host-switching across Claude app/VSCode/Cursor — logged, deferred to IDEA-006.)

## 0.45.0 — 2026-06-05

- **JIT working-context, Phase 1 — every `boss new` project is now JIT-by-construction (FEAT-020).**
  The deny-list (v0.42) made projects secrets-safe by default; this makes them *context-lean* by
  default. The principle was already vetted (`context-discipline` practice, RVW-005/010) but only
  *described* path-scoped rules — now the templates **ship** them. This is Phase 1 of a 4-phase
  lifecycle ([`docs/ideas/FEAT-020`](../docs/ideas/FEAT-020-jit-working-context-lifecycle.md)); Phases
  2-4 (`/close` GC, promote-on-evict via `/extract`, a freshness moment) are specced + deferred with
  triggers.
  - **What ships:** `.claude/rules/` examples with `paths:` frontmatter that load **only when Claude
    opens a matching file** (not at session start) — L0 `your-app-code.md` (the basic path-scoped
    pattern), L1 `feature-context.md` (the live feature's working notes, which Phase 2's `/close` will
    later compress to a one-liner). The two-memory cut that decides what goes where is documented in
    the new `library/memory-seed/` shelf (README + an example durable-facts seed). L0 `CLAUDE.md`'s
    Memory line now names both halves (durable → auto-memory; working-state → path-scoped rules).
  - **Verified before building:** confirmed against the official Claude Code docs (2026-06-05) that
    `.claude/rules/` with a `paths:` key is real and JIT-loaded — *not* a confusion with Cursor's
    `.cursor/rules` (`globs:`). The `context-discipline` practice's "re-verify host syntax on every
    build" rule, honored.
  - **The restraint line (carried from the IDEA):** Phases 2-4 risk being BOSS gold-plating its own
    substrate; the recency-window-by-hand is currently enough. First dogfood is BOSS's own repo — a
    Phase-1 slice going stale and misinforming a session is the cleanest Phase-2 re-open signal.
  - Zero-dep held; tested end-to-end in `/tmp` (`boss new` → rule present; `boss unlock mvp` → feature
    rule added). `mentor-architect` pass + 4 forks decided with Ajesh recorded in the FEAT.

## 0.44.0 — 2026-06-02

- **`secrets-guard` PreToolUse hook — the high-stakes ceiling, shipped opt-in (closes the RVW-005
  follow-on, the principled way).** The v0.42 deny-list is the universal zero-cost floor; this hook is
  the broader-coverage ceiling — and the v0.42.1 reconsideration said it must NOT be a universal
  default (a `PreToolUse` hook spawns a process on *every* tool call). So it ships **dormant**:
  `library/hooks/secrets-guard.js` (canonical) + `.claude/hooks/secrets-guard.js` in the L0 template,
  **not registered by default.** Registration is the on-switch (an unregistered hook costs nothing),
  recommended for the `domain-expert` / regulated cohort.
  - **Behavior:** Read/Edit/NotebookEdit of a secrets file (`.env`/`.env.*`/`secrets/**`) → **deny**
    (reading secret contents into context is the leak); Bash or MCP referencing a secrets path →
    **ask** (don't hard-block legit `.env` *creation* — surface it to the human); else allow.
    **Fail-open** (any parse/runtime surprise → allow; a guard that breaks the session is worse than
    one that occasionally misses, and the deny-list floor still hard-blocks the common vectors).
  - **Tested** (10 cases, piped PreToolUse events): denies Read/Edit of `.env`/`.env.local`/
    `secrets/`; allows `src/app.js`, `npm test`, and `.environment.ts` (no false positive); asks on
    `cat .env` + MCP-with-secrets; fail-open on malformed input. Zero-dep Node, output per the Claude
    Code PreToolUse contract (JSON `permissionDecision`, exit 0).
  - **Cohort auto-registration deferred** (a clean follow-on): wiring `domain-expert` cohort setup to
    register it automatically. Today it's documented opt-in (snippet in the file header + the
    `context-discipline` practice).

## 0.43.0 — 2026-06-02

- **Wayfinding, Pass 1 (IDEA-018) — `boss map` + a doc generator that can't rot.** Occasioned by a
  docs-health pass that found the README **19 releases stale** and, worse, that there was **no "how to
  use BOSS" guide at all**. The fix is shaped like BOSS itself: wayfinding, not a manual. Decisions
  locked with Ajesh — **mode ladder is the spine** (persona = entry filter, aspect = which mentor to
  ask, never chapters); **split audience** (a command ships to founders, the prose stays in the BOSS
  repo); **durable core first**.
  - **`boss map`** (CLI, ships to every project) — the *live* cheatsheet. A pure render of state the
    project already holds (the `.boss` stamp + installed `SKILL.md` files), in the `boss board`
    spirit: *You are here · available now (grouped by the rung that unlocked each skill) · one unlock
    away (the next rung's skills, read from the package, with the real project name substituted in) ·
    standing controls.* Nothing to maintain, nothing to drift.
  - **The de-rot mechanism** — `src/modes.js` is the single source both `boss map` and the generator
    read (manifests + `SKILL.md` frontmatter), so the live map and the static docs can never disagree.
    **`scripts/gen-docs.js`** (`npm run gen:docs`) emits **`docs/CHEATSHEET.md`** (the whole ladder,
    the wall-poster) and **`docs/SKILLS.md`** (one line per skill, grouped by mode) — both carry a
    GENERATED banner and are derived, never hand-typed. This is the actual fix for what bit the README:
    the per-mode lists become a build artifact, not a memory test.
  - Zero-dep held — `src/map.js` + `src/modes.js` ship; `scripts/` and the generated `docs/` stay
    dev-only (verified via `npm pack`). Eval suite regression-clean (no blocking failures, GRADED 7).
    End-to-end tested in `/tmp` (map at Quickstart → unlock mvp → map regroups + previews V1; placeholder
    substitution + width-capping confirmed). **Pass 2 (the hand-authored `docs/GUIDE.md` walkthrough)
    is the next session** — written against these generated surfaces, per the agreed sequence.

## 0.42.1 — 2026-06-02

- **BOSS eats its own context-discipline dogfood + sharpens the practice (the learning loop in real
  time).** Minutes after shipping `context-discipline` (v0.42.0), applied it to BOSS itself and
  refined it with what doing so taught.
  - **Dogfood (DOWN):** the recency-window rule (RVW-002) applied to BOSS's own `docs/RESUME.md` — the
    "State" section was a 25-entry append log read at every session start. Trimmed to the **5 most
    recent** entries; older versions point to `registry/CHANGELOG.md` (which carries all 43 versions —
    confirmed before cutting, so it's non-destructive). RESUME dropped **727 → 346 lines.** BOSS now
    practices the leanness it prescribes.
  - **Practice sharpening (the part that matters):** reconsidered the deferred PreToolUse secrets-guard
    hook and recorded *why* it's deferred, not just *that* it is. A `PreToolUse` hook fires a process
    on **every tool call** (real latency), where `permissions.deny` is a zero-cost native check. So the
    practice now states: the **deny-list is the universal floor** (always ship); a **secrets-guard hook
    is a high-stakes/opt-in ceiling** (regulated/PHI cohorts), **not** a universal default — adding
    always-on per-call machinery for marginal coverage is the framework-bloat BOSS warns founders
    against (R&H #1 / IDEA-013 cost discipline). This is `/vet`'s skepticism turned inward: even an
    ADOPT's "ceiling" gets cost-weighed before it ships to everyone.
  - No template/CLI behavior change beyond the doc + RESUME; the v0.42.0 deny-default still stands as
    the shipped safe-default.

## 0.42.0 — 2026-06-02

- **`/boss-learn` routes the sweep's first ADOPT — a "context discipline" practice, UP + a DOWN
  safe-default.** Acting on the v0.41 `/vet` sweep: the two ADOPTs (RVW-005 deny-secrets, RVW-010
  token-optimization) plus RVW-002 (lean session docs) collapsed into **one** pattern, routed two ways
  per PRINCIPLE #1.
  - **Verify-before-encode (the gate both verdicts set).** Before promoting, the version-bound Claude
    Code claims were checked against current behavior. One was **FALSE — `.claudeignore` does not
    exist** (the source post conflated it with `permissions.deny`); it was struck from the practice
    rather than shipped to every project. Confirmed: `permissions.deny` glob syntax (and that a
    `Read(...)` deny does **not** cover Bash — needs a separate `Bash(...)` rule), PreToolUse hard-block,
    `.claude/rules/` `paths:` frontmatter, CLAUDE.md load behavior. The `/vet` thesis applied to BOSS
    itself: popularity ≠ correctness, even when *BOSS* is the one adopting.
  - **UP** → `library/practices/context-discipline.md`: lean always-loaded docs (CLAUDE.md +
    RESUME recency-window), path-scoped `.claude/rules/`, `permissions.deny` for secrets *and* bloat,
    PreToolUse/PostToolUse hooks as the enforcement ceiling. Host-tagged `claude-code` with an explicit
    "re-verify syntax on host change" note (IDEA-014 recalibration). Provenance cites the RVWs — vetted,
    not adopted on stars.
  - **DOWN (product safe-default)** → the L0 Quickstart template now ships a `permissions.deny` block
    for `.env`/`.env.*`/`secrets/**` (Read + Bash) in `.claude/settings.json`, and `.gitignore` covers
    `.env.*` + `secrets/`. Every new `boss new` project is secrets-safe by default — the
    enforce-in-harness principle (RVW-012) made concrete, not left as advice.
  - **Deferred follow-ons (named, not crammed in — PRINCIPLE #2 / small steps):** a `library/hooks/`
    PreToolUse secrets-guard (catches Bash + MCP + future skills — code+test, its own step);
    mode/cohort-scoped `.claude/rules/` in the template; BOSS's own root CLAUDE.md/RESUME trim
    (RVW-002 — awaiting Ajesh's recency-window size). ADAPTs RVW-007/008 remain founder-facing/scope-gated.

## 0.41.0 — 2026-06-02

- **First `/vet --all` sweep — 10 verdicts (RVW-003…012), and the skill earned its keep.** Ajesh
  dropped a 10-item pile of AI/Claude-Code "best practices" (Reddit threads + Lenny's-newsletter posts)
  and swept them in one pass. The distribution is the proof the skill routes on merits, not reflex:
  **2 ADOPT · 2 ADAPT · 3 NOT-YET · 3 REJECT.** Only 2 clean adopts out of 10 — a skeptic, not a
  bookmark folder.
  - **The two ADOPTs collapse into ONE action — a "BOSS context discipline" practice** (the value of
    synthesizing a sweep instead of N independent verdicts). RVW-005 (hard-deny `.env`/secrets, don't
    trust prompting), RVW-010 (lean CLAUDE.md <500 tok, path-scoped `.claude/rules/`, `permissions.deny`
    for bloat, hook noise-filtering), and the earlier RVW-002 (RESUME recency-window) are facets of one
    practice; RVW-009 (context-engineering failure modes) is its research rationale and RVW-012 (Agent
    = Model + Harness, "safety lives in the harness not the model") its backing principle. Queued for
    `/boss-learn` (UP `library/practices/` + `library/hooks/` secrets-guard + DOWN BOSS's own doc trim
    + template defaults), **gated on verifying version-bound Claude Code specifics first** (IDEA-014
    recalibration territory).
  - **Two ADAPTs, both founder-facing + scope-gated:** RVW-007 (Couch-to-5K — adopt the
    smallest-next-step *philosophy* for `/welcome` + beginner-cohort nudges; **reject the daily-streak
    mechanic** as the gamification/pressure trap the canvas already refuses — a guardrail recorded so a
    future session isn't tempted); RVW-008 (categorize-agents / start-simplest — a modest
    `mentor-architect` framing, strip the enterprise + stack taxonomy per PRINCIPLE #4).
  - **Three NOT-YET:** RVW-003 (plumbing-awareness — strong founder-facing candidate, re-open when the
    founder-facing build lands), RVW-009 + RVW-012 (reference pieces — re-open at conscience
    context-injection review / IDEA-006 host-contract work respectively).
  - **Three REJECT, recorded with reasons:** RVW-004 (`/remote-control` — out of scope/low-evidence,
    but kept a humane stance on always-on agent work), RVW-006 (21-hacks listicle — wrong altitude),
    RVW-011 (n8n tutorial — PRINCIPLE #4, folded into RVW-008 as an example).
  - **A real skeptical catch:** 6 of the 10 drops were by the **same author** (one newsletter
    corpus). The sweep applied an **author-concentration discount** — cross-confirmation *within* one
    voice isn't independent evidence; the "respected practitioner" rubric rung counts once, and the
    real evidence is the *distinct* sources (the deny-secrets PSA, slaorta, StokeJar, and the
    DeepMind/Microsoft/Salesforce research cited *inside* the pieces).
  - Records: `docs/research/verdicts/RVW-003…012`; all 10 inbox items marked `resolved:`. Zero-dep held
    (`npm pack` ships 0 — all under `docs/`). No code/skill change → gate + judgment suites unaffected.
    **Nothing is built yet** — ADOPT/ADAPT hand-offs await Ajesh's go (the skill decides *whether*;
    `/boss-learn` decides *where*).

## 0.40.1 — 2026-06-02

- **`/vet` gains batch sweep — drop a pile, vet once.** From dogfooding `/vet` on real drops (RVW-001,
  RVW-002): the natural rhythm is *accumulate, then sweep*, not vet-on-arrival. `/vet --all` now vets
  every un-vetted inbox item — **each as its own full skeptical pass with its own `RVW-NNN` verdict**
  — then prints one summary table + the ADOPT/ADAPT hand-off list. No-arg `/vet` lists un-vetted items
  oldest-first and offers the sweep. Already-vetted items (a `resolved:` line or an existing verdict)
  are skipped. Clarified the old "one claim per run" rule → **"one claim per verdict"**: it always
  protected *depth-per-claim* (never collapse several claims into one shallow verdict), never forbade
  vetting many in sequence — the sweep is many full passes, not one pass over many.
- **First two verdicts on the record (dogfood):** `RVW-001` — the four-rule "Karpathy" CLAUDE.md →
  **REJECT** (BOSS already encodes all four as principles + the cohort-aware conscience; a static file
  would regress toward the frozen-rules brittleness the thread's own top critique names — which is
  IDEA-014's thesis). `RVW-002` — slaorta's lean/modular CLAUDE.md → **ADAPT** (apply the
  recency-window to `RESUME.md`'s State section, which duplicates `registry/CHANGELOG.md` and grows
  unbounded; generalizable shape is a `library/practices/` UP candidate). The REJECT/ADAPT split is
  the evidence `/vet` routes on merits, not reflex. RVW-001 also surfaced **external confirmation of
  IDEA-014** (a stranger reasoning to the recalibration thesis) — now cited in that idea.

## 0.40.0 — 2026-06-02

- **`/vet` — the skeptical inbox. The inverse of `/boss-learn`.** From Ajesh's seed: *"if i have new
  research or best practices, we should have a way where i can just drop it in, and then our mentors
  and such review and see what we should integrate. reddit is full of best practices, but that doesnt
  mean all are good ideas."* The last sentence is the whole design.
  - **Why it's the inverse, not a fork.** `/boss-learn` routes a pattern *you already proved* (built
    it, it worked, it repeated) UP into `library/` or DOWN into the app — its input has earned trust.
    `/vet` takes a claim *from a stranger* (a Reddit thread, an HN comment, a blog post, a paper, a
    "you must do X" tweet) that has earned **nothing**. Its job is the part `/boss-learn` never has to
    do: decide whether an unproven outside claim deserves to become practice **at all**. ADOPT *hands
    to* `/boss-learn` (whether → where); it never reimplements it.
  - **The filter is the product.** A drop folder with no judgment is a bookmark pile. The value is the
    skeptical read. The skill is **biased toward NO** — most internet best practices don't apply to
    BOSS, at its stage, for its thesis — and makes a claim *earn* an ADOPT.
  - **The NO-biased rubric (any one question can sink the claim):** (1) does it contradict a PRINCIPLE?
    (#6 / `mentor-humane` can veto outright); (2) evidence grade — n=1 vibe vs. pattern-with-data vs.
    respected practitioner (most claims die here); (3) duplicate or genuinely sharpen?; (4) who does it
    serve **and harm** (great for `eng-builder`, toxic for `first-product` → ADAPT-with-scoping at
    best); (5) cost/ceremony (does it make BOSS heavier — R&H #1).
  - **Four honest verdicts**, mirroring `/extract`'s UP/DOWN/NOT-YET: **ADOPT** (→ `/boss-learn`),
    **ADAPT** (modified, reasoned), **REJECT — with reason, recorded** (the quietly important one — so
    the same thread isn't re-litigated next month; the verdict log is BOSS's memory of what it
    *deliberately didn't* adopt), **NOT-YET** (with a re-open condition). Before vetting, `/vet` reads
    prior verdicts and won't re-litigate.
  - **Restraint by design (PRINCIPLE #2):** deliberate-invoke, like `/extract` and `/drift-deep` —
    **no `vet-loop`, no hook moment, no nudge to "review your inbox."** An automatic research-review
    obligation would be the ceremony BOSS exists to refuse. It also doesn't *find* research (that's
    `/deep-research`) — it judges what you bring it.
  - **Scope: internal-curation first.** `/vet` is a **BOSS-local meta-skill** (lives with `/boss-learn`
    + `/boss-sync` in `.claude/skills/`, **not** in the founder template) — it vets against
    `PRINCIPLES.md` + BOSS's own `library/` and routes ADOPT into the BOSS source. The founder-facing
    version (founder drops a thread → BOSS reads it against *their* canvas/stage/cohort) is the named
    **UP candidate** (IDEA-016), deferred until the internal version earns it.
  - Shipped: `.claude/skills/vet/SKILL.md`; drop zone `docs/research/inbox/` + verdict log
    `docs/research/verdicts/` (each with a README); new **`RVW-NNN`** ID type in `docs/IDS.md`;
    IDEA-016 captured + the two design forks decided (internal-first; single skeptical pass — the
    mentor+persona panel is the upgrade if the single pass proves too shallow). Zero-dep held (`npm
    pack` ships **0** of these — BOSS-local + `docs/`, neither in the `files` allowlist). Gate +
    judgment suites unchanged (no hook moment, no predicate change).

## 0.39.0 — 2026-06-02

- **`capture` goes judge-backed — the third model-judgment moment, and it ships GRADED from day one.**
  capture (moment #3, PRINCIPLE #1's own) fired structurally on `≥3 devlog entries + no extraction
  record` — but a count can't tell a real extraction candidate from three entries of normal in-progress
  work. That's the exact crude-predicate problem drift (v0.31) and caution (v0.33) already solved with a
  bounded-read model judgment. v0.39 gives capture the same upgrade.
  - **The judgment (strictly more restraint — capture can now only fire LESS):** the gate still opens,
    but before voicing, the model silently reads the ~5 most recent devlog entries and fires ONLY if
    there's a real candidate — a pattern built **twice** (reusable practice → UP into `library/`), a
    fix/guard hand-applied in **several places** (hardening → DOWN into core), or a manual **ritual
    repeated** enough to deserve a skill/loop. If the recent work is one-off distinct features, deep
    focus on a single still-in-progress thing, or early throwaway spikes — nothing has generalized;
    **stay silent.** The silent class is trust-critical: nudging `/extract` with nothing to extract
    earns a NOT-YET every time and trains the founder to tune the conscience out — the premature
    ceremony PRINCIPLE #2 warns against. Same shape as drift/caution: no model call in the hook, no new
    state, no predicate change — a bounded-read voicing instruction the model executes in the live turn.
  - **Shipped:** upgraded `capture` voice frame in the hook lib; `capture` added to `JUDGE_MOMENTS` (so
    the conscience-frequency ledger logs it as a judge-moment) and to `MOMENT_SIGNALS` (voice-hash
    source of truth); **`capture.judgment.yml`** (7 labeled cases — 3 should-fire-extractable
    [practice-twice / guard-in-3-places / repeated-ritual], 3 should-not-fire-nothing-yet
    [one-off / single-in-progress / spikes], 1 ambiguous [written-twice-maybe]);
    **`fixtures-devlog-extract.js`** (extractability-focused devlog corpus, distinct from drift's
    risk-focused one); `replay.js` + `regrade.js` extended with a `capture` row (the MOMENTS registry
    proves it generalizes — third moment, same engine).
  - **Graded the free way (per v0.38):** all 7 cases run through isolated reasoning-required Opus 4.8
    sub-agents; **all 7 agree with the human labels.** `replay.js` reads **GRADED 7/7** for capture
    (24/24 across drift+caution+capture). Transcripts stamped `generated_via:
    in-session-subagent-reasoned` + `harness_note`; a real `npm run regrade capture` overwrites them.
  - Zero-dep held: `npm pack` ships **0** judgment/transcript/extract-fixture files; no `src/` ref.
    Gate suite **105/0/41** (the predicate is unchanged — `moment-capture.yml` still covers detection).
    The judgment channel now covers **3 of the conscience's moments**; the remaining structural moments
    (cost / failure-mode / cost-stale) are binary facts and correctly stay non-judge (a model judge
    there would be the v0.34 cost trap).

## 0.38.0 — 2026-06-02

- **The conscience's judgment is now MODEL-VERIFIED — `drift` + `caution` read `GRADED 17/17`, not
  `NEVER_GRADED`. The hole `regrade.js` was built to close (v0.35) is closed — without an API key.**
  Since v0.32 the judgment surface (`replay.js`) shipped a labeled set + voice-hash tripwire + coverage
  floors but printed `NEVER_GRADED` loudly: the model had never actually been tested against the labels,
  so every judge-moment was structurally-checked vibes. Closing it normally needs a paid out-of-band
  `regrade.js` run (Node `fetch` → Anthropic API). We closed it the free way: `regrade.js` runs two
  model calls per case *because it executes with no model present* — but a live session **is** Opus 4.8,
  the same model it would call. Each of the 17 cases (10 drift + 7 caution) was run through an **isolated
  sub-agent** seeing only the exact voice frame + bounded read the hook injects, and the decisions
  written as transcripts in `regrade.js`'s own format.
  - **Result: all 17 decisions agree with the human labels.** The frame and the labels are
    well-calibrated; the model nails the trust-critical silent class (the on-aim cases where firing
    would be the false positive that erodes the conscience) — e.g. it reads a missing canvas
    "Experiment this week" line as a *bookkeeping* gap, not a *validation* gap, when the devlog shows
    the experiment is already running.
  - **A real methodology finding, recorded honestly:** a first, terse "output only SILENT or the nudge"
    harness mislabelled **3 of 17** — one spurious fire (on-aim drift) and two spurious silences
    (textbook feature-piling / competitor-watching caution cases). Requiring the model to do the
    "silently read… then judge" reasoning the voice frame *explicitly demands* flipped all three to
    agree with the label. The lesson: the frame's reasoning instruction is load-bearing, and how you
    elicit a judgment changes it — exactly the kind of thing the recalibration discipline exists to catch.
  - **`regrade.js` made importable** — `main()` now runs only on direct invocation; `decisionPrompts`,
    `MOMENTS`, `loadCases` are exported (so the prompt assembly is reusable/testable and can't drift
    from the paid path). `--dry-run` still green; importing the module no longer spends.
  - **Honest provenance, not a masquerade:** every transcript carries `generated_via:
    in-session-subagent-reasoned` + a `harness_note` stating it was NOT the clean `fetch` harness and
    that `ANTHROPIC_API_KEY=… npm run regrade` overwrites it as the canonical instrument. The interim
    grading is real (same model, same frame, same isolation) without overclaiming the provenance.
  - Zero-dep line held: `npm pack` ships **0** judgment/transcript files; no `src/` reference. Gate
    suite **105/0/41**; judgment **GRADED 17/17** (was NEVER_GRADED 17). The loud "not yet
    model-verified" banner is gone.

## 0.37.0 — 2026-06-01

- **`/drift-deep` — the deep, whole-project drift audit. The biggest unused 4.8 lever, now built.**
  The hook `drift` moment (v0.31) is a cheap always-on tripwire: it reads ~5 recent entries and
  asks "you named a risk, you're piling work, nothing tests it — is the recent work on-aim?" This
  is the **deliberate, founder-invoked counterpart** that a bounded read can't do: *read EVERYTHING
  I've built and tell me, across the whole body of work, whether I'm validating my riskiest bet or
  building around it.* The 1M-context "am I fooling myself across everything" check — the original
  finding from the very first 4.8 pass.
  - **Why a skill, not a hook moment:** a whole-project read can't fire per-prompt — that's the
    expensive-AI-app trap the v0.34 cost discipline guards against. So the cheap moment stays the
    everyday tripwire; this is the audit you *invoke* when you want the truth, not a glance. The
    restraint (no loop, no nudge to "run your audit") is the design — making it a recurring
    obligation would be the premature ceremony BOSS avoids.
  - **Broader than the gate** in two ways: it runs even when a validation plan exists (did you
    *execute* the experiment, or write the plan-line and drift from running it?), and it reads the
    **actual `src/` code** (what you built is the truest record of what you bet on), not just the
    devlog tail.
  - **`/drift-deep` (L1-mvp skill)** — reads the canvas (bet + plan + cells) + ALL devlog + every
    FEAT spec + `src/` structurally + the ideas; judges each body of work against the bet ("does
    this *test* the risk or build *around* it?"); reaches a verdict (on-aim / drifting / mixed) with
    confidence + named gaps + the smallest re-aim; writes `docs/drift-audits/DRIFT-YYYY-MM-DD.md`.
    Cohort-aware (vibe-virtuoso served most — ships a lot, validates little; domain-expert gets the
    who-could-be-harmed humane lens on an un-validated risk). Routes back to `/canvas` / `/pretotype`.
  - **Integration:** the cheap `drift` hook moment now points at `/drift-deep` for the full audit
    (one terse clause — the cheap nudge stays cheap). Follows the `/extract` precedent — a deliberate
    skill judgment, tested in use, not by the hook-judgment-eval surface (noted in the skill).
  - L1-mvp now ships 14 skills. Gate + judgment suites 105/0/41 (the drift voice-hash shifted from
    the pointer — the tripwire working as designed; no transcripts, so no STALE). The 4.8 leverage
    arc's last deferred item, landed.

## 0.36.0 — 2026-06-01

- **`boss board` — a live read of what's in flight (IDEA-015, Phase 1).** Occasioned by Ajesh's
  "internal kanban / fire a html site / Obsidian / almost a Trello board" idea. Convened six advisors
  (venture, architect, humane, designer + vibe-virtuoso & indie-hacker persona reactions); the result
  was **unanimous and collapses to one fork: build the *view*, refuse the *app*.** A board BOSS
  *renders* from state it already holds externalizes the arc for a tired brain; a board BOSS *becomes*
  (log in, drag cards, keep in sync) is the photo-negative of BOSS and Canvas R&H #1 wearing a UI.
  **The founder never touches the board — they change the work and it re-renders.**
  - **`boss board` (new CLI subcommand, [src/board.js](../src/board.js))** — derives four columns
    (Captured → Taking shape → Building → Shipped) from files that already exist. **Frontmatter is
    truth — reads each IDEA-*/FEAT-* file's `status`, never `docs/ideas/INDEX.md`** (a hand-maintained
    table that drifts; a board that trusts a drifting source lies). Pure projection: no
    `.boss/board.json`, no second source of truth, nothing to sync — so concurrent / out-of-order /
    agent edits can't corrupt a render (the answer to Ajesh's "picks something out of order" worry is
    *statelessness*, not merge logic). A promoted idea is represented by its FEAT card (no
    double-count); blocked FEATs flag `· blocked`.
  - **Humane constraint honored (mentor-humane override):** the riskiest-assumption status sits
    *above* the columns — when there's capture but nothing pressure-tested, the evidence line says so
    plainly and points at `/canvas`. Empty columns are shown, not hidden (the empty cell is the
    diagnostic). Plain factual copy — no completion-celebration, no gamification, no notifications.
  - **Deterministic projection, no model in the loop** → it's a CLI verb, not a skill (spending model
    tokens on `readFile` + string-template would be the anti-pattern the v0.34 frequency-ledger work
    fought). Ships with the binary → available in every project automatically; **no manifest change**.
    Lands in IDEA-006's already-portable Layer 1 (zero host contract).
  - **Earned its keep on first run:** reading BOSS's own repo, it surfaced real INDEX-vs-files drift
    (IDEA-003 / IDEA-014 are `building` in their frontmatter while INDEX still said `exploring`) — the
    exact failure mode that justified reading frontmatter over the table.
  - **Deferred by design (the discipline BOSS preaches, applied to itself):** `--html` (read-only,
    generate-on-demand, same data model) is gated behind *earn it first* — if `boss board` gets run
    unprompted each session, build the render; if not, the gate saved the work. Obsidian is mostly
    documentation (`docs/` is already a vault), not a build. Both captured in IDEA-015 with the
    write-back caveats. End-to-end tested in `/tmp` (empty / captured-only caution banner / canvas →
    Taking shape / FEAT supersession / blocked / shipped / placeholder-canvas negative test).

## 0.35.0 — 2026-06-01

- **The recalibration engine — `regrade.js` built + run-ready, and model-recalibration named as a
  standing discipline (IDEA-014 Phase 1).** Occasioned by Ajesh's direction: adapting to new/
  different models should be a *standing capability*, not the ad-hoc reaction the v0.31–v0.34 arc
  was. Picked as the move that *helps BOSS keep improving easily* — because both judge-moments
  (drift, caution) were `NEVER_GRADED`: the labeled sets existed but the model had never been tested
  against them. Every future judge-moment would ship as vibes until that closed. `regrade.js` is the
  keystone that makes all future conscience work *measurable*.
  - **`regrade.js` (zero-dep, env-gated, out-of-band)** — the calibrator promoted from spec-stub to
    real harness. Per case: a **decision call** (give the live model the exact voice frame the hook
    injects + the bounded read the instruction names + a neutral founder turn → fire or stay
    silent?) + a **judge call** (grade the nudge against the case rubric → structured verdict),
    writing `transcripts/<moment>/<id>.json` stamped with the current voice-hash. Uses Node built-in
    `fetch` (no SDK). **`--dry-run`** verifies the whole pipeline (prompt assembly across all 17
    cases + the judge parser) with no API and no spend — verified green; the live `fetch` is the
    only unexercised line (a standard POST). `npm run regrade`; `BOSS_REGRADE_MODEL` to point at a
    different model.
  - **`moments.js`** — shared voice-hash source of truth so `replay.js` and `regrade.js` *cannot*
    disagree on the fingerprint (a mismatch would mark every transcript STALE forever). `replay.js`
    refactored onto it (same hashes; suites regression-clean).
  - **`docs/architecture/MODEL-RECALIBRATION.md`** — the standing checklist (IDEA-014's earned
    slice). Two triggers: a new same-vendor model (*leverage more* — re-grade, revisit each
    boundary for "can this move UP now?", read the frequency ledger, check context headroom) and a
    new host running a different model (*degrade gracefully* — judge-moments fall back to predicate-
    only). `regrade.js` is its engine; re-running it on a new model **is** recalibration. Named as a
    PRINCIPLE-#1 **UP** candidate (founders face the same model-migration problem — `/claude-api`
    already migrates their apps).
  - **Deferred, loudly:** the per-host model-capability profile + a `/recalibrate` skill — until a
    second model/host exists (a `/recalibrate` with nothing to recalibrate *to* is the premature
    ceremony v0.34 dodged). Token accounting stays host-contract territory (IDEA-006).
  - Gate + judgment suites 105/0/41; `npm pack` ships 0 tooling files. The judgment is now
    *run-ready* to become model-verified — one `ANTHROPIC_API_KEY=… npm run regrade` away (no key in
    the build env, so the live grade is the founder's to trigger).

## 0.34.0 — 2026-06-01

- **Conscience frequency ledger — BOSS eats its own `/ai-cost` dogfood, honestly. The last build
  of the 4.8 arc.** As judge-moments multiplied (v0.31 drift, v0.33 caution now do model judgment
  in the live turn), the conscience began costing real tokens per prompt — while BOSS preaches
  cost discipline and never measured its own. The first 4.8 pass flagged the trap: *BOSS becomes
  the expensive-AI app it warns against.* (IDEA-013.)
  - **The reframe is the decision (mentor-architect):** the build started as "conscience *cost*
    instrumentation" and was reframed to **frequency — facts, not estimates.** The hook never
    calls a model, so a char→token estimate would manufacture a billable-looking number while
    blind to its dominant term (the induced bounded reads judge-moments trigger in the main turn).
    That's *lying with numbers* — the exact cost-theater BOSS warns against; PRINCIPLE #2 vetoes
    it as premature ceremony. The *real* problem under the cost framing is **over-firing** — the
    actual way a conscience becomes costly/annoying, and a number you'd act on. So: measure
    frequency honestly; defer the token question to where honest token data lives (host-side,
    IDEA-006).
  - **`.boss/conscience-log.jsonl`** (gitignored) — the hook appends one line per fire:
    `{ts, moments[{moment,confidence}], judge(bool), injected_chars, cohort}`. Facts only — **no
    token/dollar estimate.** A **separate BOSS-meta ledger**, never the founder's
    `.boss/cost-log.jsonl` (BOSS's overhead ≠ the founder's app cost).
  - **First correctness-invisible fire-path side effect.** The hook goes from pure-emit to
    has-a-side-effect; `logActivity` runs only past the silent early-exit, append-only, single
    write, in its own swallowing try/catch. **Verified byte-identical** hook output with and
    without the ledger writable — delete it and the conscience behaves the same.
  - **`boss conscience activity`** (alias `cost`, which prints the honest frequency-not-tokens
    reframe) — fires, judge-moment share, median injected chars, per-moment counts, and the
    **over-fire smell** (clustering: a moment firing ≥4×/hour or ≥8×/24h — flagged because no
    per-prompt denominator exists without logging non-fires, which would break the instant
    property). Plus a one-line activity summary in `boss status --conscience`.
  - **Measure-only; self-throttle deferred indefinitely.** A throttle would gag the conscience
    exactly when a drifting founder generates more prompts and needs it most — **humane before
    viable**, and a one-way door (every "why didn't it speak?" becomes unfalsifiable). This ledger
    is the *evidence* that would earn that conversation, not a step toward it. Token/dollar
    estimation also deferred — host-contract territory (the only honest token count comes from the
    host, not the hook). `JUDGE_MOMENTS` set added to the hook lib. Gate + judgment suites
    regression-clean (105/0/41; drift + caution covered).

## 0.33.0 — 2026-06-01

- **`caution` goes judge-backed — depth vs. avoidance, and the first reuse of the v0.32 judgment
  machinery on an *existing* moment.** Moment #1 (the conscience's flagship "what does this
  prove?") fires when ≥3 captures exist with no filled riskiest assumption. But the predicate
  counts *total* captures — it can't tell **depth** (one idea getting sharper, converging toward a
  canvas) from **avoidance** (capturing-lots / validating-nothing). That ambiguity is `m1-snf-021`,
  which the gate runner has *skipped since v0.16* because no predicate can make the call. v0.33
  makes caution judge-backed and resolves it.
  - **Voice-frame upgrade** (`signalAsContext`, `caution` branch): the gate still opens, but the
    model now silently reads the active idea's capture log and judges before voicing — *one idea
    sharpening (narrowing the user, finding the real pain, wrestling the same question) = stay
    silent; idea-hopping / feature-piling / market-notes-without-a-bet = fire and name the specific
    pattern.* This is **strictly more restraint** — caution can now only fire *less*, never more.
  - **First reuse of the judgment surface (v0.32) on an existing moment** — proves the machinery
    isn't drift-specific. `replay.js` is now **multi-moment**: a `MOMENTS` registry (drift +
    caution) drives one shared engine (per-moment voice-hash tripwire + well-formedness + coverage
    + grading status). Adding a judgment moment = one registry row + a `<moment>.judgment.yml`.
  - **`caution.judgment.yml`** — 7 labeled cases: 3 should-fire-avoidance (idea-hopping,
    feature-piling, market-notes), 3 should-not-fire-depth (the m1-snf-021 case made concrete —
    narrowing, wrestling, converging), 1 ambiguous (depth-with-a-detour, `acceptable:
    [fires, silent]`). Content-rich capture-log fixtures (`fixtures-capturelog.js`) — the prose
    matters because the judgment is semantic.
  - **m1-snf-021 closed at the right layer:** the gate runner keeps skipping it (correctly — no
    predicate can make the call), now annotated "RESOLVED in v0.33; covered by the judgment
    surface," not "unimplemented." The case the gate *couldn't* test is exactly what the judgment
    channel was built for — the clearest proof v0.32 earned its keep.
  - Gate suite regression-clean **105/0/41**; both judgment moments well-formed + covered; caution
    voice-hash updated (tripwire reads the live frame). End-to-end tested via `boss new`: caution
    fires on scattered captures and ships the new depth-vs-avoidance instruction. The judgment
    remains **not yet model-verified** (replay prints NEVER_GRADED loudly) — first STALE builds
    `regrade.js`.

## 0.32.0 — 2026-06-01

- **Judgment-quality eval channel — closing the hole `drift-loop` (v0.31) opened.** drift was the
  first moment whose *detection is a model judgment*, not a predicate. The existing eval runner
  tests only the **gate** (does the hook fire on the right structural state); it stops at the
  door. Whether the model correctly calls drift-vs-on-aim *past* the open gate was unevaluated —
  a named crack in the "no moment ships without evals" floor, in exactly the spot 4.8 made
  load-bearing (`eval.md`: shipping detection logic with no way to know if it's right = "vibes-
  based AI in BOSS"). v0.32 builds the complement.
  - **The method (mentor-architect pass):** two surfaces, two cadences, on purpose. The gate-eval
    (`runner.js`, every commit, $0) stays. The **judgment surface** (`conscience-evals/judgment/`)
    is **golden transcripts gated by a voice-hash tripwire** — *not* pure LLM-as-judge (breaks the
    free/deterministic/CI property) and *not* pure golden transcripts (rot silently when the voice
    frame changes). Golden transcripts are the committed dataset; the tripwire makes their
    staleness *loud*; LLM-as-judge regenerates them out-of-band.
  - **`judgment/replay.js` — zero-dep, every commit.** (1) well-formedness — every case is a
    genuine open-gate state (filled risk, devlog ≥3 entries, no experiment line) with a coherent
    label; (2) **voice-hash tripwire** — fingerprints the exact `drift` instruction the model runs
    (`composeContext` for a drift signal); a transcript recorded against a different hash is
    `STALE` and replay says so loudly (golden transcripts that can't detect their own staleness
    are an eval that lies); (3) coverage floors (no silent caps; the on-aim/should-not-fire class
    is trust-critical and meant to *grow* toward ≥10); (4) grading status `GRADED/STALE/
    NEVER_GRADED/REGRESSION`. Exit 1 on malformed/coverage/regression; exit 0 + loud warnings on
    never-graded/stale. **All four states proven** (GRADED/STALE/REGRESSION/NEVER_GRADED tested).
  - **`judgment/drift.judgment.yml` — the labeled ground truth (Husain: build the set first).**
    10 cases: 4 should-fire-and-name-gap (incl. the sharpest — building the integration the risk
    explicitly *defers*), 5 should-not-fire-on-aim (the trust-critical class, incl. the hard
    "on-aim but informal — no experiment line, but the work IS the test" case), 1 ambiguous
    (`acceptable: [fires, silent]` so the grader doesn't punish a defensible call). Content-rich
    paired devlog fixtures (`fixtures-devlog.js`) — the *prose* matters because the judgment is
    semantic. `must_reference`/`must_not` rubric per case for the future LLM-judge.
  - **`judgment/regrade.js` — paid, out-of-band, DEFERRED by design.** The calibrator (decision
    call → judge call → write transcript stamped with the current voice-hash). Per the architect's
    staged cut: ship the labeled set + replay + tripwire first; build the API half *the week the
    first STALE tripwire fires*. Runnable spec-stub documents the full algorithm + env-checks. When
    built: zero-dep (Node `fetch`, no SDK), env-gated on `ANTHROPIC_API_KEY`, never on the commit
    path, never imported by `src/`, never in the `files` allowlist (lives under `docs/`).
  - **The zero-dep line, pinned:** the rule is *shipped surface (`src/`, `files`) stays
    dependency-free* — not "dev tooling can't call a model." Confirmed: `npm pack --dry-run` ships
    **0** judgment files; no `src/`/`bin/` reference to the eval dirs.
  - **Dogfooded in `eval.md`:** a model-judgment moment cannot ship its detection with only a
    gate-eval — the drift signal + exit predicates now require a judgment set + replay coverage for
    `drift` and every successor. Shared YAML parser extracted to `conscience-evals/lib/yaml-eval.js`
    (gate runner + replay use one copy; gate suite regression-clean at 105/0/41). New npm scripts:
    `eval:gate`, `eval:judgment`, `eval`.
  - **Honest scope:** v0.32 ships the labeled set + the staleness machinery + coverage discipline.
    The judgment is **not yet model-verified** — replay prints `NEVER_GRADED` loudly so a green run
    is never mistaken for a graded judgment. The first `STALE` is the trigger to build `regrade.js`.

## 0.31.0 — 2026-06-01

- **`drift-loop` — the closest loop to why BOSS exists, and the first moment that fronts a
  *model judgment* the predicate can't make.** PRINCIPLES.md opens with *"build faster without
  fooling themselves… continuously checking the work against real pain, real buyers."* For 30
  releases the conscience caught *structural* gaps (no canvas, no budget, no failure-states)
  but never the gap it names first: **you named the bet that could sink this, then spent your
  sessions building something else.** v0.31 closes it — occasioned by a "what does Opus 4.8
  change about BOSS" pass whose load-bearing finding was *the hook=detection / model=voice
  boundary has moved*: a stronger model can do the semantic judgment regex can't, so the
  conscience's first real "are you fooling yourself" check becomes buildable.
  - **`drift-loop` (L1-mvp, hook-runner)** — fires the new `drift` moment when (a) a canvas has
    a real **Riskiest assumption** (same predicate `canvas-loop` / `spec-loop` use) AND (b)
    `docs/devlog.md` has ≥3 dated entries (work accumulating, same threshold as
    `extraction-loop`) AND (c) no real **Experiment this week** validation plan exists yet.
    Sits in the gap *between* `caution` (no risk named) and the `done` graduation (risk has a
    plan). Confidence scales on devlog overshoot: 3 → low, 4–5 → medium, 6+ → high.
  - **The architecture, pinned (mentor-architect pass):** this is **not a new detector** — it's
    a *predicate-gated, bounded-read voicing instruction on the existing `UserPromptSubmit` →
    `additionalContext` channel*. The cheap Node predicate is the gate (and the cost control);
    the model does the stated-vs-actual comparison *in the live turn*, reading a **bounded** set
    (riskiest-assumption line + ~5 recent devlog entries + the open FEAT — never the whole
    project). No model call in the hook, **no new host primitive** (IDEA-006 contract untouched),
    **no new state**, no new predicate vocabulary. Same shape as `extraction-loop`/`/extract`,
    but **hook-fired not skill-invoked** — because a founder who has drifted from their own
    stated bet is exactly the founder who won't think to *ask* whether they've drifted.
  - **New `drift` voice frame** in `signalAsContext` (loop-runtime.js): instructs silent bounded
    read → judge → name the *specific* gap ("you said X is the bet; the last sessions built Y, Z;
    neither tests X") → point at `/canvas` or `/pretotype`. **Stay silent when on-aim** (silence
    is the correct output). Not a "you've been productive!" reward, not a generic "you should
    validate" line — the value is the specific comparison. Cohort-aware (returning-founder gets
    the harder conviction cut; first-product gets "test your riskiest bet" taught plainly;
    domain-expert gets the who-could-be-harmed lens on the named risk).
  - **Eval coverage from the start** — `moment-drift.yml` (14 cases: 4 should-fire incl. the
    placeholder-experiment edge + the drift/capture co-fire; 10 should-not incl. plan-recorded,
    under-threshold, unnamed-risk, dropped-idea, pre-MVP, and the documented `any_file_matches`
    masking limitation). Runner extended: `buildCanvasFile` now writes the experiment line.
    Suite **105/0/41** (up from 91). *No moment ships without evals* — held. End-to-end tested
    in `/tmp`: fires low→high as devlog grows, goes silent when the validation plan is recorded.
  - L1-mvp now ships 12 skills + **8 loops**. Honest scope note: hook evals test the *gate*;
    judgment-quality (does the model correctly call drift vs. on-aim) is the model's layer,
    tested the way `/extract`'s judgment is — not this runner.

## 0.30.0 — 2026-05-27

- **Closing the two remaining audit gaps — cost-log read cadence + failure-state stub
  loophole.** Same shape as v0.27: no new product axis; the discipline tightens around
  surface already shipped. The two gaps the audit named after v0.26 — *"the weekly review
  cadence is unenforced"* and *"failure-state handlers can be stubs forever"* — were real
  holes. v0.30 closes both.
  - **`/cost-review` skill (L1-mvp)** — reads `.boss/cost-log.jsonl`, aggregates by FEAT +
    user + cohort, compares against `docs/ai-cost-budget.md`, flags surprises (cost
    outliers > 10× median; user outliers; FEAT skew; quiet upward drift), writes
    `docs/cost-reviews/REVIEW-YYYY-MM-DD.md` with headline / numbers / variance / surprises /
    actions / next-review fields. Cohort-aware framing (indie-hacker gets %-of-revenue;
    returning-founder gets unit economics; domain-expert gets privacy-first confirmation
    before showing any review data). Surfaces mentor handoffs (architect for cost-shape;
    business for unit-economics) when overages exceed 10% of monthly cap.
  - **`cost-review-loop` (L1-mvp, hook-runner)** — **second time-of-work entry pattern**
    (after extraction-loop). Entry: `docs/ai-cost-budget.md` exists (the deontic moment —
    declaring the budget commits you to reading it). Exit: ≥1 file in `docs/cost-reviews/
    REVIEW-*.md` with a `^- \*\*Total spend:\*\*` line. The first review closes the loop;
    recurring re-opening waits on time-aware predicate vocabulary (same dependency as
    extraction-loop). New **`cost-stale` moment** added to `signalAsContext` voice frame.
  - **`/ai-failure-states` template — Eval-tested column added.** Each failure-state row
    (garbage / refusal / hallucination / timeout / cost-spike) now carries an **Eval-tested**
    field naming which eval case actually exercises the handler, OR marked **STUB** with an
    override required per IDEA-008. *Closes the stub-forever loophole at the declaration
    layer.* Voice note: stubs are still legitimate; *stubs without an override-with-re-open-
    condition* are not.
  - **`/evals` skill — failure-mode coverage requirement.** For AI-mediated FEATs, the eval
    set must include at least one `should-fail` case per declared failure state, categorized
    by `failure_mode` matching the canonical names (`garbage`/`refusal`/`hallucination`/
    `timeout`/`cost-spike`/`other`). *Closes the stub-forever loophole at the test layer.*
    The two layers (declaration + test) compose: handler stubs in code → declaration in
    docs → eval cases that exercise the declarations → real coverage.
- **Eval coverage from the start (v0.27 rule held).** `moment-cost-stale.yml` ships with 9
  cases: should-fire (no review; empty directory; stub file without canonical line); should-
  fire-multi (cost + cost-stale together when logger isn't wired but budget is); should-not-
  fire (full closure with review on record; pre-budget projects; LLM calls without budget
  declared — confirms entry is gated on budget doc, not LLM calls; Quickstart-shape projects).
  3 existing "full discipline declared" cases (m-cost-101, m-fm-101, m-cap-202) updated to
  also satisfy cost-review-loop's exit predicate, since they assert all-loops-closed.
- **Suite count: 91 passed / 0 failed / 41 skipped (133 loaded)** — up from 83/0/41. Every
  hook-emitted moment now has eval coverage. The "no moment ships without evals" discipline
  is the new floor.
- **What v0.30 does NOT do:** auto-enforce the failure-mode eval coverage (the `/evals`
  skill names the requirement; nothing fails the build if the eval set lacks coverage; that
  would be a v0.31+ tightening if founders ship handlers-without-evals systematically);
  recurring cost-review-loop (needs time-aware predicate vocabulary); pull `.boss/cost-
  log.jsonl` into the skill review output automatically (the parsing logic lives in the
  skill's instructions; Claude does the reading per-call to keep zero-dep CLI).
- **The audit is closed.** The three load-bearing gaps from the post-v0.26 audit (eval
  coverage, /welcome onboarding, moment #3 capture) shipped in v0.27 / v0.28 / v0.29; the
  two discipline-hole gaps in already-shipped surface (cost-review cadence, failure-state
  stub loophole) shipped in v0.30. The right-to-defer items (brownfield, /consult, AI-first
  archetype template, IDEA-003 finish, etc.) remain on the v0.31+ backlog. Audit-driven
  hardening complete; the next move is feature work.

## 0.29.0 — 2026-05-27

- **Moment #3 lands — PRINCIPLE #1's own discipline, encoded (finally).** For 28 releases the
  conscience surfaced 6 moments (caution / done / restraint / coherence / cost / failure-mode)
  but never one for PRINCIPLE #1 itself — the *pause to extract patterns UP or DOWN* rule that
  defines what BOSS is. *"Capture"* was deferred 5 consecutive releases as "needs LLM-as-judge
  or heuristic design." v0.29 ships the heuristic-plus-judgment version: a hook-runner loop
  on a simple devlog heuristic + a skill that does the real judging.
  - **`extraction-loop` (L1-mvp, hook-runner)** — entry: `docs/devlog.md` has ≥3 dated
    entries (regex `^## \d{4}-\d{2}-\d{2}`); exit: ≥1 `docs/extractions/EXTR-*.md` file has
    a `- **Route:**` line. **First hook-runner loop whose entry is *time-of-work* (devlog
    count) rather than *file-state predicate*.** Sets the precedent for future judgment-
    required moments that can't be detected by file regex alone. Threshold of 3 mirrors
    PRINCIPLE #1's *"the third time the same work repeats"* signal.
  - **`/extract` skill (L1-mvp)** — the LLM-as-judge counterpart. Reads recent commits, the
    last 3-5 devlog entries, the current FEAT, `library/`, and `src/`. Identifies 1-3
    candidate patterns by three signals (Signal A: same work repeated; Signal B: named-and-
    stable shape; Signal C: load-bearing decision). Routes each candidate **UP** (into BOSS's
    `library/<cat>/` via `boss learn`) or **DOWN** (into the app's `src/` as a named refactor
    target) or honest **NOT-YET** (the third legitimate answer; recording the *not yet* IS
    the discipline). Writes `docs/extractions/EXTR-NNN-<slug>.md` with full routing record +
    "what didn't make the cut" section. Cohort-aware (returning-founder gets the seasoned
    `"what did you do twice?"` prompt; first-product gets gentler framing; domain-expert
    leans NOT-YET-with-caveats for regulated logic).
  - **New `capture` moment in the conscience** — added to `signalAsContext` in
    `lib/loop-runtime.js`. Voice frame names the inflection in plain language; explicitly
    rejects *"you've been productive!"* reward framing (PRINCIPLE #1 is the discipline, not
    the dopamine). Cohort decides the specific framing.
  - **`EXTR-NNN` ID type added** — `docs/IDS.md` template updates to name it under MVP-mode
    unlocks alongside `FEAT-NNN` / `FIX-NNN` / `BUG-NNN`.
  - **L1-mvp manifest** — now ships 11 skills + 6 loops. `claude-append.md` names `/extract`
    and `extraction-loop` alongside the others; calls out the *"two destinations, not one"*
    framing per PRINCIPLE #1.
- **Eval coverage from the start (closes the v0.27 hole going forward).** `moment-capture.yml`
  ships with 11 cases: should-fire (3, 5 entries; empty extractions/ dir doesn't close); should-
  not-fire (≤2 entries; closed by UP route; closed by NOT-YET route; empty project; empty
  devlog file); Quickstart-shape sanity (no devlog → no fire); multi-loop isolation (all four
  AI-first/extraction loops closed independently). The discipline applied: **no moment ships
  without its evals.**
- **Runner upgrades** — new fixtures: `devlog_3_entries`, `devlog_2_entries`, `devlog_5_entries`,
  `extraction_record_up`, `extraction_record_not_yet`. Loads `moment-capture.yml` in main().
  **Suite count: 83 passed / 0 failed / 41 skipped (124 loaded)** — up from 73/0/41.
- **What v0.29 does NOT do:** auto-recurring extraction-loop (closes after one extraction;
  re-opening requires founder action or future predicate vocabulary with time-aware checks
  like *"N devlog entries since last extraction"*); execute the actual extraction (the skill
  proposes UP/DOWN routes; `boss learn` handles UP execution; refactors are the founder's
  call); LLM-call-out detector (some "is this reusable?" judgments would benefit from an
  external model call, but Claude-running-the-skill IS the LLM-as-judge — keeping it in-
  context is simpler and cheaper).
- **The architectural precedent.** extraction-loop is the **first time-of-work entry**
  pattern. Future loops that need heuristics like "X has accumulated since Y" can reuse this
  shape (count files of one type; gate by absence of files of another type). Documented in
  the loop spec for future authors. Tightens the v0.18 runtime's vocabulary without changing
  the runner.

## 0.28.0 — 2026-05-27

- **`/welcome` — the gentle first-run orientation (closes the v0.19 cohort gap).** The v0.19
  personas pass surfaced that `first-product`, `vibe-coder-newbie`, and `non-tech-founder`
  cohorts bounce off BOSS because the first thing they see is *"drop your PRD."* Power-user
  framing, beginner cohort. v0.28 adds the gentler door: a Quickstart skill that orients in
  ~1 minute, defines terms inline, names the conscience as a *nudge never a block*, surfaces
  override + pause as discoverable affordances, and routes to `/boss` or `/triage` based on
  what the founder is ready for.
- **Cohort-aware depth** — the skill branches on `.boss/config.json` cohort:
  - `first-product` / `vibe-coder-newbie` / `non-tech-founder` / null → **full tour**: what
    BOSS is, what's in the folder, what to do next, how the conscience works, how modes level
    up, where to find help. Each section 2-3 sentences; terms defined inline; plain language.
  - `eng-builder` / `vibe-virtuoso` / `indie-hacker` / `returning-founder` → **30-second
    version**: one paragraph, pointer at `/boss`. *"You probably don't need the tour."* Then
    stops; doesn't elaborate.
  - `domain-expert` → **middle path**: full tour with high-stakes framing inline (privacy-
    first defaults, human-in-the-loop on hallucination, conscience errs toward speaking).
- **Discoverability fix for IDEA-011** — the skill explicitly surfaces `boss conscience pause`
  + the override grammar (*"deviation conscious, recorded, never blocked, never forgotten"*).
  Previously these were documented in CHANGELOG / docs/ideas; now they're surfaced in the
  cohort's first 5 minutes with BOSS. Partial close on IDEA-011 Phase 2's override-
  discoverability sub-gap.
- **Cohort question moved upstream** — `/welcome` asks the cohort question first (when unset),
  before any orientation; `/boss` step 6 stays as the backup path for founders who go
  directly to `/boss`. The cohort persists in `.boss/config.json` for the conscience hook.
- **`boss new` output updated** — the post-scaffold "Next:" block now names BOTH paths:
  `/welcome` for the first-time door, `/boss <idea|PRD>` for the power-user door. Same
  language as CLAUDE.md (template) top.
- **L0-quickstart manifest** — adds `welcome` to the skills list (now 6 skills). No new
  agents, no new loops, no new hooks. Quickstart still ships a tiny agentic footprint.
- **L0 CLAUDE.md (template)** — adds a top-line nudge: *"First time? Run `/welcome` — gentle
  orientation, takes a minute, defines terms inline. Already familiar with BOSS? Skip to
  `/boss <your idea or PRD path>` to spin up."* The first thing a fresh founder reads.
- **End-to-end tested in /tmp** — `boss new welcome-test` → 6 skills land including welcome;
  CLAUDE.md surfaces /welcome at top; 73/73 conscience evals still pass.
- **What v0.28 does NOT do:** auto-trigger `/welcome` on first Claude prompt (the CLAUDE.md
  surfacing is enough; auto-trigger via hook would conflict with cohort `eng-builder` /
  `returning-founder` who explicitly *don't* want it); ship an end-user onboarding flow (that
  was named in IDEA-012 as a separate v0.27+ candidate; this skill is founder-onboarding,
  not end-user-onboarding); add a `/welcome` for V1 / Scale modes (the lift is once, not per-
  mode — re-running in MVP+ is supported but the orientation doesn't change much).

## 0.27.0 — 2026-05-24

- **Conscience evals — closing the discipline-on-the-discipline-tool hole.** Four moments
  (restraint / coherence / cost / failure-mode) had shipped without eval coverage; the brake
  the discipline named (*"43/43 pass"*) was eroding silently. v0.27 closes the three
  hook-emitted ones; restraint is skill-side and stays out of the hook eval suite by design.
  - **`moment-cost.yml`** — 12 cases covering: Anthropic / OpenAI / Vercel AI SDK
    (generateText, streamText) entry detection; partial closure (budget doc alone, logger ref
    alone); full closure; multi-moment co-firing with failure-mode at the first-LLM-call
    inflection; should-not-fire on no-LLM and empty projects.
  - **`moment-failure-mode.yml`** — 8 cases isolating the failure-mode signal (close the cost
    loop to single out failure-mode); covers partial closure (doc alone, handlers alone),
    full closure, and the no-entry case.
  - **`moment-coherence.yml`** — 10 cases covering: className= / styled-components / inline
    style={} entry detection; confidence scaling (3 declarations = low; 12+ = high); partial
    closure (tokens doc alone, refs alone); full closure; under-threshold (2 declarations)
    and no-UI cases.
  - **Runner upgrades:**
    - Loads both L0-quickstart AND L1-mvp loops (L1 loops live in `stages/L1-mvp/template/
      docs/loops/`; previous runner only loaded L0, which is why three moments could ship
      without coverage).
    - **`src_files` / `docs_files` / `other_files` in `project_state`** — materializes
      arbitrary file paths via the new `FIXTURES` registry (`runner.js`). The minimal YAML
      parser doesn't support multi-line scalars, so file content lives in the runner as
      named fixtures: `anthropic_call`, `openai_call`, `vercel_ai_call`, `vercel_ai_stream`,
      `cost_budget_doc`, `cost_logger_ref`, `failure_states_doc`, `failure_handlers_ref`,
      `style_decls_low/high/two`, `style_styled_components`, `style_inline_objects`,
      `design_tokens_doc`, `token_refs`, `no_llm_code`, `empty`.
    - **Multi-moment assertions** — `expected_detection.moments: [cost, failure-mode]`
      asserts set inclusion across the actual signals list (not just the first signal).
      Useful for cases where multiple loops fire simultaneously by design.
    - **Single-moment fallback** — when `expected_detection.moment` is specified, the
      assertion also checks the moments list (not just the first signal), since signal
      ordering is filesystem-dependent.
  - **README updated** — current-cut section names all five tested moments; documents the
    multi-moment format and the FIXTURES registry pattern.
- **Suite count: 73 passed / 0 failed / 41 skipped (114 loaded)** — up from 43/43. The 41
  skipped are unchanged: 20 moment-2 cases that live in `/canvas` skill prompt (no hook
  detector), 6 signal-text evals (separate runner), 15 cases gated on suppress_if / devlog
  awareness / session-state tracking that aren't yet implemented.
- **What v0.27 does NOT do:** sharpen the first-cut wording in any YAML (Ajesh's sharpening
  pass remains pending — flagged in each file's frontmatter); ship a skill-eval runner for
  `spec-loop` / `pretotype-loop` (those are skill-side; need a different runner pattern);
  add a sixth moment for "capture" (PRINCIPLE #1 — gap #1 still on the table; needs an
  LLM-as-judge or heuristic detector design).
- **Why this isn't a feature release:** no skills, agents, loops, or hooks shipped. The
  discipline tightened around what's already shipped. Same shape as v0.24 (positioning
  pass): not the most exciting release, plausibly the highest-leverage one this stretch.

## 0.26.0 — 2026-05-24

- **AI-first product template — BOSS's home turf, made first-class.** The v0.24 positioning
  named BOSS as *"the thinking layer for AI-native founders."* v0.26 ships the concrete
  artifact that earns the name: a conductor skill that walks the founder through the AI-first
  discipline **from day one**, plus the missing piece (failure-states design) that completes
  the spine. Cursor + a folder is "AI-native." BOSS + `/ai-first-init` is *"AI-first with
  discipline from day one."*
  - **`/ai-first-init` skill (L1-mvp)** — the **conductor**. Walks the founder through five
    steps: (1) declare what's AI-mediated → `docs/ai-first.md`; (2) seed structured outputs
    (Liu) → `docs/schemas/`; (3) seed eval set early (Husain) → `/evals --new`; (4) declare
    cost budget upfront → `/ai-cost`; (5) design failure states → `/ai-failure-states`. The
    "from day one" framing: declare the discipline *before* the first AI-mediated FEAT ships,
    not after the first bill / hallucination / refusal.
  - **`/ai-failure-states` skill (L1-mvp)** — the **missing piece**. Walks the founder through
    five guaranteed failure modes (garbage / refusal / hallucination / timeout / cost-spike),
    each with a project-specific declared response + stub fallback handler in code (so the
    discipline is wired before the founder forgets). Writes `docs/ai-failure-states.md`.
    Cohort-aware: `first-product` gets named patterns; `eng-builder` gets the unhandled-path
    angle; **`domain-expert` defaults to human-in-the-loop on hallucination** (no retry-loop
    on medical/legal/financial output).
  - **`ai-failure-state-loop` (L1-mvp, hook-runner)** — entry: ≥1 LLM SDK call site
    (parity with `cost-budget-loop` — the two failure modes always coexist at the
    AI-mediated boundary). Exit: `docs/ai-failure-states.md` exists AND code references at
    least one fallback handler (`handleGarbageResponse` / `handleRefusal` /
    `handleHallucination` / `handleTimeout` / `handleCostSpike` or snake_case Python
    equivalents). New `failure-mode` moment added to `signalAsContext` voice frame.
  - **`/spec` upgrade** — for AI-mediated FEATs, the spec template now includes a **Failure
    states** section alongside the existing evals + validated-learning fields. Names which
    of the five failure states the FEAT must handle + which fallback handler it routes to.
    Acceptance criteria are asked to reference at least one failure-state path.
  - **`/boss` AI-native nudge (L0-quickstart)** — when the founder names the model as
    load-bearing during spin-up (the product doesn't work without it), `/boss` names it
    explicitly back and recommends *"after `boss unlock mvp`, run `/ai-first-init`."* The
    recommendation is the artifact; `/boss` never runs it for the founder.
- **`docs/ai-first.md` as the declaration contract.** Future FEATs read this doc; future
  `/spec` runs reference its cross-reference fields. If the doc says "deterministic" for a
  feature and a PR puts an LLM call in there, that's a real change worth a re-spec —
  promotes design-by-archeology into design-by-declaration.
- **L1-mvp manifest now ships 10 skills + 5 loops + 4 agents.** `claude-append.md` names
  `/ai-first-init`, `/ai-failure-states`, and `ai-failure-state-loop` alongside the others.
- **The lineage cited.** Husain (failure-mode categorization extended from evals → UX), Liu
  (structured outputs as the contract that makes failure-detection mechanical), Karpathy
  (the failure surface IS the design surface — designing the happy path is the easy 20%),
  Mollick (cost-as-design-input continuing from v0.25). No new mentors added; the discipline
  is the existing roster applied to the AI-mediated boundary.
- **Conscience regression-clean.** The new loop lives in L1-mvp; the eval runner only loads
  L0-quickstart loops; no eval fixtures fire `failure-mode`. End-to-end tested in `/tmp`:
  fresh project → `boss unlock mvp` → drop LLM SDK call in `src/` → hook fires BOTH `cost`
  AND `failure-mode` simultaneously (the two loops share entry but track different exits).

## 0.25.0 — 2026-05-24

- **AI cost discipline — the universal-cohort feature lands.** Per IDEA-012's persona overlay,
  AI cost was the only candidate every cohort cared about. Now it's first-class in MVP mode:
  the founder gets nudged to declare the bill at the first LLM SDK call, not after the first
  surprise invoice.
  - **`/ai-cost` skill (L1-mvp)** — walks the founder through declaring `docs/ai-cost-budget.md`
    (per-user/day + monthly cap + model rationale + review cadence + breach grammar), suggests
    a ~30-line cost-logger wrapper (TypeScript + Python examples) writing to
    `.boss/cost-log.jsonl`, and surfaces mentor handoffs (`mentor-architect` for cost-shape →
    architecture; `mentor-business` for cost-per-user → pricing). **Cohort-aware defaults:**
    `first-product` $5/user/day strict; `vibe-virtuoso` inspect-only; `eng-builder` BYO;
    `indie-hacker` cost-as-%-of-revenue framing; `domain-expert` $20/user/day + **privacy-
    first logging (no PII, no prompt body)** + regulatory caveats; etc. The founder edits to
    fit the bet; the cohort sets the starting frame.
  - **`cost-budget-loop` (L1-mvp, hook-runner)** — entry: `src/**` contains ≥1 LLM SDK call
    site (regex covers `anthropic` / `@anthropic-ai/sdk` / `openai` / `OpenAI(` / `Anthropic(` /
    `messages.create` / `chat.completions.create` / Vercel AI SDK `generateText` /
    `streamText`); exit: `docs/ai-cost-budget.md` exists AND code references the logger
    wrapper (≥1 occurrence). Threshold of 1 (not 3 like design-tokens-loop) because cost
    discipline is **deontic at the first call** — there's no "exploratory" version of token
    spend. The first call hits a real billing meter.
  - **New `cost` moment in the conscience** — added to `signalAsContext` in
    `lib/loop-runtime.js`. Voice frame: name the bill exists in one line (cohort decides the
    framing — first-product wants a number, vibe-virtuoso wants the inspect affordance,
    domain-expert wants the privacy posture), point at `/ai-cost`, hand the decision back.
    Never blocks. Override via devlog per IDEA-008.
  - **`.gitignore`** updated to exclude `.boss/cost-log.jsonl` (local ledger; ship to a real
    datastore when you have real users — the skill's review-cadence step says so).
  - **L1-mvp manifest** now ships 8 skills + 4 loops + same 4 agents. `claude-append.md`
    names the new skill and loop alongside the others.
- **Pairs (not auto-invoked) with two existing mentors.** The handoff lines in `/ai-cost`:
  *"`mentor-architect`, the cost shape says X — what architecture decisions does that imply?"*
  and *"`mentor-business`, our cost-per-active-user is X; what should the pricing carry?"*
  Cost discipline is the load-bearing connector between architecture (caching, batching,
  cheaper-fallback) and business (unit economics, willingness-to-pay).
- **The discipline reads as Husain-applied-to-spend.** *"Almost all AI cost problems are
  visible in the ledger, and almost no one keeps one."* Liu cited for structured-outputs-as-
  cost-lever; Mollick for cost-as-design-input. No new mentor or practitioner added — just the
  application of existing discipline to a different artifact.
- **What v0.25 does NOT do:** auto-instrument the user's code (judgment call: the founder
  knows their call sites better; the skill *suggests* the wrapper, doesn't write it). Auto-
  detect non-mainstream SDKs (LangChain wrappers, Replicate, Cohere, Bedrock). Ship a budget-
  enforcement layer (this is a *nudge*, never a gate — IDEA-011 discipline applies).
- **Conscience regression-clean.** Existing 43/43 conscience evals still pass — the new loop
  lives in L1-mvp, the eval runner only loads L0-quickstart loops, so the new moment has no
  way to fire against the existing eval fixtures. End-to-end tested in `/tmp`.

## 0.24.0 — 2026-05-23

- **Positioning pass — first non-feature release in BOSS's history.** The deliverable is *the
  thinking* (positioning + README edit), not code. Per IDEA-012's revised roadmap, v0.24 was
  explicitly the positioning pass, not a feature release. The Dunford exercise was first
  recommended in the v0.15 advisory pass and deferred through 8 capability releases; finally
  executed.
- **Output:** `docs/dossier/positioning-pass-001.md` _(local-only)_ —
  full Dunford exercise: target cohort (the founder using Cursor/Claude Code 3+ months with
  2+ unfinished projects), 8 competitive alternatives, 8 unique attributes that survive
  scrutiny, attributes mapped to value, 7 market-frame options, **8 candidate killer one-
  sentences stranger-tested**, 8 cohort-tailored variants per persona, the trend layer
  (*AI raised the speed limit; almost nothing raised the discipline limit*), 6 decisions to
  act on, downstream consequences.
- **Decisions on the record:**
  - **Lead sentence (elevator):** *"BOSS is the just-in-time conscience for AI-native
    founders. Pause it any time."* (13 words; killer for verbal intros.)
  - **README opening sentence:** *"For founders building with AI — the thinking layer that
    nudges when you're drifting and pauses on command. No growth-hacking pressure. Override-
    friendly."* (22 words; killer for the README + landing-page hero.)
  - **Category frame:** *"the thinking layer for AI-native founders"* — drops "incubator" as
    the primary descriptor because it reads YC-shaped to strangers. "Incubator" stays valid
    as a secondary descriptor.
  - **Cohort-tailored variants:** 8 versions (one per persona archetype). Pattern: cohort-
    naming first phrase + feature-that-lands-hardest second.
  - **What BOSS doesn't compete on, named explicitly:** code generation (Lovable / v0 / Bolt).
    BOSS is *complementary* to those — a founder could use Lovable to scaffold the app + BOSS
    to scaffold the thinking about it.
- **README updated** — the TL;DR replaced with the v0.24 positioning. Old: *"a just-in-time
  incubator for AI-native projects."* New: the candidate #8 framing above.
- **What this positioning is NOT** (recorded in the dossier):
  - Not validated (synthetic-tested only until real founder reads + articulates back)
  - Not permanent (evolves with the product)
  - Not the only frame BOSS could use (picked AI-native-founder audience; the anti-VC
    indie-hacker frame is a legitimate secondary positioning that could split into its own
    surface later)
- **Discipline applied to BOSS itself:** the Dunford exercise was on the record since v0.15.
  Eight releases of capability shipped before it landed. The positioning pass finally
  shipping is the discipline-on-the-discipline-tool move applied again — *not the most
  exciting release; probably the highest-leverage one in months*.

## 0.23.0 — 2026-05-23

- **Conscience pause primitive — the discipline-on-the-discipline-tool move (IDEA-011
  Phase 1).** Single-purpose release. Closes the canvas R&H #1 gap operationally: the founder
  can now silence the conscience for a bounded session without having to edit settings.json
  or rip out hooks. The four other items originally queued for v0.23 (Scale mode authoring,
  moment #3 detector, PostToolUse hook plumbing, IDEA-010 Phase 4 `/design-prompt`) are
  deferred to v0.24+ — see RESUME's restructured roadmap. **Discipline applied to BOSS
  itself: ship only the one most-load-bearing thing in a release that *could* have been
  bigger.**
  - **`boss conscience pause [--for 8h | --until-resume] [--reason "..."]`** — records a
    pause in `.boss/config.json`'s `conscience` block: `{ mode, since, expires, reason }`.
    Default duration: 8h (a build session). `--until-resume` for indefinite pauses.
  - **`boss conscience resume`** — explicit un-pause. Also happens automatically when the
    recorded expiry passes (the hook auto-clears the state).
  - **Hook reads pause state FIRST.** When `mode: paused` and `expires > now` → exit silent.
    When `mode: paused` and `expires <= now` → call `clearPauseState` and continue normally.
    The auto-resume IS the kindness; no special "your pause expired" signal (would be
    performative noise; IDEA-011 explicitly chose silent auto-resume).
  - **`boss status --conscience` surfaces pause state prominently** — at the TOP of the
    output, marked with `⏸ PAUSED`, showing since/expires/reason. When expired but not yet
    auto-cleared, shows `⏸ PAUSED (EXPIRED — will auto-resume on next prompt)`.
  - **Help text updated** to include the new commands.
  - **`readPauseState` + `clearPauseState`** added to `lib/loop-runtime.js` (template) —
    the canonical version. BOSS's CLI imports from there so there's one source of truth.
- **The architectural principle the pause demonstrates** (worth naming): **fractal-consistent
  override discipline.** The same IDEA-008 grammar applied at two scales — per-loop overrides
  in devlog (micro), and whole-conscience pause in config (macro). Same shape: deviation
  conscious, recorded, never blocked, never forgotten (auto-resume is the kindness). Same
  recipe, different scope. *Not novel as a pattern* (Focus modes are OS-level table stakes);
  *worth claiming if anything* as the fractal-consistent application — Phase 3 externalization
  may turn this into a publishable practice if BOSS gets used on > 1 project.
- **End-to-end tested in /tmp — 5 flows verified:**
  1. Baseline drifted state → hook fires (`caution low`)
  2. `boss conscience pause --for 8h --reason ...` → state recorded
  3. Hook fires after pause → silent ✓
  4. `boss status --conscience` → shows ⏸ PAUSED prominently with since/expires/reason
  5. `boss conscience resume` → hook fires again next prompt ✓
  Plus expired-auto-clear: hook reads expired pause → clears it → emits signal normally next
  prompt; config returns to `{ mode: 'active' }`.
- **43/43 evals regression-clean.**
- **Why a release for one feature?** Because it's the right discipline applied to BOSS itself.
  The other four queued v0.23 items are real and queued for v0.24+. The pause primitive's
  ratio of "leverage : code-size" is the highest of anything left in the roadmap (~50 lines
  of code + tests; closes the canvas R&H #1 gap directly). MVP discipline: minimum experiment
  that produces validated learning. Validated learning here: *did the pause primitive
  actually make BOSS feel nimble?* Founder using BOSS to do an all-night build will tell us.

## 0.22.0 — 2026-05-23

- **V1 mode authored — `boss unlock v1` works for real.** The third major mode arrives. Same
  playbook as MVP authoring (v0.14.0): manifest + template + claude-append + agents + skills +
  loops. V1 is the *real shippable release* mode — design layer turns on, the second-tier
  mentors arrive, data shape becomes a first-class decision, and a cross-FEAT sequencing
  surface appears.
  - **3 new builder agents:**
    - `ui-designer` — token + visual authority. Reads `DESIGN_TOKENS.md` as truth; refuses raw
      hex; three-layer architecture enforced (primitives → semantic → component). Cites Brad
      Frost (Atomic Design), Nathan Curtis (layer-cake), Jina Anne (W3C DTCG), Diana Mounter
      (Primer), Aarron Walter (emotional design). Holds the WCAG AA floor.
    - `ux-designer` — flow + state + interaction authority. **5-state requirement** non-
      optional (default / hover / active / disabled / empty + loading + error). Nielsen 10
      heuristics; Krug clarity; Norman affordances; Luke Wroblewski forms; Christopher
      Noessel for agentive patterns; Erika Hall for just-enough-research.
    - `db-architect` — schema + data-shape authority. Schema before code, even solo. Cites
      Codd, Date, Stonebraker, Kleppmann + AI-native data voices (Liu structured outputs,
      Husain data quality, Huyen production). Flags AI-data failure modes (unstructured-LLM-
      output in control flow; hallucinated-data pollution; eval-data-isn't-user-data).
  - **4 template mentor copies** (promoted from BOSS-local v0.15.0 to scaffolded-project
    templates — `{{PROJECT_NAME}}` / `{{MODE}}` placeholders): `mentor-business`,
    `mentor-fundraising`, `mentor-pitch`, `mentor-talent`. Same source practitioners as the
    BOSS-local versions; phrased to coach the founder of a generic scaffolded project. All
    advisory; never binding legal/financial/medical. Default position for mentor-fundraising
    + mentor-talent: *don't raise / don't hire yet, possibly never*.
  - **3 new skills:**
    - `/board` — cross-FEAT sequencing surface. Live read computed from FEAT frontmatter +
      smoke/evals state + override entries. Flags: `--next`, `--blocked`, `--by-cohort`,
      `--deferred`, `--evals`. Owned by `program-manager`.
    - `/design-review` — before-code design review. Runs `ui-designer` (token + visual) + 
      `ux-designer` (flows + 5 states) sequentially against the proposed UI. Reads tokens
      file, style guide, canvas Promises cell. Outputs concrete diffs. Cohort-aware delivery.
    - `/ux-check` — after-code UX review. Walks the *shipped* experience (not the spec),
      checks states are real, runs accessibility heuristics, applies AI-specific UX where
      relevant. Pairs with `/design-review`.
  - **1 new loop:** `design-drift-loop` (V1-stage, runner_type: hook). The V1-stage counterpart
    to MVP's `design-tokens-loop` — gates *whether tokens are still authoritative*, not just
    *whether they exist*. **Subtle pattern worth naming:** this loop's exit predicate is the
    *bad signal* (≥1 raw hex code in code, excluding the tokens file) — the loop is
    "drift-emitting" when the bad signal is present. The IDEA-008 primitive supports this
    without modification. Emits the `coherence` moment (introduced v0.21).
  - **L2-v1 manifest** declares 7 agents + 3 skills + 1 loop; `boss sync` carries them via the
    managed-file kinds (agent, skill, loop). `.boss` stamp tracks them. claude-append.md
    reads as a clean V1-working-rules catalog.
- **End-to-end tested in /tmp:** `boss new` → `boss unlock mvp` → `boss unlock v1` lands all
  three modes' files cleanly. Final stamp: 14 agents + 15 skills + 6 loops + 1 hook + 3
  installed layers. `boss status --conscience` shows all 6 loops in correct states on a fresh
  project. 43/43 evals still pass (regression-clean).
- **Deferred to v0.23:** moment #3 (capture — reusable value at breakpoint, needs LLM-as-judge
  or heuristic detector — not predicate-based); PostToolUse hook for hardcoded-style detection
  (new hook-type plumbing — its own concern); Scale mode authoring (mentor-humane template
  promotion, PM org, code-health, product council); `/design-prompt` skill or fold into
  `/design-review`.

## 0.21.0 — 2026-05-23

- **MVP discipline upgrades + IDEA-010 Phase 2 (design-tokens-loop) — all in one release.**
  Three new skills, three new loops, one upgraded skill, moment #4 (restraint) lands skill-side.
  Moment #3 (capture — reusable value at breakpoint) deferred to v0.22 — it needs a different
  detector design (predicate evaluation doesn't fit "noticing this artifact is more general
  than its loop").
  - **`/spec` upgraded** (the smallest cut, highest leverage per the v1 playbook):
    - Adds **validated-learning field** (Ries, *The Lean Startup*): "If this FEAT works
      perfectly, what do we learn?" If the answer is "users like it" or "the feature works,"
      don't build it. The MVP is the minimum experiment that produces validated learning, not
      the minimum product to polish.
    - Adds **evals field** (Husain): when a FEAT puts an LLM in control flow, the eval set
      lives at `docs/evals/FEAT-NNN.yml`. Schema'd output (Liu) strongly recommended.
    - **Moment #4 restraint check** (IDEA-008's collapsed-moments architecture): `/spec`
      reads canvas-loop state before creating a FEAT spec; if canvas-loop isn't closed for
      the active idea, the skill surfaces a Fitzpatrick-plain restraint nudge (cohort-aware
      via v0.20's framing). Override grammar lives in devlog. Never blocks; always records.
  - **`/evals` skill (new)** — Husain discipline as a first-class MVP skill paired with
    `/smoke`. Smoke answers "is it alive"; evals answers "is it correct." Eval set first
    (20 cases beats 0). Failure modes categorized by mode (Husain: failure modes are more
    valuable than success modes). Structured outputs recommended (Liu: Pydantic-first).
    Cites Husain + Liu + LLM-as-judge caveats.
  - **`/pretotype` skill (new)** — Savoia's discipline as a first-class MVP skill. The
    demand-test between `/canvas` and `/spec` — "make sure you're building the right It
    before building It right." Six patterns named (fake door / WoZ / Mechanical Turk /
    Pinocchio / YouTube test / impresario). The TRI metric (tangible / real-time /
    imminent). Threshold-before-running (Ries pivot discipline). YODA (your-own-data >
    anything).
  - **`/design-tokens-init` skill (new)** — IDEA-010 Phase 2. Scaffolds the three-layer
    token system at the first-UI-commit inflection. **Cohort-aware delivery** (v0.20's
    framing): vibe-coder-newbie gets SHOWING; eng-builder gets OFFERING; vibe-virtuoso gets
    OVERRIDE-FRIENDLY; first-product gets DEFINE-TERMS; indie-hacker gets RIGHT-SIZED;
    returning-founder gets SKIP-THE-101; non-tech-founder + domain-expert get PLAIN-
    LANGUAGE-COACH; unspecified gets neutral. The three-layer architecture (primitives →
    semantic → component) is Curtis's layer-cake; the AI-tolerance argument is that
    two-layer systems are fragile under AI generation (the field's consensus). Reads canvas
    Promises cell to brand-anchor the primitives (prevents the brand-default problem from
    IDEA-010).
  - **Three new MVP-stage loops** on the v0.18 generic loop primitive:
    - `spec-loop` (runner_type: skill) — encodes moment #4 restraint. Entry: canvas-loop
      closed for some active idea. Exit: `FEAT-NNN-<slug>.md` exists. `/spec` is the
      detector + runner.
    - `pretotype-loop` (runner_type: skill) — structural by default (no drift_moment to
      avoid over-firing). Records that demand-testing happened before significant build.
      `/pretotype` is the runner.
    - `design-tokens-loop` (runner_type: hook) — JIT, *only opens once UI starts
      accumulating* (≥3 style declarations across src/). Drift moment: **`coherence`**
      (new — system-vs-code drift; a flavor of caution specific to design-system mismatch).
      Stack-agnostic regex catches common React/Vue/Svelte/Solid patterns; founders can
      edit the spec for their stack.
- **L1-mvp manifest** declares the new 3 skills + 3 loops; `boss sync` carries them; `.boss`
  stamp tracks them. The `claude-append.md` reads as a clean catalog of what MVP offers.
- **End-to-end tested in /tmp:** scaffold → unlock mvp → all 7 skills + 5 loops land + stamp
  merges correctly + status --conscience shows the 5 loops in their right states (capture
  open-structural, canvas/spec/pretotype/design-tokens all unopenable on a fresh project, no
  spurious hook fires). 43/43 evals still pass (regression-clean).
- **Deferred to v0.22:** moment #3 (capture — reusable value at breakpoint), V1 mode authoring
  including the design-drift-loop (IDEA-010 Phase 3) + ui-designer + ux-designer agents +
  /design-review + /ux-check + PostToolUse hook for hardcoded-style detection.

## 0.20.0 — 2026-05-23

- **The three design changes from v0.19's persona-reactions pass — landed.** Closes the loop on
  the reactions: the personas flagged it, v0.20 shipped it. Moments #3 + #4 (the other v0.20
  candidates per the published roadmap) deferred to v0.21 — they need their own design pass
  (moment #3's "reusable value at breakpoint" detection is harder than predicate evaluation;
  moment #4's "premature ceremony" needs `/spec`-skill-aware detection plus a spec-loop). The
  three things shipping in v0.20 are the *persona-driven* design changes; the moment work is a
  separate concern.
  - **`boss status --conscience`** — the inspect affordance (asked-for by `eng-builder`,
    `indie-hacker`, `vibe-virtuoso` personas in the v0.19 reactions doc). Loads
    `docs/loops/*.md`, classifies each loop (open / closed / unopenable), shows what would
    close the open ones (concrete predicate evidence: count/threshold, file matches, what's
    missing), reads recent override entries from `docs/devlog.md` per IDEA-008's grammar,
    shows the project's declared cohort. New `src/conscience.js` module formats the output;
    the loop runtime is imported from the canonical Quickstart-template path so there's one
    source of truth.
  - **Cohort-aware conscience** — `.boss/config.json` carries an optional `cohort` field
    (one of: vibe-coder-newbie | eng-builder | non-tech-founder | first-product |
    vibe-virtuoso | indie-hacker | returning-founder | domain-expert | null). The
    `loop-runtime.js`'s `composeContext` now reads the cohort and appends a **cohort framing
    directive** to `additionalContext` — same signal, different voice. Each cohort gets a
    distinct framing sentence: first-product needs *teaching*; returning-founder wants a
    *harder cohort-aware question*; vibe-virtuoso gets *friction over praise*; indie-hacker
    gets *plain Fitzpatrick language, not jargon*. The `/boss` spin-up skill now asks
    one optional question to set the cohort; user can always edit `.boss/config.json` later.
  - **Voice lineage decision: Fitzpatrick consistently.** The indie-hacker persona caught
    that the prior conscience voice mixed Fitzpatrick ("who would you ask first") with
    Maurya ("riskiest assumption" / "riskiest bet") in one breath. v0.20 picks Fitzpatrick-
    plain ("what they'd want to learn"; "who they'd ask first") consistently. Updates the
    `/triage` skill's exemplar text + the `composeContext` framing in `loop-runtime.js`. The
    canvas itself still uses "riskiest assumption" (that's the canvas's frame, established);
    the *conscience nudge* now speaks Fitzpatrick.
- **Test coverage:** 43/43 evals still pass (regression-clean). End-to-end test in /tmp
  verified: fresh project → capture-loop open (no signal, structural); 3 captures + no canvas →
  canvas-loop drifts, hook fires with cohort framing in additionalContext; override in devlog →
  appears in `boss status --conscience` output.
- **What's NOT in v0.20** (now queued for v0.21): conscience moments #3 (capture — reusable
  value) and #4 (restraint — premature ceremony). Moment #3 needs a different detector design
  (predicate evaluation doesn't fit "noticing this artifact is generalizable"). Moment #4
  needs a spec-loop authored AND skill-aware detection in `/spec`. Both warrant their own
  release.

## 0.19.0 — 2026-05-23

- **Proto-personas layer + first reactions pass — the founder-experience eval channel.** 8
  synthetic-founder agents now seated in BOSS's `.claude/agents/` with `persona-` prefix
  (parallel to `mentor-`, parallel to the builder team). They REACT to BOSS features (not
  advise, not mentor) so BOSS gets cheap pre-filter signal on how it lands across cohorts
  *before* spending the expensive real-founder Mom Test call (which remains explicitly
  overridden per advisory-pass #1; the override's re-open condition includes "persona
  reactions surface a coherent product story" — this layer is how that signal arrives).
  - The 8 personas: `vibe-coder-newbie` (no eng/startup background, picked up Cursor 3-6
    months ago), `eng-builder` (10+ years eng, first-time founder, skeptical of magic),
    `non-tech-founder` (deep domain expertise, can't code, AI is the bridge),
    `first-product` (absolute beginner — to building, to vibe coding, to everything),
    `vibe-virtuoso` (50+ shipped projects, zero sustained products, expert at idea-to-demo,
    bad at company-building), `indie-hacker` (right-sized lens — Walling/Fried/Jarvis;
    anti-VC; suspicious of venture-shaped language), `returning-founder` (has shipped before;
    intolerant of 101 content; wants depth), `domain-expert` (medical/legal/financial;
    stakes are real; humane lens applies hard).
  - **`persona-reactions-loop`** authored in `docs/loops/` — captures the discipline (runner_
    type: manual; uses the v0.18 loop primitive). Entry: persona agents exist. Exit: a
    `docs/dossier/persona-reactions/<feature>.md` doc with structured reactions + synthesis +
    design changes + real-founder questions the reactions sharpen.
  - **First reactions pass complete** at
    `docs/dossier/persona-reactions/conscience-moment-1.md` _(local-only)_.
    All 8 personas reacting to the conscience moment-1 firing scenario.
  - **Three concrete design changes the reactions argue for** (ordered, with priorities):
    1. **Cohort-aware conscience** — the model composing the conscience voice should know what
       cohort the founder is in (`.boss/config.json` declares it, set by `/boss` during
       scaffold). First-product needs *teaching*; returning-founder needs *a harder
       question*; vibe-virtuoso needs *sharper architecture*. Same signal; different voice.
    2. **Inspect affordance** — `boss status --conscience` or `boss conscience --explain` so
       humans can see what loops are open / what would close them / what overrides exist.
       Engineers + indie-hackers + vibe-virtuosos all asked for this. Plausibly v0.20
       alongside moments #3/#4.
    3. **Pick the lineage in the conscience voice** — current voice mixes Fitzpatrick
       (talk-to-someone) and Maurya (riskiest-assumption) in one breath. Indie-hacker caught
       this; the eval set didn't. Lean one direction consistently.
  - **Three real-founder interview questions** the reactions sharpen for the eventual call:
    (1) read-aloud comprehension test; (2) curious-vs-defensive-vs-confused for first-timer
    cohort; (3) cohort-aware variant test for returning-founder cohort.
  - **Two surprises from the reactions** that hadn't surfaced via any other discipline:
    returning-founder wants a HARDER question, not a softer one (suggesting cohort-aware
    direction); indie-hacker noticed the voice-fights-itself issue (Fitzpatrick vs Maurya
    lineage mix) that 84 eval examples missed. **Argument for routine persona-eval passes on
    every user-facing text.**
- **Roadmap status:** v0.17 (builder team) + v0.18 (loop primitive) + v0.19 (personas) all
  shipped this push. Next up: v0.20 (moments #3+#4 via the generic detector, leveraging the
  v0.19 reactions for cohort-aware language) + v0.21 (MVP discipline upgrades).

## 0.18.0 — 2026-05-22

- **IDEA-008 → FEAT-001: generic loop runtime in Node; bash hook retired.** The biggest
  architectural release since v0.8.0 (learning loop). The conscience hook used to be hand-coded
  bash with a single hard-wired detector for moment-1. It's now a generic Node runtime that
  reads `docs/loops/*.md` from the project, evaluates entry/exit predicates, and emits
  structured signals — *any* loop drifting fires *its* moment, no per-moment code. Moments
  #3 and #4 will be authored as loops (not detectors) in v0.20.
  - **`conscience.js`** (replaces `conscience.sh`) — zero-dep Node, ~50 lines. Loads loops,
    classifies state, composes signals, prints JSON. Fails silent — never blocks a prompt.
  - **`lib/loop-runtime.js`** — the engine. Loads loops from `docs/loops/*.md`, evaluates a
    closed predicate vocabulary (`exists`, `count_at_least`, `any_file_matches`) against the
    live filesystem, classifies each loop as `unopenable | open | closed`, returns structured
    signals only for hook-runner loops with a `drift_moment`. Loops without `drift_moment` are
    *structural* (express dependencies but don't drift — caught the over-fires-on-fresh-project
    bug live during the build; capture-loop is the canonical structural loop).
  - **`lib/yaml.js`** — zero-dep YAML parser lifted from the eval runner so the same code parses
    loop specs at hook time and eval examples at test time.
  - **Two named loops authored** in the Quickstart template (`docs/loops/`):
    - `capture-loop` — structural; expresses "at least one captured idea exists." Downstream
      loops (canvas-loop) check this via their own entry predicates.
    - `canvas-loop` — encodes moment-1's full logic *declaratively* via predicates. Entry: ≥3
      dated capture-log entries across active (non-dropped) idea files. Exit: at least one
      canvas tied to an active idea has a real (≥3-char alphanumeric) riskiest assumption.
      Drift = open + not closed = moment-1 caution. The hand-coded bash logic is now expressed
      in YAML.
  - **`manifest.json` gains a `loops` array.** `src/scaffold.js` + `src/sync.js` handle loops
    as a new managed-file kind (`kind: loop`, `rel: docs/loops/<name>.md`). Hook-library files
    (`lib/*.js`) auto-discovered from the template and synced alongside the hook script. The
    `.boss` stamp tracks `loops` (alongside agents/skills/hooks).
  - **`runner_type` field on loop specs** — resolves the moment-2 shape question from v0.16's
    meta-learnings. Today only `hook` is honored by the conscience runtime; `skill`, `manual`,
    `external` will be honored by future runners (skill-prompt eval, manual review, external
    detector — e.g. CI).
  - **Settings migration (bash → node).** Existing projects pinned at <= 0.13.0 have
    `bash …conscience.sh` in their settings.json. The merge logic now applies hook-command
    *migrations* before the additive merge: it drops stale bash entries before adding the new
    node entry. Tested with a synthetic pre-0.18 project: bash entry dropped, node entry added,
    user's permissions preserved, idempotent on re-sync.
  - **Eval set unchanged; 43/43 still pass against the generic runtime** (regression-coverage
    in place). The runner now invokes `node conscience.js`, materializes `docs/loops/` into
    the test project before each example (so the runtime has loops to load), and the existing
    examples test the *generic detector* end-to-end. One bug found during the build (POSIX
    regex char classes — `[[:space:]]` doesn't work in JS) fixed by switching loop specs to
    JS-native regex (`\s+`, `[a-zA-Z0-9]{3,}`). Eval-first discipline catching itself.
  - **BOSS dogfoods:** `docs/loops/capture-loop.md` + `docs/loops/canvas-loop.md` now live in
    BOSS itself (alongside the existing `docs/loops/eval.md`). BOSS-the-project runs the same
    runtime against its own state.
  - **Verdict on the primitive (from v0.16's meta-learnings): confirmed under contact with
    real Node implementation.** The four-field shape (entry / purpose / exit / drift) held up.
    Predicate vocabulary covered everything moment-1 needed declaratively. The structural-loop
    pattern (no `drift_moment`) handles dependencies-only cases cleanly. Net code change:
    `conscience.sh` (40 lines bash) replaced by `conscience.js` + `lib/` (~250 lines Node) —
    bigger surface, but moments #3+ will be loop specs (~30 lines YAML each), not new detectors.

## 0.17.0 — 2026-05-22

- **Builder team seated alongside the mentor board.** Three new builder agents in BOSS's own
  `.claude/agents/` — they make BOSS *feel right*, parallel to the mentor board which makes
  BOSS *be right*. Builders, not mentors: they propose concrete diffs, not advice. Cover the
  interaction-design layer that wasn't covered by either the mentor board or the existing builder
  agents (pm, coder-generalist, tester, program-manager).
  - **`designer`** — owns the UX of the entire BOSS interaction experience. Not "the visual
    designer" (BOSS is a CLI + Claude Code experience, not a webapp). Owns: when BOSS speaks vs
    stays quiet, what a skill *feels* like when run, the rhythm of mode unlocks, the surprise
    vs predictability of conscience moments, what the founder is being asked to *do* vs read at
    every step. Sources: Norman, Krug, Nielsen, Spool, Wroblewski, Walter + AI-specific UX
    heuristics (options-not-truth; visible confidence; deliberate failure states).
  - **`voice-keeper`** — guards what BOSS *sounds like*. Reviews skill text, agent system
    prompts, hook signal language, README, CHANGELOG, error messages. Catches performed warmth,
    scolding tone, voice-mode bleed, framework-jargon leaking into user-facing text, assumed
    knowledge, hedging. Proposes concrete edits side-by-side. Inward-facing language guardian.
    Sources: `boss-voice` memory (canonical spec), Strunk & White, Raskin + Neumeier (pitch =
    product voice), Godin (write to one person).
  - **`prompt-coach`** — helps the founder write better prompts (to BOSS, to Claude, to AI in
    general) and teaches the craft over time. Outward-facing counterpart to voice-keeper.
    Builds a per-founder pattern library in `docs/dossier/founder-prompt-patterns.md`. Catches
    vague / multi-prompt / missing-constraint / missing-output-format / leading-question /
    missing-context / wrong-role-assignment / stop-word-missing failure modes. Sources:
    Karpathy (think in distributions), Mollick (AI-as-different-roles), Willison (prompt-as-
    code), Liu (Pydantic-first), Husain (look at the output), Fitzpatrick (Mom Test discipline
    applied to interview prompts).
- **Advisory-pass #1 (real-founder Mom Test calls) explicitly overridden — first real use of
  IDEA-008's override grammar.** Ajesh's call: at zero users + product still defining its shape,
  expensive real-founder calls are premature; cheap synthetic signal from proto-personas (v0.19
  work) is the right move now. Override recorded in `docs/dossier/boss-advisory-pass-001.md`
  with explicit re-open conditions (persona reactions surface a coherent product story, OR a
  non-Ajesh user starts using BOSS in earnest, OR the eval set catches something only real-
  founder feedback could surface). The recommendation isn't deleted — it's deferred under the
  IDEA-008 contract: deviation made conscious, recorded, re-openable.
- **Roadmap published** (in RESUME): v0.17 builder team → v0.18 generic loop primitive (IDEA-008
  to FEAT) → v0.19 proto-personas as named loops → v0.20+ moments #3/#4 + MVP discipline
  upgrades + V1/Scale mode authoring + IDEA-003 finish + externalization + backlog. Ten releases
  sequenced for build-on-build; the discipline rails (evals, structured output, loops, personas)
  make each one buildable in a focused session.

## 0.16.0 — 2026-05-22

- **The eval-loop closed — conscience now has evals + structured output (proves IDEA-008's
  primitive on its first real run).** Two ladders climbed at once: produced the conscience eval
  set (the artifact the advisory pass / playbook said BOSS most needed) AND validated the loop
  primitive from IDEA-008 by running ONE loop end-to-end. Both succeeded.
  - **84 labeled eval examples** (43 moment-1 caution + 41 moment-2 Done!) in
    `docs/architecture/conscience-evals/{moment-1-caution,moment-2-done}.yml`. Should-fire +
    categorized should-NOT-fire entries (failure_mode taxonomy per Husain's discipline:
    `over-fires-on-fresh-project`, `fires-mid-other-work`, `repeats-itself`, `shame-toned`,
    `false-positive-canvas-exists`, `false-positive-not-drift`, `acknowledged-already`,
    `fires-too-early`, `performed-warmth`, `removes-agency`, `riskiest-assumption-stale`,
    `triggered-by-trivial-change`). Each example has structured `project_state` (the synthetic
    docs/ideas/ tree the runner builds in a temp dir) + `expected_detection`.
  - **Zero-dep Node runner** at `docs/architecture/conscience-evals/runner.js` — includes a
    minimal YAML parser for the subset our eval files use (so the data stays human-readable
    without breaking the zero-dep rule). Constructs synthetic state, invokes the actual hook,
    parses output, asserts. Reports per-example + a categorized summary table.
  - **Hook refactored to structured output** (Liu's discipline): now ships
    `{moment, confidence, evidence: {capture_count, canvases_with_filled_assumption,
    active_idea_count}, suppress_if}` in addition to the `additionalContext` string. Model still
    composes the voice; hook ships a schema.
  - **3 real bugs caught and fixed by the eval set itself** (Husain's "look at your data"
    discipline in action):
    1. Single-char placeholders like `?` slipped through the riskiest-assumption regex.
       Tightened to require ≥3 alphanumeric chars (rejects `?`, `??`, `_TBD_`, empty, etc.).
    2. Hook counted captures across *all* ideas — including `status: dropped`. Drift signal
       from already-walked-away ideas is meaningless. Hook now filters active vs. dropped.
    3. Filled canvases on dropped ideas were stopping the "validated" check. Same fix:
       active-status filtering on canvas checks too.
  - **Runner results: 43/43 pass on every runnable case. 41 skipped as categorized future-work**
    (moment-2 lives in `/canvas` skill prompt not a hook; suppress_if cases need session-state /
    devlog awareness; signal-text violations need a separate runner — all explicitly tracked).
  - **IDEA-008 primitive verdict — ready to promote to FEAT.** The four-field shape (entry,
    purpose, exit, drift) held up. The predicate vocabulary (`exists`, `contains`,
    `count_at_least`, `recorded_at`) survived contact with reality. Multi-part exit artifacts
    work. Skip-with-reason is the right runner pattern. ~half of examples test future features
    (suppress_if + devlog + skill-based detection), which is the right ratio — the eval set
    is forward-looking, not just current-implementation snapshot. One real shape-question
    surfaced (moment-2 isn't hook-detected — argues for a `runner_type` field on loop specs).
  - First loop authored: `docs/loops/eval.md` — the eval-loop spec using the four-field primitive
    with predicates in YAML frontmatter. The template for every future loop.

## 0.15.0 — 2026-05-22

- **BOSS now has its full mentor board seated, and the board has had its first session on BOSS
  itself.** Step back before the next build axis: identify and instantiate all the experts we'd
  want consulting on how to build an AI-native MVP right, then have them actually review BOSS.
  - **8 mentor agents live in this repo's `.claude/agents/`** (BOSS-local; the project-as-its-own-
    founder): `mentor-venture` (cornerstone), `mentor-architect`, `mentor-gtm` (the three that
    already existed in stage templates, now BOSS-tuned), plus 5 new: `mentor-business`,
    `mentor-fundraising`, `mentor-pitch`, `mentor-talent`, `mentor-humane`. Each cites the
    practitioners from `docs/mentor-practitioners.md` it draws on — no agent impersonates a
    person; mentors cite named practices (per the encoding decision in `docs/MENTORS.md`).
  - **`mentor-humane` carries explicit override authority** when a humane concern is on the table
    — the conscience's conscience. Seated from day one despite the Scale-level slot in the
    roster, because BOSS itself is the special case (it has to *be* humane in its construction,
    not just preach it).
  - **`mentor-architect` retuned for the AI-native MVP era** (both BOSS-local and the MVP template
    in `stages/L1-mvp/template/.claude/agents/`). Leads with AI as the modality; classical-stack
    choices are supporting cast. Names the load-bearing AI questions: surface, eval strategy,
    prompt vs. fine-tune vs. RAG, structured outputs, human-in-loop boundaries, cost/latency
    budgets, fallback. Cites Karpathy, Willison, Husain (evals — load-bearing), Liu (structured
    outputs — load-bearing), Mollick, Huyen.
  - **First advisory pass captured at `docs/dossier/boss-advisory-pass-001.md`.** Honest, not
    flattering. Each mentor's read on BOSS as-of v0.14.0, citing their practitioners. Five
    cross-cutting themes converged: (1) pause "more features" to earn founder contact; (2) evals
    are the next architecture investment (moments #3/#4 should be eval-set-first); (3)
    right-sized is the default shape (calm-company / OSS / patronage, not venture); (4) interior
    story rich, exterior story missing (strangers can't read the README); (5) the conscience is
    the moat *and* the most under-validated thing — plug this gap first.
  - **Next moves (re-ordered by the pass — supersedes the prior queue):** conscience-evals doc +
    structured hook output, *then* moments #3/#4; 5 real-founder Mom-Test interviews; Dunford
    positioning exercise + strangers-can-read-it README; humane upgrades to the conscience spec
    (cumulative-pressure check, BOSS.DK exemplar lines, cross-link humane practitioners into
    architect's lens); name the right-sized shape on the canvas.

## 0.14.0 — 2026-05-22

- **MVP mode (L1-mvp) is authored — `boss unlock mvp` works for real (closes IDEA-002).** Until now
  the L1 stage was a placeholder README; unlocking MVP errored out as "not authored yet." This release
  extracts this repo's own MVP practice UP into a real `stages/L1-mvp/{manifest.json,template/}`:
  - **Skills:** `/spec` (promote `IDEA-NNN` → `FEAT-NNN` with goal, acceptance criteria, smoke check,
    out-of-scope), `/smoke` (stack-configured build-health gate; saves the command to `.boss/smoke.json`
    on first use), `/log` (append-only `docs/devlog.md` — newest at the top, dated, FEAT-tagged),
    `/close` (session-end ritual that rewrites `docs/RESUME.md` and runs `/log`).
  - **Builder agents:** `tester` (owns `/smoke` + FEAT acceptance — surfaces, doesn't fix),
    `program-manager` (the *when* — sequences FEATs, names blocks, distinct from `pm`'s *what*).
  - **Mentor agents (advisory, never code):** `mentor-architect` (load-bearing decisions: data shape,
    boundaries, what to defer — the calibration against over-architecting an MVP) and `mentor-gtm`
    (first 100 users, channels, message — earned-when-needed, humane before viable).
  - **Additive CLAUDE.md** via `claude-append.md` — the mechanism shipped in v0.8.0 finally has its
    first real consumer. MVP's working rules (spec → smoke → log → close loop, conscience still runs)
    fold into the existing CLAUDE.md under the `boss:L1-mvp` marker; never overwrites Quickstart's rules.
  - **`boss sync` carries it for free** — the manifest's agents/skills are picked up by `managedFiles`
    in `src/sync.js`, so projects pinned at older versions get the MVP files via `/boss-sync` once they
    unlock the layer. (Hooks list is empty in this manifest — moments #3/#4 remain TBD.)
  - Tested in `/tmp`: scaffolded a Quickstart project, `boss unlock mvp` added 4 skills + 4 agents,
    appended the MVP working-rules block to CLAUDE.md, updated the stamp (`L0-quickstart → L1-mvp`,
    merged agents/skills), kept Quickstart files untouched, re-running unlock no-ops cleanly, `boss
    sync` recognizes everything as up-to-date.

## 0.13.0 — 2026-05-21

- **`boss sync` now carries hooks + settings (closes the conscience's reach gap).** Until now the
  conscience hook (v0.12.0) reached *new* projects only — `boss sync` carried skills/agents but not
  hooks or `settings.json`, so existing projects (e.g. `betabeta`) couldn't get it. Fixed:
  - **Hook scripts sync like any managed file** — `manifest.hooks` → `.claude/hooks/<name>.sh`, shown as
    `new`/`changed`/`ok` in the preview, written on `--apply`.
  - **Hook registrations merge into `.claude/settings.json` additively** — `boss sync` adds the
    `UserPromptSubmit` (etc.) entries BOSS ships, **matched by command so it's idempotent**, and
    **preserves the user's permissions and their own hooks.** It's the one user-editable file sync
    touches, and only the `hooks` block. (`computeSettingsMerge` in `src/sync.js`.)
  - The `.boss` stamp now tracks `hooks` (alongside agents/skills); `boss new`/`unlock` record them.
  - `/boss-sync` skill narrates the new behavior. Tested in `/tmp`: an "old" project (no hook,
    permissions-only settings, pinned 0.10.0) → sync adds the hook + merges settings (permissions
    preserved) + bumps the pin; idempotent on re-run.
  - **Existing projects can now `boss sync --apply` (or `/boss-sync`) to receive the conscience.**

## 0.12.0 — 2026-05-21

- **The conscience can now speak *unprompted* (spike → shipped).** Until now both moments only fired
  when you ran a skill (`/triage`, `/canvas`). A new **`UserPromptSubmit` hook** lets moment #1
  ("what does this prove?") surface on its own:
  - `.claude/hooks/conscience.sh` — detection only: if ≥3 dated capture-log entries exist across
    `docs/ideas/` and no canvas has a *filled* riskiest assumption (capturing-lots / validating-nothing),
    it returns `additionalContext` — a **signal**, not canned copy. Claude keeps the voice and the
    judgment: it decides whether the moment fits, says it once in BOSS's register, or stays silent.
  - Registered in the template `.claude/settings.json`; invoked via `bash …` so it needs no execute bit.
    `manifest.json` hooks: `["conscience"]`.
  - Confirms the architecture for the remaining moments: **hook = detection, model = tact + voice.**
  - _Caveats:_ reaches **new** projects only (`boss sync` doesn't carry `settings.json`/hooks yet); the
    *feel* (wise vs. naggy) still needs live validation, like moment #1 in `betabeta`.

## 0.11.0 — 2026-05-21

- **The conscience — second moment: "Done!" (`/canvas` graduation).** The *affirming* register,
  counterpart to moment #1's caution. When the canvas holds up (most cells real + riskiest assumption
  has a validation plan), `/canvas` no longer just offers `boss unlock mvp` — it marks the threshold in
  two beats:
  - **Arrival** — names what became real (started with a hunch → now a specific person, real tension,
    sharp promise, a testable riskiest bet). Said plainly, let to land. Acknowledgment, not praise.
  - **Next doorway** — points at `boss unlock mvp` (build tools + next mentors) without rushing; the
    canvas keeps.
  - A threshold, not a finish line; never forced — the celebration is for when it's genuinely earned.
  - Completes the conscience's *two registers* (caution + completion) in Quickstart.

## 0.10.0 — 2026-05-21

- **The conscience — first moment lands (`/triage` validation check).** BOSS starts behaving like the
  *build's conscience*, not just a set of skills you invoke. The first of four conscience moments —
  **"what does this prove?"** — is now baked into `/triage`:
  - **Fires when** the active idea has ≥3 capture-log entries and no canvas with a filled riskiest
    assumption (the "capturing lots, validating nothing" drift) — and *only* then.
  - **Says one spare line** in BOSS's voice (the seasoned hand): names the drift, asks what would make
    it real, points at `/canvas`, hands the decision back. Never blocks a capture, never nags.
  - Turns the validation thinking that already lived in `/canvas` + `mentor-venture` (invoke-only) into
    a *moment that fires* in the flow where drift actually happens.
  - Template `CLAUDE.md` names the conscience in the Quickstart arc.
  - Existing projects pick it up via `boss sync` / `/boss-sync`.

## 0.9.0 — 2026-05-21

- **Mentor layer — structure + cornerstone (IDEA-003).** BOSS's second agent class lands.
  - **`docs/MENTORS.md`** — the design: two classes (builders make the app, `mentor-*` coach the
    founder), the roster + JIT-per-mode mapping (venture → architect/GTM → fundraising/pitch/talent/
    business → humane), the founder **dossier** (canvas → proposal → architecture brief → pitch →
    hiring plan → data room), and the hard line (no binding legal/financial advice; humane before viable).
  - **`mentor-venture` agent** seeded into Quickstart (`library/agents/` + template + manifest). The
    cornerstone mentor: pressure-tests whether an idea is worth it, names the riskiest assumption,
    points at the next real step, owns the canvas conversation. Advisory only — never writes code/specs.
  - Existing projects pull `mentor-venture` + the new skills via `boss sync` / `/boss-sync`.
  - _Still open:_ encoding real practitioners' best-practices UP into `practices/` + `memory-seed/`
    (awaiting the list); authoring the rest of the roster as their modes get built.

## 0.8.0 — 2026-05-21

- **The learning loop (IDEA-001).** PRINCIPLES #1 made operational, in both directions:
  - **`boss sync [--apply]`** — brings a project's BOSS-managed skills/agents (across all its
    installed modes) up to the current version. Previews as `new` / `changed (N lines)` / up-to-date,
    reconciles stale mode labels (an old `L0-sketch` pin → `L0-quickstart`), and on `--apply` writes
    the files + bumps the project's `.boss` pin. Syncs BOSS-managed skills/agents only; user-editable
    files (`CLAUDE.md`, `settings.json`) are left for hand-merge.
  - **`boss learn <path> --as <category>`** — promotes a proven pattern UP into
    `library/<category>/` (`agents|skills|hooks|practices|memory-seed`), bumps `VERSION` +
    `package.json` in sync, and prepends a CHANGELOG stub. Finds the BOSS **source** repo via the
    registry's self-hosted entry (or `$BOSS_SRC`), so it works when `boss` runs from a global install.
  - **`/boss-sync` + `/boss-learn` skills** — the judgment layer. `/boss-learn` is a two-destination
    **router** (UP = BOSS superset practice; DOWN = harden into the app's own core), never one-way.
    `/boss-sync` narrates the diff from the CHANGELOG and flags local edits before overwriting.
- **`claude-append.md` support in `boss unlock`.** A mode template can carry a `claude-append.md`
  whose contents are *appended* to the project's CLAUDE.md under an idempotent marker — additive
  working rules, never an overwrite. (Needed by the MVP mode next.)

## 0.7.0 — 2026-05-21

- **Package / dogfood separation.** Clean boundary between the shippable package and BOSS's own
  incubation layer:
  - `package.json` `files` allowlist — only `bin/ src/ stages/ library/ VERSION PRINCIPLES.md
    registry/CHANGELOG.md` (+ README/LICENSE) ship. `docs/`, `.boss/`, root `CLAUDE.md`, and the
    local registry are never published. (`npm run pack:preview` to verify.)
  - **Registry moved out of the repo** to `~/.boss/registry.json` — machine-local state (your
    project list + absolute paths) no longer lives in (or leaks into) the package/repo.
  - `VERSION` and `package.json` version synced to 0.7.0.

## 0.6.0 — 2026-05-21

- **BOSS now dogfoods itself.** BOSS is its own first registered project (`.boss/` stamp,
  mode MVP, self-hosted) — retrofitted ahead of the MVP-mode template, which will be *extracted UP*
  from this repo's working practice (Principle 1).
- Added BOSS's own dogfooded docs: root `CLAUDE.md`, `docs/IDS.md`, `docs/ideas/` (IDEA-001 learning
  loop, IDEA-002 MVP mode, IDEA-003 mentor layer), `docs/ideas/CANVAS.md` (BOSS's own Humane
  Product Canvas), and `docs/RESUME.md` (multi-session continuity).
- Recorded the **mentor layer** vision: two agent classes — builders (make the app) and mentors
  (coach the founder); mentors accumulate a founder dossier toward funding/hiring.

## 0.5.0 — 2026-05-21

- **PRINCIPLES.md** — BOSS's six operating principles. #1: always scaffolding, but pause to sort
  patterns UP (BOSS superset practice) or DOWN (app core); `/boss-learn` becomes a two-way router.
  #3: nothing valuable gets locked into code (style → tokens, prototypes reuse the same system).
- **Design-system practice** (`library/practices/design-system.md`) — generalized from dhun:
  tokens as single source of truth, central style utils, 5-state rule, prototype reuse, JIT
  enforcement (turns on at V1; seed tokens the moment real UI appears).
- V1 mode stub fleshed out with the design layer + enforcement timing.

## 0.4.0 — 2026-05-21

- **Quickstart becomes a tiny incubator:** capture → keep adding → canvas → unlock MVP.
- `/triage` rewritten as **living idea capture** — one evolving doc per idea (sharpening
  "current shape" + append-only capture log). Re-run anytime to keep adding.
- New `/canvas` skill: a **humane business pressure-test** — Ajesh Shah's Humane Product Canvas
  (Human Foundation / Product Expression / Stewardship) as the spine, with Lean + Lenny-style
  prompts folded into each cell, plus the incubation heartbeat (riskiest assumption + one
  experiment this week). Acts as the Quickstart→MVP graduation gate.
- North star recorded: BOSS is a just-in-time startup incubator — the right support shows up per mode.

## 0.3.0 — 2026-05-20

- Stages renamed to **modes** (the user's vocabulary): Quickstart → MVP → V1 → Scale
  (folder ids `L0-quickstart` / `L1-mvp` / `L2-v1` / `L3-scale`).
- `boss unlock` accepts mode names, levels, or full ids (`mvp`, `L1`, `L1-mvp`).
- `boss new` / `status` / `list` display the mode name; `.boss/manifest.json` records `mode`.
- _Migration note:_ projects created on ≤0.2.0 carry the old `L0-sketch` stage label in their
  stamp; cosmetic only — `unlock`/`status` still work. A future `/boss-sync` will reconcile labels.

## 0.2.0 — 2026-05-20

- `/boss` spin-up skill (L0): reads a PRD/idea → shapes via pm lens → captures IDEA-001 →
  recommends stack + stage → optionally creates a **private** GitHub repo with a license.
- Repo-creation defaults (in `.boss/config.json`): `github: ask`, `visibility: private`,
  `license: proprietary` (All Rights Reserved — keeps paid + OSS options open; relicense later).
- Auto-sets repo-local GitHub noreply email to avoid the GH007 email-privacy push block.

## 0.1.0 — 2026-05-20

- Walking skeleton: `boss new` / `unlock` / `status` / `list` / `version`.
- L0 · Quickstart stage authored (CLAUDE.md, pm + coder-generalist agents, /triage, ideas pool, IDS).
- Registry + `.boss/` project stamp + version-pinning.
- L1–L3 stages stubbed (manifests/templates not yet authored).
