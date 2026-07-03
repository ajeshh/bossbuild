// BOSS loop runtime (IDEA-008 promoted to FEAT in v0.18.0).
//
// Reads docs/loops/*.md from the project, parses their YAML frontmatter, and
// evaluates entry/exit predicates against the live project state. Returns a
// list of *signals* — one per loop whose state warrants attention (drifting,
// stalled, just-graduated, etc.). The conscience hook composes these signals
// into structured output for Claude.
//
// Predicate vocabulary (closed set; extend deliberately):
//   - exists: { path }                — a file/dir exists at the project-relative path
//   - count_at_least: { path_glob, pattern, min, exclude_files_matching?, not_path_glob? }
//                                     — N+ regex matches across globbed files
//   - any_file_matches: { path_glob, pattern, related_idea_not_matching? }
//                                     — at least one globbed file matches the regex;
//                                       optional related-idea filter for canvas → idea
//                                       cross-file checks
//
// Loop spec frontmatter:
//   id: <slug>
//   type: loop
//   stage: <L0-quickstart | L1-mvp | ...>
//   runner_type: hook | skill | manual | external
//   entry: [<predicate>, ...]
//   exit: [<predicate>, ...]
//   drift_moment: caution | done | capture | restraint | <other>
//   attributed_to: [<practitioner>, ...]
//
// Drift derivation (auto, no per-loop encoding needed):
//   - All entry predicates satisfied AND any exit predicate not satisfied
//     → loop is OPEN; emit a signal with the loop's drift_moment.
//   - All entry + exit predicates satisfied → loop is CLOSED (no signal —
//     unless the closure JUST happened; future work: session-state to detect
//     just-closed transitions and emit "done" signals).
//   - Entry predicates not satisfied → loop is UNOPENABLE; no signal.

import { readFileSync, writeFileSync, appendFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter } from './yaml.js';

// Moments whose voiced instruction induces a model BOUNDED READ in the live turn
// (judgment past the predicate gate) — drift (v0.31), caution (v0.33). The rest
// are predicate-only (they point at a skill; no induced read). Used by the
// frequency ledger (v0.34) to flag which fires carry induced-judgment overhead.
export const JUDGE_MOMENTS = new Set(['drift', 'caution', 'capture', 'focus', 'coordination']);

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Glob expansion (single-`*`, single-level — no `**`).
// Examples: `docs/ideas/IDEA-*.md`, `docs/loops/*.md`.
// ---------------------------------------------------------------------------

function expandGlob(pattern, projectDir) {
  const fullPattern = join(projectDir, pattern);
  const dir = dirname(fullPattern);
  const fileGlob = basename(fullPattern);
  if (!existsSync(dir)) return [];
  if (!fileGlob.includes('*')) {
    return existsSync(fullPattern) ? [fullPattern] : [];
  }
  const regex = new RegExp(`^${fileGlob.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`);
  return readdirSync(dir)
    .filter((name) => regex.test(name))
    .map((name) => join(dir, name));
}

function matchesGlob(filePath, pattern, projectDir) {
  return expandGlob(pattern, projectDir).includes(filePath);
}

// ---------------------------------------------------------------------------
// Predicate evaluators.
// ---------------------------------------------------------------------------

const PREDICATES = {
  exists({ path }, projectDir) {
    return existsSync(join(projectDir, path));
  },

  count_at_least({ path_glob, pattern, min, exclude_files_matching, not_path_glob }, projectDir) {
    let files = expandGlob(path_glob, projectDir);
    if (not_path_glob) {
      files = files.filter((f) => !matchesGlob(f, not_path_glob, projectDir));
    }
    if (exclude_files_matching) {
      const exclRe = new RegExp(exclude_files_matching, 'm');
      files = files.filter((f) => {
        try { return !exclRe.test(readFileSync(f, 'utf8')); } catch { return true; }
      });
    }
    const re = new RegExp(pattern, 'gm');
    let count = 0;
    for (const f of files) {
      try {
        const content = readFileSync(f, 'utf8');
        count += (content.match(re) || []).length;
      } catch { /* ignore unreadable */ }
    }
    return { ok: count >= min, evidence: { count, min, files: files.length } };
  },

  any_file_matches({ path_glob, pattern, related_idea_not_matching }, projectDir) {
    const files = expandGlob(path_glob, projectDir);
    const re = new RegExp(pattern, 'm');
    let matchedCount = 0;
    for (const f of files) {
      // Optional cross-file filter: a canvas's related idea (strip `-canvas.md`,
      // append `.md`) must NOT match a given pattern.
      if (related_idea_not_matching) {
        const idea = f.replace(/-canvas\.md$/, '.md');
        if (existsSync(idea)) {
          try {
            const idText = readFileSync(idea, 'utf8');
            if (new RegExp(related_idea_not_matching, 'm').test(idText)) continue;
          } catch { /* ignore */ }
        }
      }
      try {
        if (re.test(readFileSync(f, 'utf8'))) matchedCount++;
      } catch { /* ignore */ }
    }
    return { ok: matchedCount >= 1, evidence: { matched_files: matchedCount, total_files: files.length } };
  },
};

// Evaluate a single predicate. Always returns { ok, evidence }.
function evalPredicate(pred, projectDir) {
  const type = Object.keys(pred).find((k) => PREDICATES[k]);
  if (!type) return { ok: false, evidence: { error: `unknown predicate: ${JSON.stringify(pred)}` } };
  try {
    const res = PREDICATES[type](pred[type] || pred, projectDir);
    // exists returns a bare boolean; normalize to { ok, evidence }.
    if (typeof res === 'boolean') return { ok: res, evidence: { type, path: pred[type]?.path || pred.path } };
    return res;
  } catch (e) {
    return { ok: false, evidence: { error: e.message } };
  }
}

// Evaluate a list of predicates. Returns { all_ok, results }.
function evalList(preds, projectDir) {
  const results = (preds || []).map((p) => evalPredicate(p, projectDir));
  return { all_ok: results.every((r) => r.ok), results };
}

// ---------------------------------------------------------------------------
// Loop loading + state classification.
// ---------------------------------------------------------------------------

export function loadLoops(projectDir) {
  const loopsDir = join(projectDir, 'docs', 'loops');
  if (!existsSync(loopsDir)) return [];
  return readdirSync(loopsDir)
    .filter((n) => n.endsWith('.md'))
    .map((n) => {
      const path = join(loopsDir, n);
      try {
        const text = readFileSync(path, 'utf8');
        const fm = parseFrontmatter(text);
        if (!fm || fm.type !== 'loop') return null;
        return { ...fm, _file: path };
      } catch { return null; }
    })
    .filter(Boolean);
}

export function classifyLoop(loop, projectDir) {
  const entry = evalList(loop.entry, projectDir);
  const exit = evalList(loop.exit, projectDir);
  let state;
  if (!entry.all_ok) state = 'unopenable';
  else if (entry.all_ok && exit.all_ok) state = 'closed';
  else state = 'open';
  return { state, entry, exit };
}

// ---------------------------------------------------------------------------
// Signal composition.
// ---------------------------------------------------------------------------

export function detectSignals(projectDir) {
  const loops = loadLoops(projectDir);
  const signals = [];
  for (const loop of loops) {
    // Only `hook`-runner loops emit signals automatically; skill/manual/external
    // are tested by their own runners.
    if (loop.runner_type && loop.runner_type !== 'hook') continue;

    // Loops without a `drift_moment` are structural — they express dependencies
    // downstream loops check, but don't themselves emit signals when open. (E.g.
    // capture-loop: its job is to be the upstream of canvas-loop; it doesn't
    // drift just because a fresh project has no captures yet — that's the
    // over-fires-on-fresh-project failure mode the moment-1 evals catch.)
    if (!loop.drift_moment) continue;

    const { state, entry, exit } = classifyLoop(loop, projectDir);
    if (state !== 'open') continue;

    const confidence = computeConfidence(loop, entry, exit);
    signals.push({
      loop_id: loop.id,
      type: 'stalled',
      moment: loop.drift_moment || 'caution',
      confidence,
      evidence: {
        entry: entry.results.map((r) => r.evidence),
        exit: exit.results.map((r) => r.evidence),
      },
      suppress_if: [],
    });
  }
  return signals;
}

// Confidence: scales with how much "drift overshoot" exists past the entry
// threshold. Captured here as a heuristic — refines via eval feedback.
function computeConfidence(loop, entry) {
  // Find a count-style entry predicate and read its count vs min.
  for (const r of entry.results || []) {
    if (r.evidence && typeof r.evidence.count === 'number' && typeof r.evidence.min === 'number') {
      const ratio = r.evidence.count / r.evidence.min;
      if (ratio >= 2) return 'high';
      if (ratio >= 1.33) return 'medium';
      return 'low';
    }
  }
  return 'medium';
}

// Read the optional founder-cohort declaration from .boss/config.json (v0.20.0+).
// Returns null if no config or no cohort field — Claude composes the voice
// generically when cohort is null.
export function readCohort(projectDir) {
  const f = join(projectDir, '.boss', 'config.json');
  if (!existsSync(f)) return null;
  try {
    return JSON.parse(readFileSync(f, 'utf8')).cohort || null;
  } catch { return null; }
}

// Read a BOUNDED slice of the venture brain (.boss/brain/read.md) so the
// conscience can voice WITH continuity (IDEA-022 Track 4): the standing summary
// (preamble) + the single most recent dated read. Bounded on purpose — continuity,
// not the whole history (structured-output discipline on the input side, same as
// drift-loop's bounded read). Returns null when there's no brain yet, so the
// conscience speaks generically and the output is byte-identical to before.
export function readBrainContext(projectDir) {
  try {
    const f = join(projectDir, '.boss', 'brain', 'read.md');
    if (!existsSync(f)) return null;
    const text = readFileSync(f, 'utf8');
    if (!text.trim()) return null;
    // Line-based split (robust): preamble = everything before the first dated
    // `## YYYY-MM-DD` header; keep only the LAST dated block.
    const dateRe = /^##\s+\d{4}-\d{2}-\d{2}\b/;
    const preambleLines = [];
    const blocks = [];
    let cur = null;
    for (const l of text.split('\n')) {
      if (dateRe.test(l)) { if (cur) blocks.push(cur); cur = [l]; }
      else if (cur) cur.push(l);
      else preambleLines.push(l);
    }
    if (cur) blocks.push(cur);
    const preamble = preambleLines.join('\n').trim();
    const lastBlock = blocks.length ? blocks[blocks.length - 1].join('\n').trim() : '';
    let out = [preamble, lastBlock].filter(Boolean).join('\n\n');
    const CAP = 1400; // bounded; the brain is continuity, not the whole file
    if (out.length > CAP) out = out.slice(0, CAP).trimEnd() + ' …';
    return out || null;
  } catch {
    return null;
  }
}

// Read a BOUNDED slice of the relationship log (.boss/brain/relationship.md) — the
// most recent session of what the conscience SAID and what the founder DID with it.
// This is what lets the conscience LEARN: "I've raised this before and you moved
// past it" / "last time I nudged drift you ran a test — good." Returns null when
// there's no log yet (byte-identical output, evals unaffected).
export function readRelationshipContext(projectDir) {
  try {
    const f = join(projectDir, '.boss', 'brain', 'relationship.md');
    if (!existsSync(f)) return null;
    const text = readFileSync(f, 'utf8');
    if (!text.trim()) return null;
    const dateRe = /^##\s+\d{4}-\d{2}-\d{2}\b/;
    const blocks = [];
    let cur = null;
    let preamble = [];
    for (const l of text.split('\n')) {
      if (dateRe.test(l)) { if (cur) blocks.push(cur); cur = [l]; }
      else if (cur) cur.push(l);
      else preamble.push(l);
    }
    if (cur) blocks.push(cur);
    // The most recent 1-2 logged sessions — recent outcomes, not the whole history.
    const recent = blocks.slice(-2).map((b) => b.join('\n').trim()).join('\n\n');
    let out = recent || preamble.join('\n').trim();
    const CAP = 900;
    if (out.length > CAP) out = out.slice(0, CAP).trimEnd() + ' …';
    return out || null;
  } catch {
    return null;
  }
}

// Read a cheap frontmatter PROJECTION of docs/evidence/ (IDEA-045, EVID) — the
// conscience finally gets eyes on the thing the whole thesis centers on. Same
// pattern as `boss board`: never a second source of truth, just a projection of
// the EVID files' frontmatter. Returns { counts: {stated-pain, observed-behavior,
// commitment}, total, recent: {id, grade, title} } or null when docs/evidence/ is
// absent/empty — so the conscience speaks generically and output is byte-identical
// to before (the relationship.md precedent). Bounded: counts + ONE most-recent
// one-liner, never the whole ledger.
export function readEvidenceContext(projectDir) {
  try {
    const dir = join(projectDir, 'docs', 'evidence');
    if (!existsSync(dir)) return null;
    const files = readdirSync(dir).filter((n) => /^EVID-\d+.*\.md$/.test(n));
    if (files.length === 0) return null;
    const GRADES = ['stated-pain', 'observed-behavior', 'commitment'];
    const counts = { 'stated-pain': 0, 'observed-behavior': 0, commitment: 0 };
    let recent = null; // { date, id, grade, title }
    for (const n of files) {
      let fm, text;
      try {
        text = readFileSync(join(dir, n), 'utf8');
        fm = parseFrontmatter(text);
      } catch { continue; }
      if (!fm || fm.type !== 'evidence') continue;
      if (fm.status === 'superseded') continue;
      const grade = GRADES.includes(fm.grade) ? fm.grade : null;
      if (grade) counts[grade] += 1;
      const date = typeof fm.date === 'string' ? fm.date : '';
      if (!recent || date > recent.date) {
        const titleLine = (text.split('\n').find((l) => /^#\s+EVID-/.test(l)) || '').replace(/^#\s+/, '').trim();
        recent = { date, id: fm.id || n.replace(/\.md$/, ''), grade: grade || 'ungraded', title: titleLine };
      }
    }
    const total = counts['stated-pain'] + counts['observed-behavior'] + counts.commitment;
    if (total === 0) return null;
    return { counts, total, recent };
  } catch {
    return null;
  }
}

// Read the conscience pause state from .boss/config.json (v0.23.0+, IDEA-011).
// Returns { mode, since, expires, reason } or null. Mode is 'paused' or 'active'
// (or null when never set). When paused, the hook exits silent if not expired.
export function readPauseState(projectDir) {
  const f = join(projectDir, '.boss', 'config.json');
  if (!existsSync(f)) return null;
  try {
    return JSON.parse(readFileSync(f, 'utf8')).conscience || null;
  } catch { return null; }
}

// Clear the conscience pause state (set mode: 'active'). Called by the hook when
// it detects an expired pause — the auto-resume IS the kindness. The founder
// learns the pause ended because the conscience starts speaking again on the
// next prompt; we don't emit a special "your pause expired" signal (that would
// be performative noise; IDEA-011 explicitly chose silent auto-resume).
export function clearPauseState(projectDir) {
  const f = join(projectDir, '.boss', 'config.json');
  if (!existsSync(f)) return;
  try {
    const cfg = JSON.parse(readFileSync(f, 'utf8'));
    cfg.conscience = { mode: 'active' };
    writeFileSync(f, JSON.stringify(cfg, null, 2) + '\n');
  } catch { /* fail silent — hook must never block */ }
}

// Per-moment mute (v0.72.0) — the surgical companion to pause. `pause` silences
// the WHOLE conscience for a bounded session; a mute silences ONE moment (drift,
// caution, capture, …) until it expires or is unmuted. This is the hook-enforced
// "don't voice it if I don't want it" — consent at the granularity of the moment,
// not all-or-nothing.
//
// Stored under its OWN top-level key (`conscienceMutes`), deliberately NOT inside
// `cfg.conscience`: pause/resume overwrite `cfg.conscience` wholesale, so nesting
// mutes there would let a `resume` silently wipe them. The two controls are
// orthogonal by construction. Shape:
//   cfg.conscienceMutes = { <moment>: { until: ISO|null, since: ISO, reason } }
export function readMuteState(projectDir) {
  const f = join(projectDir, '.boss', 'config.json');
  if (!existsSync(f)) return {};
  try {
    return JSON.parse(readFileSync(f, 'utf8')).conscienceMutes || {};
  } catch { return {}; }
}

// Is this moment muted right now (and not expired)? Pure read; expiry pruning is
// clearExpiredMutes's job. Used by the hook to filter signals and by the CLI to
// show only live mutes.
export function isMomentMuted(mutes, moment, now = new Date()) {
  const m = mutes[moment];
  if (!m) return false;
  if (m.until && new Date(m.until) <= now) return false; // expired → speaks again
  return true;
}

// Prune any mutes whose `until` has passed — the per-moment twin of pause's silent
// auto-resume. The founder learns a mute lapsed because the moment starts speaking
// again, not via a "your mute expired" announcement (that would be the performative
// noise IDEA-011 rejected). Returns true if it wrote. Swallows errors — like every
// hook-path write, it must never block the prompt.
export function clearExpiredMutes(projectDir) {
  const f = join(projectDir, '.boss', 'config.json');
  if (!existsSync(f)) return false;
  try {
    const cfg = JSON.parse(readFileSync(f, 'utf8'));
    const mutes = cfg.conscienceMutes || {};
    const now = new Date();
    let changed = false;
    for (const [moment, m] of Object.entries(mutes)) {
      if (m && m.until && new Date(m.until) <= now) { delete mutes[moment]; changed = true; }
    }
    if (changed) {
      if (Object.keys(mutes).length === 0) delete cfg.conscienceMutes;
      else cfg.conscienceMutes = mutes;
      writeFileSync(f, JSON.stringify(cfg, null, 2) + '\n');
    }
    return changed;
  } catch { return false; }
}

// Append one line to .boss/conscience-log.jsonl — a FREQUENCY ledger (v0.34.0).
//
// BOSS eating its own /ai-cost dogfood — HONESTLY. The hook never calls a model,
// so a token/dollar estimate would be lying with numbers: the dominant cost
// (the induced bounded reads judge-moments trigger in the main turn) is
// invisible here. So we log FACTS, not estimates — which moments fired, whether
// any induces a model read (judge-moment), and the injected-context CHAR count.
// The real way a conscience becomes costly/annoying is OVER-FIRING; that's what
// this measures. Measure-only — it never throttles (a throttle would gag the
// conscience exactly when a drifting founder needs it most: humane before viable).
//
// CORRECTNESS-INVISIBLE — the hook's first fire-path side effect. Runs only when
// something fired (after the silent early-exit), append-only, single write, in
// its own swallowing try/catch. Delete it entirely and the conscience behaves
// identically. Telemetry must never affect the conscience.
export function logActivity(projectDir, signals, additionalContext, cohort) {
  try {
    if (!signals || signals.length === 0) return;
    const entry = {
      ts: new Date().toISOString(),
      moments: signals.map((s) => ({ moment: s.moment, confidence: s.confidence })),
      judge: signals.some((s) => JUDGE_MOMENTS.has(s.moment)),
      injected_chars: (additionalContext || '').length,
      cohort: cohort || null,
    };
    appendFileSync(join(projectDir, '.boss', 'conscience-log.jsonl'), JSON.stringify(entry) + '\n');
  } catch { /* fail silent — the ledger is overhead, never a gate */ }
}

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

function signalAsContext(s) {
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
    return `[BOSS conscience — ${loopId} piling up · ${s.confidence} confidence] The board shows ≥4 FEATs in Building and nothing Shipped: a pile started, nothing finished. But the count is only the gate — before voicing, do the judgment the predicate can't (IDEA-034): silently read the board (\`boss board\`, or the in-flight FEATs' status + \`building_since\`). Fire ONLY if this is real focus-drift — work scattered across many half-built FEATs, the oldest aging in build, each started then left for the next thing (the "stop starting, start finishing" smell). If it's honest parallel work — a few genuinely-concurrent tracks a small team is carrying, or things blocked-on-review rather than abandoned — stay silent; firing there punishes legitimate parallelism. If it DOES fit: name the *specific* pile in one spare line (which FEATs, how long the oldest has been open — not a generic "limit your WIP"), and ask which *one* they'd finish first. Cohort decides framing — returning-founder wants the blunt "five started, none shipped — which is real?"; first-product wants "finishing one beats starting three, here's why" taught plainly; indie-hacker wants the calm "small and done beats big and open." **Don't sound like a productivity scold.** Point at finishing one (\`/close\` when it ships) or \`/revalidate\` for the stalest. Say it at most once this session; never block — it's a nudge, and shipping anything silences it.`;
  }
  if (moment === 'cost-stale') {
    return `[BOSS conscience — ${loopId} unread · ${s.confidence} confidence] The founder declared an AI cost budget (\`docs/ai-cost-budget.md\` exists) but hasn't recorded a cost review yet. Declaring is half the discipline; reading the ledger is the other half. If it fits the moment, surface BOSS's nudge in your own voice: name the unread-ledger gap in one line (cohort decides framing — indie-hacker wants the calm-company "%-of-revenue" frame, returning-founder wants unit-economics, eng-builder wants the inspectable numbers, domain-expert wants the privacy-first confirmation first). **Don't sound like a productivity-reward.** Point at \`/cost-review\`, hand the decision back. Never block.`;
  }
  if (moment === 'drift') {
    return `[BOSS conscience — ${loopId} adrift · ${s.confidence} confidence] The founder named a riskiest assumption on the canvas but hasn't recorded a validation plan for it (no real "Experiment this week" line), and work has been accumulating (≥3 devlog entries). This is the moment to check the work *against the named bet* — the comparison predicates can't make and you can. If — and ONLY if — it fits this moment: silently read the riskiest-assumption line on the canvas (\`docs/ideas/*-canvas.md\`), then the most recent ~5 entries of \`docs/devlog.md\`, plus the open FEAT/spec if there is one. Read only that — not the whole project. Then judge: is that recent work actually *testing* the named risk, or building *around* it? If it has drifted, name the specific gap in one spare line — "you said X is the bet that could sink this; the last sessions built Y and Z; neither tests X" — and ask what the smallest experiment on the risk would be (point at \`/canvas\` to write it, \`/pretotype\` to run it, or \`/interview\` if the cheapest test is talking to the right person — it preps the Mom-Test call and debriefs it into graded evidence; if they want the full whole-project audit rather than this bounded read, \`/drift-deep\`). If the work IS engaging the risk, stay silent — silence is the correct output when they're on-aim. This is not a "you've been productive!" reward and not a generic "you should validate" line; the value is the specific stated-vs-actual comparison. Cohort decides framing — returning-founder wants the harder "is your conviction here where it needs to be for 12 months" cut, first-product wants "here's what 'test your riskiest bet' means" taught plainly, domain-expert wants the who-could-be-harmed lens on the named risk. Say it at most once this session; never block.`;
  }
  if (moment === 'coordination') {
    return `[BOSS conscience — ${loopId} open · ${s.confidence} confidence] A founding-team seam signal (IDEA-037 slice 5b): this is a *team* (a cofounder is on the roster), real work has happened (devlog ≥3), and **not one decision has been recorded together** (\`docs/decisions/\` is empty). The evidence behind this is that AI erodes the human-to-human seam *invisibly* — a pair can feel productive while building in parallel, each in their own AI session, never deciding together. But ≥0 DECs is only the gate, and it's WEAK-transfer evidence — before voicing, do the judgment the predicate can't: silently read the bounded slice — \`docs/decisions/\` (empty), \`boss board\` (who's building what), \`boss team\` (who's on the venture). Fire ONLY if it reads like a real seam: work flowing through one founder's agent while the shared log sits untouched by the other, divergence with nothing decided jointly. If the deciding is plausibly happening *off-repo* (a distributed pair who talk on calls and just haven't written a \`DEC\`), **stay silent** — a quiet log is NOT proof of a problem, and firing there punishes a healthy team. If it DOES fit: name the *specific* structural observation in one spare line (building a while, nothing decided together — not a generic "communicate more"), and ask the *coordination* question — are you two actually deciding this jointly, or in parallel? Point at \`/decide\` (record one together) and \`mentor-cofounder\` (the deeper coaching). **Serve the partnership as the unit; NEVER take a side** — surface the seam, never say whose fault it is. Cohort decides framing — non-tech-founder wants plain "are you and your cofounder on the same page on the big calls?", eng-builder wants the terse structural read, returning-founder wants the blunt "you've shipped for weeks and not one joint decision — is one of you actually driving alone?". Say it at most once this session; never block — recording a single decision together silences it.`;
  }
  return `[BOSS conscience — ${loopId} (${moment}) · ${s.confidence} confidence] signal warrants attention.`;
}
