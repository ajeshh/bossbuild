---
domain: craft
for: is what BOSS's practice shelf says about building with AI still true — agents, MCP, the host, security, data, testing, design process, deploy
kinds: <practice-or-area> · due · event "<what changed>"
open_first: `npm run check:freshness` (what's due, and when each was swept), then the build-craft watchlist's taps, then the live practice itself, then prior verdicts
verify_by: three skeptics for a claim about practice; for a host or protocol fact, the vendor's own current docs or spec, read today — and run it where it can be run
lands: findings → the session record (local); candidates → docs/research/inbox/ → /vet → /extract; the practice corrected in place, dates re-stamped
ages: per the practice's `curve:` — host · protocol · threat 90 days, market · craft-ai 180, craft 365
sensitive_when: a source names an outside repo, a vendor's product or a person's private thread — the session keeps it; tracked text describes it by shape
---

# `/scout craft` — keep BOSS's build practice true

BOSS's own domain, on the founder's shelf (`docs/research/domains/`), read by the same `/scout`.
Was `/practice-refresh` (and, for this kind of question, `/deep-research`). The seed: *"create a
process to check and update as needed… to ensure we keep it fresh"* (Ajesh, 2026-07-30, IDEA-056).

**It hunts for what's wrong, not just what's missing.** `boss sync` pushes every stale claim on the
shelf into real projects continuously; a wrong practice is worse than a missing one.

## When

- **On demand** — `/scout craft mcp`, `/scout craft security`.
- **Due** — `/scout craft due` sweeps what `check:freshness` reports overdue or due soon. Schedulable
  through the host's scheduler: monthly check, per-curve sweep, and a scheduled run **proposes a PR,
  never commits**.
- **On an event** — `/scout craft event "<what changed>"`: a spec revision, a breach or new attack
  class, the host shipping or deprecating an extension point, a load-bearing claim publicly refuted.
  *Cadence catches slow rot; events catch the rot that hurts* — `mcp.md` was wrong within five days
  of a spec landing while the cadence read 25 fresh, 0 overdue. BOSS senses no event on its own: the
  event trigger is someone running this.

## The domain's own steps (on top of `boss craft research`)

1. **Curate the taps before searching, and stamp `taps_reviewed:`.** Dead? (fetch every URL tap) ·
   quiet? (record the silence, lower the cadence — never widen the search to manufacture a finding) ·
   missing? (anything the last pass found outside the taps) · still the right person? (a name carried
   on reputation; standing comes from what held up — `boss sources docs/research/sessions` counts it once
   sessions write claim rows). A dead tap returns nothing and looks quiet.
2. **Scope each pass `since` that practice's own `last_reviewed`** — practices are swept at different
   times, and that is the feature. **Ask for refutations and confirmations**, not only additions.
3. **Diff against the live text, line by line, into four buckets** — *confirmed* (most findings; a
   good run) · *sharpens* · *genuinely new* · 🔴 *now wrong*. Quote the practice line each touches.
4. **Judge through `/vet`**, one claim per verdict, default NO for additions. **A reversal is held to
   the bar of the claim it removes**, not a higher one — skepticism that only protects the status quo
   is how a shelf rots.
5. **Route through `/extract`, and prefer subtraction.** Correct in place (no dated addenda;
   `provenance:` carries history). A finding may belong in an agent prompt rather than a practice. If
   the guidance is now the tool's default, cut it.
6. **Re-stamp every practice swept, including the unchanged** — `last_reviewed:` today, `review_by:` by
   the curve; `check:freshness` errors if they disagree. A refresh-log row on the watchlist; a session
   record.
7. **Close the loop on the public shelf.** `npm run check:site`; re-read page prose if the judgment
   (not just the date) changed; a new source goes into `library/sources.json` with its URL.

Every shelf change is a CHANGELOG bullet under `## Unreleased`, so `boss sync` carries it —
**a reversal especially.**
