// `boss adopt` — reading how far along a repo already is.
//
// WHY THIS EXISTS: adopt always defaulted to Quickstart. So a half-built app with real users got
// the IDEA-CAPTURE scaffold and a CLAUDE.md whose arc is "capture → canvas → unlock MVP" — an arc
// they finished months ago. The README's answer was "add `--mode mvp` if it already has real
// users", which asks the founder to make the one judgment call they're least equipped to make,
// before BOSS has read a single file. Most people who try BOSS arrive with a repo, so this was the
// weakest path in the product wearing the strongest path's clothes.
//
// WHAT THIS DELIBERATELY IS NOT: a clever repo classifier. Deep understanding is `/comprehend`'s
// job — it has the model and the wide context. This is the cheap, legible, zero-dep half: a few
// signals a founder can check by eye, so the inference can be SHOWN ("a build manifest, 34 source
// files, tests") rather than asserted. A confident wrong guess is worse than no guess, and an
// inference you can't audit is exactly what BOSS warns founders against.
//
// CONSERVATIVE BY RULE — it caps at MVP and never auto-infers V1 or Scale. V1 is a design-system
// and db commitment, Scale is org ceremony; both are judgment calls that want a human. And because
// sync has no removal concept yet, ceremony added is ceremony that stays: over-shooting is the
// expensive direction, so the tie goes to less.

import { readdirSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

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

export function scanRepo(dir) {
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

  walk(dir, 0);
  return found;
}

// The threshold that separates "a repo with a couple of scratch files" from "a real build."
// Deliberately unfussy: the cost of being one notch low is a `boss unlock mvp` away, and the cost
// of being one notch high is ceremony that sync currently cannot remove.
const REAL_BUILD_FILES = 5;

export function suggestStage(scan) {
  const why = [];
  const realBuild = scan.manifests.length > 0 && scan.sourceFiles >= REAL_BUILD_FILES;

  if (!realBuild) {
    // Say what was missing, not just "nothing found" — the founder should be able to disagree.
    if (scan.sourceFiles === 0) why.push('no source files yet');
    else why.push(`${scan.sourceFiles} source file(s)${scan.manifests.length ? '' : ', no build manifest'}`);
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

export function detectStage(dir) {
  const scan = scanRepo(dir);
  return { ...suggestStage(scan), scan };
}
