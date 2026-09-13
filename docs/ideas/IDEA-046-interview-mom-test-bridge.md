---
id: IDEA-046
type: idea
owner: product-lead
status: shipped
proof: stages/L0-quickstart/template/.claude/skills/interview
created: 2026-07-02
source: fable-campaign step-back (Fable 5 deep read, 2026-07-02)
---

# IDEA-046 — `/interview`: the Mom-Test bridge

## The gap

The conscience's single best line is *"a 15-minute call with the right person beats `/canvas`."* And then
BOSS abandons the founder at the exact moment they take the advice. There is no help preparing the call, no
discipline during it, no way to capture what it returned. BOSS walks the founder to the edge of
build-world and waves goodbye. `/interview` is the bridge into validation-world — and it's also **the tool
Ajesh needs for his own founder-friend conversations right now** (the canvas's live experiment), so it
gets dogfooded on day one against real stakes.

## The shape

Two movements, one skill (L0 — talking to humans starts before MVP):

1. **Prep** (before the call): reads the project's canvas riskiest assumption + existing EVIDs
   ([[IDEA-045]]) → drafts 5–7 questions under hard Mom-Test discipline (Fitzpatrick, already in BOSS's
   acknowledged roster): past behavior not future hypotheticals ("when did you last…", never "would
   you…"), their life not your idea, commitment asks at the end. Includes the anti-pitch warning: *the
   moment you describe your product, the data stops being clean.* One page, printable, done in 5 minutes.
2. **Debrief** (after): founder pastes raw notes / brain-dumps what happened → the skill (a) extracts
   candidate EVIDs with honest grades and offers to write them via the [[IDEA-045]] schema, (b) flags
   where the founder pitched instead of listened ("they said 'sounds cool' right after you explained the
   feature — that's a compliment, not evidence" — Fitzpatrick's fluff/compliments/deflection taxonomy),
   (c) suggests the ONE follow-up commitment ask if the pain looked real.

## Why now

Directly serves the v0.3 canvas experiment ("watch one real session, Mom-Test discipline"). Cheap: pure
skill layer, no `src/` change, no new state (writes into IDEA-045's ledger). And it's the rare feature
where BOSS's synthetic-vs-real honesty gets *enforced* mechanically: the debrief grades the evidence, so
stated pain can't silently masquerade as validation.

## Guardrails

- BOSS preps and debriefs; it never simulates the interview. (The persona agents may *rehearse* a
  founder's questions — pre-filter framing only, with the existing "personas are not validation" caveat.)
- No CRM ambitions: no contact management, no pipelines, no scheduling. One call, one page, one debrief.
- The pitch-detector flags, it doesn't scold — one observation per debrief, conscience-not-censor.

## OPUS HANDOFF PROMPT

```
You are implementing IDEA-046 (/interview — the Mom-Test bridge) for BOSS.
Repo: ~/Projects/bossbuild. Read CLAUDE.md, docs/RESUME.md, and
docs/ideas/IDEA-046-interview-mom-test-bridge.md first. Depends on IDEA-045's EVID schema:
if docs/evidence/ + the /evidence skill exist, write debriefed evidence through that
schema; if 044 has NOT shipped yet, implement /interview standalone with the debrief
outputting draft-EVID blocks inline for the founder to save, and leave a TODO seam.

CONSTRAINTS: skill layer only (no src/ changes); BOSS voice; Fitzpatrick attributed by
name (house rule: cite practitioners, never impersonate).

TASKS
1. New L0 skill stages/L0-quickstart/template/.claude/skills/interview/SKILL.md with two
   modes detected from invocation: /interview (or /interview prep) → PREP; /interview
   debrief (or pasted notes detected) → DEBRIEF.
   PREP: read docs/ideas/CANVAS.md riskiest assumption + docs/evidence/ if present;
   output ONE page: 5-7 Mom-Test questions (past behavior, their life, no future
   hypotheticals, no idea-description), a commitment-ask closer, and the anti-pitch
   warning. If no canvas exists, ask for the assumption in one sentence — don't block.
   DEBRIEF: take pasted notes; extract candidate evidence with honest grades
   (stated-pain / observed-behavior / commitment — definitions inline); offer to write
   EVID files (via IDEA-045 schema if present); flag AT MOST ONE pitched-instead-of-
   listened moment using Fitzpatrick's fluff/compliment/deflection taxonomy — observe,
   don't scold; suggest one follow-up commitment ask if pain looked real.
   Guardrail text in-skill: BOSS never simulates the interview; personas are rehearsal
   pre-filters only; no contact management.
2. Cross-links: the conscience's "a 15-minute call beats /canvas" style voicings and the
   /canvas skill each gain a pointer to /interview (grep for where that advice lives —
   likely conscience voicing frames and canvas skill text; lightest touch, one line each;
   if the voice frame text changes, check moments.js hash discipline and note if a
   regrade becomes due).
3. Wayfinding: boss map lists /interview; one GUIDE.md line in the validate section.
4. Version: bump VERSION (minor) + registry/CHANGELOG.md: "/interview — Mom-Test prep +
   debrief; the bridge from the conscience's advice to captured evidence."
5. TEST: /tmp scaffold via boss new; verify the skill lands with 0 placeholders and
   boss map lists it; run a paper test of both modes (prep against a stub canvas; debrief
   against 5 lines of fake notes) checking the grade-honesty pushback appears; clean /tmp
   + prune registry/projects.json.
Do not commit unless asked. Report file-by-file.
```

## Implementation notes (v0.99.0, 2026-07-02)

Built AFTER IDEA-045 shipped in the same session, so it writes through the real `EVID` schema — no TODO
seam needed. File-by-file:
- **`stages/L0-quickstart/template/.claude/skills/interview/SKILL.md`** — new L0 skill; PREP/DEBRIEF
  modes detected from invocation; Fitzpatrick cited by name; grade ladder inline; debrief writes `EVID`
  via `/evidence` (falls back to inline draft blocks if that skill is absent); one-shot pitch flag;
  guardrails (never simulates the interview, no CRM, personas = rehearsal pre-filter only).
- **Cross-links:** the caution frame and the drift frame in `.../hooks/lib/loop-runtime.js` each gained
  a one-clause `/interview` pointer; `/canvas`'s "Experiment this week" line + riskiest-assumption
  guidance point at it.
- **Wayfinding:** L0 `manifest.json` (skills + summary), template `CLAUDE.md`, `docs/GUIDE.md` ("talk
  to someone").
- **Version:** VERSION → 0.99.0; `registry/CHANGELOG.md` entry.
- **Gates:** conscience eval gate **122/0** (detection unaffected — `/interview` is skill-layer).
  `/tmp` scaffold verified: `/interview` + `/evidence` both land 0-placeholder, `boss map` lists both,
  `docs/evidence/` scaffolds. `/tmp` cleaned, registry pruned. **Not committed.**

**Voice-frame change — judgment regrade DONE (keyless, in-session).** The one-clause `/interview` pointer
added to the **caution** and **drift** frames changed their `composeContext` output, so `judgment/replay.js`
reported those transcripts STALE (17: 7 caution + 10 drift). Re-graded per the keyless discipline (NOT the
API-key license): two isolated reasoned sub-agents (one per moment) re-judged all 17 cases **blind** against
the new frames — given the bounded read + the new voice frame, not the human label — and every case
reproduced its human label (drift: 4 fire+named-gap / 5 on-aim-silent / 1 ambiguous→silent; caution: 3
fire+named-gap / 3 depth-silent / 1 ambiguous→fire, whose nudge reached for `/interview` organically —
confirming the pointer reads naturally). The change only adds a target to the *fire* branch; it moves no
fire-vs-silent boundary, so no regression was possible or found. Transcripts re-stamped with the new hashes
→ `replay.js`: **drift 10 + caution 7 GRADED, 0 STALE, 0 REGRESSION.** `capture` and `humane` hashes
unchanged. The IDEA-045 evidence line contributes to no hash (absent under empty `opts`, which is what
`voiceFrame()` hashes) — only these two deliberate pointer edits did.
