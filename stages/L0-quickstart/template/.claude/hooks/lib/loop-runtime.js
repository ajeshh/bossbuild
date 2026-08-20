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
// Any predicate may also carry a sibling `when: [<predicate>, ...]` guard. The
// predicate applies only if every guard predicate holds; otherwise it is treated as
// satisfied. Use it for a bar that should only exist for projects that earned it —
// see `evalPredicate` below, and verification-loop's rung-4 exit for the live example.
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
import { JUDGE_MOMENTS } from './moment-frames.js';

// Everything the conscience SAYS now lives in `moment-frames.js` — this file is
// predicates + project-state I/O only (v0.132.0; it was 603 lines mixing all three).
// Re-exported here so every existing import site keeps working unchanged: the hook, the
// CLI's conscience surface, the eval runner, and `scripts/check-manifests.js`.
export { signalAsContext, composeContext, GENERIC_FRAME_TAIL, JUDGE_MOMENTS } from './moment-frames.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Glob expansion (single-`*`, single-level — no `**`).
// Examples: `docs/ideas/IDEA-*.md`, `docs/loops/*.md`.
// ---------------------------------------------------------------------------

// A `path_glob` may name MORE THAN ONE shape, comma-separated. This exists because of a real
// permanent false positive: `canvas-loop` globbed only `docs/ideas/*-canvas.md`, while `/canvas`
// itself tells the founder to keep a venture-level `docs/ideas/CANVAS.md` and `boss board` reads
// one. So a founder who followed the skill's own instruction had the canvas-loop reporting
// "stalled" forever — and a conscience that is permanently wrong about you is one you mute, which
// is the worst outcome this system has. Exits are AND-ed, so a second predicate could not express
// "either of these"; the glob had to.
function expandGlob(pattern, projectDir) {
  if (typeof pattern === 'string' && pattern.includes(',')) {
    const seen = new Set();
    return pattern.split(',').flatMap((p) => expandGlob(p.trim(), projectDir))
      .filter((f) => (seen.has(f) ? false : seen.add(f)));
  }
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
    return { ok: matchedCount >= 1, evidence: { path_glob, matched_files: matchedCount, total_files: files.length } };
  },
};

// Evaluate a single predicate. Always returns { ok, evidence }.
//
// A predicate may carry a `when:` guard — a list of predicates that must ALL hold
// for this one to apply at all. If the guard is unmet the predicate is **vacuously
// satisfied**. That is how a loop expresses a bar which only turns on once the
// project has earned it (PRINCIPLE #2 in the *exit* list rather than the entry one),
// and the two are genuinely different questions: an entry predicate asks *has this
// loop opened?*, a guard asks *does this rung apply to this project at all?* Encoding
// the second as an entry predicate would close the loop for everyone it doesn't apply
// to, which is the opposite of the intent.
//
// Every mechanism BOSS owned for calibrating ceremony was subtractive; this is the
// additive one — a bar that arrives when earned instead of one that never arrives.
// Guards are cheap and quiet on purpose: no existing loop uses `when`, so every loop
// shipped before it evaluates byte-identically.
function evalPredicate(pred, projectDir) {
  const type = Object.keys(pred).find((k) => PREDICATES[k]);
  if (!type) return { ok: false, evidence: { error: `unknown predicate: ${JSON.stringify(pred)}` } };
  if (Array.isArray(pred.when)) {
    const guard = evalList(pred.when, projectDir);
    if (!guard.all_ok) {
      return {
        ok: true,
        evidence: { type, guard: 'unmet', guard_results: guard.results.map((r) => r.evidence) },
      };
    }
  }
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

    const confidence = computeConfidence(loop, entry);
    signals.push({
      loop_id: loop.id,
      type: 'stalled',
      moment: loop.drift_moment || 'caution',
      confidence,
      evidence: {
        entry: entry.results.map((r) => r.evidence),
        // Exit evidence carries `ok` (entry does not) because a loop with more than one
        // exit artifact needs the FRAME to know WHICH one is missing — a conscience that
        // says "no smoke command recorded" to a founder who recorded one months ago is
        // the overclaim that gets it muted. Entry stays untouched: `computeConfidence`
        // reads it, and so do the eval assertions.
        exit: exit.results.map((r) => ({ ok: r.ok, ...r.evidence })),
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
// THE FLOOR UNDER THE RITUAL. `read.md` is written by /close, and people forget /close — so the
// conscience's memory was one skipped ritual away from nothing, forever. That is the same failure
// as `shipped_on:` dates nobody stamped and `proof:` fields nobody filled: **a rule that depends
// on someone remembering is not a mechanism.**
//
// So the repo speaks when the founder hasn't. These are FACTS, derived from files that already
// exist, and they are labelled as facts — the conscience must never be handed a machine-assembled
// summary while believing it is reading a considered POV. /close still writes the judgment; this
// is the floor it lands on, not a replacement for it. If /close never runs, the conscience still
// knows what you have been doing. If it does run, it gets both.
//
// Cheap by construction: it only runs once a moment is already firing (past the silent
// early-exit), reads at most a few small files, and no subprocess.
function deriveBrainFacts(projectDir) {
  const bits = [];
  try {
    const ideas = join(projectDir, 'docs', 'ideas');
    if (existsSync(ideas)) {
      const files = readdirSync(ideas).filter((f) => /^[A-Z]{3,4}-\d+.*\.md$/.test(f));
      const open = [];
      let shipped = 0;
      for (const f of files) {
        const m = readFileSync(join(ideas, f), 'utf8').match(/^status:\s*(\S+)/m);
        const s = (m ? m[1] : '').toLowerCase();
        if (s.startsWith('shipped')) shipped++;
        else if (s.startsWith('building')) open.push(f.replace(/\.md$/, '').split('-').slice(0, 2).join('-'));
      }
      if (open.length) bits.push(`in flight: ${open.slice(0, 3).join(', ')}${open.length > 3 ? ` +${open.length - 3}` : ''}`);
      if (shipped) bits.push(`${shipped} record${shipped === 1 ? '' : 's'} shipped`);
    }
  } catch { /* facts are best-effort; never break the hook */ }
  try {
    // What the conscience has ALREADY been saying — the closest thing to memory it can derive.
    const log = join(projectDir, '.boss', 'conscience-log.jsonl');
    if (existsSync(log)) {
      const lines = readFileSync(log, 'utf8').trim().split('\n').filter(Boolean).slice(-25);
      const counts = {};
      for (const l of lines) {
        try {
          for (const m of (JSON.parse(l).moments || [])) counts[m.moment] = (counts[m.moment] || 0) + 1;
        } catch { /* a torn line is not a reason to go silent */ }
      }
      const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      if (top) bits.push(`you have raised "${top[0]}" ${top[1]}x recently — if it did not land, say it differently or not at all`);
    }
  } catch { /* ignore */ }
  if (!bits.length) return null;
  return `[derived from the repo — FACTS, not a considered read. No /close has been run, so the conscience has no POV on this venture yet.]\n${bits.map((b) => `- ${b}`).join('\n')}`;
}

export function readBrainContext(projectDir) {
  try {
    const f = join(projectDir, '.boss', 'brain', 'read.md');
    if (!existsSync(f)) return deriveBrainFacts(projectDir);
    const text = readFileSync(f, 'utf8');
    if (!text.trim()) return deriveBrainFacts(projectDir);
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

