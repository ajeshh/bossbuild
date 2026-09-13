// gitdates — every "when did this appear / when was it last touched" question in one pass.
//
// `boss status` on BOSS's own tree spawned 378 git processes — one `git log -1 -- <path>` per
// record, twice (the board is collected once for focus and once for readiness), linear in the
// number of records. A founder with three ideas never felt it; the project that built it waited
// 2.4 seconds for its own re-entry read. The substrate was never the problem — markdown + git is
// still the right one, portable and lock-in free — the N+1 was.
//
// So: two spawns per project per process, whatever the record count. `git log --name-only`
// newest-first, read once into two maps. The lookups keep the exact semantics the per-path calls
// had: `-1` on a newest-first log is "the most recent commit that matches", so the first time a
// path appears while walking the log is the answer. A directory matches the way a pathspec did —
// anything under it — so `proof: docs/design` still dates from the newest file beneath it. Prose
// in a `proof:` field matches nothing, exactly as `git log -- "<a paragraph>"` matched nothing.
//
// Fails open like the calls it replaces: not a checkout, no git, or nothing committed → null, and
// the renderers say "no date" rather than inventing one. Programming errors are NOT swallowed —
// a missing import once turned every derived date into null with no symptom but an empty strip.

import { execFileSync } from 'node:child_process';

// projectDir → { added: Map, touched: Map } | null. Per-process: a CLI run collects the board a
// few times and the answer cannot change underneath it.
const cache = new Map();

function readLog(projectDir, extraArgs) {
  const out = execFileSync('git', ['log', '--name-only', '--format=%x00%as', ...extraArgs],
    { cwd: projectDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 256 * 1024 * 1024 });
  const dates = new Map();
  let current = null;
  for (const line of out.split('\n')) {
    if (line.startsWith('\0')) { current = line.slice(1).trim() || null; continue; }
    const path = line.trim();
    if (!path || !current) continue;
    if (!dates.has(path)) dates.set(path, current); // newest-first: first sighting wins
  }
  return dates;
}

/** The two maps for a project, or null when git cannot answer. Never throws on a missing repo. */
export function gitDates(projectDir) {
  if (cache.has(projectDir)) return cache.get(projectDir);
  let result = null;
  try {
    result = {
      added: readLog(projectDir, ['--diff-filter=A']),
      touched: readLog(projectDir, []),
    };
  } catch (e) {
    // Expected: not a git checkout, git not installed, no commits yet. NOT expected: a
    // ReferenceError or TypeError — that is the code being wrong, and it must surface.
    if (e instanceof ReferenceError || e instanceof TypeError) throw e;
    result = null;
  }
  cache.set(projectDir, result);
  return result;
}

/** Drop the memo — tests build repos, commit, and ask again. */
export function forgetGitDates(projectDir) {
  if (projectDir === undefined) cache.clear(); else cache.delete(projectDir);
}

// A path or a directory. Exact match first; otherwise the newest date of anything beneath it.
function lookup(map, path) {
  if (!map || !path || path === 'none') return null;
  const p = String(path).trim().replace(/\\/g, '/').replace(/\/+$/, '');
  if (!p) return null;
  if (map.has(p)) return map.get(p);
  const prefix = p + '/';
  let newest = null;
  for (const [k, d] of map) {
    if (k.startsWith(prefix) && (newest === null || d > newest)) newest = d;
  }
  return newest;
}

/** When the path (or anything under it) was most recently ADDED — "when did this appear". */
export function firstAdded(projectDir, path) {
  const d = gitDates(projectDir);
  return d ? lookup(d.added, path) : null;
}

/** When the path (or anything under it) was last CHANGED — "untouched since". */
export function lastTouched(projectDir, path) {
  const d = gitDates(projectDir);
  return d ? lookup(d.touched, path) : null;
}
