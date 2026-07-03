# CLAUDE.md — {{PROJECT_NAME}}

@AGENTS.md

> Scaffolded by BOSS {{BOSS_VERSION}} in **{{MODE}}** mode ({{STAGE}}) on {{DATE}}.
> The host-neutral **working rules + conventions live in `@AGENTS.md`** (imported above — read it
> first). This file adds only what's Claude-specific: the skills, the conscience, and the mode ladder.
> Keep it short — compliance drops past ~200 lines.

> **First time? Run `/welcome`** — gentle orientation, takes a minute, defines terms inline.
> Already familiar with BOSS? Skip to `/boss <idea, file, Google Doc / Obsidian / PDF, or URL>` to
> spin up — it pulls your material in. Already have it written somewhere? `/import <file|url>`.

## What exists in this mode ({{MODE}})

- **Agents:** `pm` (decides what's worth building), `coder-generalist` (builds it, in whatever stack gets chosen), `mentor-venture` (coaches *you*, the founder — is this worth it, what's the riskiest assumption, what's the next real step).
- **Skills:** `/welcome` (gentle first-run orientation — cohort-aware), `/boss` (spin up an idea — point it at a sentence, file, doc, or URL), `/import` (bring existing material in — Word/Google Doc/Obsidian/PDF/deck/link → `docs/source/`), `/triage` (capture an idea & keep adding to it — a living doc), `/prototype` (drop an idea, hit go — build the smallest clickable version fast), `/canvas` (pressure-test it as a humane business when it has legs), `/evidence` (capture a real signal about your riskiest assumption as a durable `EVID-NNN`, honestly graded — the conscience reads it and gets quieter when commitments exist), `/interview` (prep a Mom-Test customer call, then debrief your notes into graded evidence — the bridge from "talk to someone" to a captured `EVID`), `/research` (drop in a real transcript — interview, sales call, support thread — and BOSS digests it into graded `EVID` + product context, flagging where you led the witness; never fabricates), `/decide` (record a load-bearing or hard-to-reverse call as a durable `DEC-NNN` — who decided, why, how reversible), `/persona` (your app's target user as a consultable voice), `/comprehend` (AI-native: tailor the scaffold to what BOSS understands — opt-in via `--ai`), `/feedback` (tell BOSS's makers what's working / broken — user-initiated, never background telemetry), `/boss-sync` + `/boss-learn` (pull BOSS updates in / promote a pattern UP).
- **Docs:** `docs/ideas/` (living idea docs + canvases), `docs/IDS.md` (the ID system, minimal here).
- **Memory:** two kinds, kept apart so context stays lean. *Durable facts* (who you are, settled decisions) → Claude's auto-memory, active across sessions. *Working state* (notes that only matter while you're in one area of the code) → `.claude/rules/your-app-code.md`, which loads **only when** Claude opens a file it's scoped to — not every session.

### The Quickstart arc

Quickstart is a tiny incubator: **capture → keep adding → canvas → unlock MVP.**

1. **Capture** a raw idea with `/triage` (or `/boss`). It becomes a living `docs/ideas/IDEA-NNN.md`.
2. **Keep adding.** Re-run `/triage` whenever a new thought lands — it appends to the capture log and sharpens the idea. No pressure to "finish."
3. **Canvas** it with `/canvas` once it has legs — a humane business pressure-test (the Humane Product Canvas + lean/Lenny prompts) that names the riskiest assumption and a one-week experiment.
4. **Unlock MVP** (`boss unlock mvp`) when the canvas holds up and you're ready to build.

BOSS plays **conscience** along the way: if you keep capturing without testing anything, `/triage` will
pause once to ask *what does this prove?* — a nudge toward `/canvas`, never a gate. Capturing isn't the
same as validating.

## The four modes (unlock additively)

This project is in **{{MODE}}** mode. Modes level up as the project earns it:

| Mode | Adds | When |
|---|---|---|
| **Quickstart** _(here)_ | idea capture, `/boss` spin-up, `/triage`, `/prototype`, pm + coder | you have an idea to capture |
| **MVP** | `/spec` + `FEAT-NNN`, `/smoke` build gate, devlog, `/close` + RESUME.md, tester | you're ready to build the first working version |
| **V1** | design system, prototypes, `/board`, doc-placement contract, db-architect | ready for a real, shippable v1 |
| **Scale** | PM org, refactor automation, code-health, product council | a fully blown-out, complex app |

Run `boss status` to see your mode and whether newer BOSS practices are available. Run `boss unlock <mode>` (e.g. `boss unlock mvp`) to level up.

---

## Reference

### Agent roster (Quickstart)

| Agent | Use for |
|---|---|
| `pm` | What's worth building, scope, priority. Not a coder. |
| `coder-generalist` | Implementation in the chosen stack. Configured when the stack is decided. |
| `mentor-venture` | Coaches the founder: is this worth it, riskiest assumption, next step. Advisory only — no code. More mentors unlock per mode (see `docs/MENTORS.md`). |
