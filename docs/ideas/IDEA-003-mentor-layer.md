---
id: IDEA-003
type: idea
owner: product-lead
status: shipped
gist: A second class of agents beyond builders: mentors that sit outside the app and coach the founder, accumulating a dossier that eventually helps real funding or hiring.
proof: stages/L0-quickstart/template/.claude/agents/mentor-founder.md
created: 2026-05-21
---

# Mentor layer — incubator/advisory agents + founder dossier

> **Depth slice shipped v0.106.0 (Fable Sprint C1 — "mentors read state before they speak").** Every
> shipped mentor template gained a standing **"Before you advise — read the state first"** block (canvas
> + bounded venture-brain slice + 3 recent `DEC`s + own dossier artifact; name contradictions with
> recorded state) + an **"After a consequential session"** step that *offers* to append its position to
> its dossier artifact — the **artifact doubles as mentor memory**, no new substrate. `docs/MENTORS.md`
> documents it. **Captured NOT-YET (explicit pull-triggers):** (a) `/consult` multi-mentor convening —
> trigger: a real founder hits a cross-remit decision (the host already convenes agents ad-hoc, so a
> skill must earn itself over that); (b) a dedicated per-mentor advice ledger — trigger: a real founder's
> dossier artifact can no longer carry the advice thread; (c) JIT mentor routing — **rejected as a hook**
> (over-fire trap, per the FEAT-024/IDEA-041 precedent); lives only as pointers inside existing
> deliberate skills (e.g. `/ship` → `mentor-gtm`). n=0 guardrail: all of this polishes the supply side of
> a marketplace with zero demand; only the near-free read-state slice was earned.

## Current shape
- **What:** A second class of agents beyond builders. **Mentors** (`mentor-*`) sit outside the app
  and *coach the founder* — ask hard questions, give counsel, help build concepts (business model,
  architecture strategy, fundraising, hiring). They accumulate a **founder dossier** that eventually
  helps real funding or recruiting a team.
- **Who it's for:** entrepreneurs — including those who don't know how to start a company — who want
  to be mentored from idea to fundable/hireable venture, if they choose.
- **Mentor roster (proposed):** venture-lead, business-strategist, technical-architect (advisory),
  go-to-market, fundraising-advisor, talent/team-building, pitch-coach, humane/ethics.
- **JIT per mode:** Quickstart = venture-lead (+ canvas); MVP = + architect, GTM; V1 = + fundraising,
  pitch, talent; Scale = full board.
- **Dossier artifacts:** Humane canvas → business proposal → architecture brief → pitch/deck outline
  → hiring plan → fundraising one-pager / data room.

## Capture log
- 2026-05-21 — Ajesh: "BOSS helps entrepreneurs bootstrap an idea and mentor them into a successful company if they choose." Two agent classes: builders vs mentors.
- 2026-05-21 — seed cornerstone `mentor-venture` into Quickstart; full board unlocks per mode.
- 2026-05-21 — Ajesh has **a list of real people whose best-practices for starting a new app**
  we should study and encode into the mentor roster (and likely `library/practices/` +
  `memory-seed/` via `/boss-learn`). *Awaiting the list.* Each person → source material for a
  mentor's voice/heuristics, or a named practice doc. (See open question on attribution below.)
- 2026-05-21 — **structure shipped in v0.9.0:** `docs/MENTORS.md` (two-class model, roster, JIT-per-mode
  mapping, dossier, the hard line) + cornerstone `mentor-venture` agent seeded into Quickstart. Status
  → building. Remaining: encode the people list, author the rest of the roster per mode, dossier templates.
- 2026-05-21 — **the people list arrived.** Ajesh's vision doc (`~/Documents/stuff/founder_mentor_
  process_map_temple.md`) carries the full named roster. Extracted + deduplicated + archetype-mapped into
  [`docs/mentor-practitioners.md`](../mentor-practitioners.md) — the *input* for the `/boss-learn` UP step.
  Suggested encoding order: `mentor-venture` feeders first (Fitzpatrick, Torres, Moesta, Savoia, Maurya).
  The doc also spawned [IDEA-004](IDEA-004-temple-culture.md) (the Temple/culture layer).

## Open questions
- Where mentors live (project `.claude/agents/` with `mentor-` prefix vs a separate surface)?
- How much dossier is auto-generated vs founder-authored with mentor guidance?
- Business model for BOSS itself if this becomes its differentiator (see [CANVAS.md](CANVAS.md)).
- **Encoding real people:** do we map one person → one mentor agent, or distill many people into a
  few archetypal mentor roles (with attributed heuristics)? How to attribute/credit without
  misrepresenting anyone's actual views? (Lean toward archetypes seeded by named practices.)

## Design home
`docs/MENTORS.md` (to author) — the two-class model, roster, JIT mapping, dossier.
