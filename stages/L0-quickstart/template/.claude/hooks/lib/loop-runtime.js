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
//   - count_at_most:  { path_glob, pattern, max, exclude_files_matching?, not_path_glob? }
//                                     — NO MORE THAN N matches. The mirror, so a loop whose
//                                       healthy state is an ABSENCE ("no raw hex codes in the
//                                       code") can say so as a positive exit predicate instead
//                                       of a prose note claiming the runtime inverts. It does
//                                       not invert; design-drift-loop believed it did for 55
//                                       releases and fired backwards the whole time.
//   - any_file_matches: { path_glob, pattern, related_idea_not_matching? }
//                                     — at least one globbed file matches the regex;
//                                       optional related-idea filter for canvas → idea
//                                       cross-file checks
//   - outpaced_by: { path_glob, behind, min, pattern? }
//                                     — N+ files under `path_glob` are NEWER than the newest
//                                       file under `behind`. The first TEMPORAL predicate, and
//                                       the one that expresses "this stopped being true"
//                                       rather than "this was never made".
//   - quiet_for: { path_glob, days }   — NOTHING under `path_glob` has changed in `days`. The
//                                       first ABSOLUTE-time predicate; every other member of
//                                       this set is a relation between two files, and SILENCE
//                                       cannot be written as one. Added v0.206.0 for the
//                                       commons half of the canvas, which is falsified by
//                                       absence rather than by activity.
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
import { personStatePath, personStatePathForWrite } from './person-state.js';

// Everything the conscience SAYS now lives in `moment-frames.js` — this file is
// predicates + project-state I/O only (v0.132.0; it was 603 lines mixing all three).
// Re-exported here so every existing import site keeps working unchanged: the hook, the
// CLI's conscience surface, the eval runner, and `scripts/check-manifests.js`.
export { signalAsContext, composeContext, GENERIC_FRAME_TAIL, JUDGE_MOMENTS } from './moment-frames.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Glob expansion. `*` matches inside one path segment; `**` crosses segments.
//
// 🔴 `**` USED TO BE A LIE, and this header is where it was told. The expander was
// single-level by design and SAID SO here — while five shipped loop specs wrote `src/**`
// anyway, where it silently degraded to `src/*`. The damage was never mobile-only: ANY
// project that keeps code in subdirectories (every real one) had `design-tokens-loop`,
// `verification-loop`, `design-drift-loop`, `cost-budget-loop` and `ai-failure-state-loop`
// reading exactly the top level of `src/`, finding nothing, and classifying `unopenable`.
// Unopenable emits NO signal — so a conscience that could not see the code was
// indistinguishable from one with nothing to say. `deception-loop`'s hand-enumerated glob
// list (`src/*,src/components/*,src/app/*,app/*,…`) is the workaround someone wrote instead
// of fixing this, and it still missed `src/app/(marketing)/`.
//
// Recorded, because it is the sharpest instance of a pattern this repo keeps finding: a
// vocabulary that documents its own limit does not ENFORCE it. The data files ignored this
// comment for as long as it existed.
//
// A `path_glob` may name MORE THAN ONE shape, comma-separated. This exists because of a real
// permanent false positive: `canvas-loop` globbed only `docs/ideas/*-canvas.md`, while `/canvas`
// itself tells the founder to keep a venture-level `docs/ideas/CANVAS.md` and `boss board` reads
// one. So a founder who followed the skill's own instruction had the canvas-loop reporting
// "stalled" forever — and a conscience that is permanently wrong about you is one you mute, which
// is the worst outcome this system has. Exits are AND-ed, so a second predicate could not express
// "either of these"; the glob had to.
//
// `$source` resolves to the founder's code — `sourceGlobs` in `.boss/config.json`, or
// DEFAULT_SOURCE_GLOBS below. It exists so a loop spec can say "their code" without asserting
// WHERE that lives: `src/` is a JavaScript convention, not a fact. Swift keeps `Sources/`,
// Flutter `lib/`, Go `cmd/` + `internal/`, Rails and Android `app/`.
//
// `$source` also carries the honesty half. A source glob resolving to ZERO files means BOSS is
// BLIND here — a different fact from "looked and found nothing", and the two were previously
// indistinguishable. A blind predicate never fires a moment (under-firing is the correct
// direction: a missed nudge costs nothing, a false one spends trust) and `boss conscience`
// reports it as "not evaluated here" instead of "waiting".
// ---------------------------------------------------------------------------

export const DEFAULT_SOURCE_GLOBS = ['src/**', 'app/**', 'lib/**', 'components/**', 'pages/**'];

// Never the founder's own work. Skipping these is what keeps a per-prompt hook cheap.
// `bin`/`obj` are deliberately NOT here though `detect.js` skips them: a founder may legitimately
// point `sourceGlobs` at `bin/`, and a skip-list that silently eats a configured root is the same
// class of invisible failure this whole change exists to remove.
const GLOB_SKIP_DIRS = new Set([
  '.git', 'node_modules', 'dist', 'build', 'out', 'target', 'vendor', 'coverage',
  '.next', '.nuxt', '.svelte-kit', '.venv', 'venv', '__pycache__', '.cache', '.turbo',
  'Pods', 'DerivedData', '.gradle', '.boss', '.claude',
]);

// This walk runs on EVERY UserPromptSubmit. The cap is not tidiness — it is the difference
// between a conscience and a stall. A tree big enough to hit it has already answered the question.
const GLOB_FILE_CAP = 1500;

function readSourceGlobs(projectDir) {
  try {
    const cfg = JSON.parse(readFileSync(join(projectDir, '.boss', 'config.json'), 'utf8'));
    const g = cfg.sourceGlobs;
    if (Array.isArray(g) && g.length && g.every((x) => typeof x === 'string' && x.trim())) return g;
  } catch { /* absent, or hand-edited into invalid JSON — the default is the honest fallback */ }
  return DEFAULT_SOURCE_GLOBS;
}

export const isSourceGlob = (g) => typeof g === 'string' && g.trim() === '$source';

// Project-relative glob -> anchored regex. `**` crosses `/`, a single `*` does not.
function globToRegex(rel) {
  let out = '';
  for (let i = 0; i < rel.length; i++) {
    const c = rel[i];
    if (c === '*') {
      if (rel[i + 1] === '*') { out += '.*'; i++; if (rel[i + 1] === '/') i++; }
      else out += '[^/]*';
    } else if ('.+?^${}()|[]\\'.includes(c)) { out += '\\' + c; }
    else { out += c; }
  }
  return new RegExp(`^${out}$`);
}

// FILES only. The old expander returned directory entries too, which then threw inside
// `readFileSync` and were counted in the `files:` evidence — so a project whose `src/` held
// nothing but subdirectories reported "1 file scanned, 0 matches" and looked examined.
function walkFiles(dir, out, depth = 0) {
  if (out.length >= GLOB_FILE_CAP || depth > 12) return;
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (out.length >= GLOB_FILE_CAP) return;
    if (e.isDirectory()) {
      if (GLOB_SKIP_DIRS.has(e.name)) continue;
      walkFiles(join(dir, e.name), out, depth + 1);
    } else out.push(join(dir, e.name));
  }
}

function expandGlob(pattern, projectDir) {
  if (typeof pattern !== 'string') return [];
  const dedupe = (files) => { const seen = new Set(); return files.filter((f) => (seen.has(f) ? false : seen.add(f))); };

  if (pattern.includes(',')) {
    return dedupe(pattern.split(',').flatMap((p) => expandGlob(p.trim(), projectDir)));
  }
  const rel = pattern.trim();
  if (isSourceGlob(rel)) {
    return dedupe(readSourceGlobs(projectDir).flatMap((g) => expandGlob(g, projectDir)));
  }
  if (!rel.includes('*')) {
    const full = join(projectDir, rel);
    return existsSync(full) ? [full] : [];
  }

  const segs = rel.split('/');
  const firstGlob = segs.findIndex((s) => s.includes('*'));
  const baseDir = firstGlob > 0 ? join(projectDir, segs.slice(0, firstGlob).join('/')) : projectDir;
  if (!existsSync(baseDir)) return [];

  const re = globToRegex(rel);
  const files = [];
  // Recurse when the glob spans segments; otherwise read the one directory, which is exactly
  // the old behaviour minus the directory entries.
  if (rel.includes('**') || firstGlob < segs.length - 1) {
    walkFiles(baseDir, files);
  } else {
    try {
      for (const e of readdirSync(baseDir, { withFileTypes: true })) {
        if (!e.isDirectory()) files.push(join(baseDir, e.name));
      }
    } catch { return []; }
  }
  const cut = projectDir.endsWith('/') ? projectDir.length : projectDir.length + 1;
  return files.filter((f) => re.test(f.slice(cut)));
}

function matchesGlob(filePath, pattern, projectDir) {
  return expandGlob(pattern, projectDir).includes(filePath);
}

// ---------------------------------------------------------------------------
// Predicate evaluators.
// ---------------------------------------------------------------------------

// Shared by count_at_least / count_at_most. Returns the match count, how many files were
// actually read, and whether the glob was a `$source` one that found NOTHING — the "blind"
// case, which is not the same fact as "found nothing" and must not be reported as one.
//
// Files larger than MAX_FILE_BYTES are skipped: a minified bundle or a checked-in dataset is
// not what any of these patterns are looking for, and reading one on every prompt is the stall
// the file cap exists to prevent.
const MAX_FILE_BYTES = 512 * 1024;

function countMatches({ path_glob, pattern, exclude_files_matching, not_path_glob }, projectDir) {
  let files = expandGlob(path_glob, projectDir);
  const blind = isSourceGlob(path_glob) && files.length === 0;
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
  let read = 0;
  for (const f of files) {
    try {
      if (statSync(f).size > MAX_FILE_BYTES) continue;
      count += (readFileSync(f, 'utf8').match(re) || []).length;
      read++;
    } catch { /* ignore unreadable */ }
  }
  return { count, files: read, blind };
}

const PREDICATES = {
  exists({ path }, projectDir) {
    return existsSync(join(projectDir, path));
  },

  count_at_least(args, projectDir) {
    const { count, files, blind } = countMatches(args, projectDir);
    return { ok: count >= args.min, evidence: { count, min: args.min, files, ...(blind ? { blind: true } : {}) } };
  },

  // The MIRROR of count_at_least, and the reason design-drift-loop stopped lying.
  //
  // That loop's exit predicate was `count_at_least: { pattern: '#[0-9a-f]{3,8}', min: 1 }` with a
  // paragraph explaining it was "inverted" — that finding raw hex meant STALLED. The runtime has
  // never had an inversion: `entry.all_ok && exit.all_ok` is CLOSED and closed is silent. So the
  // V1 design conscience fired `coherence` at every project with NO raw hex (the good state) and
  // went quiet on every project full of it (the 47 blues it exists to catch). Verified by running
  // it, both directions.
  //
  // The fix is this predicate rather than an `invert:` flag, because a flag would make loop state
  // conditional — "closed" would stop meaning healthy — and every reader of every other loop would
  // have to check. An exit predicate should state the HEALTHY condition. "At most zero raw hex
  // codes" is that condition, positively.
  count_at_most(args, projectDir) {
    const { count, files, blind } = countMatches(args, projectDir);
    return { ok: count <= args.max, evidence: { count, max: args.max, files, ...(blind ? { blind: true } : {}) } };
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
    const blind = isSourceGlob(path_glob) && files.length === 0;
    return {
      ok: matchedCount >= 1,
      evidence: { path_glob, matched_files: matchedCount, total_files: files.length, ...(blind ? { blind: true } : {}) },
    };
  },

  // THE ONLY TEMPORAL PREDICATE, added because its absence was structural rather than an
  // oversight. `exists`, `count_at_least` and `any_file_matches` all test CONTENT or EXISTENCE,
  // so every conscience moment BOSS could express was an ABSENCE one — "an idea exists and no
  // canvas does." Nothing could say *"evidence landed and the artifact hasn't moved since."*
  // BOSS watched for what was never made, and never for what stopped being true.
  //
  // NOT an age guess, and the distinction is load-bearing. `src/board.js` deliberately refuses to
  // infer staleness from age — "a guessed signal would add noise" — and that refusal stands. This
  // asserts a RELATIONAL fact instead: B changed after A, therefore A has not accounted for B.
  // No threshold, no opinion about how old is too old.
  //
  // Fresh-clone caveat, and it fails SAFE: a clone resets mtimes, so everything looks the same
  // age and this under-fires. Under-firing is the correct direction for a conscience — a missed
  // nudge costs nothing, a false one spends trust.
  //
  // `pattern` (optional) narrows the NEWER side to files whose content matches — the same
  // per-file test `any_file_matches` runs, and the reason this predicate can be pointed at a
  // second artifact without crying wolf. Untouched mtimes say only "a file changed"; the canvas
  // is not out of date because three specs were DRAFTED (that is building), it is out of date
  // because three of them SHIPPED. Match the base status word, never the whole string — a
  // well-formed `status: shipped (v0.3 — the pull half)` is the common case, and comparing the
  // full value is the exact bug that mis-filed 12 of 31 cards on BOSS's own board.
  outpaced_by({ path_glob, behind, min, pattern }, projectDir) {
    const mtime = (f) => { try { return statSync(f).mtimeMs; } catch { return 0; } };
    const behindFiles = expandGlob(behind, projectDir);
    // Nothing to be behind = nothing to report. An artifact that does not exist yet is an
    // ABSENCE problem, which the other predicates already own.
    if (!behindFiles.length) return { ok: false, evidence: { behind, reason: 'no artifact to fall behind' } };
    const newestBehind = Math.max(...behindFiles.map(mtime));
    let newer = expandGlob(path_glob, projectDir).filter((f) => mtime(f) > newestBehind);
    if (pattern) {
      const re = new RegExp(pattern, 'm');
      newer = newer.filter((f) => {
        try { return re.test(readFileSync(f, 'utf8')); } catch { return false; }
      });
    }
    const need = min || 1;
    return {
      ok: newer.length >= need,
      evidence: { path_glob, behind, newer: newer.length, min: need,
                  ...(pattern ? { pattern } : {}),
                  names: newer.slice(0, 4).map((f) => f.split('/').pop()) },
    };
  },

  // quiet_for: NOTHING under `path_glob` has changed in `days`. The FIFTH predicate, and the
  // first ABSOLUTE-time one — every other member of this set is a relation between two files.
  //
  // WHY IT HAD TO EXIST: `outpaced_by` is temporal but it detects PRESENCE — N files newer than
  // an artifact. The commons half of the canvas (DEC-009's second sustainability branch: what
  // keeps this alive, who else could carry it, what would make you stop) is falsified by
  // ABSENCE. A maintainer running out of road does not ship three FEATs; they go quiet. You
  // cannot express silence as a relation between two files, so the closed set could not say it.
  //
  // THE REFRAME THAT MAKES IT HUMANE AND ALSO MAKES IT WORK: the conscience is a hook, so it
  // only ever runs while the founder is HERE. It can never observe an absence in real time —
  // if they are gone, nothing is running. So this does not fire AT someone who is away. It
  // fires when they COME BACK, which is both the only observable moment and the only kind one.
  //
  // Fails SAFE in the same direction as `outpaced_by`: a fresh clone resets mtimes, so
  // everything looks new and this UNDER-fires. A missed nudge costs nothing; a false one spends
  // trust — and on this moment, more trust than any other.
  quiet_for({ path_glob, days }, projectDir) {
    const mtime = (f) => { try { return statSync(f).mtimeMs; } catch { return 0; } };
    const files = expandGlob(path_glob, projectDir);
    // No files at all is an ABSENCE problem, which `exists` already owns. Never report it here:
    // a project with no devlog has not gone quiet, it has not started.
    if (!files.length) return { ok: false, evidence: { path_glob, reason: 'nothing to have gone quiet' } };
    const newest = Math.max(...files.map(mtime));
    if (!newest) return { ok: false, evidence: { path_glob, reason: 'no readable mtime' } };
    const quietDays = Math.floor((Date.now() - newest) / 86400000);
    const need = days || 21;
    return {
      ok: quietDays >= need,
      evidence: { path_glob, quietDays, days: need },
    };
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

// `blind` is a SEPARATE axis from state, deliberately. A loop can be blind and open, blind and
// closed, or blind and unopenable — what blindness says is "at least one predicate pointed at the
// founder's code and found no code to point at", i.e. the answer is unreliable rather than known.
// Folding it into `state` would have made it a fourth state that every consumer had to learn;
// as a flag, a consumer that ignores it behaves exactly as before.
export function classifyLoop(loop, projectDir) {
  const entry = evalList(loop.entry, projectDir);
  const exit = evalList(loop.exit, projectDir);
  let state;
  if (!entry.all_ok) state = 'unopenable';
  else if (entry.all_ok && exit.all_ok) state = 'closed';
  else state = 'open';
  const blind = [...(entry.results || []), ...(exit.results || [])].some((r) => r.evidence?.blind);
  return { state, entry, exit, blind };
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

    const { state, entry, exit, blind } = classifyLoop(loop, projectDir);
    if (state !== 'open') continue;

    // A blind loop is one whose `$source` glob matched no files — BOSS is looking at the wrong
    // place for this project's code, so it has no standing to say anything about it. Staying
    // quiet is the correct direction (this file's own rule: "a missed nudge costs nothing, a
    // false one spends trust"), but silence is exactly how the old `src/**` bug hid, so the
    // state is NOT swallowed: `boss conscience` reports it as "not evaluated here" and names
    // the globs that missed.
    if (blind) continue;

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
    const log = personStatePath(projectDir, 'conscience-log.jsonl');
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
    const f = personStatePath(projectDir, join('brain', 'relationship.md'));
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
    appendFileSync(personStatePathForWrite(projectDir, 'conscience-log.jsonl'), JSON.stringify(entry) + '\n');
  } catch { /* fail silent — the ledger is overhead, never a gate */ }
}

