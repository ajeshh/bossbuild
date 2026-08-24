import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';

// BOSS install root — resolves correctly even when `boss` is globally linked,
// because import.meta.url points at the real file in src/. This is the PACKAGE
// (immutable, what gets published). Never write into it at runtime.
export const BOSS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export const STAGES_DIR = join(BOSS_ROOT, 'stages');

// The practice shelf ships INSIDE the package (`files` in package.json), so it is on
// every founder's disk — just not at a path anything in their project could name. That
// is what `boss craft` exists to bridge: 25 shipped agents/skills/hooks pointed at
// `library/practices/*` from projects that have no `library/` (v0.147.0).
export const PRACTICES_DIR = join(BOSS_ROOT, 'library', 'practices');

// Mutable, machine-local state lives in the user's home — NOT in the package.
// This keeps the published package immutable and keeps a user's project list
// (with absolute paths) out of the repo.
export const BOSS_HOME = join(homedir(), '.boss');
export const REGISTRY_FILE = join(BOSS_HOME, 'registry.json');

// Is this directory BOSS's OWN source checkout — the repo that SHIPS BOSS, rather than a
// project BOSS was installed into? Derived from the filesystem on purpose.
//
// The obvious basis is the `selfHosted` flag, and it is the wrong one: that flag lives in
// `~/.boss/registry.json`, which is MACHINE-LOCAL, keyed by absolute path, and written only
// when this machine registered the checkout. A fresh clone on another machine has no entry,
// so a guard resting on it would silently not fire — a check that states an intent it cannot
// enforce. (`docs/RESUME.md` records the flag as living in `.boss/manifest.json`; it does
// not, and never has.)
//
// These four paths are the package's own `files` list in package.json, so they are present in
// a source checkout and in the published package alike — and no project BOSS scaffolds has
// any of them.
const BOSS_REPO_SIGNATURE = ['VERSION', 'library', 'stages', 'PRINCIPLES.md'];

export function isBossRepo(dir) {
  return !!dir && BOSS_REPO_SIGNATURE.every((rel) => existsSync(join(dir, rel)));
}

export function bossVersion() {
  return readFileSync(join(BOSS_ROOT, 'VERSION'), 'utf8').trim();
}

// Stage order — index = maturity level. Used to validate `unlock` jumps.
// Each stage is a "mode" in the user's vocabulary: Quickstart → MVP → V1 → Scale.
export const STAGE_ORDER = ['L0-quickstart', 'L1-mvp', 'L2-v1', 'L3-scale'];

// Resolve a user-typed layer to a canonical stage id.
// Accepts the full id ('L1-mvp'), the level ('L1'), or the mode name ('mvp').
export function resolveStageId(input) {
  if (!input) return undefined;
  const q = input.toLowerCase();
  return STAGE_ORDER.find((s) => {
    const sl = s.toLowerCase();
    return sl === q || sl.startsWith(q + '-') || sl.replace(/^l\d+-/, '') === q;
  });
}
