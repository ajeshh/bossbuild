# BOSS board assessment — 2026-09-12 (v0.319→0.321 during the read)

17 reviewers: 9 mentors (architect, founder, humane, customers, capital, fundraising, hiring, pitch,
cofounder), 6 builders (product-lead, planner, designer, tester, coder, voice-keeper), 2 personas
(eng-builder, first-product). All read FACTS.md; findings below are ones ≥3 landed on independently,
plus the splits. Corrections to FACTS.md: releases are ~11/day (76 in 7d), not 8/wk; only ONE FEAT
is `building` (FEAT-025), the other five "in flight" are IDEAs; of 31 "dead exports" 1 is dead
(config.readShape) and ~13 are over-exported internal helpers; the conscience injects only when a
predicate fires (1 fire/22d on BOSS), but re-fires every turn thereafter with no "already said" marker.

## Bottom line
The code is not the problem. The module graph layers cleanly, the tests are green, the CLI is
zero-dep and small. What has not kept pace is (a) BOSS running what it ships, (b) the unit of work
(a version per capability, contended by six sessions, received by nobody), and (c) the width of the
shipped surface at MVP. Every reviewer who took the venture lens said the same thing the code
reviewers said from the other side: the refactor that matters is subtraction + dogfood, not structure.

## Converged (count = reviewers who found it independently)

1. (9) BOSS does not run what it ships. Pin 0.267 vs 0.321; 45 workspace skills drifted (up to 254
   lines); no checker compares content (check-boundary stops at "managed"); .boss/brain absent;
   /drift-deep never run; manifest.json says "arrays EMPTY on purpose" over 45 entries.
2. (8) The version is the wrong unit. ~11 releases/day; VERSION/CHANGELOG is the collision surface
   (5 collisions, prose handshake, no mechanism — release.js checks VERSION==package.json, never
   VERSION > last committed). Canvas lists release count as an anti-metric; it's the only one moving.
   Convergent fix (planner/hiring/cofounder/architect, different flavors): land capabilities under
   `## Unreleased`; stamp a version only at publish; one releaser; ~20 lines in release.js to refuse
   a stale VERSION.
3. (8) The MVP cliff. unlock mvp: 17→45 verbs in one move; post-launch verbs (/health /money
   /onboard /measure /roadmap /trust /landing) at MVP; 13.8K bytes/turn; 35/45 never invoked (n=1).
   Both personas bounced on it; first-product closed the terminal on `/boss-learn`. README:129
   ("that's the whole vocabulary") is false on day one.
4. (all) `boss status` 378 git spawns / 2.4s; each unique path 2× (cli.js:513 + readiness.js:54);
   `boss recap` 410. Fix ~30 lines (one `git log --name-only`, memoised). On BOSS itself the
   derived-age signal is dark anyway because docs/ideas is gitignored.
5. (5) BOSS's own conscience is structurally blind to BOSS. drift-loop globs `*-canvas.md`, file is
   `CANVAS.md` (runtime comment :95 fixed the twin bug for canvas-loop only); focus exit is "≥1
   shipped ever"; coherence fired on a CLI with no UI; sustaining needs 45d of silence BOSS never
   has. 1 fire in 22 days. (Verify: product-lead says the board's focus line IS firing — that's
   `boss board`'s text, not the hook.)
6. (5) Records don't close. 103 IDEAs: 0 `ready`, 0 `dropped` ever; FEAT-025 shipped rung 2 at
   v0.272 and still lists it unchecked, proof: points at a CLI chosen against. INDEX.md 32k tokens.
7. (6) Memory in 5 places, one tracked. Two losses. IDEA-087 still `seedling` while RESUME's red item.
8. (4) Gates: four gate definitions with four subsets (test/test:ci/check/release — release omits 5);
   two freshness checkers compute "today" in UTC so every evening prints "10 may be behind"
   (waved through nightly); check-freshness + check-pattern-coverage exit 0 unconditionally;
   9/14 checkers guard BOSS's ledgers, not a founder's tree; always-on-cost.test mutates a shipped
   file in the working tree while peers `git status` it. No old-vintage sync test exists — the
   modules a refactor would touch (sync/managed/scaffold/board) are proved only on fixtures.
9. (3) Internal register leaks into shipped text. 47 `v0.NNN` stamps in 20 shipped skills, nine of
   them confessions ("until v0.284.0 this skill deleted the wrong one"); `IDEA-008` cited in a
   shipped skill collides with the founder's own IDEA-008; 33 🔴/⛔/🆕 glyphs; docs/loops/ (20
   BOSS-internal files) shipped into the folder AGENTS.md calls the founder's; names-as-credentials
   in always-on descriptions (Husain, Hamel/Shankar, Shape-Up).
10. (3) Two stories. Site: "structure of a company around your code / like you have a team";
    README+welcome+PRINCIPLES: "the conscience that keeps you honest, quiet the rest of the time."
    Surface was built on the first; best copy is written in the second. Cohesion is narrative here.

## Split — kept visible
- Refactor at all? Founder/fundraising/customers: no — send the 08-23 outreach first; a refactor is
  inward, green-gated, and the canvas named it the trap. Architect/coder/tester/humane: yes, but it's
  small and specific (dogfood re-sync, two globs, one predicate, 30 lines of git). Not contradictory:
  the second list is under a day each; the first is the gate on anything bigger.
- Concurrency: cofounder → session=branch; hiring → one release/week, cap at 2–3 sessions;
  planner → Unreleased heading, no per-capability bump; architect → all-on-main is fine, fix the
  allocator. Common core: stop contending VERSION per capability. The branch/cap questions are Ajesh's.
- Six FEATs "in flight": pitch/fundraising read it as releases bypassing FEATs; product-lead
  corrected — one FEAT, five IDEAs; the bypass is that records never close, not that work skips them.

## Leave alone (consensus)
cli.js's switch (45 lines; weight is four long cmd bodies + 300 lines of help text that could move
to help.js); moment-frames text (most words are conditions for silence); registry/CHANGELOG.md (the
only tracked multi-writer memory); conscience pause/mute/fail-open + person-state split; hooks/lib/
yaml.js separate from src/frontmatter.js (crosses the package boundary); the "Waiting on Ajesh"
queue; markdown+git as the record substrate (the N+1 is the bug, not the substrate).

## Candidate work — sorted, not sequenced (the next conversation)
Independent, <1 day, no decision needed:
  git-dates single pass (board/records/recap) · drift-loop glob + focus exit · UTC in check-site/
  check-help · release.js refuses stale VERSION · collapse the four gate lists into one ·
  strip v0.NNN/IDEA-NNN/glyphs from shipped skills + a check-manifests rule · close FEAT-025 ·
  CLAUDE.md repo-map sentences · un-export 13 helpers, delete readShape · always-on-cost test to /tmp
Needs Ajesh's yes (each is a subtraction):
  run `boss sync` on BOSS + a dogfood row (pin==VERSION, managed==stage) · IDEA-101 merge ·
  postLaunch skills lay down on first ship, AI quartet on first LLM call (manifest already has the
  groups) · /evidence+/interview debrief+/research → one input-routed verb · docs/loops → .boss/loops
  · Unreleased heading + release-on-publish (changes CLAUDE.md rule 5) · one story, one home
One-way doors:
  IDEA-087 un-ignore docs (cheapest half: research/verdicts/) · branch-per-session · session cap
Before any of the above, per the venture lens: send message 1; ask EVID-003 "did you come back?"

## Kick-off — 2026-09-12 19:35, branch `assess/board-2026-09-12` off v0.323.0 (db656bf)
Already landed by peers before kick-off: IDEA-101 (/boss-learn → /extract, v0.322.0) · plugin eval with
a baseline arm (v0.320/321 — the instrument for step 3) · model names out of shipped text (v0.323.0).

Order of work (one concern per commit; one VERSION at merge):
- [ ] A1 git-dates single pass — board/records/recap; readiness stops re-collecting; spawn-count test
- [ ] A2 drift-loop glob (`*-canvas.md` → also `CANVAS.md`) + focus exit (shipped + BOSS's own docs/loops)
- [ ] A3 check-site / check-help "today" in local time, not UTC
- [ ] A4 release.js refuses a VERSION not strictly greater than the last committed one
- [ ] A5 one gate list: `release` runs `check`; `test`/`test:ci` are named subsets of it
- [ ] A6 strip v0.NNN / IDEA-NNN / 🔴⛔🆕 from shipped SKILL.md bodies; check-manifests rule beside " #"
- [ ] A7 un-export 13 internal helpers; delete config.readShape
- [ ] A8 always-on-cost test works on a tmp copy, not the working tree
- [ ] A9 CLAUDE.md repo-map sentences (library/agents|skills|hooks|memory-seed/ do not exist)
- [ ] A10 close FEAT-025 → shipped (rungs 1–2); spun_to a deferred IDEA for rungs 3–4
- [ ] B  the cliff: postLaunch lays down on first ship; AI quartet on first LLM call (manifest groups exist)
- [ ] C  /boss is the everyday door: body branches on position; names the verb after the act
- [ ] D  run the plugin eval both ways (procedures resident vs reached via the door); the number decides
- [ ] E1 /evidence + /interview debrief + /research → one capture verb routed on input
- [ ] E2 docs/loops → .boss/loops (loadLoops path + 20 template files)
- [ ] E3 one story, one home (site h1 / README hero / CLAUDE.md one-liner / welcome quote one sentence)
Deferred, flagged, not started here: dogfood re-sync of `.claude/` (five sessions run it live) · Unreleased
heading + release-on-publish (a flow rule; propose as a DEC, not a unilateral change) · IDEA-087 · branches/caps.
