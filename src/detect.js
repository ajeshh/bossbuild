// `boss adopt` — reading how far along a repo already is.
//
// WHY THIS EXISTS: adopt always defaulted to Quickstart. So a half-built app with real users got
// the IDEA-CAPTURE scaffold and a CLAUDE.md whose arc is "capture → canvas → unlock MVP" — an arc
// they finished months ago. The README's answer was "add `--mode mvp` if it already has real
// users", which asks the founder to make the one judgment call they're least equipped to make,
// before BOSS has read a single file. Most people who try BOSS arrive with a repo, so this was the
// weakest path in the product wearing the strongest path's clothes.
//
// WHAT THIS DELIBERATELY IS NOT: a clever repo classifier. Deep understanding is `/read-repo`'s
// job — it has the model and the wide context. This is the cheap, legible, zero-dep half: a few
// signals a founder can check by eye, so the inference can be SHOWN ("a build manifest, 34 source
// files, tests") rather than asserted. A confident wrong guess is worse than no guess, and an
// inference you can't audit is exactly what BOSS warns founders against.
//
// CONSERVATIVE BY RULE — it caps at MVP and never auto-infers V1 or Scale. V1 is a design-system
// and db commitment, Scale is org ceremony; both are judgment calls that want a human. And because
// sync has no removal concept yet, ceremony added is ceremony that stays: over-shooting is the
// expensive direction, so the tie goes to less.

import { readdirSync, existsSync, statSync, readFileSync } from 'node:fs';
import { join, extname, basename, dirname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

// Directories that are never the founder's own work. Skipping these is what keeps the walk cheap
// and stops `node_modules` from making every repo look enormous.
const SKIP_DIRS = new Set([
  '.git', 'node_modules', 'dist', 'build', 'out', 'target', 'vendor', 'coverage',
  '.next', '.nuxt', '.svelte-kit', '.venv', 'venv', '__pycache__', '.cache', '.turbo',
  'Pods', 'DerivedData', '.gradle', 'bin', 'obj', '.boss', '.claude',
]);

const SOURCE_EXT = new Set([
  '.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.py', '.go', '.rs', '.rb', '.java', '.kt',
  '.swift', '.php', '.cs', '.c', '.cc', '.cpp', '.h', '.hpp', '.m', '.mm', '.vue', '.svelte',
  '.ex', '.exs', '.scala', '.clj', '.dart', '.sql', '.sh',
]);

// A build manifest is the cheapest "someone committed to a stack" signal there is.
const MANIFESTS = [
  'package.json', 'pyproject.toml', 'requirements.txt', 'go.mod', 'Cargo.toml', 'Gemfile',
  'pom.xml', 'build.gradle', 'build.gradle.kts', 'composer.json', 'mix.exs', 'pubspec.yaml',
  'Package.swift', 'CMakeLists.txt',
];

const DEPLOY = [
  'Dockerfile', 'docker-compose.yml', 'vercel.json', 'fly.toml', 'netlify.toml', 'render.yaml',
  'railway.json', 'Procfile', 'app.yaml', 'serverless.yml', 'wrangler.toml',
];

const TEST_DIRS = new Set(['test', 'tests', 'spec', '__tests__', 'e2e']);
const isTestFile = (n) => /\.(test|spec)\.[a-z]+$/i.test(n) || /^test_.+\.py$/i.test(n);

// Walk with a hard file cap. A repo big enough to hit the cap has already told us everything the
// suggestion needs, and an unbounded walk on a monorepo is a hang the founder blames on BOSS.
const FILE_CAP = 4000;

function scanRepo(dir) {
  const found = {
    manifests: [], deploy: [], sourceFiles: 0, testFiles: 0, hasTestDir: false, hasCI: false,
    truncated: false,
  };
  let seen = 0;

  const walk = (d, depth) => {
    if (seen >= FILE_CAP || depth > 8) { found.truncated = seen >= FILE_CAP; return; }
    let entries;
    try { entries = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (seen >= FILE_CAP) { found.truncated = true; return; }
      const p = join(d, e.name);
      if (e.isDirectory()) {
        if (SKIP_DIRS.has(e.name)) continue;
        if (TEST_DIRS.has(e.name.toLowerCase())) found.hasTestDir = true;
        if (e.name === '.github') {
          try { if (existsSync(join(p, 'workflows'))) found.hasCI = true; } catch { /* ignore */ }
        }
        walk(p, depth + 1);
        continue;
      }
      seen++;
      const ext = extname(e.name).toLowerCase();
      if (SOURCE_EXT.has(ext)) {
        found.sourceFiles++;
        if (isTestFile(e.name)) found.testFiles++;
      }

    }
  };

  try { if (!statSync(dir).isDirectory()) return found; } catch { return found; }

  // Read the ROOT's own files before recursing. The signals that decide the mode — a build
  // manifest, a deploy config — all live at the root, and the walk is file-capped. In a big repo
  // the subdirectories sort first (`d0/` before `package.json`), so the cap was exhausted before
  // the root was ever read: a 5000-file monorepo with a package.json reported "no build manifest"
  // and adopted at Quickstart. That is exactly the half-built-app-gets-the-idea-capture-scaffold
  // failure v0.153.0 exists to prevent, reappearing for large repos only.
  try {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) continue;
      if (MANIFESTS.includes(e.name)) found.manifests.push(e.name);
      if (DEPLOY.includes(e.name)) found.deploy.push(e.name);
    }
  } catch { /* unreadable root — the walk below reports what it can */ }
  // A monorepo keeps its manifests a level or two down (`app/package.json`, `app/src-tauri/Cargo.toml`)
  // — read as Quickstart with "no build manifest" before (IDEA-163). Named with their folder.
  for (const pkg of packageDirs(dir)) {
    if (!pkg) continue;
    for (const m of MANIFESTS) if (existsSync(join(dir, pkg, m))) found.manifests.push(`${pkg}/${m}`);
  }

  walk(dir, 0);
  return found;
}

// Folders holding a build manifest: the root (`''`), then up to two levels down. Bounded and
// sorted, so a big tree costs a few dozen readdirs, never a walk.
export function packageDirs(dir, maxDepth = 2) {
  const out = [];
  const has = (d) => MANIFESTS.some((m) => existsSync(join(dir, d, m)));
  if (has('')) out.push('');
  const visit = (rel, depth) => {
    if (depth > maxDepth) return;
    let entries = [];
    try { entries = readdirSync(join(dir, rel), { withFileTypes: true }); } catch { return; }
    for (const e of entries.filter((x) => x.isDirectory() && !SKIP_DIRS.has(x.name) && !x.name.startsWith('.')).sort((a, b) => a.name.localeCompare(b.name))) {
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (has(r)) out.push(r);
      visit(r, depth + 1);
    }
  };
  visit('', 1);
  return out;
}

// The threshold that separates "a repo with a couple of scratch files" from "a real build."
// Deliberately unfussy: the cost of being one notch low is a `boss unlock mvp` away, and the cost
// of being one notch high is ceremony that sync currently cannot remove.
const REAL_BUILD_FILES = 5;

function suggestStage(scan) {
  const why = [];
  const realBuild = scan.manifests.length > 0 && scan.sourceFiles >= REAL_BUILD_FILES;

  if (!realBuild) {
    // Say what was missing, not just "nothing found" — the founder should be able to disagree.
    // And say what WAS found: a repo with a manifest, tests, CI and a deploy config but two source
    // files used to print only "2 source file(s)", so the founder could see neither why it stayed
    // at Quickstart nor what the bar is (IDEA-118).
    if (scan.sourceFiles === 0) why.push('no source files yet');
    else why.push(`${scan.sourceFiles} source file(s)${scan.manifests.length ? '' : ', no build manifest'} — MVP starts at ${REAL_BUILD_FILES} with a build manifest`);
    if (scan.manifests.length) why.push(scan.manifests.join(' + '));
    if (scan.testFiles || scan.hasTestDir) why.push('tests');
    if (scan.hasCI) why.push('CI');
    if (scan.deploy.length) why.push(`deploy config (${scan.deploy[0]})`);
    return { stage: 'L0-quickstart', why, beyond: false };
  }

  why.push(scan.manifests.join(' + '));
  why.push(`${scan.sourceFiles}${scan.truncated ? '+' : ''} source files`);
  if (scan.testFiles || scan.hasTestDir) why.push('tests');
  if (scan.hasCI) why.push('CI');
  if (scan.deploy.length) why.push(`deploy config (${scan.deploy[0]})`);

  // "beyond" is a REPORT, never an auto-climb. A shipped, tested, CI'd app probably wants V1 — but
  // V1 means committing to a design system and a db discipline, and BOSS does not get to decide
  // that from the presence of a Dockerfile.
  const beyond = (scan.deploy.length > 0 || scan.hasCI) && (scan.testFiles > 0 || scan.hasTestDir);
  return { stage: 'L1-mvp', why, beyond };
}

// WHERE THIS REPO KEEPS ITS CODE — the second thing adopt can read off a tree, and the one that
// decides whether the conscience can see anything at all.
//
// Five loop predicates ask about the founder's source. They used to hardcode `src/**`, which is a
// JavaScript convention and not a fact: Swift keeps `Sources/`, Flutter `lib/`, Go `cmd/`, Rails
// and Android `app/`. A repo laid out any other way had every code-reading loop classify
// `unopenable` — a state that emits nothing, so a blind conscience was indistinguishable from a
// calm one. The runtime now REPORTS that blindness; this makes it rare instead of routine.
//
// Same rule as `suggestStage`: cheap, legible, and SHOWN rather than asserted. It reports the
// directories that exist, so a founder can read the answer off their own tree and disagree. It
// never invents a root, and returns null when it recognises nothing — the default (plus the
// blindness report) is the honest outcome then, not a guess.
const SOURCE_ROOTS = [
  'src', 'app', 'lib', 'components', 'pages',   // JS/TS, Rails, Flutter/Elixir, Android (app/src/main)
  'Sources',                                     // Swift Package Manager
  'cmd', 'internal', 'pkg',                      // Go
];

export function inferSourceGlobs(dir) {
  const isDir = (p) => { try { return statSync(join(dir, p)).isDirectory(); } catch { return false; } };
  const found = SOURCE_ROOTS.filter(isDir);
  // A monorepo's code sits inside its packages (`app/src`, `app/src-tauri/src`): look there too, so
  // the conscience isn't left saying it could not look at a repo that has code (IDEA-163).
  for (const pkg of packageDirs(dir)) {
    if (!pkg) continue;
    for (const r of SOURCE_ROOTS) if (isDir(`${pkg}/${r}`)) found.push(`${pkg}/${r}`);
  }
  // A root already covered by another (`app/src` under `app`) adds nothing.
  const roots = [...new Set(found)].filter((r, _, all) => !all.some((o) => o !== r && r.startsWith(`${o}/`)));
  return roots.length ? roots.map((r) => `${r}/**`) : null;
}

export function detectStage(dir) {
  const scan = scanRepo(dir);
  return { ...suggestStage(scan), scan };
}

// Records this repo already keeps where BOSS won't read them (IDEA-163). The board and the
// session hooks look for each kind as a flat `<ID>-*.md` in one folder; a repo that keeps
// `docs/features/FEAT-001-login/README.md` has a FEAT in build that BOSS reports as nothing in
// flight. Adopt can't fix that by moving their files, so the preview says it out loud. Returns
// [{ pattern, count }], grouped by where they live, so the line reads as a layout, not a file list.
const RECORD_HOME = { IDEA: 'docs/ideas', FEAT: ['docs/ideas', 'docs/features'], PROG: 'docs/programs', DEC: 'docs/decisions', EVID: 'docs/evidence', PRAC: 'docs/practices' };
const RECORD_NAME = /^(IDEA|FEAT|PROG|DEC|EVID|PRAC)-\d+/i;

// A file is a record when its frontmatter says so — a design review named after a FEAT is not one,
// and neither is a RESUME named after the idea it resumes (`IDEA-009-RESUME.md`, `type: resume`).
const isRecord = (file, kind) => {
  try {
    const head = readFileSync(file, 'utf8').slice(0, 2000);
    const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(head);
    if (!fm) return false;
    if (/^type:\s*["']?(resume|handoff|reference)\b/im.test(fm[1])) return false;
    return new RegExp(`^id:\\s*["']?${kind}-\\d+`, 'im').test(fm[1]);
  } catch { return false; }
};

// Only `docs/` at the root: that is where a repo keeps its records, and a nested project
// (a demo, an example app) has its own.
export function unreadRecords(dir, maxDepth = 4) {
  const groups = new Map();
  const add = (pattern) => groups.set(pattern, (groups.get(pattern) || 0) + 1);
  const walk = (abs, rel, depth) => {
    let entries = [];
    try { entries = readdirSync(abs, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const m = RECORD_NAME.exec(e.name);
      const kind = m && m[1].toUpperCase();
      if (e.isDirectory()) {
        if (SKIP_DIRS.has(e.name)) continue;
        // A folder per record: its README (or index) is the record.
        const f = kind && ['README.md', 'index.md'].find((n) => isRecord(join(abs, e.name, n), kind));
        if (f) { if (![].concat(RECORD_HOME[kind]).includes(rel)) add(`${rel}/${kind}-*/${f}`); continue; }
        if (depth < maxDepth) walk(join(abs, e.name), `${rel}/${e.name}`, depth + 1);
      } else if (kind && e.name.endsWith('.md') && ![].concat(RECORD_HOME[kind]).includes(rel) && isRecord(join(abs, e.name), kind)) {
        add(`${rel}/${kind}-*.md`);
      }
    }
  };
  walk(join(dir, 'docs'), 'docs', 0);
  return [...groups].map(([pattern, count]) => ({ pattern, count, dir: pattern.replace(/\/[A-Z]+-\*.*$/, '') }));
}

// What to call the project. The folder name was wrong in a worktree (`dhun-boss` baked into every
// template and the registry, IDEA-163): the git remote's repo name first, then the main checkout's
// folder (the common git dir's parent), then this folder. `package.json` never — a monorepo has none
// at the root, or several. `remote` is the origin URL when there is one (PROG-006 reads it to ask
// whether the repo is the user's).
export function projectName(dir) {
  const run = (...a) => execFileSync('git', a, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  try {
    const url = run('remote', 'get-url', 'origin');
    const m = /([^/:]+?)(?:\.git)?\/?$/.exec(url);
    if (m && m[1]) return { name: m[1], from: 'the git remote', remote: url };
  } catch { /* no remote */ }
  try {
    const common = resolve(dir, run('rev-parse', '--git-common-dir'));
    if (basename(common) === '.git') {
      const main = basename(dirname(common));
      if (main && main !== basename(dir)) return { name: main, from: 'the main checkout, not this worktree' };
    }
  } catch { /* not a git repo */ }
  return { name: basename(dir), from: 'this folder' };
}
