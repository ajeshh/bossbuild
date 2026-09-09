import {
  cpSync, readFileSync, writeFileSync, existsSync, mkdirSync, statSync,
} from 'node:fs';
import { join, basename, resolve } from 'node:path';
import { BOSS_ROOT, isBossRepo, resolveStageId } from './paths.js';
import { listProjects } from './registry.js';

// TWO destinations, and the difference is not cosmetic.
//
// SHELF categories land in `library/` — BOSS's own knowledge, one copy, with a real reader:
// `boss craft` resolves `library/practices/` out of the installed package.
//
// SHIPPED classes land in a STAGE TEMPLATE, because that is the only place an agent, a skill or
// a hook becomes something a founder actually gets. `applyStage()` and `managedFiles()` read
// `stages/<id>/template/` and nothing else.
//
// They used to share one destination. `library/agents|skills|hooks` was a landing zone that
// nothing read and nothing deployed from, so anything routed UP had to be hand-copied into a
// template afterwards to ship — and then the two copies drifted. By v0.245.0 four of the eight
// artifacts with a twin had, every one of them stale on the library side, two of them still
// carrying defects already fixed on the shipped copy. The mechanism was never used either: in
// 245 releases the CHANGELOG records not one `boss learn` promotion. Removed in v0.246.0
// (IDEA-038) — the shelf holds what BOSS knows, the stages hold what BOSS ships.
// `memory-seed` was the fifth category and is gone as of v0.249.0. Its premise — seed memories every
// new project starts with — was a mechanism for a decision that had already been answered NO:
// IDEA-080/DEC-015 settled at v0.245.0 that durable memory is machine-local and
// person-scoped, `autoMemoryDirectory` stays unset, and BOSS does not manage anyone's memory store.
// The shelf outlived its own premise by four releases. The durable-vs-working cut it held — the one
// genuinely good thing on it — moved into `library/practices/context-discipline.md`, which ships.
export const SHELF_CATEGORIES = ['practices'];
export const SHIPPED_CLASSES = ['agents', 'skills', 'hooks'];
export const LEARN_CATEGORIES = [...SHIPPED_CLASSES, ...SHELF_CATEGORIES];

// Which manifest array claims each class. A new hook goes to `optionalHooks` on purpose:
// registering a hook that fires for every founder is a decision (v0.244.0 argued it for a
// single SessionStart), and `boss learn` must not make it silently.
const MANIFEST_KEY = { agents: 'agents', skills: 'skills', hooks: 'optionalHooks' };

// `boss learn` writes into the BOSS SOURCE repo (mutable git checkout), not the
// installed package. When `boss` runs from a global symlink, BOSS_ROOT is the
// read-only npm copy — so we locate the dev checkout instead, in order:
//   1. $BOSS_SRC (explicit override)
//   2. the self-hosted project in the registry (BOSS dogfoods itself)
//   3. BOSS_ROOT, if we're running straight from a source checkout (.git + library/)
// One predicate, shared with `boss remove`'s self-hosted guard — a second local copy of
// "is this BOSS's repo?" is exactly the divergence this repo keeps catching. It is stricter
// than the two-signal version it replaces (VERSION + library/), which only narrows what
// `boss learn` will write into.

// Returns { root, how } so the caller can SAY which checkout it picked before writing to
// it. `boss learn` bumps a VERSION, rewrites a package.json and prepends to a CHANGELOG —
// in a repo that is usually NOT the one you're standing in. Resolving that by name-matching
// the registry and then writing silently is the surprise REVIEW-2026-07-28 §D4 flagged: a
// founder who happens to name a project "boss" would get their own repo version-bumped.
// The `selfHosted` flag is preferred over the name regex for exactly that reason.
export function resolveBossSource() {
  if (process.env.BOSS_SRC && isBossRepo(process.env.BOSS_SRC)) {
    return { root: process.env.BOSS_SRC, how: '$BOSS_SRC' };
  }
  const flagged = listProjects().find((p) => p.selfHosted);
  if (flagged && isBossRepo(flagged.path)) return { root: flagged.path, how: 'registry (selfHosted)' };
  const named = listProjects().find((p) => /^(boss|bossbuild|blueprintos)$/i.test(p.name || ''));
  if (named && isBossRepo(named.path)) return { root: named.path, how: `registry (name '${named.name}')` };
  if (existsSync(join(BOSS_ROOT, '.git')) && isBossRepo(BOSS_ROOT)) {
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
export function learn({
  srcPath, category, mode, note, versionKind = 'minor', explicitVersion, confirmed = false,
}) {
  if (!srcPath) throw new Error('usage: boss learn <path> --as <category> [--mode <mode>] [--note "..."]');
  if (!LEARN_CATEGORIES.includes(category)) {
    throw new Error(`--as must be one of: ${LEARN_CATEGORIES.join(', ')}`);
  }
  const shipped = SHIPPED_CLASSES.includes(category);
  // An agent, skill or hook only exists for a founder at a RUNG, so BOSS has to be told which.
  // There is no neutral place to put one: the mode is the thing that decides who ever sees it.
  let stageId;
  if (shipped) {
    stageId = resolveStageId(mode);
    if (!stageId) {
      throw new Error(
        `--as ${category} also needs --mode <quickstart|mvp|v1|scale>.\n`
        + `      A promoted ${category.replace(/s$/, '')} ships to a founder at one rung, and the rung is what\n`
        + '      decides who ever gets it. Shelf categories '
        + `(${SHELF_CATEGORIES.join(', ')}) take no --mode.`,
      );
    }
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

  // Place it where its class is actually read from.
  const relDir = shipped
    ? join('stages', stageId, 'template', '.claude', category)
    : join('library', category);
  const destDir = join(root, relDir);
  mkdirSync(destDir, { recursive: true });
  const name = basename(abs);
  const dest = join(destDir, name);
  cpSync(abs, dest, { recursive: statSync(abs).isDirectory() });

  // A file the manifest does not claim NEVER SYNCS — `managedFiles()` iterates the manifest, so
  // an unregistered artifact silently rots in every existing project, and `check:manifests` says
  // so by name. Copying without registering would move the dead drop rather than close it, so
  // this step is what makes "routed UP" mean "shipped" instead of "on disk".
  let registered = null;
  if (shipped) {
    const key = MANIFEST_KEY[category];
    const entry = category === 'skills' ? name : name.replace(/\.(md|js|sh)$/, '');
    const manifestFile = join(root, 'stages', stageId, 'manifest.json');
    const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
    const arr = manifest[key] || (manifest[key] = []);
    // Guarded because concurrent sessions converging on one plan produce DUPLICATES, not
    // conflicts, and a duplicate passes most gates — v0.189.0 shipped one when two sessions
    // both appended `designer` to the same array.
    if (arr.includes(entry)) {
      registered = { key, entry, added: false };
    } else {
      arr.push(entry);
      writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
      registered = { key, entry, added: true };
    }
  }

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
  const relDest = join(relDir, name);
  const where = registered
    ? ` Registered as \`${registered.key}\` in the ${stageId} manifest, so it syncs.`
    : '';
  const lines = [`Learned \`${name}\` into \`${relDest}\`.${where}${note ? ' ' + note : ''}`];
  const changelog = join(root, 'registry', 'CHANGELOG.md');
  if (existsSync(changelog)) prependChangelog(changelog, next, date, lines);

  return { root, how, dest: relDest, prev, next, category, name, stageId, registered };
}
