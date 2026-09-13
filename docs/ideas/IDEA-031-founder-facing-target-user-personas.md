---
id: IDEA-031
type: idea
owner: product-lead
status: shipped (v0.55.0 — /persona derive · enrich · consult, at L0)
proof: stages/L0-quickstart/template/.claude/skills/persona/SKILL.md
created: 2026-06-20
---

# IDEA-031 — Founder-facing target-user personas (the user's voice, as a consultable agent)

> Seed: Ajesh, 2026-06-20 — *"if I say I wanna build an app for moms to track the household's chores,
> then we should see that the first persona is moms. As the builder shares more info we can passively
> collect. If they want to share more or research, we use that to continue to model it. We can do a Q&A
> with the builder to see what they know, and/or online research to build the persona, and/or a UX
> researcher could drop all their research in. The app uses it as a way to get internal feedback using
> the 'persona' as an agent voice to help guide product decisions."*

## The reframe (this is NOT [[IDEA-009]])

[[IDEA-009]] is BOSS's **internal** instrument: 8 *founder-cohort* personas BOSS uses to design *BOSS
itself*. This is the inverse and the bigger product idea: **the founder's own *target-user* persona**,
about *their* app's users (the moms), generated from their idea and grown from evidence, consulted as
an agent voice to guide *their* product decisions. Same evolving-instrument *methodology* (versioned,
evidence-grown, synthetic-shrinks-as-real-grows, cheerleading-bias-aware); different *subject* and
different *owner*. IDEA-009 = BOSS's users; IDEA-031 = the founder's users.

## The arc the founder lives

1. **Derive** — the moment the idea exists ("chore tracker for moms"), the *first persona is the
   user*: "moms managing a household." BOSS proposes it from the idea, no ceremony.
2. **Grow it from whatever evidence exists, JIT** — the persona starts ~100% synthetic and earns
   reality from any of:
   - **Passive signal** — read the idea doc / canvas / build for who-the-user-is clues (no new
     instrumentation; the work already names them — same honest-trace ethic as [[IDEA-021]]).
   - **Builder Q&A** — ask the founder what they actually know about their users (often a lot — they
     chose this problem for a reason). Their knowledge is *real* evidence (n≥1: them).
   - **Online research** — ground the archetype in real-world data about that group (reuse the
     deep-research harness) — still synthetic-ish (averaged), but better than a guess.
   - **Drop-in research** — a UX researcher (or the founder) points at real interviews / surveys /
     notes → fold them in (reuse `/import`'s ingest). This is the *strongest* evidence and shrinks the
     synthetic share fastest.
3. **Consult** — the founder asks *"would a mom want X? how would she react to Y?"* and the persona
   answers **in voice**, as a product-decision aid (the mentor-agent pattern, pointed at the user).
4. **Evolve** — versioned in git; synthetic shrinks as real grows; the persona is the same artifact
   across its life (the [[IDEA-009]] continuity discipline, reused wholesale).

## It's both — guidance AND QA (one instrument, two directions)

(Ajesh: *"its also the QA, its both right?"* — yes.) The same persona-agent runs in two directions,
and that's the point:
- **Guidance (before/during build):** *"would a mom want X? how would she react to this flow?"* — the
  user's voice steering product decisions while there's still time to change them cheaply (this is the
  upstream leverage — [[IDEA-026]]).
- **QA / evaluation (after build):** the persona reacts to what got built — the **Husain eval
  discipline** applied to qualitative reactions (structured 5-field reactions, failure modes named,
  *regression across versions* — re-react the same persona to v1 vs v2 and the diff is the
  measurement). This is exactly the [[IDEA-009]] build-integrated-eval-channel pattern, now in the
  founder's hands for *their* app.

Same evolving artifact; the founder points it forward (guide) or back (QA). Neither replaces real
users — both sharpen the questions you take to them.

## The load-bearing principle (why this is BOSS and not syntheticusers.com)

A synthetic user that **masquerades as validation is the pseudo-app trap wearing a friendly face**
(PRINCIPLES; Indi Young's "meaning" critique; the cheerleading-bias failure mode). So the persona is
**always framed as a pre-filter, never a verdict**, and the conscience uses it to push *toward* real
contact, not away from it:

- Every consult carries the caveat in BOSS's voice: *"this is a sharpening tool, not a real mom — use
  it to write better questions, then go ask three real ones"* (Fitzpatrick / Mom Test; ties to
  `/canvas` "who's served" + `/pretotype` demand test).
- The persona is **instructed to balance interest with concerns** and to **name what it can't know**
  (mitigates cheerleading bias; honors the meaning critique).
- The ledger makes the synthetic/real split **visible** — a founder always sees how much of "their
  user" is real evidence vs. BOSS's averaged guess.

## Smallest shippable slice (build now)

A **`/persona`** skill (L0 — the user appears at idea time):
- `/persona` (derive) → propose the target-user persona(s) from the idea → `docs/personas/<slug>.md`
  (structured: who · context · jobs-to-be-done · pains · what they value · **what we don't know yet** ·
  evidence ledger starting ~100% synthetic).
- `/persona enrich <slug>` → offer the four evidence paths (Q&A · online research · drop-in · passive);
  fold the result in; update the ledger (real grows, synthetic shrinks).
- `/persona consult <slug> "<question>"` → the persona answers in voice, balanced (interest + concerns),
  names its blind spots, and closes with the go-talk-to-a-real-one caveat.
- Cohort-aware framing; conscience caveat non-negotiable.

## Deferred (capture, don't build)
- **Persona as a standing agent** (`.claude/agents/persona-<user>.md` the founder consults like a
  mentor) — build once the doc-based consult proves it earns the upgrade.
- **Passive auto-derivation** (persona proposed automatically at `/boss` spin-up) — build after the
  explicit `/persona` proves the derivation is good.
- **Multiple personas + segments** (the secondary users) — start with the one primary user.
- **Promote UP** a founder's reusable persona patterns to `library/personas/` ([[IDEA-009]] claim #5).

## Links
[[IDEA-009]] (the evolving-instrument methodology this reuses) · `/canvas` (who's served — the persona
deepens it) · `/import` (drop-in ingest) · `deep-research` (online research) · `/pretotype` +
Fitzpatrick/Mom Test (the real-contact the persona points at, never replaces) · PRINCIPLES (pseudo-app
vs real-value — the persona must serve real validation, not simulate it).

## Re-grade 2026-09-09 — `building` was not true, and the proof pointer never existed

**Shipped, and it has been for a long time.** `/persona` ships at Quickstart with all three verbs
this record specifies — `derive`, `enrich <slug>`, `consult <slug> "<question>"` — plus the
synthetic/real evidence ledger, the cohort framing and the non-negotiable go-talk-to-a-real-one
caveat. Everything still unbuilt is in this record's own **"Deferred (capture, don't build)"**
section, which is a decision, not a backlog: the standing agent, passive auto-derivation, multiple
segments, and the promote-UP to `library/personas/`.

🔴 **`proof:` pointed at `.../skills/persona/target-users.md`, which does not exist and never did.**
The skill shipped as a single `SKILL.md`; the separate target-users file was a shape the build
didn't take. Corrected to the file that actually carries the claim. **Nothing reported this** —
`recordDrift`'s proof check only fires the missing-file direction when a record says `shipped`
(`src/records.js`), which is right for tripwire proofs laid in advance, and is exactly why a stale
pointer can sit under `building` indefinitely. Moving this record to `shipped` is also what puts its
proof under the check for the first time.
