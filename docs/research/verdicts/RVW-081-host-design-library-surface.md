---
id: RVW-081
type: verdict
owner: product-lead
status: recorded
created: 2026-08-20
verdict: ADAPT
route: DOWN stages/L2-v1 (@dsCard markers + complementary framing — shipped v0.166.0/v0.169.0); the founder-facing POINTER deferred
---

# RVW-081 — the host ships a component-library sync; should BOSS integrate with it?

## The claim
- **Source:** the `DesignSync` tool schema **in this session's own toolbelt** (primary) ·
  [Piebald-AI/claude-code-system-prompts](https://github.com/Piebald-AI/claude-code-system-prompts)
  `skill-design-sync.md` (third-party mirror)
- **Core assertion:** Claude Code already ships a design-system sync — so BOSS should not build a
  gallery/sync surface, and should instead emit output that drops into the host's.
- **Inbox file:** `docs/research/inbox/host-ships-design-library-surface.md`

## Attribution — VERIFIED, and it CORRECTED one of BOSS's own claims

- ✅ **The tool contract was read directly** from the session toolbelt. That is as primary as it gets.
- ⚠️ **The skill's internals came from a third-party mirror**, not Anthropic documentation. Good
  enough to *correct* a claim; **not good enough to build a dependency on.**
- 🔴 **What it corrected:** v0.166.0 told founders the library *"uploads as cards with no extra
  work."* False. `/design-sync` detects a Storybook/package layout, runs **its own converters**,
  grades previews against a rubric, and emits a bundle (`_ds_bundle.js`, a `styles.css` `@import`
  closure, per-component directories, `_ds_sync.json` content hashes); first import *"potentially
  takes hours."* **One matching marker is not format compatibility.** Fixed in v0.169.0.
- ✅ **Convergent design, independently:** `_ds_sync.json`'s content-hash anchoring and BOSS's
  `manifest.json` `sourceHash` are the same mechanism for the same reason.

## Rubric

| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **No — it *enforces* one.** The host-seam rule (*don't author what the host ships*) is the reason to integrate rather than build. The counter-risk is #4/#5: depending on a claude.ai-account feature deepens host-binding, which [[IDEA-006]] already parks as accepted. |
| 2 | Evidence grade | **Split: primary for the tool, third-party for the skill, and ZERO for reachability.** Whether an ordinary founder can actually use this — login, design scopes, `PROJECT_TYPE_DESIGN_SYSTEM`, an hours-long first import — is **completely unverified.** |
| 3 | Duplicate or sharpen? | **Sharpens, and prevented a duplicate** — this is the finding that stopped BOSS building a sync engine and card index it didn't need. |
| 4 | Who serves / harms? | **Serves** founders already inside the Claude ecosystem with a real component library. **Harms `first-product` / `non-tech-founder` if pointed at prematurely** — an account requirement plus an hours-long import is a wall, and a tool that recommends a wall loses trust. |
| 5 | Cost / ceremony | **The marker is free** (an inert HTML comment). **The pointer is not** — it spends founder time on an unverified path. |

## Verdict: ADAPT

Adopt the **cheap, reversible half** — `@dsCard` first-line markers (verified correct), the
content-hash mechanism (convergently validated), and the honest *complementary-not-interchangeable*
framing. **Defer the founder-facing pointer** until reachability is confirmed against an Anthropic
primary source.

The most valuable thing this claim produced wasn't a feature — it was **catching an overclaim before
a founder hit it**, and a mechanism finding: **the taps watch publications; the toolbelt is ground
truth and arrives first.** That's now an event trigger in build-craft domain 2.

## If ADAPT — what changes
- **Keep** (shipped): `@dsCard` markers · the complementary framing · *don't build a sync engine,
  hosting surface, or card index*.
- **Do NOT** point founders at `/design-sync` in any skill text until an **Anthropic primary doc**
  confirms an ordinary founder can reach it. Currently BOSS mentions it only in the skill's
  *"know what it actually wants"* caution, which is the right side of the line.
- **Re-check** on the domain-2 cadence; a third-party mirror can go stale silently.

## Notes
- Prior related: [[RVW-078]] (retrieval), [[RVW-079]] (don't adopt an unsettled container).
- BOSS version when recorded: 0.171.0
