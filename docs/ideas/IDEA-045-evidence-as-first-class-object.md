---
id: IDEA-045
type: idea
owner: product-lead
status: shipped
proof: stages/L0-quickstart/template/.claude/skills/evidence
created: 2026-07-02
source: fable-campaign step-back (Fable 5 deep read, 2026-07-02)
---

# IDEA-045 — `EVID-NNN`: evidence as a first-class object

## The gap

BOSS has an ID type for ideas (IDEA), features (FEAT), decisions (DEC), practices (PRAC), reviews (RVW) —
but **evidence, the thing the entire thesis centers on, has no object**. When a founder takes the
conscience's best advice ("a 15-minute call beats `/canvas`") and does the call, the result has nowhere to
live. It evaporates into memory, and three weeks later the canvas's riskiest assumption is still arguing
from vibes. The deepest irony in the current design: **the conscience asks for evidence it has no way to
see.**

## The shape

1. **`docs/evidence/EVID-NNN-<slug>.md`** — one signal per file. Frontmatter: `id`, `date`, `source`
   (who/where — a person, a session, a metric), `method` (interview / observation / pretotype / metric /
   commitment-test), **`grade`** — the load-bearing field, a fixed ladder:
   - `stated-pain` — someone *said* it hurts (weakest; Mom-Test warns it's nearly free)
   - `observed-behavior` — you *watched* them struggle / use / bounce
   - `commitment` — they gave up something real: time, money, reputation, a calendar slot
   plus `assumption` (which canvas assumption this bears on) and a body of ≤10 lines. The grade ladder is
   the same epistemology the canvas v0.3 already uses to grade its own founding-team lead ("stated pain
   from conversations, not observed behavior or commitment") — this just gives it an ID.
2. **`/evidence`** — a capture skill (L0; evidence-gathering starts before MVP): paste notes / describe
   what happened → BOSS drafts the EVID with an honest grade (and pushes back on grade inflation: "they
   said 'I'd totally use this' — that's stated-pain, not commitment").
3. **The conscience gets eyes.** The drift/caution moments' bounded read extends to a *count-by-grade* of
   `docs/evidence/` (cheap: frontmatter projection, exactly like `boss board`). The voicings sharpen from
   generic ("will anyone pay?") to specific ("three stated-pain signals, zero commitments — what would a
   commitment test look like?"). Silence rule: a founder with recent commitment-grade evidence should hear
   *less* conscience, not more — evidence is how the conscience earns quiet.
4. **`/canvas` cites receipts.** The riskiest-assumption cell links the EVIDs bearing on it; `boss board`
   can show an evidence count per bet.

## Why this is the keystone

It closes BOSS's epistemic loop: conscience asks → founder acts → **evidence lands somewhere the
conscience reads** → conscience calibrates. It's also the substrate [[IDEA-046]] (/interview) writes into,
[[IDEA-044]] (/sunset) reads at post-mortem, and [[IDEA-049]] (portfolio memory) aggregates. Build this
first among the four.

## Guardrails

- Never a score, never a dashboard-of-shame. Counts and grades are *facts shown once in context*, not a
  gamified meter (no "evidence level 3/10!").
- Grade definitions are fixed and few (3). Resist taxonomy growth — the ladder's power is its bluntness.
- The conscience reads evidence bounded (counts + most recent), never lectures from it turn after turn.

## OPUS HANDOFF PROMPT

```
You are implementing IDEA-045 (EVID — evidence as a first-class object) for BOSS.
Repo: ~/Projects/bossbuild. Read CLAUDE.md, docs/RESUME.md, docs/IDS.md, and
docs/ideas/IDEA-045-evidence-as-first-class-object.md first. Design is decided; do not
re-litigate. This is the keystone of a 4-idea validation-tooling cluster (044/045/046/049)
— build it standalone but leave the seams named.

CONSTRAINTS: src/ zero-dep; frontmatter-projection pattern (the board precedent — never a
second source of truth); small reversible commits; conscience-not-censor voice.

TASKS
1. New ID type: register EVID-NNN in docs/IDS.md following the existing convention.
   Directory: docs/evidence/ (scaffolded empty with a README stub in the L0 template).
   Frontmatter schema: id, date, source, method (interview|observation|pretotype|metric|
   commitment-test), grade (stated-pain|observed-behavior|commitment), assumption, plus a
   ≤10-line body. Document the 3-grade ladder in the README stub with one-line definitions.
2. New L0 skill stages/L0-quickstart/template/.claude/skills/evidence/SKILL.md — /evidence:
   founder pastes notes or describes what happened; the skill drafts docs/evidence/EVID-NNN
   with an HONEST grade, explicitly pushing back on grade inflation ("'I'd totally use
   this' = stated-pain, not commitment"). Next-number logic mirrors how /decide numbers
   DEC files. Links the relevant canvas assumption when one exists.
3. Conscience integration (CAREFUL — smallest change that works): where the drift/caution
   moments assemble their bounded read (src loop-runtime / composeContext — find it),
   add a cheap frontmatter projection of docs/evidence/: counts by grade + most recent
   EVID one-liner. Byte-identical behavior when docs/evidence/ is absent/empty (the
   relationship.md precedent). Update the voicing guidance so the moments can (a) name
   the evidence state specifically, (b) go QUIETER when recent commitment-grade evidence
   exists. NOTE: this touches conscience machinery — run the full eval gate
   (docs/architecture/conscience-evals/, expect current pass counts to hold) and add 2-3
   new gate cases: evidence-empty (unchanged behavior), stated-pain-only (sharpened
   voicing OK), commitment-present (quieter). If the voice frame changes materially,
   moments.js hash discipline applies — check whether HUMANE_FRAME/voice-hash needs a
   bump and note that a judgment regrade is then due.
4. /canvas touch-up: one line in the canvas skill telling it to cite EVID ids in the
   riskiest-assumption cell when they exist.
5. Wayfinding: boss map lists /evidence; one GUIDE.md paragraph ("where evidence lives").
6. Version: bump VERSION (minor) + registry/CHANGELOG.md: "EVID-NNN — evidence becomes a
   first-class object: /evidence capture with a 3-grade honesty ladder; the conscience
   reads the ledger (and goes quieter when commitments exist)."
7. TEST: /tmp scaffold; create 2 EVIDs by hand (one stated-pain, one commitment); verify
   the conscience read includes the projection and the eval gate passes; verify absent-
   directory behavior is byte-identical; clean /tmp + prune registry/projects.json.
Do not commit unless asked. Report file-by-file.
```

## Implementation notes (v0.98.0, 2026-07-02)

Shipped as the keystone, standalone (seams named for 046/044/049). File-by-file:
- **`docs/IDS.md`** — registered `EVID-NNN` (grade ladder in the row).
- **`stages/L0-quickstart/template/docs/evidence/README.md`** — new dir stub: the 3-grade ladder table
  + frontmatter schema + the "never a score / not a CRM" guardrails.
- **`stages/L0-quickstart/template/.claude/skills/evidence/SKILL.md`** — new L0 `/evidence` skill;
  paste notes → honest-graded `EVID-NNN`, pushes back on grade inflation; next-number logic mirrors
  `/decide`; links the canvas assumption.
- **`.../hooks/lib/loop-runtime.js`** — new `readEvidenceContext()` (frontmatter projection: counts by
  grade + most recent; skips `superseded`; null when absent/empty). New `evidenceSummary()` helper.
  `composeContext()` gains an `evidenceLine` with the **asymmetric calibration rule** (quieter on
  commitment, specific on stated-pain-only, never a scoreboard) — appended only when evidence exists.
- **`.../hooks/conscience.js`** — reads evidence once a moment is already firing (past the silent
  early-exit), passes it to `composeContext`. Byte-identical when `docs/evidence/` absent — verified.
- **`.../skills/canvas/SKILL.md`** — riskiest-assumption cell now cites bearing `EVID` ids.
- Wayfinding: L0 `manifest.json` (skills + summary), template `CLAUDE.md`, `docs/GUIDE.md`
  ("where evidence lives").
- **Eval gate:** `moment-drift.yml` + runner fixtures (`evid_stated_pain`, `evid_commitment`) — 2 new
  cases (m-drift-120/121) lock the invariant *evidence never changes the gate, only the voicing*
  (a commitment must not silently muzzle drift at the gate). **122/0** (was 120).
- **Verified:** `boss map` lists `/evidence`; skill lands 0 placeholders; projection reaches the
  composed context (counts + most-recent); byte-identical composeContext when the ledger is empty/absent.
  `/tmp` cleaned, registry pruned. **Not committed.**

**Voice-hash note:** the drift/caution *frame text* itself is unchanged; the evidence line is a new
*append* only present when a ledger exists. Existing judgment-eval voice hashes over the base frames are
untouched (no `HUMANE_FRAME` bump). A judgment regrade is **not** due from this change; the new voicing
guidance is additive and only active in the has-evidence state, which the current judgment set doesn't
cover — worth a small labeled add to `judgment/` next time that set is refreshed (noted, not blocking).
