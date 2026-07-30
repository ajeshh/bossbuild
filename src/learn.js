import {
  cpSync, readFileSync, writeFileSync, existsSync, mkdirSync, statSync,
} from 'node:fs';
import { join, basename, resolve } from 'node:path';
import { BOSS_ROOT } from './paths.js';
import { listProjects } from './registry.js';

// The library/ subfolders a pattern can be routed UP into.
export const LIBRARY_CATEGORIES = ['agents', 'skills', 'hooks', 'practices', 'memory-seed'];

// `boss learn` writes into the BOSS SOURCE repo (mutable git checkout), not the
// installed package. When `boss` runs from a global symlink, BOSS_ROOT is the
// read-only npm copy — so we locate the dev checkout instead, in order:
//   1. $BOSS_SRC (explicit override)
//   2. the self-hosted project in the registry (BOSS dogfoods itself)
//   3. BOSS_ROOT, if we're running straight from a source checkout (.git + library/)
function looksLikeSource(dir) {
  return !!dir && existsSync(join(dir, 'VERSION')) && existsSync(join(dir, 'library'));
}

// Returns { root, how } so the caller can SAY which checkout it picked before writing to
// it. `boss learn` bumps a VERSION, rewrites a package.json and prepends to a CHANGELOG —
// in a repo that is usually NOT the one you're standing in. Resolving that by name-matching
// the registry and then writing silently is the surprise REVIEW-2026-07-28 §D4 flagged: a
// founder who happens to name a project "boss" would get their own repo version-bumped.
// The `selfHosted` flag is preferred over the name regex for exactly that reason.
export function resolveBossSource() {
  if (process.env.BOSS_SRC && looksLikeSource(process.env.BOSS_SRC)) {
    return { root: process.env.BOSS_SRC, how: '$BOSS_SRC' };
  }
  const flagged = listProjects().find((p) => p.selfHosted);
  if (flagged && looksLikeSource(flagged.path)) return { root: flagged.path, how: 'registry (selfHosted)' };
  const named = listProjects().find((p) => /^(boss|bossbuild|blueprintos)$/i.test(p.name || ''));
  if (named && looksLikeSource(named.path)) return { root: named.path, how: `registry (name '${named.name}')` };
  if (existsSync(join(BOSS_ROOT, '.git')) && looksLikeSource(BOSS_ROOT)) {
    return { root: BOSS_ROOT, how: 'running from a source checkout' };
  }
  return { root: null, how: null };
}

export function bossSourceRoot() {
  return resolveBossSource().root;
}

function bump(version, kind) {
  const [x, y, z] = version.trim().split('.').map((n) => parseInt(n, 10));
  if (kind === 'major') return `${x + 1}.0.0`;
  if (kind === 'patch') return `${x}.${y}.${z + 1}`;
  return `${x}.${y + 1}.0`; // minor (default)
}

function prependChangelog(file, version, date, lines) {
  const body = readFileSync(file, 'utf8');
  const entry = `## ${version} — ${date}\n\n${lines.map((l) => `- ${l}`).join('\n')}\n\n`;
  const at = body.indexOf('\n## ');
  if (at < 0) return writeFileSync(file, body.trimEnd() + '\n\n' + entry);
  // Insert just before the first existing version heading.
  writeFileSync(file, body.slice(0, at + 1) + entry + body.slice(at + 1));
}

// Route a proven pattern UP into the BOSS library + record the version bump.
// Returns a result object; throws Error (with a usage-friendly message) on misuse.
export function learn({ srcPath, category, note, versionKind = 'minor', explicitVersion, confirmed = false }) {
  if (!srcPath) throw new Error('usage: boss learn <path> --as <category> [--note "..."]');
  if (!LIBRARY_CATEGORIES.includes(category)) {
    throw new Error(`--as must be one of: ${LIBRARY_CATEGORIES.join(', ')}`);
  }
  const abs = resolve(process.cwd(), srcPath);
  if (!existsSync(abs)) throw new Error(`source not found: ${srcPath}`);

  const { root, how } = resolveBossSource();
  if (!root) {
    throw new Error(
      'cannot locate the BOSS source repo. Set BOSS_SRC=/path/to/bossbuild, or run from the checkout.',
    );
  }
  // Writing into another repo is not something to discover afterwards from a git diff.
  // Name the target and require a confirmation, unless the caller already got one.
  if (!confirmed && root !== process.cwd()) {
    const e = new Error(
      `this writes into a DIFFERENT repo:\n      ${root}\n      (resolved via ${how})\n`
      + '      It will copy the pattern in, bump that repo\'s VERSION + package.json, and\n'
      + '      prepend to its CHANGELOG. Re-run with --yes to confirm, or set BOSS_SRC to\n'
      + '      point somewhere else.',
    );
    e.needsConfirm = true;
    throw e;
  }

  // Place it in library/<category>/<basename> (file or directory).
  const destDir = join(root, 'library', category);
  mkdirSync(destDir, { recursive: true });
  const name = basename(abs);
  const dest = join(destDir, name);
  cpSync(abs, dest, { recursive: statSync(abs).isDirectory() });

  // Bump VERSION + keep package.json in sync.
  const versionFile = join(root, 'VERSION');
  const prev = readFileSync(versionFile, 'utf8').trim();
  const next = explicitVersion || bump(prev, versionKind);
  writeFileSync(versionFile, next + '\n');

  const pkgFile = join(root, 'package.json');
  if (existsSync(pkgFile)) {
    const pkg = JSON.parse(readFileSync(pkgFile, 'utf8'));
    pkg.version = next;
    writeFileSync(pkgFile, JSON.stringify(pkg, null, 2) + '\n');
  }

  // Record it in the CHANGELOG (what /boss-sync reads to tell projects what's new).
  const date = new Date().toISOString().slice(0, 10);
  const relDest = join('library', category, name);
  const lines = [`Learned \`${name}\` into \`${relDest}\`.${note ? ' ' + note : ''}`];
  const changelog = join(root, 'registry', 'CHANGELOG.md');
  if (existsSync(changelog)) prependChangelog(changelog, next, date, lines);

  return { root, how, dest: relDest, prev, next, category, name };
}
