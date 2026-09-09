---
id: DEC-014
type: decision
owner: "@ajeshh"
decided_by: founder
status: decided
created: 2026-08-21
reversibility: reversible
revisit_by: 2026-11-21
follows: DEC-011, DEC-012
---

# DEC-014 — The website stops assuming the destination, and claims nothing about commons

> Work-order item **2b**, and the end of a standing constraint. *"Website stays untouched till we
> solve this"* held for **four consecutive decisions** ([[DEC-010]], [[DEC-011]], [[DEC-012]], and
> the eval turn). The mechanism is now built, so the claim is now allowed — and the claim turns out
> to be a **subtraction**.

## Context

Ajesh, 2026-08-21: *"how much does it need to be on website.. should be barely anything right?"*

Right. An audit of every venture-assumptive line on the public site found the problem was far
narrower than the work order assumed — **five phrases across three pages**, and most of what looked
like scope-setting language was legitimate:

| line | verdict |
|---|---|
| `index.html` *"tell a real **business** from a convincing demo"* | 🔴 the thesis line — it filters |
| `index.html` *"no willingness to pay … a **real business value app**"* | 🔴 classifies every commons tool as pseudo |
| `charter.html` *"mostly to your own venture … it's **your company**"* | 🔴 scope-setting inside a RULE |
| `whats-new.html` *"not useful to someone **building a company**"* | 🔴 minor, same shape |
| the cleaning-business demo (×3) | ✅ kept — a worked example is allowed to be specific |
| `start.html` *"venture brain"* (×3) | ✅ kept — that is a real filename, `docs/venture-brain.md` |
| `team.html` *"whether to raise"* | ✅ kept — accurate description of `mentor-capital` |
| `canvas.html` *"does this work as a business?"* | ✅ kept — describing what the BMC asks |

## Decision

**Change only the words naming the DESTINATION. Add nothing.**

1. *"a real business"* → *"a thing people actually need."* The underlying claim is universal — can
   you tell real pull from a convincing demo — and it is as true for a neighbourhood tool as for a
   startup. **Name the test, not the destination.**
2. *"no willingness to pay … a real business value app"* → *"nobody who would miss it … a real one."*
   WTP as a defining symptom made every non-commercial project a pseudo app by definition.
3. *"it's your company"* → *"it's yours."* This one sat inside the muting rule, on the page a
   commons-minded reader is most likely to check.
4. *"someone building a company"* → *"someone building the thing."*

### 🔴 "startup" STAYS, and that is what keeps the diff honest

`CLAUDE.md` kept *"a just-in-time **startup incubator**"* when [[DEC-011]] changed the telos to
*"a company, a co-op, or a commons."* **The category word survived that edit deliberately; only the
destination moved.** The site mirrors that exactly. Changing the homepage `<h1>` would be the site
getting ahead of the repo's own recorded decision — the failure this whole arc exists to prevent.

### Nothing is claimed about commons, co-ops, or social good

**No rungs exist.** IDEA-067 rungs 2–3 are deferred at n=0, there is no co-op mentor and no
`intent` axis. Advertising support that is not built is the
[[dev-workspace-described-as-shipped]] failure at the most public surface BOSS has. **Every edit here
removes a word; none adds one.** That is the whole shape of the decision.

## Why

- **Mechanism first, claim second — and this is the first time the claim was earned.** Fifteen
  releases of defaults, prompts, moments and charter shipped before a word of the website moved.
- **The cost of holding had been taken three times and was real:** a commons-minded founder
  evaluating BOSS could not tell any of this from the outside. It is now visible by *absence of a
  filter* rather than by a promise.
- **The audit is the deliverable as much as the edit.** Seven lines that looked wrong were checked
  and deliberately kept, with reasons. A sweep would have taken all of them.

## Falsifier

1. **The subtraction reads as vagueness.** If the homepage now says nothing sharp — *"a thing people
   actually need"* landing softer than *"a real business"* — the edit traded precision for range and
   should be re-pointed rather than reverted.
2. **Someone arrives expecting commons support.** If a reader takes the absence of venture framing as
   a claim of co-op/commons features, the subtraction implied something after all, and the honest fix
   is an explicit *"not built yet"* rather than silence.
3. **The h1 turns out to be the filter.** If real signal says *"startup incubator"* is what bounced
   them, then the category word — not the destination words — was the load-bearing one, and
   `CLAUDE.md` needs the edit before the site does.

## Consequences

- `web/index.html`, `web/charter.html`, `web/whats-new.html` edited; all 15 `site/` pages regenerated
  — which also **un-staled the version stamp, four releases behind at v0.210.0**, because nobody ran
  `npm run release` for v0.211.0 → v0.214.0.
- **The standing "website stays untouched" constraint is now DISCHARGED**, not overridden.
- 🔴 **`https://oyeboss.build/` is LIVE** (corrected 2026-08-22 — this line first claimed the domain
  resolved to nothing, carried forward from a stale RESUME entry rather than checked). So
  [[DEC-010]]'s CC BY-SA grant on the canvas page **is already real**, and the subtraction above is
  **committed but not yet visible**: the deployed build predates v0.215.0 and still shows the line
  this decision removed. The decision is not delivered until the site is re-deployed.
