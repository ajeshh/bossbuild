---
id: IDEA-042
type: idea
owner: product-lead
status: shipped
gist: The standing sweep that keeps the dark-pattern catalog from freezing at the date it was adopted. Dark patterns are an arms race; a snapshot rots.
program: standing-freshness
proof: .claude/skills/humane-refresh
created: 2026-06-21
---

# IDEA-042 — Humane-lens refresh as a standing discipline (keep the dark-pattern catalog from rotting)

> **Shipped v0.95.0–v0.96.0:** the discipline (`/humane-refresh` skill + watchlist) and its **first full
> sweep** — two `/deep-research` passes, 9 verdicts (RVW-056–064: 7 ADAPT, 2 NOT-YET), 8 new pattern
> families/entries folded into `ai-ux-patterns.md` + `agent-security.md`. Deferred (earn-it, PRINCIPLE #2):
> the founder-facing "refresh *your* product's review" version, and an unprompted refresh *hook*. The
> quarterly cadence is ready to wire via `/schedule` (watchlist `next_review: 2026-09-21`).

> **The staleness-twin of [[IDEA-014]].** That one rides the *model* curve on purpose; this one rides
> the *dark-pattern / humane-design* curve on purpose. Same load-bearing fear: a catalog frozen at
> author-time silently goes stale, and nobody notices until it's wrong. The seed: Ajesh, 2026-06-21 —
> *"we should keep checking frequently for new [dark patterns] since it keeps changing… when new models
> and new tools arise we may need to keep robustly updating… design more process to easily run to see if
> we need to update anything or if there is new research/publications/posts to consider and expand."*

## The gap

BOSS has a genuinely strong dark-pattern spine already — the CDT 37-pattern taxonomy operationalized in
[`ai-ux-patterns.md`](../../library/practices/ai-ux-patterns.md), the [`harm-taxonomy.md`](../../library/practices/harm-taxonomy.md)
reasoning structure, the [`conscience-voicing.md`](../../library/practices/conscience-voicing.md) discipline
for *how* to surface a concern, and the runtime `/red-team --humane` test. But all of it is a **snapshot**:
adopted in the 2026-06-20 sweep, frozen at that date.

Dark patterns are an arms race. Three forces move the catalog out from under us:

1. **New research / regulation** — Brignull, FTC, EDPB, CPPA, CHI/CSCW, arXiv-HCI keep naming patterns and
   adding teeth (junk-fee rule, click-to-cancel, EU AI Act milestones). The catalog should absorb the real
   ones and ignore the noise.
2. **New models** — every frontier model opens new *emergent* manipulation surfaces (sycophancy was the
   first; agentic dark patterns are next). A boundary that was safe on the old model may not be on the new.
3. **New tools / platforms** — generative UI, AI agents acting on the user's behalf, voice/AR/VR — each is a
   new surface where dark patterns appear before anyone's named them.

[`ai-ux-patterns.md`](../../library/practices/ai-ux-patterns.md) already *gestures* at this in its
"Altitude / anti-rot" section ("Refresh them on the model/host curve, IDEA-014") — but the **machinery that
fires the refresh doesn't exist.** That's this idea.

## The pieces already exist — they're just not orchestrated

Same as IDEA-014: this is *connecting* what's scattered, not greenfield.

- **`/deep-research`** — the finder. Fan-out web search + adversarial verification + cited synthesis.
- **`/vet`** — the judgment. NO-biased rubric, RVW verdicts, the skeptical filter that keeps the catalog
  from bloating on every hot take.
- **`/boss-learn`** — the router. UP into the library / DOWN into the app, once a pattern earns it.
- **[`SOURCES.md`](../research/SOURCES.md)** — the institutional tap map (CDT, CHT, Stanford HAI, Ada
  Lovelace…). The humane-lens rows are *already* the watchlist's institutional half.
- **[[IDEA-014]]'s triggers** — "new same-vendor model" / "new host" are *the same events* that should also
  fire a humane-lens refresh. The two disciplines share a trigger surface.

What's missing is **the discipline that fires the refresh, scopes the research since-last-run, diffs the
findings against the current catalog, and routes the genuinely-new through `/vet`.**

## What it becomes — `/humane-refresh`

A BOSS-curating-BOSS meta-skill (sits with `/vet`, `/boss-learn`, `/boss-sync`; not in the founder
template). On demand, on a schedule, or on an event, it:

1. Reads the current catalog (dark-patterns §, harm-taxonomy, `/red-team --humane` dims) + the watchlist +
   the last-run marker.
2. Runs `/deep-research` against the watchlist query, **scoped since the last run** — what's new, not the
   whole field again.
3. **Diffs** findings against the catalog — genuinely-new/changed vs. already-covered (the RVW-001 anti-rot
   guard: this is a *re-run*, never a frozen list).
4. Hands the new candidates to `/vet` (default NO) → RVW verdicts.
5. ADOPT/ADAPT → proposes concrete edits (catalog entry + `/red-team` dim + harm axis) → `/boss-learn`.
6. Updates the last-run marker + a short session note; optionally prompts "are these still the right
   sources?" so the **watchlist itself** doesn't rot.

**Triggers (the user's chosen shape — schedulable + event):**
- *Cadence* — a scheduled sweep (quarterly default) via the host's `/schedule`.
- *Event* — fires on **new frontier model**, **new major tool/platform**, **new regulation/ruling**. Shared
  with [[IDEA-014]]'s recalibration triggers — when the model curve moves, *both* disciplines should fire.

**Honest scope on "event":** cadence is real automation (cron). Event-detection is *not* something BOSS can
fully sense on its own today — "a new frontier model shipped" reaches BOSS through a human noticing, or
through `/claude-api` / `/boss-sync` surfacing a model change. So the event trigger ships as a **named
checklist of conditions + the cheapest available signal**, with full auto-detection deferred (the honest
move; don't perform a capability we don't have — voice rule). A `humane-refresh` *hook* that fires
unprompted is the UP-when-earned upgrade, parked with the same host-mount gap as other deferred hooks.

## Riskiest assumption (resolve before over-building)

Same shape as IDEA-014's: **is the refresh frequent/valuable enough to deserve standing machinery — vs.
premature ceremony (PRINCIPLE #2)?** The honest read says *yes, more than IDEA-014's did*: dark patterns
demonstrably move faster than the model curve (regulation alone shipped junk-fees + click-to-cancel inside
one year), and the catalog is **outward-facing** — a stale humane lens isn't just BOSS being wrong, it's
BOSS failing the one thing it claims to do (Principle #6). The near-term earned slice is the skill itself
(it's thin — it orchestrates three skills that already exist) + the watchlist file. The general
"standing-disciplines framework" (unifying IDEA-014 + this + future security-refresh) stays **deferred** —
that's three instances abstracting prematurely; name the family, build the instance (PRINCIPLE #2).

## Cite

PRINCIPLE #1 (UP — a refreshed humane lens is a superset practice founders inherit via `boss sync`),
PRINCIPLE #2 (don't build the unifying framework until a third instance earns it), PRINCIPLE #6 (the humane
lens is the thing being kept fresh — staleness here is the worst failure). Connects: [[IDEA-014]] (the
model-curve twin; shared event triggers), the `/vet` → `/boss-learn` loop (judgment + routing),
[`SOURCES.md`](../research/SOURCES.md) (the institutional half of the watchlist), `ai-ux-patterns.md`
"Altitude / anti-rot" (the gesture this builds the machinery for), and the RVW-001 anti-pattern (re-run
research, never freeze a list).
</content>
</invoke>
