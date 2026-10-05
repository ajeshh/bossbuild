// The commit-time secret check's on-switch (IDEA-142). The check itself ships in the template
// (`.claude/hooks/lib/commit-secrets.js`, synced like any hook lib); this writes the per-clone shim
// git actually runs. Git copies no hooks on clone, so the shim is what `boss new` and
// `boss sync --apply` lay down — and only into a slot nobody else holds:
//   - `core.hooksPath` set (husky, lefthook, a team convention) → their hooks live elsewhere; say so.
//   - a `pre-commit` already there that isn't ours → theirs; never overwritten, never chained.
// Writing the shim ourselves (mode set here) keeps it independent of whether a packaged file kept
// its executable bit, which npm and cpSync don't promise.

import { execFileSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join } from 'node:path';

export const SHIM_MARK = '# boss: commit-secrets';
const SCRIPT = '.claude/hooks/lib/commit-secrets.js';

export const SHIM = `#!/bin/sh
${SHIM_MARK} — stops a commit that would put a key into git history (written by BOSS).
s="$(git rev-parse --show-toplevel)/${SCRIPT}"
[ -f "$s" ] && command -v node >/dev/null 2>&1 || exit 0
exec node "$s"
`;

function git(dir, ...a) {
  return execFileSync('git', a, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
}

/**
 * Lay down the pre-commit shim if the slot is free. Returns { state, path }:
 * installed | current | no-script | no-git | hooks-path | theirs.
 */
export function installCommitGuard(projectDir) {
  if (!existsSync(join(projectDir, SCRIPT))) return { state: 'no-script' };
  try {
    git(projectDir, 'rev-parse', '--git-dir');
  } catch { return { state: 'no-git' }; }
  let hooksPath = '';
  try { hooksPath = git(projectDir, 'config', '--get', 'core.hooksPath'); } catch { /* unset */ }
  if (hooksPath) return { state: 'hooks-path', path: hooksPath };
  let hooksDir = git(projectDir, 'rev-parse', '--git-path', 'hooks');
  if (!isAbsolute(hooksDir)) hooksDir = join(projectDir, hooksDir);
  const path = join(hooksDir, 'pre-commit');
  if (existsSync(path)) {
    const cur = readFileSync(path, 'utf8');
    if (!cur.includes(SHIM_MARK)) return { state: 'theirs', path };
    if (cur === SHIM) return { state: 'current', path };
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, SHIM);
  chmodSync(path, 0o755);
  return { state: 'installed', path };
}
