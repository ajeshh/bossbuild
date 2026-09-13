---
id: IDEA-089
type: idea
owner: product-lead
status: deferred
gist: The outward half of documentation is zero at every rung; the fix is one seed at the ship moment, as a loop with a checkable predicate, not a skill.
program: founder-surface
created: 2026-09-10
proof: none
proof_note: >
  Deferred by decision, so there is nothing on disk to point at — and that is the correct state,
  not an omission. When this is built the proof would be `docs/loops/outward-docs-loop.md` plus its
  entry predicate in the stage manifest's `loops:` list. Deliberately NOT created as an empty
  placeholder: a loop file that exists and never fires is the shape v0.242.0 caught (a zombie
  detector that had never fired), and a `proof:` pointing at a stub would make this record read as
  in-flight when nobody is flying it.
deferred_because: n=0 — no founder has reported a documentation problem, and this adds a moment to a surface under the standing compose-and-SUBTRACT mandate.
reopen_trigger: The first founder who ships something and then asks about their README, docs, or release notes. Any EVID record mentioning documentation, at any grade.
related: RVW-097 (NOT-YET, a DIFFERENT claim), SESSION-2026-09-10-documentation-craft, EVID-001
---

# Documentation should grow with the app — and its outward half currently doesn't grow at all

## Current shape

**The framing came from Ajesh, 2026-09-10:** *"it's just the seeds of documentation, and like with
design, engineering and such — we help grow and scale as the app grows. So it's just enough
documentation that adapts and grows with what the founder builds."*

That is PRINCIPLE #2 restated for documentation, and **it is already BOSS's architecture for one
half of it.** The gap is an asymmetry, measured 2026-09-10 at v0.273.0:

| rung | inward docs | design | loops | **outward docs** |
|---|---|---|---|---|
| Quickstart | `/idea` `/canvas` `/evidence` `/decide` | — | 5 | **0** |
| MVP | `/spec` `/log` `/close` | tokens, review, ux-check | 13 | **0** |
| V1 | — | design-library | 1 | **0** |
| Scale | — | — | 0 | **0** |

Three readings, in order of usefulness:

1. **The inward half does exactly what the framing describes**, then flatlines at MVP.
2. **The outward half — the docs a founder's USERS read — is zero at every rung.** Verified by
   grepping every shipped `SKILL.md` for `write (the )?README`, `generate.*release notes`,
   `author.*user (guide|doc)`, `write.*help (article|cent)`: **no matches.** (An earlier looser grep
   returned four hits — `read-repo`, `spec`, `evidence`, `comp-eval` — all incidental mentions of a
   README, none of which write one. Do not re-derive the number with the loose pattern.)
3. **This is not documentation-specific.** The whole growth curve peaks at MVP: 5 loops → 13 → 1 → 0.
   V1 and Scale are nearly empty for *every* discipline.

## Why the thin top of the ladder is probably CORRECT, and must not be "fixed"

🔴 **[[EVID-001]]'s adjacency warning applies directly.** In the same session a founder said *the
offering isn't ready and I can't tell where I am*, BOSS shipped **seven post-launch releases of
operator surface for operators it had zero of.** Building out V1/Scale documentation rungs is that
mistake again with a different noun. The ladder is thin at the top because nobody has climbed it.

**So this idea is deliberately NOT "add a documentation ladder."** It is one seed, at the one rung
where a founder demonstrably has a user.

## The smallest version that proves it

**A loop moment, not a skill.** Design supplies the pattern: `/design-tokens-init` does not arrive
because MVP says so — `design-tokens-loop` watches for *real UI across several files* and fires when
the condition is true. The outward-docs seed wants the same shape.

- **Predicate (both halves already computable):**
  1. `hasShipped()` — already implemented in [`src/map.js`](../../src/map.js); reads a `FEAT` in the
     board's Shipped column. **Frontmatter-true, never guessed.**
  2. `README.md` has no commit after the scaffold commit — i.e. *something is live and its README
     still says what BOSS wrote.*
- **What it says:** points at §7 of `library/practices/documentation.md`, which already carries the
  doctrine and needs no writing. Its best line — *"the best help doc is the one nobody needed; a help
  article is often a defect report about the interface, written by the team that shipped the
  defect"* — is the right first thing a founder hears, because it will often send them to fix the
  screen instead of writing the page.
- **What it must NOT be:** a 49th skill, a `/docs` verb, a doc generator. The last one is
  **already refused by name** in `documentation.md` → *"What's left out (deliberately)"*:
  *"A doc generator. Docs that nobody chose to write are the ones nobody read."*

⚠️ **Steal the v0.268.0 lesson before writing the predicate.** `design-tokens-loop` fired at HIGH
confidence on a zero-dep CLI because `count_at_least` counted **occurrences** while the claim was
about **spread** — 52 matches in one file. A README predicate has the same trap available: "README
looks like the scaffold's" must be a comparison against the scaffold, not a keyword count.

## Open

1. **Is `README.md` even the right object?** A founder who ships via `/landing` may have no README
   worth reading and a landing page that matters more. The predicate may need to be "the outward
   surface you actually shipped," which is harder and possibly not worth it.
2. **§7's upper rungs have no home.** The two-readers discipline, `llms.txt`, and corpus pruning are
   V1/Scale concerns, and V1/Scale are the empty rungs. Held by the same argument as above.
3. **RVW-097 does not govern this.** That verdict judged *"ship BOSS's own freshness machinery as a
   practice"* and said NOT-YET. This is a different and better claim; it needs its own read, and
   should not inherit that no.
