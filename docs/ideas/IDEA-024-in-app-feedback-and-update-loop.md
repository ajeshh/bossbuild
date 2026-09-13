---
id: IDEA-024
type: idea
owner: product-lead
status: shipped
gist: The two-way channel a public alpha needs: pushing updates out (largely built) and hearing back in (missing). Naming which half exists is most of the work.
proof: stages/L0-quickstart/template/.claude/skills/feedback
---

# IDEA-024 — In-app feedback + the update loop (the public-alpha two-way channel)

**Occasioned by** the 2026-06-19 session, right after BOSS went public (MIT, github.com/ajeshh/
BlueprintOS). Ajesh: *"ensure there is a way to get feedback from endusers in app, and our capability
to keep pushing new updates and inform users of what has changed."* Going public turns a private
dogfood into a thing strangers run — which needs a two-way channel that didn't matter at n=1.

## The two halves — and what already exists

**Half A — inform users / push updates (LARGELY EXISTS, name the gap):**
- `registry/CHANGELOG.md` = the per-version "what changed."
- `/boss-sync` + `boss sync` = pull updates into a project as a narrated diff, bump the pin.
- `boss status` = flags drift (*"⟳ newer practices available"*).
- Public+MIT update path for end-users: `git pull` + `npm i -g .`, then `boss sync` per project.
- **Gap:** pull-based only — no `npm publish`, no auto-update, no "BOSS X.Y is out" signal that
  reaches a user who isn't already running `boss status`. Acceptable for alpha; revisit on traction.

**Half B — in-app feedback (THE REAL GAP, build it):**
- No founder-facing way to send feedback back upstream. Internally there's the `/vet` inbox + research
  session notes, but nothing a *founder using BOSS* can reach.

## Humane constraint (load-bearing — [[IDEA-021]])

BOSS's differentiator is the humane lens; feedback is exactly where a tool turns into surveillance.
The rule: **user-initiated only.** `/feedback` is the founder choosing to speak — never a background
telemetry hook, never silent collection. Any context attached (BOSS version, mode, OS) is shown to the
founder *before* it's sent, and nothing leaves the machine without an explicit yes. "Read the trace,
don't instrument the human" — and here, don't even read the trace; let them hand it to you.

## Smallest real slice (the build)

A **`/feedback`** skill (L0, so every project has it from Quickstart):
1. Take the founder's feedback text (ask one question if none given).
2. Draft it with **transparent, minimal context** — BOSS version + mode (from `.boss/manifest.json`),
   OS, and the skill/area it's about. Show the founder exactly what will be sent.
3. On a yes, file it **upstream as a GitHub issue** on `ajeshh/BlueprintOS` via `gh issue create`
   (the channel that actually reaches the maintainer from a stranger). If `gh` is absent/unauthed,
   **fall back**: print a prefilled `https://github.com/ajeshh/BlueprintOS/issues/new?...` URL +
   the body so they can paste it. Never block on tooling.
4. Optionally keep a local record in the founder's project (`.boss/feedback.log`) so they have a copy.

## Deferred (named)

- **Auto-update / `npm publish`** — a real distribution channel + "new version available" nudge.
  Earn it when there are users who'd benefit (don't build a release pipeline for n≈1).
- **Telemetry of any kind** — explicitly *not* building. Would violate [[IDEA-021]]; revisit only as
  opt-in share-up with a humane contract, never default.
- **Routing feedback to mentors/personas** — a `/vet`-style triage of inbound feedback. Later.
- **In-product changelog surface** (`boss whatsnew`) — a founder-facing render of CHANGELOG deltas
  since their pin. Cheap follow-on if `boss status`'s one-liner proves too quiet.

## Dogfood

BOSS itself is now the public alpha; the first real `/feedback` issues will land on its own repo.
