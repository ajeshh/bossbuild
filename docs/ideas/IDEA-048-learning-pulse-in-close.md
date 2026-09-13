---
id: IDEA-048
type: idea
owner: product-lead
status: shipped (v0.104.0 — the one question in `/close`)
proof: stages/L1-mvp/template/.claude/skills/close
created: 2026-07-02
source: fable-campaign step-back (Fable 5 deep read, 2026-07-02)
---

# IDEA-048 — The learning pulse: one question in `/close`

## The gap

The canvas names a weekly-experiment cadence; nothing in BOSS carries it. The build/learn ratio — the
single number the thesis cares about — is invisible. But a cadence *hook* is the over-fire trap this repo
has correctly refused three times (Red-Light, distribution, presence). The honest form is one question on
an existing deliberate surface.

## The shape

`/close` (which already writes the devlog and revises the brain's standing summary) gains **one question**:

> *"What did this stretch teach you that a conversation — not a commit — taught you?"*

- If the founder has an answer → offer to capture it as an EVID ([[IDEA-045]]) or a brain note. Ten seconds.
- If the answer is "nothing" several closes running, the *brain's standing summary* records that fact
  plainly — which the conscience's existing drift moment already reads. **No new hook, no new predicate,
  no counter with a threshold.** The existing machinery gets one more honest fact to see.

That's the whole idea. Its virtue is its size.

## Guardrails

- One question, asked once per close, never re-asked in-session, never blocking.
- "Nothing this week" is an acceptable answer recorded without comment — the pulse observes, it never grades.
- Explicitly NOT a streak, NOT a weekly-review ceremony, NOT a new moment.

## OPUS HANDOFF PROMPT

```
You are implementing IDEA-048 (the learning pulse) for BOSS.
Repo: ~/Projects/bossbuild. Read docs/ideas/IDEA-048-learning-pulse-in-close.md
and the shipped /close skill (find it under stages/ — L1/MVP) first. This is deliberately
tiny; do not grow it.

TASKS
1. In the shipped /close skill text, after the devlog/brain-revision steps, add the one
   question: "What did this stretch teach you that a conversation — not a commit — taught
   you?" With: (a) if answered, offer to capture as an EVID (IDEA-045 schema if shipped;
   else a brain note); (b) "nothing" is fine — record it in the standing-summary revision
   plainly ("built all week, learned from no one" is a fact, not a judgment); (c) never
   re-ask, never block.
2. Do NOT add: any hook, predicate, counter, threshold, streak, or new moment. If you
   feel the urge, re-read the idea file's guardrails.
3. Version: patch bump + registry/CHANGELOG.md one-liner: "/close asks the learning-pulse
   question — the build/learn ratio becomes visible to the brain the conscience already reads."
4. TEST: /tmp scaffold to MVP (boss unlock mvp), verify the /close skill text contains
   the question with 0 placeholders; clean /tmp + prune registry/projects.json.
Do not commit unless asked.
```
