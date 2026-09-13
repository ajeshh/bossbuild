---
id: IDEA-029
type: idea
owner: designer
status: shipped
gist: BOSS's AI-UX heuristics are 2024–25-correct — single-turn, single-agent, human-in-the-loop. The frontier moved to plural, background, long-running, risk-tiered work, and the gaps are missing heuristics rather than wrong ones.
program: ai-native-boss
proof: library/practices/ai-ux-patterns.md
created: 2026-06-20
---

# IDEA-029 — 2026 AI-native interface patterns (the design half of the trends pass)

> Seed: the 2026-06-20 UI/UX scan
> ([SESSION](../research/sessions/SESSION-2026-06-20-ui-design-scan.md)). The design-and-interaction
> companion to [[IDEA-025]]…028. **Extends [[IDEA-010]]** (scalable AI-assisted design) — IDEA-010
> owns tokens/drift/prompt-patterns; this owns the *interaction* layer (when BOSS speaks, how it
> shows confidence, how it gates, how it repairs trust).

## The reframe

BOSS's six AI-UX heuristics are 2024–25-correct (single-turn, single-agent, HITL). The 2026 frontier
moved up a level — to *plural, background, long-running, risk-tiered* agent work. The gaps aren't
wrong heuristics; they're **missing ones**, plus two that need sharpening.

## What's embeddable now (shipped v0.49)

1. **"Why this" rationale** — the conscience/mentors say *why*, grounded in the founder's own inputs
   ("steering you to Quickstart because you said it's day one"). Cheapest, highest-leverage; doubles
   as mentorship. → folded into `ai-ux-patterns.md` + the AI-UX heuristics block.
2. **5-token distinctiveness pass** (the shadcn-trap fix) + DTCG-compliant, semantically-named output
   emitted into CLAUDE.md. → embedded in `/design-tokens-init`.
3. **Edit-before-execute + risk-tiered HITL** (four verbs: approve / edit / reject-with-feedback /
   respond; gate by loss type, not uniformly). → `ai-ux-patterns.md`.
4. **Trust-repair moment** (own the miss; reduce autonomy asymmetrically). → `ai-ux-patterns.md`.
5. **Notify / Question / Review registers** + working/blocked/done state vocabulary + progressive
   disclosure (verdict first, "why" on demand). → `ai-ux-patterns.md`.
6. **Discernment — knowing when NOT to speak — as a first-class trust fundamental.** → heuristics
   block + the practice.
7. **Pinned canonical references** (Shape of AI / HAX / IBM Carbon; community catalogs via `/vet`). →
   `ai-ux-patterns.md` + designer roster.

## Staged (capture, don't build)

- **Planning-as-collaboration / mid-run steering** (Appleton "zero alignment") — speculative; the
  scaffold is turn-based today. Re-open when BOSS runs long multi-agent passes a founder needs to
  redirect. Twin of [[IDEA-026]] Part A (upstream firing) — both say *align before the agent runs*.
- **RESUME.md as an agent-inbox / "what's in-flight, what needs me" surface** — extends `boss board`
  ([[IDEA-015]]); build when multi-thread state actually needs it.
- **Wrapper-vs-flatten token abstraction** — pick per cohort (beginners flatter; eng-builders
  wrapped); a `/design-tokens-init` cohort branch when it bites.

## Why it rides IDEA-010, not a fresh silo
IDEA-010 already owns the AI-design failure-mode catalog + build-integration via loops. This is the
same lens one altitude up (interaction, not just style). Same anti-pattern to avoid (RVW-001): don't
freeze these into a static skill that rots — operationalize at runtime (heuristics the conscience +
designer apply), refresh on the model/host curve ([[IDEA-014]]).
