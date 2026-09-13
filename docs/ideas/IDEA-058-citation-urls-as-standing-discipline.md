---
id: IDEA-058
type: idea
owner: product-lead
status: shipped (v0.194.0 — 17 of 18 verified and filled; 1 deliberately null)
program: public-surface
proof: library/sources.json
proof_note: Completed on its CONDITION, not a file. Citation debt went 18 of 20 → 1 of 20 in v0.194.0: every URL was fetched and read before it was written down, never recalled. The last one is a DECISION, not debt — Karpathy's verifiability line resolves only to secondary write-ups, so it stays `url: null` with the search recorded in `url_note`. Zero would have required inventing a plausible link, which is the exact failure /vet step 3 exists to catch.
created: 2026-08-20
source: Ajesh, 2026-08-20 — "for the future for our own records, we should always store urls from
  content we leverage" (alongside "share all the key folks we overall learnt from… would also be
  good for SEO").
---

# IDEA-058 — Citations keep their URLs, and the front door keeps up

## The finding

Building the website's credits surface exposed the gap: **BOSS has 41 named sources across its
practice shelf and URLs for two of them.** Every `provenance:` line names *who*. Almost none says
*where*.

The sharp part is that **the work was already done and then thrown away.** `/vet` step 3 — the
attribution check added in v0.159.0 — explicitly requires going to *the primary source, not a
summary, not a thread*. So someone opened the real document, verified the claim against it, graded
it, and then recorded only the name. The URL, which was in the browser at that moment, was discarded.

## Why it costs more than tidiness

- **A practice can't be re-checked cheaply.** `/practice-refresh` re-reads a practice against reality
  on its `curve`. Without the URL, every refresh re-does a search someone already did.
- **Credit is weaker than it should be.** BOSS is largely a distillation of other people's published
  thinking; naming them without linking them is thin credit for a load-bearing contribution.
- **It's the same shape as the failures BOSS already names.** `mcp.md` was wrong at 7 days old because
  the ground moved and nothing pointed at the primary doc. A citation you can't re-open is a citation
  that rots silently.
- **Ajesh's SEO point is real but secondary** — outbound links to primary sources are how a credits
  page earns its keep. The stronger reason is re-checkability.

## Built on this pass

- **The rule now lives inside `/vet`** (step 3, the attribution check): *write down the URL you
  actually opened — not the thread that pointed at it.* Recorded in the verdict, carried into the
  registry on adoption. This is the durable half: the discipline fires where claims enter, not where
  they're displayed.
- **`library/sources.json`** — one registry: `{ key: { name, url, kind, for } }` plus a
  practice→sources index. URLs are deliberately `null` rather than guessed; **fabricating a plausible
  link would be the exact failure `/vet` step 3 exists to catch.** Filling one in turns that name into
  a link on the next `npm run gen:site`, everywhere it appears.
- **`/credits`** — the collective roll call Ajesh asked for (people · labs & projects · research &
  incidents · standards), replacing per-practice walls of provenance prose with compact chips plus a
  `full provenance` disclosure.
- **`npm run check:site` reports citation debt** — currently **39 of 41** — so the number is visible
  and shrinking rather than an unmeasured intention.

## The second half (2026-08-20) — the website has to keep up with the tool

Ajesh: *"anytime we have a new feature or improvements that matter to boss, that we might need to
surface documentation to the website or help docs or guide, we should have an awareness to make those
updates… so that our website doesn't start to be outdated because we are moving so fast."*

**He is describing a failure already in progress.** During the single session that built the site,
VERSION moved 0.163 → 0.168 and the skill count went 46 → 47. A hand-written site cannot survive that
cadence on good intentions.

The generated half was never the risk — the roster, the ladder, the counts and the practice
attribution all derive from the manifests. **The risk is the prose wrapped around them**, which
silently stops being true.

**Built:**
- **Each page declares `covers:`** — the source paths it documents (`src/cli.js`, `library/practices`,
  `docs/GUIDE.md`…). `npm run check:site` compares those paths' last commit against the page's
  `reviewed:` date and names any page that now trails its source.
- **And, more usefully, `git status` on the same paths** — so a page is flagged *while the work is
  still uncommitted*. That's the cheap moment: the docs are one edit away and you still remember what
  moved. On its first run it flagged 7 pages against work in flight.
- **`website keeps up` in the release gate** — soft (prose never blocks a release) but named, because
  the entire failure mode is that nobody notices.
- **The question moved into the skills where work lands**, not just a check someone has to remember:
  `/boss-learn` now closes by asking whether the route changed what BOSS *is* from a user's point of
  view, and `/practice-refresh` closes by noting the shelf is published — a refresh that changed the
  *judgment* leaves the surrounding prose arguing an outdated position (the `mcp.md` case).

**Deliberately not built:** a gate that *blocks* on stale prose. Docs debt is real but blocking a
release on it trains people to bypass the gate — the exact way BOSS's earlier checks got ignored.

## Not built — the open questions

- **Backfilling the 39.** Deliberately not guessed. Each one needs someone to re-find the primary
  document, which is exactly the work the missing URL costs. Candidate: fold it into each practice's
  next scheduled `/practice-refresh` rather than one bulk session — the refresh is already re-reading
  the source.
- **Should `provenance:` itself carry URLs**, making `sources.json` a derived index rather than a
  parallel store? Cleaner (single source of truth, Principle 3) but touches 28 files. Worth doing
  *if* backfill happens anyway.
- **Should `/boss-learn` and the research-sweep intake carry the same rule?** `/vet` covers claims
  from strangers; a pattern promoted UP from a founder's own build has provenance too.
- **A `check:citations` gate** that fails when a *newly added* source lands with no URL — enforcing the
  rule going forward without punishing the existing debt. This is the piece that would make the
  discipline real rather than advisory.
