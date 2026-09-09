# CLAUDE.md — {{PROJECT_NAME}}

@AGENTS.md

> Scaffolded by BOSS {{BOSS_VERSION}} in **{{MODE}}** mode ({{STAGE}}) on {{DATE}}.
> Host-neutral working rules live in `@AGENTS.md` (imported above). This file adds only the
> Claude-specific layer. **Keep both short** — every line here is read on every turn, so this file
> spends the founder's context budget, not BOSS's. If something can be *looked up*, link it.

> **First time? Run `/welcome`.** Already know BOSS? `/boss <idea, file, doc, or URL>` spins up —
> it pulls your material in. Already have a repo? `/read-repo` reads it and says where you stand.

## What's here

- **Agents:** `product-lead` (what's worth building), `coder` (builds it, in whatever stack gets
  chosen), `mentor-founder` (coaches *you* — is this worth it, what's the riskiest assumption,
  what's the next real step), `prompt-coach` (sharpens how you ask; say *"help me ask this better"*).
- **Skills:** run **`boss map`**. It lists what this project actually has, live from the install —
  which is why this file doesn't enumerate them and can't go stale about them.
- **Docs:** `docs/ideas/` (living idea docs + canvases), `docs/IDS.md` (the ID system).
- **Memory:** durable facts about *you* go to Claude's auto-memory, which lives on **this machine**
  and travels to no cofounder — so anything the project depends on belongs in `docs/`. Working notes
  scoped to one area of the code go in `.claude/rules/`, which loads only when that code is opened.
- **`/clear` and `/compact` drop working context**, and neither is `docs/RESUME.md` (that's the
  project's state, which `boss status` reads back). Put anything you'd hate to re-derive into your
  idea doc *before* you run them.

### The Quickstart arc

**capture → talk to one person → pressure-test → unlock MVP.**

1. **Capture** the idea with `/idea` — a living `docs/ideas/IDEA-NNN.md` you keep adding to. No
   pressure to finish it; re-run `/idea` whenever a new thought lands.
2. **Talk to one person.** `/interview` preps a 15-minute Mom-Test call, then turns your notes into
   a graded `EVID-NNN` — and flags where you pitched instead of listened. **This is the step that
   pays for the others**: one real conversation beats another pass over the canvas, and the grade
   ladder (stated-pain → observed-behavior → commitment) is what stops a compliment reading as a
   receipt. `/evidence` records any signal you already have; `/research` digests a whole transcript.
3. **Pressure-test** with `/canvas` once it has legs — the humane business read that names the
   riskiest assumption and one week's experiment. It's a far better canvas after step 2.
4. **Unlock MVP** (`boss unlock mvp`) when the canvas holds and you're ready to build.

`/prototype` is a legitimate start too: build the smallest clickable version first, then fill the
gaps once you can see it. The conscience nudges once if you keep capturing without testing anything
— a pointer, never a gate. Capturing isn't validating.

## The four modes (unlock additively)

This project is in **{{MODE}}** mode. Modes level up as the project earns it:

| Mode | Adds | When |
|---|---|---|
| **Quickstart** _(here)_ | idea capture, `/boss` spin-up, `/idea`, `/prototype`, pm + coder | you have an idea to capture |
| **MVP** | `/spec` + `FEAT-NNN`, `/smoke` build gate, devlog, `/close` + RESUME.md, tester | you're ready to build the first working version |
| **V1** | design-system *enforcement*, prototypes, `/board`, `/design-library`, doc-placement contract | ready for a real, shippable v1 |
| **Scale** | `/incident` post-mortems, `/idea --feedback` customer register, the org mentor | customers are real and coordination is the bottleneck |

`boss status` shows your mode and whether newer BOSS practices are available; `boss unlock <mode>`
climbs a rung.

## Before you generate anything durable

Three questions, and they cost three seconds: **does it already exist?** (look for the *output*, not
the inputs — if it's there and it's fine, say so and stop, that is a complete outcome) · **what rung
is this project on, and what rung does this belong to?** · **if it's above their rung, what's the
seam** — the one cheap thing that stops history being *gone* rather than merely undone.

Full version, with the worked examples: **`boss craft seed-to-scale`**.
