// BOSS conscience voice — every word the conscience says, in one place (v0.132.0).
//
// Split out of `loop-runtime.js`, which had grown to 603 lines mixing three concerns:
// predicate evaluation, project-state I/O, and ~200 lines of authored prose in template
// literals. The prose is the one surface `voice-keeper` owns and the judgment evals
// voice-hash, and it was the hardest thing in the repo to find.
//
// THE RULE: this file contains voice and nothing else. No fs, no predicates, no state —
// it imports nothing, so it can never introduce a cycle and can be probed in isolation
// (`scripts/check-manifests.js` calls `signalAsContext` directly to prove every declared
// moment has a frame).
//
// WHY STILL JAVASCRIPT, not markdown beside each loop spec — the question the audit
// raised (REVIEW-2026-07-28 §D2). Recorded rather than silently decided, because it is a
// real trade and the answer could change:
//   · Moments are MANY-TO-ONE with loops (`coherence` is declared by both design loops),
//     so per-loop markdown would duplicate the frame or need a lookup layer anyway.
//   · A per-project `docs/moments/*.md` would add 11 files to every scaffolded repo at
//     exactly the moment the evidence says SUBTRACT, and would make founder-editable the
//     text the judgment evals hash — a founder tuning their conscience would silently
//     invalidate BOSS's own grading.
//   · The frames interpolate (`loop_id`, confidence, the MVP/V1 branch in `coherence`),
//     so they are functions, not documents.
// What the audit actually wanted — one file that is only voice, findable by a
// voice-keeper — this delivers. Revisit if a founder ever needs to author a moment.

// Per-cohort framing directives (v0.20.0+). Added to additionalContext so the
// model composes the conscience voice appropriately for the founder's cohort.
// Personas in v0.19 surfaced that one-sized voice fails first-product and
// returning-founder differently — first-product needs teaching; returning-founder
// wants a harder question. The signal stays the same; the *voice* varies.
const COHORT_FRAMING = {
  'vibe-coder-newbie':
    'This founder is a vibe-coding newbie (no eng/startup background, ~6 months into AI tools, learns by doing). Avoid jargon. Show, don\'t lecture. Specifics over categories.',
  'eng-builder':
    'This founder is an experienced engineer turned first-time founder. Be terse and inspectable. They want transparency, not encouragement; respect their tooling fluency. The founder skills are new; the eng skills are not.',
  'non-tech-founder':
    'This founder has deep domain expertise but no coding background; AI is their bridge. Use plain language, not framework jargon. They respect mentor framing (they\'ve had real mentors); they have no patience for tech-bro phrasing.',
  'first-product':
    'This founder is an ABSOLUTE BEGINNER — first product ever; may not know what an MVP is. *Teach, don\'t grade.* Define terms inline. Invite, never assess. Their face when they read the nudge IS the design signal — if they\'d feel stupid, the nudge is wrong.',
  'vibe-virtuoso':
    'This founder ships a lot but doesn\'t sustain. Don\'t coach the discipline they\'ve already read books about and won\'t do. Ask SHARPER questions; lean into the architecture they respect (the override pattern, the structured signal). The voice they hear most is praise — give them friction instead.',
  'indie-hacker':
    'This founder is in the right-sized / calm-company lineage (Walling/Fried/Jarvis). Anti-VC by choice. Plain Fitzpatrick-style language lands; framework jargon does not. Use understatement; "this is fine" is high praise.',
  'returning-founder':
    'This founder has shipped before. *Skip the 101.* Ask the HARDER cohort-aware version: "is your conviction here at the level it needs to be for 12 months" not "what does this prove." Respect experience; don\'t teach the obvious.',
  'domain-expert':
    'This founder has 10+ years in a high-stakes domain (medical/legal/financial). Real stakes; real regulatory context. Caveat appropriately. Ask about who specifically could be harmed; lean into the humane lens. Avoid generic startup advice that won\'t fit the domain.',
};

// Compose `additionalContext` for hosts that consume the flat field. For one
// signal, a single nudge; for multiple, a brief enumeration. Voice stays with
// the model — this hands signal + ask + cohort frame, not canned voice.
export function composeContext(signals, opts = {}) {
  if (!signals.length) return null;
  const cohort = opts.cohort || null;
  const cohortLine = cohort && COHORT_FRAMING[cohort]
    ? `\n\nCohort framing — ${cohort}: ${COHORT_FRAMING[cohort]}`
    : '';
  // Continuity (IDEA-022 Track 4): when a venture brain exists, hand the model its
  // standing read so the nudge is voiced WITH what the conscience already understands
  // — the "how did it know that" specificity that earns trust. Added only when a brain
  // is present, so output is byte-identical when there's none.
  const brainLine = opts.brain
    ? `\n\nContinuity — your standing read on this venture (the conscience's own POV over time, from .boss/brain/). Voice the nudge *with* this: make it specific to what you already understand instead of generic, and ground it in the read. Don't read it back as fact or restate it — let it sharpen the one line you say. If it conflicts with what you see now, trust what you see (the founder can correct the brain):\n${opts.brain}`
    : '';
  // Learning (IDEA-022 — the relationship half): what you said recently and what the
  // founder DID with it. Use it to adjust: if you've raised this before and they moved
  // past it with a good reason, say it lighter or drop it; if a past nudge landed, you can
  // build on it. Don't nag a point they've already answered.
  const relationshipLine = opts.relationship
    ? `\n\nWhat happened last time (from the relationship log — what you said and what they did): use this to *calibrate*, not repeat. If you've already raised this and they moved past it for a stated reason, don't say it again the same way (lighten it, or stay silent). If a past nudge landed, you can build on it rather than restart:\n${opts.relationship}`
    : '';
  // Evidence (IDEA-045 — the conscience gets eyes on the ledger it's been asking
  // for). Counts by grade + the most recent one-liner, projected from docs/evidence/.
  // The calibration rule is asymmetric ON PURPOSE: real commitment-grade evidence
  // should make the conscience QUIETER (validation is happening), while all-stated-
  // pain-and-no-commitment lets it get SPECIFIC ("three said it hurts, none paid —
  // what's the commitment test?"). Added only when evidence exists → byte-identical
  // when docs/evidence/ is empty/absent.
  const evidenceLine = opts.evidence
    ? `\n\nEvidence on record (projected from docs/evidence/ — the ledger you've been asking for): ${evidenceSummary(opts.evidence)}. Use it to calibrate, not to lecture: (a) if there's recent COMMITMENT-grade evidence (someone gave up time/money/a slot), the founder is validating — say LESS, or stay silent; validation earns quiet. (b) If it's all stated-pain with no commitments, you may get SPECIFIC instead of generic — name the gap ("N said it hurts, zero commitments — what would a commitment test look like?") rather than a vague "will anyone pay?". (c) Never read the ledger back as a scoreboard or a number to hit — it's a fact that sharpens one line, not a meter.`
    : '';
  if (signals.length === 1) {
    return signalAsContext(signals[0]) + cohortLine + brainLine + relationshipLine + evidenceLine;
  }
  const parts = signals.map((s, i) => `(${i + 1}) ${signalAsContext(s)}`);
  return `[BOSS conscience — ${signals.length} signals]\n` + parts.join('\n') + cohortLine + brainLine + relationshipLine + evidenceLine;
}

// One-line human summary of the evidence projection for the voicing frame.
// e.g. "3 signals — 2 stated-pain, 1 commitment; most recent: EVID-003 (commitment) …"
function evidenceSummary(e) {
  const c = e.counts || {};
  const parts = [];
  if (c['stated-pain']) parts.push(`${c['stated-pain']} stated-pain`);
  if (c['observed-behavior']) parts.push(`${c['observed-behavior']} observed-behavior`);
  if (c.commitment) parts.push(`${c.commitment} commitment`);
  const breakdown = parts.join(', ') || 'none graded';
  let out = `${e.total} signal${e.total === 1 ? '' : 's'} — ${breakdown}`;
  if (e.recent) {
    out += `; most recent: ${e.recent.id} (${e.recent.grade})`;
    if (e.recent.title) out += ` — ${e.recent.title.replace(/^EVID-\d+\s*[—-]\s*/, '')}`;
  }
  return out;
}

// The generic tail of the moment chain below. A moment with no authored frame falls
// through to it — which is silent, content-free, and exactly the failure REVIEW-2026-07-28
// §A3 caught (a loop can declare `drift_moment: X`, pass the gate, and inject this).
// The runtime KEEPS the fallback (a founder must never lose the conscience mid-session
// over an authoring mistake), but `scripts/check-manifests.js` probes this function for
// every declared moment and fails the release when one lands here. Exported for that probe.
export const GENERIC_FRAME_TAIL = 'signal warrants attention.';

export function signalAsContext(s) {
  const moment = s.moment || 'attention';
  const loopId = s.loop_id || 'loop';
  // Per-moment phrasing — gives the model a starting frame; it composes the voice.
  // Voice lineage (v0.20.0+): leaning Fitzpatrick (talk-to-someone, plain language)
  // consistently. Indie-hacker persona caught the prior Fitzpatrick/Maurya mix; this
  // chooses the cohort-portable version.
  if (moment === 'caution') {
    return `[BOSS conscience — ${loopId} stalled · ${s.confidence} confidence] The ${loopId} is open: ≥3 ideas/captures exist but no canvas names a real riskiest assumption yet. Before voicing, do the judgment the predicate can't (v0.33): silently read the active idea's capture log. If the captures are ONE idea getting sharper — each entry refining the same bet, narrowing the user, finding the real pain, or wrestling the same hard question — that's DEPTH, not avoidance, and convergence toward a canvas. Stay silent; firing here punishes exactly the thinking caution should encourage. Fire only if the captures are scattered or accumulating without converging on a bet: idea-hopping (each capture a different product), feature-piling (scope growing, no customer or risk named), or market/competitor-watching with no bet of their own forming — the capturing-lots / validating-nothing drift. If it does fit: name the *specific* pattern you read in one spare line (not a generic "you should validate"), ask *what they'd want to learn* before going further (or *who they'd ask first* — Fitzpatrick-style), point at \`/canvas\` (or \`/interview\` if they're ready to actually talk to that person — it preps a Mom-Test call and debriefs it into evidence), and hand the decision back. Say it at most once; if you've already raised it this session or the user is clearly mid-other-work, stay silent. It's a nudge, never a gate.`;
  }
  if (moment === 'restraint') {
    return `[BOSS conscience — ${loopId} premature · ${s.confidence} confidence] The founder is reaching for ${loopId} but an upstream artifact is missing. If it fits the moment, surface BOSS's restraint nudge in your own voice: name what's missing in one line, offer to back up, hand the decision back. Never block.`;
  }
  if (moment === 'cost') {
    return `[BOSS conscience — ${loopId} unbudgeted · ${s.confidence} confidence] The code calls an LLM but no AI cost budget has been declared (or the cost-logger isn't wired). If it fits the moment, surface BOSS's nudge in your own voice: name that the bill exists in one line (the cohort decides the framing — first-product wants a number, vibe-virtuoso wants the inspect affordance, domain-expert wants the privacy posture), point at \`/ai-cost\`, hand the decision back. Never block.`;
  }
  if (moment === 'failure-mode') {
    return `[BOSS conscience — ${loopId} undesigned · ${s.confidence} confidence] The code calls an LLM but no failure-states design exists (no \`docs/ai-failure-states.md\` or no fallback handlers wired). The five failure modes always exist (garbage / refusal / hallucination / timeout / cost-spike); they just aren't designed yet. If it fits the moment, surface BOSS's nudge in your own voice: name that the failures are unmet in one line (cohort decides framing — first-product wants patterns named, eng-builder wants the unhandled-path lint angle, domain-expert wants the human-in-the-loop framing for high-stakes domains), point at \`/ai-failure-states\`, hand the decision back. Never block.`;
  }
  if (moment === 'capture') {
    return `[BOSS conscience — ${loopId} extractable · ${s.confidence} confidence] PRINCIPLE #1's own moment: the founder has accumulated work (devlog ≥3 dated entries) and hasn't recorded an extraction decision yet. But ≥3 entries is only the gate — before voicing, do the judgment the predicate can't (v0.39): silently read the ~5 most recent devlog entries. Fire ONLY if there's a real extraction candidate in that work — a pattern built twice (a reusable practice → UP into BOSS's library), a fix or guard hand-applied in several places (hardening → DOWN into the app's core), or a manual ritual repeated enough to deserve a skill/loop. If the recent work is one-off (distinct features that don't repeat), deep focus on a single still-in-progress thing, or early throwaway spikes, then nothing has generalized yet — stay silent. Nudging \`/extract\` with nothing to extract earns a NOT-YET every time and trains the founder to tune the conscience out; that's the premature ceremony PRINCIPLE #2 warns against. If it DOES fit: name the *specific* repeated pattern you read in one spare line (not a generic "you should extract patterns"). Cohort decides framing — returning-founder wants the seasoned "what did you do twice?" prompt, first-product wants the gentler "here's what the pause is for," indie-hacker wants the calm-company frame. **Don't sound like a productivity-reward.** The principle is the discipline, not the dopamine. Point at \`/extract\`, hand the decision back. Say it at most once this session; never block.`;
  }
  if (moment === 'focus') {
    return `[BOSS conscience — ${loopId} piling up · ${s.confidence} confidence] The board shows ≥4 FEATs in Building and nothing Shipped: a pile started, nothing finished. But the count is only the gate — before voicing, do the judgment the predicate can't (IDEA-034): silently read the board (\`boss board\`, or the in-flight FEATs' status + \`building_since\`). Fire ONLY if this is real focus-drift — work scattered across many half-built FEATs, the oldest aging in build, each started then left for the next thing (the "stop starting, start finishing" smell). If it's honest parallel work — a few genuinely-concurrent tracks a small team is carrying, or things blocked-on-review rather than abandoned — stay silent; firing there punishes legitimate parallelism. If it DOES fit: name the *specific* pile in one spare line (which FEATs, how long the oldest has been open — not a generic "limit your WIP"), and ask which *one* they'd finish first — and for the *oldest* one still stuck in build (the board's aged-in-build flag), offer the honest circuit-breaker cut: **finish it this session, or \`/sunset\` it** (Shape Up's rule — a thing perpetually 70%-done is WIP, not a plan, and a flag left at 5% is the same trap; ending it honestly beats leaving it half-built forever). *Offer* \`/sunset\`, never push it — it's the honest alternative to another dead week, not a verdict. Cohort decides framing — returning-founder wants the blunt "five started, none shipped — which is real?"; first-product wants "finishing one beats starting three, here's why" taught plainly; indie-hacker wants the calm "small and done beats big and open." **Don't sound like a productivity scold.** Point at finishing one (\`/close\` when it ships) or \`/revalidate\` for the stalest. Say it at most once this session; never block — it's a nudge, and shipping anything silences it.`;
  }
  if (moment === 'cost-stale') {
    return `[BOSS conscience — ${loopId} unread · ${s.confidence} confidence] The founder declared an AI cost budget (\`docs/ai-cost-budget.md\` exists) but hasn't recorded a cost review yet. Declaring is half the discipline; reading the ledger is the other half. If it fits the moment, surface BOSS's nudge in your own voice: name the unread-ledger gap in one line (cohort decides framing — indie-hacker wants the calm-company "%-of-revenue" frame, returning-founder wants unit-economics, eng-builder wants the inspectable numbers, domain-expert wants the privacy-first confirmation first). **Don't sound like a productivity-reward.** Point at \`/cost-review\`, hand the decision back. Never block.`;
  }
  if (moment === 'coherence') {
    // PRINCIPLE #3's moment — "nothing valuable gets locked into code," at the one place a
    // founder actually feels it. Serves BOTH design loops: `design-tokens-loop` (MVP — UI is
    // accumulating, no token system yet) and `design-drift-loop` (V1 — tokens exist but raw
    // hex is reappearing). Same tension, two stages, so the frame branches on which fired.
    const v1 = /design-drift/.test(loopId);
    const situation = v1
      ? 'Tokens exist (`docs/design/DESIGN_TOKENS.md`) but raw hex codes are back in the source — the token system is no longer authoritative.'
      : 'UI is accumulating in the code (several files styling by hand) and no token system has been scaffolded yet.';
    const judgment = v1
      ? 'Then judge: is this the 47-blues pattern re-forming — near-duplicate values drifting from the tokens, new screens deriving their own palette — or is it a legitimate one-off (a brand illustration, a chart series, a third-party embed) that was never going to be a token? A handful of deliberate exceptions is not drift.'
      : 'Then judge: is a real interface actually forming — several screens or components, styles starting to repeat and diverge — or is this ONE component, a spike, or a `/prototype` the founder intends to throw away? Tokens for a throwaway sketch are exactly the premature ceremony PRINCIPLE #2 refuses, and scaffolding a design system around a prototype is worse than 47 blues.';
    const pointer = v1
      ? '`/design-review` (before the next component) or `/ux-check` (after) — and `/design-tokens-init` again if the token file itself has gone stale'
      : '`/design-tokens-init` — it scaffolds the minimal three-layer set, not a design system';
    return `[BOSS conscience — ${loopId} incoherent · ${s.confidence} confidence] The design-coherence moment (PRINCIPLE #3 — nothing valuable gets locked into code). ${situation} This is the most common AI-generated-UI failure mode: each new screen the model generates derives its own colors, spacing and components, so the styling grows linearly with screens and every value becomes a snowflake — the 47-blues problem. But the file count is only the gate — before voicing, do the judgment the predicate can't: silently read a couple of the matched files and the tokens file if there is one. Read only that, not the whole project. ${judgment} If it does NOT fit, stay silent — an early sketch earns quiet, and firing on a prototype trains the founder to tune the conscience out. If it DOES fit: name the *specific* thing you saw in one spare line — "three screens, three different greys" or "the tokens say one blue; \`Button\` and \`Card\` each hardcode a different one" — never a generic "you should use design tokens." The value is the concrete duplication you can point at. Then point at ${pointer}, and hand the decision back. Cohort decides framing — first-product wants "here's why this bites you at screen 10" taught plainly with the term defined, eng-builder wants the terse maintenance-cost read, vibe-virtuoso wants the architecture cut (the system is the artifact, not the screen), indie-hacker wants the calm "small and consistent beats big and bespoke," non-tech-founder wants "your app will start looking like it was made by five different people." **Don't sound like a design scold**, and never propose a rewrite — the fix is the next component, not the last ten. Say it at most once this session; never block — it's a nudge, and a token file the code actually uses silences it.`;
  }
  if (moment === 'drift') {
    return `[BOSS conscience — ${loopId} adrift · ${s.confidence} confidence] The founder named a riskiest assumption on the canvas but hasn't recorded a validation plan for it (no real "Experiment this week" line), and work has been accumulating (≥3 devlog entries). This is the moment to check the work *against the named bet* — the comparison predicates can't make and you can. If — and ONLY if — it fits this moment: silently read the riskiest-assumption line on the canvas (\`docs/ideas/*-canvas.md\`), then the most recent ~5 entries of \`docs/devlog.md\`, plus the open FEAT/spec if there is one. Read only that — not the whole project. Then judge: is that recent work actually *testing* the named risk, or building *around* it? If it has drifted, name the specific gap in one spare line — "you said X is the bet that could sink this; the last sessions built Y and Z; neither tests X" — and ask what the smallest experiment on the risk would be (point at \`/canvas\` to write it, \`/pretotype\` to run it, or \`/interview\` if the cheapest test is talking to the right person — it preps the Mom-Test call and debriefs it into graded evidence; if they want the full whole-project audit rather than this bounded read, \`/drift-deep\`). If the work IS engaging the risk, stay silent — silence is the correct output when they're on-aim. This is not a "you've been productive!" reward and not a generic "you should validate" line; the value is the specific stated-vs-actual comparison. Cohort decides framing — returning-founder wants the harder "is your conviction here where it needs to be for 12 months" cut, first-product wants "here's what 'test your riskiest bet' means" taught plainly, domain-expert wants the who-could-be-harmed lens on the named risk. Say it at most once this session; never block.`;
  }
  if (moment === 'margin-trap') {
    return `[BOSS conscience — ${loopId} open · ${s.confidence} confidence] A post-launch margin signal (JOB 4): there's a real per-call cost ledger (\`.boss/cost-log.jsonl\`) AND the founder is operating — at least one cost review with real spend on file — but no review has looked at the *margin* yet. The other cost moments watch spend against a budget; this one watches it against the *price*. The AI-specific trap (a16z/Tunguz): cost-per-user scales with *engagement*, so the heaviest users are the least profitable, and AI gross margins run 50–65% where SaaS runs 70–85% — a founder can be delighted by usage and quietly losing money on every power user (Copilot: $10 price / ~$20 cost). But the presence of a ledger is only the gate — before voicing, do the judgment the predicate can't: silently read the bounded slice — the most recent cost review, a tail of \`.boss/cost-log.jsonl\`, and wherever a price/ARPU actually lives (the canvas willingness-to-pay cell, a pricing \`DEC\`, or the per-user economics in \`docs/ai-cost-budget.md\`). Read only that, not the whole project. Then judge on TWO axes: (a) **margin** — is cost-per-active-user a dangerous fraction of the price (a rough ~10–15%-of-ARPU line), or clearly trending there, with the heaviest users driving it? (b) **humane (PRINCIPLE #6)** — is a big share of that cost *retries and regenerations*, i.e. the product working *less*? If so the business is being paid *more* when the user struggles — a model to design out, not a margin to optimize, and the sharper thing to name. Fire ONLY if one axis is real. If there's NO price on record yet (pre-revenue), or the margin is healthy and the cost isn't struggle-driven, **stay silent** — a healthy margin earns quiet, the same way a validated risk quiets \`drift\`; firing here would be the premature nag PRINCIPLE #2 warns against. If it DOES fit: name the *specific* number in one spare line — "~X¢ per active user against your $Y price is Z%, and it's your heaviest users driving it" (or the humane cut: "a big share of that spend is retries — you're being paid more when it works less") — not a generic "watch your margins." Point at \`/cost-review\` (the gross-margin band) and \`mentor-business\` (price/packaging); the honest fixes are usage-based pricing when cost tracks usage, a cheaper model on the hot path, or designing out the struggle — never a dark-pattern that monetizes the failure. Cohort decides framing — indie-hacker wants the calm cost-as-%-of-revenue / sustainable-margin frame, returning-founder wants the blunt "your best users are your least profitable — is the price wrong or the cost?", non-tech-founder wants plain "it costs you more every time someone uses it — is the price covering that?", domain-expert wants the per-outcome economics of a high-cost workflow. Say it at most once this session; never block — it's a nudge, and a review that examines the margin silences it.`;
  }
  if (moment === 'coordination') {
    return `[BOSS conscience — ${loopId} open · ${s.confidence} confidence] A founding-team seam signal (IDEA-037 slice 5b): this is a *team* (a cofounder is on the roster), real work has happened (devlog ≥3), and **not one decision has been recorded together** (\`docs/decisions/\` is empty). The evidence behind this is that AI erodes the human-to-human seam *invisibly* — a pair can feel productive while building in parallel, each in their own AI session, never deciding together. But ≥0 DECs is only the gate, and it's WEAK-transfer evidence — before voicing, do the judgment the predicate can't: silently read the bounded slice — \`docs/decisions/\` (empty), \`boss board\` (who's building what), \`boss team\` (who's on the venture). Fire ONLY if it reads like a real seam: work flowing through one founder's agent while the shared log sits untouched by the other, divergence with nothing decided jointly. If the deciding is plausibly happening *off-repo* (a distributed pair who talk on calls and just haven't written a \`DEC\`), **stay silent** — a quiet log is NOT proof of a problem, and firing there punishes a healthy team. If it DOES fit: name the *specific* structural observation in one spare line (building a while, nothing decided together — not a generic "communicate more"), and ask the *coordination* question — are you two actually deciding this jointly, or in parallel? Point at \`/decide\` (record one together) and \`mentor-cofounder\` (the deeper coaching). **Serve the partnership as the unit; NEVER take a side** — surface the seam, never say whose fault it is. Cohort decides framing — non-tech-founder wants plain "are you and your cofounder on the same page on the big calls?", eng-builder wants the terse structural read, returning-founder wants the blunt "you've shipped for weeks and not one joint decision — is one of you actually driving alone?". Say it at most once this session; never block — recording a single decision together silences it.`;
  }
  return `[BOSS conscience — ${loopId} (${moment}) · ${s.confidence} confidence] signal warrants attention.`;
}

// Moments whose voiced instruction induces a model BOUNDED READ in the live turn
// (judgment past the predicate gate) — drift (v0.31), caution (v0.33). The rest
// are predicate-only (they point at a skill; no induced read). Used by the
// frequency ledger (v0.34) to flag which fires carry induced-judgment overhead.
// Lives here because "does this frame ask the model to go read something?" is a
// property of the frame, not of the predicate machinery.
export const JUDGE_MOMENTS = new Set(['drift', 'caution', 'capture', 'focus', 'coordination', 'margin-trap', 'coherence']);
